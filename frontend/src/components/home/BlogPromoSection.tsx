'use client';
import React from 'react';
import Link from 'next/link';

const BLOG_TAGS = [
  { label: 'Best Time to Visit', href: '/blog/best-time-to-visit-sri-lanka', color: '#0ea5e9' },
  { label: '7-Day Itinerary',    href: '/blog/sri-lanka-7-day-itinerary',   color: '#10b981' },
  { label: 'Budget Guide',       href: '/blog/sri-lanka-travel-cost-guide', color: '#ec4899' },
  { label: 'First-Time Tips',    href: '/blog/travel-tips-first-time-visitors', color: '#a855f7' },
];

const TOUR_TAGS = [
  { label: 'Beach Tours',    href: '/tours?search_category=Beach+Tours',    color: '#22c55e' },
  { label: 'Cultural Tours', href: '/tours?search_category=Cultural+Tours', color: '#f59e0b' },
  { label: 'Wildlife Safari',href: '/tours?search_category=Wildlife+Safari', color: '#ef4444' },
  { label: '4–7 Day Tours',  href: '/tours?search_duration=4-7',            color: '#3b82f6' },
];

export default function BlogPromoSection() {
  return (
    <section className="section-py bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Intro */}
        <p className="text-center text-gray-500 text-sm font-outfit max-w-2xl mx-auto mb-12">
          Whether you&apos;re looking for inspiration through our travel guides or ready to book your adventure, we have everything you need to create unforgettable memories in Sri Lanka.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Blog Card */}
          <div className="rounded-3xl border border-gray-100 bg-gradient-to-br from-sky-50 to-blue-50 p-8 flex flex-col">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-sky-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                </svg>
              </div>
              <div>
                <h2 className="font-playfair font-bold text-[#0f172a] text-xl">Travel Guides &amp; Tips</h2>
                <p className="text-xs text-gray-500 font-outfit">Local expert knowledge</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Discover comprehensive travel guides written by our local experts to help you plan the perfect Sri Lanka adventure. From seasonal guides to budget tips, we&apos;ve got you covered.
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {BLOG_TAGS.map(t => (
                <Link key={t.label} href={t.href}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold font-outfit border transition-all hover:scale-105"
                  style={{ color: t.color, borderColor: `${t.color}30`, background: `${t.color}10` }}>
                  {t.label}
                </Link>
              ))}
            </div>
            <Link href="/blog"
              className="mt-auto btn-navy px-6 py-3 rounded-xl text-sm font-semibold inline-flex w-fit">
              Read All Guides
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/>
              </svg>
            </Link>
          </div>

          {/* Tours Card */}
          <div className="rounded-3xl border border-gray-100 bg-gradient-to-br from-amber-50 to-orange-50 p-8 flex flex-col">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
                </svg>
              </div>
              <div>
                <h2 className="font-playfair font-bold text-[#0f172a] text-xl">Explore Our Tours</h2>
                <p className="text-xs text-gray-500 font-outfit">Curated for every traveler</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Browse our curated collection of tours designed for every type of traveler. From adventure seekers to culture enthusiasts, find your perfect Sri Lanka experience.
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {TOUR_TAGS.map(t => (
                <Link key={t.label} href={t.href}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold font-outfit border transition-all hover:scale-105"
                  style={{ color: t.color, borderColor: `${t.color}30`, background: `${t.color}10` }}>
                  {t.label}
                </Link>
              ))}
            </div>
            <Link href="/tours"
              className="mt-auto btn-gold px-6 py-3 rounded-xl text-sm font-semibold inline-flex w-fit">
              Browse All Tours
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
