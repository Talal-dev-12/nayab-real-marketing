'use client';
import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, AlertCircle, Home, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

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
  const [showConfirm, setShowConfirm] = useState(false);
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-slate-500 font-medium mb-4">No email address specified.</p>
          <Link href="/forgot-password" className="text-red-700 font-semibold hover:underline">Back to Forgot Password</Link>
        </div>
      </div>
    );
  }

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
                <ShieldCheck size={28} className="text-emerald-600" />
              </div>
              <h2 className="text-[2.2rem] font-bold text-[#1a2e5a] mb-2 tracking-tight leading-tight">Password Reset!</h2>
              <p className="text-slate-500 text-[15px] font-medium mb-6">Your password has been successfully updated. Redirecting to sign in…</p>
            </div>
          ) : (
            <>
              <h1 className="text-[2.5rem] font-bold text-[#1a2e5a] mb-2 tracking-tight leading-tight">Reset Password</h1>
              <p className="text-slate-500 text-[15px] font-medium mb-8">We sent a 6-digit code to <br className="hidden sm:block"/><strong className="text-[#1a2e5a]">{email}</strong></p>

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* OTP Input Grid */}
                <div className="pb-4">
                   <label className="text-[12px] text-slate-500 font-semibold uppercase tracking-wide block mb-3">Verification Code</label>
                   <div className="flex gap-2 justify-start sm:justify-start" onPaste={handlePaste}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={el => { inputRefs.current[i] = el; }}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleOtpChange(i, e.target.value)}
                        onKeyDown={e => handleOtpKeyDown(i, e)}
                        className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-[1.5rem] font-bold border rounded-xl outline-none transition-all ${
                          digit
                            ? 'border-[#1a2e5a] bg-white text-[#1a2e5a] shadow-[0_0_0_2px_rgba(26,46,90,0.1)]'
                            : 'border-slate-200 focus:border-[#1a2e5a] focus:bg-white bg-[#f8f9fa]'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="bg-[#f8f9fa] border border-slate-100 rounded-xl px-4 py-2 hover:border-slate-300 focus-within:border-[#1a2e5a] focus-within:bg-white transition-colors relative">
                  <label className="text-[11px] text-slate-400 font-medium block">New Password</label>
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-transparent outline-none text-[#1a2e5a] text-[15px] pb-0.5 font-medium tracking-wider placeholder:text-slate-400 placeholder:tracking-normal"
                    placeholder="••••••••••••••••"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                
                {password.length > 0 && (
                  <ul className="space-y-1 px-1">
                    {PASSWORD_RULES.map(rule => {
                      const ok = rule.test(password);
                      return (
                        <li key={rule.label} className={`flex items-center gap-1.5 text-xs ${ok ? 'text-emerald-600' : 'text-slate-400'}`}>
                          <CheckCircle2 size={12} className={ok ? 'text-emerald-500' : 'text-slate-300'} /> {rule.label}
                        </li>
                      );
                    })}
                  </ul>
                )}

                <div className="bg-[#f8f9fa] border border-slate-100 rounded-xl px-4 py-2 hover:border-slate-300 focus-within:border-[#1a2e5a] focus-within:bg-white transition-colors relative">
                  <label className="text-[11px] text-slate-400 font-medium block">Confirm Password</label>
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    required
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    className="w-full bg-transparent outline-none text-[#1a2e5a] text-[15px] pb-0.5 font-medium tracking-wider placeholder:text-slate-400 placeholder:tracking-normal"
                    placeholder="••••••••••••••••"
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {confirm.length > 0 && !passwordsMatch && (
                  <p className="text-xs text-red-500 px-1">Passwords do not match</p>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-100 text-red-700 text-[13px] px-4 py-3 rounded-xl flex items-start gap-2 mt-2">
                    <AlertCircle size={15} className="mt-0.5 shrink-0" />
                    <span className="font-medium">{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !passwordValid || !passwordsMatch || otp.join('').length !== 6}
                  className="w-full bg-[#1a2e5a] hover:bg-[#112040] disabled:opacity-60 text-white mt-4 py-4 rounded-xl font-semibold text-[15px] transition-colors shadow-sm"
                >
                  {loading ? 'Resetting Password…' : 'Reset & Confirm'}
                </button>
              </form>
            </>
          )}

          <div className="mt-8 pt-6 border-t border-slate-100 text-left">
            <p className="text-[14px] font-medium text-slate-500">
              Not what you meant to do?{' '}
              <Link href="/sign-in" className="text-[#1a2e5a] font-semibold hover:underline decoration-[#1a2e5a] underline-offset-4">
                Back to Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* RIGHT PANEL (Image Placeholder) */}
        <div className="hidden lg:block w-[55%] relative p-4 pl-0 py-5 pr-5">
          <div className="w-full h-full bg-slate-200 rounded-[2.5rem] rounded-tl-[10rem] rounded-br-[10rem] overflow-hidden relative shadow-[inset_0_0_20px_rgba(0,0,0,0.05)]">
            <div className="absolute top-12 right-12 max-w-[340px] text-right z-10">
              <h2 className="text-[#1a2e5a] text-[28px] font-extrabold leading-[1.2]">
                Your account security is our top priority.
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 font-medium">Loading…</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
