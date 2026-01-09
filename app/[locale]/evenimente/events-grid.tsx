'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Filter, ChevronRight } from 'lucide-react';
import { Link } from '@/components/ui/link';
import { cn } from '@/lib/utils/cn';
import Image from 'next/image';
import type { Event } from '@/lib/types/database';

type EventType = Event['event_type'];

const EVENT_TYPE_CONFIG: Record<EventType, { color: string; translations: Record<string, string> }> = {
  cultural: {
    color: 'bg-purple-100 text-purple-800',
    translations: { ro: 'Cultural', hu: 'Kulturális', en: 'Cultural' },
  },
  sportiv: {
    color: 'bg-red-100 text-red-800',
    translations: { ro: 'Sportiv', hu: 'Sport', en: 'Sports' },
  },
  civic: {
    color: 'bg-green-100 text-green-800',
    translations: { ro: 'Civic', hu: 'Közösségi', en: 'Civic' },
  },
  educational: {
    color: 'bg-blue-100 text-blue-800',
    translations: { ro: 'Educațional', hu: 'Oktatási', en: 'Educational' },
  },
  administrativ: {
    color: 'bg-slate-100 text-slate-800',
    translations: { ro: 'Administrativ', hu: 'Adminisztratív', en: 'Administrative' },
  },
  festival: {
    color: 'bg-orange-100 text-orange-800',
    translations: { ro: 'Festival', hu: 'Fesztivál', en: 'Festival' },
  },
  altele: {
    color: 'bg-gray-100 text-gray-800',
    translations: { ro: 'Altele', hu: 'Egyéb', en: 'Other' },
  },
};

interface EventsGridProps {
  events: Event[];
}

export function EventsGrid({ events }: EventsGridProps) {
  const t = useTranslations('events');
  const locale = useLocale() as 'ro' | 'hu' | 'en';
  const [selectedCategory, setSelectedCategory] = useState<EventType | 'all'>('all');

  // Sort events by date (newest first)
  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
  );

  // Filter events by category
  const filteredEvents = selectedCategory === 'all' 
    ? sortedEvents 
    : sortedEvents.filter(event => event.event_type === selectedCategory);

  // Check if event is in the past
  const isPastEvent = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(dateStr) < today;
  };

  // Get unique event types from available events
  const availableTypes = [...new Set(events.map(e => e.event_type))];

  if (events.length === 0) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6 text-center py-12">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">{t('noEvents')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
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
          {availableTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedCategory(type)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                selectedCategory === type
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              )}
            >
              {EVENT_TYPE_CONFIG[type]?.translations[locale] || type}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => {
            const isPast = isPastEvent(event.start_date);
            const eventConfig = EVENT_TYPE_CONFIG[event.event_type] || EVENT_TYPE_CONFIG.altele;
            const startDate = new Date(event.start_date);

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
                  <div className="relative aspect-video">
                    <Image
                      src={event.featured_image || event.poster_image || '/images/primaria-salonta-1.webp'}
                      alt={event.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {/* Date overlay */}
                    <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg px-3 py-2 text-center">
                      <div className="text-2xl font-bold text-primary-900">
                        {startDate.getDate()}
                      </div>
                      <div className="text-xs text-gray-500 uppercase">
                        {startDate.toLocaleDateString(
                          locale === 'ro' ? 'ro-RO' : locale === 'hu' ? 'hu-HU' : 'en-US',
                          { month: 'short' }
                        )}
                      </div>
                      <div className="text-xs font-medium text-gray-400">
                        {startDate.getFullYear()}
                      </div>
                    </div>
                    {isPast && (
                      <div className="absolute top-4 right-4 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                        {t('pastEvent')}
                      </div>
                    )}
                  </div>

                  <CardContent className="pt-4">
                    <Badge className={eventConfig.color}>
                      {eventConfig.translations[locale]}
                    </Badge>

                    <h3 className="font-semibold text-lg text-gray-900 mt-3 mb-2 line-clamp-2 group-hover:text-primary-700 transition-colors">
                      {event.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {event.description || ''}
                    </p>

                    <div className="space-y-2 text-sm text-gray-500">
                      {event.start_time && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{event.start_time.slice(0, 5)}</span>
                        </div>
                      )}
                      {event.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                      )}
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
    </>
  );
}
