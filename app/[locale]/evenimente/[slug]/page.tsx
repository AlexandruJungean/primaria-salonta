import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, ArrowLeft } from 'lucide-react';
import { Link } from '@/components/ui/link';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';
import { getEventBySlug, getAllEventSlugs, EVENT_TYPE_CONFIG } from '@/lib/supabase/services';
import { translateContentFields } from '@/lib/google-translate/cache';

function formatDate(dateStr: string, locale: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString(
    locale === 'ro' ? 'ro-RO' : locale === 'hu' ? 'hu-HU' : 'en-US',
    { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
  );
}

function isPastEvent(dateStr: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dateStr) < today;
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string; slug: string }> 
}) {
  const { locale, slug } = await params;
  const event = await getEventBySlug(slug);
  
  if (!event) {
    return generatePageMetadata({
      pageKey: 'evenimente',
      locale: locale as Locale,
      path: '/evenimente',
    });
  }

  return generatePageMetadata({
    pageKey: 'evenimente',
    locale: locale as Locale,
    path: `/evenimente/${slug}`,
    customTitle: event.title,
    customDescription: event.description || undefined,
  });
}

export async function generateStaticParams() {
  const slugs = await getAllEventSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function EventDetailPage({ 
  params 
}: { 
  params: Promise<{ locale: string; slug: string }> 
}) {
  const { locale, slug } = await params;
  const eventData = await getEventBySlug(slug);
  const t = await getTranslations('events');
  const tCommon = await getTranslations('common');

  if (!eventData) {
    notFound();
  }

  // Translate event content based on locale
  const event = await translateContentFields(
    eventData,
    ['title', 'description', 'location', 'location_address', 'program'],
    locale as 'ro' | 'hu' | 'en'
  );

  const eventTypeConfig = EVENT_TYPE_CONFIG[event.event_type] || EVENT_TYPE_CONFIG.altele;
  const isPast = isPastEvent(event.start_date);

  // Generate Google Calendar link
  const generateCalendarLink = () => {
    const startDate = new Date(event.start_date + 'T' + (event.start_time || '10:00') + ':00');
    const endDate = event.end_date 
      ? new Date(event.end_date + 'T' + (event.end_time || '18:00') + ':00')
      : new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
    
    const formatCalendarDate = (date: Date) => date.toISOString().replace(/-|:|\.\d{3}/g, '');

    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(event.description || '');
    const location = encodeURIComponent((event.location || '') + ', Salonta, Romania');
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatCalendarDate(startDate)}/${formatCalendarDate(endDate)}&details=${details}&location=${location}`;
  };

  return (
    <>
      {/* Hero Section with Event Image */}
      <div className="relative">
        <div className="relative h-64 md:h-96">
          <Image
            src={event.featured_image || event.poster_image || '/images/placeholder-eveniment.webp'}
            alt={event.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        </div>
        
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
        <Container className="absolute bottom-0 left-0 right-0 pb-6">
          <Badge className={eventTypeConfig.color + ' mb-3'}>
            {eventTypeConfig.translations[locale as 'ro' | 'hu' | 'en']}
          </Badge>
          <h1 className="text-2xl md:text-4xl font-bold text-white">
            {event.title}
          </h1>
        </Container>
      </div>

      <Section background="white">
        <Container>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {event.description && (
                <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>
              )}

              {event.program && (
                <div className="mt-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Program</h2>
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                    {event.program}
                  </p>
                </div>
              )}

              {/* Action buttons */}
              {!isPast && (
                <div className="flex flex-wrap gap-4 mt-8">
                  <a 
                    href={generateCalendarLink()} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <Calendar className="w-4 h-4" />
                    {t('addToCalendar')}
                  </a>
                </div>
              )}

              {/* Event Images Gallery */}
              {event.images && event.images.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Galerie foto</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {event.images.map((image) => (
                      <div key={image.id} className="relative aspect-square rounded-lg overflow-hidden">
                        <Image
                          src={image.image_url}
                          alt={image.caption || event.title}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 50vw, 33vw"
                        />
                        {image.caption && (
                          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2">
                            {image.caption}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg text-gray-900 mb-4">
                    {t('eventDetails')}
                  </h3>

                  {isPast && (
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
                        <p className="font-medium text-gray-900">{formatDate(event.start_date, locale)}</p>
                        {event.end_date && event.end_date !== event.start_date && (
                          <p className="text-sm text-gray-600">
                            până la {formatDate(event.end_date, locale)}
                          </p>
                        )}
                      </div>
                    </div>

                    {event.start_time && (
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                          <Clock className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">{t('time')}</p>
                          <p className="font-medium text-gray-900">
                            {event.start_time.slice(0, 5)}
                            {event.end_time && ` - ${event.end_time.slice(0, 5)}`}
                          </p>
                        </div>
                      </div>
                    )}

                    {event.location && (
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">{t('location')}</p>
                          <p className="font-medium text-gray-900">{event.location}</p>
                          {event.location_address && (
                            <p className="text-sm text-gray-600">{event.location_address}</p>
                          )}
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
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
