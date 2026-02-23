'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Container } from '@/components/ui/container';

const AUTO_SLIDE_INTERVAL = 6000; // 6 seconds

export interface HeroSlideData {
  id: string;
  image: string;
  alt: string;
  title?: string;
}

interface HeroCarouselProps {
  slides: HeroSlideData[];
}

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const t = useTranslations('homepage');
  const tCommon = useTranslations('common');
  const locale = useLocale() as 'ro' | 'hu' | 'en';
  const router = useRouter();

  const slideCount = slides.length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/${locale}/cautare?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slideCount);
  }, [slideCount]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slideCount) % slideCount);
  }, [slideCount]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  useEffect(() => {
    // Don't auto-slide if only one slide
    if (!isAutoPlaying || slideCount <= 1) return;

    const interval = setInterval(nextSlide, AUTO_SLIDE_INTERVAL);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide, slideCount]);

  // Don't render if no slides
  if (slides.length === 0) {
    return null;
  }

  return (
    <section className="relative h-[500px] md:h-[600px] lg:h-[700px] w-full overflow-hidden">
        {/* Slides */}
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={cn(
              'absolute inset-0 transition-opacity duration-1000',
              index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
            )}
          >
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              className="object-cover"
              // Only first slide has priority, others load lazily
              priority={index === 0}
              loading={index === 0 ? 'eager' : 'lazy'}
              sizes="100vw"
              // Improve LCP by using fetchpriority for first image
              {...(index === 0 ? { fetchPriority: 'high' } : {})}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
          </div>
        ))}

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
        <Container className="text-center">
          {/* Logo */}
          <div className="animate-fade-in pb-4">
            <Image
              src="/logo/icon.webp"
              alt="Primăria Salonta"
              width={421}
              height={600}
              className="h-34 md:h-40 lg:h-48 w-auto mx-auto drop-shadow-lg"
              priority
            />
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg animate-fade-in">
            Primăria Municipiului Salonta
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-8 drop-shadow-md animate-fade-in">
            {t('subtitle')}
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="w-full max-w-xl mx-auto mb-8 animate-fade-in" role="search">
            <div className="relative">
              <label htmlFor="hero-search" className="sr-only">
                {tCommon('search')}
              </label>
              <input
                id="hero-search"
                name="q"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={tCommon('searchPlaceholder')}
                className={cn(
                  'w-full px-6 py-4 pr-14 rounded-full bg-white/95 text-gray-900',
                  'placeholder-gray-500 shadow-xl backdrop-blur-sm',
                  'focus:outline-none focus:ring-4 focus:ring-primary-500/30',
                  'text-base md:text-lg'
                )}
              />
              <button
                type="submit"
                className={cn(
                  'absolute right-2 top-1/2 -translate-y-1/2 p-3',
                  'bg-primary-900 text-white rounded-full',
                  'hover:bg-primary-800 transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
                )}
                aria-label={tCommon('search')}
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>
        </Container>
      </div>

      {/* Navigation Arrows - only show if more than 1 slide */}
      {slideCount > 1 && (
        <>
          <button
            onClick={prevSlide}
            className={cn(
              'absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20',
              'p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full',
              'text-white transition-all hover:scale-110',
              'focus:outline-none focus:ring-2 focus:ring-white/50'
            )}
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className={cn(
              'absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20',
              'p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full',
              'text-white transition-all hover:scale-110',
              'focus:outline-none focus:ring-2 focus:ring-white/50'
            )}
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dot Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  'h-3 rounded-full transition-all duration-300',
                  index === currentSlide
                    ? 'bg-white w-10'
                    : 'bg-white/50 hover:bg-white/70 w-3'
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

