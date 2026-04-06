'use client';
import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, AlertCircle, Home, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

const PASSWORD_RULES = [
  { test: (p: string) => p.length >= 8,   label: 'At least 8 characters' },
  { test: (p: string) => /[A-Z]/.test(p), label: 'One uppercase letter' },
  { test: (p: string) => /[0-9]/.test(p), label: 'One number' },
];

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [otp,         setOtp]         = useState(['', '', '', '', '', '']);
  const [password,    setPassword]    = useState('');
  const [confirm,     setConfirm]     = useState('');
  const [showPass,    setShowPass]    = useState(false);
  const [error,       setError]       = useState('');
  const [loading,     setLoading]     = useState(false);
  const [success,     setSuccess]     = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const passwordValid  = PASSWORD_RULES.every(r => r.test(password));
  const passwordsMatch = password === confirm && confirm.length > 0;

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) setOtp(pasted.split(''));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const code = otp.join('');
    if (code.length !== 6) { setError('Please enter the 6-digit code.'); return; }
    if (!passwordValid) { setError('Please meet all password requirements.'); return; }
    if (!passwordsMatch) { setError('Passwords do not match.'); return; }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, otp: code, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Reset failed. Please try again.');
        return;
      }

      setSuccess(true);
      setTimeout(() => { router.push('/sign-in'); }, 2000);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-slate-500 mb-4">No email address specified.</p>
          <Link href="/forgot-password" className="text-red-700 font-semibold hover:underline">Back to Forgot Password</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-2 group">
            <div className="w-16 h-16 bg-red-700 rounded-xl flex items-center justify-center group-hover:bg-red-600 transition-colors">
              <Home size={30} className="text-white" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-[#1a2e5a]">NAYAB REAL</span>
          </Link>
          <h2 className="text-xl font-bold text-[#1a2e5a] mt-4">Reset Your Password</h2>
          <p className="text-slate-500 text-sm mt-1">We sent a code to <strong className="text-[#1a2e5a]">{email}</strong></p>
        </div>

        {success ? (
          <div className="text-center py-8">
            <div className="w-20 h-20 mx-auto bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <ShieldCheck size={40} className="text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-[#1a2e5a] mb-2">Password Reset!</h2>
            <p className="text-slate-500 text-sm">Your password has been updated. Redirecting to sign in…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Grid */}
            <div className="flex gap-2 justify-center" onPaste={handlePaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={el => { inputRefs.current[i] = el; }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(i, e)}
                  className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl outline-none transition-all ${
                    digit ? 'border-red-500 bg-red-50 text-[#1a2e5a]' : 'border-slate-200 focus:border-red-500'
                  }`}
                />
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-600 block mb-1.5">New Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    placeholder="Min 8 characters"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full border-2 rounded-xl pl-10 pr-12 py-3 text-sm outline-none focus:border-red-500 transition-colors"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {password.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {PASSWORD_RULES.map(rule => {
                      const ok = rule.test(password);
                      return (
                        <li key={rule.label} className={`flex items-center gap-1.5 text-xs ${ok ? 'text-green-600' : 'text-slate-400'}`}>
                          <CheckCircle2 size={12} className={ok ? 'text-green-500' : 'text-slate-300'} /> {rule.label}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-600 block mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="Repeat your new password"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    className={`w-full border-2 rounded-xl pl-10 pr-12 py-3 text-sm outline-none transition-colors ${
                      confirm.length > 0 ? (passwordsMatch ? 'border-green-400' : 'border-red-300') : 'focus:border-red-500'
                    }`}
                  />
                </div>
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
              disabled={loading || !passwordValid || !passwordsMatch}
              className="w-full bg-red-700 hover:bg-red-600 disabled:opacity-60 text-white py-3.5 rounded-xl font-bold text-sm transition-colors"
            >
              {loading ? 'Resetting Password…' : 'Reset & Confirm'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center text-slate-400">Loading…</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
