'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, AlertCircle, Home, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <path d="M17.05 20.28c-.98.68-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 13.25 3.51 5.96 9.05 5.68c1.3.07 2.45.82 3.1 1.01 1.21-.29 2.55-1.05 3.96-.86 1.76.13 3.16.89 3.96 2.3-3.17 1.83-2.62 6.06.49 7.39-.77 1.94-1.92 3.91-3.51 4.76zm-3.55-14.8c-.14-1.63 1.34-3.25 2.92-3.48.33 1.83-1.37 3.39-2.92 3.48z" />
  </svg>
);

const PASSWORD_RULES = [
  { test: (p: string) => p.length >= 8, label: 'At least 8 characters' },
  { test: (p: string) => /[A-Z]/.test(p), label: 'One uppercase letter' },
  { test: (p: string) => /[0-9]/.test(p), label: 'One number' },
];

const BENEFITS = [
  'List unlimited properties',
  'Manage your own listings',
  'Track views & inquiries',
  'Direct buyer connections',
];

function SellerSignUpForm() {
  const router = useRouter();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const passwordValid = PASSWORD_RULES.every(r => r.test(form.password));
  const passwordsMatch = form.password === form.confirm && form.confirm.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!passwordValid) { setError('Please meet all password requirements.'); return; }
    if (!passwordsMatch) { setError('Passwords do not match.'); return; }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register-seller', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed. Please try again.');
        return;
      }

      if (data.requiresVerification) {
        router.push(`/verify-otp?email=${encodeURIComponent(data.email)}&role=seller`);
        return;
      }

      if (data.token) {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('auth_user', JSON.stringify(data.user));
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_user', JSON.stringify(data.user));
      }

      router.push('/dashboard');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const handleGoogle = () => {
    setGoogleLoading(true);
    window.location.href = '/api/auth/google';
  };
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-8 font-sans">
      <div className="bg-white rounded-[2rem] shadow-xl w-full max-w-[1100px] flex overflow-hidden lg:min-h-[700px]">
        {/* LEFT PANEL */}
        <div className="w-full lg:w-[45%] p-8 sm:p-12 xl:p-14 flex flex-col justify-center bg-white relative shrink-0">
          <Link href="/" className="inline-flex flex-row items-center gap-3 mb-8 group self-start">
            <div className="w-12 h-12 bg-red-700 rounded-xl flex items-center justify-center group-hover:bg-red-600 transition-colors">
              <Home size={24} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-[1.1rem] leading-none tracking-tight text-[#1a2e5a]">NAYAB</span>
              <span className="font-extrabold text-[1.1rem] leading-none tracking-tight text-[#1a2e5a]">REAL MARKETING</span>
            </div>
          </Link>
          <h1 className="text-[2.2rem] font-bold text-[#1a2e5a] mb-1 tracking-tight leading-loose">Create Seller Account</h1>
          <p className="text-slate-500 text-[15px] font-medium mb-8">Start listing your properties today</p>
          <div className="space-y-3 mb-6">
            <button
              type="button"
              onClick={handleGoogle}
              disabled={googleLoading || loading}
              className="w-full flex items-center justify-center gap-3 border border-slate-200 rounded-xl px-4 py-3 text-[15px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              <GoogleIcon />
              {googleLoading ? 'Redirecting...' : 'Sign up with Google'}
            </button>
            <button
              type="button"
              disabled
              onClick={() => alert('Apple login not configured yet.')}
              className="w-full flex items-center justify-center gap-3 border border-slate-200 rounded-xl px-4 py-3 text-[15px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <AppleIcon />
              Sign up with Apple
            </button>
          </div>
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-white px-4 text-slate-400 font-medium tracking-wide">Or register with email</span></div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="bg-[#f8f9fa] border border-slate-100 rounded-xl px-4 py-2 hover:border-slate-300 focus-within:border-[#1a2e5a] focus-within:bg-white transition-colors">
              <label className="text-[11px] text-slate-400 font-medium block">Full Name</label>
              <input
                type="text" required autoComplete="name" value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full bg-transparent outline-none text-[#1a2e5a] text-[15px] pb-0.5 placeholder:text-slate-400 font-medium"
                placeholder="Ali Hassan"
              />
            </div>
            <div className="bg-[#f8f9fa] border border-slate-100 rounded-xl px-4 py-2 hover:border-slate-300 focus-within:border-[#1a2e5a] focus-within:bg-white transition-colors">
              <label className="text-[11px] text-slate-400 font-medium block">Email</label>
              <input
                type="email" required autoComplete="email" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full bg-transparent outline-none text-[#1a2e5a] text-[15px] pb-0.5 placeholder:text-slate-400 font-medium"
                placeholder="you@email.com"
              />
            </div>
            <div className="bg-[#f8f9fa] border border-slate-100 rounded-xl px-4 py-2 hover:border-slate-300 focus-within:border-[#1a2e5a] focus-within:bg-white transition-colors relative">
              <label className="text-[11px] text-slate-400 font-medium block">Password</label>
              <input
                type={showPass ? 'text' : 'password'} required autoComplete="new-password" value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="w-full bg-transparent outline-none text-[#1a2e5a] text-[15px] pb-0.5 font-medium tracking-wider placeholder:text-slate-400 placeholder:tracking-normal"
                placeholder="••••••••••••••••"
              />
              <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {form.password.length > 0 && !passwordValid && (
              <p className="text-[12px] text-red-500 font-medium px-1">
                Write a strong password (min 8 chars, 1 capital letter, 1 number, etc.).
              </p>
            )}
            <div className="bg-[#f8f9fa] border border-slate-100 rounded-xl px-4 py-2 hover:border-slate-300 focus-within:border-[#1a2e5a] focus-within:bg-white transition-colors relative">
              <label className="text-[11px] text-slate-400 font-medium block">Confirm Password</label>
              <input
                type={showConfirm ? 'text' : 'password'} required autoComplete="new-password" value={form.confirm}
                onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
                className="w-full bg-transparent outline-none text-[#1a2e5a] text-[15px] pb-0.5 font-medium tracking-wider placeholder:text-slate-400 placeholder:tracking-normal"
                placeholder="••••••••••••••••"
              />
              <button type="button" onClick={() => setShowConfirm(s => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {form.confirm.length > 0 && !passwordsMatch && (
              <p className="text-xs text-red-500 px-1">Passwords do not match</p>
            )}
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-700 text-[13px] px-4 py-3 rounded-xl flex items-start gap-2 mt-2">
                <AlertCircle size={15} className="mt-0.5 flex-shrink-0" />
                <span className="font-medium">{error}</span>
              </div>
            )}
            <button
              type="submit" disabled={loading || googleLoading}
              className="w-full bg-[#1a2e5a] hover:bg-[#112040] disabled:opacity-60 text-white mt-4 py-4 rounded-xl font-semibold text-[15px] transition-colors shadow-sm"
            >
              {loading ? 'Creating account…' : 'Create Seller Account'}
            </button>
          </form>

          <p className="mt-4 text-center text-[12px] text-slate-400 font-medium">
            By creating an account you agree to our{' '}
            <Link href="/terms-of-service" className="underline hover:text-slate-600">Terms</Link> and <Link href="/privacy-policy" className="underline hover:text-slate-600">Privacy Policy</Link>.
          </p>

          <p className="mt-4 text-center text-[14px] font-medium text-slate-700">
            Already have an account?{' '}
            <Link href="/sign-in" className="text-red-700 font-semibold hover:underline decoration-red-700 underline-offset-4">
              Sign In
            </Link>
          </p>

          <div className="mt-4 pt-4 border-t text-center">
            <Link href="/sign-up" className="text-[13px] text-slate-500 font-medium hover:text-[#1a2e5a] hover:underline">
              Wait, I just want a regular buyer account
            </Link>
          </div>

        </div>

        {/* RIGHT PANEL (Image Banner) */}
        <div className="hidden lg:block w-[55%] relative p-4 pl-0 py-5 pr-5 lg:h-[700px] self-center">
          <div
            className="w-full h-full"

          >
            <Image
              src="/images/Seller-Subtract.svg"
              alt="Seller Banner"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
            />

            {/* Added overlay to improve text contrast over image */}
            <div className="absolute inset-0" />

            <div className="absolute top-12 right-12 max-w-[340px] text-right z-10 w-full flex flex-col items-end">
              <h2 className="text-white text-[28px] font-extrabold leading-[1.2] mb-6 inline-block drop-shadow-md">
                Ready to manage your real estate portfolio?
              </h2>
              <ul className="space-y-4 inline-block text-left bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-lg relative">
                {BENEFITS.map(b => (
                  <li key={b} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 size={18} className="text-white shrink-0 drop-shadow-sm" />
                    <span className="text-white font-bold text-[15px] drop-shadow-sm">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SellerSignUpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 font-medium text-sm">Loading…</div>}>
      <SellerSignUpForm />
    </Suspense>
  );
}
