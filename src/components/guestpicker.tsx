// import React, { useState } from 'react';
// import { Users, Minus, Plus } from 'lucide-react';

// // --- GUEST PICKER KOMPONENTINGIZ ---
// function GuestPicker({ adults, childrenCount, open, onToggle, onAdultsChange, onChildrenChange, dark = true }: {
//   adults: number;
//   childrenCount: number;
//   open: boolean;
//   onToggle: () => void;
//   onAdultsChange: (n: number) => void;
//   onChildrenChange: (n: number) => void;
//   dark?: boolean;
// }) {
//   const summary = `${adults} kattalar${childrenCount > 0 ? `, ${childrenCount} bola` : ''}`;
//   const containerBg = dark ? 'bg-white/10' : 'bg-[#10263b]/5';
//   const labelText = dark ? 'text-white/60' : 'text-[#10263b]/60';
//   const valueText = dark ? 'text-white' : 'text-[#10263b]';
//   const panelBg = dark ? 'bg-[#0b2136] border-white/15' : 'bg-white border-[#10263b]/15';
//   const panelText = dark ? 'text-white' : 'text-[#10263b]';
//   const panelSubText = dark ? 'text-white/50' : 'text-[#10263b]/50';
//   const btnBorder = dark ? 'border-white/25 text-white hover:bg-white/10' : 'border-[#10263b]/20 text-[#10263b] hover:bg-[#10263b]/5';
//   const accentBtn = dark ? 'bg-[#dfbd76] text-[#10263b]' : 'bg-[#10263b] text-white';

//   const Counter = ({ label, sub, value, onChange }: { label: string; sub: string; value: number; onChange: (n: number) => void }) => (
//     <div className="flex items-center justify-between py-2">
//       <div>
//         <p className={`text-sm font-medium ${panelText}`}>{label}</p>
//         <p className={`text-xs ${panelSubText}`}>{sub}</p>
//       </div>
//       <div className="flex items-center gap-3">
//         <button type="button" onClick={() => onChange(Math.max(0, value - 1))} className={`flex h-8 w-8 items-center justify-center rounded-lg border ${btnBorder} transition ${value === 0 ? 'opacity-40' : ''}`} disabled={value === 0} aria-label="Kamaytirish"><Minus size={15} /></button>
//         <span className={`w-6 text-center text-sm font-bold ${panelText}`}>{value}</span>
//         <button type="button" onClick={() => onChange(Math.min(10, value + 1))} className={`flex h-8 w-8 items-center justify-center rounded-lg border ${btnBorder} transition ${value >= 10 ? 'opacity-40' : ''}`} disabled={value >= 10} aria-label="Ko'paytirish"><Plus size={15} /></button>
//       </div>
//     </div>
//   );

//   return (
//     <div className="relative">
//       <button type="button" onClick={onToggle} className={`flex w-full items-center justify-between rounded-xl ${containerBg} px-5 py-4 text-[13px] ${labelText} transition hover:opacity-80`}>
//         <span className="flex items-center gap-2"><Users size={15} /> Mehmonlar</span>
//         <span className={`text-sm font-medium ${valueText}`}>{summary}</span>
//       </button>
//       {open && (
//         <div className={`absolute z-30 mt-2 w-full rounded-xl border ${panelBg} p-4 shadow-2xl`}>
//           <Counter label="Kattalar" sub="13 yoshdan oshgan" value={adults} onChange={onAdultsChange} />
//           <div className={`my-1 border-t ${dark ? 'border-white/10' : 'border-[#10263b]/10'}`} />
//           <Counter label="Bolalar" sub="0–12 yosh" value={childrenCount} onChange={onChildrenChange} />
//           <button type="button" onClick={onToggle} className={`mt-3 w-full rounded-lg ${accentBtn} py-2.5 text-xs font-bold transition`}>Tayyor</button>
//         </div>
//       )}
//     </div>
//   );
// }

// // --- TELEGRAMGA YUBoruvchi FUNKSIYA VA ASOSIY FORMA ---
// export default function BookingSection() {
//   const [adults, setAdults] = useState(2);
//   const [children, setChildren] = useState(0);
//   const [guestPickerOpen, setGuestPickerOpen] = useState(false);
//   const [name, setName] = useState('');
//   const [phone, setPhone] = useState('');
//   const [loading, setLoading] = useState(false);

//   // 1 TA UMUMIY FUNKSIYA (Zayavkani Telegramga yuboradi)
//   const sendToTelegram = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
//     const CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;

//     const message = `
// 🔔 *Yangi zayavka keldi!*

// 👤 *Ism:* ${name}
// 📞 *Telefon:* ${phone}
// 👨‍🦰 *Kattalar:* ${adults}
// 👶 *Bolalar:* ${children}
//     `.trim();

//     try {
//       const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           chat_id: CHAT_ID,
//           text: message,
//           parse_mode: 'Markdown',
//         }),
//       });

//       if (response.ok) {
//         alert('Zayavkangiz muvaffaqiyatli yuborildi!');
//         setName('');
//         setPhone('');
//         setAdults(2);
//         setChildren(0);
//       } else {
//         alert('Yuborishda xatolik yuz berdi.');
//       }
//     } catch (err) {
//       console.error('Xatolik:', err);
//       alert('Tarmoqda xatolik yuz berdi.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={sendToTelegram} className="max-w-md mx-auto p-6 bg-[#0b2136] rounded-2xl space-y-4">
//       <h2 className="text-white text-lg font-bold">Bron qilish</h2>

//       <div>
//         <label className="text-white/60 text-xs">Ismingiz</label>
//         <input
//           type="text"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           required
//           className="w-full mt-1 p-3 rounded-xl bg-white/10 text-white text-sm outline-none"
//           placeholder="Ismingizni kiriting"
//         />
//       </div>

//       <div>
//         <label className="text-white/60 text-xs">Telefon raqam</label>
//         <input
//           type="tel"
//           value={phone}
//           onChange={(e) => setPhone(e.target.value)}
//           required
//           className="w-full mt-1 p-3 rounded-xl bg-white/10 text-white text-sm outline-none"
//           placeholder="+998 90 123 45 67"
//         />
//       </div>

//       {/* Siz so'ragan GuestPicker qismi */}
//       <GuestPicker
//         adults={adults}
//         childrenCount={children}
//         open={guestPickerOpen}
//         onToggle={() => setGuestPickerOpen((open) => !open)}
//         onAdultsChange={setAdults}
//         onChildrenChange={setChildren}
//       />

//       <button
//         type="submit"
//         disabled={loading}
//         className="w-full py-3 bg-[#dfbd76] text-[#10263b] font-bold rounded-xl transition hover:opacity-90 disabled:opacity-50"
//       >
//         {loading ? 'Yuborilmoqda...' : 'Zayavka yuborish'}
//       </button>
//     </form>
//   );
// }