// ─────────────────────────────────────────────────────────────
// Central SEO / site configuration — single source of truth for
// canonical URLs, social metadata, and how we build absolute URLs.
// Used by metadata, sitemap, robots, and JSON-LD structured data.
// ─────────────────────────────────────────────────────────────

// The public, canonical domain of the LIVE site (no trailing slash).
// Set NEXT_PUBLIC_SITE_URL in production (e.g. https://www.ceyxcape.com).
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
).replace(/\/$/, '');

// The API base, used for SERVER-side data fetching during ISR/SSR.
export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
).replace(/\/$/, '');

// Where the backend serves uploaded images from (strip the trailing /api).
export const API_ORIGIN = API_URL.replace(/\/api$/, '');

export const SITE = {
  name: 'CeyXcape',
  legalName: 'CeyXcape Tours',
  tagline: 'Private Sri Lanka Tours',
  description:
    'Book private Sri Lanka tours, day trips, and airport transfers with professional driver guides. Explore Sigiriya, Galle, Kandy, Ella, Yala and more.',
  // Default share image (1200x630) shown when a page has none of its own.
  // Swap /images/og-default.jpg for a custom branded graphic anytime.
  defaultOgImage: `${SITE_URL}/images/og-default.jpg`,
  locale: 'en_US',
  twitter: '@ceyxcape', // update if you have a real handle
};

// Build an absolute URL for any path (needed for canonical + OG tags).
export function absoluteUrl(path = ''): string {
  if (!path) return SITE_URL;
  if (/^https?:\/\//.test(path)) return path; // already absolute
  return `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}

// Resolve a tour image (stored as a filename) to a full, crawlable URL.
// Uploaded tour images live under <API_ORIGIN>/uploads/tours/<file>.
// Local sample images (containing a slash or starting with /images) pass through.
export function tourImageUrl(image?: string | null): string {
  if (!image) return `${SITE_URL}/images/default-tour.jpg`;
  if (/^https?:\/\//.test(image)) return image;
  if (image.startsWith('/')) return `${SITE_URL}${image}`;
  return `${API_ORIGIN}/uploads/tours/${image}`;
}
