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

  // Image optimization. remotePatterns lets next/image optimize images that
  // are ultimately served from the API origin.
  images: {
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: '**.onrender.com' },
      { protocol: 'https', hostname: 'ceyxcape.com' },
      { protocol: 'https', hostname: '**.ceyxcape.com' },
    ],
  },

  experimental: {
    optimizePackageImports: ['lodash', 'date-fns'],
  },
};

module.exports = nextConfig;
