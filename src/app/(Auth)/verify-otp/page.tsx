'use client';
import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Home, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';

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

  // Auto-focus first input
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // only digits
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // single digit
    setOtp(newOtp);

    // Auto-focus next
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
          // OTP expired — clear inputs
          setOtp(['', '', '', '', '', '']);
          inputRefs.current[0]?.focus();
        }
        return;
      }

      // Store auth data
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('auth_user', JSON.stringify(data.user));
      }

      setSuccess(true);
      
      // Redirect after short celebration
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

      setResendCooldown(60); // 60 second cooldown
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
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-slate-500 mb-4">No email address specified.</p>
          <Link href="/sign-up" className="text-red-700 font-semibold hover:underline">Go to Sign Up</Link>
        </div>
      </div>
    );
  }

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
        </div>

        {success ? (
          <div className="text-center py-8">
            <div className="w-20 h-20 mx-auto bg-emerald-100 rounded-full flex items-center justify-center mb-4 animate-bounce">
              <ShieldCheck size={40} className="text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-[#1a2e5a] mb-2">Email Verified!</h2>
            <p className="text-slate-500 text-sm">Your account is now active. Redirecting you…</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-14 h-14 mx-auto bg-blue-50 rounded-full flex items-center justify-center mb-3">
                <ShieldCheck size={28} className="text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-[#1a2e5a]">Verify Your Email</h2>
              <p className="text-slate-500 text-sm mt-1">
                We sent a 6-digit code to<br />
                <strong className="text-[#1a2e5a]">{email}</strong>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* OTP Input Grid */}
              <div className="flex gap-2 justify-center" onPaste={handlePaste}>
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
                    className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl outline-none transition-all ${
                      digit
                        ? 'border-red-500 bg-red-50 text-[#1a2e5a]'
                        : 'border-slate-200 focus:border-red-500'
                    }`}
                  />
                ))}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 rounded-xl flex items-start gap-2">
                  <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || otp.join('').length !== 6}
                className="w-full bg-red-700 hover:bg-red-600 disabled:opacity-60 text-white py-3.5 rounded-xl font-bold text-sm transition-colors"
              >
                {loading ? 'Verifying…' : 'Verify & Continue'}
              </button>
            </form>

            {/* Resend Section */}
            <div className="mt-5 text-center">
              <p className="text-xs text-slate-400 mb-2">Didn&apos;t receive the code? Check your spam folder.</p>
              <button
                onClick={handleResend}
                disabled={resending || resendCooldown > 0}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-700 hover:text-red-600 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
              >
                <RefreshCw size={14} className={resending ? 'animate-spin' : ''} />
                {resending
                  ? 'Sending…'
                  : resendCooldown > 0
                    ? `Resend in ${resendCooldown}s`
                    : 'Resend Code'}
              </button>
            </div>

            <p className="mt-5 text-center text-sm text-slate-500">
              Wrong email?{' '}
              <Link href={role === 'seller' ? '/sign-up/seller' : '/sign-up'} className="text-red-700 font-semibold hover:underline">
                Go back
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-slate-400">Loading…</p>
      </div>
    }>
      <VerifyOtpContent />
    </Suspense>
  );
}
