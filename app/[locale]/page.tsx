import dynamic from 'next/dynamic';
import { HeroCarousel } from '@/components/sections/hero-carousel';
import { CityStatsSection } from '@/components/sections/city-stats-section';
import { QuickLinksSection } from '@/components/sections/quick-links';
import { AboutSection } from '@/components/sections/about-section';
import { NewsSection } from '@/components/sections/news-section';
import { UpcomingEventsSection } from '@/components/sections/upcoming-events-section';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { WebPageJsonLd } from '@/lib/seo/json-ld';
import { type Locale } from '@/i18n/routing';
import { getHeroSlidesForLocale } from '@/lib/supabase/services';

// Enable ISR - revalidate homepage every 60 seconds for fresh content while maintaining fast response times
export const revalidate = 60;

// Preload component for LCP image optimization
function HeroImagePreload({ imageUrl }: { imageUrl: string | null }) {
  if (!imageUrl) return null;
  
  return (
    <link
      rel="preload"
      as="image"
      href={imageUrl}
      fetchPriority="high"
    />
  );
}

// Dynamic imports for below-the-fold components (reduces initial JS bundle)
const WeatherWidgetSection = dynamic(
  () => import('@/components/sections/weather-widget-section').then(mod => ({ default: mod.WeatherWidgetSection })),
  { ssr: true }
);

const CityMapSection = dynamic(
  () => import('@/components/sections/city-map-section').then(mod => ({ default: mod.CityMapSection })),
  { 
    loading: () => (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="h-[500px] bg-gray-100 rounded-xl animate-pulse flex items-center justify-center">
            <span className="text-gray-400">Loading...</span>
          </div>
        </div>
      </section>
    )
  }
);

const ContactInfoSection = dynamic(
  () => import('@/components/sections/contact-info-section').then(mod => ({ default: mod.ContactInfoSection })),
  { ssr: true }
);

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'home',
    locale: locale as Locale,
    path: '',
  });
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  // Only fetch hero slides server-side (critical for LCP - Largest Contentful Paint)
  // News and events are fetched client-side for faster initial page load
  const heroSlides = await getHeroSlidesForLocale();
  
  // Get first slide image URL for preload (LCP optimization)
  const firstSlideImage = heroSlides[0]?.image || null;
  
  return (
    <>
      {/* Preload LCP image for faster initial render */}
      <HeroImagePreload imageUrl={firstSlideImage} />
      
      <WebPageJsonLd
        title="Primăria Municipiului Salonta"
        description="Site-ul oficial al Primăriei Municipiului Salonta - Bihor, România"
        url=""
        locale={locale}
      />
      {/* Hero Section with Image Carousel */}
      <HeroCarousel slides={heroSlides} />

      {/* Weather Widget */}
      <WeatherWidgetSection />

      {/* Quick Access Links */}
      <QuickLinksSection />

      {/* About Section */}
      <AboutSection />

      {/* City Statistics */}
      <CityStatsSection />

      {/* Latest News - fetched client-side */}
      <NewsSection />

      {/* Upcoming Events - fetched client-side */}
      <UpcomingEventsSection />

      {/* Interactive City Map */}
      <CityMapSection />

      {/* Contact Information - Local SEO */}
      <ContactInfoSection />
    </>
  );
}
