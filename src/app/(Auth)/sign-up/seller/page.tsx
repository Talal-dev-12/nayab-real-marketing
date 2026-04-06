'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Eye, EyeOff, AlertCircle, Home, Lock, Mail, User,
  CheckCircle2, Building2, ArrowLeft, Chrome,
} from 'lucide-react';

const PASSWORD_RULES = [
  { test: (p: string) => p.length >= 8,   label: 'At least 8 characters' },
  { test: (p: string) => /[A-Z]/.test(p), label: 'One uppercase letter' },
  { test: (p: string) => /[0-9]/.test(p), label: 'One number' },
];

const BENEFITS = [
  'List unlimited properties',
  'Manage your own listings',
  'Track views & inquiries',
  'Direct buyer connections',
];

export default function SellerSignUpPage() {
  const router = useRouter();

  const [form,          setForm]          = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass,      setShowPass]      = useState(false);
  const [showConfirm,   setShowConfirm]   = useState(false);
  const [error,         setError]         = useState('');
  const [loading,       setLoading]       = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const passwordValid  = PASSWORD_RULES.every(r => r.test(form.password));
  const passwordsMatch = form.password === form.confirm && form.confirm.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!passwordValid) { setError('Please meet all password requirements.'); return; }
    if (!passwordsMatch) { setError('Passwords do not match.'); return; }

    setLoading(true);
    try {
      const res  = await fetch('/api/auth/register-seller', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name: form.name, email: form.email, password: form.password }),
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
        localStorage.setItem('auth_token',  data.token);
        localStorage.setItem('auth_user',   JSON.stringify(data.user));
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_user',  JSON.stringify(data.user));
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
    // Google OAuth doesn't know if they want a seller account — we handle
    // that by prompting role selection after OAuth if needed, or can extend later.
    window.location.href = '/api/auth/google';
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-2xl shadow-2xl overflow-hidden">

        {/* ── Left panel — benefits ────────────────────────────────── */}
        <div className="hidden lg:flex flex-col justify-between bg-red-700 p-10 text-white">
          <div>
            <Link href="/" className="inline-flex items-center gap-3 mb-12 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Home size={24} className="text-white" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight">NAYAB REAL MARKETING</span>
            </Link>

            <div className="flex items-center gap-3 mb-6">
              <div>
                <h2 className="text-2xl font-extrabold">Seller Portal</h2>
                <p className="text-red-200 text-sm">List & manage your properties</p>
              </div>
            </div>

            <p className="text-red-100 text-sm leading-relaxed mb-8">
              Join thousands of property sellers on Nayab Real. Get your
              own dashboard to list, update, and track all your properties
              in one place.
            </p>

            <ul className="space-y-3">
              {BENEFITS.map(b => (
                <li key={b} className="flex items-center gap-3 text-sm">
                  <CheckCircle2 size={16} className="text-red-200 shrink-0" />
                  <span className="text-red-100">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 bg-white/10 rounded-xl p-4 text-sm text-red-100">
            Already have a seller account?{' '}
            <Link href="/sign-in" className="text-white font-bold hover:underline">
              Sign in →
            </Link>
          </div>
        </div>

        {/* ── Right panel — form ───────────────────────────────────── */}
        <div className="bg-white p-8 flex flex-col justify-center">

          <Link href="/sign-up"
            className="inline-flex items-center gap-1.5 text-slate-500 text-xs hover:text-slate-700 mb-6 w-fit">
            <ArrowLeft size={13} /> Back to regular sign-up
          </Link>

          <div className="mb-7">
            <h1 className="text-2xl font-extrabold text-[#1a2e5a]">Create Seller Account</h1>
            <p className="text-slate-500 text-sm mt-1">Start listing your properties today</p>
          </div>

          {/* Seller badge */}

          {/* Google */}
          <button
            onClick={handleGoogle}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors mb-5 disabled:opacity-60"
          >
            <Chrome size={18} className="text-blue-500" />
            {googleLoading ? 'Redirecting…' : 'Continue with Google'}
          </button>

          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-slate-400">or register with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name */}
            <div>
              <label className="text-sm font-semibold text-slate-600 block mb-1.5">Full name</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text" required autoComplete="name" placeholder="Ali Hassan"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full border-2 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-red-500 transition-colors"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-semibold text-slate-600 block mb-1.5">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="email" required autoComplete="email" placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full border-2 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-red-500 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-semibold text-slate-600 block mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type={showPass ? 'text' : 'password'} required autoComplete="new-password"
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="w-full border-2 rounded-xl pl-10 pr-12 py-3 text-sm outline-none focus:border-red-500 transition-colors"
                />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {form.password.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {PASSWORD_RULES.map(rule => {
                    const ok = rule.test(form.password);
                    return (
                      <li key={rule.label} className={`flex items-center gap-1.5 text-xs ${ok ? 'text-green-600' : 'text-slate-400'}`}>
                        <CheckCircle2 size={12} className={ok ? 'text-green-500' : 'text-slate-300'} />
                        {rule.label}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label className="text-sm font-semibold text-slate-600 block mb-1.5">Confirm password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type={showConfirm ? 'text' : 'password'} required autoComplete="new-password"
                  placeholder="Repeat your password"
                  value={form.confirm}
                  onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
                  className={`w-full border-2 rounded-xl pl-10 pr-12 py-3 text-sm outline-none transition-colors ${
                    form.confirm.length > 0
                      ? passwordsMatch ? 'border-green-400 focus:border-green-500' : 'border-red-300 focus:border-red-500'
                      : 'focus:border-red-500'
                  }`}
                />
                <button type="button" onClick={() => setShowConfirm(s => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.confirm.length > 0 && !passwordsMatch && (
                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 rounded-xl flex items-start gap-2">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit" disabled={loading || googleLoading}
              className="w-full bg-red-700 hover:bg-red-600 disabled:opacity-60 text-white py-3 rounded-xl font-bold text-sm transition-colors"
            >
              {loading ? 'Creating seller account…' : 'Create Seller Account'}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-slate-400">
            By creating an account you agree to our{' '}
            <Link href="/terms-of-service" className="underline hover:text-slate-600">Terms</Link>
            {' '}and{' '}
            <Link href="/privacy-policy" className="underline hover:text-slate-600">Privacy Policy</Link>.
          </p>

          <p className="mt-4 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link href="/sign-in" className="text-red-700 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
