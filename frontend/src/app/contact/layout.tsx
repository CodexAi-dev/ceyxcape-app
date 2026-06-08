import type { Metadata } from 'next';
import { SITE, absoluteUrl } from '@/config/site';

export const metadata: Metadata = {
  title: 'Contact Us — Plan Your Sri Lanka Tour',
  description:
    'Get in touch with CeyXcape to plan your private Sri Lanka tour. Call, WhatsApp or send us a message — we reply fast and there is no upfront payment.',
  alternates: { canonical: absoluteUrl('/contact') },
  openGraph: {
    title: `Contact Us | ${SITE.name}`,
    description: 'Plan your private Sri Lanka tour with CeyXcape.',
    url: absoluteUrl('/contact'),
    images: [SITE.defaultOgImage],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
