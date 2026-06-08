'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { tourService } from '@/services/tours';
import { Tour } from '@/types';
import { useWishlist } from '@/context/WishlistContext';
import { inquiryService } from '@/services/inquiries';
import { CONTACT, buildWhatsAppLink } from '@/config/constants';

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const s = size === 'md' ? 'w-5 h-5' : 'w-4 h-4';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} className={`${s} ${i <= Math.round(rating) ? 'text-[#d4af37]' : 'text-gray-200'}`}
          fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function GalleryModal({ images, startIndex, onClose }: { images: string[]; startIndex: number; onClose: () => void }) {
  const [idx, setIdx] = useState(startIndex);
  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={onClose}>
      <div className="relative w-full max-w-4xl mx-4" onClick={e => e.stopPropagation()}>
        <button onClick={onClose}
          className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
        <div className="relative aspect-video rounded-2xl overflow-hidden">
          <Image src={`/uploads/tours/${images[idx]}`} alt={`Gallery ${idx + 1}`} fill className="object-cover" />
        </div>
        <div className="flex items-center justify-between mt-4">
          <button onClick={() => setIdx(i => (i - 1 + images.length) % images.length)}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <span className="text-white/60 text-sm font-outfit">{idx + 1} / {images.length}</span>
          <button onClick={() => setIdx(i => (i + 1) % images.length)}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button key={i} onClick={() => setIdx(i)}
              className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${i === idx ? 'border-[#d4af37]' : 'border-transparent opacity-50 hover:opacity-80'}`}>
              <Image src={`/uploads/tours/${img}`} alt="" width={64} height={48} className="object-cover w-full h-full" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function InquiryWidget({ tour }: { tour: Tour }) {
  const [participants, setParticipants] = useState(1);
  const [tourDate, setTourDate] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Pre-filled WhatsApp message includes the tour + chosen options.
  const waMessage =
    `Hi CeyXcape! I'm interested in the "${tour.name}" tour.` +
    (tourDate ? ` Preferred date: ${tourDate}.` : '') +
    ` Travellers: ${participants}.`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Required';
    if (!form.email.trim()) errs.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSending(true);
    try {
      await inquiryService.submit({
        type: 'tour',
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message || `Inquiry about ${tour.name}.`,
        tour_id: tour.id,
        tour_name: tour.name,
        tour_date: tourDate || undefined,
        participants,
      });
      setSent(true);
    } catch {
      setSubmitError('Could not send your inquiry. Please try WhatsApp or call us.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-gray-100 p-6 sticky top-24">
      {/* Price (informational — booking is via inquiry) */}
      <div className="mb-5">
        {tour.discount_price ? (
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#0f172a] font-playfair">${tour.discount_price}</span>
            <span className="text-lg line-through text-gray-400 font-outfit">${tour.price}</span>
            <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded-full font-outfit">
              {Math.round((1 - tour.discount_price / tour.price) * 100)}% OFF
            </span>
          </div>
        ) : (
          <span className="text-3xl font-bold text-[#0f172a] font-playfair">${tour.price}</span>
        )}
        <p className="text-sm text-gray-500 font-outfit mt-0.5">per person · from</p>
      </div>

      {sent ? (
        <div className="text-center py-6">
          <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="font-playfair font-bold text-[#0f172a] text-lg mb-1">Inquiry sent!</h3>
          <p className="text-sm text-gray-500 font-outfit mb-5">
            Our team will get back to you shortly. For an instant reply, chat with us now.
          </p>
          <a href={buildWhatsAppLink(waMessage)} target="_blank" rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#25D366] text-white font-semibold font-outfit text-sm hover:bg-[#1ebe5d] transition-all">
            Chat on WhatsApp
          </a>
        </div>
      ) : (
        <>
          {(tour.avg_rating || 0) > 0 && (
            <div className="flex items-center gap-2 mb-5 pb-5 border-b border-gray-100">
              <StarRating rating={tour.avg_rating || 0} size="md" />
              <span className="font-bold text-[#0f172a] font-outfit">{(tour.avg_rating || 0).toFixed(1)}</span>
              <span className="text-gray-500 text-sm font-outfit">({tour.review_count || 0} reviews)</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 font-outfit mb-1.5 uppercase tracking-wide">Date</label>
                <input type="date" value={tourDate} onChange={e => setTourDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-outfit text-[#0f172a] focus:outline-none focus:border-[#d4af37] transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 font-outfit mb-1.5 uppercase tracking-wide">Travellers</label>
                <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-2 py-1.5">
                  <button type="button" onClick={() => setParticipants(p => Math.max(1, p - 1))}
                    className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-[#d4af37] hover:text-[#d4af37] transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path d="M5 12h14" /></svg>
                  </button>
                  <span className="flex-1 text-center font-bold text-[#0f172a] font-outfit">{participants}</span>
                  <button type="button" onClick={() => setParticipants(p => p + 1)}
                    className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-[#d4af37] hover:text-[#d4af37] transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <input name="name" value={form.name} onChange={handleChange} placeholder="Your name"
                className={`w-full border rounded-xl px-4 py-2.5 text-sm font-outfit text-[#0f172a] focus:outline-none transition-colors ${errors.name ? 'border-red-400' : 'border-gray-200 focus:border-[#d4af37]'}`} />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>
            <div className="mb-3">
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email address"
                className={`w-full border rounded-xl px-4 py-2.5 text-sm font-outfit text-[#0f172a] focus:outline-none transition-colors ${errors.email ? 'border-red-400' : 'border-gray-200 focus:border-[#d4af37]'}`} />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>
            <div className="mb-3">
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone / WhatsApp (optional)"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-outfit text-[#0f172a] focus:outline-none focus:border-[#d4af37] transition-colors" />
            </div>
            <div className="mb-4">
              <textarea name="message" value={form.message} onChange={handleChange} rows={3}
                placeholder="Anything you'd like us to know? (optional)"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-outfit text-[#0f172a] focus:outline-none focus:border-[#d4af37] transition-colors resize-none" />
            </div>

            {submitError && <p className="text-red-500 text-sm mb-3">{submitError}</p>}

            <button type="submit" disabled={sending}
              className="w-full btn-gold py-4 rounded-xl text-base font-semibold justify-center disabled:opacity-50 disabled:cursor-not-allowed">
              {sending ? 'Sending…' : 'Send Inquiry'}
              {!sending && (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              )}
            </button>
          </form>

          {/* Direct channels */}
          <div className="grid grid-cols-2 gap-3 mt-3">
            <a href={buildWhatsAppLink(waMessage)} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-[#25D366] text-[#25D366] font-semibold font-outfit text-sm hover:bg-[#25D366] hover:text-white transition-all">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347Z" />
              </svg>
              WhatsApp
            </a>
            <a href={`tel:${CONTACT.phone}`}
              className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-gray-200 text-[#0f172a] font-semibold font-outfit text-sm hover:border-[#d4af37] hover:text-[#d4af37] transition-all">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              Call
            </a>
          </div>
          <p className="text-center text-xs text-gray-400 font-outfit mt-3">No payment now — we'll confirm availability &amp; price</p>
        </>
      )}
    </div>
  );
}

export default function TourDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'includes' | 'reviews'>('overview');
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [mainImage, setMainImage] = useState('');

  useEffect(() => {
    tourService.getTourById(id)
      .then(t => {
        setTour(t);
        setMainImage(t.image);
        tourService.incrementTourViews(id).catch(() => {});
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const inWishlist = tour ? isInWishlist(tour.id) : false;
  const allImages = tour ? [tour.image, ...(tour.gallery || [])].filter(Boolean) : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-96 bg-gray-200 rounded-2xl animate-pulse" />
              <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4" />
              <div className="h-4 bg-gray-100 rounded animate-pulse w-1/2" />
            </div>
            <div className="h-80 bg-gray-200 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !tour) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="text-center">
          <svg className="w-20 h-20 mx-auto mb-4 text-gray-200" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <h2 className="font-playfair font-bold text-[#0f172a] text-2xl mb-2">Tour Not Found</h2>
          <p className="text-gray-500 font-outfit mb-6">This tour may no longer be available.</p>
          <Link href="/tours" className="btn-gold px-6 py-3 rounded-xl text-sm font-semibold inline-flex">
            Browse All Tours
          </Link>
        </div>
      </div>
    );
  }

  const discountPct = tour.discount_price
    ? Math.round((1 - tour.discount_price / tour.price) * 100)
    : null;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm font-outfit text-gray-500">
            <Link href="/" className="hover:text-[#d4af37] transition-colors">Home</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>
            <Link href="/tours" className="hover:text-[#d4af37] transition-colors">Tours</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>
            <span className="text-[#0f172a] font-medium line-clamp-1">{tour.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-3">
              <div className="relative rounded-2xl overflow-hidden aspect-video cursor-pointer group"
                onClick={() => { setGalleryIndex(0); setGalleryOpen(true); }}>
                <Image src={mainImage ? `/uploads/tours/${mainImage}` : '/images/default-tour.jpg'}
                  alt={tour.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs font-outfit px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  {allImages.length} photos
                </div>
                {discountPct && (
                  <span className="absolute top-4 left-4 px-3 py-1.5 bg-red-500 text-white text-sm font-bold rounded-full font-outfit">
                    -{discountPct}% OFF
                  </span>
                )}
              </div>
              {allImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {allImages.slice(0, 4).map((img, i) => (
                    <div key={i} className="relative aspect-video rounded-xl overflow-hidden cursor-pointer group"
                      onClick={() => { setMainImage(img); setGalleryIndex(i); }}>
                      <Image src={`/uploads/tours/${img}`} alt="" fill className="object-cover group-hover:scale-110 transition-transform duration-300" />
                      {i === 3 && allImages.length > 4 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center"
                          onClick={e => { e.stopPropagation(); setGalleryIndex(3); setGalleryOpen(true); }}>
                          <span className="text-white font-bold font-outfit text-lg">+{allImages.length - 4}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-[#d4af37] text-white text-xs font-bold rounded-full font-outfit">{tour.category}</span>
                    {tour.featured && (
                      <span className="px-3 py-1 bg-[#2b4b7e] text-white text-xs font-bold rounded-full font-outfit">Featured</span>
                    )}
                  </div>
                  <h1 className="font-playfair font-bold text-[#0f172a]" style={{ fontSize: 'clamp(1.5rem,4vw,2.2rem)' }}>
                    {tour.name}
                  </h1>
                </div>
                <button
                  onClick={() => inWishlist ? removeFromWishlist(tour.id) : addToWishlist(tour.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-outfit text-sm font-semibold transition-all ${
                    inWishlist
                      ? 'border-red-400 text-red-500 bg-red-50 hover:bg-red-100'
                      : 'border-gray-200 text-gray-600 hover:border-[#d4af37] hover:text-[#d4af37]'
                  }`}>
                  <svg className="w-4 h-4" fill={inWishlist ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  {inWishlist ? 'Saved' : 'Save'}
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm font-outfit text-gray-600">
                {(tour.avg_rating || 0) > 0 && (
                  <div className="flex items-center gap-1.5">
                    <StarRating rating={tour.avg_rating || 0} />
                    <span className="font-bold text-[#0f172a]">{(tour.avg_rating || 0).toFixed(1)}</span>
                    <span className="text-gray-400">({tour.review_count} reviews)</span>
                  </div>
                )}
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-[#d4af37]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                  </svg>
                  {tour.duration} days
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-[#d4af37]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                  </svg>
                  {tour.location}
                </span>
                <span className="flex items-center gap-1.5 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                  </svg>
                  {tour.views || 0} views
                </span>
              </div>
            </div>

            <div className="border-b border-gray-200">
              <div className="flex gap-1 overflow-x-auto hide-scrollbar">
                {(['overview', 'itinerary', 'includes', 'reviews'] as const).map(tab => (
                  <button key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-3 text-sm font-semibold font-outfit whitespace-nowrap border-b-2 transition-all -mb-px ${
                      activeTab === tab
                        ? 'border-[#d4af37] text-[#d4af37]'
                        : 'border-transparent text-gray-500 hover:text-[#0f172a]'
                    }`}>
                    {tab === 'overview' ? 'Overview' : tab === 'itinerary' ? 'Itinerary' : tab === 'includes' ? "What's Included" : 'Reviews'}
                  </button>
                ))}
              </div>
            </div>

            <div className="min-h-64">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <p className="text-gray-600 leading-relaxed font-outfit">{tour.description}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { label: 'Duration', value: `${tour.duration} Days`, icon: 'clock' },
                      { label: 'Category', value: tour.category, icon: 'tag' },
                      { label: 'Location', value: tour.location, icon: 'pin' },
                      { label: 'Start From', value: tour.start_location || 'Colombo', icon: 'bus' },
                    ].map(stat => (
                      <div key={stat.label} className="bg-[#fff9f0] rounded-xl p-4 border border-[#d4af37]/15">
                        <p className="text-xs text-gray-500 font-outfit mb-0.5">{stat.label}</p>
                        <p className="text-sm font-bold text-[#0f172a] font-outfit">{stat.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'itinerary' && (
                <div className="space-y-4">
                  {(tour.itinerary || []).length > 0 ? tour.itinerary.map((day, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-[#d4af37] text-white flex items-center justify-center font-bold font-outfit text-sm flex-shrink-0">
                          {day.day}
                        </div>
                        {i < tour.itinerary.length - 1 && (
                          <div className="w-0.5 flex-1 bg-[#d4af37]/20 my-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-6">
                        <h4 className="font-playfair font-bold text-[#0f172a] text-lg mb-2">{day.title}</h4>
                        <p className="text-gray-600 text-sm leading-relaxed font-outfit mb-3">{day.description}</p>
                        {day.activities && day.activities.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {day.activities.map((act, j) => (
                              <span key={j} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-outfit">{act}</span>
                            ))}
                          </div>
                        )}
                        {day.meals && (
                          <p className="text-xs text-[#d4af37] font-semibold font-outfit mt-2">Meals: {day.meals}</p>
                        )}
                      </div>
                    </div>
                  )) : (
                    <p className="text-gray-400 font-outfit text-center py-8">Itinerary details coming soon. Please contact us.</p>
                  )}
                </div>
              )}

              {activeTab === 'includes' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-playfair font-bold text-[#0f172a] text-lg mb-4">What's Included</h4>
                    <ul className="space-y-2">
                      {(tour.includes || []).length > 0 ? tour.includes.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm font-outfit text-gray-600">
                          <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          {item}
                        </li>
                      )) : <li className="text-sm font-outfit text-gray-400">Details available on request</li>}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-playfair font-bold text-[#0f172a] text-lg mb-4">Not Included</h4>
                    <ul className="space-y-2">
                      {(tour.excludes || []).length > 0 ? tour.excludes.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm font-outfit text-gray-600">
                          <svg className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path d="M18 6 6 18M6 6l12 12" />
                          </svg>
                          {item}
                        </li>
                      )) : <li className="text-sm font-outfit text-gray-400">Details available on request</li>}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  {(tour.avg_rating || 0) > 0 && (
                    <div className="flex items-center gap-6 p-6 bg-[#fff9f0] rounded-2xl border border-[#d4af37]/20">
                      <div className="text-center">
                        <p className="text-5xl font-bold font-playfair text-[#0f172a]">{(tour.avg_rating || 0).toFixed(1)}</p>
                        <StarRating rating={tour.avg_rating || 0} size="md" />
                        <p className="text-xs text-gray-500 font-outfit mt-1">{tour.review_count} reviews</p>
                      </div>
                    </div>
                  )}
                  <div className="text-center py-10 text-gray-400 font-outfit">
                    <svg className="w-12 h-12 mx-auto mb-3 text-gray-200" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    <p className="text-sm">Reviews will appear here after completed tours.</p>
                    <Link href="/contact" className="mt-4 btn-gold px-5 py-2.5 rounded-xl text-sm inline-flex">
                      Ask Us a Question
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <InquiryWidget tour={tour} />
            <div className="mt-4 bg-white rounded-2xl border border-gray-100 p-5 shadow-card">
              <h4 className="font-playfair font-bold text-[#0f172a] mb-4">Why Book With Us</h4>
              <div className="space-y-3">
                {[
                  { icon: '🛡️', title: 'Licensed and Insured', desc: 'Fully licensed Sri Lanka tour operator' },
                  { icon: '⭐', title: '4.9 TripAdvisor Rating', desc: 'Trusted by hundreds of travellers' },
                  { icon: '🔄', title: 'Free Cancellation', desc: 'Up to 48 hours before departure' },
                  { icon: '💬', title: '24/7 Support', desc: 'Always here to help you' },
                ].map(b => (
                  <div key={b.title} className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">{b.icon}</span>
                    <div>
                      <p className="text-sm font-bold text-[#0f172a] font-outfit">{b.title}</p>
                      <p className="text-xs text-gray-500 font-outfit">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {galleryOpen && allImages.length > 0 && (
        <GalleryModal images={allImages} startIndex={galleryIndex} onClose={() => setGalleryOpen(false)} />
      )}
    </div>
  );
}