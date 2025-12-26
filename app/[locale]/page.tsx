import { HeroCarousel } from '@/components/sections/hero-carousel';
import { QuickLinksSection } from '@/components/sections/quick-links';
import { NewsSection } from '@/components/sections/news-section';
import { WebcamsSection } from '@/components/sections/webcams-section';
import { ExternalLinksSection } from '@/components/sections/external-links-section';

export default function HomePage() {
  return (
    <>
      {/* Hero Section with Image Carousel */}
      <HeroCarousel />

      {/* Quick Access Links */}
      <QuickLinksSection />

      {/* Latest News */}
      <NewsSection />

      {/* Live Webcams */}
      <WebcamsSection />

      {/* External Partner Links */}
      <ExternalLinksSection />
    </>
  );
}

