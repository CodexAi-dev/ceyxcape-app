// Server wrapper for the tours listing — provides SEO metadata and
// breadcrumb structured data. The interactive filter/search/pagination
// UI lives in ToursPageClient (a client component).
import type { Metadata } from 'next';
import ToursPageClient from './ToursPageClient';
import { SITE, absoluteUrl } from '@/config/site';
import { JsonLd, breadcrumbSchema } from '@/lib/jsonld';

export const metadata: Metadata = {
  title: `Sri Lanka Tours & Day Trips | Private Driver Guide | ${SITE.name}`,
  description:
    'Browse private Sri Lanka tours, day trips and multi-day itineraries — Sigiriya, Galle, Kandy, Ella, Yala and more. Professional driver guides, no upfront payment.',
  alternates: { canonical: absoluteUrl('/tours') },
  openGraph: {
    title: `Sri Lanka Tours & Day Trips | ${SITE.name}`,
    description:
      'Browse private Sri Lanka tours and day trips with a professional driver guide.',
    url: absoluteUrl('/tours'),
    type: 'website',
    siteName: SITE.name,
    images: [{ url: SITE.defaultOgImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Sri Lanka Tours & Day Trips | ${SITE.name}`,
    description: 'Browse private Sri Lanka tours and day trips with a professional driver guide.',
    images: [SITE.defaultOgImage],
  },
};

export default function ToursPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Tours', path: '/tours' },
        ])}
      />
      <ToursPageClient />
    </>
  );
}
