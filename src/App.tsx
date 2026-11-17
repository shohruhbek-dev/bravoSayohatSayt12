import { useEffect, useState } from 'react';
import {
  ArrowUpRight,
  Check,
  ChevronRight,
  Compass,
  Clock3,
  Headphones,
  Instagram,
  Menu,
  Minus,
  Phone,
  Plus,
  Users,
  Plane,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  X,
  MapPin,
  UserRound,
} from 'lucide-react';
import { supabase, type Destination, type SpecialOffer, type SiteSettings } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { AdminLogin } from '@/components/AdminLogin';
import { AdminPanel } from '@/components/AdminPanel';

const heroImages = [
  'https://images.pexels.com/photos/1456293/pexels-photo-1456293.jpeg?auto=compress&cs=tinysrgb&w=1800',
  'https://images.pexels.com/photos/19894545/pexels-photo-19894545.jpeg?auto=compress&cs=tinysrgb&w=1800',
  'https://images.pexels.com/photos/10388824/pexels-photo-10388824.jpeg?auto=compress&cs=tinysrgb&w=1800',
  'https://images.pexels.com/photos/34790496/pexels-photo-34790496.jpeg?auto=compress&cs=tinysrgb&w=1800',
  'https://images.pexels.com/photos/30438481/pexels-photo-30438481.jpeg?auto=compress&cs=tinysrgb&w=1800',
  'https://images.pexels.com/photos/15923412/pexels-photo-15923412.jpeg?auto=compress&cs=tinysrgb&w=1800',
  'https://images.pexels.com/photos/13256050/pexels-photo-13256050.jpeg?auto=compress&cs=tinysrgb&w=1800',
];

export default function App() {
  const [route, setRoute] = useState<string>(window.location.hash);

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  if (route === '#admin') {
    return <AdminRoute onExit={() => { window.location.hash = ''; setRoute(''); }} />;
  }

  return <PublicSite />;
}

function AdminRoute({ onExit }: { onExit: () => void }) {
  const { session, loading } = useAuth();
  if (loading) return <div className="flex min-h-screen items-center justify-center bg-[#0a1b2b] text-white/50">Yuklanmoqda...</div>;
  if (!session) return <AdminLogin onSuccess={() => {}} onBack={onExit} />;
  return <AdminPanel onExit={onExit} />;
}

