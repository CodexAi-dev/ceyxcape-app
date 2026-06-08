import api from '@/config/api';
import { API_ENDPOINTS, STORAGE_KEYS } from '@/config/constants';
import { WishlistItem } from '@/types';

export const wishlistService = {
  // Get user's wishlist
  getWishlist: async (): Promise<WishlistItem[]> => {
    const response = await api.get<{ data: WishlistItem[] }>(API_ENDPOINTS.WISHLIST.GET);
    return response.data.data;
  },

  // Add to wishlist
  addToWishlist: async (tourId: number): Promise<WishlistItem> => {
    const response = await api.post<WishlistItem>(API_ENDPOINTS.WISHLIST.ADD, { tour_id: tourId });
    return response.data;
  },

  // Remove from wishlist
  removeFromWishlist: async (tourId: number): Promise<{ message: string }> => {
    const response = await api.delete(API_ENDPOINTS.WISHLIST.REMOVE.replace(':tourId', tourId.toString()));
    return response.data;
  },

  // Get local wishlist (for unauthenticated users)
  getLocalWishlist: (): number[] => {
    if (typeof window === 'undefined') return [];
    const wishlist = localStorage.getItem(STORAGE_KEYS.WISHLIST);
    return wishlist ? JSON.parse(wishlist) : [];
  },

  // Add to local wishlist
  addToLocalWishlist: (tourId: number): void => {
    if (typeof window === 'undefined') return;
    const wishlist = wishlistService.getLocalWishlist();
    if (!wishlist.includes(tourId)) {
      wishlist.push(tourId);
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
    }
  },

  // Remove from local wishlist
  removeFromLocalWishlist: (tourId: number): void => {
    if (typeof window === 'undefined') return;
    const wishlist = wishlistService.getLocalWishlist();
    const filtered = wishlist.filter((id) => id !== tourId);
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(filtered));
  },

  // Check if tour is in local wishlist
  isInLocalWishlist: (tourId: number): boolean => {
    return wishlistService.getLocalWishlist().includes(tourId);
  },

  // Clear local wishlist
  clearLocalWishlist: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.WISHLIST);
  },
};
