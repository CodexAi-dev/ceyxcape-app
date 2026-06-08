'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/config/api';
import { buildWhatsAppLink } from '@/config/constants';

// ─── Types ──────────────────────────────────────────────────────────────────
interface GalleryItem {
  id: number;
  src: string;
  title: string;
  category: string;
}

// ─── Lightbox ──────────────────────────────────────────────────────────────────
function Lightbox({ items, index, onClose, onPrev, onNext }: {
  items: GalleryItem[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const item = items[index];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose, onPrev, onNext]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={onClose}>
      <button onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white text-sm font-outfit px-4 py-1.5 rounded-full">
        {index + 1} / {items.length}
      </div>
      <button onClick={e => { e.stopPropagation(); onPrev(); }}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <div className="relative max-w-5xl max-h-[80vh] w-full mx-16 rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <Image src={item.src} alt={item.title} width={1200} height={800} className="w-full h-full object-contain max-h-[80vh]" unoptimized />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold font-outfit bg-[#d4af37] text-white mb-2">{item.category}</span>
          <p className="text-white font-playfair font-bold text-xl">{item.title}</p>
        </div>
      </div>
      <button onClick={e => { e.stopPropagation(); onNext(); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function GalleryPage() {
  const [allItems, setAllItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(16);

  useEffect(() => {
    api.get<GalleryItem[]>('/gallery')
      .then((r) => setAllItems(r.data || []))
      .catch(() => setAllItems([]))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...Array.from(new Set(allItems.map((i) => i.category).filter(Boolean)))];

  const filtered = activeCategory === 'All'
    ? allItems
    : allItems.filter(i => i.category === activeCategory);

  const visible = filtered.slice(0, visibleCount);

  const openLightbox = (idx: number) => setLightboxIndex(idx);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = useCallback(() =>
    setLightboxIndex(i => i !== null ? (i - 1 + filtered.length) % filtered.length : null),
  [filtered.length]);
  const nextImage = useCallback(() =>
    setLightboxIndex(i => i !== null ? (i + 1) % filtered.length : null),
  [filtered.length]);

  useEffect(() => { setVisibleCount(16); }, [activeCategory]);

  const categoryCounts: Record<string, number> = { All: allItems.length };
  allItems.forEach(item => {
    categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
  });

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* ── Hero ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <nav className="flex items-center gap-2 text-xs font-outfit text-white/50 mb-5">
          <Link href="/" className="hover:text-[#d4af37] transition-colors">Home</Link>
          <span className="opacity-40">/</span>
          <span className="text-white/80">Gallery</span>
        </nav>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-[#d4af37] text-xs font-semibold tracking-[4px] uppercase font-outfit mb-2">Visual Journey</p>
            <h1 className="font-playfair font-bold text-white leading-tight" style={{ fontSize: 'clamp(1.9rem,4vw,2.8rem)' }}>
              Sri Lanka Through <span className="text-[#d4af37]">Our Lens</span>
            </h1>
          </div>
          <div className="flex gap-6 sm:pb-1">
            {[
              { n: allItems.length + '+', label: 'Photos' },
              { n: String(Math.max(categories.length - 1, 0)), label: 'Categories' },
              { n: '50+', label: 'Destinations' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-xl font-bold font-playfair text-[#d4af37]">{s.n}</p>
                <p className="text-xs text-gray-400 font-outfit">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <div className="sticky top-[75px] z-30 bg-[#0f172a]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold font-outfit transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-[#d4af37] text-white shadow-[0_4px_14px_rgba(212,175,55,0.4)]'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                }`}>
                {cat}
                <span className={`text-xs ${activeCategory === cat ? 'opacity-80' : 'opacity-50'}`}>{categoryCounts[cat] || 0}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Masonry Grid ── */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-400 font-outfit text-sm">
            Showing <span className="text-white font-semibold">{Math.min(visibleCount, filtered.length)}</span> of{' '}
            <span className="text-[#d4af37] font-semibold">{filtered.length}</span> photos
            {activeCategory !== 'All' && <span className="text-gray-500"> in {activeCategory}</span>}
          </p>
          <p className="text-gray-600 text-xs font-outfit hidden sm:block">Click any photo to view full size</p>
        </div>

        {loading ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-3 space-y-3">
            {[...Array(8)].map((_, i) => <div key={i} className="break-inside-avoid h-64 bg-white/5 rounded-2xl animate-pulse" />)}
          </div>
        ) : filtered.length > 0 ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-3 space-y-3">
            {visible.map((item, idx) => (
              <div key={item.id} className="break-inside-avoid">
                <div onClick={() => openLightbox(idx)}
                  className="relative group cursor-pointer overflow-hidden rounded-2xl bg-gray-800"
                  style={{ aspectRatio: idx % 5 === 0 ? '3/4' : '4/3' }}>
                  <Image src={item.src} alt={item.title} fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" unoptimized />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold font-outfit bg-[#d4af37] text-white mb-1">{item.category}</span>
                    <p className="text-white font-playfair font-bold text-sm leading-tight">{item.title}</p>
                  </div>
                  <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/></svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-700" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
            </svg>
            <p className="text-gray-500 font-outfit">No photos in this category yet.</p>
          </div>
        )}

        {visibleCount < filtered.length && (
          <div className="text-center mt-10">
            <button onClick={() => setVisibleCount(c => c + 12)} className="btn-gold px-8 py-3.5 rounded-xl text-sm font-semibold">
              Load More Photos
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
            </button>
          </div>
        )}
      </div>

      {/* ── CTA strip ── */}
      <div className="border-t border-white/5 bg-[#0f172a]">
        <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-playfair font-bold text-white text-2xl mb-1">Ready to create your own memories?</h3>
            <p className="text-gray-400 font-outfit text-sm">Join hundreds of travellers who explored Sri Lanka with us.</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Link href="/tours" className="btn-gold px-6 py-3 rounded-xl text-sm font-semibold whitespace-nowrap">
              Explore Tours
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/></svg>
            </Link>
            <a href={buildWhatsAppLink('Hello CeyXcape! I loved your gallery and want to plan a trip.')} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] font-semibold font-outfit text-sm hover:bg-[#25D366]/25 transition-colors whitespace-nowrap">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>

      {lightboxIndex !== null && (
        <Lightbox items={visible} index={lightboxIndex} onClose={closeLightbox} onPrev={prevImage} onNext={nextImage} />
      )}
    </div>
  );
}
