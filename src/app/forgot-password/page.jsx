"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ZapIcon, ShieldIcon, CheckIcon } from '@/components/Icons';
import { toast } from 'react-hot-toast';

/* ── Tiny Icons ── */
const MailIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
  </svg>
);

const LockIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const EyeIcon = ({ open }) => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </>
    )}
  </svg>
);

/* ── Password Strength Bar ── */
function PasswordStrength({ password }) {
  const checks = [
    { ok: password.length >= 8, label: '8+ characters' },
    { ok: /[A-Z]/.test(password), label: 'Uppercase' },
    { ok: /\d/.test(password), label: 'Number' },
    { ok: /[^a-zA-Z0-9]/.test(password), label: 'Symbol' },
  ];
  const score = checks.filter(c => c.ok).length;
  const colorClass = score <= 1 ? 'bg-rose-500' : score === 2 || score === 3 ? 'bg-amber-500' : 'bg-emerald-500';
  const textColorClass = score <= 1 ? 'text-rose-500' : score === 2 || score === 3 ? 'text-amber-500' : 'text-emerald-600';
  const label = ['', 'Weak', 'Fair', 'Good', 'Strong'][score];

  if (!password) return null;

  return (
    <div className="mt-1.5 mb-3">
      <div className="flex gap-1 mb-1.5">
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className={`h-[3px] flex-1 rounded-full transition-colors duration-300 ${i < score ? colorClass : 'bg-stone-200'}`}
          />
        ))}
      </div>
      <div className="flex gap-2.5 flex-wrap">
        {checks.map(c => (
          <span
            key={c.label}
            className={`text-[11px] flex items-center gap-0.5 ${c.ok ? 'text-emerald-600 font-semibold' : 'text-stone-400'}`}
          >
            <span>{c.ok ? '✓' : '○'}</span>
            {c.label}
          </span>
        ))}
        {score > 0 && (
          <span className={`text-[11px] font-bold ml-auto ${textColorClass}`}>
            {label}
          </span>
        )}
      </div>
    </div>
  );
}

