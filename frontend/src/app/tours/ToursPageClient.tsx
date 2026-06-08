'use client';
import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { tourService } from '@/services/tours';
import { Tour, TourFilters } from '@/types';
import { useWishlist } from '@/context/WishlistContext';

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'Adventure', label: 'Adventure' },
  { value: 'Cultural Tours', label: 'Cultural Tours' },
  { value: 'Beach Tours', label: 'Beach Tours' },
  { value: 'Heritage', label: 'Heritage' },
  { value: 'City Tours', label: 'City Tours' },
  { value: 'Wildlife Safari', label: 'Wildlife Safari' },
  { value: 'Honeymoon', label: 'Honeymoon' },
  { value: 'Family Tours', label: 'Family Tours' },
];

const DURATIONS = [
  { value: '', label: 'Any Duration' },
  { value: '1-3', label: '1-3 Days' },
  { value: '4-7', label: '4-7 Days' },
  { value: '8-14', label: '8-14 Days' },
  { value: '15+', label: '15+ Days' },
];

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

const PRICE_RANGES = [
  { value: '', label: 'Any Price', min: 0, max: 0 },
  { value: '0-100', label: 'Under $100', min: 0, max: 100 },
  { value: '100-300', label: '$100 - $300', min: 100, max: 300 },
  { value: '300-500', label: '$300 - $500', min: 300, max: 500 },
  { value: '500-99999', label: '$500+', min: 500, max: 99999 },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} className={`w-3.5 h-3.5 ${i <= Math.round(rating) ? 'text-[#d4af37]' : 'text-gray-200'}`}
          fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
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
    <div className="card-hover bg-white overflow-hidden shadow-card border border-gray-100 flex flex-col group">
      <div className="relative h-52 overflow-hidden">
        <Image
          src={tour.image ? `/uploads/tours/${tour.image}` : '/images/default-tour.jpg'}
          alt={tour.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
        <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#d4af37] text-white text-xs font-bold font-outfit">
          {tour.category}
        </span>
        {discountPct && (
          <span className="absolute top-3 right-12 px-2 py-1 bg-red-500 text-white text-xs font-bold font-outfit">
            -{discountPct}%
          </span>
        )}
        <button
          onClick={() => inWishlist ? removeFromWishlist(tour.id) : addToWishlist(tour.id)}
          className={`wishlist-btn absolute top-3 right-3 ${inWishlist ? 'active' : ''}`}
          aria-label="Toggle wishlist">
          <svg className="w-4 h-4" fill={inWishlist ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <StarRating rating={tour.avg_rating || 0} />
          <span className="text-xs text-gray-500 font-outfit">({tour.review_count || 0})</span>
        </div>
        <h3 className="font-playfair font-bold text-[#0f172a] text-base mb-3 line-clamp-2 flex-1">{tour.name}</h3>
        <div className="flex items-center gap-3 text-xs text-gray-500 font-outfit mb-4">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-[#d4af37]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            {tour.duration} days
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-[#d4af37]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
            {tour.location}
          </span>
        </div>
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
          <Link href={`/tours/${tour.id}`} className="btn-gold px-4 py-2 text-xs font-semibold">
            View
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white overflow-hidden shadow-card border border-gray-100">
      <div className="h-52 bg-gray-200 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-gray-200 animate-pulse w-1/2" />
        <div className="h-4 bg-gray-200 animate-pulse w-3/4" />
        <div className="h-3 bg-gray-100 animate-pulse w-2/3" />
        <div className="h-px bg-gray-100 my-2" />
        <div className="flex justify-between items-center">
          <div className="h-5 bg-gray-200 animate-pulse w-1/4" />
          <div className="h-8 bg-gray-200 animate-pulse w-16" />
        </div>
      </div>
    </div>
  );
}

interface SidebarProps {
  filters: TourFilters;
  onChange: (key: keyof TourFilters, value: string | number | undefined) => void;
  onPriceRange: (min: number, max: number, label: string) => void;
  activePriceLabel: string;
  onReset: () => void;
  total: number;
}

function FilterSidebar({ filters, onChange, onPriceRange, activePriceLabel, onReset, total }: SidebarProps) {
  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <div className="bg-white shadow-card border border-gray-100 p-5 sticky top-24">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-playfair font-bold text-[#0f172a] text-lg">Filters</h3>
          <button onClick={onReset} className="text-xs text-[#d4af37] hover:text-[#c9a961] font-semibold font-outfit transition-colors">
            Reset all
          </button>
        </div>
        <div className="mb-5 py-2.5 px-3 bg-[#fff9f0] border border-[#d4af37]/20">
          <p className="text-xs font-outfit text-gray-600">
            <span className="font-bold text-[#d4af37] text-sm">{total}</span> tours found
          </p>
        </div>
        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest font-outfit mb-3">Category</p>
          <div className="space-y-0.5">
            {CATEGORIES.map(cat => (
              <button key={cat.value} onClick={() => onChange('category', cat.value || undefined)}
                className={`w-full text-left px-3 py-2 text-sm font-outfit transition-all ${
                  (filters.category || '') === cat.value
                    ? 'bg-[#d4af37] text-white font-semibold'
                    : 'text-gray-600 hover:bg-[#fff9f0] hover:text-[#d4af37]'
                }`}>
                {cat.label}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest font-outfit mb-3">Duration</p>
          <div className="space-y-0.5">
            {DURATIONS.map(d => (
              <button key={d.value} onClick={() => onChange('duration', d.value || undefined)}
                className={`w-full text-left px-3 py-2 text-sm font-outfit transition-all ${
                  (filters.duration || '') === d.value
                    ? 'bg-[#d4af37] text-white font-semibold'
                    : 'text-gray-600 hover:bg-[#fff9f0] hover:text-[#d4af37]'
                }`}>
                {d.label}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest font-outfit mb-3">Price Range</p>
          <div className="space-y-0.5">
            {PRICE_RANGES.map(p => (
              <button key={p.value} onClick={() => onPriceRange(p.min, p.max, p.label)}
                className={`w-full text-left px-3 py-2 text-sm font-outfit transition-all ${
                  activePriceLabel === p.label
                    ? 'bg-[#d4af37] text-white font-semibold'
                    : 'text-gray-600 hover:bg-[#fff9f0] hover:text-[#d4af37]'
                }`}>
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <a href="https://wa.me/94786281242?text=Hello!%20I%20need%20help%20finding%20a%20tour."
          target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-3 p-3 bg-[#25D366]/10 border border-[#25D366]/20 hover:bg-[#25D366]/20 transition-colors">
          <div className="w-9 h-9 bg-[#25D366] flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold text-[#0f172a] font-outfit">Need help choosing?</p>
            <p className="text-xs text-gray-500 font-outfit">Chat with our experts</p>
          </div>
        </a>
      </div>
    </aside>
  );
}

function ToursContent() {
  const searchParams = useSearchParams();

  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalTours, setTotalTours] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [activePriceLabel, setActivePriceLabel] = useState('Any Price');

  const [filters, setFilters] = useState<TourFilters>({
    category: searchParams.get('search_category') || undefined,
    duration: searchParams.get('search_duration') || undefined,
    search: searchParams.get('search') || undefined,
    sort: (searchParams.get('sort') as TourFilters['sort']) || 'featured',
    page: Number(searchParams.get('page')) || 1,
    limit: 12,
  });

  const [searchInput, setSearchInput] = useState(filters.search || '');

  const fetchTours = useCallback(async (f: TourFilters) => {
    setLoading(true);
    try {
      const res = await tourService.getTours(f);
      setTours(res.data);
      setTotalTours(res.total);
      setTotalPages(res.pages);
    } catch {
      setTours([]);
      setTotalTours(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTours(filters);
  }, [filters, fetchTours]);

  const handleFilterChange = (key: keyof TourFilters, value: string | number | undefined) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePriceRange = (min: number, max: number, label: string) => {
    setActivePriceLabel(label);
    setFilters(prev => ({
      ...prev,
      price_min: min > 0 ? min : undefined,
      price_max: max > 0 && max < 99999 ? max : undefined,
      page: 1,
    }));
  };

  const handleReset = () => {
    setSearchInput('');
    setActivePriceLabel('Any Price');
    setFilters({ sort: 'featured', page: 1, limit: 12 });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, search: searchInput || undefined, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeFilterCount = [
    filters.category,
    filters.duration,
    filters.search,
    filters.price_min ? 'price' : null,
  ].filter(Boolean).length;

  const paginationItems = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter(page => {
      const cur = filters.page || 1;
      return page <= 2 || page >= totalPages - 1 || Math.abs(page - cur) <= 1;
    })
    .reduce<(number | string)[]>((acc, page, idx, arr) => {
      if (idx > 0 && typeof arr[idx - 1] === 'number' && (page as number) - (arr[idx - 1] as number) > 1) {
        acc.push('ellipsis-' + page);
      }
      acc.push(page);
      return acc;
    }, []);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="relative bg-[#0f172a] overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/sigiriya1.webp" alt="Sri Lanka Tours" fill className="object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-[#0f172a]/90 to-[#0f172a]/60" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-20">
          <nav className="flex items-center gap-2 text-sm font-outfit text-gray-400 mb-4">
            <Link href="/" className="hover:text-[#d4af37] transition-colors">Home</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <polyline points="9 18 15 12 9 6" />
            </svg>
            <span className="text-white">Tours</span>
          </nav>
          <h1 className="font-playfair font-bold text-white mb-3" style={{ fontSize: 'clamp(2rem,5vw,3rem)' }}>
            Explore Sri Lanka Tours
          </h1>
          <p className="text-gray-300 font-outfit max-w-xl">
            From misty highlands to sun-kissed beaches — find your perfect Sri Lanka adventure.
          </p>
          <form onSubmit={handleSearch} className="mt-6 flex gap-2 max-w-lg">
            <div className="flex-1 relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input type="text" value={searchInput} onChange={e => setSearchInput(e.target.value)}
                placeholder="Search tours, destinations..."
                className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 font-outfit text-sm focus:outline-none focus:border-[#d4af37] transition-all" />
            </div>
            <button type="submit" className="btn-gold px-5 py-3 text-sm font-semibold whitespace-nowrap">
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <button onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white text-sm font-outfit font-semibold text-gray-700 hover:border-[#d4af37] transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="20" y2="12" /><line x1="12" y1="18" x2="20" y2="18" />
              </svg>
              Filters
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 bg-[#d4af37] text-white text-xs flex items-center justify-center">{activeFilterCount}</span>
              )}
            </button>
            <p className="text-sm font-outfit text-gray-500">
              {loading
                ? <span className="inline-block w-24 h-4 bg-gray-200 rounded animate-pulse" />
                : <><span className="font-bold text-[#0f172a]">{totalTours}</span> tours found</>
              }
            </p>
            {filters.category && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#d4af37]/10 text-[#d4af37] text-xs font-semibold font-outfit border border-[#d4af37]/30">
                {filters.category}
                <button onClick={() => handleFilterChange('category', undefined)}>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12" /></svg>
                </button>
              </span>
            )}
            {filters.duration && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#2b4b7e]/10 text-[#2b4b7e] text-xs font-semibold font-outfit border border-[#2b4b7e]/30">
                {DURATIONS.find(d => d.value === filters.duration)?.label}
                <button onClick={() => handleFilterChange('duration', undefined)}>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12" /></svg>
                </button>
              </span>
            )}
            {filters.search && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-semibold font-outfit border border-gray-200">
                &ldquo;{filters.search}&rdquo;
                <button onClick={() => { handleFilterChange('search', undefined); setSearchInput(''); }}>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12" /></svg>
                </button>
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-outfit text-gray-500 font-semibold whitespace-nowrap">Sort by:</label>
            <select value={filters.sort || 'featured'} onChange={e => handleFilterChange('sort', e.target.value)}
              className="text-sm font-outfit border border-gray-200 px-3 py-2 bg-white text-[#0f172a] focus:outline-none focus:border-[#d4af37] transition-colors cursor-pointer">
              {SORT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-6">
          <div className="hidden lg:block">
            <FilterSidebar filters={filters} onChange={handleFilterChange} onPriceRange={handlePriceRange}
              activePriceLabel={activePriceLabel} onReset={handleReset} total={totalTours} />
          </div>

          {mobileFiltersOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)} />
              <div className="absolute right-0 top-0 h-full w-80 bg-white overflow-y-auto shadow-2xl">
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                  <h3 className="font-playfair font-bold text-lg text-[#0f172a]">Filter Tours</h3>
                  <button onClick={() => setMobileFiltersOpen(false)}
                    className="w-8 h-8 bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="p-4">
                  <FilterSidebar filters={filters}
                    onChange={(k, v) => { handleFilterChange(k, v); setMobileFiltersOpen(false); }}
                    onPriceRange={(min, max, label) => { handlePriceRange(min, max, label); setMobileFiltersOpen(false); }}
                    activePriceLabel={activePriceLabel}
                    onReset={() => { handleReset(); setMobileFiltersOpen(false); }}
                    total={totalTours} />
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(12)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : tours.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {tours.map(tour => <TourCard key={tour.id} tour={tour} />)}
                </div>
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button onClick={() => handlePageChange((filters.page || 1) - 1)}
                      disabled={(filters.page || 1) <= 1}
                      className="w-10 h-10 border border-gray-200 bg-white text-gray-500 hover:border-[#d4af37] hover:text-[#d4af37] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <polyline points="15 18 9 12 15 6" />
                      </svg>
                    </button>
                    {paginationItems.map((item, idx) =>
                      typeof item === 'string' ? (
                        <span key={item} className="text-gray-400 w-10 text-center">…</span>
                      ) : (
                        <button key={item} onClick={() => handlePageChange(item as number)}
                          className={`w-10 h-10 text-sm font-semibold font-outfit transition-all ${
                            (filters.page || 1) === item
                              ? 'bg-[#d4af37] text-white'
                              : 'border border-gray-200 bg-white text-gray-600 hover:border-[#d4af37] hover:text-[#d4af37]'
                          }`}>
                          {item}
                        </button>
                      )
                    )}
                    <button onClick={() => handlePageChange((filters.page || 1) + 1)}
                      disabled={(filters.page || 1) >= totalPages}
                      className="w-10 h-10 border border-gray-200 bg-white text-gray-500 hover:border-[#d4af37] hover:text-[#d4af37] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-24 bg-white border border-gray-100 shadow-card">
                <svg className="w-20 h-20 mx-auto mb-4 text-gray-200" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
                <h3 className="font-playfair font-bold text-[#0f172a] text-xl mb-2">No tours found</h3>
                <p className="text-gray-500 font-outfit text-sm mb-6">Try adjusting your filters or search terms.</p>
                <button onClick={handleReset} className="btn-gold px-6 py-3 text-sm font-semibold inline-flex gap-2">
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ToursPageClient() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#fafafa]">
        <div className="bg-[#0f172a] h-52 animate-pulse" />
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(9)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      </div>
    }>
      <ToursContent />
    </Suspense>
  );
}
