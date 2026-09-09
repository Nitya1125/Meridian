"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { sendOtp, verifyOtp, signup } from "@/Service/authService";
import { ZapIcon, ShieldIcon, SparklesIcon } from '@/components/Icons';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';
import StripedLoader from '@/components/StripedLoader';

const GoogleIcon = () => (
  <svg width={18} height={18} viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const GitHubIcon = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="#111318">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

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

function Field({ label, type = 'text', value, onChange, placeholder, error, icon, autoFocus }) {
  const [showPw, setShowPw] = useState(false);
  const isPw = type === 'password';

  return (
    <div className="mb-3.5">
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
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-stone-900 text-white shadow-md">
            <span className="font-serif-italic text-2xl leading-none">M</span>
          </div>
          <div>
            <span className="text-2xl font-extrabold text-stone-900 tracking-tight">
              Meridian <span className="font-serif-italic font-normal text-stone-500">Clarity</span> <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-lime-200 text-lime-900 ml-1">PRO</span>
            </span>
            <div className="text-xs text-stone-500 font-medium">Enterprise Workspace System</div>
          </div>
        </div>

        <h1 className="font-serif-italic text-5xl lg:text-6xl text-stone-950 font-normal leading-[1.08] tracking-tight mb-5">
          Start your <span className="text-emerald-700">creative journey</span><br />
          with <span className="text-violet-700">Meridian Workspace</span>.
        </h1>
        <p className="text-sm text-stone-600 leading-relaxed mb-10 max-w-md font-medium">
          Create high-velocity workflows for deliverables, sprint tracking, and team channels.
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
          Free 14-Day Trial
        </span>
      </div>
    </div>
  );
}

function OtpModal({ email, onClose, onSuccess }) {
  const [vals, setVals] = useState(['', '', '', '', '', '']);
  const [verifying, setVerifying] = useState(false);
  const [otpErr, setOtpErr] = useState('');
  const [countdown, setCountdown] = useState(60);
  const refs = useRef([]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown(c => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleChange = (i, v) => {
    if (!/^\d*$/.test(v)) return;
    const next = [...vals];
    next[i] = v.slice(-1);
    setVals(next);
    setOtpErr('');
    if (v && i < 5) refs.current[i + 1]?.focus();
    if (next.every(x => x)) {
      handleVerify(next.join(''));
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
      handleVerify(text);
    }
    e.preventDefault();
  };

  const handleVerify = async (code) => {
    if (code.length !== 6) {
      setOtpErr("Please enter the complete OTP");
      return;
    }

    try {
      setVerifying(true);
      setOtpErr("");

      await verifyOtp({
        email,
        otp: code,
      });

      onSuccess();
    } catch (error) {
      setOtpErr(error.message || "Invalid verification code");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/40 backdrop-blur-sm p-4 transition-all duration-200">
      <div className="w-full max-w-[420px] bg-white rounded-3xl p-8 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 text-stone-400 hover:text-stone-700 bg-transparent border-none text-lg cursor-pointer"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-700 flex items-center justify-center mx-auto mb-4 text-xl font-bold shadow-2xs">
            ✉️
          </div>
          <h3 className="text-2xl font-normal font-serif text-stone-950 tracking-tight mb-1.5">
            Verify your <em className="italic font-serif font-normal">work email</em>
          </h3>
          <p className="text-xs text-stone-500 m-0">
            We&apos;ve sent a 6-digit verification code to <strong className="text-stone-900 font-mono">{email}</strong>.
          </p>
        </div>

        <div className="flex gap-2 justify-center mb-4">
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
                otpErr
                  ? 'border-2 border-rose-400 bg-rose-50/20'
                  : v
                  ? 'border-2 border-stone-900 bg-stone-50'
                  : 'border border-stone-200 bg-white focus:border-stone-400 focus:ring-2 focus:ring-stone-200'
              }`}
            />
          ))}
        </div>

        {otpErr && (
          <p className="text-center text-[11px] text-rose-500 font-semibold mb-4">
            ⚠ {otpErr}
          </p>
        )}

        <div className="mb-6">
          <button
            type="button"
            disabled={verifying}
            onClick={() => handleVerify(vals.join(''))}
            className="w-full py-3 rounded-2xl bg-[#111318] hover:bg-black text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            {verifying ? 'Verifying...' : 'Verify OTP Code'}
          </button>
        </div>

        <div className="text-center text-xs text-stone-500">
          Didn&apos;t receive the code?{' '}
          {countdown > 0 ? (
            <span className="text-stone-400 font-mono">Resend in {countdown}s</span>
          ) : (
            <button
              type="button"
              onClick={() => setCountdown(60)}
              className="bg-transparent border-none text-stone-900 font-bold cursor-pointer hover:underline p-0 text-xs"
            >
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const { demoLogin } = useAuth();
  const [step, setStep] = useState(1);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  const [firstNameErr, setFirstNameErr] = useState('');
  const [lastNameErr, setLastNameErr] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [pwErr, setPwErr] = useState('');
  const [cPwErr, setCPwErr] = useState('');

  const validateEmail = (v) => {
    if (!v) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Please enter a valid email address';
    return '';
  };

  const handleSendOtp = async () => {
    let hasError = false;

    if (!firstName.trim()) {
      setFirstNameErr("First name is required");
      hasError = true;
    }

    if (!lastName.trim()) {
      setLastNameErr("Last name is required");
      hasError = true;
    }

    const eErr = validateEmail(email);
    if (eErr) {
      setEmailErr(eErr);
      hasError = true;
    }

    if (hasError) return;

    try {
      setLoading(true);
      await sendOtp({
        firstName,
        lastName,
        email,
      });
      setShowOtpModal(true);
    } catch (error) {
      setEmailErr(error.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSubmit = async () => {
    let hasError = false;

    if (password.length < 8) {
      setPwErr("At least 8 characters required");
      hasError = true;
    }

    if (password !== confirmPw) {
      setCPwErr("Passwords don't match");
      hasError = true;
    }

    if (hasError) return;

    try {
      setLoading(true);
      await signup({
        firstName,
        lastName,
        email,
        password,
      });
      toast.success('Account created! Please sign in.');
      router.push('/');
    } catch (error) {
      setPwErr(error.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FAF8F5]">
      <LeftPanel />

      <div className="w-full lg:w-[480px] shrink-0 flex items-center justify-center bg-white px-7 py-8 md:px-12 md:py-10 shadow-2xl border-l border-stone-200/80 min-h-screen">
        <div className="w-full max-w-[360px]">

          <div className="mb-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-900 text-white mb-3 shadow-xs">
              <span className="font-serif-italic text-xl leading-none">M</span>
            </div>
            <h2 className="text-[28px] sm:text-[32px] font-extrabold leading-tight tracking-tight text-stone-900 mb-1">
              {step === 3 ? (
                <>Set your <span className="font-serif-italic font-normal text-violet-700">password</span></>
              ) : (
                <>Build something <span className="font-serif-italic font-normal text-violet-700">iconic</span></>
              )}
            </h2>
            <p className="text-xs text-stone-500 font-medium">
              {step === 3 ? 'Secure your workspace account' : 'Free 14-day trial — no credit card required'}
            </p>
          </div>

          {step === 1 && (
            <>
              {/* Instant Demo Sign-In Card for Testing */}
              <div className="mb-4 p-3 rounded-2xl bg-gradient-to-r from-lime-50 via-emerald-50 to-lime-50 border border-lime-300/80 flex items-center justify-between gap-3 shadow-2xs">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-lime-500 animate-pulse" />
                    <span className="text-xs font-bold text-stone-900">Demo Test Access</span>
                    <span className="text-[9px] font-mono font-bold bg-lime-200 text-lime-900 px-1.5 py-0.5 rounded-md">
                      1-CLICK
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 font-medium truncate mt-0.5">
                    Skip signup & test instantly as Alex Johnson
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    demoLogin();
                    toast.success('Signed in with Demo Account!');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#111318] hover:bg-black text-white text-xs font-bold shrink-0 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                >
                  <SparklesIcon size={13} className="text-lime-400" />
                  <span>Demo Sign In</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => router.push('/')}
                  className="py-2.5 px-3 rounded-2xl border border-stone-200 bg-white hover:bg-stone-50 text-xs font-bold text-stone-700 flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer"
                >
                  <GoogleIcon />
                  <span>Google</span>
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/')}
                  className="py-2.5 px-3 rounded-2xl border border-stone-200 bg-white hover:bg-stone-50 text-xs font-bold text-stone-700 flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer"
                >
                  <GitHubIcon />
                  <span>GitHub</span>
                </button>
              </div>

              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-stone-200" />
                <span className="text-[10px] font-bold text-stone-400 font-mono">OR DETAILS</span>
                <div className="flex-1 h-px bg-stone-200" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="First name"
                  value={firstName}
                  onChange={(v) => { setFirstName(v); setFirstNameErr(''); }}
                  placeholder="Alex"
                  error={firstNameErr}
                  autoFocus
                />
                <Field
                  label="Last name"
                  value={lastName}
                  onChange={(v) => { setLastName(v); setLastNameErr(''); }}
                  placeholder="Johnson"
                  error={lastNameErr}
                />
              </div>

              <Field
                label="Work email"
                type="email"
                value={email}
                onChange={(v) => {
                  setEmail(v);
                  setEmailErr('');
                }}
                placeholder="alex@meridian.io"
                error={emailErr}
                icon={<MailIcon />}
              />

              <div className="text-[11px] text-stone-500 mb-4 leading-relaxed font-medium">
                By signing up you agree to Meridian&apos;s{' '}
                <button type="button" className="bg-transparent border-none text-stone-900 font-bold hover:underline cursor-pointer p-0 text-[11px]">
                  Terms of Service
                </button>{' '}
                &{' '}
                <button type="button" className="bg-transparent border-none text-stone-900 font-bold hover:underline cursor-pointer p-0 text-[11px]">
                  Privacy Policy
                </button>
                .
              </div>

              {loading && (
                <div className="mb-3 animate-in fade-in duration-200">
                  <StripedLoader color="purple" size="md" label="Sending verification code..." />
                </div>
              )}

              <button
                type="button"
                disabled={loading}
                onClick={handleSendOtp}
                className="w-full py-3 rounded-2xl bg-[#111318] hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                {loading ? 'Sending OTP code...' : 'Continue with Email'}
                {!loading && <span>→</span>}
              </button>
            </>
          )}

          {step === 3 && (
            <div>
              <div className="mb-4 inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-900 rounded-full px-3 py-1 text-xs font-bold font-mono">
                <span>Email verified ✓</span>
              </div>

              <Field
                label="Password"
                type="password"
                value={password}
                onChange={(v) => {
                  setPassword(v);
                  setPwErr('');
                }}
                placeholder="Create a strong password"
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
                placeholder="Repeat your password"
                error={cPwErr}
                icon={<LockIcon />}
              />

              {loading && (
                <div className="my-3 animate-in fade-in duration-200">
                  <StripedLoader color="green" size="md" label="Setting up workspace account..." />
                </div>
              )}

              <button
                type="button"
                disabled={loading}
                onClick={handleFinalSubmit}
                className="w-full py-3 rounded-2xl bg-[#111318] hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer mt-2"
              >
                {loading ? 'Creating Account...' : 'Complete Workspace Setup'}
                {!loading && <span>→</span>}
              </button>
            </div>
          )}

          <p className="text-center text-xs text-stone-500 font-medium mt-6">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => router.push('/')}
              className="text-xs font-bold text-stone-900 hover:underline cursor-pointer"
            >
              Sign in
            </button>
          </p>

          <div className="flex items-center justify-center gap-1.5 mt-6 text-[11px] text-stone-400 font-medium">
            <ShieldIcon size={13} />
            <span>256-bit SSL encrypted workspace</span>
          </div>

        </div>
      </div>

      {showOtpModal && (
        <OtpModal
          email={email}
          onClose={() => setShowOtpModal(false)}
          onSuccess={() => {
            setShowOtpModal(false);
            setStep(3);
          }}
        />
      )}
    </div>
  );
}