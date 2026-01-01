import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { FileText, Download, FolderOpen } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('acteNecesare') };
}

// Mock data - will be replaced with database
const CATEGORIES = [
  {
    id: 'stare-civila',
    titleKey: 'Stare civilă',
    documents: [
      'Acte necesare pentru eliberarea certificatului de naștere',
      'Acte necesare pentru eliberarea certificatului de căsătorie',
      'Acte necesare pentru eliberarea certificatului de deces',
    ],
  },
  {
    id: 'urbanism',
    titleKey: 'Urbanism și construcții',
    documents: [
      'Acte necesare pentru obținerea certificatului de urbanism',
      'Acte necesare pentru obținerea autorizației de construire',
      'Acte necesare pentru recepția lucrărilor',
    ],
  },
  {
    id: 'taxe',
    titleKey: 'Taxe și impozite',
    documents: [
      'Acte necesare pentru declararea clădirilor',
      'Acte necesare pentru declararea terenurilor',
      'Acte necesare pentru declararea mijloacelor de transport',
    ],
  },
  {
    id: 'social',
    titleKey: 'Asistență socială',
    documents: [
      'Acte necesare pentru acordarea ajutorului social',
      'Acte necesare pentru acordarea alocației de stat',
      'Acte necesare pentru acordarea indemnizației de creștere a copilului',
    ],
  },
];

export default function ActeNecesarePage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('informatiiPublice'), href: '/informatii-publice' },
        { label: t('acteNecesare') }
      ]} />
      <PageHeader titleKey="acteNecesare" icon="fileText" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            <p className="text-gray-600 mb-8 text-center">
              Consultați lista actelor necesare pentru diferite proceduri la Primăria Municipiului Salonta.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {CATEGORIES.map((category) => (
                <Card key={category.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FolderOpen className="w-5 h-5 text-primary-600" />
                      {category.titleKey}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {category.documents.map((doc, index) => (
                        <li key={index}>
                          <a
                            href="#"
                            className="flex items-center gap-2 text-sm text-gray-700 hover:text-primary-700 transition-colors"
                          >
                            <FileText className="w-4 h-4 text-red-500 shrink-0" />
                            <span>{doc}</span>
                            <Download className="w-4 h-4 ml-auto text-gray-400" />
                          </a>
                        </li>
                      ))}
                    </ul>
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

