'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Lock, Mail, Eye, EyeOff } from 'lucide-react';

export default function AgentLoginPage() {
  const router = useRouter();
  const [form,    setForm]    = useState({ email: '', password: '' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [show,    setShow]    = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Login failed'); return; }
      if (data.user?.role !== 'agent') { setError('Access denied. Agent credentials only.'); return; }
      localStorage.setItem('agent_token', data.token);
      localStorage.setItem('agent_user',  JSON.stringify(data.user));
      router.push('/agent');
    } catch { setError('Connection error. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#0f1e3d] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-700 rounded-2xl flex items-center justify-center mx-auto mb-4"><Building2 size={32} className="text-white" /></div>
          <h1 className="text-3xl font-extrabold text-white">Agent Portal</h1>
          <p className="text-slate-400 mt-2">Nayab Real Marketing</p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="your@email.com" className="w-full border-2 rounded-lg pl-9 pr-4 py-3 text-sm outline-none focus:border-red-500" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type={show ? 'text' : 'password'} required value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••" className="w-full border-2 rounded-lg pl-9 pr-10 py-3 text-sm outline-none focus:border-red-500" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-red-700 hover:bg-red-600 text-white py-3 rounded-xl font-bold text-sm mt-2 transition-colors disabled:opacity-60">
              {loading ? 'Signing in...' : 'Sign In to Agent Portal'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
