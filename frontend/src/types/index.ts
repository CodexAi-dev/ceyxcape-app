// User types
export interface User {
  id: number;
  email: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  profile_pic?: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token?: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

// Tour types
export interface Tour {
  id: number;
  tour_code: string;
  name: string;
  description: string;
  category: string;
  start_location: string;
  location: string;
  duration: number;
  price: number;
  discount_price?: number;
  image: string;
  gallery: string[];
  itinerary: ItineraryDay[];
  includes: string[];
  excludes: string[];
  status: 'active' | 'inactive';
  featured: boolean;
  views: number;
  avg_rating?: number;
  review_count?: number;
  created_at: string;
  updated_at: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
  meals: string;
}

export interface TourFilters {
  category?: string;
  duration?: string;
  price_min?: number;
  price_max?: number;
  search?: string;
  sort?: 'featured' | 'price_low' | 'price_high' | 'rating' | 'newest';
  page?: number;
  limit?: number;
}

export interface TourListResponse {
  data: Tour[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// Booking types
export interface Booking {
  id: number;
  booking_code: string;
  user_id: number;
  tour_id: number;
  booking_date: string;
  tour_date: string;
  participants: number;
  total_amount: number;
  booking_status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_id?: string;
  payment_date?: string;
  payment_amount?: number;
  tour?: Tour;
  created_at: string;
  updated_at: string;
}

export interface CreateBookingData {
  tour_id: number;
  tour_date: string;
  participants: number;
  special_requests?: string;
}

// Review types
export interface Review {
  id: number;
  tour_id: number;
  user_id: number;
  rating: number;
  review_title: string;
  review_text: string;
  verified_purchase: boolean;
  status: 'pending' | 'approved' | 'rejected';
  user?: { username: string; profile_pic?: string };
  created_at: string;
  updated_at: string;
}

export interface CreateReviewData {
  tour_id: number;
  rating: number;
  review_title: string;
  review_text: string;
}

export interface ReviewListResponse {
  data: Review[];
  total: number;
  page: number;
  limit: number;
}

// Wishlist types
export interface WishlistItem {
  id: number;
  tour_id: number;
  tour?: Tour;
  created_at: string;
}

// Custom tour request types
export interface CustomTourRequest {
  destination: string;
  duration: string;
  travel_date: string;
  group_size: number;
  tour_types: string[];
  budget: number;
  accommodation: string;
  special_requirements?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_country: string;
  notes?: string;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// Form types
export interface BookingFormData {
  tour_date: string;
  participants: number;
  special_requests?: string;
}

export interface PaymentData {
  booking_id: number;
  amount: number;
  currency: string;
}

// Context types
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export interface BookingContextType {
  currentBooking: Partial<Booking> | null;
  setCurrentBooking: (booking: Partial<Booking> | null) => void;
  clearBooking: () => void;
}

export interface WishlistContextType {
  wishlist: number[];
  addToWishlist: (tourId: number) => void;
  removeFromWishlist: (tourId: number) => void;
  isInWishlist: (tourId: number) => boolean;
}
