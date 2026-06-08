'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToastContext } from '@/context/ToastContext';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { error: toastError } = useToastContext();

  const [values, setValues] = useState({
    first_name: '', last_name: '', email: '', phone: '', password: '', confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const set = (k: string, v: string) => {
    setValues(prev => ({ ...prev, [k]: v }));
    setErrors(prev => ({ ...prev, [k]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!values.first_name.trim()) e.first_name = 'Required';
    if (!values.last_name.trim()) e.last_name = 'Required';
    if (!values.email.trim()) e.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) e.email = 'Enter a valid email';
    if (!values.password) e.password = 'Required';
    else if (values.password.length < 8) e.password = 'At least 8 characters';
    else if (!/[A-Z]/.test(values.password)) e.password = 'Add an uppercase letter';
    else if (!/[0-9]/.test(values.password)) e.password = 'Add a number';
    if (values.confirmPassword !== values.password) e.confirmPassword = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await register({
        email: values.email,
        password: values.password,
        first_name: values.first_name,
        last_name: values.last_name,
        phone: values.phone || undefined,
      });
      router.push('/');
    } catch (err: any) {
      toastError(err.response?.data?.message || 'Registration failed. Please try again.', 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const pwStrength = (() => {
    const p = values.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][pwStrength];
  const strengthColor = ['', 'bg-red-400', 'bg-amber-400', 'bg-blue-400', 'bg-emerald-400'][pwStrength];

  const inputClass = (k: string) =>
    `flex-1 bg-transparent font-outfit text-[#0f172a] placeholder-gray-300 focus:outline-none text-sm py-0.5`;
  const wrapClass = (k: string) =>
    `flex items-center gap-3 border-b-2 pb-2 transition-colors ${errors[k] ? 'border-red-400' : 'border-gray-200 focus-within:border-[#d4af37]'}`;
  const errMsg = (k: string) => errors[k] ? (
    <p className="text-red-500 text-xs mt-1.5 font-outfit flex items-center gap-1">
      <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
      {errors[k]}
    </p>
  ) : null;

  return (
    <div className="min-h-screen flex">

      {/* ── Left panel — form ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-white overflow-y-auto">
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
            <h1 className="font-playfair font-bold text-[#0f172a] text-3xl mb-1">Create your account</h1>
            <p className="text-gray-400 font-outfit text-sm">Join thousands of travellers exploring Sri Lanka</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name row */}
            <div className="grid grid-cols-2 gap-4">
              {(['first_name', 'last_name'] as const).map((k, i) => (
                <div key={k}>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 font-outfit">
                    {i === 0 ? 'First Name' : 'Last Name'}
                  </label>
                  <div className={wrapClass(k)}>
                    <input
                      value={values[k]}
                      onChange={e => set(k, e.target.value)}
                      placeholder={i === 0 ? 'John' : 'Doe'}
                      autoComplete={i === 0 ? 'given-name' : 'family-name'}
                      className={inputClass(k)}
                    />
                  </div>
                  {errMsg(k)}
                </div>
              ))}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 font-outfit">Email Address</label>
              <div className={wrapClass('email')}>
                <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <input type="email" value={values.email} onChange={e => set('email', e.target.value)}
                  placeholder="you@example.com" autoComplete="email" className={inputClass('email')} />
              </div>
              {errMsg('email')}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 font-outfit">
                Phone <span className="normal-case text-gray-300 font-normal tracking-normal">(optional)</span>
              </label>
              <div className={wrapClass('phone')}>
                <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                <input type="tel" value={values.phone} onChange={e => set('phone', e.target.value)}
                  placeholder="+94 77 123 4567" autoComplete="tel" className={inputClass('phone')} />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 font-outfit">Password</label>
              <div className={wrapClass('password')}>
                <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                <input type={showPass ? 'text' : 'password'} value={values.password}
                  onChange={e => set('password', e.target.value)}
                  placeholder="Min 8 chars, uppercase & number"
                  autoComplete="new-password" className={inputClass('password')} />
                <button type="button" onClick={() => setShowPass(p => !p)} className="text-gray-300 hover:text-gray-500 transition-colors flex-shrink-0">
                  {showPass
                    ? <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
              {/* Strength bar */}
              {values.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= pwStrength ? strengthColor : 'bg-gray-100'}`} />
                    ))}
                  </div>
                  <p className={`text-xs font-outfit ${['','text-red-400','text-amber-500','text-blue-500','text-emerald-500'][pwStrength]}`}>
                    {strengthLabel}
                  </p>
                </div>
              )}
              {errMsg('password')}
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 font-outfit">Confirm Password</label>
              <div className={wrapClass('confirmPassword')}>
                <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
                <input type="password" value={values.confirmPassword}
                  onChange={e => set('confirmPassword', e.target.value)}
                  placeholder="Repeat your password"
                  autoComplete="new-password" className={inputClass('confirmPassword')} />
                {values.confirmPassword && values.confirmPassword === values.password && (
                  <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                )}
              </div>
              {errMsg('confirmPassword')}
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
                  Creating your account...
                </>
              ) : (
                <>
                  Create Account
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                  </svg>
                </>
              )}
            </button>

            <p className="text-center text-xs text-gray-300 font-outfit">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-[#d4af37] font-semibold hover:text-[#c9a961] transition-colors">Sign in</Link>
            </p>
          </form>
        </div>
      </div>

      {/* ── Right panel — image (hidden on mobile) ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <Image src="/images/company.webp" alt="Sri Lanka" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-tl from-[#0f172a]/85 via-[#0f172a]/40 to-transparent" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex justify-end">
            <Link href="/">
              <span className="font-playfair font-bold text-2xl text-white">
                Cey<span className="text-[#d4af37]">Xcape</span>
              </span>
            </Link>
          </div>
          <div>
            <p className="text-[#d4af37] text-xs font-outfit font-semibold tracking-widest uppercase mb-3">Why choose us</p>
            <h2 className="font-playfair font-bold text-white text-3xl leading-tight mb-6">
              Start your perfect<br />Sri Lanka journey
            </h2>
            <div className="space-y-4">
              {[
                { icon: '🏝️', title: 'Curated experiences', desc: 'Hand-picked tours by local experts' },
                { icon: '🚗', title: 'Private driver-guides', desc: 'Professional, English-speaking guides' },
                { icon: '🔒', title: 'Secure booking', desc: 'Safe payments, instant confirmation' },
              ].map(f => (
                <div key={f.title} className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0 mt-0.5">{f.icon}</span>
                  <div>
                    <p className="text-white font-outfit font-semibold text-sm">{f.title}</p>
                    <p className="text-white/50 font-outfit text-xs mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
