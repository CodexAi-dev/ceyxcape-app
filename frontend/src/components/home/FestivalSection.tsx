import React from 'react';

type Festival = {
  monthShort: string;
  day: string;
  name: string;
  type: string;
  desc: string;
  location: string;
  color: string;
};

const FESTIVALS: Festival[] = [
  { monthShort: 'JAN', day: '14', name: 'Thai Pongal', type: 'Hindu Festival', desc: 'Tamil harvest festival celebrated island-wide with kolam art and lit lamps.', location: 'Island-wide', color: '#f59e0b' },
  { monthShort: 'FEB', day: '04', name: 'Independence Day', type: 'National Holiday', desc: 'Grand parade in Colombo with cultural performances and fireworks.', location: 'Colombo', color: '#0ea5e9' },
  { monthShort: 'MAY', day: 'Full Moon', name: 'Vesak Poya', type: 'Buddhist Festival', desc: "Sri Lanka's biggest Buddhist festival — lanterns and free-food dansalas.", location: 'Island-wide', color: '#d4af37' },
  { monthShort: 'JUL', day: '10 Days', name: 'Kandy Esala Perahera', type: 'Grand Procession', desc: 'Elephants, fire dancers and drummers parade through Kandy for 10 nights.', location: 'Kandy', color: '#ef4444' },
  { monthShort: 'AUG', day: '08', name: 'Kataragama Festival', type: 'Multi-Faith Festival', desc: 'Sacred pilgrimage drawing Buddhists, Hindus and Muslims to Kataragama.', location: 'Kataragama', color: '#8b5cf6' },
  { monthShort: 'DEC', day: '25', name: 'Christmas & New Year', type: 'Season', desc: 'Peak season — beach resorts, city lights and festive energy island-wide.', location: 'Island-wide', color: '#10b981' },
];

const YEAR = new Date().getFullYear(); // fixed to the current year

export default function FestivalSection() {
  return (
    <section className="section-py bg-[#fafafa] border-t border-gray-100">
      <div className="max-w-5xl mx-auto px-4">
        {/* Heading — centered */}
        <div className="text-center mb-9">
          <h2 className="font-playfair font-bold text-[#0f172a]" style={{ fontSize: 'clamp(1.8rem,4vw,2.4rem)' }}>
            Festivals &amp; Events
          </h2>
        </div>

        {/* Calendar frame holding the event cards */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_40px_rgba(0,0,0,0.06)] p-5 sm:p-7">
          {/* Year label — top left of the frame, above the first card */}
          <p className="text-[#0f172a] font-playfair font-bold text-3xl tracking-wide mb-5">{YEAR}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FESTIVALS.map(f => (
              <div key={f.name}
                className="group relative rounded-2xl bg-white hover:shadow-[0_10px_26px_rgba(0,0,0,0.10)] hover:-translate-y-1 transition-all duration-300">
                {/* Colored frame that follows the rounded corners: solid at the
                    bottom, fading up the sides to transparent. Drawn as a 3px
                    gradient border masked to show only the border ring. */}
                <span aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-2xl"
                  style={{
                    padding: '3px',
                    background: `linear-gradient(to top, ${f.color} 0%, ${f.color} 25%, transparent 55%)`,
                    WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                  }}
                />

                {/* date header — like a calendar tab */}
                <div className="flex items-center justify-between px-4 py-2.5 rounded-t-2xl" style={{ backgroundColor: f.color }}>
                  <span className="text-[11px] font-bold uppercase tracking-[2px] text-white font-outfit">{f.monthShort}</span>
                  <span className="font-playfair font-bold text-white leading-none"
                    style={{ fontSize: f.day.length > 3 ? '0.85rem' : '1.4rem' }}>
                    {f.day}
                  </span>
                </div>
                {/* body — name + short description */}
                <div className="p-4">
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 mb-2 rounded font-outfit"
                    style={{ color: f.color, backgroundColor: `${f.color}15` }}>
                    {f.type}
                  </span>
                  <h3 className="font-playfair font-bold text-[#0f172a] text-base mb-1.5">{f.name}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed mb-3">{f.desc}</p>
                  <p className="text-[11px] text-gray-400 font-outfit flex items-center gap-1.5">
                    <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {f.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
