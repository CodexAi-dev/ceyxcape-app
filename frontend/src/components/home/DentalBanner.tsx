import React from 'react';
import Link from 'next/link';

export default function DentalBanner() {
  return (
    <section className="bg-[#0f172a] py-5">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Icon */}
            <div className="w-10 h-10 rounded-full bg-[#d4af37]/15 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-[#d4af37]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.5 2 6 4.5 6 7c0 2 .8 3.5 1.5 5L9 17c.5 2 1.5 3 3 3s2.5-1 3-3l1.5-5C17.2 10.5 18 9 18 7c0-2.5-2.5-5-6-5z"/>
              </svg>
            </div>
            <div>
              <p className="text-white font-semibold text-sm sm:text-base font-outfit">
                Book now and get a <span className="text-[#d4af37] font-bold">Free Dental Checkup</span> with every tour package
              </p>
              <p className="text-white/40 text-xs font-outfit mt-0.5">At our partner clinic in Colombo · Valid for all packages booked this month</p>
            </div>
          </div>
          <Link href="/tours"
            className="flex-shrink-0 px-5 py-2.5 bg-[#d4af37] text-[#0f172a] text-sm font-bold font-outfit hover:bg-[#c9a520] transition-colors whitespace-nowrap">
            Book a Tour
          </Link>
        </div>
      </div>
    </section>
  );
}