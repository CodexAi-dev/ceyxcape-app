'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { tourImageSrc } from '@/config/site';
import { useRouter } from 'next/navigation';
import { adminService } from '@/services/admin';
import { Tour } from '@/types';

interface Day { day: number; title: string; description: string }

const input =
  'w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-[#0f172a] focus:outline-none focus:border-[#d4af37] transition-colors';
const label = 'block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5';

export default function TourForm({ tourId }: { tourId?: number }) {
  const router = useRouter();
  const isEdit = tourId != null;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Image state (edit mode only)
  const [image, setImage] = useState<string | null>(null);
  const [gallery, setGallery] = useState<string[]>([]);
  const imageInput = useRef<HTMLInputElement>(null);
  const galleryInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name: '', tour_code: '', category: '', location: '', start_location: '',
    duration: '', price: '', discount_price: '', status: 'active' as 'active' | 'inactive',
    featured: false, description: '', includes: '', excludes: '',
  });
  const [itinerary, setItinerary] = useState<Day[]>([]);

  useEffect(() => {
    if (!isEdit) return;
    adminService.getTour(tourId!)
      .then((t) => {
        setForm({
          name: t.name || '', tour_code: t.tour_code || '', category: t.category || '',
          location: t.location || '', start_location: t.start_location || '',
          duration: t.duration != null ? String(t.duration) : '',
          price: t.price != null ? String(t.price) : '',
          discount_price: t.discount_price != null ? String(t.discount_price) : '',
          status: (t.status as 'active' | 'inactive') || 'active',
          featured: !!t.featured, description: t.description || '',
          includes: (t.includes || []).join('\n'), excludes: (t.excludes || []).join('\n'),
        });
        setImage(t.image || null);
        setGallery(t.gallery || []);
        setItinerary(((t.itinerary as Day[]) || []).map((d, i) => ({
          day: d.day || i + 1, title: d.title || '', description: d.description || '',
        })));
      })
      .catch(() => setError('Could not load this tour.'))
      .finally(() => setLoading(false));
  }, [isEdit, tourId]);

  const set = (k: keyof typeof form, v: any) => setForm((p) => ({ ...p, [k]: v }));

  const buildPayload = (): Partial<Tour> => ({
    name: form.name.trim(),
    tour_code: form.tour_code.trim() || undefined,
    category: form.category.trim() || undefined,
    location: form.location.trim() || undefined,
    start_location: form.start_location.trim() || undefined,
    duration: form.duration ? Number(form.duration) : undefined,
    price: form.price ? Number(form.price) : undefined,
    discount_price: form.discount_price ? Number(form.discount_price) : undefined,
    status: form.status,
    featured: form.featured,
    description: form.description.trim() || undefined,
    includes: form.includes.split('\n').map((s) => s.trim()).filter(Boolean),
    excludes: form.excludes.split('\n').map((s) => s.trim()).filter(Boolean),
    itinerary: itinerary
      .map((d, i) => ({ day: i + 1, title: d.title.trim(), description: d.description.trim() }))
      .filter((d) => d.title || d.description) as unknown as Tour['itinerary'],
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setNotice(null);
    if (!form.name.trim()) { setError('Tour name is required.'); return; }
    setSaving(true);
    try {
      if (isEdit) {
        await adminService.updateTour(tourId!, buildPayload());
        setNotice('Saved.');
      } else {
        const created = await adminService.createTour(buildPayload());
        router.push(`/admin/tours/${created.id}`);
        return;
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save tour.');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!isEdit) return;
    setUploading(true); setError(null);
    try {
      const t = await adminService.uploadTourImage(tourId!, file);
      setImage(t.image || null);
    } catch (err: any) { setError(err.message || 'Image upload failed.'); }
    finally { setUploading(false); }
  };

  const handleGalleryUpload = async (files: FileList) => {
    if (!isEdit || files.length === 0) return;
    setUploading(true); setError(null);
    try {
      const t = await adminService.uploadTourGallery(tourId!, Array.from(files));
      setGallery(t.gallery || []);
    } catch (err: any) { setError(err.message || 'Gallery upload failed.'); }
    finally { setUploading(false); }
  };

  const removeGalleryImage = async (filename: string) => {
    if (!isEdit) return;
    try {
      const t = await adminService.removeTourGalleryImage(tourId!, filename);
      setGallery(t.gallery || []);
    } catch { setError('Failed to remove image.'); }
  };

  if (loading) {
    return <div className="h-64 flex items-center justify-center text-gray-400">Loading…</div>;
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 pb-24">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>}
      {notice && <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3">{notice}</div>}

      {/* Basic details */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <h2 className="font-bold text-[#0f172a]">Details</h2>
        <div>
          <label className={label}>Tour name *</label>
          <input className={input} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Sigiriya Rock Fortress" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className={label}>Tour code</label><input className={input} value={form.tour_code} onChange={(e) => set('tour_code', e.target.value)} placeholder="CX-002" /></div>
          <div><label className={label}>Category</label><input className={input} value={form.category} onChange={(e) => set('category', e.target.value)} placeholder="Cultural" /></div>
          <div><label className={label}>Location</label><input className={input} value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="Sigiriya" /></div>
          <div><label className={label}>Start location</label><input className={input} value={form.start_location} onChange={(e) => set('start_location', e.target.value)} placeholder="Colombo" /></div>
          <div><label className={label}>Duration (days)</label><input type="number" min="0" className={input} value={form.duration} onChange={(e) => set('duration', e.target.value)} /></div>
          <div><label className={label}>Price (USD)</label><input type="number" min="0" step="0.01" className={input} value={form.price} onChange={(e) => set('price', e.target.value)} /></div>
          <div><label className={label}>Discount price (USD)</label><input type="number" min="0" step="0.01" className={input} value={form.discount_price} onChange={(e) => set('discount_price', e.target.value)} placeholder="optional" /></div>
          <div>
            <label className={label}>Status</label>
            <select className={input} value={form.status} onChange={(e) => set('status', e.target.value)}>
              <option value="active">Active (visible)</option>
              <option value="inactive">Inactive (hidden)</option>
            </select>
          </div>
        </div>
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} className="w-4 h-4 accent-[#d4af37]" />
          <span className="text-sm font-medium text-gray-700">Featured on homepage</span>
        </label>
        <div>
          <label className={label}>Description</label>
          <textarea rows={4} className={`${input} resize-none`} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Describe the tour experience…" />
        </div>
      </section>

      {/* Includes / Excludes */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 grid sm:grid-cols-2 gap-4">
        <div>
          <label className={label}>What&apos;s included <span className="text-gray-400 normal-case font-normal">(one per line)</span></label>
          <textarea rows={5} className={`${input} resize-none`} value={form.includes} onChange={(e) => set('includes', e.target.value)} placeholder={'Professional driver guide\nAll entrance fees\nLunch'} />
        </div>
        <div>
          <label className={label}>Not included <span className="text-gray-400 normal-case font-normal">(one per line)</span></label>
          <textarea rows={5} className={`${input} resize-none`} value={form.excludes} onChange={(e) => set('excludes', e.target.value)} placeholder={'Personal expenses\nTips'} />
        </div>
      </section>

      {/* Itinerary */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-[#0f172a]">Itinerary</h2>
          <button type="button" onClick={() => setItinerary((p) => [...p, { day: p.length + 1, title: '', description: '' }])}
            className="text-sm font-semibold text-[#d4af37] hover:underline">+ Add day</button>
        </div>
        {itinerary.length === 0 && <p className="text-sm text-gray-400">No itinerary days yet.</p>}
        {itinerary.map((d, i) => (
          <div key={i} className="border border-gray-100 rounded-xl p-3 space-y-2 bg-gray-50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#d4af37]">DAY {i + 1}</span>
              <button type="button" onClick={() => setItinerary((p) => p.filter((_, j) => j !== i))} className="text-xs text-red-500 hover:underline">Remove</button>
            </div>
            <input className={input} placeholder="Day title" value={d.title}
              onChange={(e) => setItinerary((p) => p.map((x, j) => j === i ? { ...x, title: e.target.value } : x))} />
            <textarea rows={2} className={`${input} resize-none`} placeholder="What happens this day…" value={d.description}
              onChange={(e) => setItinerary((p) => p.map((x, j) => j === i ? { ...x, description: e.target.value } : x))} />
          </div>
        ))}
      </section>

      {/* Images */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <h2 className="font-bold text-[#0f172a]">Images</h2>
        {!isEdit ? (
          <p className="text-sm text-gray-500 bg-gray-50 rounded-xl px-4 py-3">
            Save the tour first, then you can upload the main image and gallery photos.
          </p>
        ) : (
          <>
            {/* Main image */}
            <div>
              <label className={label}>Main image</label>
              <div className="flex items-center gap-4">
                <div className="relative w-28 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image src={tourImageSrc(image)} alt="Main" fill className="object-cover" sizes="112px" unoptimized />
                </div>
                <div>
                  <input ref={imageInput} type="file" accept="image/*" hidden
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
                  <button type="button" onClick={() => imageInput.current?.click()} disabled={uploading}
                    className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-[#0f172a] hover:border-[#d4af37] disabled:opacity-50">
                    {uploading ? 'Uploading…' : image ? 'Replace image' : 'Upload image'}
                  </button>
                  <p className="text-xs text-gray-400 mt-1.5">JPEG, PNG or WebP · max 5MB</p>
                </div>
              </div>
            </div>

            {/* Gallery */}
            <div>
              <label className={label}>Gallery photos</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {gallery.map((g) => (
                  <div key={g} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group">
                    <Image src={tourImageSrc(g)} alt="" fill className="object-cover" sizes="120px" unoptimized />
                    <button type="button" onClick={() => removeGalleryImage(g)}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => galleryInput.current?.click()} disabled={uploading}
                  className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#d4af37] hover:text-[#d4af37] disabled:opacity-50">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
                </button>
              </div>
              <input ref={galleryInput} type="file" accept="image/*" multiple hidden
                onChange={(e) => e.target.files && handleGalleryUpload(e.target.files)} />
            </div>
          </>
        )}
      </section>

      {/* Sticky save bar */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-64 bg-white border-t border-gray-200 px-4 sm:px-6 lg:px-8 py-3 z-30">
        <div className="max-w-6xl mx-auto flex items-center justify-end gap-3">
          <button type="button" onClick={() => router.push('/admin/tours')}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100">Cancel</button>
          <button type="submit" disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-[#d4af37] text-white text-sm font-semibold hover:bg-[#c39e2f] disabled:opacity-50">
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create tour'}
          </button>
        </div>
      </div>
    </form>
  );
}
