'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, AlertCircle, Home, Chrome, Lock, Mail } from 'lucide-react';

// ─── Error messages for URL query params ────────────────────────────────────
const ERROR_MESSAGES: Record<string, string> = {
  google_denied:       'Google sign-in was cancelled.',
  token_failed:        'Google authentication failed. Please try again.',
  email_not_verified:  'Your Google email is not verified.',
  not_authorized:      'Your Google account is not authorised. Contact your administrator.',
  account_disabled:    'Your account has been disabled.',
  server_error:        'A server error occurred. Please try again.',
  session_expired:     'Your session has expired. Please sign in again.',
};

function SignInForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const [form,          setForm]          = useState({ email: '', password: '' });
  const [showPass,      setShowPass]      = useState(false);
  const [error,         setError]         = useState('');
  const [loading,       setLoading]       = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Pick up ?error= from Google OAuth redirect
  useEffect(() => {
    const urlError = searchParams.get('error');
    if (urlError && ERROR_MESSAGES[urlError]) setError(ERROR_MESSAGES[urlError]);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res  = await fetch('/api/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Sign-in failed. Please try again.');
        return;
      }

      // Persist token for legacy layouts (admin/agent/writer) that read localStorage
      if (data.token) {
        const storageKey = (() => {
          const r = data.user?.role;
          if (r === 'agent')  return 'agent_token';
          if (r === 'writer') return 'writer_token';
          return 'admin_token'; // admin, superadmin, seller all use admin panel
        })();
        localStorage.setItem(storageKey,         data.token);
        localStorage.setItem(storageKey.replace('_token', '_user'), JSON.stringify(data.user));
        // Also always store as auth_token for new unified code
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('auth_user',  JSON.stringify(data.user));
      }

      // Honour ?redirect= param (e.g. from property detail page)
      const redirectTo = searchParams.get('redirect') || data.redirectTo || '/';
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
    <div className="min-h-screen bg-gradient-to-br from-[#0f1e3d] to-[#1a2e5a] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-2 group">
            <div className="w-16 h-16 bg-red-700 rounded-xl flex items-center justify-center group-hover:bg-red-600 transition-colors">
              <Home size={30} className="text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-[#1a2e5a] tracking-tight">NAYAB REAL</h1>
          </Link>
          <p className="text-slate-500 text-sm mt-1">Sign in to your account</p>
        </div>

        {/* Google */}
        <button
          onClick={handleGoogle}
          disabled={googleLoading || loading}
          className="w-full flex items-center justify-center gap-3 border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors mb-5 disabled:opacity-60"
        >
          <Chrome size={18} className="text-blue-500" />
          {googleLoading ? 'Redirecting to Google…' : 'Continue with Google'}
        </button>

        <div className="relative mb-5">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
          <div className="relative flex justify-center text-xs"><span className="bg-white px-3 text-slate-400">or sign in with email</span></div>
        </div>

        {/* Email + password */}
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div>
            <label className="text-sm font-semibold text-slate-600 block mb-1.5">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type={showPass ? 'text' : 'password'}
                required
                autoComplete="current-password"
                placeholder="Enter your password"
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
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don&apos;t have an account?{' '}
          <Link href="/sign-up" className="text-red-700 font-semibold hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0f1e3d] flex items-center justify-center text-white text-sm">
        Loading…
      </div>
    }>
      <SignInForm />
    </Suspense>
  );
}
