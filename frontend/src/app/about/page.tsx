import type { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'About Us | CeyXcape - Your Trusted Sri Lanka Tour Operator',
  description: 'Learn about CeyXcape Tours — premier Sri Lanka travel agency offering expert-guided tours, personalized experiences, and 24/7 support since 2018.',
  openGraph: {
    title: 'About CeyXcape Tours',
    description: 'Your trusted Sri Lanka travel partner since 2018.',
    images: ['/images/company.webp'],
  },
};

export default function AboutPage() {
  return <AboutClient />;
}