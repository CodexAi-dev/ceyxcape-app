import api from '@/config/api';
import { API_ENDPOINTS } from '@/config/constants';
import { CustomTourRequest } from '@/types';

export const customTourService = {
  // Request custom tour
  requestCustomTour: async (data: CustomTourRequest): Promise<{ message: string; request_id: number }> => {
    const response = await api.post<{ message: string; request_id: number }>(
      API_ENDPOINTS.CUSTOM_TOURS.REQUEST,
      data
    );
    return response.data;
  },

  // Get user's custom tour requests
  getCustomTourRequests: async (): Promise<CustomTourRequest[]> => {
    const response = await api.get<{ data: CustomTourRequest[] }>(API_ENDPOINTS.CUSTOM_TOURS.GET_REQUESTS);
    return response.data.data;
  },

  // Get single request
  getCustomTourRequest: async (id: number): Promise<CustomTourRequest> => {
    const response = await api.get<CustomTourRequest>(`/custom-tours/requests/${id}`);
    return response.data;
  },

  // Update request
  updateCustomTourRequest: async (id: number, data: Partial<CustomTourRequest>): Promise<CustomTourRequest> => {
    const response = await api.put<CustomTourRequest>(
      API_ENDPOINTS.CUSTOM_TOURS.UPDATE_REQUEST.replace(':id', id.toString()),
      data
    );
    return response.data;
  },

  // Cancel request
  cancelCustomTourRequest: async (id: number): Promise<{ message: string }> => {
    const response = await api.post(`/custom-tours/requests/${id}/cancel`);
    return response.data;
  },
};
