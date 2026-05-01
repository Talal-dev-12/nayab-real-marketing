'use client';
import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Home, ShieldCheck, AlertCircle, RefreshCw, ArrowRight } from 'lucide-react';
import Image from 'next/image';

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const role  = searchParams.get('role')  || 'user';

  const [otp, setOtp]             = useState(['', '', '', '', '', '']);
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [success, setSuccess]     = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const code = otp.join('');
    if (code.length !== 6) {
      setError('Please enter the complete 6-digit code.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, otp: code }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Verification failed.');
        if (res.status === 410) {
          setOtp(['', '', '', '', '', '']);
          inputRefs.current[0]?.focus();
        }
        return;
      }

      if (data.token) {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('auth_user', JSON.stringify(data.user));
      }

      setSuccess(true);
      
      setTimeout(() => {
        const finalRedirect = searchParams.get('redirect') || data.redirectTo || '/';
        router.push(finalRedirect);
      }, 1500);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setResending(true);
    setError('');

    try {
      const res = await fetch('/api/auth/resend-otp', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Could not resend code.');
        return;
      }

      setResendCooldown(60);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch {
      setError('Network error.');
    } finally {
      setResending(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen bg-[#f4f7f6] flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md w-full">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={40} />
          </div>
          <h2 className="text-2xl font-bold text-[#1a2e5a] mb-2">Missing Email</h2>
          <p className="text-slate-500 font-medium mb-8">We couldn't find an email address to verify. Please restart the process.</p>
          <Link href="/sign-up" className="inline-flex items-center justify-center w-full bg-red-600 text-white font-bold py-4 rounded-xl hover:bg-red-700 transition-colors">
            Go to Sign Up
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7f6] flex items-center justify-center p-4 sm:p-8 font-sans">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-[1100px] flex overflow-hidden lg:min-h-[700px] border border-white/50 relative">
        
        {/* Subtle background glow effect */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />

        {/* LEFT PANEL */}
        <div className="w-full lg:w-[50%] p-8 sm:p-12 xl:pr-14 xl:pl-14 flex flex-col justify-center bg-white relative shrink-0 z-10">
          
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
            <div className="text-center py-8 animate-in zoom-in duration-500">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-xl shadow-emerald-500/30 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <ShieldCheck size={48} className="text-white" />
              </div>
              <h2 className="text-[2.2rem] font-extrabold text-[#1a2e5a] mb-3 tracking-tight">Identity Verified!</h2>
              <p className="text-slate-500 text-[16px] font-medium max-w-xs mx-auto">
                Your account is fully secured. We're setting everything up for you...
              </p>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-[2.5rem] font-extrabold text-[#1a2e5a] mb-3 tracking-tight leading-tight">Verify Email</h1>
              <p className="text-slate-500 text-[15px] font-medium mb-10 leading-relaxed">
                We sent a 6-digit verification code to <br className="hidden sm:block"/>
                <span className="inline-flex items-center gap-2 px-3 py-1 mt-2 bg-blue-50 text-[#1a2e5a] font-bold rounded-lg border border-blue-100">
                  {email}
                </span>
              </p>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="flex gap-2 sm:gap-3 justify-between" onPaste={handlePaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={el => { inputRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleChange(i, e.target.value)}
                      onKeyDown={e => handleKeyDown(i, e)}
                      className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-[1.5rem] font-bold rounded-xl outline-none transition-all duration-200 transform focus:-translate-y-1 ${
                        digit
                          ? 'border-2 border-[#1a2e5a] bg-white text-[#1a2e5a] shadow-lg shadow-blue-900/10'
                          : 'border-2 border-slate-200 focus:border-[#1a2e5a] focus:bg-white bg-slate-50 text-slate-700'
                      }`}
                    />
                  ))}
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-100 text-red-700 text-[13px] px-4 py-3 rounded-xl flex items-start gap-2 animate-in fade-in zoom-in-95">
                    <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                    <span className="font-medium">{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || otp.join('').length !== 6}
                  className="w-full bg-gradient-to-r from-[#1a2e5a] to-[#2a447a] hover:from-[#112040] hover:to-[#1a2e5a] disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-[16px] transition-all duration-300 shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                    </span>
                  ) : (
                    <>
                      <span>Verify & Continue</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <button
                  onClick={handleResend}
                  disabled={resending || resendCooldown > 0}
                  className="group inline-flex items-center justify-center gap-2 text-[14px] font-bold text-slate-500 hover:text-red-600 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors px-4 py-2 rounded-lg hover:bg-red-50"
                >
                  <RefreshCw size={16} className={`${resending ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                  {resending
                    ? 'Sending...'
                    : resendCooldown > 0
                      ? `Resend in ${resendCooldown}s`
                      : 'Resend Code'}
                </button>
                
                <p className="text-[14px] font-medium text-slate-500 text-center sm:text-right">
                  Wrong email?{' '}
                  <Link href={role === 'seller' ? '/sign-up/seller' : '/sign-up'} className="text-[#1a2e5a] font-bold hover:underline decoration-2 underline-offset-4">
                    Change it
                  </Link>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANEL (Image Banner) */}
        <div className="hidden lg:block w-[50%] relative p-4 pl-0 py-4 pr-4 self-center h-full min-h-[700px]">
          <div className="w-full h-full relative flex items-center justify-center rounded-[2rem] overflow-hidden shadow-inner group">
            <Image
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
              alt="Verification Banner"
              fill
              unoptimized
              className="object-cover transform group-hover:scale-105 transition-transform duration-1000"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1a2e5a]/20 to-[#1a2e5a]/90" />

            <div className="absolute bottom-12 left-12 right-12 z-10">
              <h2 className="text-white text-[32px] font-extrabold leading-[1.2] drop-shadow-lg mb-4">
                Unlock your <br/> Property Journey
              </h2>
              <div className="w-12 h-1 bg-red-500 rounded-full mb-4"></div>
              <p className="text-white/90 text-[15px] font-medium max-w-sm">
                Join thousands of verified users finding their dream homes and premium investments.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f4f7f6] flex items-center justify-center text-slate-500 font-medium">Loading secure environment...</div>}>
      <VerifyOtpContent />
    </Suspense>
  );
}
