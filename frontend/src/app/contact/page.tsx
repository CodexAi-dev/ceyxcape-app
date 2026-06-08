'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CONTACT, buildWhatsAppLink } from '@/config/constants';
import { inquiryService } from '@/services/inquiries';

type FormState = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const FAQ_ITEMS = [
  { q: 'How far in advance should I book?', a: 'We recommend 2–4 weeks for peak season (Dec–Mar). Custom itineraries need 4–6 weeks so we can craft every detail properly.' },
  { q: 'Do you offer airport transfers?', a: 'Yes — all packages include complimentary pick-up and drop-off at Bandaranaike International Airport in Colombo.' },
  { q: 'Can I customise a tour?', a: "Absolutely. Bespoke itineraries are our specialty. Tell us your interests and we'll send a personalised proposal within 24 hours." },
  { q: 'What is your cancellation policy?', a: 'Full refund up to 7 days before departure. 50% refund within 7 days. Non-refundable within 48 hours. We strongly recommend travel insurance.' },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center py-4 text-left gap-4 group"
      >
        <span className="font-semibold text-[#0f172a] group-hover:text-[#b8962e] transition-colors text-sm">
          {q}
        </span>
        <span className={`text-[#b8962e] text-xl leading-none transition-transform duration-200 flex-shrink-0 ${open ? 'rotate-45' : ''}`}>+</span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-40 pb-4' : 'max-h-0'}`}>
        <p className="text-gray-500 text-sm leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', phone: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = () => {
    const e: Partial<FormState> = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.email.trim()) e.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    if (!form.message.trim()) e.message = 'Required';
    return e;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name as keyof FormState]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSending(true);
    try {
      await inquiryService.submit({ type: 'general', ...form });
      setSent(true);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      setSubmitError('Something went wrong sending your message. Please try again or reach us on WhatsApp.');
    } finally {
      setSending(false);
    }
  };

  const field = (id: keyof FormState) =>
    `w-full border-b-2 pb-2 pt-1 text-[#0f172a] placeholder-gray-400 outline-none bg-transparent transition-colors duration-150 text-sm
    ${errors[id] ? 'border-red-400' : 'border-gray-300 focus:border-[#b8962e]'}`;

  return (
    <div className="bg-white min-h-screen">

      {/* ── Page header ─────────────────────────────── */}
      <div className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <nav className="flex items-center gap-2 text-xs text-gray-400 mb-4">
            <Link href="/" className="hover:text-[#b8962e] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-600">Contact</span>
          </nav>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="font-playfair text-4xl sm:text-5xl font-bold text-[#0f172a] leading-tight">
                Get in <span className="text-[#b8962e]">touch.</span>
              </h1>
              <p className="text-gray-500 mt-2 text-sm">We reply within 2 hours on weekdays.</p>
            </div>
            {/* Quick contact strip */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm pb-0.5">
              <a href={`tel:${CONTACT.phone}`} className="flex items-center gap-1.5 text-gray-600 hover:text-[#b8962e] transition-colors">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                {CONTACT.phoneDisplay}
              </a>
              <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-1.5 text-gray-600 hover:text-[#b8962e] transition-colors">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                {CONTACT.email}
              </a>
              <a href={buildWhatsAppLink("Hello CeyXcape! I have a question.")} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-gray-600 hover:text-[#b8962e] transition-colors">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M11.989 0C5.364 0 0 5.349 0 11.956c0 2.089.546 4.058 1.5 5.77L.057 24l6.46-1.703a12.06 12.06 0 005.472 1.307c6.625 0 11.989-5.349 11.989-11.956C23.978 5.35 18.614 0 11.989 0z"/>
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main content ─────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">

          {/* Left col — info + FAQ */}
          <div className="lg:col-span-2 space-y-10">

            {/* Address block */}
            <div>
              <p className="text-xs font-semibold tracking-[3px] uppercase text-[#b8962e] mb-4">Find Us</p>
              <address className="not-italic space-y-3 text-sm text-gray-600">
                <p className="font-semibold text-[#0f172a] text-base">CeyXcape Tours</p>
                <p>42 Galle Road, Colombo 3<br/>Sri Lanka 00300</p>
                <p>Mon – Fri &nbsp;8 AM – 8 PM<br/>Sat &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;9 AM – 6 PM<br/>Sun &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10 AM – 4 PM<br/><span className="text-gray-400 text-xs">Sri Lanka Standard Time (UTC+5:30)</span></p>
              </address>
            </div>

            {/* Thin gold rule */}
            <div className="h-px bg-gradient-to-r from-[#b8962e] to-transparent w-24" />

            {/* FAQ */}
            <div>
              <p className="text-xs font-semibold tracking-[3px] uppercase text-[#b8962e] mb-4">FAQ</p>
              <div className="divide-y divide-gray-100">
                {FAQ_ITEMS.map(item => <FaqItem key={item.q} q={item.q} a={item.a} />)}
              </div>
            </div>
          </div>

          {/* Right col — form */}
          <div className="lg:col-span-3">
            <div className="bg-gray-50 border border-gray-100 px-6 sm:px-10 py-8 sm:py-10">
            {sent ? (
              <div className="flex flex-col items-start gap-4 py-8">
                <div className="w-12 h-12 rounded-full bg-[#b8962e]/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#b8962e]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <h2 className="font-playfair text-3xl font-bold text-[#0f172a]">Message sent.</h2>
                <p className="text-gray-500 text-sm max-w-sm">
                  Thanks for reaching out. One of our travel experts will get back to you within 2 hours.
                </p>
                <button onClick={() => setSent(false)}
                  className="mt-2 text-sm font-semibold text-[#b8962e] hover:underline underline-offset-4">
                  Send another message →
                </button>
              </div>
            ) : (
              <>
                <p className="text-xs font-semibold tracking-[3px] uppercase text-[#b8962e] mb-8">Send a Message</p>
                <form onSubmit={handleSubmit} noValidate className="space-y-7">

                  <div className="grid sm:grid-cols-2 gap-7">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        Name <span className="text-[#b8962e]">*</span>
                      </label>
                      <input type="text" name="name" value={form.name} onChange={handleChange}
                        placeholder="Your full name" className={field('name')} />
                      {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        Email <span className="text-[#b8962e]">*</span>
                      </label>
                      <input type="email" name="email" value={form.email} onChange={handleChange}
                        placeholder="you@example.com" className={field('email')} />
                      {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-7">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Phone</label>
                      <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                        placeholder="+94 77 XXX XXXX" className={field('phone')} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Subject</label>
                      <input type="text" name="subject" value={form.subject} onChange={handleChange}
                        placeholder="What's it about?" className={field('subject')} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Message <span className="text-[#b8962e]">*</span>
                    </label>
                    <textarea name="message" value={form.message} onChange={handleChange} rows={5}
                      placeholder="Tell us about your dream trip — dates, group size, destinations you have in mind…"
                      className={`${field('message')} resize-none`} />
                    {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
                  </div>

                  <div className="flex items-center gap-6 pt-2">
                    <button type="submit" disabled={sending}
                      className="inline-flex items-center gap-3 px-8 py-3.5 bg-[#0f172a] text-white text-sm font-semibold hover:bg-[#1e293b] active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed">
                      {sending ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                          </svg>
                          Sending
                        </>
                      ) : 'Send Message'}
                    </button>
                    <p className="text-xs text-gray-400">
                      Or call us now —{' '}
                      <a href={`tel:${CONTACT.phone}`} className="text-[#b8962e] font-semibold hover:underline">{CONTACT.phoneDisplay}</a>
                    </p>
                  </div>
                  {submitError && <p className="text-red-500 text-sm">{submitError}</p>}

                </form>
              </>
            )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ──────────────────────────────── */}
      <div className="border-t border-gray-100 mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            Prefer to chat?{' '}
            <a href={buildWhatsAppLink("Hello CeyXcape! I have a question.")} target="_blank" rel="noopener noreferrer"
              className="text-[#b8962e] font-semibold hover:underline underline-offset-4">
              Message us on WhatsApp →
            </a>
          </p>
          <Link href="/tours"
            className="text-sm font-semibold text-[#0f172a] border-b-2 border-[#b8962e] pb-0.5 hover:text-[#b8962e] transition-colors">
            Browse all tours
          </Link>
        </div>
      </div>

    </div>
  );
}