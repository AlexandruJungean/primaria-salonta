import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { FileSignature, Calendar, Download, Search } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('dispozitii') };
}

// Mock data - will be replaced with database
const DISPOSITIONS = [
  { id: 1, number: '250/2025', date: '2025-12-12', title: 'Dispoziție privind convocarea ședinței ordinare a Consiliului Local' },
  { id: 2, number: '249/2025', date: '2025-12-10', title: 'Dispoziție privind numirea comisiei de evaluare' },
  { id: 3, number: '248/2025', date: '2025-12-08', title: 'Dispoziție privind aprobarea programului de audiențe' },
  { id: 4, number: '247/2025', date: '2025-12-05', title: 'Dispoziție privind delegarea atribuțiilor' },
  { id: 5, number: '246/2025', date: '2025-12-01', title: 'Dispoziție privind organizarea manifestărilor culturale' },
];

export default function DispozitiiPage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('informatiiPublice'), href: '/informatii-publice' },
        { label: t('dispozitii') }
      ]} />
      <PageHeader titleKey="dispozitii" icon="fileSignature" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Search box */}
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Căutați după număr sau cuvinte cheie..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Dispositions list */}
            <div className="space-y-3">
              {DISPOSITIONS.map((disp) => (
                <Card key={disp.id} hover>
                  <CardContent className="flex items-center justify-between pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
                        <FileSignature className="w-5 h-5 text-violet-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-violet-700">
                            Dispoziția nr. {disp.number}
                          </span>
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(disp.date).toLocaleDateString('ro-RO')}
                          </span>
                        </div>
                        <h3 className="text-gray-700">{disp.title}</h3>
                      </div>
                    </div>
                    <button className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 shrink-0">
                      <Download className="w-4 h-4" />
                      PDF
                    </button>
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

