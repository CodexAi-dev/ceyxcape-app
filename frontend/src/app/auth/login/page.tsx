'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToastContext } from '@/context/ToastContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { error: toastError } = useToastContext();

  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const set = (k: string, v: string) => {
    setValues(prev => ({ ...prev, [k]: v }));
    setErrors(prev => ({ ...prev, [k]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!values.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) e.email = 'Enter a valid email address';
    if (!values.password) e.password = 'Password is required';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await login({ email: values.email, password: values.password });
      router.push('/');
    } catch (err: any) {
      toastError(err.response?.data?.message || 'Invalid email or password.', 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* ── Left panel — image (hidden on mobile) ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <Image
          src="/images/mirissa.webp"
          alt="Sri Lanka"
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a]/80 via-[#0f172a]/50 to-transparent" />

        {/* Content over image */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href="/">
            <span className="font-playfair font-bold text-2xl text-white">
              Cey<span className="text-[#d4af37]">Xcape</span>
            </span>
          </Link>

          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 mb-6">
              <svg className="w-4 h-4 text-[#d4af37]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              <span className="text-white/90 text-xs font-outfit font-medium tracking-wide">Trusted by 5,000+ travellers</span>
            </div>
            <h2 className="font-playfair font-bold text-white text-4xl leading-tight mb-3">
              Your Sri Lanka<br />adventure awaits
            </h2>
            <p className="text-white/60 font-outfit text-sm leading-relaxed max-w-xs">
              Private tours, stunning landscapes, and memories that last a lifetime — all in one place.
            </p>

            <div className="flex gap-6 mt-8">
              {[['Private', 'Driver Guides'], ['Tailor', 'Made Tours'], ['24/7', 'Support']].map(([val, lab]) => (
                <div key={lab}>
                  <p className="font-playfair font-bold text-[#d4af37] text-2xl">{val}</p>
                  <p className="text-white/50 text-xs font-outfit mt-0.5">{lab}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/">
              <span className="font-playfair font-bold text-2xl text-[#0f172a]">
                Cey<span className="text-[#d4af37]">Xcape</span>
              </span>
            </Link>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="font-playfair font-bold text-[#0f172a] text-3xl mb-1">Welcome back</h1>
            <p className="text-gray-400 font-outfit text-sm">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 font-outfit">
                Email Address
              </label>
              <div className={`flex items-center gap-3 border-b-2 pb-2 transition-colors ${errors.email ? 'border-red-400' : 'border-gray-200 focus-within:border-[#d4af37]'}`}>
                <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <input
                  type="email"
                  value={values.email}
                  onChange={e => set('email', e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="flex-1 bg-transparent font-outfit text-[#0f172a] placeholder-gray-300 focus:outline-none text-sm py-0.5"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1.5 font-outfit flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest font-outfit">Password</label>
                <Link href="/auth/forgot-password" className="text-xs text-[#d4af37] font-outfit hover:text-[#c9a961] transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className={`flex items-center gap-3 border-b-2 pb-2 transition-colors ${errors.password ? 'border-red-400' : 'border-gray-200 focus-within:border-[#d4af37]'}`}>
                <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={values.password}
                  onChange={e => set('password', e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="flex-1 bg-transparent font-outfit text-[#0f172a] placeholder-gray-300 focus:outline-none text-sm py-0.5"
                />
                <button type="button" onClick={() => setShowPass(p => !p)} className="text-gray-300 hover:text-gray-500 transition-colors flex-shrink-0">
                  {showPass
                    ? <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1.5 font-outfit flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gold py-4 text-sm font-bold font-outfit tracking-wide mt-2 disabled:opacity-60 disabled:cursor-not-allowed justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-7">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-300 font-outfit">New to CeyXcape?</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <Link
            href="/auth/register"
            className="flex items-center justify-center gap-2 w-full py-3.5 border-2 border-gray-200 hover:border-[#d4af37] text-[#0f172a] text-sm font-semibold font-outfit transition-colors group"
          >
            Create a free account
            <svg className="w-4 h-4 text-gray-400 group-hover:text-[#d4af37] transition-colors" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
            </svg>
          </Link>

          <p className="text-center text-xs text-gray-300 font-outfit mt-8">
            By continuing, you agree to our{' '}
            <Link href="/terms" className="hover:text-[#d4af37] transition-colors underline underline-offset-2">Terms</Link>
            {' '}and{' '}
            <Link href="/privacy" className="hover:text-[#d4af37] transition-colors underline underline-offset-2">Privacy Policy</Link>
          </p>
        </div>
      </div>

    </div>
  );
}
