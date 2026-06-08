'use client';

import React, { useEffect, useState } from 'react';
import { adminService, Inquiry } from '@/services/admin';
import { buildWhatsAppLink } from '@/config/constants';

const FILTERS = ['all', 'new', 'tour', 'general'] as const;
type Filter = (typeof FILTERS)[number];

export default function AdminInquiriesPage() {
  const [items, setItems] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');
  const [openId, setOpenId] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    adminService.listInquiries().then(setItems).catch(() => setItems([])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const open = async (i: Inquiry) => {
    const next = openId === i.id ? null : i.id;
    setOpenId(next);
    if (next && i.status === 'new') {
      try {
        await adminService.markInquiryRead(i.id);
        setItems((prev) => prev.map((x) => (x.id === i.id ? { ...x, status: 'read' } : x)));
      } catch { /* non-critical */ }
    }
  };

  const del = async (i: Inquiry) => {
    if (!confirm(`Delete inquiry from ${i.name}?`)) return;
    try {
      await adminService.deleteInquiry(i.id);
      setItems((prev) => prev.filter((x) => x.id !== i.id));
    } catch { alert('Failed to delete.'); }
  };

  const filtered = items.filter((i) =>
    filter === 'all' ? true : filter === 'new' ? i.status === 'new' : i.type === filter,
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0f172a]">Inquiries</h1>
        <p className="text-gray-500 text-sm mt-0.5">{items.filter((i) => i.status === 'new').length} new · {items.length} total</p>
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize whitespace-nowrap transition-colors ${
              filter === f ? 'bg-[#0f172a] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#d4af37]'
            }`}>{f}</button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-white rounded-2xl border border-gray-100 animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-500">No inquiries here.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((i) => (
            <div key={i.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <button onClick={() => open(i)} className="w-full flex items-center gap-3 p-4 text-left">
                {i.status === 'new'
                  ? <span className="w-2.5 h-2.5 rounded-full bg-[#d4af37] flex-shrink-0" />
                  : <span className="w-2.5 h-2.5 rounded-full bg-gray-200 flex-shrink-0" />}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-[#0f172a] truncate">{i.name}</span>
                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${i.type === 'tour' ? 'bg-[#2b4b7e]/10 text-[#2b4b7e]' : 'bg-gray-100 text-gray-500'}`}>{i.type}</span>
                    {i.tourName && <span className="text-xs text-gray-400 truncate">{i.tourName}</span>}
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{i.message}</p>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0 hidden sm:block">{new Date(i.createdAt).toLocaleDateString()}</span>
                <svg className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${openId === i.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
              </button>

              {openId === i.id && (
                <div className="px-4 pb-4 pt-1 border-t border-gray-100 space-y-3">
                  <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm pt-3">
                    <Field label="Email" value={i.email} />
                    <Field label="Phone" value={i.phone || '—'} />
                    {i.tourName && <Field label="Tour" value={i.tourName} />}
                    {i.tourDate && <Field label="Preferred date" value={i.tourDate} />}
                    {i.participants != null && <Field label="Travellers" value={String(i.participants)} />}
                    {i.subject && <Field label="Subject" value={i.subject} />}
                    <Field label="Received" value={new Date(i.createdAt).toLocaleString()} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Message</p>
                    <p className="text-sm text-[#334155] whitespace-pre-wrap bg-gray-50 rounded-xl p-3">{i.message}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <a href={`mailto:${i.email}`} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0f172a] text-white text-sm font-semibold">Email</a>
                    {i.phone && <a href={`tel:${i.phone}`} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-[#0f172a]">Call</a>}
                    {i.phone && <a href={buildWhatsAppLink(`Hi ${i.name}, thanks for your inquiry to CeyXcape!`)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#25D366] text-[#25D366] text-sm font-semibold">WhatsApp</a>}
                    <button onClick={() => del(i)} className="ml-auto inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 text-sm font-semibold">Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="text-gray-400 font-medium">{label}:</span>
      <span className="text-[#0f172a] break-all">{value}</span>
    </div>
  );
}
