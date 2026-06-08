'use client';
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const FEATURES = [
  { key: 'compass', label: 'Tailor-Made Journeys', desc: 'Private itineraries shaped around you.' },
  { key: 'pin',     label: '50+ Destinations',     desc: 'Every corner of the island covered.' },
  { key: 'shield',  label: 'Licensed & Insured',   desc: 'A fully registered tour operator.' },
  { key: 'users',   label: 'Local Expert Guides',  desc: 'Born-and-raised island insiders.' },
] as const;

const ICONS: Record<string, React.ReactNode> = {
  compass: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  ),
  pin: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  shield: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  users: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
};

export default function AboutSection() {
  const leftRef  = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.15 }
    );
    if (leftRef.current)  obs.observe(leftRef.current);
    if (rightRef.current) obs.observe(rightRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="section-py bg-white overflow-hidden" aria-label="About CeyXcape">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left — Image + trust badge */}
          <div ref={leftRef} className="reveal relative">
            <div className="relative rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.12)]">
              <Image
                src="/images/company.webp"
                alt="The CeyXcape team in Sri Lanka"
                width={600}
                height={620}
                className="w-full object-cover"
                style={{ height: 'clamp(360px,42vw,460px)', objectPosition: 'center top' }}
              />
            </div>

            {/* Established chip */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
              <span className="text-[0.7rem] font-semibold tracking-wider uppercase text-[#0f172a] font-outfit">
                Est. 2018
              </span>
            </div>

            {/* Rating card */}
            <div className="absolute -bottom-5 left-5 sm:left-8 bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.16)] px-5 py-4 flex items-center gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold font-playfair text-[#0f172a] leading-none">4.9</p>
                <div className="flex gap-0.5 mt-1.5 justify-center">
                  {[1, 2, 3, 4, 5].map(i => (
                    <svg key={i} className="w-3 h-3 text-[#d4af37]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div>
                <p className="text-sm font-bold text-[#0f172a] font-outfit leading-tight">500+ Travellers</p>
                <p className="text-xs text-gray-400 font-outfit">Rated us excellent</p>
              </div>
            </div>
          </div>

          {/* Right — Content */}
          <div ref={rightRef} className="reveal reveal-delay-2 lg:pl-4">
            <div className="section-badge mb-5">About CeyXcape</div>

            <h2 className="font-playfair font-bold text-[#0f172a] mb-4 leading-tight"
              style={{ fontSize: 'clamp(1.8rem,4vw,2.5rem)' }}>
              Your Gateway to{' '}
              <span className="text-gold-gradient">Sri Lanka&apos;s Wonders</span>
            </h2>

            <p className="text-gray-600 leading-relaxed mb-8 max-w-xl">
              From golden beaches and ancient UNESCO cities to misty tea country and thrilling wildlife
              safaris, we design private, tailor-made journeys across Sri Lanka — blending comfort,
              authenticity, and the local insight only a homegrown team can offer.
            </p>

            {/* Feature grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 mb-9">
              {FEATURES.map(f => (
                <div key={f.label} className="flex gap-3.5 group">
                  <div className="w-10 h-10 rounded-xl bg-[#fff9f0] text-[#d4af37] flex items-center justify-center flex-shrink-0 group-hover:bg-[#d4af37] group-hover:text-white transition-colors">
                    {ICONS[f.key]}
                  </div>
                  <div>
                    <p className="font-semibold text-[#0f172a] text-sm font-outfit leading-tight mb-1">{f.label}</p>
                    <p className="text-gray-500 text-xs font-outfit leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link href="/about" className="btn-gold px-7 py-3.5 text-sm">
                Discover Our Story
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link href="/tours"
                className="text-sm font-semibold text-[#0f172a] font-outfit hover:text-[#d4af37] transition-colors inline-flex items-center gap-1.5">
                Browse Tours
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
