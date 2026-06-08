import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_BASE_URL, STORAGE_KEYS, TIMEOUTS } from './constants';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: TIMEOUTS.API_CALL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor — only force-logout when our token is genuinely rejected.
// A 401 from a not-yet-implemented endpoint must NOT wipe a valid session.
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const url = error.config?.url || '';

    // Only treat 401 as "session expired" when calling auth-critical endpoints
    // (/auth/me, /users/profile, /users/change-password). For anything else,
    // surface the error to the caller and let the page decide.
    const isAuthCritical = /\/(auth\/me|users\/(profile|change-password))/.test(url);

    if (status === 401 && isAuthCritical && typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      // Soft redirect (no full reload) so toast survives if needed.
      if (!window.location.pathname.startsWith('/auth/')) {
        window.location.href = '/auth/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
