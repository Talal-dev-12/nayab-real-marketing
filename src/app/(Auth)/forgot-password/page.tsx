'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, AlertCircle, Home, ArrowLeft, Send } from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email,    setEmail]   = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Request failed. Please try again.');
        return;
      }

      setSuccess(true);
      // Wait 2 seconds then redirect to reset-password with email in query
      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      }, 2000);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-2 group">
            <div className="w-16 h-16 bg-red-700 rounded-xl flex items-center justify-center group-hover:bg-red-600 transition-colors">
              <Home size={30} className="text-white" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-[#1a2e5a]">NAYAB REAL</span>
          </Link>
          <h2 className="text-xl font-bold text-[#1a2e5a] mt-4">Forgot Password?</h2>
          <p className="text-slate-500 text-sm mt-1">Enter your email and we&apos;ll send you a reset code</p>
        </div>

        {success ? (
          <div className="text-center py-6 bg-emerald-50 rounded-2xl border border-emerald-100 mb-6">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Send size={24} className="text-emerald-600" />
            </div>
            <p className="text-emerald-800 font-bold mb-1">Code sent successfully!</p>
            <p className="text-emerald-600 text-xs">Redirecting to reset page…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-600 block mb-1.5">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full border-2 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-red-500 transition-colors"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 rounded-xl flex items-start gap-2">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-700 hover:bg-red-600 disabled:opacity-60 text-white py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
            >
              {loading ? 'Sending…' : (
                <>
                  <Send size={16} />
                  Send Reset Code
                </>
              )}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link href="/sign-in" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-red-700 transition-colors">
            <ArrowLeft size={14} /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
