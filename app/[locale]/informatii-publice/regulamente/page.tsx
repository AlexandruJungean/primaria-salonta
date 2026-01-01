import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { ScrollText, Download, FolderOpen } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('regulamente') };
}

// Mock data - will be replaced with database
const CATEGORIES = [
  {
    id: 'organizare',
    title: 'Regulamente de organizare și funcționare',
    documents: [
      'Regulamentul de organizare și funcționare al Primăriei Municipiului Salonta',
      'Regulamentul de organizare și funcționare al Consiliului Local',
      'Regulamentul intern al Primăriei Municipiului Salonta',
    ],
  },
  {
    id: 'urbanism',
    title: 'Regulamente de urbanism',
    documents: [
      'Regulamentul Local de Urbanism',
      'Regulamentul de organizare și desfășurare a activităților comerciale',
      'Regulamentul privind amplasarea firmelor și reclamelor publicitare',
    ],
  },
  {
    id: 'servicii',
    title: 'Regulamente privind serviciile publice',
    documents: [
      'Regulamentul serviciului de alimentare cu apă și canalizare',
      'Regulamentul serviciului de salubrizare',
      'Regulamentul serviciului de transport public local',
    ],
  },
  {
    id: 'ordine',
    title: 'Regulamente de ordine publică',
    documents: [
      'Regulamentul privind liniștea și ordinea publică',
      'Regulamentul privind activitățile de comerț stradal',
      'Regulamentul privind circulația în zona centrală',
    ],
  },
];

export default function RegulamentePage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('informatiiPublice'), href: '/informatii-publice' },
        { label: t('regulamente') }
      ]} />
      <PageHeader titleKey="regulamente" icon="scrollText" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            <p className="text-gray-600 mb-8 text-center">
              Regulamentele adoptate de Consiliul Local al Municipiului Salonta și aprobate prin hotărâri ale acestuia.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {CATEGORIES.map((category) => (
                <Card key={category.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <FolderOpen className="w-5 h-5 text-primary-600" />
                      {category.title}
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
                            <ScrollText className="w-4 h-4 text-violet-500 shrink-0" />
                            <span className="flex-1">{doc}</span>
                            <Download className="w-4 h-4 text-gray-400 shrink-0" />
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

