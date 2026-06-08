// Dynamic sitemap — tells Google every URL on the site, including each
// tour page (pulled live from the API). Available at /sitemap.xml.
import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/config/site';
import { getAllTourIdsServer } from '@/services/tours.server';
import { BLOG_POSTS } from './blog/posts';
import { DESTINATIONS } from './destinations/destinations';

export const revalidate = 3600; // refresh sitemap hourly

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static, high-priority pages.
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/tours`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/destinations`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/custom-tour`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/about`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/gallery`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/contact`, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${SITE_URL}/blog`, changeFrequency: 'weekly', priority: 0.7 },
  ];

  // One entry per tour.
  let tourRoutes: MetadataRoute.Sitemap = [];
  try {
    const tours = await getAllTourIdsServer();
    tourRoutes = tours.map((t) => ({
      url: `${SITE_URL}/tours/${t.id}`,
      lastModified: t.updated_at ? new Date(t.updated_at) : undefined,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  } catch {
    // If the API is unreachable, still return the static routes.
  }

  // One entry per blog post.
  const blogRoutes: MetadataRoute.Sitemap = BLOG_POSTS.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  // One entry per destination guide.
  const destinationRoutes: MetadataRoute.Sitemap = DESTINATIONS.map((d) => ({
    url: `${SITE_URL}/destinations/${d.slug}`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...tourRoutes, ...blogRoutes, ...destinationRoutes];
}
