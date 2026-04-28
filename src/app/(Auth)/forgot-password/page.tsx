'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, Home, ArrowLeft, Send, ShieldCheck } from 'lucide-react';
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
    <div className="min-h-screen bg-[#f4f7f6] flex items-center justify-center p-4 sm:p-8 font-sans">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-[1100px] flex overflow-hidden lg:min-h-[700px] border border-white/50 relative">

        {/* Subtle background glow effect */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />

        {/* LEFT PANEL */}
        <div className="w-full lg:w-[45%] p-8 sm:p-12 xl:pr-12 xl:pl-12 flex flex-col justify-center bg-white relative shrink-0 z-10">
          {/* Logo element matched to theme */}
          <Link href="/" className="inline-flex flex-row items-center gap-3 mb-10 group self-start">
            <div className="w-12 h-12 bg-gradient-to-br from-red-700 to-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30 group-hover:shadow-red-500/50 transition-all duration-300 transform group-hover:-translate-y-1">
              <Home size={24} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-[1.2rem] leading-none tracking-tight text-[#1a2e5a]">NAYAB</span>
              <span className="font-bold text-[0.85rem] leading-none tracking-widest text-red-600 uppercase">Real Marketing</span>
            </div>
          </Link>

          {success ? (
            <div className="text-left py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-emerald-500/30">
                <Send size={32} className="text-white ml-[-2px] mt-[2px]" />
              </div>
              <h2 className="text-[2.2rem] font-extrabold text-[#1a2e5a] mb-3 tracking-tight leading-tight">Check your inbox!</h2>
              <p className="text-slate-500 text-[16px] font-medium mb-6 leading-relaxed">
                We've sent a secure reset code to <span className="text-[#1a2e5a] font-bold">{email}</span>. Redirecting you to the reset page...
              </p>

              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-3 text-sm text-slate-400">
                <ShieldCheck size={18} className="text-emerald-500" />
                <span>Your account security is our top priority.</span>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-[2.5rem] font-extrabold text-[#1a2e5a] mb-2 tracking-tight leading-tight">Forgot Password?</h1>
              <p className="text-slate-500 text-[15px] font-medium mb-10 leading-relaxed">
                Don't worry! Enter your email address below and we'll send you a verification code to securely regain access.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400 group-focus-within:text-red-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none text-[#1a2e5a] text-[15px] font-medium placeholder:text-slate-400 focus:border-red-500 focus:bg-white transition-all shadow-sm"
                    placeholder="Enter your email address"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-100 text-red-700 text-[13px] px-4 py-3 rounded-xl flex items-start gap-2 animate-in fade-in zoom-in-95">
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    <span className="font-medium">{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full bg-gradient-to-r from-[#1a2e5a] to-[#2a447a] hover:from-[#112040] hover:to-[#1a2e5a] disabled:opacity-70 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-[15px] transition-all duration-300 shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending Code...
                    </span>
                  ) : (
                    <>
                      <span>Send Recovery Code</span>
                      <ArrowLeft size={18} className="rotate-180" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          <div className="mt-auto pt-10 text-left">
            <Link href="/sign-in" className="inline-flex items-center gap-2 text-[14px] font-bold text-slate-400 hover:text-[#1a2e5a] transition-colors group">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-[#1a2e5a] group-hover:text-white transition-colors">
                <ArrowLeft size={16} />
              </div>
              Back to Login
            </Link>
          </div>
        </div>

        {/* RIGHT PANEL (Image Banner) */}
        <div className="hidden lg:block w-[55%] relative lg:h-[700px] self-center p-4">
          <div className="w-full h-full relative flex items-center justify-center rounded-[2rem] overflow-hidden">
            <Image
              src="/images/forgotpassword.avif"
              alt="forgot password banner"
              fill
              className="object-fill"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
              priority
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a2e5a]/90 via-[#1a2e5a]/40 to-transparent" />

            {/* Glassmorphic info card */}
            <div className="absolute bottom-12 left-12 right-12 bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-2xl transform transition-transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck size={24} className="text-white" />
              </div>
              <h2 className="text-white text-[24px] font-extrabold leading-tight mb-2">
                Secure & Trusted <br /> Real Estate Platform
              </h2>
              <p className="text-white/80 text-sm font-medium leading-relaxed">
                We use bank-level security to protect your data and property listings. Your information is always safe with Nayab Real Marketing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
