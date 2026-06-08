'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Tour } from '@/types';
import { formatCurrency, truncateText } from '@/utils/formatting';
import { useWishlist } from '@/context/WishlistContext';
import { Badge } from './UI';

interface TourCardProps {
  tour: Tour;
  onClick?: () => void;
}

export const TourCard: React.FC<TourCardProps> = ({ tour, onClick }) => {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const inWishlist = isInWishlist(tour.id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inWishlist) {
      removeFromWishlist(tour.id);
    } else {
      addToWishlist(tour.id);
    }
  };

  return (
    <Link href={`/tours/${tour.id}`}>
      <div
        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer h-full"
        onClick={onClick}
      >
        {/* Image */}
        <div className="relative h-48 bg-gray-200 overflow-hidden">
          <Image
            src={tour.image ? `/uploads/tours/${tour.image}` : '/images/default-tour.jpg'}
            alt={tour.name}
            fill
            className="object-cover hover:scale-110 transition duration-300"
          />
          {tour.featured && (
            <Badge variant="primary" className="absolute top-2 left-2">
              Featured
            </Badge>
          )}
          <button
            onClick={handleWishlistClick}
            className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition"
          >
            <svg
              className={`w-6 h-6 ${inWishlist ? 'text-red-500 fill-current' : 'text-gray-400'}`}
              fill={inWishlist ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-sm text-gray-500">{tour.category}</p>
              <h3 className="font-semibold text-gray-900 truncate">{tour.name}</h3>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {truncateText(tour.description, 80)}
          </p>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1">
              <span className="text-yellow-400">★</span>
              <span className="text-sm font-semibold text-gray-700">
                {tour.avg_rating?.toFixed(1) || 'N/A'}
              </span>
              <span className="text-sm text-gray-500">
                ({tour.review_count || 0} reviews)
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              {tour.discount_price ? (
                <div>
                  <p className="text-sm line-through text-gray-400">
                    {formatCurrency(tour.price)}
                  </p>
                  <p className="text-lg font-bold text-primary">
                    {formatCurrency(tour.discount_price)}
                  </p>
                </div>
              ) : (
                <p className="text-lg font-bold text-primary">{formatCurrency(tour.price)}</p>
              )}
            </div>
            <div className="text-right text-sm text-gray-600">
              <p>{tour.duration} days</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

interface TourGridProps {
  tours: Tour[];
  isLoading?: boolean;
  onTourClick?: (tour: Tour) => void;
}

export const TourGrid: React.FC<TourGridProps> = ({ tours, isLoading = false, onTourClick }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-lg h-80 animate-pulse" />
        ))}
      </div>
    );
  }

  if (tours.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No tours found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tours.map((tour) => (
        <TourCard key={tour.id} tour={tour} onClick={() => onTourClick?.(tour)} />
      ))}
    </div>
  );
};

// Tour filters component
interface TourFiltersProps {
  onFilterChange: (filters: any) => void;
  categories: string[];
}

export const TourFilters: React.FC<TourFiltersProps> = ({ onFilterChange, categories }) => {
  const [filters, setFilters] = React.useState({
    category: '',
    duration: '',
    price_min: 0,
    price_max: 1000,
    sort: 'featured',
  });

  const handleChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-4">Filters</h3>

      {/* Category */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
        <select
          value={filters.category}
          onChange={(e) => handleChange('category', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Duration */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
        <select
          value={filters.duration}
          onChange={(e) => handleChange('duration', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All Durations</option>
          <option value="1-3">1-3 Days</option>
          <option value="4-7">4-7 Days</option>
          <option value="8-14">8-14 Days</option>
          <option value="15+">15+ Days</option>
        </select>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price Range: ${filters.price_min} - ${filters.price_max}
        </label>
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="1000"
            value={filters.price_min}
            onChange={(e) => handleChange('price_min', parseInt(e.target.value))}
            className="w-full"
          />
          <input
            type="range"
            min="0"
            max="1000"
            value={filters.price_max}
            onChange={(e) => handleChange('price_max', parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Sort */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
        <select
          value={filters.sort}
          onChange={(e) => handleChange('sort', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="featured">Featured</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
          <option value="rating">Best Rating</option>
          <option value="newest">Newest</option>
        </select>
      </div>
    </div>
  );
};
