'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { TourGrid } from '@/components/TourCard';
import { Loading, Alert } from '@/components/UI';
import { useWishlist } from '@/context/WishlistContext';
import { tourService } from '@/services/tours';
import { Tour } from '@/types';

export default function WishlistPage() {
  const { wishlist } = useWishlist();
  const [tours, setTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load wishlist tours
  useEffect(() => {
    const loadWishlistTours = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (wishlist.length === 0) {
          setTours([]);
          return;
        }

        // Fetch each wishlisted tour by id. This works regardless of how many
        // total tours exist (the list endpoint caps `limit` at 50). Tours that
        // no longer exist (404) are quietly dropped.
        const results = await Promise.all(
          wishlist.map((id) => tourService.getTourById(id).catch(() => null)),
        );
        setTours(results.filter((t): t is Tour => t !== null));
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load wishlist');
      } finally {
        setIsLoading(false);
      }
    };

    loadWishlistTours();
  }, [wishlist]);

  return (
    <>
      <main className="min-h-screen bg-gray-50">
        {/* Hero — thin photo banner */}
        <section className="relative overflow-hidden" style={{ height: 200 }}>
          <Image
            src="/images/mirissa.webp"
            alt="Sri Lanka beach"
            fill
            className="object-cover object-center"
          />
          {/* Light-left gradient — image stays clearly visible */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/80 via-[#0f172a]/50 to-transparent" />
          <div className="relative h-full flex items-end">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 w-full">
              <nav className="flex items-center gap-2 text-xs text-white/50 mb-2">
                <Link href="/" className="hover:text-[#d4af37] transition-colors">Home</Link>
                <span className="opacity-40">/</span>
                <span className="text-white/80">Wishlist</span>
              </nav>
              <h1 className="text-3xl font-bold text-white font-playfair">My Wishlist</h1>
            </div>
          </div>
        </section>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {error && (
            <Alert type="error" onClose={() => setError(null)} className="mb-6">
              {error}
            </Alert>
          )}

          {isLoading ? (
            <Loading text="Loading your wishlist..." />
          ) : wishlist.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-4">Your wishlist is empty</p>
              <a
                href="/tours"
                className="inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
              >
                Explore Tours
              </a>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-6">You have {wishlist.length} tour(s) in your wishlist</p>
              <TourGrid tours={tours} />
            </>
          )}
        </div>
      </main>
    </>
  );
}
