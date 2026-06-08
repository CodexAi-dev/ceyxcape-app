import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { ToastProvider } from '@/context/ToastContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { ToastContainer } from '@/components/Modals';

export const metadata: Metadata = {
  title: 'CeyXcape - Private Sri Lanka Tours',
  description: 'Book private Sri Lanka tours, day trips, and airport transfers with professional driver guides.',
  keywords: 'Sri Lanka tours, Colombo, Sigiriya, Galle, Kandy, day tours, travel',
  authors: [{ name: 'CeyXcape' }],
  openGraph: {
    title: 'CeyXcape - Private Sri Lanka Tours',
    description: 'Book private Sri Lanka tours, day trips, and airport transfers with professional driver guides.',
    type: 'website',
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
