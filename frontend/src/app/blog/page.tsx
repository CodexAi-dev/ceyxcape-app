import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { BLOG_POSTS } from './posts';

export const metadata: Metadata = {
  title: 'Sri Lanka Travel Blog | Tour Tips, Guides & Stories | CeyXcape',
  description: 'Expert travel guides, itineraries, and insider tips for touring Sri Lanka. Best time to visit, travel costs, top destinations and more.',
  alternates: { canonical: '/blog' },
};

const CATEGORIES = ['All', 'Travel Planning', 'Itineraries', 'Destinations', 'Budget Guide', 'Travel Tips'];

export default function BlogPage() {
  const featured = BLOG_POSTS[0];
  const rest = BLOG_POSTS.slice(1);

  return (
    <div className="bg-white min-h-screen">

      {/* ── Header ── */}
      <div className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <nav className="flex items-center gap-2 text-xs text-gray-400 mb-4">
            <Link href="/" className="hover:text-[#b8962e] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-600">Blog</span>
          </nav>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <h1 className="font-playfair font-bold text-[#0f172a] text-4xl sm:text-5xl leading-tight">
                Travel <span className="text-[#b8962e]">Journal</span>
              </h1>
              <p className="text-gray-500 text-sm mt-2">Expert guides, itineraries and insider tips for Sri Lanka</p>
            </div>
            <p className="text-xs text-gray-400 font-outfit pb-1">{BLOG_POSTS.length} articles</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Featured post ── */}
        <Link href={`/blog/${featured.slug}`} className="group block mb-12">
          <div className="grid md:grid-cols-5 gap-0 overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200">
            <div className="md:col-span-3 relative" style={{ minHeight: 300 }}>
              <Image
                src={featured.image}
                alt={featured.title}
                fill
                className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10" />
            </div>
            <div className="md:col-span-2 bg-white p-8 flex flex-col justify-center">
              <span className="inline-block text-xs font-bold uppercase tracking-[2px] mb-4 font-outfit px-2 py-1"
                style={{ color: featured.categoryColor, backgroundColor: `${featured.categoryColor}15` }}>
                {featured.category}
              </span>
              <h2 className="font-playfair font-bold text-[#0f172a] text-2xl sm:text-3xl leading-tight mb-3 group-hover:text-[#b8962e] transition-colors">
                {featured.title}
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">{featured.excerpt}</p>
              <div className="flex items-center justify-between text-xs text-gray-400 font-outfit pt-4 border-t border-gray-100">
                <span>{featured.date}</span>
                <span>{featured.readTime}</span>
              </div>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#0f172a] group-hover:text-[#b8962e] transition-colors font-outfit">
                Read article
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/>
                </svg>
              </span>
            </div>
          </div>
        </Link>

        {/* ── Category filter (static, visual only) ── */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat, i) => (
            <span key={cat}
              className={`px-4 py-1.5 text-xs font-semibold font-outfit border transition-colors cursor-pointer
                ${i === 0 ? 'bg-[#0f172a] text-white border-[#0f172a]' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-[#0f172a]'}`}>
              {cat}
            </span>
          ))}
        </div>

        {/* ── Post grid ── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {rest.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group flex gap-0 border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden">
              {/* Image */}
              <div className="relative w-36 sm:w-44 flex-shrink-0">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                />
              </div>
              {/* Text */}
              <div className="flex flex-col justify-between p-5 flex-1 min-w-0">
                <div>
                  <span className="inline-block text-[10px] font-bold uppercase tracking-[2px] mb-2 font-outfit px-2 py-0.5"
                    style={{ color: post.categoryColor, backgroundColor: `${post.categoryColor}15` }}>
                    {post.category}
                  </span>
                  <h3 className="font-playfair font-bold text-[#0f172a] text-base leading-snug mb-2 group-hover:text-[#b8962e] transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">{post.excerpt}</p>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400 font-outfit mt-3 pt-3 border-t border-gray-50">
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* ── CTA ── */}
        <div className="mt-14 border border-gray-100 p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[2px] text-[#b8962e] font-outfit mb-1">Ready to go?</p>
            <p className="font-playfair font-bold text-[#0f172a] text-xl">Turn these guides into your own trip</p>
          </div>
          <Link href="/tours"
            className="flex-shrink-0 px-7 py-3 bg-[#0f172a] text-white text-sm font-bold font-outfit hover:bg-[#1e293b] transition-colors inline-flex items-center gap-2">
            Browse Tours
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/>
            </svg>
          </Link>
        </div>

      </div>
    </div>
  );
}