'use client';
import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const DESTINATIONS = [
  { name: 'Sigiriya',      img: '/images/sigiriya1.webp',  tours: 15, badge: 'Must See',  color: '#ef4444' },
  { name: 'Ella',          img: '/images/ella.webp',       tours: 22, badge: 'Popular',   color: '#d4af37' },
  { name: 'Galle Fort',    img: '/images/gallefort.webp',  tours: 18, badge: 'Must See',  color: '#ef4444' },
  { name: 'Yala Safari',   img: '/images/yala.webp',       tours: 12, badge: 'Wildlife',  color: '#22c55e' },
  { name: 'Mirissa Beach', img: '/images/mirissa.webp',    tours: 20, badge: 'Beach',     color: '#0ea5e9' },
  { name: 'Kandy',         img: '/images/kandy.webp',      tours: 25, badge: 'Heritage',  color: '#a855f7' },
  { name: 'Trincomalee',   img: '/images/trinco.webp',     tours: 8,  badge: 'Heritage',  color: '#a855f7' },
  { name: 'Benthota',      img: '/images/benthota.webp',   tours: 9,  badge: 'Beach',     color: '#0ea5e9' },
  { name: 'Arugam Bay',    img: '/images/arugambey.webp',  tours: 5,  badge: 'Beach',     color: '#0ea5e9' },
  { name: 'Hambanthota',   img: '/images/hambanthota.webp',tours: 9,  badge: 'Must See',  color: '#ef4444' },
  { name: 'Anuradhapura',  img: '/images/anuradhapura.webp',tours: 9, badge: 'Heritage',  color: '#a855f7' },
  { name: 'Kithulgala',    img: '/images/rafting.webp',    tours: 9,  badge: 'Adventure', color: '#f59e0b' },
];

export default function DestinationsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'right' ? 300 : -300, behavior: 'smooth' });
    }
  };

  return (
    <section className="section-py bg-[#0f172a] overflow-hidden" aria-label="Top destinations">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[#d4af37] text-sm font-semibold tracking-[2px] uppercase font-outfit mb-2">Popular destinations</p>
            <h2 className="font-playfair font-bold text-white"
              style={{ fontSize: 'clamp(1.8rem,4vw,2.5rem)' }}>
              Where to Go Next
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1 text-gray-400 text-sm font-outfit">
              <span className="text-[#d4af37] font-bold text-xl font-playfair">50+</span>
              <span className="ml-1">Stunning locations</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => scroll('left')}
                className="w-10 h-10 rounded-full border border-white/20 text-white hover:bg-[#d4af37] hover:border-[#d4af37] transition-all flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
              </button>
              <button onClick={() => scroll('right')}
                className="w-10 h-10 rounded-full border border-white/20 text-white hover:bg-[#d4af37] hover:border-[#d4af37] transition-all flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Carousel */}
        <div ref={scrollRef} className="flex gap-4 overflow-x-auto hide-scrollbar pb-4">
          {DESTINATIONS.map(dest => (
            <Link key={dest.name}
              href={`/tours?search=${encodeURIComponent(dest.name)}`}
              className="destination-card flex-shrink-0 group"
              style={{ width: 'clamp(200px,28vw,240px)', height: 'clamp(280px,40vw,320px)' }}>
              <Image src={dest.img} alt={dest.name} fill className="object-cover" />
              <div className="overlay" />
              {/* Badge */}
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-white text-xs font-bold font-outfit"
                style={{ background: dest.color, fontSize: '0.65rem', letterSpacing: '0.5px' }}>
                {dest.badge}
              </span>
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-playfair font-bold text-lg leading-tight mb-1">{dest.name}</h3>
                <p className="text-gray-300 text-xs font-outfit">{dest.tours} tours available</p>
              </div>
              {/* Arrow on hover */}
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/>
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
