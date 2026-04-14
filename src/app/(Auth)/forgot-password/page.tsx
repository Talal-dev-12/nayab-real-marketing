'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, Home, ArrowLeft, Send } from 'lucide-react';
import Image from 'next/image';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Request failed. Please try again.');
        return;
      }

      setSuccess(true);
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-8 font-sans">
      <div className="bg-white rounded-[2rem] shadow-xl w-full max-w-[1100px] flex overflow-hidden lg:min-h-[700px]">
        {/* LEFT PANEL */}
        <div className="w-full lg:w-[45%] p-8 sm:p-12 xl:p-14 flex flex-col justify-center bg-white relative shrink-0">

          <Link href="/" className="inline-flex flex-row items-center gap-3 mb-10 group self-start">
            <div className="w-12 h-12 bg-red-700 rounded-xl flex items-center justify-center group-hover:bg-red-600 transition-colors">
              <Home size={24} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-[1.1rem] leading-none tracking-tight text-[#1a2e5a]">NAYAB</span>
              <span className="font-extrabold text-[1.1rem] leading-none tracking-tight text-[#1a2e5a]">REAL MARKETING</span>
            </div>
          </Link>

          {success ? (
            <div className="text-left py-8">
              <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center mb-6">
                <Send size={28} className="text-emerald-600" />
              </div>
              <h2 className="text-[2.2rem] font-bold text-[#1a2e5a] mb-2 tracking-tight leading-tight">Code Sent!</h2>
              <p className="text-slate-500 text-[15px] font-medium mb-6">We've sent a reset code to your email. Redirecting you to the reset page…</p>
            </div>
          ) : (
            <>
              <h1 className="text-[2.5rem] font-bold text-[#1a2e5a] mb-2 tracking-tight leading-tight">Forgot Password?</h1>
              <p className="text-slate-500 text-[15px] font-medium mb-8">Enter your email and we'll send you a reset code to regain access to your account.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="bg-[#f8f9fa] border border-slate-100 rounded-xl px-4 py-2.5 hover:border-slate-300 focus-within:border-[#1a2e5a] focus-within:bg-white transition-colors">
                  <label className="text-[11px] text-slate-400 font-medium block">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-transparent outline-none text-[#1a2e5a] text-[15px] pb-0.5 placeholder:text-slate-400 font-medium"
                    placeholder="you@email.com"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-100 text-red-700 text-[13px] px-4 py-3 rounded-xl flex items-start gap-2">
                    <AlertCircle size={15} className="mt-0.5 shrink-0" />
                    <span className="font-medium">{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1a2e5a] hover:bg-[#112040] disabled:opacity-60 text-white mt-4 py-4 rounded-xl font-semibold text-[15px] transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  {loading ? 'Sending Code…' : (
                    <>
                      <Send size={18} />
                      Send Reset Code
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          <div className="mt-10 pt-6 border-t border-slate-100 text-left">
            <Link href="/sign-in" className="inline-flex items-center gap-2 text-[14px] font-semibold text-slate-500 hover:text-[#1a2e5a] transition-colors">
              <ArrowLeft size={16} /> Back to Sign In
            </Link>
          </div>
        </div>

        {/* RIGHT PANEL (Image Banner) */}
        <div className="hidden lg:block w-[55%] relative p-4 pl-0 py-5 pr-5">
          <div className="w-full h-full relative flex items-center justify-center rounded-[2.5rem] overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
              alt="Forgot Password Banner"
              fill
              className="object-cover object-right"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
              priority
            />

            <div className="absolute top-12 right-12 max-w-[340px] text-right z-10">
              <h2 className="text-white text-[28px] font-extrabold leading-[1.2] drop-shadow-md">
                We'll help you get right back to finding your next home.
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
