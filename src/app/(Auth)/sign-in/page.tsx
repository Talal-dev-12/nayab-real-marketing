'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, AlertCircle, Home } from 'lucide-react';
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

const ERROR_MESSAGES: Record<string, string> = {
  google_denied: 'Google sign-in was cancelled.',
  token_failed: 'Google authentication failed. Please try again.',
  email_not_verified: 'Your Google email is not verified.',
  not_authorized: 'Your Google account is not authorised. Contact your administrator.',
  account_disabled: 'Your account has been disabled.',
  server_error: 'A server error occurred. Please try again.',
  session_expired: 'Your session has expired. Please sign in again.',
};

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    const urlError = searchParams.get('error');
    if (urlError && ERROR_MESSAGES[urlError]) setError(ERROR_MESSAGES[urlError]);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.requiresVerification) {
          const redir = searchParams.get('redirect');
          const redirQuery = redir ? `&redirect=${encodeURIComponent(redir)}` : '';
          router.push(`/verify-otp?email=${encodeURIComponent(data.email)}&role=${data.user?.role || 'user'}${redirQuery}`);
          return;
        }
        setError(data.error || 'Sign-in failed. Please try again.');
        return;
      }

      if (data.token) {
        const storageKey = (() => {
          const r = data.user?.role;
          if (r === 'agent') return 'agent_token';
          if (r === 'writer') return 'writer_token';
          return 'admin_token';
        })();
        localStorage.setItem(storageKey, data.token);
        localStorage.setItem(storageKey.replace('_token', '_user'), JSON.stringify(data.user));
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('auth_user', JSON.stringify(data.user));
      }

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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-8 font-sans">
      <div className="bg-white rounded-[2rem] shadow-xl w-full max-w-[1100px] flex overflow-hidden lg:min-h-[700px]">
        {/* LEFT PANEL */}
        <div className="w-full lg:w-[45%] p-8 sm:p-12 xl:pr-8 xl:pl-8 flex flex-col justify-start bg-white relative shrink-0">

          {/* Logo element matched to theme */}
          <Link href="/" className="inline-flex flex-row items-center gap-3 mb-10 group">
            <div className="w-12 h-12 bg-red-700 rounded-xl flex items-center justify-center group-hover:bg-red-600 transition-colors">
              <Home size={24} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-[1.1rem] leading-none tracking-tight text-[#1a2e5a]">NAYAB</span>
              <span className="font-extrabold text-[1.1rem] leading-none tracking-tight text-[#1a2e5a]">REAL MARKETING</span>
            </div>
          </Link>

          {/* Titles */}
          <h1 className="text-[2.5rem] font-bold text-[#1a2e5a] mb-2 tracking-tight leading-tight">Welcome Back</h1>
          <p className="text-slate-500 text-[15px] font-medium mb-8">Let's login to grab amazing deal</p>

          {/* Social Logins */}
          <div className="space-y-3 mb-6">
            <button
              type="button"
              onClick={handleGoogle}
              disabled={googleLoading || loading}
              className="w-full flex items-center justify-center gap-3 border border-slate-200 rounded-xl px-4 py-3 text-[15px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              <GoogleIcon />
              {googleLoading ? 'Redirecting...' : 'Continue with Google'}
            </button>
            <button
              type="button"
              disabled
              onClick={() => alert('Apple login not configured yet.')}
              className="w-full flex items-center justify-center gap-3 border border-slate-200 rounded-xl px-4 py-3 text-[15px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <AppleIcon />
              Continue with Apple
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-white px-4 text-slate-400 font-medium tracking-wide">Or</span></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-[#f8f9fa] border border-slate-100 rounded-xl px-4 py-2.5 hover:border-slate-300 focus-within:border-[#1a2e5a] focus-within:bg-white transition-colors">
              <label className="text-[11px] text-slate-400 font-medium block">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full bg-transparent outline-none text-[#1a2e5a] text-[15px] pb-0.5 placeholder:text-slate-400 font-medium"
                placeholder="you@email.com"
              />
            </div>

            <div className="bg-[#f8f9fa] border border-slate-100 rounded-xl px-4 py-2.5 hover:border-slate-300 focus-within:border-[#1a2e5a] focus-within:bg-white transition-colors relative">
              <label className="text-[11px] text-slate-400 font-medium block">Password</label>
              <input
                type={showPass ? 'text' : 'password'}
                required
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="w-full bg-transparent outline-none text-[#1a2e5a] text-[15px] pb-0.5 font-medium tracking-wider placeholder:text-slate-400 placeholder:tracking-normal"
                placeholder="••••••••••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPass(s => !s)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <span className=" text-sm text-red-700 ">
                {error}</span>
            )}
            <div className="flex items-center justify-between mt-4">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} className="w-3.5 h-3.5 rounded border-slate-300 text-red-700 focus:ring-red-700 cursor-pointer" />
                <span className="text-[14px] font-medium text-slate-700 group-hover:text-slate-900 transition-colors">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-[14px] font-semibold text-red-700 hover:text-red-800 hover:underline underline-offset-2">
                Forgot Password?
              </Link>
            </div>


            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full bg-[#1a2e5a] hover:bg-[#112040] disabled:opacity-60 text-white mt-4 py-4 rounded-xl font-semibold text-[15px] transition-colors shadow-sm"
            >
              {loading ? 'Please wait...' : 'Login'}
            </button>
          </form>
          <p className="mt-6 text-center text-[14px] font-medium text-slate-700">
            Don't have an account?{' '}
            <Link href="/sign-up" className="text-red-700 font-semibold hover:underline decoration-red-700 underline-offset-4">
              Sign Up
            </Link>
          </p>
        </div>

        {/* RIGHT PANEL (Image Banner) */}
        <div className="hidden lg:block w-[55%] relative lg:h-[700px] self-center">
          <div className="w-full h-full relative flex items-center justify-center rounded-[2.5rem] overflow-hidden">
            <Image
              src="/images/Subtract1.svg"
              alt="Login Banner"
              fill
              className="object-fill"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
              priority
            />
            <div className="absolute top-12 right-12 max-w-[340px] text-right z-10">
              <h2 className="text-[#1a2e5a] text-[24px] font-bold leading-tight drop-shadow-md">
                Browse thousands of properties to buy,<br /> sell, or rent <br /> with trusted agents.
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 font-medium text-sm">
        Loading…
      </div>
    }>
      <SignInForm />
    </Suspense>
  );
}
