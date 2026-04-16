'use client';
import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Home, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-slate-500 font-medium mb-4">No email address specified.</p>
          <Link href="/sign-up" className="text-red-700 font-semibold hover:underline">Go to Sign Up</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-8 font-sans">
      <div className="bg-white rounded-[2rem] shadow-xl w-full max-w-[1100px] flex overflow-hidden lg:min-h-[700px]">
        {/* LEFT PANEL */}
        <div className="w-full lg:w-[45%] p-8 sm:p-12 xl:p-14 flex flex-col justify-center bg-white relative shrink-0">
          
          <Link href="/" className="inline-flex flex-row items-center gap-3 mb-12 group self-start">
            <div className="w-12 h-12 bg-red-700 rounded-xl flex items-center justify-center group-hover:bg-red-600 transition-colors">
              <Home size={24} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-[1.1rem] leading-none tracking-tight text-[#1a2e5a]">NAYAB</span>
              <span className="font-extrabold text-[1.1rem] leading-none tracking-tight text-[#1a2e5a]">REAL MARKETING</span>
            </div>
          </Link>

          {success ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 mx-auto bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center mb-4 animate-bounce">
                <ShieldCheck size={40} className="text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#1a2e5a] mb-2 tracking-tight">Email Verified!</h2>
              <p className="text-slate-500 text-[15px] font-medium">Your account is now active. Redirecting you…</p>
            </div>
          ) : (
            <>
              <h1 className="text-[2.2rem] font-bold text-[#1a2e5a] mb-2 tracking-tight leading-tight">Verify Your Email</h1>
              <p className="text-slate-500 text-[15px] font-medium mb-8">
                We sent a 6-digit code to <br className="hidden sm:block"/><strong className="text-[#1a2e5a]">{email}</strong>
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex gap-2 justify-start sm:justify-start" onPaste={handlePaste}>
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
                      className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-[1.5rem] font-bold border rounded-xl outline-none transition-all ${
                        digit
                          ? 'border-[#1a2e5a] bg-white text-[#1a2e5a] shadow-[0_0_0_2px_rgba(26,46,90,0.1)]'
                          : 'border-slate-200 focus:border-[#1a2e5a] focus:bg-white bg-[#f8f9fa]'
                      }`}
                    />
                  ))}
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-100 text-red-700 text-[13px] px-4 py-3 rounded-xl flex items-start gap-2">
                    <AlertCircle size={15} className="mt-0.5 flex-shrink-0" />
                    <span className="font-medium">{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || otp.join('').length !== 6}
                  className="w-full bg-[#1a2e5a] hover:bg-[#112040] disabled:opacity-60 text-white mt-4 py-4 rounded-xl font-semibold text-[15px] transition-colors shadow-sm"
                >
                  {loading ? 'Verifying…' : 'Verify & Continue'}
                </button>
              </form>

              <div className="mt-8 text-left">
                <p className="text-[13px] text-slate-400 font-medium mb-3">Didn't receive the code? Check your spam folder.</p>
                <button
                  onClick={handleResend}
                  disabled={resending || resendCooldown > 0}
                  className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-red-700 hover:text-red-800 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
                >
                  <RefreshCw size={14} className={resending ? 'animate-spin' : ''} />
                  {resending
                    ? 'Sending…'
                    : resendCooldown > 0
                      ? `Resend in ${resendCooldown}s`
                      : 'Resend Code'}
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <p className="text-[14px] font-medium text-slate-500">
                  Wrong email?{' '}
                  <Link href={role === 'seller' ? '/sign-up/seller' : '/sign-up'} className="text-[#1a2e5a] font-semibold hover:underline decoration-[#1a2e5a] underline-offset-4">
                    Go back
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>

        {/* RIGHT PANEL (Image Banner) */}
        <div className="hidden lg:block w-[55%] relative p-4 pl-0 py-5 pr-5 lg:h-[700px] self-center">
          <div className="w-full h-full relative flex items-center justify-center rounded-[2.5rem] overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
              alt="Verification Banner"
              fill
              className="object-cover object-right"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
              priority
            />

            <div className="absolute top-12 right-12 max-w-[340px] text-right z-10">
              <h2 className="text-white text-[28px] font-extrabold leading-[1.2] drop-shadow-md">
                Securely verify your identity to protect your assets.
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 font-medium text-sm">Loading…</div>}>
      <VerifyOtpContent />
    </Suspense>
  );
}
