// Application configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'CeyXcape';
export const APP_DESCRIPTION = process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Private Sri Lanka Tours';

// ─────────────────────────────────────────────────────────────
// Business contact details — single source of truth.
// CHANGE THESE to your real numbers/email and they update everywhere
// (header, footer, WhatsApp buttons, contact page, tour pages).
// `whatsapp` must be digits only with country code, no '+' or spaces.
// ─────────────────────────────────────────────────────────────
export const CONTACT = {
  phone: '+94786281242',          // used in tel: links
  phoneDisplay: '+94 78 628 1242', // shown to users
  whatsapp: '94786281242',        // used in wa.me/ links (digits only)
  email: 'info@ceyxcape.com',
  address: '61/38, Indrajothi Road, Pannipitiya Road, Battaramulla, Sri Lanka',
  hours: 'Mon–Sat: 9AM–6PM',
};

// Build a WhatsApp click-to-chat link with a pre-filled message.
export const buildWhatsAppLink = (message: string): string =>
  `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh-token',
    VERIFY_EMAIL: '/auth/verify-email',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },

  // Users
  USERS: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    UPLOAD_AVATAR: '/users/upload-avatar',
    CHANGE_PASSWORD: '/users/change-password',
    GET_USER: '/users',
  },

  // Tours
  TOURS: {
    LIST: '/tours',
    GET_ONE: '/tours/:id',
    CREATE: '/tours',
    UPDATE: '/tours/:id',
    DELETE: '/tours/:id',
    SEARCH: '/tours/search',
    FILTER: '/tours/filter',
  },

  // Bookings
  BOOKINGS: {
    LIST: '/bookings',
    GET_ONE: '/bookings/:id',
    CREATE: '/bookings',
    UPDATE: '/bookings/:id',
    CANCEL: '/bookings/:id/cancel',
    INVOICE: '/bookings/:id/invoice',
  },

  // Reviews
  REVIEWS: {
    LIST: '/reviews',
    GET_TOUR_REVIEWS: '/reviews/tour/:tourId',
    CREATE: '/reviews',
    UPDATE: '/reviews/:id',
    DELETE: '/reviews/:id',
  },

  // Wishlists
  WISHLIST: {
    GET: '/wishlists',
    ADD: '/wishlists',
    REMOVE: '/wishlists/:tourId',
  },

  // Payments
  PAYMENTS: {
    PROCESS: '/payments/process',
    STATUS: '/payments/:bookingId/status',
    VERIFY: '/payments/verify',
  },

  // Custom Tours
  CUSTOM_TOURS: {
    REQUEST: '/custom-tours/request',
    GET_REQUESTS: '/custom-tours/requests',
    UPDATE_REQUEST: '/custom-tours/requests/:id',
  },

  // Inquiries (contact form + tour enquiries)
  INQUIRIES: {
    CREATE: '/inquiries',
    LIST: '/inquiries',
  },
};

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'ceyxcape_auth_token',
  REFRESH_TOKEN: 'ceyxcape_refresh_token',
  USER: 'ceyxcape_user',
  WISHLIST: 'ceyxcape_wishlist',
  BOOKING_DRAFT: 'ceyxcape_booking_draft',
};

// Tour categories
export const TOUR_CATEGORIES = [
  { value: 'adventure', label: 'Adventure' },
  { value: 'cultural', label: 'Cultural' },
  { value: 'beach', label: 'Beach' },
  { value: 'heritage', label: 'Heritage' },
  { value: 'city', label: 'City Tours' },
  { value: 'wildlife', label: 'Wildlife' },
  { value: 'multi-day', label: 'Multi-Day' },
];

// Duration options
export const DURATION_OPTIONS = [
  { value: '1-3', label: '1-3 Days' },
  { value: '4-7', label: '4-7 Days' },
  { value: '8-14', label: '8-14 Days' },
  { value: '15+', label: '15+ Days' },
];

// Price ranges
export const PRICE_RANGES = [
  { value: '0-100', label: 'Under $100' },
  { value: '100-300', label: '$100 - $300' },
  { value: '300-500', label: '$300 - $500' },
  { value: '500+', label: '$500+' },
];

// Booking statuses
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// Payment statuses
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// Timeouts (ms)
export const TIMEOUTS = {
  API_CALL: 30000,
  FORM_SUBMIT: 5000,
};
