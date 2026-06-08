import type { Metadata } from 'next';
import CustomTourClient from './CustomTourClient';
import { SITE, absoluteUrl } from '@/config/site';
import { JsonLd, breadcrumbSchema } from '@/lib/jsonld';

export const metadata: Metadata = {
  title: 'Plan Your Custom Sri Lanka Tour — Tailor-Made Trips',
  description:
    'Design your own private Sri Lanka tour. Choose your destinations, dates and travel style, and our team will craft a tailor-made itinerary and quote — no upfront payment.',
  alternates: { canonical: absoluteUrl('/custom-tour') },
  openGraph: {
    title: `Plan Your Custom Sri Lanka Tour | ${SITE.name}`,
    description:
      'Design a private, tailor-made Sri Lanka itinerary built around how you love to travel.',
    url: absoluteUrl('/custom-tour'),
    images: [SITE.defaultOgImage],
  },
};

export default function CustomTourPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Plan Your Tour', path: '/custom-tour' },
        ])}
      />
      <CustomTourClient />
    </>
  );
}
