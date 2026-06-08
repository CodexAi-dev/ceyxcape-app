import api from '@/config/api';
import { API_ENDPOINTS } from '@/config/constants';
import { PaymentData } from '@/types';

export const paymentService = {
  // Process payment
  processPayment: async (data: PaymentData): Promise<{ payment_id: string; redirect_url: string }> => {
    const response = await api.post<{ payment_id: string; redirect_url: string }>(
      API_ENDPOINTS.PAYMENTS.PROCESS,
      data
    );
    return response.data;
  },

  // Verify payment
  verifyPayment: async (paymentId: string, bookingId: number): Promise<{ status: string; message: string }> => {
    const response = await api.post<{ status: string; message: string }>(API_ENDPOINTS.PAYMENTS.VERIFY, {
      payment_id: paymentId,
      booking_id: bookingId,
    });
    return response.data;
  },

  // Get payment status
  getPaymentStatus: async (bookingId: number): Promise<{ status: string; amount: number }> => {
    const response = await api.get<{ status: string; amount: number }>(
      API_ENDPOINTS.PAYMENTS.STATUS.replace(':bookingId', bookingId.toString())
    );
    return response.data;
  },

  // Initialize PayHere payment
  initializePayHerePayment: async (bookingId: number): Promise<{ merchant_id: string; payment_id: string }> => {
    const response = await api.post<{ merchant_id: string; payment_id: string }>('/payments/payhere/init', {
      booking_id: bookingId,
    });
    return response.data;
  },

  // Handle PayHere callback
  handlePayHereCallback: async (data: any): Promise<{ status: string }> => {
    const response = await api.post<{ status: string }>('/payments/payhere/callback', data);
    return response.data;
  },

  // Refund payment
  refundPayment: async (bookingId: number, reason?: string): Promise<{ message: string }> => {
    const response = await api.post('/payments/refund', {
      booking_id: bookingId,
      reason,
    });
    return response.data;
  },

  // Get payment methods
  getPaymentMethods: async (): Promise<any[]> => {
    const response = await api.get<{ data: any[] }>('/payments/methods');
    return response.data.data;
  },
};
