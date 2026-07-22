'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { tourImageSrc } from '@/config/site';
import { tourService } from '@/services/tours';
import { Tour } from '@/types';
import { useWishlist } from '@/context/WishlistContext';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} className={`w-3.5 h-3.5 ${i <= Math.round(rating) ? 'text-[#d4af37]' : 'text-gray-200'}`}
          fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  );
}

function TourCard({ tour }: { tour: Tour }) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const inWishlist = isInWishlist(tour.id);
  const discountPct = tour.discount_price
    ? Math.round((1 - tour.discount_price / tour.price) * 100)
    : null;

  return (
    <div className="card-hover bg-white rounded-2xl overflow-hidden shadow-card border border-gray-100 flex flex-col">
      {/* Image */}
      <div className="tour-card-img relative h-52">
        <Image
          src={tourImageSrc(tour.image)}
          alt={tour.name} fill className="object-cover" />
        {/* Category badge — top left */}
        <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#d4af37] text-white text-xs font-bold rounded-full font-outfit">
          {tour.category}
        </span>
        {/* Offer label — top right */}
        {discountPct && (
          <span className="absolute top-3 right-3 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full font-outfit">
            -{discountPct}%
          </span>
        )}
        {/* Wishlist — bottom right */}
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); inWishlist ? removeFromWishlist(tour.id) : addToWishlist(tour.id); }}
          className={`wishlist-btn absolute bottom-3 right-3 ${inWishlist ? 'active' : ''}`}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}>
          <svg className="w-4 h-4" fill={inWishlist ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        {/* Rating */}
        <div className="flex items-center gap-2 mb-2">
          <StarRating rating={tour.avg_rating || 0} />
          <span className="text-xs text-gray-500 font-outfit">({tour.review_count || 0})</span>
        </div>

        <h3 className="font-playfair font-bold text-[#0f172a] text-base mb-3 line-clamp-2 flex-1">{tour.name}</h3>

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-gray-500 font-outfit mb-4">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-[#d4af37]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            {tour.duration} days
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-[#d4af37]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            {tour.location}
          </span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
          <div>
            {tour.discount_price ? (
              <>
                <span className="price-original mr-1">${tour.price}</span>
                <span className="price-current">${tour.discount_price}</span>
              </>
            ) : (
              <span className="price-current">${tour.price}</span>
            )}
            <span className="text-xs text-gray-400 font-outfit"> / person</span>
          </div>
          <Link href={`/tours/${tour.id}`}
            className="btn-gold px-4 py-2 rounded-lg text-xs font-semibold">
            View
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedToursSection() {
  const [tours, setTours]     = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tourService.getTours({ sort: 'featured', limit: 6 })
      .then(res => setTours(res.data))
      .catch(() => setTours([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="tours" className="section-py bg-[#fafafa]" aria-label="Featured tours">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[#d4af37] text-sm font-semibold tracking-[2px] uppercase font-outfit mb-2">Handpicked Experiences</p>
            <h2 className="font-playfair font-bold text-[#0f172a]" style={{ fontSize: 'clamp(1.8rem,4vw,2.5rem)' }}>
              Featured Tours
            </h2>
          </div>
          <Link href="/tours"
            className="hidden sm:flex items-center gap-2 text-sm font-semibold text-[#d4af37] hover:text-[#c9a961] transition-colors font-outfit">
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/>
            </svg>
          </Link>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-card">
                <div className="h-52 bg-gray-200 animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : tours.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map(tour => <TourCard key={tour.id} tour={tour} />)}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400 font-outfit">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-200" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/>
            </svg>
            <p>Featured tours are on the way. Check back soon.</p>
          </div>
        )}

        <div className="text-center mt-8 sm:hidden">
          <Link href="/tours" className="btn-gold px-7 py-3 rounded-xl text-sm inline-flex">
            View All Tours
          </Link>
        </div>
      </div>
    </section>
  );
}
