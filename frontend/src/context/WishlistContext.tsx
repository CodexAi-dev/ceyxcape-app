'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { WishlistContextType } from '@/types';
import { wishlistService } from '@/services/wishlist';
import { useAuth } from './AuthContext';

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<number[]>([]);
  const { isAuthenticated } = useAuth();

  // Load wishlist on mount
  useEffect(() => {
    const loadWishlist = async () => {
      if (typeof window === 'undefined') return;

      if (isAuthenticated) {
        try {
          // Load from API if authenticated
          const items = await wishlistService.getWishlist();
          setWishlist(items.map((item) => item.tour_id));
        } catch (error) {
          // Fall back to local wishlist
          const local = wishlistService.getLocalWishlist();
          setWishlist(local);
        }
      } else {
        // Use local wishlist for unauthenticated users
        const local = wishlistService.getLocalWishlist();
        setWishlist(local);
      }
    };

    loadWishlist();
  }, [isAuthenticated]);

  const addToWishlist = (tourId: number) => {
    if (wishlist.includes(tourId)) return;

    if (isAuthenticated) {
      wishlistService.addToWishlist(tourId).then(() => {
        setWishlist([...wishlist, tourId]);
      });
    } else {
      wishlistService.addToLocalWishlist(tourId);
      setWishlist([...wishlist, tourId]);
    }
  };

  const removeFromWishlist = (tourId: number) => {
    if (isAuthenticated) {
      wishlistService.removeFromWishlist(tourId).then(() => {
        setWishlist(wishlist.filter((id) => id !== tourId));
      });
    } else {
      wishlistService.removeFromLocalWishlist(tourId);
      setWishlist(wishlist.filter((id) => id !== tourId));
    }
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
