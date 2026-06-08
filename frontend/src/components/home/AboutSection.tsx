'use client';
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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
          </div>

          {/* Right — Content */}
          <div ref={rightRef} className="reveal reveal-delay-2 lg:pl-4">
            <div className="section-badge mb-5">About CeyXcape</div>

            <h2 className="font-playfair font-bold text-[#0f172a] mb-4 leading-tight"
              style={{ fontSize: 'clamp(1.8rem,4vw,2.5rem)' }}>
              Your Gateway to{' '}
              <span className="text-gold-gradient">Sri Lanka&apos;s Wonders</span>
            </h2>

            <p className="text-[#0f172a] font-semibold leading-relaxed mb-4 max-w-xl font-outfit">
              Your journey. Your pace. Sri Lanka, exactly how you want to see it.
            </p>

            <p className="text-gray-600 leading-relaxed mb-8 max-w-xl text-justify">
              A truly unforgettable trip isn&apos;t about rushing from one crowded landmark to the next.
              It&apos;s about the freedom to stop the car when you see an incredible view, or staying an
              extra hour at an ancient temple just because you want to. We specialize in private, bespoke
              Sri Lanka travel, blending seamless comfort with genuine local insight. From our coastline
              to the ancient heritage cities, we craft itineraries that reflect your style, backed by a
              homegrown team that supports you every step of the way.
            </p>

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
