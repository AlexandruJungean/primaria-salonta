import { getTranslations } from 'next-intl/server';
import { FileText, Download, Calendar } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('adapostCaini') };
}

// Types for database records
interface Document {
  id: number;
  title: string;
  url: string;
  date: string;
}

// Mock data - will be replaced with database fetch
const SHELTER_DOCUMENTS: Document[] = [
  {
    id: 1,
    title: 'Anexa nr. 3 – completat conform Normelor metodologice de aplicare a Ordonanței de Urgență a Guvernului nr. 155/2001, privind aprobarea programului de gestionare a câinilor fără stăpân',
    url: '#',
    date: '2025-01-01',
  },
];

export default async function AdapostCainiPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(
      locale === 'hu' ? 'hu-HU' : locale === 'en' ? 'en-GB' : 'ro-RO',
      { day: '2-digit', month: '2-digit', year: 'numeric' }
    );
  };

  return (
    <>
      <Breadcrumbs items={[
        { label: t('informatiiPublice'), href: '/informatii-publice' },
        { label: t('adapostCaini') }
      ]} />
      <PageHeader titleKey="adapostCaini" icon="dog" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            {/* Documents Section */}
            <div className="space-y-3">
              {SHELTER_DOCUMENTS.map((doc) => (
                <Card key={doc.id} hover>
                  <CardContent className="flex items-center justify-between pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{doc.title}</h3>
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(doc.date)}
                        </span>
                      </div>
                    </div>
                    <a
                      href={doc.url}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 shrink-0"
                    >
                      <Download className="w-4 h-4" />
                      PDF
                    </a>
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
