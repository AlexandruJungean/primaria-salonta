import { HeroCarousel } from '@/components/sections/hero-carousel';
import { WeatherWidgetSection } from '@/components/sections/weather-widget-section';
import { CityStatsSection } from '@/components/sections/city-stats-section';
import { QuickLinksSection } from '@/components/sections/quick-links';
import { NewsSection } from '@/components/sections/news-section';
import { UpcomingEventsSection } from '@/components/sections/upcoming-events-section';
import { CityMapSection } from '@/components/sections/city-map-section';
import { ContactInfoSection } from '@/components/sections/contact-info-section';
import { ExternalLinksSection } from '@/components/sections/external-links-section';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { WebPageJsonLd } from '@/lib/seo/json-ld';
import { type Locale } from '@/i18n/routing';

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

      {/* Latest News */}
      <NewsSection />

      {/* Upcoming Events */}
      <UpcomingEventsSection />

      {/* Interactive City Map */}
      <CityMapSection />

      {/* Contact Information - Local SEO */}
      <ContactInfoSection />

      {/* External Partner Links */}
      <ExternalLinksSection />
    </>
  );
}
