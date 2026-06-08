import api from '@/config/api';
import { API_ENDPOINTS } from '@/config/constants';
import { Tour, TourFilters, TourListResponse } from '@/types';

export const tourService = {
  // Get all tours with pagination
  getTours: async (filters?: TourFilters): Promise<TourListResponse> => {
    const params = {
      page: filters?.page || 1,
      limit: filters?.limit || 10,
      ...(filters?.category && { category: filters.category }),
      ...(filters?.duration && { duration: filters.duration }),
      ...(filters?.price_min && { price_min: filters.price_min }),
      ...(filters?.price_max && { price_max: filters.price_max }),
      ...(filters?.search && { search: filters.search }),
      ...(filters?.sort && { sort: filters.sort }),
    };
    const response = await api.get<TourListResponse>(API_ENDPOINTS.TOURS.LIST, { params });
    return response.data;
  },

  // Get single tour by ID
  getTourById: async (id: number): Promise<Tour> => {
    const response = await api.get<Tour>(API_ENDPOINTS.TOURS.GET_ONE.replace(':id', id.toString()));
    return response.data;
  },

  // Search tours
  searchTours: async (query: string): Promise<TourListResponse> => {
    const response = await api.get<TourListResponse>(API_ENDPOINTS.TOURS.SEARCH, {
      params: { search: query },
    });
    return response.data;
  },

  // Filter tours
  filterTours: async (filters: TourFilters): Promise<TourListResponse> => {
    return tourService.getTours(filters);
  },

  // Get featured tours
  getFeaturedTours: async (): Promise<Tour[]> => {
    const response = await api.get<{ data: Tour[] }>(API_ENDPOINTS.TOURS.LIST, {
      params: { featured: true, limit: 10 },
    });
    return response.data.data;
  },

  // Get trending tours (most viewed)
  getTrendingTours: async (): Promise<Tour[]> => {
    const response = await api.get<{ data: Tour[] }>(API_ENDPOINTS.TOURS.LIST, {
      params: { sort: 'views', limit: 6 },
    });
    return response.data.data;
  },

  // Create tour (admin)
  createTour: async (data: Partial<Tour>): Promise<Tour> => {
    const response = await api.post<Tour>(API_ENDPOINTS.TOURS.CREATE, data);
    return response.data;
  },

  // Update tour (admin)
  updateTour: async (id: number, data: Partial<Tour>): Promise<Tour> => {
    const response = await api.put<Tour>(API_ENDPOINTS.TOURS.UPDATE.replace(':id', id.toString()), data);
    return response.data;
  },

  // Delete tour (admin)
  deleteTour: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete(API_ENDPOINTS.TOURS.DELETE.replace(':id', id.toString()));
    return response.data;
  },

  // Increment tour views
  incrementTourViews: async (id: number): Promise<void> => {
    await api.post(`/tours/${id}/views`);
  },
};
