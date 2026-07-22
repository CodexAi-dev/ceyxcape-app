'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function HeroSection() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 100); return () => clearTimeout(t); }, []);

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="Hero banner"
    >
      {/* Background image — crisp, optimized, no zoom/crop from CSS backgrounds */}
      <Image
        src="/images/sigiriya1.webp"
        alt="Sigiriya Rock Fortress rising above the Sri Lankan jungle"
        fill
        priority
        quality={90}
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Soft, balanced scrim — keeps the photo clear while text stays legible */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/45" />
      <div className="absolute inset-0 bg-black/10" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center py-24">
        {/* Eyebrow */}
        <div className={`inline-flex items-center gap-2 mb-6 transition-all duration-700 delay-100 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="w-8 h-px bg-[#d4af37]" />
          <span className="text-[#d4af37] text-sm font-semibold tracking-[3px] uppercase font-outfit drop-shadow">
            Sri Lanka&apos;s Trusted Private Tours
          </span>
          <span className="w-8 h-px bg-[#d4af37]" />
        </div>

        {/* Main Heading — refined size, soft shadow for clarity */}
        <h1 className={`font-playfair text-white mb-6 transition-all duration-700 delay-200 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ fontSize: 'clamp(2.4rem,5.5vw,4.5rem)', lineHeight: 1.12, fontWeight: 700, textShadow: '0 2px 24px rgba(0,0,0,0.45)' }}>
          Private Sri Lanka Tours<br />
          <span className="text-gold-gradient">with Local Driver Guide</span>
        </h1>

        {/* Subtitle */}
        <p className={`text-gray-100 max-w-xl mx-auto mb-10 text-lg leading-relaxed transition-all duration-700 delay-300 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ textShadow: '0 1px 12px rgba(0,0,0,0.5)' }}>
          Colombo city tours, day trips to Galle &amp; Sigiriya, airport transfers, and customized travel experiences across Sri Lanka.
        </p>

        {/* CTAs */}
        <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-400 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Link href="/tours"
            className="btn-gold px-8 py-4 rounded-xl text-base font-semibold shadow-[0_8px_32px_rgba(212,175,55,0.4)]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Explore Tours
          </Link>
          <Link href="/contact"
            className="btn-outline-gold px-8 py-4 rounded-xl text-base font-semibold border-2 border-white/60 text-white hover:bg-white/10 hover:border-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1 19.79 19.79 0 0 1 1.58 4.5 2 2 0 0 1 3.54 2.32h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.06 6.06l1.71-1.71a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            Contact Us
          </Link>
        </div>

      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>
    </section>
  );
}
