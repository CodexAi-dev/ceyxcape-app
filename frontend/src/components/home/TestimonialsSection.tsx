'use client';
import React, { useState } from 'react';
import { REVIEWS } from '@/data/reviews';

// Real customer reviews migrated from the old site.
const TESTIMONIALS = REVIEWS;

function Stars() {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} className="w-4 h-4 text-[#d4af37]" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const t = TESTIMONIALS[active];

  return (
    <section className="section-py bg-[#0f172a]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-12">
          <div>
            <p className="text-[#d4af37] text-sm font-semibold tracking-[2px] uppercase font-outfit mb-2">Real Experiences</p>
            <h2 className="font-playfair font-bold text-white" style={{ fontSize: 'clamp(1.6rem,3.5vw,2.2rem)' }}>
              Tourists Talk About Us
            </h2>
          </div>
          <div className="flex items-center gap-2 pb-1">
            <div className="flex -space-x-2">
              {TESTIMONIALS.map((_, i) => (
                <div key={i} className="w-7 h-7 rounded-full bg-[#d4af37]/20 border-2 border-[#0f172a] flex items-center justify-center text-[#d4af37] text-xs font-bold font-playfair">
                  {TESTIMONIALS[i].name.charAt(0)}
                </div>
              ))}
            </div>
            <span className="text-white/50 text-xs font-outfit ml-1">Real traveller reviews</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Name list */}
          <div className="lg:col-span-2 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {TESTIMONIALS.map((item, i) => (
              <button key={i} onClick={() => setActive(i)}
                className={`flex-shrink-0 lg:flex-shrink text-left px-4 py-3 border-l-2 transition-all duration-200 ${
                  active === i
                    ? 'border-[#d4af37] bg-white/5'
                    : 'border-white/10 hover:border-white/30'
                }`}>
                <p className={`font-semibold text-sm font-outfit transition-colors ${active === i ? 'text-white' : 'text-white/50'}`}>{item.name}</p>
                <p className="text-xs text-white/30 font-outfit">{item.country}</p>
              </button>
            ))}
          </div>

          {/* Active review */}
          <div className="lg:col-span-3 border border-white/10 p-8">
            <div className="flex items-start justify-between mb-6">
              <Stars />
              <span className="text-xs text-white/30 font-outfit">Verified Review</span>
            </div>
            <blockquote className="font-playfair text-white text-lg sm:text-xl leading-relaxed mb-8">
              &ldquo;{t.text}&rdquo;
            </blockquote>
            <div className="flex items-center gap-3 pt-6 border-t border-white/10">
              <div className="w-10 h-10 rounded-full bg-[#d4af37]/20 flex items-center justify-center text-[#d4af37] font-bold font-playfair text-lg">
                {t.name.charAt(0)}
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{t.name}</p>
                <p className="text-white/40 text-xs font-outfit">{t.country}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Nav dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {TESTIMONIALS.map((_, i) => (
            <button key={i} onClick={() => setActive(i)}
              className={`h-1 transition-all duration-300 ${active === i ? 'w-8 bg-[#d4af37]' : 'w-4 bg-white/20 hover:bg-white/40'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}