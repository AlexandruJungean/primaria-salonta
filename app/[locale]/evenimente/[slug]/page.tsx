'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useParams } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ArrowLeft, 
  Share2,
  CalendarPlus
} from 'lucide-react';
import { Link } from '@/components/ui/link';
import { getEventBySlug, EVENT_CATEGORIES, EVENTS } from '@/lib/constants/events';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export default function EventDetailPage() {
  const t = useTranslations('events');
  const tCommon = useTranslations('common');
  const locale = useLocale() as 'ro' | 'hu' | 'en';
  const params = useParams();
  const slug = params.slug as string;

  const event = getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(
      locale === 'ro' ? 'ro-RO' : locale === 'hu' ? 'hu-HU' : 'en-US',
      { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
    );
  };

  const isPastEvent = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(event.date) < today;
  };

  // Get related events (same category, excluding current)
  const relatedEvents = EVENTS
    .filter(e => e.category === event.category && e.id !== event.id)
    .slice(0, 3);

  // Generate Google Calendar link
  const generateCalendarLink = () => {
    const startDate = new Date(event.date + 'T' + event.time + ':00');
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // 2 hours duration
    
    const formatCalendarDate = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d{3}/g, '');
    };

    const title = encodeURIComponent(event.translations[locale].title);
    const details = encodeURIComponent(event.translations[locale].description);
    const location = encodeURIComponent(event.location + ', Salonta, Romania');
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatCalendarDate(startDate)}/${formatCalendarDate(endDate)}&details=${details}&location=${location}`;
  };

  // Share event
  const shareEvent = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.translations[locale].title,
          text: event.translations[locale].description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert(t('linkCopied'));
    }
  };

  return (
    <>
      {/* Hero Section with Event Image */}
      <div className="relative">
        {event.image && (
          <div className="relative h-64 md:h-96">
            <Image
              src={event.image}
              alt={event.translations[locale].title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          </div>
        )}
        
        {/* Back button */}
        <Container className="absolute top-4 left-0 right-0">
          <Link 
            href="/evenimente"
            className="inline-flex items-center gap-2 text-white bg-black/30 hover:bg-black/50 px-4 py-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {tCommon('back')}
          </Link>
        </Container>

        {/* Event title overlay */}
        {event.image && (
          <Container className="absolute bottom-0 left-0 right-0 pb-6">
            <Badge className={EVENT_CATEGORIES[event.category].color + ' mb-3'}>
              {EVENT_CATEGORIES[event.category].translations[locale]}
            </Badge>
            <h1 className="text-2xl md:text-4xl font-bold text-white">
              {event.translations[locale].title}
            </h1>
          </Container>
        )}
      </div>

      <Section background="white">
        <Container>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {!event.image && (
                <>
                  <Badge className={EVENT_CATEGORIES[event.category].color + ' mb-4'}>
                    {EVENT_CATEGORIES[event.category].translations[locale]}
                  </Badge>
                  <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-6">
                    {event.translations[locale].title}
                  </h1>
                </>
              )}

              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 text-lg leading-relaxed">
                  {event.translations[locale].description}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-4 mt-8">
                <Button asChild>
                  <a 
                    href={generateCalendarLink()} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    <CalendarPlus className="w-4 h-4" />
                    {t('addToCalendar')}
                  </a>
                </Button>
                <Button variant="outline" onClick={shareEvent}>
                  <Share2 className="w-4 h-4 mr-2" />
                  {t('shareEvent')}
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg text-gray-900 mb-4">
                    {t('eventDetails')}
                  </h3>

                  {isPastEvent() && (
                    <div className="bg-gray-100 text-gray-600 text-sm px-3 py-2 rounded-lg mb-4">
                      {t('pastEventNotice')}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{t('date')}</p>
                        <p className="font-medium text-gray-900">{formatDate(event.date)}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{t('time')}</p>
                        <p className="font-medium text-gray-900">{event.time}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{t('location')}</p>
                        <p className="font-medium text-gray-900">{event.location}</p>
                        <a 
                          href={`https://maps.google.com/?q=${encodeURIComponent(event.location + ', Salonta, Romania')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary-600 hover:text-primary-700"
                        >
                          {t('viewOnMap')}
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Related Events */}
          {relatedEvents.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {t('relatedEvents')}
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedEvents.map((relEvent) => (
                  <Link 
                    key={relEvent.id} 
                    href={`/evenimente/${relEvent.slug}`}
                    className="block group"
                  >
                    <Card hover className="overflow-hidden">
                      {relEvent.image && (
                        <div className="relative aspect-video">
                          <Image
                            src={relEvent.image}
                            alt={relEvent.translations[locale].title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        </div>
                      )}
                      <CardContent className="pt-4">
                        <p className="text-sm text-gray-500 mb-1">
                          {formatDate(relEvent.date)}
                        </p>
                        <h3 className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors line-clamp-2">
                          {relEvent.translations[locale].title}
                        </h3>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}

