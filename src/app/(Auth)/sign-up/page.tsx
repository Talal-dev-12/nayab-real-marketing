'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, AlertCircle, Home, Chrome, User, Mail, Lock, CheckCircle2 } from 'lucide-react';

const PASSWORD_RULES = [
  { test: (p: string) => p.length >= 8,                  label: 'At least 8 characters' },
  { test: (p: string) => /[A-Z]/.test(p),                label: 'One uppercase letter' },
  { test: (p: string) => /[0-9]/.test(p),                label: 'One number' },
];

export default function SignUpPage() {
  const router = useRouter();
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;

  const [form,          setForm]          = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass,      setShowPass]      = useState(false);
  const [showConfirm,   setShowConfirm]   = useState(false);
  const [error,         setError]         = useState('');
  const [loading,       setLoading]       = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const passwordValid = PASSWORD_RULES.every(r => r.test(form.password));
  const passwordsMatch = form.password === form.confirm && form.confirm.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!passwordValid) {
      setError('Please meet all password requirements.');
      return;
    }
    if (!passwordsMatch) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res  = await fetch('/api/auth/register', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed. Please try again.');
        return;
      }

      // If OTP verification is required, redirect to verify page
      if (data.requiresVerification) {
        router.push(`/verify-otp?email=${encodeURIComponent(data.email)}&role=user`);
        return;
      }

      // Fallback: direct login (shouldn't happen with new flow)
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('auth_user',  JSON.stringify(data.user));
      }
      const redirectTo = searchParams?.get('redirect') || '/';
      router.push(redirectTo);
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
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">

        {/* Logo */}
        <div className="text-center mb-7">
          <Link href="/" className="inline-flex flex-col items-center gap-2 group">
            <div className="w-16 h-16 bg-red-700 rounded-xl flex items-center justify-center group-hover:bg-red-600 transition-colors">
              <Home size={30} className="text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-[#1a2e5a] tracking-tight">NAYAB REAL</h1>
          </Link>
          <p className="text-slate-500 text-sm mt-1">Create your account — it&apos;s free</p>
        </div>

        {/* Google */}
        <button
          onClick={handleGoogle}
          disabled={googleLoading || loading}
          className="w-full flex items-center justify-center gap-3 border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors mb-5 disabled:opacity-60"
        >
          <Chrome size={18} className="text-blue-500" />
          {googleLoading ? 'Redirecting to Google…' : 'Sign up with Google'}
        </button>

        <div className="relative mb-5">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
          <div className="relative flex justify-center text-xs"><span className="bg-white px-3 text-slate-400">or register with email</span></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Full name */}
          <div>
            <label className="text-sm font-semibold text-slate-600 block mb-1.5">Full name</label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                required
                autoComplete="name"
                placeholder="Ali Hassan"
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
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
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
                type={showPass ? 'text' : 'password'}
                required
                autoComplete="new-password"
                placeholder="Create a strong password"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="w-full border-2 rounded-xl pl-10 pr-12 py-3 text-sm outline-none focus:border-red-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPass(s => !s)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Password rules */}
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
                type={showConfirm ? 'text' : 'password'}
                required
                autoComplete="new-password"
                placeholder="Repeat your password"
                value={form.confirm}
                onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
                className={`w-full border-2 rounded-xl pl-10 pr-12 py-3 text-sm outline-none transition-colors ${
                  form.confirm.length > 0
                    ? passwordsMatch ? 'border-green-400 focus:border-green-500' : 'border-red-300 focus:border-red-500'
                    : 'focus:border-red-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(s => !s)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {form.confirm.length > 0 && !passwordsMatch && (
              <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 rounded-xl flex items-start gap-2">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full bg-red-700 hover:bg-red-600 disabled:opacity-60 text-white py-3 rounded-xl font-bold text-sm transition-colors"
          >
            {loading ? 'Creating account…' : 'Create Account'}
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
          <Link href="/sign-in" className="text-red-700 font-semibold hover:underline">
            Sign in
          </Link>
        </p>

        <div className="mt-4 border-t pt-4 text-center">
          <p className="text-xs text-slate-400 mb-2">Want to list your properties? <Link href="/sign-up/seller" className="text-red-500 font-semibold hover:underline">Create a Seller Account</Link> </p>
          
        </div>
      </div>
    </div>
  );
}
