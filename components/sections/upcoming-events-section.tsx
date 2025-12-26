'use client';

import { useTranslations, useLocale } from 'next-intl';
import { MapPin, Clock, ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section, SectionHeader } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@/components/ui/link';
import { Badge } from '@/components/ui/badge';
import { EVENTS, EVENT_CATEGORIES } from '@/lib/constants/events';

export function UpcomingEventsSection() {
  const t = useTranslations('homepage');
  const tCommon = useTranslations('common');
  const locale = useLocale() as 'ro' | 'hu' | 'en';

  // Sort events by date and take first 4
  const upcomingEvents = [...EVENTS]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 4);

  if (upcomingEvents.length === 0) {
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
          {upcomingEvents.map((event) => (
            <Link 
              key={event.id} 
              href={`/evenimente/${event.slug}`}
              className="block group"
            >
              <Card hover className="overflow-hidden h-full">
                {/* Date header */}
                <div className="bg-primary-900 text-white p-4 text-center">
                  <div className="text-3xl font-bold">
                    {new Date(event.date).getDate()}
                  </div>
                  <div className="text-sm text-primary-200 uppercase">
                    {new Date(event.date).toLocaleDateString(
                      locale === 'ro' ? 'ro-RO' : locale === 'hu' ? 'hu-HU' : 'en-US', 
                      { month: 'short' }
                    )}
                  </div>
                  <div className="text-xs text-primary-300">
                    {new Date(event.date).getFullYear()}
                  </div>
                </div>
                
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
                </CardContent>
              </Card>
            </Link>
          ))}
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
