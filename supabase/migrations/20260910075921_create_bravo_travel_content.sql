/*
# Create Bravo Travel content management tables

1. New Tables
- `site_settings` stores the single public contact and business settings record.
- `destinations` stores public luxury destination cards and their highlights.
- `special_offers` stores public promotional offers managed from the admin panel.
- `booking_requests` stores lead form submissions for operator follow-up.

2. Security
- Row-level security is enabled on all tables.
- Public visitors can read published settings, destinations, and offers.
- Public visitors can submit booking requests but cannot read or modify submissions.
- Admin writes are intentionally reserved for a future authenticated admin session; no public write policies are created for content tables.

3. Important Notes
- The initial settings row is inserted with the requested Monday–Saturday hours.
- No existing data is removed or changed.
*/

CREATE TABLE IF NOT EXISTS public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name text NOT NULL DEFAULT 'Bravo Travel',
  phone text NOT NULL DEFAULT '+998 71 200 15 15',
  whatsapp text NOT NULL DEFAULT '+998 90 123 45 67',
  email text NOT NULL DEFAULT 'hello@bravotravel.uz',
  address text NOT NULL DEFAULT 'Amir Temur ko‘chasi 108, Toshkent, O‘zbekiston',
  working_hours text NOT NULL DEFAULT 'Dushanba — Shanba | 09:00 — 19:00',
  concierge_hours text NOT NULL DEFAULT '24/7 VIP Concierge',
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.destinations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  country text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  tags text[] NOT NULL DEFAULT '{}',
  sort_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.special_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  badge text NOT NULL DEFAULT 'Maxsus taklif',
  cta_label text NOT NULL DEFAULT 'Batafsil',
  image_url text,
  is_published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.booking_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  phone text NOT NULL,
  destination text,
  special_requests text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.special_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_site_settings" ON public.site_settings;
CREATE POLICY "public_read_site_settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "public_read_destinations" ON public.destinations;
CREATE POLICY "public_read_destinations" ON public.destinations FOR SELECT TO anon, authenticated USING (is_published = true);
DROP POLICY IF EXISTS "public_read_special_offers" ON public.special_offers;
CREATE POLICY "public_read_special_offers" ON public.special_offers FOR SELECT TO anon, authenticated USING (is_published = true);
DROP POLICY IF EXISTS "public_submit_booking_requests" ON public.booking_requests;
CREATE POLICY "public_submit_booking_requests" ON public.booking_requests FOR INSERT TO anon, authenticated WITH CHECK (char_length(full_name) BETWEEN 2 AND 120 AND char_length(phone) BETWEEN 7 AND 40);

INSERT INTO public.site_settings (business_name)
SELECT 'Bravo Travel'
WHERE NOT EXISTS (SELECT 1 FROM public.site_settings);

INSERT INTO public.destinations (title, country, description, image_url, tags, sort_order)
SELECT * FROM (VALUES
  ('Maldiv orollari', 'Hind okeani', 'Moviy lagunalar, suv ustidagi villalar va faqat siz uchun yaratilgan sokinlik.', 'https://images.pexels.com/photos/9482125/pexels-photo-9482125.jpeg?auto=compress&cs=tinysrgb&w=1200', ARRAY['5* Resort','Private Transfer','Yacht Charter']::text[], 1),
  ('Côte d’Azur', 'Fransiya', 'Monako shukuhi va Sent-Tropez quyoshi bag‘rida O‘rta yer dengizi hikoyasi.', 'https://images.pexels.com/photos/30438481/pexels-photo-30438481.jpeg?auto=compress&cs=tinysrgb&w=1200', ARRAY['Boutique Hotel','Concierge','Private Jet']::text[], 2),
  ('Bali', 'Indoneziya', 'Tropik tabiat, shaxsiy villa va ruhni yangilaydigan mukammal muvozanat.', 'https://images.pexels.com/photos/36418268/pexels-photo-36418268.jpeg?auto=compress&cs=tinysrgb&w=1200', ARRAY['Villa','Spa Retreat','Local Guide']::text[], 3),
  ('Swiss Alps', 'Shveytsariya', 'Qorli cho‘qqilar, chang‘i yo‘laklari va Alp tog‘laridagi nafis chaletlar.', 'https://images.pexels.com/photos/10388824/pexels-photo-10388824.jpeg?auto=compress&cs=tinysrgb&w=1200', ARRAY['Ski Chalet','Heli Transfer','Butler Service']::text[], 4)
) AS seed(title, country, description, image_url, tags, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM public.destinations);
