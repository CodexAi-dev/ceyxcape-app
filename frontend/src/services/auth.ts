import api from '@/config/api';
import { API_ENDPOINTS, STORAGE_KEYS } from '@/config/constants';
import { User, AuthResponse, LoginCredentials, RegisterData } from '@/types';

export const authService = {
  // Login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
    if (response.data.access_token) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.access_token);
      if (response.data.refresh_token) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.data.refresh_token);
      }
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Register
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data);
    if (response.data.access_token) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.access_token);
      if (response.data.refresh_token) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.data.refresh_token);
      }
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Logout
  logout: (): void => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  // Get current user
  getCurrentUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    if (!raw || raw === 'undefined' || raw === 'null') return null;
    try {
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' && parsed.id ? parsed : null;
    } catch {
      // Corrupt user payload — wipe it so we don't loop on bad state
      localStorage.removeItem(STORAGE_KEYS.USER);
      return null;
    }
  },

  // Get auth token
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  // Check if authenticated
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  // Forgot password
  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const response = await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token: string, newPassword: string): Promise<{ message: string }> => {
    const response = await api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, { token, password: newPassword });
    return response.data;
  },

  // Change password
  changePassword: async (currentPassword: string, newPassword: string): Promise<{ message: string }> => {
    const response = await api.post('/users/change-password', { current_password: currentPassword, new_password: newPassword });
    return response.data;
  },

  // Update profile
  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await api.put<User>(API_ENDPOINTS.USERS.UPDATE_PROFILE, data);
    if (response.data) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data));
    }
    return response.data;
  },

  // Upload avatar
  uploadAvatar: async (file: File): Promise<{ profile_pic: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<{ profile_pic: string }>(API_ENDPOINTS.USERS.UPLOAD_AVATAR, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Get profile
  getProfile: async (): Promise<User> => {
    const response = await api.get<User>(API_ENDPOINTS.USERS.PROFILE);
    return response.data;
  },
};
