import React from 'react';
import Link from 'next/link';

const REVIEWS = [
  { name: 'Sarah M.', country: 'United Kingdom', rating: 5, date: 'Oct 2024', text: 'Absolutely incredible experience. Our guide knew every hidden gem — Sigiriya at sunrise with nobody else around. Worth every penny.', tour: 'Cultural Triangle & Wildlife' },
  { name: 'Jan V.', country: 'Netherlands', rating: 5, date: 'Sep 2024', text: 'Third time visiting Sri Lanka and first time using CeyXcape. Cannot believe what we missed before. Seamless, personal and genuinely fun.', tour: 'South Coast Explorer' },
  { name: 'Priya R.', country: 'Australia', rating: 5, date: 'Aug 2024', text: 'Honeymoon package exceeded all expectations. Every hotel, every drive, every meal was perfectly arranged. We felt completely taken care of.', tour: 'Honeymoon Special' },
];

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} className="w-3.5 h-3.5 text-[#00af87]" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  );
}

export default function TripAdvisorSection() {
  return (
    <section className="section-py bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              {/* TripAdvisor owl logo mark */}
              <div className="w-8 h-8 rounded-full bg-[#00af87] flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="7.5" cy="13" r="2.5"/><circle cx="16.5" cy="13" r="2.5"/>
                  <path d="M12 4C7 4 3 7.5 3 12s4 8 9 8 9-3.5 9-8-4-8-9-8zm-4.5 11a3.5 3.5 0 110-7 3.5 3.5 0 010 7zm9 0a3.5 3.5 0 110-7 3.5 3.5 0 010 7z"/>
                </svg>
              </div>
              <span className="text-xs font-bold tracking-[2px] uppercase font-outfit text-[#00af87]">TripAdvisor Reviews</span>
            </div>
            <h2 className="font-playfair font-bold text-[#0f172a]" style={{ fontSize: 'clamp(1.6rem,3.5vw,2.2rem)' }}>
              Travellers&apos; Choice
            </h2>
          </div>
          {/* Rating pill */}
          <div className="flex items-center gap-4 pb-1">
            <div className="text-center">
              <p className="font-playfair font-bold text-[#0f172a] text-3xl leading-none">4.9</p>
              <Stars n={5} />
              <p className="text-xs text-gray-400 font-outfit mt-1">500+ reviews</p>
            </div>
            <div className="w-px h-12 bg-gray-100" />
            <div className="text-center">
              <div className="w-14 h-14">
                <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="56" height="56" rx="8" fill="#00af87"/>
                  <text x="28" y="22" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" fontFamily="Arial">TRAVELLERS&apos;</text>
                  <text x="28" y="32" textAnchor="middle" fill="white" fontSize="7" fontFamily="Arial">CHOICE</text>
                  <text x="28" y="44" textAnchor="middle" fill="white" fontSize="7" fontFamily="Arial">2024</text>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {REVIEWS.map((r, i) => (
            <div key={i} className="border border-gray-100 p-6 hover:border-[#00af87]/30 hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#00af87]/10 flex items-center justify-center text-[#00af87] font-bold font-playfair text-base flex-shrink-0">
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-[#0f172a] text-sm">{r.name}</p>
                    <p className="text-xs text-gray-400 font-outfit">{r.country}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400 font-outfit flex-shrink-0">{r.date}</span>
              </div>
              <Stars n={r.rating} />
              <p className="text-gray-600 text-sm leading-relaxed mt-3 mb-4">&ldquo;{r.text}&rdquo;</p>
              <div className="border-t border-gray-50 pt-3">
                <span className="text-xs text-[#00af87] font-semibold font-outfit">{r.tour}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center gap-3">
          <a href="https://www.tripadvisor.com" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0f172a] text-white text-sm font-semibold font-outfit hover:bg-[#1e293b] transition-colors">
            See All Reviews on TripAdvisor
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}