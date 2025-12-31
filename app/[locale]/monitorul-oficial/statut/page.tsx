import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { FileText, Download, Calendar } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('statutUat') };
}

// Documente - vor fi returnate din baza de date
const STATUTE_DOCUMENTS = [
  {
    id: 1,
    titleKey: 'statut2021',
    year: 2021,
    url: '#', // URL document din Supabase
  },
  {
    id: 2,
    titleKey: 'statut2017',
    year: 2017,
    url: '#', // URL document din Supabase
  },
];

export default function StatutPage() {
  const t = useTranslations('navigation');
  const ts = useTranslations('statutPage');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('monitorulOficial'), href: '/monitorul-oficial' },
        { label: t('statutUat') }
      ]} />
      <PageHeader titleKey="statutUat" icon="fileText" />

      <Section background="white">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              {STATUTE_DOCUMENTS.map((doc) => (
                <Card key={doc.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                          <FileText className="w-6 h-6 text-primary-700" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {ts(doc.titleKey)}
                          </h3>
                          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <Calendar className="w-4 h-4" />
                            {doc.year}
                          </p>
                        </div>
                      </div>
                      <Link
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                      >
                        <Download className="w-4 h-4" />
                        {ts('download')}
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
