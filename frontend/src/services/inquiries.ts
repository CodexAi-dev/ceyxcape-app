import api from '@/config/api';
import { API_ENDPOINTS } from '@/config/constants';

export interface InquiryData {
  type?: 'general' | 'tour';
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  // Tour context (only for tour inquiries)
  tour_id?: number;
  tour_name?: string;
  tour_date?: string;
  participants?: number;
}

export interface InquiryResponse {
  message: string;
  id: number;
}

export const inquiryService = {
  // Submit an inquiry. Backend saves it and emails the business + customer.
  submit: async (data: InquiryData): Promise<InquiryResponse> => {
    const response = await api.post<InquiryResponse>(
      API_ENDPOINTS.INQUIRIES.CREATE,
      data,
    );
    return response.data;
  },
};
