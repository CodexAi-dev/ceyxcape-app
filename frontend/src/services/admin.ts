import api from '@/config/api';
import { API_BASE_URL, STORAGE_KEYS } from '@/config/constants';
import { Tour } from '@/types';

export interface AdminStats {
  tours: number;
  activeTours: number;
  inactiveTours: number;
  inquiries: number;
  newInquiries: number;
  gallery: number;
}

export interface Inquiry {
  id: number;
  type: 'general' | 'tour';
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  tourId?: number;
  tourName?: string;
  tourDate?: string;
  participants?: number;
  status: 'new' | 'read' | 'responded' | 'archived';
  createdAt: string;
}

export interface GalleryImage {
  id: number;
  src: string;
  title?: string;
  category?: string;
  createdAt: string;
}

// Multipart upload helper — uses fetch so the browser sets the correct
// multipart boundary (axios instance forces application/json by default).
async function upload<T>(path: string, formData: FormData): Promise<T> {
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
      : null;
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Upload failed (${res.status})`);
  }
  return res.json();
}

export const adminService = {
  getStats: async (): Promise<AdminStats> => {
    const { data } = await api.get<AdminStats>('/admin/stats');
    return data;
  },

  // ── Tours ──
  listTours: async (): Promise<Tour[]> => {
    const { data } = await api.get<Tour[]>('/tours/admin/all');
    return data;
  },
  getTour: async (id: number): Promise<Tour> => {
    const { data } = await api.get<Tour>(`/tours/admin/${id}`);
    return data;
  },
  createTour: async (payload: Partial<Tour>): Promise<Tour> => {
    const { data } = await api.post<Tour>('/tours', payload);
    return data;
  },
  updateTour: async (id: number, payload: Partial<Tour>): Promise<Tour> => {
    const { data } = await api.put<Tour>(`/tours/${id}`, payload);
    return data;
  },
  deleteTour: async (id: number): Promise<void> => {
    await api.delete(`/tours/${id}`);
  },
  uploadTourImage: (id: number, file: File): Promise<Tour> => {
    const fd = new FormData();
    fd.append('file', file);
    return upload<Tour>(`/tours/${id}/image`, fd);
  },
  uploadTourGallery: (id: number, files: File[]): Promise<Tour> => {
    const fd = new FormData();
    files.forEach((f) => fd.append('files', f));
    return upload<Tour>(`/tours/${id}/gallery`, fd);
  },
  removeTourGalleryImage: async (id: number, image: string): Promise<Tour> => {
    const { data } = await api.delete<Tour>(
      `/tours/${id}/gallery?image=${encodeURIComponent(image)}`,
    );
    return data;
  },

  // ── Inquiries ──
  listInquiries: async (): Promise<Inquiry[]> => {
    const { data } = await api.get<Inquiry[]>('/inquiries');
    return data;
  },
  markInquiryRead: async (id: number): Promise<void> => {
    await api.patch(`/inquiries/${id}/read`);
  },
  deleteInquiry: async (id: number): Promise<void> => {
    await api.delete(`/inquiries/${id}`);
  },

  // ── Gallery ──
  listGallery: async (): Promise<GalleryImage[]> => {
    const { data } = await api.get<GalleryImage[]>('/gallery');
    return data;
  },
  uploadGalleryImage: (file: File, title: string, category: string): Promise<GalleryImage> => {
    const fd = new FormData();
    fd.append('file', file);
    if (title) fd.append('title', title);
    if (category) fd.append('category', category);
    return upload<GalleryImage>('/gallery', fd);
  },
  deleteGalleryImage: async (id: number): Promise<void> => {
    await api.delete(`/gallery/${id}`);
  },
};