/* ── OTP Input ── */
function OtpInput({ onComplete, hasError }) {
  const [vals, setVals] = useState(['', '', '', '', '', '']);
  const refs = useRef([]);

  const handleChange = (i, v) => {
    if (!/^\d*$/.test(v)) return;
    const next = [...vals];
    next[i] = v.slice(-1);
    setVals(next);
    if (v && i < 5) refs.current[i + 1]?.focus();
    if (next.every(x => x)) {
      onComplete(next.join(''));
    }
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !vals[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const handlePaste = (e) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (text.length === 6) {
      setVals(text.split(''));
      refs.current[5]?.focus();
      onComplete(text);
    }
    e.preventDefault();
  };

  return (
    <div className="flex gap-2 justify-center my-5">
      {vals.map((v, i) => (
        <input
          key={i}
          ref={el => { refs.current[i] = el; }}
          value={v}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          onPaste={handlePaste}
          maxLength={1}
          autoFocus={i === 0}
          className={`w-[46px] h-[54px] rounded-2xl text-center text-xl font-bold font-mono text-stone-900 outline-none transition-all ${
            hasError
              ? 'border-2 border-rose-400 bg-rose-50/20'
              : v
              ? 'border-2 border-stone-900 bg-stone-50'
              : 'border border-stone-200 bg-white focus:border-stone-400 focus:ring-2 focus:ring-stone-200'
          }`}
        />
      ))}
    </div>
  );
}

function Countdown({ onResend }) {
  const [t, setT] = useState(300);

  useEffect(() => {
    if (t <= 0) return;
    const id = setTimeout(() => setT(x => x - 1), 1000);
    return () => clearTimeout(id);
  }, [t]);

  const mm = String(Math.floor(t / 60)).padStart(2, '0');
  const ss = String(t % 60).padStart(2, '0');

  return (
    <div className="text-center text-xs text-stone-500 mt-4">
      {t > 0 ? (
        <>
          Code expires in{' '}
          <span className={`font-mono font-bold ${t < 60 ? 'text-rose-500' : 'text-stone-900'}`}>
            {mm}:{ss}
          </span>
        </>
      ) : (
        <button
          type="button"
          onClick={() => { setT(300); onResend(); }}
          className="bg-transparent border-none text-stone-900 font-bold text-xs cursor-pointer hover:underline"
        >
          Resend code →
        </button>
      )}
      {t > 0 && (
        <div className="mt-1.5">
          Didn&apos;t receive it?{' '}
          <button
            type="button"
            onClick={() => { setT(300); onResend(); }}
            className="bg-transparent border-none text-stone-900 font-bold text-xs cursor-pointer hover:underline"
          >
            Resend
          </button>
        </div>
      )}
    </div>
  );
}

function Field({ label, type = 'text', value, onChange, placeholder, error, icon, autoFocus }) {
  const [showPw, setShowPw] = useState(false);
  const isPw = type === 'password';

  return (
    <div className="mb-4">
      <label className="block text-xs font-bold text-stone-700 mb-1.5">{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
            {icon}
          </div>
        )}
        <input
          autoFocus={autoFocus}
          type={isPw && showPw ? 'text' : type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full py-2.5 text-xs font-medium text-stone-900 bg-white rounded-2xl border outline-none font-sans transition-all ${
            isPw ? 'pr-10' : 'pr-3.5'
          } ${icon ? 'pl-10' : 'pl-3.5'} ${
            error
              ? 'border-rose-400 ring-2 ring-rose-200'
              : 'border-stone-200 focus:border-stone-400 focus:ring-2 focus:ring-stone-200'
          }`}
        />
        {isPw && (
          <button
            type="button"
            onClick={() => setShowPw(p => !p)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 text-stone-400 hover:text-stone-600 bg-transparent border-none cursor-pointer"
          >
            <EyeIcon open={showPw} />
          </button>
        )}
      </div>
      {error && <div className="text-[11px] text-rose-500 mt-1 font-semibold">⚠ {error}</div>}
    </div>
  );
}

function LeftPanel() {
  const features = [
    { icon: '⊞', title: 'Interactive Kanban Boards', sub: 'Pastel swimlanes & subtask progress', bg: 'bg-[#EDE9FE] text-[#6D28D9]' },
    { icon: '◎', title: 'Sprint Velocity Tracking', sub: 'Burn-up metrics & capacity planning', bg: 'bg-[#ECFCCB] text-[#3F6212]' },
    { icon: '▦', title: 'High-Impact Analytics', sub: 'Live speedometers & member velocity', bg: 'bg-[#FFEDD5] text-[#C2410C]' },
    { icon: '◫', title: 'Team Directory & Presence', sub: 'Real-time channels & hours tracking', bg: 'bg-[#E0F2FE] text-[#0369A1]' },
  ];

  return (
    <div className="hidden lg:flex flex-1 min-h-screen bg-gradient-to-br from-[#FAF8F5] via-[#F4F0E6] to-[#EBE5D8] relative p-12 lg:p-14 flex-col overflow-hidden justify-between border-r border-stone-200/80">
      <div>
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-2xl bg-[#111318] flex items-center justify-center text-white shadow-md">
            <ZapIcon size={20} strokeWidth={2.5} className="text-lime-400" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-stone-900 tracking-tight">
              Meridian <em className="font-serif italic font-normal text-stone-700">Clarity</em>
            </span>
            <div className="text-xs text-stone-500 font-medium">Enterprise Workspace System</div>
          </div>
        </div>

        <h1 className="font-serif text-5xl lg:text-6xl text-stone-950 font-normal leading-[1.08] tracking-tight mb-5">
          Recover your <em className="italic font-normal font-serif text-stone-900 underline decoration-lime-400 decoration-wavy decoration-2">workspace access</em><br />
          in seconds.
        </h1>
        <p className="text-sm text-stone-600 leading-relaxed mb-10 max-w-md font-medium">
          Follow the simple steps to reset your security credentials and resume sprint delivery.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-xl">
          {features.map((f, i) => (
            <div key={i} className="p-4 rounded-3xl bg-white/85 backdrop-blur-sm border border-stone-200/80 shadow-2xs hover:shadow-xs transition-shadow">
              <div className={`w-8 h-8 rounded-xl ${f.bg} flex items-center justify-center text-sm font-bold mb-2 shadow-2xs`}>
                {f.icon}
              </div>
              <div className="text-xs font-bold text-stone-900 leading-snug">{f.title}</div>
              <div className="text-[11px] text-stone-500 mt-1">{f.sub}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 bg-white/90 backdrop-blur-md rounded-3xl p-5 border border-stone-200 shadow-sm flex items-center justify-between max-w-xl">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {['SC', 'AJ', 'MW', 'KV'].map((init, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-2xs"
                style={{ backgroundColor: ['#6366f1', '#8b5cf6', '#10b981', '#f43f5e'][i] }}
              >
                {init}
              </div>
            ))}
          </div>
          <div className="text-xs text-stone-600">
            Trusted by <strong className="text-stone-900 font-bold">12,000+</strong> product teams worldwide
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-lime-800 bg-lime-100 px-2.5 py-1 rounded-full">
          256-bit Security
        </span>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState('request'); // 'request' | 'verify' | 'reset' | 'success'
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [otpErr, setOtpErr] = useState(false);
  const [emailErr, setEmailErr] = useState('');
  const [pwErr, setPwErr] = useState('');
  const [cPwErr, setCPwErr] = useState('');

  const load = (fn) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (fn) fn();
    }, 800);
  };

  const validateEmail = (v) => {
    if (!v) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Please enter a valid email address';
    return '';
  };

  return (
    <div className="flex min-h-screen bg-[#FAF8F5]">
      <LeftPanel />

      <div className="w-full lg:w-[480px] shrink-0 flex items-center justify-center bg-white px-7 py-8 md:px-12 md:py-10 shadow-2xl border-l border-stone-200/80 min-h-screen">
        <div className="w-full max-w-[360px]">

          {step === 'request' && (
            <div>
              <button
                type="button"
                onClick={() => router.push('/')}
                className="bg-transparent border-none text-stone-500 hover:text-stone-900 text-xs font-bold cursor-pointer mb-5 p-0"
              >
                ← Back to sign in
              </button>
              <div className="mb-6">
                <h2 className="text-3xl font-normal font-serif text-stone-950 tracking-tight mb-1">
                  Forgot your <em className="italic font-serif font-normal text-stone-900">password?</em>
                </h2>
                <p className="text-xs text-stone-500 font-medium">
                  We&apos;ll send a 6-digit recovery code to your inbox
                </p>
              </div>

              <Field
                label="Email address"
                type="email"
                value={email}
                onChange={(v) => {
                  setEmail(v);
                  setEmailErr('');
                }}
                placeholder="alex@meridian.io"
                error={emailErr}
                icon={<MailIcon />}
                autoFocus
              />

              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  const e = validateEmail(email);
                  if (e) {
                    setEmailErr(e);
                    return;
                  }
                  load(() => {
                    toast.success('Reset code sent to your email!');
                    setStep('verify');
                  });
                }}
                className="w-full py-3 rounded-2xl bg-[#111318] hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                {loading ? 'Sending code...' : 'Send Recovery Code'}
                {!loading && <span>→</span>}
              </button>
            </div>
          )}

          {step === 'verify' && (
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-4 text-xl shadow-2xs">
                🔒
              </div>
              <h2 className="text-2xl font-normal font-serif text-stone-950 mb-1">
                Enter <em className="italic font-serif font-normal text-stone-900">reset code</em>
              </h2>
              <p className="text-xs text-stone-500 mb-4">
                Sent to <strong className="text-stone-900 font-mono">{email || 'your email'}</strong>
              </p>

              <OtpInput
                hasError={otpErr}
                onComplete={(otp) => {
                  if (otp === '000000') {
                    setOtpErr(true);
                    return;
                  }
                  setOtpErr(false);
                  setStep('reset');
                }}
              />

              {otpErr && (
                <p className="text-rose-500 text-[11px] font-semibold mb-3">
                  ⚠ Invalid code. Please try again.
                </p>
              )}

              <Countdown onResend={() => toast.success('New code sent!')} />

              <div className="mt-5">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setStep('reset')}
                  className="w-full py-3 rounded-2xl bg-[#111318] hover:bg-black text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Verify & Continue
                </button>
              </div>
            </div>
          )}

          {step === 'reset' && (
            <div>
              <div className="mb-6">
                <h2 className="text-3xl font-normal font-serif text-stone-950 tracking-tight mb-1">
                  Create <em className="italic font-serif font-normal text-stone-900">new password</em>
                </h2>
                <p className="text-xs text-stone-500 font-medium">
                  Must be at least 8 characters with upper, number and symbol
                </p>
              </div>

              <Field
                label="New password"
                type="password"
                value={password}
                onChange={(v) => {
                  setPassword(v);
                  setPwErr('');
                }}
                placeholder="New strong password"
                error={pwErr}
                icon={<LockIcon />}
                autoFocus
              />

              {password && <PasswordStrength password={password} />}

              <Field
                label="Confirm password"
                type="password"
                value={confirmPw}
                onChange={(v) => {
                  setConfirmPw(v);
                  setCPwErr('');
                }}
                placeholder="Confirm password"
                error={cPwErr}
                icon={<LockIcon />}
              />

              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  if (password.length < 8) {
                    setPwErr('At least 8 characters');
                    return;
                  }
                  if (password !== confirmPw) {
                    setCPwErr("Passwords don't match");
                    return;
                  }
                  load(() => {
                    toast.success('Password reset successfully!');
                    setStep('success');
                  });
                }}
                className="w-full py-3 rounded-2xl bg-[#111318] hover:bg-black text-white font-bold text-xs shadow-md transition-all cursor-pointer mt-2"
              >
                {loading ? 'Updating Password...' : 'Save New Password'}
              </button>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center pt-2">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-5 shadow-2xs">
                <CheckIcon size={28} strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl font-normal font-serif text-stone-950 mb-2">
                Password <em className="italic font-serif font-normal text-stone-900">updated!</em>
              </h2>
              <p className="text-xs text-stone-500 mb-6 leading-relaxed">
                Your password has been changed. You can now sign in with your updated credentials.
              </p>
              <button
                type="button"
                onClick={() => router.push('/')}
                className="w-full py-3 rounded-2xl bg-[#111318] hover:bg-black text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Return to Sign In
              </button>
            </div>
          )}

          <div className="flex items-center justify-center gap-1.5 mt-6 text-[11px] text-stone-400 font-medium">
            <ShieldIcon size={13} />
            <span>256-bit SSL encrypted recovery</span>
          </div>

        </div>
      </div>
    </div>
  );
}