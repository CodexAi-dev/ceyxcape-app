import React from 'react';
import Link from 'next/link';
import { REVIEWS } from '@/data/reviews';

// Show a selection of the real reviews here (the rest appear in the
// homepage Testimonials section).
const FEATURED = REVIEWS.slice(0, 3);

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} className={`w-3.5 h-3.5 ${i <= n ? 'text-[#d4af37]' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function TripAdvisorSection() {
  return (
    <section className="section-py bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-[#d4af37] text-sm font-semibold tracking-[2px] uppercase font-outfit mb-2">
            Traveller Reviews
          </p>
          <h2 className="font-playfair font-bold text-[#0f172a]" style={{ fontSize: 'clamp(1.6rem,3.5vw,2.2rem)' }}>
            Loved by Travellers From Around the World
          </h2>
          <p className="text-gray-500 font-outfit mt-3 max-w-xl mx-auto">
            Genuine words from guests who explored Sri Lanka with our private driver guides.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {FEATURED.map((r, i) => (
            <div key={i} className="border border-gray-100 p-6 hover:border-[#d4af37]/40 hover:shadow-md transition-all duration-200 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-full bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37] font-bold font-playfair text-base flex-shrink-0">
                  {r.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-[#0f172a] text-sm">{r.name}</p>
                  <p className="text-xs text-gray-400 font-outfit">{r.country}</p>
                </div>
              </div>
              <Stars n={r.rating} />
              <p className="text-gray-600 text-sm leading-relaxed mt-3 flex-1">&ldquo;{r.text}&rdquo;</p>
              <div className="border-t border-gray-50 pt-3 mt-4">
                <span className="text-xs text-[#d4af37] font-semibold font-outfit">Verified traveller · {r.subject}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center">
          <Link href="/custom-tour"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0f172a] text-white text-sm font-semibold font-outfit hover:bg-[#1e293b] transition-colors">
            Plan Your Own Trip
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
