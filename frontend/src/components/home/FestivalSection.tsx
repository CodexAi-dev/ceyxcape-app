import React from 'react';
import Link from 'next/link';

const EVENTS = [
  {
    month: 'Jan',
    day: '14',
    name: 'Thai Pongal',
    type: 'Hindu Festival',
    desc: 'Tamil harvest festival celebrated island-wide with kolam art, sugarcane, and lit lamps.',
    location: 'Island-wide',
    color: '#f59e0b',
  },
  {
    month: 'Feb',
    day: '04',
    name: 'Independence Day',
    type: 'National Holiday',
    desc: 'Grand military parade in Colombo with cultural performances and fireworks at Independence Square.',
    location: 'Colombo',
    color: '#0ea5e9',
  },
  {
    month: 'May',
    day: 'Full Moon',
    name: 'Vesak Poya',
    type: 'Buddhist Festival',
    desc: "Sri Lanka's most important Buddhist festival. Streets light up with lanterns and dansalas offer free food.",
    location: 'Island-wide',
    color: '#d4af37',
  },
  {
    month: 'Jul',
    day: '10 Days',
    name: 'Kandy Esala Perahera',
    type: 'Grand Procession',
    desc: "One of Asia's greatest pageants — elephants, fire dancers, and drummers parade through Kandy for 10 nights.",
    location: 'Kandy',
    color: '#ef4444',
  },
  {
    month: 'Aug',
    day: 'Aug',
    name: 'Kataragama Festival',
    type: 'Multi-Faith Festival',
    desc: 'Sacred pilgrimage drawing Buddhists, Hindus and Muslims to the jungle shrine of Kataragama.',
    location: 'Kataragama',
    color: '#8b5cf6',
  },
  {
    month: 'Dec',
    day: '25',
    name: 'Christmas & New Year',
    type: 'Season',
    desc: 'Peak travel season. Beach resorts, city lights and festive energy across Colombo and the south coast.',
    location: 'Island-wide',
    color: '#10b981',
  },
];

export default function FestivalSection() {
  return (
    <section className="section-py bg-[#fafafa] border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-10">
          <div>
            <p className="text-[#d4af37] text-sm font-semibold tracking-[2px] uppercase font-outfit mb-2">Plan Around Culture</p>
            <h2 className="font-playfair font-bold text-[#0f172a]" style={{ fontSize: 'clamp(1.6rem,3.5vw,2.2rem)' }}>
              Festivals &amp; Events Calendar
            </h2>
          </div>
          <Link href="/tours"
            className="text-sm font-semibold text-[#d4af37] font-outfit hover:underline underline-offset-4 pb-1">
            Plan your visit →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {EVENTS.map((e, i) => (
            <div key={i} className="bg-white border border-gray-100 p-5 flex gap-4 hover:border-gray-200 hover:shadow-sm transition-all duration-200">
              {/* Date block */}
              <div className="flex-shrink-0 w-14 text-center">
                <div className="text-xs font-bold font-outfit uppercase" style={{ color: e.color }}>{e.month}</div>
                <div className="font-playfair font-bold text-[#0f172a] text-xl leading-tight">{e.day}</div>
              </div>
              <div className="w-px bg-gray-100 self-stretch flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 mb-2 font-outfit"
                  style={{ color: e.color, backgroundColor: `${e.color}15` }}>
                  {e.type}
                </span>
                <h3 className="font-semibold text-[#0f172a] text-sm mb-1">{e.name}</h3>
                <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">{e.desc}</p>
                <p className="text-xs text-gray-400 font-outfit mt-2 flex items-center gap-1">
                  <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  {e.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}