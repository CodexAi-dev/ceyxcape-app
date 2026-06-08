'use client';
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';

export default function SeoIntro() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="bg-[#fff9f0] section-py" aria-label="About our services">
      <div ref={ref} className="reveal max-w-4xl mx-auto px-4 text-center">
        <div className="section-badge mb-6">
          <svg className="w-3.5 h-3.5 text-[#d4af37]" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
          Your Sri Lanka Travel Partner
        </div>

        <h2 className="font-playfair font-bold text-[#0f172a] mb-8 leading-tight"
          style={{ fontSize: 'clamp(1.6rem,4vw,2.2rem)' }}>
          Discover the Pearl of the Indian Ocean
        </h2>

        <div className="space-y-4 text-gray-600 text-base leading-relaxed" style={{ textAlign: 'justify' }}>
          <p>
            Sri Lanka is one of Asia&apos;s most beautiful travel destinations, offering ancient cultural heritage, stunning beaches, breathtaking landscapes, and world-class wildlife safaris. At CeyXcape Tours, we provide{' '}
            <strong className="text-[#2b4b7e]">private Sri Lanka tours</strong>, professional{' '}
            <strong className="text-[#2b4b7e]">driver guide services</strong>,{' '}
            <strong className="text-[#2b4b7e]">Colombo city tours</strong>,{' '}
            <strong className="text-[#2b4b7e]">airport transfers</strong>, and fully customized travel experiences with expert local guides.
          </p>
          <p>
            Whether you&apos;re looking to explore the historic Sigiriya Lion Rock, enjoy a thrilling{' '}
            <strong className="text-[#2b4b7e]">Yala National Park safari</strong>, discover the charm of{' '}
            <strong className="text-[#2b4b7e]">Galle day trips</strong>, visit the sacred Temple of the Tooth in Kandy, or relax on tropical beaches, our tailored tour packages ensure every moment is comfortable, authentic, and unforgettable.
          </p>
          <p>
            With over <strong className="text-[#2b4b7e]">7 years of experience</strong>, CeyXcape Tours is your trusted partner for{' '}
            <strong className="text-[#2b4b7e]">Sri Lanka travel</strong>,{' '}
            <strong className="text-[#2b4b7e]">customized itineraries</strong>, and seamless travel planning across all destinations.
          </p>
        </div>

        <Link href="/tours"
          className="btn-gold inline-flex mt-8 px-8 py-3.5 rounded-xl text-sm font-semibold">
          Explore Our Tours
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/>
          </svg>
        </Link>
      </div>
    </section>
  );
}
