// ─────────────────────────────────────────────────────────────
// SERVER COMPONENT (ISR) for a single tour.
// • Fetches the tour on the server so Google sees full HTML.
// • generateMetadata → unique <title>, description, OG/Twitter card.
// • generateStaticParams → pre-builds every tour page at deploy.
// • JSON-LD → rich results (price, breadcrumbs, ratings).
// The interactive UI lives in TourDetailClient (a client component).
// ─────────────────────────────────────────────────────────────
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import TourDetailClient from './TourDetailClient';
import {
  getTourServer,
  getAllTourIdsServer,
  TOUR_REVALIDATE,
} from '@/services/tours.server';
import { SITE, absoluteUrl, tourImageUrl } from '@/config/site';
import {
  JsonLd,
  tourSchema,
  breadcrumbSchema,
} from '@/lib/jsonld';

// Rebuild this page's static HTML at most every TOUR_REVALIDATE seconds.
export const revalidate = 300;

// Pre-generate a static page for each existing tour at build time.
// New tours added later are built on first visit, then cached (ISR).
export async function generateStaticParams() {
  const tours = await getAllTourIdsServer();
  return tours.map((t) => ({ id: String(t.id) }));
}

// Per-tour SEO metadata — the single biggest ranking fix.
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const tour = await getTourServer(params.id);
  if (!tour) {
    return { title: 'Tour Not Found | ' + SITE.name };
  }

  const title = `${tour.name} | ${tour.duration}-Day ${tour.category} Tour | ${SITE.name}`;
  const description = (tour.description || SITE.description).slice(0, 160);
  const url = absoluteUrl(`/tours/${tour.id}`);
  const image = tourImageUrl(tour.image);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      siteName: SITE.name,
      images: [{ url: image, width: 1200, height: 630, alt: tour.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default async function TourDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const tour = await getTourServer(params.id);
  if (!tour) notFound();

  return (
    <>
      <JsonLd data={tourSchema(tour)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Tours', path: '/tours' },
          { name: tour.name, path: `/tours/${tour.id}` },
        ])}
      />
      <TourDetailClient tour={tour} />
    </>
  );
}
