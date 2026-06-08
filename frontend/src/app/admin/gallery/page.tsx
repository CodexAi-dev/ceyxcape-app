'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { adminService, GalleryImage } from '@/services/admin';

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);

  const load = () => {
    setLoading(true);
    adminService.listGallery().then(setImages).catch(() => setImages([])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleUpload = async (files: FileList) => {
    if (files.length === 0) return;
    setUploading(true); setError(null);
    try {
      for (const file of Array.from(files)) {
        const img = await adminService.uploadGalleryImage(file, title, category);
        setImages((prev) => [...prev, img]);
      }
      setTitle(''); setCategory('');
    } catch (err: any) {
      setError(err.message || 'Upload failed.');
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = '';
    }
  };

  const del = async (img: GalleryImage) => {
    if (!confirm('Delete this photo from the gallery?')) return;
    try {
      await adminService.deleteGalleryImage(img.id);
      setImages((prev) => prev.filter((x) => x.id !== img.id));
    } catch { alert('Failed to delete.'); }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0f172a]">Gallery</h1>
        <p className="text-gray-500 text-sm mt-0.5">{images.length} photos shown on the public gallery page.</p>
      </div>

      {/* Upload card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
        <h2 className="font-bold text-[#0f172a] mb-4">Add photos</h2>
        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-2.5 mb-4">{error}</div>}
        <div className="grid sm:grid-cols-2 gap-3 mb-4">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title (optional)"
            className="px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#d4af37]" />
          <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category, e.g. Beaches (optional)"
            className="px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#d4af37]" />
        </div>
        <input ref={fileInput} type="file" accept="image/*" multiple hidden
          onChange={(e) => e.target.files && handleUpload(e.target.files)} />
        <button onClick={() => fileInput.current?.click()} disabled={uploading}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#d4af37] text-white font-semibold text-sm hover:bg-[#c39e2f] disabled:opacity-50">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          {uploading ? 'Uploading…' : 'Choose images'}
        </button>
        <p className="text-xs text-gray-400 mt-2">JPEG, PNG or WebP · max 5MB each · the title/category applies to this batch.</p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => <div key={i} className="aspect-square bg-white rounded-2xl border border-gray-100 animate-pulse" />)}
        </div>
      ) : images.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-500">No photos yet.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map((img) => (
            <div key={img.id} className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 group border border-gray-100">
              <Image src={img.src} alt={img.title || ''} fill className="object-cover" sizes="240px" unoptimized />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                {img.category && <span className="inline-block text-[9px] font-bold uppercase bg-[#d4af37] text-white px-1.5 py-0.5 rounded mb-1">{img.category}</span>}
                <p className="text-white text-xs font-semibold leading-tight line-clamp-2">{img.title}</p>
              </div>
              <button onClick={() => del(img)}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 hover:bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
