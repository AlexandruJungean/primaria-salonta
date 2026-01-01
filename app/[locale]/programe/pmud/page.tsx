'use client';

import { useTranslations } from 'next-intl';
import { Map, Download, FileText } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

// Mock data - will be replaced with database content
const PMUD_DOCUMENT = {
  title: 'Plan de Mobilitate Urbană Durabilă 2017-2032',
  subtitle: 'Anexa 2 la HCLMS nr.155/18.07.2023',
  url: '#',
};

export default function PmudPage() {
  const t = useTranslations('navigation');
  const tp = useTranslations('pmudPage');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('programe'), href: '/programe' },
        { label: t('pmud') }
      ]} />
      <PageHeader titleKey="pmud" icon="map" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-600 mb-8 text-center">
              {tp('description')}
            </p>

            {/* Main PMUD Document */}
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                      <Map className="w-7 h-7 text-blue-700" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{PMUD_DOCUMENT.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{PMUD_DOCUMENT.subtitle}</p>
                    </div>
                  </div>
                  <a
                    href={PMUD_DOCUMENT.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shrink-0"
                  >
                    <Download className="w-5 h-5" />
                    Descarcă PMUD
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Info box */}
            <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <p className="text-sm text-blue-800">
                {tp('infoText')}
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
