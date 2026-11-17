import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
);

type Lead = {
  phone: string;
  destination: string | null;
  departureDate: string | null;
  adults: number;
  children: number;
  createdAt: string;
};

type Secret = { key: string; value: string };

type ResponsePayload = {
  status?: string;
  telegram?: string;
  error?: string;
};

function responseBody(body: ResponsePayload, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function parseLead(value: unknown): Lead | null {
  if (!value || typeof value !== "object") return null;

  const body = value as Record<string, unknown>;
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const destination = typeof body.destination === "string" && body.destination.trim() ? body.destination.trim() : null;
  const departureDate = typeof body.departureDate === "string" && body.departureDate.trim() ? body.departureDate.trim() : null;
  const adults = typeof body.adults === "number" ? body.adults : NaN;
  const children = typeof body.children === "number" ? body.children : NaN;

  if (phone.length < 7 || phone.length > 40) return null;
  if (destination && destination.length > 200) return null;
  if (departureDate && !/^\d{4}-\d{2}-\d{2}$/.test(departureDate)) return null;
  if (!Number.isInteger(adults) || adults < 0 || adults > 10) return null;
  if (!Number.isInteger(children) || children < 0 || children > 10) return null;

  return { phone, destination, departureDate, adults, children, createdAt: new Date().toISOString() };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return responseBody({ error: "Faqat POST so‘rovi qabul qilinadi." }, 405);
  }

  try {
    const lead = parseLead(await req.json());
    if (!lead) {
      return responseBody({ error: "Zayavka ma’lumotlari noto‘g‘ri." }, 400);
    }

    const { data: secrets, error: secretsError } = await supabaseAdmin
      .from("integration_secrets")
      .select("key, value")
      .in("key", ["telegram_bot_token", "telegram_chat_id"]);

    if (secretsError) {
      console.error("Telegram settings lookup failed", secretsError);
      return responseBody({ error: "Telegram sozlamalari topilmadi." }, 500);
    }

    const secretMap = new Map((secrets as Secret[] | null)?.map((secret) => [secret.key, secret.value]));
    const botToken = secretMap.get("telegram_bot_token");
    const chatId = secretMap.get("telegram_chat_id");

    if (!botToken || !chatId) {
      return responseBody({ error: "Telegram qabul qiluvchi sozlanmagan." }, 500);
    }

    const guestSummary = `${lead.adults} nafar katta${lead.children > 0 ? `, ${lead.children} nafar bola` : ""}`;
    const receivedAt = new Intl.DateTimeFormat("uz-UZ", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Tashkent",
    }).format(new Date(lead.createdAt));
    const message = [
      "YANGI SAYOHAT ZAYAVKASI",
      "-------------------------",
      `Telefon: ${lead.phone}`,
      `Yo‘nalish: ${lead.destination ?? "Ko‘rsatilmagan"}`,
      `Ketish sanasi: ${lead.departureDate ?? "Ko‘rsatilmagan"}`,
      `Mehmonlar soni: ${guestSummary}`,
      `Qabul qilingan vaqt: ${receivedAt}`,
      "",
      "Bravo Sayohat",
    ].join("\n");

    const telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message, disable_web_page_preview: true }),
    });
    const telegramResult = await telegramResponse.json() as { ok?: boolean };

    if (!telegramResponse.ok || !telegramResult.ok) {
      console.error("Telegram notification failed", telegramResult);
      return responseBody({ status: "saved", telegram: "failed" });
    }

    return responseBody({ status: "sent", telegram: "sent" });
  } catch (error) {
    console.error("Telegram notification request failed", error);
    return responseBody({ error: "Telegram xabari yuborilmadi." }, 500);
  }
});
