'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { inquiryService } from '@/services/inquiries';
import { CONTACT, buildWhatsAppLink } from '@/config/constants';

// ── Option sets ───────────────────────────────────────────────
const POPULAR_PLACES = [
  'Colombo', 'Sigiriya', 'Kandy', 'Ella', 'Galle', 'Yala', 'Mirissa',
  'Nuwara Eliya', 'Anuradhapura', 'Trincomalee', 'Arugam Bay', 'Bentota',
];

const INTERESTS = [
  'Beaches', 'Wildlife & Safari', 'Culture & Heritage', 'Adventure & Hiking',
  'Tea Country', 'Food & Cooking', 'Wellness & Ayurveda', 'Honeymoon',
];

const DURATIONS = ['1–3 days', '4–7 days', '8–14 days', '15+ days'];
const BUDGETS = ['Under $500', '$500 – $1,000', '$1,000 – $2,500', '$2,500+'];
const ACCOMMODATION = ['Budget', 'Standard (3★)', 'Comfort (4★)', 'Luxury (5★)'];

type Form = {
  places: string[];
  interests: string[];
  travelDate: string;
  duration: string;
  travellers: number;
  budget: string;
  accommodation: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  notes: string;
};

const EMPTY: Form = {
  places: [], interests: [], travelDate: '', duration: '', travellers: 2,
  budget: '', accommodation: '', name: '', email: '', phone: '', country: '', notes: '',
};

