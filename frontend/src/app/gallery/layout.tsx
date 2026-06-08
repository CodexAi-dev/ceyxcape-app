import type { Metadata } from 'next';
import { SITE, absoluteUrl } from '@/config/site';

export const metadata: Metadata = {
  title: 'Photo Gallery — Sri Lanka Tours',
  description:
    'Photos from our Sri Lanka tours — Sigiriya, Mirissa, Yala, Galle, Ella and more. See the destinations you can explore with a CeyXcape private driver guide.',
  alternates: { canonical: absoluteUrl('/gallery') },
  openGraph: {
    title: `Photo Gallery — Sri Lanka Tours | ${SITE.name}`,
    description: 'Photos from real Sri Lanka tours with CeyXcape.',
    url: absoluteUrl('/gallery'),
    images: [SITE.defaultOgImage],
  },
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
