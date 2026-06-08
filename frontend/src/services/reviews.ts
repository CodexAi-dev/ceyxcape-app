import api from '@/config/api';
import { API_ENDPOINTS } from '@/config/constants';
import { Review, CreateReviewData, ReviewListResponse } from '@/types';

export const reviewService = {
  // Get all reviews with pagination
  getReviews: async (page = 1, limit = 10): Promise<ReviewListResponse> => {
    const response = await api.get<ReviewListResponse>(API_ENDPOINTS.REVIEWS.LIST, {
      params: { page, limit },
    });
    return response.data;
  },

  // Get reviews for a specific tour
  getTourReviews: async (tourId: number, page = 1, limit = 10): Promise<ReviewListResponse> => {
    const response = await api.get<ReviewListResponse>(
      API_ENDPOINTS.REVIEWS.GET_TOUR_REVIEWS.replace(':tourId', tourId.toString()),
      { params: { page, limit } }
    );
    return response.data;
  },

  // Create review
  createReview: async (data: CreateReviewData): Promise<Review> => {
    const response = await api.post<Review>(API_ENDPOINTS.REVIEWS.CREATE, data);
    return response.data;
  },

  // Update review
  updateReview: async (id: number, data: Partial<CreateReviewData>): Promise<Review> => {
    const response = await api.put<Review>(API_ENDPOINTS.REVIEWS.UPDATE.replace(':id', id.toString()), data);
    return response.data;
  },

  // Delete review
  deleteReview: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete(API_ENDPOINTS.REVIEWS.DELETE.replace(':id', id.toString()));
    return response.data;
  },

  // Get user's reviews
  getUserReviews: async (): Promise<Review[]> => {
    const response = await api.get<{ data: Review[] }>('/reviews/my-reviews');
    return response.data.data;
  },

  // Check if user can review a tour
  canReviewTour: async (tourId: number): Promise<{ canReview: boolean; reason?: string }> => {
    const response = await api.get<{ canReview: boolean; reason?: string }>(`/reviews/tour/${tourId}/can-review`);
    return response.data;
  },
};
