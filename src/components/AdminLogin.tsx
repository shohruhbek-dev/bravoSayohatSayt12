import { useState } from 'react';
import { Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export function AdminLogin({ onSuccess, onBack }: { onSuccess: () => void; onBack: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (signInError) {
      setError('Email yoki parol noto‘g‘ri. Iltimos, qaytadan urinib ko‘ring.');
      return;
    }
    onSuccess();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a1b2b] px-6">
      <div className="w-full max-w-md">
        <button onClick={onBack} className="mb-8 flex items-center gap-2 text-sm text-white/60 transition hover:text-[#dfbd76]">
          <ArrowLeft size={16} /> Saytga qaytish
        </button>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-md">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#dfbd76]/20 text-[#dfbd76]">
              <Lock size={22} />
            </div>
            <div>
              <h1 className="font-serif text-2xl text-white">Admin panel</h1>
              <p className="text-xs text-white/50">Bravo Sayohat boshqaruv markazi</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="field">
              Email
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@bravosayohat.uz" />
            </label>
            <label className="field">
              Parol
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </label>
            {error && <p className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>}
            <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#dfbd76] py-4 text-sm font-bold text-[#10263b] transition hover:bg-[#f3d59b] disabled:opacity-50">
              {loading ? 'Kirilmoqda...' : 'Kirish'} <ArrowRight size={17} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
