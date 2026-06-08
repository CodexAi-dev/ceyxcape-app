import Link from 'next/link';

export default function TourNotFound() {
  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
      <div className="text-center">
        <svg className="w-20 h-20 mx-auto mb-4 text-gray-200" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <h2 className="font-playfair font-bold text-[#0f172a] text-2xl mb-2">Tour Not Found</h2>
        <p className="text-gray-500 font-outfit mb-6">This tour may no longer be available.</p>
        <Link href="/tours" className="btn-gold px-6 py-3 rounded-xl text-sm font-semibold inline-flex">
          Browse All Tours
        </Link>
      </div>
    </div>
  );
}
