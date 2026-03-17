'use client';
import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { AlertCircle, CheckCircle, Mail, RefreshCw, Home } from 'lucide-react';
import logo from '@/assets/images/logo.svg';

function VerifyEmailForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const email        = searchParams.get('email') || '';

  const [otp,        setOtp]        = useState(['', '', '', '', '', '']);
  const [error,      setError]      = useState('');
  const [success,    setSuccess]    = useState('');
  const [loading,    setLoading]    = useState(false);
  const [resending,  setResending]  = useState(false);
  const [countdown,  setCountdown]  = useState(60); // seconds before allow resend
  const inputRefs    = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (idx: number, value: string) => {
    // Allow only digits
    const digit = value.replace(/\D/g, '').slice(-1);
    const next  = [...otp];
    next[idx]   = digit;
    setOtp(next);
    setError('');

    // Auto-advance
    if (digit && idx < 5) {
      inputRefs.current[idx + 1]?.focus();
    }

    // Auto-submit when all 6 digits entered
    if (digit && idx === 5 && next.every(d => d !== '')) {
      submitOtp(next.join(''));
    }
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const next = [...otp];
    pasted.split('').forEach((d, i) => { next[i] = d; });
    setOtp(next);
    // Focus last filled or last
    const focusIdx = Math.min(pasted.length, 5);
    inputRefs.current[focusIdx]?.focus();
    if (pasted.length === 6) submitOtp(pasted);
  };

  const submitOtp = async (code: string) => {
    if (loading) return;
    setLoading(true);
    setError('');
    try {
      const res  = await fetch('/api/auth/verify-email', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, otp: code }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Verification failed');
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
        return;
      }

      // Store token
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user',  JSON.stringify(data.user));

      setSuccess('Email verified! Redirecting…');
      setTimeout(() => router.push(data.redirectTo || '/'), 1200);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) { setError('Please enter the 6-digit code'); return; }
    submitOtp(code);
  };

  const handleResend = async () => {
    if (countdown > 0 || resending) return;
    setResending(true);
    setError('');
    try {
      // Hitting the register endpoint with the same email resends the OTP
      const res  = await fetch('/api/auth/register', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        // password is required by the route but won't update existing unverified user's password
        body:    JSON.stringify({ email, name: 'resend', password: 'resend-trigger' }),
      });
      const data = await res.json();
      if (data.requireVerify) {
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
        setCountdown(60);
      } else {
        setError(data.error || 'Could not resend code');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setResending(false);
    }
  };

  const maskedEmail = email
    ? email.replace(/^(.{2}).*(@.*)$/, '$1***$2')
    : 'your email';

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

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-50 border-2 border-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mail size={28} className="text-red-700" />
            </div>
            <h1 className="text-2xl font-extrabold text-[#1a2e5a]">Verify your email</h1>
            <p className="text-slate-500 text-sm mt-2 leading-relaxed">
              We sent a 6-digit code to{' '}
              <span className="font-semibold text-[#1a2e5a]">{maskedEmail}</span>.
              <br />Enter it below — it expires in 15 minutes.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* OTP inputs */}
            <div className="flex gap-3 justify-center mb-6" onPaste={handlePaste}>
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={el => { inputRefs.current[idx] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleChange(idx, e.target.value)}
                  onKeyDown={e => handleKeyDown(idx, e)}
                  disabled={loading}
                  className={`
                    w-12 h-14 text-center text-2xl font-extrabold border-2 rounded-xl
                    outline-none transition-all
                    ${digit
                      ? 'border-red-500 bg-red-50 text-[#1a2e5a]'
                      : 'border-slate-200 text-slate-800 focus:border-red-400'
                    }
                    disabled:opacity-60
                  `}
                />
              ))}
            </div>

            {/* Feedback */}
            {error && (
              <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg flex items-start gap-2 mb-4">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-lg flex items-center gap-2 mb-4">
                <CheckCircle size={16} className="shrink-0" />
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || otp.join('').length !== 6}
              className="w-full bg-red-700 hover:bg-red-600 disabled:opacity-60 text-white py-3 rounded-xl font-bold text-sm transition-colors"
            >
              {loading ? 'Verifying…' : 'Verify Email'}
            </button>
          </form>

          {/* Resend */}
          <div className="text-center mt-5">
            <p className="text-sm text-slate-500">
              Didn't receive the code?{' '}
              {countdown > 0 ? (
                <span className="text-slate-400">
                  Resend in {countdown}s
                </span>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={resending}
                  className="text-red-700 font-semibold hover:underline disabled:opacity-60 inline-flex items-center gap-1"
                >
                  <RefreshCw size={13} className={resending ? 'animate-spin' : ''} />
                  {resending ? 'Sending…' : 'Resend code'}
                </button>
              )}
            </p>
          </div>

          <p className="text-center mt-4 text-sm text-slate-500">
            Wrong email?{' '}
            <Link href="/register" className="text-red-700 font-semibold hover:underline">
              Register again
            </Link>
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

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0f1e3d] flex items-center justify-center text-white">
        Loading…
      </div>
    }>
      <VerifyEmailForm />
    </Suspense>
  );
}
