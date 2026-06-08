// ─────────────────────────────────────────────────────────────
// SERVER-SIDE tour data fetching for ISR (Incremental Static
// Regeneration). Uses the native fetch() so Next.js can cache the
// result and rebuild it in the background every `revalidate` seconds.
//
// This is what makes the site resilient to a slow/sleeping API:
// visitors and Googlebot get cached static HTML instantly; the
// Render API is only hit during background revalidation, never on
// the visitor's critical path.
// ─────────────────────────────────────────────────────────────
import { API_URL } from '@/config/site';
import type { Tour, TourListResponse } from '@/types';

// How often (seconds) ISR refreshes tour data in the background.
export const TOUR_REVALIDATE = 300; // 5 minutes

// Fetch a single tour by id for ISR. Returns null on 404 / error
// so the page can render a proper notFound() instead of crashing.
export async function getTourServer(id: string | number): Promise<Tour | null> {
  try {
    const res = await fetch(`${API_URL}/tours/${id}`, {
      next: { revalidate: TOUR_REVALIDATE, tags: ['tours', `tour-${id}`] },
    });
    if (!res.ok) return null;
    return (await res.json()) as Tour;
  } catch {
    return null;
  }
}

// Fetch the list of active tours for ISR (listing page + sitemap).
export async function getToursServer(
  params: Record<string, string | number> = {},
): Promise<TourListResponse> {
  const qs = new URLSearchParams(
    Object.entries({ limit: 100, ...params }).map(([k, v]) => [k, String(v)]),
  ).toString();

  try {
    const res = await fetch(`${API_URL}/tours?${qs}`, {
      next: { revalidate: TOUR_REVALIDATE, tags: ['tours'] },
    });
    if (!res.ok) throw new Error(`Tours fetch failed: ${res.status}`);
    return (await res.json()) as TourListResponse;
  } catch {
    // Never let a sleeping API break the page/sitemap — return empty.
    return { data: [], total: 0, page: 1, limit: 100, pages: 0 };
  }
}

// Lightweight: just the tour ids/slugs needed to pre-generate pages
// and build the sitemap.
export async function getAllTourIdsServer(): Promise<
  Array<{ id: number; updated_at?: string }>
> {
  const list = await getToursServer({ limit: 200 });
  return list.data.map((t) => ({ id: t.id, updated_at: t.updated_at }));
}
