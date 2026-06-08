// ─────────────────────────────────────────────────────────────
// JSON-LD structured data builders + a <JsonLd> component.
// Structured data is what gets you rich results in Google
// (star ratings, breadcrumbs, business info). It is invisible to
// users but read by search engines.
// ─────────────────────────────────────────────────────────────
import React from 'react';
import { SITE, SITE_URL, absoluteUrl, tourImageUrl } from '@/config/site';
import { CONTACT } from '@/config/constants';
import type { Tour } from '@/types';

// Renders a <script type="application/ld+json"> safely into the page.
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Data comes from our own server, not user input — safe to inject.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// The business itself — appears on every page (in layout).
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: SITE.name,
    legalName: SITE.legalName,
    description: SITE.description,
    url: SITE_URL,
    logo: absoluteUrl('/images/logo.webp'),
    image: SITE.defaultOgImage,
    telephone: CONTACT.phone,
    email: CONTACT.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: CONTACT.address,
      addressCountry: 'LK',
    },
    areaServed: { '@type': 'Country', name: 'Sri Lanka' },
    sameAs: [] as string[], // add your real social profile URLs here
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/tours?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

// A single tour, modelled as a Product with an Offer so Google can show
// price + (when available) star ratings in search results.
export function tourSchema(tour: Tour) {
  const price = tour.discount_price || tour.price;
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: tour.name,
    description: tour.description,
    image: [tourImageUrl(tour.image)],
    sku: tour.tour_code || `tour-${tour.id}`,
    category: tour.category,
    brand: { '@type': 'Brand', name: SITE.name },
    offers: {
      '@type': 'Offer',
      price: String(price),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: absoluteUrl(`/tours/${tour.id}`),
    },
  };

  // Only include ratings if real reviews exist (fake ratings = Google penalty).
  if ((tour.avg_rating || 0) > 0 && (tour.review_count || 0) > 0) {
    data.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: String(tour.avg_rating),
      reviewCount: String(tour.review_count),
    };
  }
  return data;
}

// A destination, modelled as a TouristAttraction (helps Google understand
// location-based pages and surface them for "places to visit" queries).
export function touristAttractionSchema(opts: {
  name: string;
  description: string;
  image: string;
  path: string;
  region?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: opts.name,
    description: opts.description,
    image: absoluteUrl(opts.image),
    url: absoluteUrl(opts.path),
    address: {
      '@type': 'PostalAddress',
      addressRegion: opts.region,
      addressCountry: 'LK',
    },
    isAccessibleForFree: false,
  };
}

// Breadcrumb trail (Home › Tours › Tour name) — Google shows this in results.
export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