export default function CustomTourClient() {
  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const set = <K extends keyof Form>(key: K, value: Form[K]) => {
    setForm(p => ({ ...p, [key]: value }));
    if (errors[key as string]) setErrors(p => ({ ...p, [key]: '' }));
  };

  const toggle = (key: 'places' | 'interests', value: string) => {
    setForm(p => ({
      ...p,
      [key]: p[key].includes(value) ? p[key].filter(v => v !== value) : [...p[key], value],
    }));
  };

  // Compose all the custom-tour choices into a readable message for the
  // admin panel + email (reuses the existing inquiry system, no backend change).
  const buildMessage = (): string => {
    const lines = [
      'CUSTOM TOUR REQUEST',
      '',
      `Destinations: ${form.places.length ? form.places.join(', ') : '—'}`,
      `Interests: ${form.interests.length ? form.interests.join(', ') : '—'}`,
      `Travel date: ${form.travelDate || '—'}`,
      `Duration: ${form.duration || '—'}`,
      `Travellers: ${form.travellers}`,
      `Budget (per person): ${form.budget || '—'}`,
      `Accommodation: ${form.accommodation || '—'}`,
      `Country: ${form.country || '—'}`,
      '',
      `Notes: ${form.notes || '—'}`,
    ];
    return lines.join('\n');
  };

  const waMessage =
    `Hi CeyXcape! I'd like to plan a custom Sri Lanka tour.` +
    (form.places.length ? ` Places: ${form.places.join(', ')}.` : '') +
    (form.duration ? ` Duration: ${form.duration}.` : '') +
    ` Travellers: ${form.travellers}.`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Required';
    if (!form.email.trim()) errs.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email';
    if (form.places.length === 0 && !form.notes.trim()) {
      errs.places = 'Pick at least one place or add a note';
    }
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSending(true);
    try {
      await inquiryService.submit({
        type: 'tour',
        name: form.name,
        email: form.email,
        phone: form.phone,
        subject: 'Custom Tour Request',
        message: buildMessage(),
        tour_name: 'Custom Tour',
        tour_date: form.travelDate || undefined,
        participants: form.travellers,
      });
      setSent(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setSubmitError('Could not send your request. Please try WhatsApp or call us.');
    } finally {
      setSending(false);
    }
  };

  // ── Success screen ──
  if (sent) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 max-w-lg w-full p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-playfair font-bold text-[#0f172a] text-2xl mb-2">Request sent!</h1>
          <p className="text-gray-500 font-outfit mb-6">
            Thank you, {form.name.split(' ')[0] || 'traveller'}. Our team will craft a personalised
            itinerary and get back to you within 24 hours. For a faster reply, message us on WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={buildWhatsAppLink(waMessage)} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] text-white font-semibold font-outfit text-sm hover:bg-[#1ebe5d] transition-all">
              Chat on WhatsApp
            </a>
            <Link href="/tours" className="px-5 py-3 rounded-xl border-2 border-gray-200 text-[#0f172a] font-semibold font-outfit text-sm hover:border-[#d4af37] hover:text-[#d4af37] transition-all">
              Browse Tours
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Reusable bits ──
  const input = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-outfit text-[#0f172a] focus:outline-none focus:border-[#d4af37] transition-colors';
  const label = 'block text-xs font-semibold text-gray-600 font-outfit mb-1.5 uppercase tracking-wide';
  const chip = (active: boolean) =>
    `px-3.5 py-2 rounded-full text-sm font-outfit border transition-all ${
      active
        ? 'bg-[#d4af37] text-white border-[#d4af37] font-semibold'
        : 'bg-white text-gray-600 border-gray-200 hover:border-[#d4af37] hover:text-[#d4af37]'
    }`;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Hero */}
      <div className="relative bg-[#0f172a] overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'url(/images/hero2.webp)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-[#0f172a]/90 to-[#0f172a]/60" />
        <div className="relative max-w-4xl mx-auto px-4 py-14 md:py-18">
          <nav className="flex items-center gap-2 text-sm font-outfit text-gray-400 mb-4">
            <Link href="/" className="hover:text-[#d4af37] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Plan Your Tour</span>
          </nav>
          <h1 className="font-playfair font-bold text-white mb-3" style={{ fontSize: 'clamp(2rem,5vw,3rem)' }}>
            Design Your Perfect Sri Lanka Trip
          </h1>
          <p className="text-gray-300 font-outfit max-w-2xl">
            Tell us where you want to go and how you like to travel. We&apos;ll craft a private,
            tailor-made itinerary just for you — no payment now, just a personalised plan and quote.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* 1. Destinations */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
            <h2 className="font-playfair font-bold text-[#0f172a] text-lg mb-1">1. Where would you like to go?</h2>
            <p className="text-sm text-gray-500 font-outfit mb-4">Pick the places you&apos;d love to visit (choose as many as you like).</p>
            <div className="flex flex-wrap gap-2">
              {POPULAR_PLACES.map(p => (
                <button type="button" key={p} onClick={() => toggle('places', p)} className={chip(form.places.includes(p))}>
                  {p}
                </button>
              ))}
            </div>
            {errors.places && <p className="text-red-500 text-xs mt-2">{errors.places}</p>}
          </section>

          {/* 2. Interests */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
            <h2 className="font-playfair font-bold text-[#0f172a] text-lg mb-1">2. What are you into?</h2>
            <p className="text-sm text-gray-500 font-outfit mb-4">Your interests help us shape the perfect itinerary.</p>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map(i => (
                <button type="button" key={i} onClick={() => toggle('interests', i)} className={chip(form.interests.includes(i))}>
                  {i}
                </button>
              ))}
            </div>
          </section>

          {/* 3. Trip details */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
            <h2 className="font-playfair font-bold text-[#0f172a] text-lg mb-4">3. Trip details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={label}>Preferred travel date</label>
                <input type="date" min={new Date().toISOString().split('T')[0]}
                  value={form.travelDate} onChange={e => set('travelDate', e.target.value)} className={input} />
              </div>
              <div>
                <label className={label}>Trip duration</label>
                <select value={form.duration} onChange={e => set('duration', e.target.value)} className={input}>
                  <option value="">Select…</option>
                  {DURATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className={label}>Number of travellers</label>
                <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-2 py-1.5 w-fit">
                  <button type="button" onClick={() => set('travellers', Math.max(1, form.travellers - 1))}
                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-[#d4af37] hover:text-[#d4af37] transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path d="M5 12h14" /></svg>
                  </button>
                  <span className="w-10 text-center font-bold text-[#0f172a] font-outfit">{form.travellers}</span>
                  <button type="button" onClick={() => set('travellers', form.travellers + 1)}
                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-[#d4af37] hover:text-[#d4af37] transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
                  </button>
                </div>
              </div>
              <div>
                <label className={label}>Budget per person</label>
                <select value={form.budget} onChange={e => set('budget', e.target.value)} className={input}>
                  <option value="">Select…</option>
                  {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className={label}>Accommodation level</label>
                <div className="flex flex-wrap gap-2">
                  {ACCOMMODATION.map(a => (
                    <button type="button" key={a} onClick={() => set('accommodation', a)} className={chip(form.accommodation === a)}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 4. Your details */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
            <h2 className="font-playfair font-bold text-[#0f172a] text-lg mb-4">4. Your details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={label}>Full name *</label>
                <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Your name"
                  className={`${input} ${errors.name ? 'border-red-400' : ''}`} />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className={label}>Email *</label>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@email.com"
                  className={`${input} ${errors.email ? 'border-red-400' : ''}`} />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className={label}>Phone / WhatsApp</label>
                <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+94 …" className={input} />
              </div>
              <div>
                <label className={label}>Country</label>
                <input value={form.country} onChange={e => set('country', e.target.value)} placeholder="e.g. United Kingdom" className={input} />
              </div>
              <div className="sm:col-span-2">
                <label className={label}>Anything else we should know?</label>
                <textarea rows={4} value={form.notes} onChange={e => set('notes', e.target.value)}
                  placeholder="Special occasions, dietary needs, must-see places, pace of travel…"
                  className={`${input} resize-none`} />
              </div>
            </div>
          </section>

          {submitError && (
            <p className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-3">{submitError}</p>
          )}

          {/* Submit */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <button type="submit" disabled={sending}
              className="btn-gold w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold justify-center disabled:opacity-50 disabled:cursor-not-allowed">
              {sending ? 'Sending…' : 'Send My Request'}
              {!sending && (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              )}
            </button>
            <span className="text-xs text-gray-400 font-outfit text-center">
              No payment now — we&apos;ll reply with a custom plan &amp; quote.
            </span>
            <a href={`tel:${CONTACT.phone}`}
              className="sm:ml-auto text-sm font-semibold text-[#0f172a] font-outfit hover:text-[#d4af37] transition-colors">
              Or call {CONTACT.phoneDisplay}
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
