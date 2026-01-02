import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { FileText, Download, BookOpen } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { generatePageMetadata, BreadcrumbJsonLd } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'regulamentOrganizare',
    locale: locale as Locale,
    path: '/primaria/regulament',
  });
}

// Mock data - will be replaced with database content
const REGULAMENT_DOCS = [
  { id: 1, title: 'Regulamentul de organizare și funcționare al Primăriei Municipiului Salonta', url: '#' },
  { id: 2, title: 'Codul etic și de integritate al funcționarilor publici și personalului contractual din cadrul Primăriei Municipiului Salonta', url: '#' },
  { id: 3, title: 'Statutul Municipiului Salonta (republicat)', url: '#' },
  { id: 4, title: 'Regulamentul de ordine interioară', url: '#' },
];

export default function RegulamentPage() {
  const t = useTranslations('navigation');
  const tr = useTranslations('regulamentPage');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('primaria'), href: '/primaria' },
        { label: t('regulament') }
      ]} />
      <PageHeader titleKey="regulament" icon="fileText" />

      <Section background="white">
        <Container>
          <div className="max-w-3xl mx-auto">
            
            {/* Section Header */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-primary-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{tr('title')}</h2>
                    <p className="text-sm text-gray-500">{tr('subtitle')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documents List */}
            <div className="space-y-3">
              {REGULAMENT_DOCS.map((doc) => (
                <Card key={doc.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between p-4 gap-4">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5 text-gray-500" />
                        </div>
                        <span className="font-medium text-gray-900 text-sm leading-snug">{doc.title}</span>
                      </div>
                      <a
                        href={doc.url}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-900 text-white rounded-lg hover:bg-primary-800 transition-colors text-sm font-medium shrink-0"
                      >
                        <Download className="w-4 h-4" />
                        PDF
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Info Note */}
            <div className="mt-8 p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600 text-center">
                {tr('infoNote')}
              </p>
            </div>

          </div>
        </Container>
      </Section>
    </>
  );
}
