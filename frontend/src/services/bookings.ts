import api from '@/config/api';
import { API_ENDPOINTS } from '@/config/constants';
import { Booking, CreateBookingData } from '@/types';

export const bookingService = {
  // Get user's bookings
  getBookings: async (page = 1, limit = 10): Promise<{ data: Booking[]; total: number }> => {
    const response = await api.get<{ data: Booking[]; total: number }>(API_ENDPOINTS.BOOKINGS.LIST, {
      params: { page, limit },
    });
    return response.data;
  },

  // Get single booking
  getBookingById: async (id: number): Promise<Booking> => {
    const response = await api.get<Booking>(API_ENDPOINTS.BOOKINGS.GET_ONE.replace(':id', id.toString()));
    return response.data;
  },

  // Create booking
  createBooking: async (data: CreateBookingData): Promise<Booking> => {
    const response = await api.post<Booking>(API_ENDPOINTS.BOOKINGS.CREATE, data);
    return response.data;
  },

  // Update booking
  updateBooking: async (id: number, data: Partial<Booking>): Promise<Booking> => {
    const response = await api.put<Booking>(API_ENDPOINTS.BOOKINGS.UPDATE.replace(':id', id.toString()), data);
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (id: number, reason?: string): Promise<{ message: string }> => {
    const response = await api.post(API_ENDPOINTS.BOOKINGS.CANCEL.replace(':id', id.toString()), {
      cancellation_reason: reason,
    });
    return response.data;
  },

  // Get booking invoice
  getInvoice: async (id: number): Promise<Blob> => {
    const response = await api.get(API_ENDPOINTS.BOOKINGS.INVOICE.replace(':id', id.toString()), {
      responseType: 'blob',
    });
    return response.data;
  },

  // Download invoice
  downloadInvoice: async (bookingId: number, filename?: string): Promise<void> => {
    const blob = await bookingService.getInvoice(bookingId);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `invoice-${bookingId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  // Save booking as draft (local storage)
  saveDraft: async (data: Partial<Booking>): Promise<void> => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('booking_draft', JSON.stringify(data));
  },

  // Get saved draft
  getDraft: async (): Promise<Partial<Booking> | null> => {
    if (typeof window === 'undefined') return null;
    const draft = localStorage.getItem('booking_draft');
    return draft ? JSON.parse(draft) : null;
  },

  // Clear draft
  clearDraft: async (): Promise<void> => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('booking_draft');
  },
};
