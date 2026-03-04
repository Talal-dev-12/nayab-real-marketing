'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Eye, EyeOff, Home, Chrome, AlertCircle } from 'lucide-react';

const ERROR_MESSAGES: Record<string, string> = {
  google_denied: 'Google sign-in was cancelled.',
  token_failed: 'Google authentication failed. Please try again.',
  email_not_verified: 'Your Google email is not verified.',
  not_authorized: 'Your Google account is not authorized. Contact your superadmin.',
  account_disabled: 'Your account has been disabled.',
  server_error: 'A server error occurred. Please try again.',
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    const urlError = searchParams.get('error');
    if (urlError && ERROR_MESSAGES[urlError]) setError(ERROR_MESSAGES[urlError]);
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: credentials.email, password: credentials.password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Login failed'); return; }
      if (data.token) {
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_user', JSON.stringify(data.user));
      }
      router.push('/admin');
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-700 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Home size={30} className="text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#1a2e5a]">NAYAB REAL</h1>
          <p className="text-slate-500 text-sm">Admin Panel Login</p>
        </div>

        <button onClick={handleGoogleLogin} disabled={googleLoading || loading}
          className="w-full flex items-center justify-center gap-3 border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors mb-6 disabled:opacity-60">
          <Chrome size={18} className="text-blue-500" />
          {googleLoading ? 'Redirecting to Google...' : 'Continue with Google'}
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
          <div className="relative flex justify-center text-xs"><span className="bg-white px-3 text-slate-400">or sign in with email</span></div>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-sm font-semibold text-slate-600 block mb-1">Email</label>
            <input type="email" required className="w-full border-2 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-500 transition-colors"
              placeholder="admin@nayabrealmarketing.com" value={credentials.email}
              onChange={e => setCredentials(c => ({ ...c, email: e.target.value }))} />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600 block mb-1">Password</label>
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} required
                className="w-full border-2 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-500 transition-colors pr-12"
                placeholder="Enter password" value={credentials.password}
                onChange={e => setCredentials(c => ({ ...c, password: e.target.value }))} />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          {error && (
            <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg flex items-start gap-2">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />{error}
            </div>
          )}
          <button type="submit" disabled={loading || googleLoading}
            className="w-full bg-red-700 hover:bg-red-600 disabled:opacity-60 text-white py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2">
            <Lock size={16} />
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="mt-6 text-xs text-center text-slate-400">Secured with JWT. Contact your superadmin if you need access.</p>
      </div>
    </div>
  );
}

export default function AdminLogin() {
  return <Suspense fallback={<div className="min-h-screen bg-[#0f1e3d] flex items-center justify-center text-white">Loading...</div>}><LoginForm /></Suspense>;
}
