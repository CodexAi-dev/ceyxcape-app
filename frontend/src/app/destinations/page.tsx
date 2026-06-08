// Destinations hub — a server-rendered SEO landing page that links to each
// location guide. Targets broad keywords like "Sri Lanka destinations".
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { DESTINATIONS } from './destinations';
import { SITE, absoluteUrl } from '@/config/site';
import { JsonLd, breadcrumbSchema } from '@/lib/jsonld';

export const metadata: Metadata = {
  title: 'Sri Lanka Destinations — Places to Visit & Travel Guides',
  description:
    'Explore the best places to visit in Sri Lanka — Sigiriya, Galle, Kandy, Ella, Yala and Mirissa. Travel guides, highlights, best time to visit and private tours.',
  alternates: { canonical: absoluteUrl('/destinations') },
  openGraph: {
    title: `Sri Lanka Destinations & Travel Guides | ${SITE.name}`,
    description:
      'The best places to visit in Sri Lanka with travel guides and private tours.',
    url: absoluteUrl('/destinations'),
    images: [SITE.defaultOgImage],
  },
};

export default function DestinationsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Destinations', path: '/destinations' },
        ])}
      />
      <div className="min-h-screen bg-[#fafafa]">
        {/* Hero */}
        <div className="relative bg-[#0f172a] overflow-hidden">
          <div className="absolute inset-0">
            <Image src="/images/hero2.webp" alt="Sri Lanka destinations" fill priority className="object-cover opacity-25" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-[#0f172a]/90 to-[#0f172a]/60" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-20">
            <nav className="flex items-center gap-2 text-sm font-outfit text-gray-400 mb-4">
              <Link href="/" className="hover:text-[#d4af37] transition-colors">Home</Link>
              <span>/</span>
              <span className="text-white">Destinations</span>
            </nav>
            <h1 className="font-playfair font-bold text-white mb-3" style={{ fontSize: 'clamp(2rem,5vw,3rem)' }}>
              Sri Lanka Destinations
            </h1>
            <p className="text-gray-300 font-outfit max-w-xl">
              From ancient rock fortresses to leopard-filled jungles and palm-fringed beaches —
              discover the best places to visit in Sri Lanka.
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {DESTINATIONS.map((d) => (
              <Link key={d.slug} href={`/destinations/${d.slug}`}
                className="group bg-white overflow-hidden shadow-card border border-gray-100 flex flex-col">
                <div className="relative h-56 overflow-hidden">
                  <Image src={d.image} alt={d.name} fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-[#d4af37] font-outfit">{d.region}</span>
                    <h2 className="font-playfair font-bold text-white text-2xl">{d.name}</h2>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <p className="text-sm text-gray-600 font-outfit flex-1">{d.tagline}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#d4af37] font-outfit">
                    Explore {d.name}
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
