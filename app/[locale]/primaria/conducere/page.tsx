import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Phone, Mail, Calendar, User } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { getLeadership } from '@/lib/supabase/services';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';
import { translateContentArray } from '@/lib/google-translate/cache';

const POSITION_LABELS: Record<string, Record<string, string>> = {
  primar: { ro: 'Primar', hu: 'Polgármester', en: 'Mayor' },
  viceprimar: { ro: 'Viceprimar', hu: 'Alpolgármester', en: 'Vice Mayor' },
  secretar: { ro: 'Secretar General', hu: 'Titkár', en: 'General Secretary' },
  administrator: { ro: 'Administrator Public', hu: 'Közigazgató', en: 'Public Administrator' },
  director: { ro: 'Director', hu: 'Igazgató', en: 'Director' },
  sef_serviciu: { ro: 'Șef Serviciu', hu: 'Osztályvezető', en: 'Department Head' },
  altele: { ro: 'Funcționar', hu: 'Tisztviselő', en: 'Official' },
};

// Convert newlines to <br> tags for proper HTML rendering
function formatTextToHtml(text: string | null): string {
  if (!text) return '';
  // First escape any HTML, then convert newlines to <br>
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'conducere',
    locale: locale as Locale,
    path: '/primaria/conducere',
  });
}

export default async function LeadershipPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('leadership');
  const tNav = await getTranslations('navigation');

  // Fetch leadership from database
  const leadershipData = await getLeadership();
  
  // Translate content based on locale (NOT person names - they are proper nouns)
  const leadership = await translateContentArray(
    leadershipData,
    ['bio', 'responsibilities', 'reception_hours'],
    locale as 'ro' | 'hu' | 'en'
  );

  return (
    <>
      <Breadcrumbs
        items={[
          { label: tNav('primaria'), href: '/primaria' },
          { label: tNav('conducere') },
        ]}
      />
      <PageHeader titleKey="conducere" icon="users" />

      <Section background="white">
        <Container>
          {/* Introduction */}
          <div className="max-w-4xl mx-auto mb-12">
            <p className="text-lg text-gray-600 text-center leading-relaxed">
              {t('intro')}
            </p>
          </div>

          {leadership.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>{locale === 'hu' ? 'Jelenleg nincsenek információk a vezetőségről.' : locale === 'en' ? 'No leadership information available at the moment.' : 'Nu există informații despre conducere momentan.'}</p>
            </div>
          ) : (
            <div className="space-y-12 max-w-5xl mx-auto">
              {leadership.map((leader, index) => (
                <Card key={leader.id} className="overflow-hidden">
                  <div className="md:flex md:items-start">
                    {/* Photo Section */}
                    <div className="md:w-64 lg:w-72 shrink-0">
                      <div className="aspect-[3/4] relative bg-gradient-to-br from-primary-100 to-primary-50">
                        {leader.photo_url ? (
                          <Image
                            src={leader.photo_url}
                            alt={leader.name}
                            fill
                            className="object-cover object-top"
                            sizes="(max-width: 768px) 100vw, 280px"
                            priority={index === 0}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="w-24 h-24 text-primary-200" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Info Section */}
                    <CardContent className="flex-1 p-6 md:p-8">
                      {/* Header */}
                      <div className="mb-6">
                        <span className="inline-block px-3 py-1 bg-primary-100 text-primary-800 text-sm font-medium rounded-full mb-3">
                          {POSITION_LABELS[leader.position_type]?.[locale] || leader.position_type}
                        </span>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                          {leader.name}
                        </h2>
                      </div>

                      {/* Contact Info */}
                      <div className="flex flex-wrap gap-4 mb-6 pb-6 border-b border-gray-100">
                        {leader.phone && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Phone className="w-4 h-4 text-primary-600" />
                            <span className="text-sm">{leader.phone}</span>
                          </div>
                        )}
                        {leader.email && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Mail className="w-4 h-4 text-primary-600" />
                            <a
                              href={`mailto:${leader.email}`}
                              className="text-sm text-primary-700 hover:underline"
                            >
                              {leader.email}
                            </a>
                          </div>
                        )}
                        {leader.reception_hours && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4 text-primary-600" />
                            <span className="text-sm">{leader.reception_hours}</span>
                          </div>
                        )}
                      </div>

                      {/* Bio / Education */}
                      {leader.bio && (
                        <div className="mb-6">
                          <h3 className="font-semibold text-gray-900 mb-3">{t('education')}</h3>
                          <div 
                            className="text-sm text-gray-600 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: formatTextToHtml(leader.bio) }}
                          />
                        </div>
                      )}

                      {/* Responsibilities */}
                      {leader.responsibilities && (
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-3">{t('mainResponsibilities')}</h3>
                          <div 
                            className="text-sm text-gray-600 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: formatTextToHtml(leader.responsibilities) }}
                          />
                        </div>
                      )}
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
