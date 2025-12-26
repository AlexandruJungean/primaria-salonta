import { HeroCarousel } from '@/components/sections/hero-carousel';
import { WeatherWidgetSection } from '@/components/sections/weather-widget-section';
import { CityStatsSection } from '@/components/sections/city-stats-section';
import { QuickLinksSection } from '@/components/sections/quick-links';
import { NewsSection } from '@/components/sections/news-section';
import { UpcomingEventsSection } from '@/components/sections/upcoming-events-section';
import { CityMapSection } from '@/components/sections/city-map-section';
import { ExternalLinksSection } from '@/components/sections/external-links-section';

export default function HomePage() {
  return (
    <>
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

      {/* External Partner Links */}
      <ExternalLinksSection />
    </>
  );
}
