// robots.txt — tells crawlers what to index and where the sitemap is.
// Available at /robots.txt.
import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/config/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Keep private/app areas out of search results.
        disallow: ['/admin', '/auth', '/profile', '/wishlist', '/booking'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
