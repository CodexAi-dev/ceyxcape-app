/** @type {import('next').NextConfig} */

// Where the backend lives (serves uploaded images under /uploads/...).
const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api')
  .replace(/\/api\/?$/, '');

const nextConfig = {
  reactStrictMode: true,
  compress: true,
  productionBrowserSourceMaps: false,

  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  },

  headers: async () => [
    {
      source: '/:path*',
      headers: [
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ],
    },
  ],

  // Proxy uploaded images (and the API, if you want a same-origin call) to the
  // backend. This keeps every `/uploads/tours/...` <Image> working in prod,
  // where the API is on a different domain (Render).
  rewrites: async () => [
    { source: '/uploads/:path*', destination: `${API_ORIGIN}/uploads/:path*` },
  ],

  // Image optimization. Uploaded images are proxied via the /uploads rewrite
  // (same-origin), so remotePatterns mainly covers the API host directly.
  // The API hostname is derived from NEXT_PUBLIC_API_URL so it works on any
  // domain without hardcoding.
  images: {
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      // Supabase Storage (tour + gallery images live in a public bucket).
      { protocol: 'https', hostname: '*.supabase.co' },
      ...(() => {
        try {
          const h = new URL(API_ORIGIN).hostname;
          return [
            { protocol: 'https', hostname: h },
            { protocol: 'https', hostname: `*.${h.replace(/^www\./, '')}` },
          ];
        } catch {
          return [];
        }
      })(),
    ],
  },

  experimental: {
    optimizePackageImports: ['lodash', 'date-fns'],
  },
};

module.exports = nextConfig;
