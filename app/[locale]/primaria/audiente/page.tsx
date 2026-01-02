import { getTranslations } from 'next-intl/server';
import { useTranslations, useLocale } from 'next-intl';
import { Mic, Calendar, Info, MapPin } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { LEADERSHIP } from '@/lib/constants/leadership';
import { PUBLIC_HOURS } from '@/lib/constants/public-hours';
import { generatePageMetadata, BreadcrumbJsonLd } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'audiente',
    locale: locale as Locale,
    path: '/primaria/audiente',
  });
}

export default function AudientePage() {
  const t = useTranslations('navigation');
  const ta = useTranslations('audientePage');
  const locale = useLocale() as 'ro' | 'hu' | 'en';
  const translations = PUBLIC_HOURS.translations[locale];

  return (
    <>
      <Breadcrumbs items={[
        { label: t('primaria'), href: '/primaria' },
        { label: t('audiente') }
      ]} />
      <PageHeader titleKey="audiente" icon="mic" />

      <Section background="white">
        <Container>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-gray-600 mb-8 text-center">
              Programul de audiențe oferă cetățenilor posibilitatea de a discuta 
              direct cu conducerea Primăriei despre problemele lor.
            </p>

            <div className="space-y-4 mb-8">
              {LEADERSHIP.map((leader) => (
                <Card key={leader.id} className="overflow-hidden">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                        <Calendar className="w-6 h-6 text-primary-700" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">
                          {leader.translations[locale].position}
                        </h3>
                        <p className="text-gray-600">{leader.translations[locale].name}</p>
                        <p className="text-primary-700 font-medium mt-2">
                          {leader.translations[locale].audienceSchedule}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Registration info */}
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <Info className="w-6 h-6 text-amber-600 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-amber-900 mb-2">{ta('registrationTitle')}</h4>
                    <p className="text-amber-800 text-sm">
                      {translations.registrationNote}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardContent className="flex items-center gap-4 pt-6">
                <MapPin className="w-5 h-5 text-primary-600" />
                <span>{ta('location')}</span>
              </CardContent>
            </Card>

            {/* Additional information */}
            <Card className="mt-4 bg-gray-50">
              <CardContent className="pt-6">
                <h4 className="font-semibold text-gray-900 mb-3">{ta('procedureTitle')}</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-2 shrink-0" />
                    {ta('procedureWorksheet')}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-2 shrink-0" />
                    {ta('procedureResolution')}
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>
    </>
  );
}

