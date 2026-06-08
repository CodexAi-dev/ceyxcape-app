'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { adminService } from '@/services/admin';
import { Tour } from '@/types';

export default function AdminToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    adminService.listTours().then(setTours).catch(() => setTours([])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const onDelete = async (t: Tour) => {
    if (!confirm(`Delete "${t.name}"? It will be hidden from the site.`)) return;
    setBusyId(t.id);
    try {
      await adminService.deleteTour(t.id);
      setTours((prev) => prev.filter((x) => x.id !== t.id));
    } catch { alert('Failed to delete tour.'); }
    finally { setBusyId(null); }
  };

  const toggleFeatured = async (t: Tour) => {
    setBusyId(t.id);
    try {
      const updated = await adminService.updateTour(t.id, { featured: !t.featured });
      setTours((prev) => prev.map((x) => (x.id === t.id ? updated : x)));
    } catch { alert('Update failed.'); }
    finally { setBusyId(null); }
  };

  const filtered = tours.filter((t) =>
    t.name.toLowerCase().includes(query.toLowerCase()) ||
    (t.category || '').toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Tours</h1>
          <p className="text-gray-500 text-sm mt-0.5">{tours.length} tour{tours.length !== 1 && 's'} total</p>
        </div>
        <Link href="/admin/tours/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#d4af37] text-white font-semibold text-sm hover:bg-[#c39e2f] transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
          New Tour
        </Link>
      </div>

      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tours…"
        className="w-full sm:max-w-xs mb-4 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#d4af37]" />

      {loading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-white rounded-2xl border border-gray-100 animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-500">
          No tours found. <Link href="/admin/tours/new" className="text-[#d4af37] font-semibold">Add one →</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((t) => (
            <div key={t.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 flex items-center gap-3 sm:gap-4">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                <Image src={t.image ? `/uploads/tours/${t.image}` : '/images/default-tour.jpg'}
                  alt={t.name} fill className="object-cover" sizes="80px" unoptimized />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-[#0f172a] truncate">{t.name}</h3>
                  {t.featured && <span className="text-[10px] font-bold uppercase bg-[#d4af37]/15 text-[#a8842a] px-1.5 py-0.5 rounded">Featured</span>}
                  {t.status === 'inactive' && <span className="text-[10px] font-bold uppercase bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded">Inactive</span>}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  {t.category || 'Uncategorised'} · {t.duration || 0} days · ${t.discount_price || t.price || 0}
                </p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => toggleFeatured(t)} disabled={busyId === t.id} title="Toggle featured"
                  className={`p-2 rounded-lg transition-colors ${t.featured ? 'text-[#d4af37]' : 'text-gray-300 hover:text-gray-500'}`}>
                  <svg className="w-5 h-5" fill={t.featured ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                </button>
                <Link href={`/admin/tours/${t.id}`} title="Edit"
                  className="p-2 rounded-lg text-gray-500 hover:text-[#0f172a] hover:bg-gray-100 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </Link>
                <button onClick={() => onDelete(t)} disabled={busyId === t.id} title="Delete"
                  className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
