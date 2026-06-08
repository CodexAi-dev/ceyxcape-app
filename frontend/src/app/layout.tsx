import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { ToastProvider } from '@/context/ToastContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { ToastContainer } from '@/components/Modals';
import { SITE, SITE_URL } from '@/config/site';
import { JsonLd, organizationSchema, websiteSchema } from '@/lib/jsonld';

export const metadata: Metadata = {
  // metadataBase makes every relative OG/canonical URL absolute — required
  // for correct social/Google link previews in production.
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE.name} - ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    'Sri Lanka tours', 'private Sri Lanka tours', 'Sri Lanka day tours',
    'Colombo city tour', 'Sigiriya', 'Galle', 'Kandy', 'Ella', 'Yala safari',
    'Sri Lanka driver guide', 'airport transfer Sri Lanka',
  ],
  authors: [{ name: SITE.name }],
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    title: `${SITE.name} - ${SITE.tagline}`,
    description: SITE.description,
    url: SITE_URL,
    locale: SITE.locale,
    images: [{ url: SITE.defaultOgImage, width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} - ${SITE.tagline}`,
    description: SITE.description,
    images: [SITE.defaultOgImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />
        <ToastProvider>
          <AuthProvider>
            <WishlistProvider>
              <Header />
              <main>{children}</main>
              <Footer />
              <WhatsAppFloat />
              <ToastContainer />
            </WishlistProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
