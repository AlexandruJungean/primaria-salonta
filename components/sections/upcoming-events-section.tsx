'use client';

import { useTranslations, useLocale } from 'next-intl';
import { MapPin, Clock, ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section, SectionHeader } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@/components/ui/link';
import { Badge } from '@/components/ui/badge';
import type { Event } from '@/lib/types/database';

interface UpcomingEventsSectionProps {
  events?: Event[];
}

const EVENT_TYPE_CONFIG: Record<string, { color: string; translations: Record<string, string> }> = {
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

export function UpcomingEventsSection({ events = [] }: UpcomingEventsSectionProps) {
  const t = useTranslations('homepage');
  const tCommon = useTranslations('common');
  const locale = useLocale() as 'ro' | 'hu' | 'en';

  if (events.length === 0) {
    return null;
  }

  return (
    <Section background="white">
      <Container>
        <SectionHeader 
          title={t('upcomingEvents')} 
          subtitle={t('upcomingEventsSubtitle')} 
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.map((event) => {
            const eventTypeConfig = EVENT_TYPE_CONFIG[event.event_type] || EVENT_TYPE_CONFIG.altele;
            const startDate = new Date(event.start_date);

            return (
              <Link 
                key={event.id} 
                href={`/evenimente/${event.slug}`}
                className="block group"
              >
                <Card hover className="overflow-hidden h-full">
                  {/* Date header */}
                  <div className="bg-primary-900 text-white p-4 text-center">
                    <div className="text-3xl font-bold">
                      {startDate.getDate()}
                    </div>
                    <div className="text-sm text-primary-200 uppercase">
                      {startDate.toLocaleDateString(
                        locale === 'ro' ? 'ro-RO' : locale === 'hu' ? 'hu-HU' : 'en-US', 
                        { month: 'short' }
                      )}
                    </div>
                    <div className="text-xs text-primary-300">
                      {startDate.getFullYear()}
                    </div>
                  </div>
                  
                  <CardContent className="pt-4">
                    <Badge className={eventTypeConfig.color}>
                      {eventTypeConfig.translations[locale]}
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
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <Button variant="outline" asChild>
            <Link href="/evenimente" className="inline-flex items-center gap-2">
              {tCommon('seeAll')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
