'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { CONTACT, buildWhatsAppLink } from '@/config/constants';
import { inquiryService } from '@/services/inquiries';

type F = { name: string; email: string; message: string };

export default function ContactSection() {
  const [form, setForm] = useState<F>({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Partial<F>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name as keyof F]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    const errs: Partial<F> = {};
    if (!form.name.trim()) errs.name = 'Required';
    if (!form.email.trim()) errs.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email';
    if (!form.message.trim()) errs.message = 'Required';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSending(true);
    try {
      await inquiryService.submit({ type: 'general', ...form });
      setSent(true);
      setForm({ name: '', email: '', message: '' });
    } catch {
      setSubmitError('Something went wrong. Please try again or message us on WhatsApp.');
    } finally {
      setSending(false);
    }
  };

  const inp = (id: keyof F) =>
    `w-full border-b-2 bg-transparent pb-2 pt-1 text-sm text-[#0f172a] placeholder-gray-400 outline-none transition-colors
    ${errors[id] ? 'border-red-400' : 'border-gray-300 focus:border-[#b8962e]'}`;

  return (
    <section className="section-py bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Left */}
          <div>
            <p className="text-[#b8962e] text-sm font-semibold tracking-[2px] uppercase font-outfit mb-3">Contact Us</p>
            <h2 className="font-playfair font-bold text-[#0f172a] mb-4" style={{ fontSize: 'clamp(1.6rem,3.5vw,2.2rem)' }}>
              Plan Your Trip With Us
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-sm">
              Have a question or ready to start planning? Drop us a message and one of our travel experts will reply within 2 hours.
            </p>

            <div className="space-y-5">
              {[
                {
                  icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>,
                  label: CONTACT.phoneDisplay,
                  sub: CONTACT.hours,
                  href: `tel:${CONTACT.phone}`,
                },
                {
                  icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>,
                  label: CONTACT.email,
                  sub: 'Reply within 2 hours',
                  href: `mailto:${CONTACT.email}`,
                },
                {
                  icon: <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z"/>,
                  label: 'Battaramulla',
                  sub: 'Sri Lanka',
                  href: '#',
                },
              ].map((item, i) => (
                <a key={i} href={item.href}
                  className="flex items-start gap-4 group">
                  <div className="w-9 h-9 border border-gray-200 flex items-center justify-center flex-shrink-0 group-hover:border-[#b8962e] group-hover:bg-[#b8962e]/5 transition-colors">
                    <svg className="w-4 h-4 text-[#b8962e]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                      {item.icon}
                    </svg>
                  </div>
                  <div>
                    <p className="text-[#0f172a] font-semibold text-sm">{item.label}</p>
                    <p className="text-gray-400 text-xs font-outfit">{item.sub}</p>
                  </div>
                </a>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-gray-100">
              <p className="text-xs font-semibold uppercase tracking-[2px] text-gray-400 font-outfit mb-3">Prefer instant chat?</p>
              <a href={buildWhatsAppLink("Hello CeyXcape! I'd like to plan a trip.")} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-5 py-3 bg-[#25d366] text-white text-sm font-bold font-outfit hover:bg-[#1ebe5d] transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M11.989 0C5.364 0 0 5.349 0 11.956c0 2.089.546 4.058 1.5 5.77L.057 24l6.46-1.703a12.06 12.06 0 005.472 1.307c6.625 0 11.989-5.349 11.989-11.956C23.978 5.35 18.614 0 11.989 0z"/>
                </svg>
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Right — form */}
          <div className="bg-gray-50 border border-gray-100 px-6 sm:px-8 py-8">
            {sent ? (
              <div className="py-8 text-center">
                <div className="w-12 h-12 bg-[#b8962e]/10 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-[#b8962e]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <h3 className="font-playfair font-bold text-[#0f172a] text-xl mb-2">Message received!</h3>
                <p className="text-gray-500 text-sm mb-6">We&apos;ll reply within 2 hours on weekdays.</p>
                <button onClick={() => setSent(false)}
                  className="text-sm text-[#b8962e] font-semibold hover:underline underline-offset-4">
                  Send another →
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[2px] text-gray-400 font-outfit mb-2">
                    Name <span className="text-[#b8962e]">*</span>
                  </label>
                  <input type="text" name="name" value={form.name} onChange={handleChange}
                    placeholder="Your full name" className={inp('name')} />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[2px] text-gray-400 font-outfit mb-2">
                    Email <span className="text-[#b8962e]">*</span>
                  </label>
                  <input type="email" name="email" value={form.email} onChange={handleChange}
                    placeholder="you@example.com" className={inp('email')} />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[2px] text-gray-400 font-outfit mb-2">
                    Message <span className="text-[#b8962e]">*</span>
                  </label>
                  <textarea name="message" value={form.message} onChange={handleChange} rows={4}
                    placeholder="Tell us about your trip — dates, group size, what you'd like to see…"
                    className={`${inp('message')} resize-none`} />
                  {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
                </div>
                {submitError && <p className="text-red-500 text-sm">{submitError}</p>}
                <button type="submit" disabled={sending}
                  className="w-full py-3.5 bg-[#0f172a] text-white text-sm font-bold font-outfit hover:bg-[#1e293b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {sending ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Sending…
                    </>
                  ) : 'Send Message'}
                </button>
                <p className="text-xs text-gray-400 text-center font-outfit">
                  Or{' '}
                  <Link href="/contact" className="text-[#b8962e] hover:underline underline-offset-4">visit our full contact page</Link>
                </p>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}