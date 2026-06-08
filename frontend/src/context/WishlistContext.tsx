'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { WishlistContextType } from '@/types';
import { wishlistService } from '@/services/wishlist';

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

// The wishlist is stored in localStorage (the backend has no wishlist API).
// State updates are applied immediately so the heart toggles instantly for
// everyone, logged in or not.
export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<number[]>([]);

  // Load the saved wishlist once on mount.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    setWishlist(wishlistService.getLocalWishlist());
  }, []);

  const addToWishlist = (tourId: number) => {
    setWishlist((prev) => {
      if (prev.includes(tourId)) return prev;
      wishlistService.addToLocalWishlist(tourId);
      return [...prev, tourId];
    });
  };

  const removeFromWishlist = (tourId: number) => {
    setWishlist((prev) => {
      wishlistService.removeFromLocalWishlist(tourId);
      return prev.filter((id) => id !== tourId);
    });
  };

  const isInWishlist = (tourId: number) => {
    return wishlist.includes(tourId);
  };

  const value: WishlistContextType = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};
