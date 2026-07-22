// Individual destination guide — a location-keyword SEO landing page
// (e.g. "Sigiriya tours", "things to do in Galle"). Server-rendered,
// statically generated, with metadata, JSON-LD and related tours.
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { DESTINATIONS, getDestination } from '../destinations';
import { getToursServer } from '@/services/tours.server';
import { SITE, absoluteUrl, tourImageSrc } from '@/config/site';
import {
  JsonLd,
  touristAttractionSchema,
  breadcrumbSchema,
} from '@/lib/jsonld';
import type { Tour } from '@/types';

export const revalidate = 3600;

export function generateStaticParams() {
  return DESTINATIONS.map((d) => ({ slug: d.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const d = getDestination(params.slug);
  if (!d) return { title: 'Destination Not Found | ' + SITE.name };
  return {
    title: d.metaTitle,
    description: d.metaDescription,
    alternates: { canonical: absoluteUrl(`/destinations/${d.slug}`) },
    openGraph: {
      title: d.metaTitle,
      description: d.metaDescription,
      url: absoluteUrl(`/destinations/${d.slug}`),
      images: [{ url: absoluteUrl(d.image), width: 1200, height: 630, alt: d.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: d.metaTitle,
      description: d.metaDescription,
      images: [absoluteUrl(d.image)],
    },
  };
}

// Find tours related to this destination by matching keywords against
// the tour's name / location / category.
async function getRelatedTours(keywords: string[]): Promise<Tour[]> {
  const list = await getToursServer({ limit: 100 });
  const kw = keywords.map((k) => k.toLowerCase());
  return list.data
    .filter((t) => {
      const hay = `${t.name} ${t.location} ${t.category} ${t.start_location}`.toLowerCase();
      return kw.some((k) => hay.includes(k));
    })
    .slice(0, 3);
}

export default async function DestinationPage({
  params,
}: {
  params: { slug: string };
}) {
  const d = getDestination(params.slug);
  if (!d) notFound();

  const relatedTours = await getRelatedTours(d.tourMatch);

  return (
    <>
      <JsonLd
        data={touristAttractionSchema({
          name: d.name,
          description: d.metaDescription,
          image: d.image,
          path: `/destinations/${d.slug}`,
          region: d.region,
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Destinations', path: '/destinations' },
          { name: d.name, path: `/destinations/${d.slug}` },
        ])}
      />

      <div className="min-h-screen bg-[#fafafa]">
        {/* Hero */}
        <div className="relative h-[42vh] min-h-[320px] overflow-hidden">
          <Image src={d.image} alt={d.name} fill priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-5xl mx-auto w-full px-4 pb-8">
              <nav className="flex items-center gap-2 text-sm font-outfit text-gray-200 mb-3">
                <Link href="/" className="hover:text-[#d4af37]">Home</Link>
                <span>/</span>
                <Link href="/destinations" className="hover:text-[#d4af37]">Destinations</Link>
                <span>/</span>
                <span className="text-white">{d.name}</span>
              </nav>
              <span className="text-xs uppercase tracking-widest font-bold text-[#d4af37] font-outfit">{d.region}</span>
              <h1 className="font-playfair font-bold text-white" style={{ fontSize: 'clamp(2rem,5vw,3rem)' }}>
                {d.name}
              </h1>
              <p className="text-gray-200 font-outfit mt-1">{d.tagline}</p>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-10 grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <article className="lg:col-span-2 space-y-8">
            <p className="text-gray-700 leading-relaxed font-outfit text-lg">{d.intro}</p>

            <div>
              <h2 className="font-playfair font-bold text-[#0f172a] text-2xl mb-4">Highlights</h2>
              <ul className="grid sm:grid-cols-2 gap-3">
                {d.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-gray-700 font-outfit">
                    <svg className="w-5 h-5 text-[#d4af37] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {h}
                  </li>
                ))}
              </ul>
            </div>

            {d.sections.map((s) => (
              <div key={s.heading}>
                <h2 className="font-playfair font-bold text-[#0f172a] text-2xl mb-3">{s.heading}</h2>
                <p className="text-gray-700 leading-relaxed font-outfit">{s.body}</p>
              </div>
            ))}
          </article>

          {/* Sidebar */}
          <aside className="space-y-5">
            <div className="bg-white border border-gray-100 shadow-card p-5">
              <h3 className="font-playfair font-bold text-[#0f172a] mb-4">Travel Facts</h3>
              <div className="space-y-4 text-sm font-outfit">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">Best time to visit</p>
                  <p className="text-gray-700">{d.bestTime}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">How to get there</p>
                  <p className="text-gray-700">{d.howToGet}</p>
                </div>
              </div>
            </div>

            <div className="bg-[#0f172a] p-5 text-center">
              <p className="text-white font-playfair font-bold text-lg mb-1">Visit {d.name} with us</p>
              <p className="text-gray-300 text-sm font-outfit mb-4">Private tours with a professional driver guide.</p>
              <Link href="/contact" className="btn-gold w-full justify-center py-3 text-sm font-semibold inline-flex">
                Plan My Trip
              </Link>
            </div>
          </aside>
        </div>

        {/* Related tours */}
        {relatedTours.length > 0 && (
          <div className="max-w-5xl mx-auto px-4 pb-16">
            <h2 className="font-playfair font-bold text-[#0f172a] text-2xl mb-6">
              {d.name} Tours
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedTours.map((t) => (
                <Link key={t.id} href={`/tours/${t.id}`}
                  className="group bg-white overflow-hidden shadow-card border border-gray-100 flex flex-col">
                  <div className="relative h-40 overflow-hidden">
                    <Image src={tourImageSrc(t.image)}
                      alt={t.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-playfair font-bold text-[#0f172a] text-base line-clamp-2 flex-1">{t.name}</h3>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="font-bold text-[#d4af37] font-outfit">
                        ${t.discount_price || t.price}
                      </span>
                      <span className="text-xs text-gray-500 font-outfit">{t.duration} days</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
