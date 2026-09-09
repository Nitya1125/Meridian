"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { login as loginApi, googleLogin, githubLogin } from '../Service/authService';
import { toast } from 'react-hot-toast';
import { ZapIcon, ArrowRightIcon, CheckIcon, ShieldIcon, SparklesIcon } from '@/components/Icons';
import StripedLoader from '@/components/StripedLoader';

/* ── Tiny Icons ── */
const GoogleIcon = () => (
  <svg width={18} height={18} viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const GitHubIcon = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="#111318">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const MailIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
  </svg>
);

const LockIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

function Field({ label, type = 'text', value, onChange, placeholder, error, icon }) {
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
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full py-2.5 text-xs font-medium text-stone-900 bg-white rounded-2xl border outline-none font-sans transition-all ${icon ? 'pl-10 pr-3.5' : 'px-3.5'
            } ${error
              ? 'border-rose-400 ring-2 ring-rose-200'
              : 'border-stone-200 focus:border-stone-400 focus:ring-2 focus:ring-stone-200'
            }`}
        />
      </div>
      {error && <div className="text-[11px] text-rose-500 mt-1 font-semibold">⚠ {error}</div>}
    </div>
  );
}

function LeftPanel() {
  const features = [
    { icon: '⊞', title: 'Interactive Kanban with Live Mockups', sub: 'Pastel swimlanes, checklist progress & fast triage', bg: 'bg-[#EDE9FE] text-[#6D28D9]' },
    { icon: '◎', title: 'Dynamic Island & Real-time Scheduling', sub: 'Live meetings, sprint counters & video HUD', bg: 'bg-[#ECFCCB] text-[#3F6212]' },
    { icon: '▦', title: 'High-Impact Analytics & Speedometers', sub: 'Burn-up charts, capacity dials & member velocity', bg: 'bg-[#FFEDD5] text-[#C2410C]' },
    { icon: '◫', title: 'Team Directory & Presence Tracking', sub: 'Live hours logged, project spaces & fast chat', bg: 'bg-[#E0F2FE] text-[#0369A1]' },
  ];

  return (
    <div className="hidden lg:flex flex-1 min-h-screen bg-gradient-to-br from-[#FAF8F5] via-[#F4F0E6] to-[#EBE5D8] relative p-12 lg:p-14 flex-col overflow-hidden justify-between border-r border-stone-200/80">
      {/* Brand Header */}
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

        {/* Headline with Instrument Serif Italic Highlights */}
        <h1 className="font-serif-italic text-5xl lg:text-6xl text-stone-950 font-normal leading-[1.08] tracking-tight mb-5">
          Where <span className="text-emerald-700">exceptional</span> teams<br />
          build <span className="text-violet-700">iconic</span> products.
        </h1>
        <p className="text-sm text-stone-600 leading-relaxed mb-10 max-w-md font-medium">
          Meridian brings your deliverables, sprint velocity, calendar schedules, and team channels into one unified, ultra-premium interface.
        </p>

        {/* Features Bento */}
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

      {/* Social Proof */}
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
            Trusted by <strong className="text-stone-900 font-bold">12,000+</strong> product designers & engineering leads
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-lime-800 bg-lime-100 px-2.5 py-1 rounded-full">
          99.9% Uptime
        </span>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { login, demoLogin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [pwErr, setPwErr] = useState('');

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!email) {
      setEmailErr('Email is required');
      return;
    }
    if (!password) {
      setPwErr('Password is required');
      return;
    }

    setLoading(true);
    setEmailErr('');
    setPwErr('');
    try {
      const result = await loginApi({ email, password });
      login(result.user, result.token);
      toast.success('Welcome back!');
      router.push('/dashboard');
    } catch (error) {
      setPwErr(error.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FAF8F5]">
      {/* Left Marketing Banner */}
      <LeftPanel />

      {/* Right Sign-In Panel */}
      <div className="w-full lg:w-[480px] shrink-0 flex items-center justify-center bg-white px-7 py-8 md:px-12 md:py-10 shadow-2xl border-l border-stone-200/80 min-h-screen">
        <div className="w-full max-w-[360px]">

          {/* Header with High-Low Typographic Pairing */}
          <div className="mb-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-900 text-white mb-3 shadow-xs">
              <span className="font-serif-italic text-xl leading-none">M</span>
            </div>
            <h2 className="text-[28px] sm:text-[32px] font-extrabold leading-tight tracking-tight text-stone-900 mb-1">
              Welcome <span className="font-serif-italic font-normal text-violet-700">back</span>
            </h2>
            <p className="text-xs text-stone-500 font-medium">
              Access your team workspace and sprint deliverables
            </p>
          </div>

          {/* Instant Demo Sign-In Card for Testing */}
          <div className="mb-5 p-3 rounded-2xl bg-gradient-to-r from-lime-50 via-emerald-50 to-lime-50 border border-lime-300/80 flex items-center justify-between gap-3 shadow-2xs">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-lime-500 animate-pulse" />
                <span className="text-xs font-bold text-stone-900">Demo Test Access</span>
                <span className="text-[9px] font-mono font-bold bg-lime-200 text-lime-900 px-1.5 py-0.5 rounded-md">
                  1-CLICK
                </span>
              </div>
              <p className="text-[11px] text-stone-600 font-medium truncate mt-0.5">
                Instant test sign-in as Alex Johnson
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

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              onClick={googleLogin}
              type="button"
              className="py-2.5 px-3 rounded-2xl border border-stone-200 bg-white hover:bg-stone-50 text-xs font-bold text-stone-700 flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer active:scale-98"
            >
              <GoogleIcon />
              <span>Google</span>
            </button>
            <button
              onClick={githubLogin}
              type="button"
              className="py-2.5 px-3 rounded-2xl border border-stone-200 bg-white hover:bg-stone-50 text-xs font-bold text-stone-700 flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer active:scale-98"
            >
              <GitHubIcon />
              <span>GitHub</span>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-stone-200" />
            <span className="text-[10px] font-bold text-stone-400 font-mono">OR EMAIL</span>
            <div className="flex-1 h-px bg-stone-200" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Field
              label="Email address"
              type="email"
              value={email}
              onChange={v => {
                setEmail(v);
                setEmailErr('');
              }}
              placeholder="alex@meridian.io"
              error={emailErr}
              icon={<MailIcon />}
            />

            <Field
              label="Password"
              type="password"
              value={password}
              onChange={v => {
                setPassword(v);
                setPwErr('');
              }}
              placeholder="••••••••"
              error={pwErr}
              icon={<LockIcon />}
            />

            <div className="flex items-center justify-between mb-5 -mt-1 text-xs">
              <span className="text-stone-500 font-medium">Forgot your password?</span>
              <button
                type="button"
                onClick={() => router.push('/forgot-password')}
                className="text-xs font-bold text-stone-900 hover:underline cursor-pointer"
              >
                Reset
              </button>
            </div>

            {loading && (
              <div className="mb-4 animate-in fade-in duration-200">
                <StripedLoader color="green" size="md" label="Authenticating session..." />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-[#111318] hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-98"
            >
              {loading ? 'Authenticating...' : 'Sign in to Workspace'}
              {!loading && <span>→</span>}
            </button>
          </form>

          {/* Footer Note */}
          <p className="text-center text-xs text-stone-500 font-medium mt-6">
            Don&apos;t have an account?{' '}
            <button
              type="button"
              onClick={() => router.push('/signup')}
              className="text-xs font-bold text-stone-900 hover:underline cursor-pointer"
            >
              Create Account
            </button>
          </p>

          <div className="flex items-center justify-center gap-1.5 mt-6 text-[11px] text-stone-400 font-medium">
            <ShieldIcon size={13} />
            <span>256-bit SSL encrypted workspace</span>
          </div>

        </div>
      </div>
    </div>
  );
}