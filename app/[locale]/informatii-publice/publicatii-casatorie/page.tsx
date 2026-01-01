import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Heart, Calendar, Download, Users } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('publicatiiCasatorie') };
}

// Mock data - will be replaced with database
const PUBLICATIONS = [
  {
    id: 1,
    date: '2025-12-15',
    names: 'Pop Alexandru și Ionescu Maria',
    weddingDate: '2025-12-28',
  },
  {
    id: 2,
    date: '2025-12-12',
    names: 'Mureșan Andrei și Szabó Eszter',
    weddingDate: '2025-12-25',
  },
  {
    id: 3,
    date: '2025-12-10',
    names: 'Kovács László și Pop Ana',
    weddingDate: '2025-12-22',
  },
  {
    id: 4,
    date: '2025-12-08',
    names: 'Molnar Tibor și Papp Katalin',
    weddingDate: '2025-12-20',
  },
];

export default function PublicatiiCasatoriePage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('informatiiPublice'), href: '/informatii-publice' },
        { label: t('publicatiiCasatorie') }
      ]} />
      <PageHeader titleKey="publicatiiCasatorie" icon="heart" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="bg-pink-50 border border-pink-200 rounded-xl p-4 mb-8 text-center">
              <Heart className="w-8 h-8 text-pink-500 mx-auto mb-2" />
              <p className="text-pink-800 text-sm">
                În conformitate cu prevederile legale, publicațiile de căsătorie sunt afișate timp de 10 zile
                la sediul primăriei și pe site-ul instituției.
              </p>
            </div>

            <div className="space-y-4">
              {PUBLICATIONS.map((pub) => (
                <Card key={pub.id} hover className="border-l-4 border-l-pink-400">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center shrink-0">
                          <Heart className="w-5 h-5 text-pink-500" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            {pub.names}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Publicat: {new Date(pub.date).toLocaleDateString('ro-RO')}
                            </span>
                            <span className="text-pink-600 font-medium">
                              Data căsătoriei: {new Date(pub.weddingDate).toLocaleDateString('ro-RO')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 shrink-0">
                        <Download className="w-4 h-4" />
                        PDF
                      </button>
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