function PublicSite() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState('');
  const [selectedDepartureDate, setSelectedDepartureDate] = useState('');
  const [searchDestination, setSearchDestination] = useState('');
  const [searchDepartureDate, setSearchDepartureDate] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [offers, setOffers] = useState<SpecialOffer[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [heroIndex, setHeroIndex] = useState(0);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [guestPickerOpen, setGuestPickerOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const [d, o, s] = await Promise.all([
        supabase.from('destinations').select('*').eq('is_published', true).order('sort_order'),
        supabase.from('special_offers').select('*').eq('is_published', true).order('sort_order'),
        supabase.from('site_settings').select('*').maybeSingle(),
      ]);
      if (d.data) setDestinations(d.data);
      if (o.data) setOffers(o.data);
      if (s.data) setSettings(s.data);
    })();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const openBooking = (destination = searchDestination, departureDate = searchDepartureDate) => {
    setSelectedDestination(destination);
    setSelectedDepartureDate(departureDate);
    setSubmitted(false);
    setSubmitError('');
    setIsModalOpen(true);
  };

  const businessName = settings?.business_name ?? 'Bravo Sayohat';
  const supportPhone = settings?.support_phone ?? '+998883887711';
  const instagramUrl = settings?.instagram_url ?? '';
  const telegramUrl = settings?.telegram_url ?? 'https://t.me/Clark_3621';

  return (
    <div className="min-h-screen bg-[#f8f7f3] text-[#10263b]">
      <header className="absolute left-0 right-0 top-0 z-20 border-b border-white/15 text-white">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 lg:px-12">
          <a href="#top" className="flex items-center gap-3" aria-label={`${businessName} bosh sahifa`}>
            <BrandLogo />
          </a>
          <nav className={`${menuOpen ? 'flex' : 'hidden'} absolute left-6 right-6 top-20 flex-col gap-5 rounded-2xl bg-[#10263b] p-6 text-sm shadow-2xl lg:static lg:flex lg:flex-row lg:items-center lg:gap-8 lg:bg-transparent lg:p-0 lg:shadow-none`}>
            <a href="#top" onClick={() => setMenuOpen(false)} className="nav-link">Bosh sahifa</a>
            <a href="#destinations" onClick={() => setMenuOpen(false)} className="nav-link">Maxsus takliflar</a>
            <a href="#about" onClick={() => setMenuOpen(false)} className="nav-link">Biz haqimizda</a>
            <a href="#contact" onClick={() => setMenuOpen(false)} className="nav-link">Aloqa</a>
          </nav>
          <div className="flex items-center gap-3">
            <button onClick={() => openBooking()} className="hidden rounded-full bg-[#dfbd76] px-5 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-[#10263b] transition hover:bg-[#f3d59b] sm:block">operator bilan bog'lanish</button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="rounded-full border border-white/30 p-2 lg:hidden" aria-label="Menyuni ochish">{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="relative flex min-h-[760px] items-end overflow-hidden bg-[#10263b] pb-24 pt-36 text-white lg:min-h-[820px] lg:pb-32">
          {heroImages.map((img, i) => (
            <img key={img} src={img} alt="Hashamatli sayohat manzarasi" className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[2000ms] ${i === heroIndex ? 'opacity-60' : 'opacity-0'}`} />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-[#061526]/90 via-[#0b2136]/65 to-[#10263b]/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#10263b] via-transparent to-[#10263b]/25" />
          <div className="relative mx-auto w-full max-w-[1400px] px-6 lg:px-12">
            <div className="max-w-3xl animate-rise">
              <div className="mb-7 flex items-center gap-3 text-[#e2c98e]"><span className="h-px w-12 bg-[#e2c98e]" /><span className="text-xs font-semibold uppercase tracking-[0.35em]">Siz uchun, dunyoning istalgan nuqtasiga</span></div>
              <h1 className="max-w-4xl font-serif text-5xl leading-[1.02] tracking-[-0.04em] sm:text-6xl lg:text-8xl">Bravo <span className="text-[#dfbd76]">Sayohat</span></h1>
              <p className="mt-5 max-w-2xl font-serif text-2xl italic leading-8 text-[#e2c98e] sm:text-3xl">Sizning hikoyangiz bizdan boshlanadi!</p>
              <p className="mt-5 max-w-xl text-lg leading-8 text-white/75">Sizning orzuingizdagi eksklyuziv dam olish lahzalarini biz mukammal tafsilotlar bilan yaratamiz.</p>
            </div>
            <div className="mt-12 max-w-5xl rounded-2xl border border-white/20 bg-white/10 p-2 backdrop-blur-md sm:p-3">
              <div className="grid gap-2 md:grid-cols-[1fr_1fr_1fr_auto]">
                <label className="flex flex-col gap-2 rounded-xl bg-white/10 px-5 py-4 text-xs text-white/60">Qaysi davlat?<input type="text" value={searchDestination} onChange={(e) => setSearchDestination(e.target.value)} placeholder="Masalan: Maldiv, Dubai, Bali..." className="bg-transparent text-sm font-medium text-white outline-none placeholder:text-white/40" /></label>
                <label className="flex flex-col gap-2 rounded-xl bg-white/10 px-5 py-4 text-xs text-white/60">Ketish sanasi<input type="date" value={searchDepartureDate} onChange={(e) => setSearchDepartureDate(e.target.value)} className="bg-transparent text-sm font-medium text-white outline-none [color-scheme:dark]" /></label>
                <GuestPicker adults={adults} childrenCount={children} open={guestPickerOpen} onToggle={() => setGuestPickerOpen((open) => !open)} onAdultsChange={setAdults} onChildrenChange={setChildren} />
                <button onClick={() => openBooking(searchDestination, searchDepartureDate)} className="flex items-center justify-center gap-2 rounded-xl bg-[#dfbd76] px-7 py-4 text-sm font-bold text-[#10263b] transition hover:bg-[#f3d59b]">Zayavka qoldirish <ArrowUpRight size={17} /></button>
              </div>
            </div>
            <div className="mt-9 flex items-center gap-8 text-xs font-medium uppercase tracking-[0.2em] text-white/60">
              <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-[#dfbd76]" /> PREMIUM SERVIS</span>
              <span className="hidden items-center gap-2 sm:flex"><Star size={16} className="text-[#dfbd76]" /> 24/7 QO'LLAB-QUVVATLASH</span>
              <span className="hidden items-center gap-2 md:flex"><Sparkles size={16} className="text-[#dfbd76]" /> EKSKLYUZIV TAKLIFLAR</span>
            </div>
            <div className="mt-6 flex gap-2">
              {heroImages.map((_, i) => (
                <span key={i} className={`h-1 rounded-full transition-all duration-500 ${i === heroIndex ? 'w-8 bg-[#dfbd76]' : 'w-2 bg-white/30'}`} />
              ))}
            </div>
          </div>
        </section>

        {offers.length > 0 && (
          <section id="offers" className="mx-auto max-w-[1400px] px-6 py-24 lg:px-12 lg:py-32">
            <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="eyebrow">00 — Maxsus takliflar</p>
                <h2 className="section-title">Cheklangan vaqtga <em>maxsus</em><br className="hidden sm:block" /> imkoniyatlar.</h2>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {offers.map((offer) => (
                <article key={offer.id} className="group relative overflow-hidden rounded-2xl bg-[#10263b] text-white">
                  {offer.image_url && <div className="relative h-56 overflow-hidden"><img src={offer.image_url} alt={offer.title} className="h-full w-full object-cover opacity-80 transition duration-700 group-hover:scale-105" /><span className="absolute left-4 top-4 rounded-full bg-[#dfbd76] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#10263b]">{offer.badge}</span></div>}
                  <div className="p-7">
                    <h3 className="font-serif text-2xl">{offer.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-white/65">{offer.description}</p>
                    <button onClick={() => openBooking(offer.title)} className="mt-5 flex items-center gap-2 border-b border-[#dfbd76] pb-1 text-xs font-bold uppercase tracking-[0.14em] text-[#dfbd76]">{offer.cta_label} <ChevronRight size={15} /></button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        <section id="destinations" className="mx-auto max-w-[1400px] px-6 py-24 lg:px-12 lg:py-32">
          <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="eyebrow">01 — Tanlangan kolleksiya</p><h2 className="section-title">Dunyoning eng <em>go‘zal</em><br className="hidden sm:block" /> manzillari.</h2></div><p className="max-w-sm text-sm leading-7 text-[#10263b]/60">Har bir sayohat — bu oddiy safar emas. Bu sizning didingiz va vaqtingizga moslab yaratilgan shaxsiy hikoya.</p></div>
          {destinations.length === 0 ? (
            <div className="rounded-2xl border border-[#10263b]/10 bg-white p-16 text-center text-[#10263b]/40">
              <MapPin size={32} className="mx-auto mb-4 opacity-40" />
              Yo‘nalishlar hozircha qo‘shilmagan. Admin panel orqali qo‘shing.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {destinations.map((destination, index) => <DestinationCard key={destination.id} destination={destination} index={index} onBook={openBooking} />)}
            </div>
          )}
          <div className="mt-14 flex justify-center"><button onClick={() => openBooking()} className="group flex items-center gap-3 border-b border-[#dfbd76] pb-2 text-sm font-bold uppercase tracking-[0.17em] text-[#10263b] transition hover:text-[#9d7730]">Barcha yo‘nalishlarni ko‘rish <ChevronRight size={18} className="transition group-hover:translate-x-1" /></button></div>
        </section>

        <section id="about" className="bg-[#10263b] px-6 py-24 text-white lg:px-12 lg:py-32">
          <div className="mx-auto grid max-w-[1400px] gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center"><div><p className="eyebrow text-[#dfbd76]">02 — Bravo Sayohat farqi</p><h2 className="section-title text-white">Sizning vaqtingiz —<br /><em className="text-[#dfbd76]">eng qimmat</em> boyligingiz.</h2><p className="mt-8 max-w-md text-sm leading-7 text-white/65">Biz har bir detaldan xabardor bo‘lamiz, shunda siz faqat lahzalardan bahramand bo‘lasiz. Shaxsiy menejeringiz safarning har bir bosqichini nazorat qiladi.</p><button onClick={() => openBooking()} className="mt-9 flex items-center gap-3 text-sm font-semibold text-[#dfbd76]">Shaxsiy maslahatchi bilan bog‘lanish <ArrowUpRight size={17} /></button></div><div className="grid gap-4 sm:grid-cols-2">{[['01', 'Individual yondashuv', 'Sizning xohishlaringiz asosida mukammal marshrut.'], ['02', '24/7 VIP Concierge', 'Sizga kerak bo‘lgan har qanday yordam bir qo‘ng‘iroqda.'], ['03', 'Eksklyuziv 5* Resortlar', 'Dunyodagi eng nufuzli mehmonxonalar bilan alohida imtiyozlar.'], ['04', 'Maxfiylik va xavfsizlik', 'Sayohatingiz to‘liq maxfiylik va g‘amxo‘rlik ostida.']].map(([number, title, description]) => <div key={number} className="group rounded-2xl border border-white/12 bg-white/[0.04] p-7 transition hover:-translate-y-1 hover:border-[#dfbd76]/50"><span className="text-xs text-[#dfbd76]">{number}</span><Sparkles size={22} className="mt-9 text-[#dfbd76]" /><h3 className="mt-5 font-serif text-2xl">{title}</h3><p className="mt-3 text-sm leading-6 text-white/55">{description}</p></div>)}</div></div>
        </section>

        <section className="relative overflow-hidden bg-[#dfbd76] px-6 py-24 lg:px-12 lg:py-28"><div className="absolute -right-10 -top-20 h-80 w-80 rounded-full border border-[#10263b]/15" /><div className="absolute -right-2 -top-12 h-64 w-64 rounded-full border border-[#10263b]/15" /><div className="relative mx-auto flex max-w-[1100px] flex-col items-center text-center"><Plane size={31} className="mb-7 text-[#10263b]" /><h2 className="font-serif text-4xl leading-tight text-[#10263b] sm:text-6xl">Keyingi manzilingiz<br /><em>qayerda?</em></h2><p className="mt-6 max-w-md text-sm leading-7 text-[#10263b]/70">Orzuingizdagi sayohatni birgalikda rejalashtiramiz. Siz tasavvur qiling — biz amalga oshiramiz.</p><button onClick={() => openBooking()} className="mt-9 rounded-full bg-[#10263b] px-7 py-4 text-sm font-bold uppercase tracking-[0.13em] text-white transition hover:bg-[#193853]">Shaxsiy taklif olish <ArrowUpRight className="ml-2 inline" size={17} /></button></div></section>
      </main>

      <Footer settings={settings} supportPhone={supportPhone} instagramUrl={instagramUrl} telegramUrl={telegramUrl} />

      {isModalOpen && (
        <BookingModal
          selectedDestination={selectedDestination}
          initialDepartureDate={selectedDepartureDate}
          initialAdults={adults}
          initialChildren={children}
          submitted={submitted}
          submitError={submitError}
          onSubmit={async (formData) => {
            setSubmitError('');
            const { error } = await supabase.from('booking_requests').insert({
              full_name: 'Sayohat zayavkasi',
              phone: formData.phone,
              destination: formData.destination || null,
              departure_date: formData.departureDate || null,
              adults: formData.adults,
              children: formData.children,
              special_requests: null,
            });
            if (error) {
              setSubmitError('Xatolik yuz berdi. Iltimos, qaytadan urinib ko‘ring.');
              return;
            }
            const { data: telegramResult, error: telegramError } = await supabase.functions.invoke('notify-telegram-lead', {
              body: {
                phone: formData.phone,
                destination: formData.destination || null,
                departureDate: formData.departureDate || null,
                adults: formData.adults,
                children: formData.children,
              },
            });
            if (telegramError || telegramResult?.telegram === 'failed') {
              setSubmitError('Zayavka qabul qilindi, ammo operatorga Telegram orqali yuborishda xatolik yuz berdi.');
            }
            setSubmitted(true);
          }}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

function BrandLogo() {
  return (
    <span className="flex items-center gap-3">
      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#dfbd76]/70 bg-[#10263b]/50 text-[#dfbd76]">
        <Compass size={25} strokeWidth={1.6} />
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-[19px] font-bold tracking-[0.18em] text-white">BRAVO</span>
        <span className="mt-1 text-[10px] font-semibold tracking-[0.38em] text-[#dfbd76]">SAYOHAT</span>
      </span>
    </span>
  );
}

function Footer({ settings, supportPhone, instagramUrl, telegramUrl }: { settings: SiteSettings | null; supportPhone: string; instagramUrl: string; telegramUrl: string }) {
  const s = settings;
  const workingHours = s?.working_hours ?? 'Dushanba–Juma | 10:00–18:00';

  return (
    <footer id="contact" className="bg-[#0a1b2b] px-6 py-16 text-white lg:px-12">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <BrandLogo />
            <p className="mt-5 max-w-xs text-sm leading-7 text-white/55">Bravo Sayohat — Sizning hikoyangiz bizdan boshlanadi!</p>
            <div className="mt-7 flex gap-3">
              {instagramUrl && <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="social" aria-label="Instagram"><Instagram size={17} /></a>}
              <a href={telegramUrl} target="_blank" rel="noopener noreferrer" className="social" aria-label="Telegram"><Send size={17} /></a>
              <a href={`tel:${supportPhone.replace(/[^\d+]/g, '')}`} className="social" aria-label="Qo'llab-quvvatlash"><Headphones size={17} /></a>
            </div>
          </div>
          <div>
            <p className="footer-heading">Navigatsiya</p>
            <div className="footer-links">
              <a href="#top">Bosh sahifa</a>
              <a href="#destinations">Yo‘nalishlar</a>
              <a href="#about">Biz haqimizda</a>
              <a href="#contact">Aloqa</a>
            </div>
          </div>
          <div>
            <p className="footer-heading">Bog‘lanish</p>
            <div className="footer-links">
              <a href={`tel:${s?.phone?.replace(/[^\d+]/g, '') ?? '+998883887711'}`}>{s?.phone ?? '+998 (88) 388-77-11'}</a>
              <a href={`tel:${s?.whatsapp?.replace(/[^\d+]/g, '') ?? '+998905463330'}`}>{s?.whatsapp ?? '+998 (90) 546-33-30'}</a>
              <a href={`mailto:${s?.email ?? 'bravosayohat@gmail.com'}`}>{s?.email ?? 'bravosayohat@gmail.com'}</a>
              <span className="flex items-start gap-2"><MapPin size={16} className="mt-0.5 shrink-0 text-[#dfbd76]" /> {s?.address ?? 'Tashkent sh. Chilonzor 2, Arnasay 16b'}</span>
            </div>
          </div>
          <div>
            <p className="footer-heading">Ish vaqti</p>
            <div className="footer-links">
              <span className="flex items-start gap-2"><Clock3 size={16} className="mt-0.5 shrink-0 text-[#dfbd76]" /> <span>{workingHours.split('|').map((part) => <span key={part} className="block">{part.trim()}</span>)}</span></span>
              {s?.manager_name && <span className="flex items-start gap-2"><UserRound size={16} className="mt-0.5 shrink-0 text-[#dfbd76]" /> <span><strong className="font-medium text-white/75">Rahbar:</strong> {s.manager_name}</span></span>}
            </div>
          </div>
        </div>
        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/35 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} Bravo Sayohat. Barcha huquqlar himoyalangan.</span>
          <span className="flex gap-6"><a href="#">Maxfiylik siyosati</a><a href="#">Foydalanish shartlari</a></span>
        </div>
      </div>
    </footer>
  );
}

function DestinationCard({ destination, index, onBook }: { destination: Destination; index: number; onBook: (destination: string) => void }) {
  return (
    <article className={`group relative min-h-[500px] overflow-hidden rounded-2xl bg-[#10263b] text-white ${index === 0 ? 'md:row-span-2 md:min-h-[700px]' : ''}`}>
      <img src={destination.image_url} alt={`${destination.title} — ${destination.country}`} className="absolute inset-0 h-full w-full object-cover opacity-75 transition duration-700 group-hover:scale-105 group-hover:opacity-90" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#071a2b] via-[#071a2b]/25 to-transparent" />
      <div className="relative flex h-full min-h-[500px] flex-col justify-end p-7 lg:p-9">
        <div className="mb-auto flex items-start justify-between">
          <span className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] backdrop-blur-sm">{destination.country}</span>
          <span className="rounded-full bg-[#dfbd76] p-2 text-[#10263b]"><ArrowUpRight size={18} /></span>
        </div>
        <h3 className="font-serif text-4xl">{destination.title}</h3>
        <p className="mt-3 max-w-md text-sm leading-6 text-white/70">{destination.description}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {destination.tags.map((tag) => <span key={tag} className="rounded-full border border-white/20 px-3 py-1.5 text-[10px] uppercase tracking-[0.1em] text-white/75">{tag}</span>)}
        </div>
        <button onClick={() => onBook(destination.title)} className="mt-7 flex w-fit items-center gap-2 border-b border-[#dfbd76] pb-1 text-xs font-bold uppercase tracking-[0.14em] text-[#dfbd76]">Batafsil & zayavka <ChevronRight size={15} /></button>
      </div>
    </article>
  );
}

function BookingModal({
  selectedDestination,
  initialDepartureDate,
  initialAdults,
  initialChildren,
  submitted,
  submitError,
  onSubmit,
  onClose,
}: {
  selectedDestination: string;
  initialDepartureDate: string;
  initialAdults: number;
  initialChildren: number;
  submitted: boolean;
  submitError: string;
  onSubmit: (formData: { phone: string; destination: string; departureDate: string; adults: number; children: number }) => Promise<void>;
  onClose: () => void;
}) {
  const [phone, setPhone] = useState('');
  const [destination, setDestination] = useState(selectedDestination);
  const [departureDate, setDepartureDate] = useState(initialDepartureDate);
  const [adults, setAdults] = useState(initialAdults);
  const [children, setChildren] = useState(initialChildren);
  const [guestPickerOpen, setGuestPickerOpen] = useState(false);

  useEffect(() => { setDestination(selectedDestination); }, [selectedDestination]);
  useEffect(() => { setDepartureDate(initialDepartureDate); }, [initialDepartureDate]);
  useEffect(() => { setAdults(initialAdults); setChildren(initialChildren); }, [initialAdults, initialChildren]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#061526]/80 p-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-[#f8f7f3] p-7 shadow-2xl sm:p-10">
        <button onClick={onClose} className="absolute right-5 top-5 rounded-full p-2 text-[#10263b]/60 transition hover:bg-[#10263b]/10" aria-label="Yopish"><X size={20} /></button>
        {submitted ? (
          <div className="py-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#dfbd76]/25 text-[#9d7730]"><Check size={30} /></div>
            <h2 className="mt-7 font-serif text-4xl text-[#10263b]">Rahmat!</h2>
            <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-[#10263b]/65">Bravo Sayohat operatori tez orada siz bilan bog‘lanib, sayohatingizni rejalashtirishga yordam beradi.</p>
            {submitError && <p className="mx-auto mt-5 max-w-sm rounded-lg bg-[#dfbd76]/20 px-4 py-3 text-sm leading-6 text-[#80601e]">{submitError}</p>}
            <button onClick={onClose} className="mt-8 rounded-full bg-[#10263b] px-7 py-3 text-sm font-semibold text-white">Yopish</button>
          </div>
        ) : (
          <>
            <p className="eyebrow">Shaxsiy sayohat</p>
            <h2 className="mt-3 max-w-sm font-serif text-4xl leading-tight text-[#10263b]">Orzuingizdagi sayohatni <em>boshlang.</em></h2>
            <p className="mt-4 text-sm leading-6 text-[#10263b]/60">Ma’lumotlaringizni qoldiring, shaxsiy maslahatchingiz 15 deqiqa ichida bog‘lanadi.</p>
            <form
              onSubmit={(e) => { e.preventDefault(); onSubmit({ phone, destination, departureDate, adults, children }); }}
              className="mt-8 space-y-5"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="field">Qaysi davlat?
                  <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Masalan: Dubai, Maldiv..." />
                </label>
                <label className="field">Ketish sanasi
                  <input type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} />
                </label>
              </div>
              <GuestPicker adults={adults} childrenCount={children} open={guestPickerOpen} onToggle={() => setGuestPickerOpen((open) => !open)} onAdultsChange={setAdults} onChildrenChange={setChildren} dark={false} />
              <label className="field">Telefon raqam<input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+998 90 000 00 00" autoFocus /></label>
              {submitError && <p className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-600">{submitError}</p>}
              <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#10263b] py-4 text-sm font-bold uppercase tracking-[0.1em] text-white transition hover:bg-[#193853]">Zayavkani yuborish <ArrowUpRight size={17} /></button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function GuestPicker({ adults, childrenCount, open, onToggle, onAdultsChange, onChildrenChange, dark = true }: {
  adults: number;
  childrenCount: number;
  open: boolean;
  onToggle: () => void;
  onAdultsChange: (n: number) => void;
  onChildrenChange: (n: number) => void;
  dark?: boolean;
}) {
  const summary = `${adults} kattalar${childrenCount > 0 ? `, ${childrenCount} bola` : ''}`;
  const containerBg = dark ? 'bg-white/10' : 'bg-[#10263b]/5';
  const labelText = dark ? 'text-white/60' : 'text-[#10263b]/60';
  const valueText = dark ? 'text-white' : 'text-[#10263b]';
  const panelBg = dark ? 'bg-[#0b2136] border-white/15' : 'bg-white border-[#10263b]/15';
  const panelText = dark ? 'text-white' : 'text-[#10263b]';
  const panelSubText = dark ? 'text-white/50' : 'text-[#10263b]/50';
  const btnBorder = dark ? 'border-white/25 text-white hover:bg-white/10' : 'border-[#10263b]/20 text-[#10263b] hover:bg-[#10263b]/5';
  const accentBtn = dark ? 'bg-[#dfbd76] text-[#10263b]' : 'bg-[#10263b] text-white';

  const Counter = ({ label, sub, value, onChange }: { label: string; sub: string; value: number; onChange: (n: number) => void }) => (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className={`text-sm font-medium ${panelText}`}>{label}</p>
        <p className={`text-xs ${panelSubText}`}>{sub}</p>
      </div>
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => onChange(Math.max(0, value - 1))} className={`flex h-8 w-8 items-center justify-center rounded-lg border ${btnBorder} transition ${value === 0 ? 'opacity-40' : ''}`} disabled={value === 0} aria-label="Kamaytirish"><Minus size={15} /></button>
        <span className={`w-6 text-center text-sm font-bold ${panelText}`}>{value}</span>
        <button type="button" onClick={() => onChange(Math.min(10, value + 1))} className={`flex h-8 w-8 items-center justify-center rounded-lg border ${btnBorder} transition ${value >= 10 ? 'opacity-40' : ''}`} disabled={value >= 10} aria-label="Ko'paytirish"><Plus size={15} /></button>
      </div>
    </div>
  );

  return (
    <div className="relative">
      <button type="button" onClick={onToggle} className={`flex w-full items-center justify-between rounded-xl ${containerBg} px-5 py-4 text-[13px] ${labelText} transition hover:opacity-80`}>
        <span className="flex items-center gap-2"><Users size={15} /> Mehmonlar</span>
        <span className={`text-sm font-medium ${valueText}`}>{summary}</span>
      </button>
      {open && (
        <div className={`absolute z-30 mt-2 w-full rounded-xl border ${panelBg} p-4 shadow-2xl`}>
          <Counter label="Kattalar" sub="13 yoshdan oshgan" value={adults} onChange={onAdultsChange} />
          <div className={`my-1 border-t ${dark ? 'border-white/10' : 'border-[#10263b]/10'}`} />
          <Counter label="Bolalar" sub="0–12 yosh" value={childrenCount} onChange={onChildrenChange} />
          <button type="button" onClick={onToggle} className={`mt-3 w-full rounded-lg ${accentBtn} py-2.5 text-xs font-bold transition`}>Tayyor</button>
        </div>
      )}
    </div>
  );
}
