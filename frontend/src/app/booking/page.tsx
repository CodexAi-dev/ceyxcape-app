'use client';

// Direct booking/payment has been replaced by the inquiry system.
// This route now simply forwards visitors to the tour's inquiry form
// (or the tours listing) so old links keep working.
import React, { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function BookingRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tourId = searchParams.get('tour_id');
    router.replace(tourId ? `/tours/${tourId}` : '/tours');
  }, [router, searchParams]);

  return (
    <div className="h-screen flex items-center justify-center text-gray-500 font-outfit">
      Redirecting…
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading…</div>}>
      <BookingRedirect />
    </Suspense>
  );
}
