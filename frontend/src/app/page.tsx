import HeroSection from '@/components/home/HeroSection';
import SocialBar from '@/components/home/SocialBar';
import SeoIntro from '@/components/home/SeoIntro';
import AboutSection from '@/components/home/AboutSection';
import DestinationsSection from '@/components/home/DestinationsSection';
import FeaturedToursSection from '@/components/home/FeaturedToursSection';
import TripAdvisorSection from '@/components/home/TripAdvisorSection';
import DentalBanner from '@/components/home/DentalBanner';
import FestivalSection from '@/components/home/FestivalSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import ContactSection from '@/components/home/ContactSection';
import BlogPromoSection from '@/components/home/BlogPromoSection';

export const metadata = {
  title: 'Sri Lanka Private Driver & Day Tours | Colombo City Tour | CeyXcape',
  description: 'Book private Sri Lanka day tours, Colombo city tours, airport transfers and customized travel experiences with a professional driver guide. Explore Sigiriya, Galle, Kandy and more.',
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SocialBar />
      <SeoIntro />
      <AboutSection />
      <DestinationsSection />
      <FeaturedToursSection />
      <TripAdvisorSection />
      <DentalBanner />
      <FestivalSection />
      <TestimonialsSection />
      <ContactSection />
      <BlogPromoSection />
    </>
  );
}
