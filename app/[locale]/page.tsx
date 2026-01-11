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
import { getLatestNews, getUpcomingEvents } from '@/lib/supabase/services';

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

const ExternalLinksSection = dynamic(
  () => import('@/components/sections/external-links-section').then(mod => ({ default: mod.ExternalLinksSection })),
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
  
  // Fetch data from Supabase
  const [latestNews, upcomingEvents] = await Promise.all([
    getLatestNews(3),
    getUpcomingEvents(4),
  ]);
  
  return (
    <>
      <WebPageJsonLd
        title="Primăria Municipiului Salonta"
        description="Site-ul oficial al Primăriei Municipiului Salonta - Bihor, România"
        url=""
        locale={locale}
      />
      {/* Hero Section with Image Carousel */}
      <HeroCarousel />

      {/* Weather Widget */}
      <WeatherWidgetSection />

      {/* City Statistics */}
      <CityStatsSection />

      {/* Quick Access Links */}
      <QuickLinksSection />

      {/* About Section */}
      <AboutSection />

      {/* Latest News */}
      <NewsSection news={latestNews} />

      {/* Upcoming Events */}
      <UpcomingEventsSection events={upcomingEvents} />

      {/* Interactive City Map */}
      <CityMapSection />

      {/* Contact Information - Local SEO */}
      <ContactInfoSection />

      {/* External Partner Links */}
      <ExternalLinksSection />
    </>
  );
}
