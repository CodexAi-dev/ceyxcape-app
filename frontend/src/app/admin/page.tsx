'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminService, AdminStats, Inquiry } from '@/services/admin';

function StatCard({ label, value, accent, href }: { label: string; value: number; accent: string; href: string }) {
  return (
    <Link href={href}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all">
      <p className="text-3xl font-bold text-[#0f172a]" style={{ color: accent }}>{value}</p>
      <p className="text-sm text-gray-500 font-medium mt-1">{label}</p>
    </Link>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recent, setRecent] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminService.getStats(), adminService.listInquiries()])
      .then(([s, inq]) => { setStats(s); setRecent(inq.slice(0, 5)); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0f172a]">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-0.5">Overview of your tours, inquiries and gallery.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-white rounded-2xl border border-gray-100 animate-pulse" />)}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Active Tours" value={stats.activeTours} accent="#0f172a" href="/admin/tours" />
          <StatCard label="New Inquiries" value={stats.newInquiries} accent="#d4af37" href="/admin/inquiries" />
          <StatCard label="Total Inquiries" value={stats.inquiries} accent="#0f172a" href="/admin/inquiries" />
          <StatCard label="Gallery Photos" value={stats.gallery} accent="#0f172a" href="/admin/gallery" />
        </div>
      ) : (
        <p className="text-gray-500">Could not load stats.</p>
      )}

      {/* Quick actions */}
      <div className="grid sm:grid-cols-3 gap-4 mt-6">
        <Link href="/admin/tours/new" className="bg-[#0f172a] text-white rounded-2xl p-5 hover:bg-[#1e293b] transition-colors">
          <p className="font-semibold">+ Add a new tour</p>
          <p className="text-sm text-gray-400 mt-0.5">Create a tour with images</p>
        </Link>
        <Link href="/admin/gallery" className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-all">
          <p className="font-semibold text-[#0f172a]">Manage gallery</p>
          <p className="text-sm text-gray-500 mt-0.5">Upload & remove photos</p>
        </Link>
        <Link href="/admin/inquiries" className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-all">
          <p className="font-semibold text-[#0f172a]">View inquiries</p>
          <p className="text-sm text-gray-500 mt-0.5">Respond to customers</p>
        </Link>
      </div>

      {/* Recent inquiries */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-[#0f172a]">Recent inquiries</h2>
          <Link href="/admin/inquiries" className="text-sm font-semibold text-[#d4af37] hover:underline">View all</Link>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100 overflow-hidden">
          {recent.length === 0 ? (
            <p className="text-gray-500 text-sm p-5">No inquiries yet.</p>
          ) : recent.map((i) => (
            <Link key={i.id} href="/admin/inquiries" className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${i.status === 'new' ? 'bg-[#d4af37]' : 'bg-gray-300'}`} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[#0f172a] truncate">
                  {i.name} {i.tourName && <span className="text-gray-400 font-normal">· {i.tourName}</span>}
                </p>
                <p className="text-xs text-gray-500 truncate">{i.message}</p>
              </div>
              <span className="text-xs text-gray-400 flex-shrink-0">{new Date(i.createdAt).toLocaleDateString()}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
