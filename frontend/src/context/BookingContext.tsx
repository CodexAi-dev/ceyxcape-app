'use client';

import React, { createContext, useContext, useState } from 'react';
import { Booking, BookingContextType } from '@/types';

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentBooking, setCurrentBooking] = useState<Partial<Booking> | null>(null);

  const clearBooking = () => {
    setCurrentBooking(null);
  };

  const value: BookingContextType = {
    currentBooking,
    setCurrentBooking,
    clearBooking,
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within BookingProvider');
  }
  return context;
};
