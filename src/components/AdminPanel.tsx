import { useCallback, useEffect, useState } from 'react';
import {
  ArrowLeft,
  Check,
  Clock,
  MapPin,
  Phone,
  Mail,
  CalendarDays,
  Users,
  Plus,
  Pencil,
  Trash2,
  X,
  Star,
  Tag,
  Inbox,
  Save,
  LogOut,
} from 'lucide-react';
import { supabase, type Destination, type SpecialOffer, type SiteSettings, type BookingRequest } from '@/lib/supabase';

type Tab = 'settings' | 'destinations' | 'offers' | 'bookings';

export function AdminPanel({ onExit }: { onExit: () => void }) {
  const [tab, setTab] = useState<Tab>('settings');
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [offers, setOffers] = useState<SpecialOffer[]>([]);
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [editingDest, setEditingDest] = useState<Destination | null>(null);
  const [editingOffer, setEditingOffer] = useState<SpecialOffer | null>(null);
  const [showDestForm, setShowDestForm] = useState(false);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(async () => {
    const [s, d, o, b] = await Promise.all([
      supabase.from('site_settings').select('*').maybeSingle(),
      supabase.from('destinations').select('*').order('sort_order'),
      supabase.from('special_offers').select('*').order('sort_order'),
      supabase.from('booking_requests').select('*').order('created_at', { ascending: false }),
    ]);
    if (s.data) setSettings(s.data);
    if (d.data) setDestinations(d.data);
    if (o.data) setOffers(o.data);
    if (b.data) setBookings(b.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onExit();
  };

  const tabs: { id: Tab; label: string; icon: typeof Star }[] = [
    { id: 'settings', label: 'Aloqa ma’lumotlari', icon: Phone },
    { id: 'destinations', label: 'Yo‘nalishlar', icon: MapPin },
    { id: 'offers', label: 'Maxsus takliflar', icon: Tag },
    { id: 'bookings', label: 'Zayavkalar', icon: Inbox },
  ];

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-[#f8f7f3] text-[#10263b]/50">Yuklanmoqda...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f8f7f3] text-[#10263b]">
      <header className="sticky top-0 z-30 border-b border-[#10263b]/10 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1300px] items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-2xl">Bravo Sayohat <span className="text-[#9d7730]">Admin</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onExit} className="flex items-center gap-2 text-sm text-[#10263b]/60 transition hover:text-[#10263b]">
              <ArrowLeft size={16} /> Saytga qaytish
            </button>
            <button onClick={handleSignOut} className="flex items-center gap-2 rounded-full border border-[#10263b]/15 px-4 py-2 text-sm text-[#10263b]/70 transition hover:border-red-300 hover:text-red-600">
              <LogOut size={16} /> Chiqish
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1300px] gap-8 px-6 py-8">
        <nav className="w-56 shrink-0">
          <ul className="space-y-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <li key={id}>
                <button
                  onClick={() => setTab(id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    tab === id ? 'bg-[#10263b] text-white' : 'text-[#10263b]/60 hover:bg-[#10263b]/5'
                  }`}
                >
                  <Icon size={17} /> {label}
                  {id === 'bookings' && bookings.length > 0 && (
                    <span className={`ml-auto rounded-full px-2 py-0.5 text-xs font-bold ${tab === id ? 'bg-[#dfbd76] text-[#10263b]' : 'bg-[#10263b]/10 text-[#10263b]/60'}`}>
                      {bookings.length}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0 flex-1">
          {tab === 'settings' && settings && <SettingsTab settings={settings} onSave={setSettings} />}
          {tab === 'destinations' && (
            <DestinationsTab
              destinations={destinations}
              onRefresh={loadAll}
              editing={editingDest}
              showForm={showDestForm}
              onAdd={() => { setEditingDest(null); setShowDestForm(true); }}
              onEdit={(d) => { setEditingDest(d); setShowDestForm(true); }}
              onCloseForm={() => setShowDestForm(false)}
            />
          )}
          {tab === 'offers' && (
            <OffersTab
              offers={offers}
              onRefresh={loadAll}
              editing={editingOffer}
              showForm={showOfferForm}
              onAdd={() => { setEditingOffer(null); setShowOfferForm(true); }}
              onEdit={(o) => { setEditingOffer(o); setShowOfferForm(true); }}
              onCloseForm={() => setShowOfferForm(false)}
            />
          )}
          {tab === 'bookings' && <BookingsTab bookings={bookings} onRefresh={loadAll} />}
        </div>
      </div>
    </div>
  );
}

function SettingsTab({ settings, onSave }: { settings: SiteSettings; onSave: (s: SiteSettings) => void }) {
  const [form, setForm] = useState(settings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { data, error } = await supabase
      .from('site_settings')
      .update({
        business_name: form.business_name,
        phone: form.phone,
        whatsapp: form.whatsapp,
        email: form.email,
        address: form.address,
        working_hours: form.working_hours,
        concierge_hours: form.concierge_hours,
        manager_name: form.manager_name,
        instagram_url: form.instagram_url,
        telegram_url: form.telegram_url,
        support_phone: form.support_phone,
        updated_at: new Date().toISOString(),
      })
      .eq('id', form.id)
      .select()
      .maybeSingle();
    setSaving(false);
    if (error || !data) return;
    onSave(data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <SectionHeader title="Aloqa ma’lumotlari" subtitle="Saytda ko‘rinadigan telefon, email, manzil va ish vaqtini o‘zgartiring." />
      <form onSubmit={handleSave} className="grid gap-5 rounded-2xl border border-[#10263b]/10 bg-white p-7 sm:grid-cols-2">
        <FieldInput label="Biznes nomi" value={form.business_name} onChange={(v) => setForm({ ...form, business_name: v })} />
        <FieldInput label="Telefon" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
        <FieldInput label="WhatsApp / qo‘shimcha telefon" value={form.whatsapp} onChange={(v) => setForm({ ...form, whatsapp: v })} />
        <FieldInput label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
        <FieldInput label="Manzil" value={form.address} onChange={(v) => setForm({ ...form, address: v })} full />
        <FieldInput label="Ish vaqti" value={form.working_hours} onChange={(v) => setForm({ ...form, working_hours: v })} />
        <FieldInput label="Konsyerj vaqti" value={form.concierge_hours} onChange={(v) => setForm({ ...form, concierge_hours: v })} />
        <FieldInput label="Rahbar F.I.SH" value={form.manager_name} onChange={(v) => setForm({ ...form, manager_name: v })} full />
        <div className="sm:col-span-2 mt-2 border-t border-[#10263b]/10 pt-5"><p className="mb-4 text-xs font-bold uppercase tracking-[0.1em] text-[#9d7730]">Ijtimoiy tarmoq va qo'llab-quvvatlash</p></div>
        <FieldInput label="Instagram havolasi" value={form.instagram_url ?? ''} onChange={(v) => setForm({ ...form, instagram_url: v })} />
        <FieldInput label="Telegram havolasi" value={form.telegram_url ?? ''} onChange={(v) => setForm({ ...form, telegram_url: v })} />
        <FieldInput label="Qo'llab-quvvatlash telefoni" value={form.support_phone ?? ''} onChange={(v) => setForm({ ...form, support_phone: v })} full />
        <div className="sm:col-span-2 flex items-center gap-4">
          <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-xl bg-[#10263b] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#193853] disabled:opacity-50">
            <Save size={16} /> {saving ? 'Saqlanmoqda...' : 'Saqlash'}
          </button>
          {saved && <span className="flex items-center gap-2 text-sm text-green-600"><Check size={16} /> Saqlandi</span>}
        </div>
      </form>
    </div>
  );
}

function DestinationsTab({
  destinations, onRefresh, editing, showForm, onAdd, onEdit, onCloseForm,
}: {
  destinations: Destination[];
  onRefresh: () => void;
  editing: Destination | null;
  showForm: boolean;
  onAdd: () => void;
  onEdit: (d: Destination) => void;
  onCloseForm: () => void;
}) {
  const handleDelete = async (id: string) => {
    if (!confirm('Bu yo‘nalishni o‘chirishni istaysizmi?')) return;
    await supabase.from('destinations').delete().eq('id', id);
    onRefresh();
  };

  return (
    <div>
      <SectionHeader title="Yo‘nalishlar" subtitle="Saytda ko‘rinadigan manzillar kartochkalarini qo‘shing, tahrirlang yoki o‘chiring." action={<button onClick={onAdd} className="flex items-center gap-2 rounded-xl bg-[#dfbd76] px-5 py-3 text-sm font-bold text-[#10263b] transition hover:bg-[#f3d59b]"><Plus size={16} /> Yangi yo‘nalish</button>} />
      {showForm && <DestinationForm destination={editing} onClose={onCloseForm} onSaved={onRefresh} />}
      <div className="grid gap-4 sm:grid-cols-2">
        {destinations.map((d) => (
          <div key={d.id} className="overflow-hidden rounded-2xl border border-[#10263b]/10 bg-white">
            <div className="relative h-40">
              <img src={d.image_url} alt={d.title} className="h-full w-full object-cover" />
              {!d.is_published && <span className="absolute left-3 top-3 rounded-full bg-[#10263b]/80 px-3 py-1 text-xs text-white">Yashirin</span>}
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-serif text-xl">{d.title}</h3>
                  <p className="text-xs text-[#10263b]/50">{d.country}</p>
                </div>
                <span className="text-xs text-[#10263b]/40">#{d.sort_order}</span>
              </div>
              <p className="mt-3 line-clamp-2 text-sm text-[#10263b]/60">{d.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {d.tags.map((t) => <span key={t} className="rounded-full bg-[#10263b]/5 px-2.5 py-1 text-[10px] text-[#10263b]/60">{t}</span>)}
              </div>
              <div className="mt-4 flex gap-3">
                <button onClick={() => onEdit(d)} className="flex items-center gap-1.5 text-sm font-medium text-[#10263b]/70 transition hover:text-[#9d7730]"><Pencil size={15} /> Tahrirlash</button>
                <button onClick={() => handleDelete(d.id)} className="flex items-center gap-1.5 text-sm font-medium text-[#10263b]/70 transition hover:text-red-600"><Trash2 size={15} /> O‘chirish</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OffersTab({
  offers, onRefresh, editing, showForm, onAdd, onEdit, onCloseForm,
}: {
  offers: SpecialOffer[];
  onRefresh: () => void;
  editing: SpecialOffer | null;
  showForm: boolean;
  onAdd: () => void;
  onEdit: (o: SpecialOffer) => void;
  onCloseForm: () => void;
}) {
  const handleDelete = async (id: string) => {
    if (!confirm('Bu maxsus taklifni o‘chirishni istaysizmi?')) return;
    await supabase.from('special_offers').delete().eq('id', id);
    onRefresh();
  };

  return (
    <div>
      <SectionHeader title="Maxsus takliflar" subtitle="Saytning maxsus takliflar bo‘limi uchun takliflar qo‘shing va boshqaring." action={<button onClick={onAdd} className="flex items-center gap-2 rounded-xl bg-[#dfbd76] px-5 py-3 text-sm font-bold text-[#10263b] transition hover:bg-[#f3d59b]"><Plus size={16} /> Yangi taklif</button>} />
      {showForm && <OfferForm offer={editing} onClose={onCloseForm} onSaved={onRefresh} />}
      <div className="grid gap-4 sm:grid-cols-2">
        {offers.map((o) => (
          <div key={o.id} className="overflow-hidden rounded-2xl border border-[#10263b]/10 bg-white">
            {o.image_url && <div className="relative h-40"><img src={o.image_url} alt={o.title} className="h-full w-full object-cover" />{!o.is_published && <span className="absolute left-3 top-3 rounded-full bg-[#10263b]/80 px-3 py-1 text-xs text-white">Yashirin</span>}</div>}
            <div className="p-5">
              <div className="flex items-start justify-between">
                <h3 className="font-serif text-xl">{o.title}</h3>
                <span className="rounded-full bg-[#dfbd76]/20 px-3 py-1 text-xs font-semibold text-[#9d7730]">{o.badge}</span>
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-[#10263b]/60">{o.description}</p>
              <div className="mt-4 flex gap-3">
                <button onClick={() => onEdit(o)} className="flex items-center gap-1.5 text-sm font-medium text-[#10263b]/70 transition hover:text-[#9d7730]"><Pencil size={15} /> Tahrirlash</button>
                <button onClick={() => handleDelete(o.id)} className="flex items-center gap-1.5 text-sm font-medium text-[#10263b]/70 transition hover:text-red-600"><Trash2 size={15} /> O‘chirish</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BookingsTab({ bookings, onRefresh }: { bookings: BookingRequest[]; onRefresh: () => void }) {
  const handleDelete = async (id: string) => {
    if (!confirm('Bu zayavkani o‘chirishni istaysizmi?')) return;
    await supabase.from('booking_requests').delete().eq('id', id);
    onRefresh();
  };

  return (
    <div>
      <SectionHeader title="Zayavkalar" subtitle="Sayt orqali yuborilgan sayohat zayavkalari." />
      {bookings.length === 0 ? (
        <div className="rounded-2xl border border-[#10263b]/10 bg-white p-12 text-center text-[#10263b]/40">
          <Inbox size={36} className="mx-auto mb-4 opacity-40" />
          Hozircha zayavkalar yo‘q.
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <div key={b.id} className="rounded-2xl border border-[#10263b]/10 bg-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-semibold text-[#10263b]">{b.full_name}</h3>
                    {b.destination && <span className="rounded-full bg-[#dfbd76]/20 px-3 py-1 text-xs font-medium text-[#9d7730]">{b.destination}</span>}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-[#10263b]/60">
                    <span className="flex items-center gap-1.5"><Phone size={14} /> {b.phone}</span>
                    {b.departure_date && <span className="flex items-center gap-1.5"><CalendarDays size={14} /> {b.departure_date}</span>}
                    <span className="flex items-center gap-1.5"><Users size={14} /> {b.adults} kattalar{b.children > 0 ? `, ${b.children} bola` : ''}</span>
                    <span className="flex items-center gap-1.5"><Clock size={14} /> {new Date(b.created_at).toLocaleString('uz-UZ')}</span>
                  </div>
                  {b.special_requests && <p className="mt-3 rounded-lg bg-[#10263b]/5 px-4 py-3 text-sm text-[#10263b]/70">{b.special_requests}</p>}
                </div>
                <button onClick={() => handleDelete(b.id)} className="shrink-0 rounded-lg p-2 text-[#10263b]/40 transition hover:bg-red-50 hover:text-red-600" title="O‘chirish">
                  <Trash2 size={17} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DestinationForm({ destination, onClose, onSaved }: { destination: Destination | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    title: destination?.title ?? '',
    country: destination?.country ?? '',
    description: destination?.description ?? '',
    image_url: destination?.image_url ?? '',
    tags: destination?.tags.join(', ') ?? '',
    sort_order: destination?.sort_order ?? 0,
    is_published: destination?.is_published ?? true,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      title: form.title,
      country: form.country,
      description: form.description,
      image_url: form.image_url,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      sort_order: form.sort_order,
      is_published: form.is_published,
    };
    if (destination) {
      await supabase.from('destinations').update(payload).eq('id', destination.id);
    } else {
      await supabase.from('destinations').insert(payload);
    }
    setSaving(false);
    onSaved();
    onClose();
  };

  return (
    <div className="mb-6 rounded-2xl border border-[#dfbd76]/40 bg-white p-7">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-serif text-2xl">{destination ? 'Yo‘nalishni tahrirlash' : 'Yangi yo‘nalish'}</h3>
        <button onClick={onClose} className="rounded-full p-2 text-[#10263b]/40 hover:bg-[#10263b]/5"><X size={20} /></button>
      </div>
      <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
        <FieldInput label="Nomi" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />
        <FieldInput label="Mamlakat / mintaqa" value={form.country} onChange={(v) => setForm({ ...form, country: v })} required />
        <FieldInput label="Rasm URL" value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} required full />
        <FieldTextarea label="Tavsif" value={form.description} onChange={(v) => setForm({ ...form, description: v })} required full />
        <FieldInput label="Teglar (vergul bilan)" value={form.tags} onChange={(v) => setForm({ ...form, tags: v })} full />
        <FieldInput label="Tartib raqami" type="number" value={String(form.sort_order)} onChange={(v) => setForm({ ...form, sort_order: Number(v) })} />
        <label className="flex items-center gap-3 text-sm font-medium text-[#10263b]/70">
          <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} className="h-5 w-5 accent-[#dfbd76]" />
          Saytda ko‘rinsin
        </label>
        <div className="sm:col-span-2 flex gap-3">
          <button type="submit" disabled={saving} className="rounded-xl bg-[#10263b] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#193853] disabled:opacity-50">{saving ? 'Saqlanmoqda...' : 'Saqlash'}</button>
          <button type="button" onClick={onClose} className="rounded-xl border border-[#10263b]/15 px-6 py-3 text-sm font-medium text-[#10263b]/60 transition hover:bg-[#10263b]/5">Bekor qilish</button>
        </div>
      </form>
    </div>
  );
}

function OfferForm({ offer, onClose, onSaved }: { offer: SpecialOffer | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    title: offer?.title ?? '',
    description: offer?.description ?? '',
    badge: offer?.badge ?? 'Maxsus taklif',
    cta_label: offer?.cta_label ?? 'Batafsil',
    image_url: offer?.image_url ?? '',
    sort_order: offer?.sort_order ?? 0,
    is_published: offer?.is_published ?? true,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      title: form.title,
      description: form.description,
      badge: form.badge,
      cta_label: form.cta_label,
      image_url: form.image_url,
      sort_order: form.sort_order,
      is_published: form.is_published,
    };
    if (offer) {
      await supabase.from('special_offers').update(payload).eq('id', offer.id);
    } else {
      await supabase.from('special_offers').insert(payload);
    }
    setSaving(false);
    onSaved();
    onClose();
  };

  return (
    <div className="mb-6 rounded-2xl border border-[#dfbd76]/40 bg-white p-7">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-serif text-2xl">{offer ? 'Taklifni tahrirlash' : 'Yangi maxsus taklif'}</h3>
        <button onClick={onClose} className="rounded-full p-2 text-[#10263b]/40 hover:bg-[#10263b]/5"><X size={20} /></button>
      </div>
      <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
        <FieldInput label="Sarlavha" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />
        <FieldInput label="Belgi (badge)" value={form.badge} onChange={(v) => setForm({ ...form, badge: v })} />
        <FieldInput label="Rasm URL" value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} full />
        <FieldTextarea label="Tavsif" value={form.description} onChange={(v) => setForm({ ...form, description: v })} required full />
        <FieldInput label="Tugma matni" value={form.cta_label} onChange={(v) => setForm({ ...form, cta_label: v })} />
        <FieldInput label="Tartib raqami" type="number" value={String(form.sort_order)} onChange={(v) => setForm({ ...form, sort_order: Number(v) })} />
        <label className="flex items-center gap-3 text-sm font-medium text-[#10263b]/70">
          <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} className="h-5 w-5 accent-[#dfbd76]" />
          Saytda ko‘rinsin
        </label>
        <div className="sm:col-span-2 flex gap-3">
          <button type="submit" disabled={saving} className="rounded-xl bg-[#10263b] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#193853] disabled:opacity-50">{saving ? 'Saqlanmoqda...' : 'Saqlash'}</button>
          <button type="button" onClick={onClose} className="rounded-xl border border-[#10263b]/15 px-6 py-3 text-sm font-medium text-[#10263b]/60 transition hover:bg-[#10263b]/5">Bekor qilish</button>
        </div>
      </form>
    </div>
  );
}

function SectionHeader({ title, subtitle, action }: { title: string; subtitle: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        <h2 className="font-serif text-3xl">{title}</h2>
        <p className="mt-2 text-sm text-[#10263b]/50">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

function FieldInput({ label, value, onChange, type = 'text', full, required }: { label: string; value: string; onChange: (v: string) => void; type?: string; full?: boolean; required?: boolean }) {
  return (
    <label className={`field ${full ? 'sm:col-span-2' : ''}`}>
      {label}
      <input type={type} required={required} value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function FieldTextarea({ label, value, onChange, full, required }: { label: string; value: string; onChange: (v: string) => void; full?: boolean; required?: boolean }) {
  return (
    <label className={`field ${full ? 'sm:col-span-2' : ''}`}>
      {label}
      <textarea rows={3} required={required} value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
