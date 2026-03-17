'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff, Lock, Chrome, AlertCircle, Home } from 'lucide-react';
import logo from '@/assets/images/logo.svg';

const ERROR_MESSAGES: Record<string, string> = {
  google_denied:      'Google sign-in was cancelled.',
  token_failed:       'Google authentication failed. Please try again.',
  email_not_verified: 'Your Google email is not verified.',
  not_authorized:     'Your Google account is not authorised. Contact your administrator.',
  account_disabled:   'Your account has been disabled.',
  server_error:       'A server error occurred. Please try again.',
};

function LoginForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const [email,         setEmail]         = useState('');
  const [password,      setPassword]      = useState('');
  const [showPass,      setShowPass]      = useState(false);
  const [error,         setError]         = useState('');
  const [loading,       setLoading]       = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const redirect = searchParams.get('redirect') || null;

  useEffect(() => {
    const urlError = searchParams.get('error');
    if (urlError && ERROR_MESSAGES[urlError]) setError(ERROR_MESSAGES[urlError]);
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res  = await fetch('/api/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        // If email not verified, bounce to verify page
        if (data.requireVerify) {
          router.push(
            `/verify-email?email=${encodeURIComponent(data.email)}`
          );
          return;
        }
        setError(data.error || 'Login failed');
        return;
      }

      // Store token in the correct localStorage key (existing portal layouts read these)
      const role = data.user?.role;
      if (role === 'agent')  localStorage.setItem('agent_token',  data.token);
      else if (role === 'writer') localStorage.setItem('writer_token', data.token);
      else                   localStorage.setItem('admin_token',  data.token);

      // Store user data
      const storageKey =
        role === 'agent'  ? 'agent_user'  :
        role === 'writer' ? 'writer_user' : 'admin_user';
      localStorage.setItem(storageKey, JSON.stringify(data.user));

      // Navigate — honour ?redirect= param for deep links, else use role default
      router.push(redirect || data.redirectTo || '/');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    window.location.href = '/api/auth/google';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1e3d] to-[#1a2e5a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/">
            <Image src={logo} alt="Nayab Real Marketing" className="h-14 w-auto" priority />
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-7">
            <h1 className="text-2xl font-extrabold text-[#1a2e5a]">Sign In</h1>
            <p className="text-slate-500 text-sm mt-1">
              Enter your email — we'll take you to the right place
            </p>
          </div>

          {/* Google */}
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors mb-5 disabled:opacity-60"
          >
            <Chrome size={18} className="text-blue-500" />
            {googleLoading ? 'Redirecting to Google...' : 'Continue with Google'}
          </button>

          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-slate-400">or sign in with email</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-600 block mb-1.5">
                Email address
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border-2 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-600 block mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border-2 rounded-xl px-4 py-3 pr-12 text-sm outline-none focus:border-red-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg flex items-start gap-2">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full bg-red-700 hover:bg-red-600 disabled:opacity-60 text-white py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <Lock size={15} />
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            Don't have an account?{' '}
            <Link href="/register" className="text-red-700 font-semibold hover:underline">
              Create one
            </Link>
          </p>

          <p className="mt-5 text-xs text-center text-slate-400">
            Staff accounts are created by administrators only.
          </p>
        </div>

        <p className="text-center mt-4">
          <Link href="/" className="text-slate-400 text-xs hover:text-white flex items-center justify-center gap-1 transition-colors">
            <Home size={12} /> Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0f1e3d] flex items-center justify-center text-white">
        Loading...
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
