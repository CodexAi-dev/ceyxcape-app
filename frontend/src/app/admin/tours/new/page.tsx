'use client';

import React from 'react';
import Link from 'next/link';
import TourForm from '../TourForm';

export default function NewTourPage() {
  return (
    <div>
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-4">
        <Link href="/admin/tours" className="hover:text-[#d4af37]">Tours</Link>
        <span>/</span><span className="text-gray-600">New</span>
      </nav>
      <h1 className="text-2xl font-bold text-[#0f172a] mb-6">Create a new tour</h1>
      <TourForm />
    </div>
  );
}
