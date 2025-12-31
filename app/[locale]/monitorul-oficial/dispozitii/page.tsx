import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { FileCheck, FileText, Download, BookOpen } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('dispozitii') };
}

// Link principal
const MAIN_LINK = {
  href: '/informatii-publice/dispozitii-primar',
};

// Registre dispoziții - doar date, fără traduceri
const DISPOSITION_REGISTERS = [
  { year: 2025, url: '#' },
  { year: 2024, url: '#' },
  { year: 2023, url: '#' },
  { year: 2022, url: '#' },
  { year: 2021, url: '#' },
  { year: '2020 (2016-2020)', url: '#' },
  { year: '2020 (2020-2024)', url: '#' },
];

export default function DispozitiiPage() {
  const t = useTranslations('navigation');
  const td = useTranslations('dispozitiiMolPage');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('monitorulOficial'), href: '/monitorul-oficial' },
        { label: t('dispozitii') }
      ]} />
      <PageHeader titleKey="dispozitii" icon="fileCheck" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto space-y-10">

            {/* Link principal */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">{td('mainTitle')}</h2>
              <Link href={MAIN_LINK.href}>
                <Card className="hover:shadow-md transition-shadow border-l-4 border-l-green-600">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                      <FileCheck className="w-6 h-6 text-green-700" />
                    </div>
                    <span className="font-semibold text-gray-900">{td('mainTitle')}</span>
                  </CardContent>
                </Card>
              </Link>
            </div>

            {/* Registre dispoziții */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{td('registersTitle')}</h2>
                  <p className="text-sm text-gray-500">{td('registersSubtitle')}</p>
                </div>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-3">
                {DISPOSITION_REGISTERS.map((reg) => (
                  <div key={reg.year} className="flex items-center justify-between gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-gray-900 text-sm">
                        {td('registerYear', { year: reg.year })}
                      </span>
                    </div>
                    <Link
                      href={reg.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs font-medium"
                    >
                      <Download className="w-3 h-3" />
                      PDF
                    </Link>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </Container>
      </Section>
    </>
  );
}
