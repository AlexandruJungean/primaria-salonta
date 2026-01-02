import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Info, MapPin, Clock } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { SeipCollapsibleSections } from './collapsible-sections';
import { generatePageMetadata, BreadcrumbJsonLd } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'seip',
    locale: locale as Locale,
    path: '/informatii-publice/seip',
  });
}

export default function SeipPage() {
  const t = useTranslations('navigation');
  const tPage = useTranslations('seipPage');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('informatiiPublice'), href: '/informatii-publice' },
        { label: t('seip') }
      ]} />
      <PageHeader titleKey="seip" icon="network" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            {/* Info Banner */}
            <Card className="mb-8 border-primary-200 bg-gradient-to-r from-primary-50 to-blue-50">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
                    <Info className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{tPage('title')}</h2>
                    <p className="text-gray-700 mb-4">{tPage('description')}</p>
                    <p className="text-sm text-gray-600">{tPage('formsLocation')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <Card className="bg-gray-50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{tPage('location')}</h3>
                      <p className="text-sm text-gray-600">{tPage('locationDetails')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gray-50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{tPage('founded')}</h3>
                      <p className="text-sm text-gray-600">{tPage('foundedDetails')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Departments with Collapsible Sections */}
            <SeipCollapsibleSections />
          </div>
        </Container>
      </Section>
    </>
  );
}
