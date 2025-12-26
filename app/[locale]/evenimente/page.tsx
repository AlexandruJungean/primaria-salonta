'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { PageHeader } from '@/components/pages/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Filter, ChevronRight } from 'lucide-react';
import { Link } from '@/components/ui/link';
import { cn } from '@/lib/utils/cn';
import { EVENTS, EVENT_CATEGORIES, type EventCategory } from '@/lib/constants/events';
import Image from 'next/image';

export default function EvenimentePage() {
  const t = useTranslations('events');
  const tNav = useTranslations('navigation');
  const locale = useLocale() as 'ro' | 'hu' | 'en';
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'all'>('all');

  // Sort events by date
  const sortedEvents = [...EVENTS].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Filter events by category
  const filteredEvents = selectedCategory === 'all' 
    ? sortedEvents 
    : sortedEvents.filter(event => event.category === selectedCategory);

  // Check if event is in the past
  const isPastEvent = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(dateStr) < today;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(
      locale === 'ro' ? 'ro-RO' : locale === 'hu' ? 'hu-HU' : 'en-US',
      { day: 'numeric', month: 'long', year: 'numeric' }
    );
  };

  return (
    <>
      <PageHeader 
        titleKey="evenimente" 
        icon="calendar" 
        descriptionKey="evenimenteDesc"
      />

      <Section background="gray">
        <Container>
          {/* Category Filter */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="font-medium text-gray-700">{t('filterByCategory')}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                  selectedCategory === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                )}
              >
                {t('allEvents')}
              </button>
              {(Object.keys(EVENT_CATEGORIES) as EventCategory[]).map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                    selectedCategory === category
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  )}
                >
                  {EVENT_CATEGORIES[category].translations[locale]}
                </button>
              ))}
            </div>
          </div>

          {/* Events Grid */}
          {filteredEvents.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => {
                const isPast = isPastEvent(event.date);
                return (
                  <Link 
                    key={event.id} 
                    href={`/evenimente/${event.slug}`}
                    className="block group"
                  >
                    <Card 
                      hover 
                      className={cn(
                        'overflow-hidden h-full',
                        isPast && 'opacity-60'
                      )}
                    >
                      {/* Event Image */}
                      {event.image && (
                        <div className="relative aspect-video">
                          <Image
                            src={event.image}
                            alt={event.translations[locale].title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                          {/* Date overlay */}
                          <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg px-3 py-2 text-center">
                            <div className="text-2xl font-bold text-primary-900">
                              {new Date(event.date).getDate()}
                            </div>
                            <div className="text-xs text-gray-500 uppercase">
                              {new Date(event.date).toLocaleDateString(
                                locale === 'ro' ? 'ro-RO' : locale === 'hu' ? 'hu-HU' : 'en-US',
                                { month: 'short' }
                              )}
                            </div>
                          </div>
                          {isPast && (
                            <div className="absolute top-4 right-4 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                              {t('pastEvent')}
                            </div>
                          )}
                        </div>
                      )}

                      <CardContent className="pt-4">
                        <Badge className={EVENT_CATEGORIES[event.category].color}>
                          {EVENT_CATEGORIES[event.category].translations[locale]}
                        </Badge>

                        <h3 className="font-semibold text-lg text-gray-900 mt-3 mb-2 line-clamp-2 group-hover:text-primary-700 transition-colors">
                          {event.translations[locale].title}
                        </h3>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {event.translations[locale].description}
                        </p>

                        <div className="space-y-2 text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span className="line-clamp-1">{event.location}</span>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center text-primary-600 font-medium text-sm group-hover:text-primary-700">
                          {t('viewDetails')}
                          <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          ) : (
            <Card className="max-w-md mx-auto">
              <CardContent className="pt-6 text-center py-12">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">{t('noEvents')}</p>
              </CardContent>
            </Card>
          )}
        </Container>
      </Section>
    </>
  );
}
