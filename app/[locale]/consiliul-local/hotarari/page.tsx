import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Gavel, Download, Search, Filter } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('hotarari') };
}

const DECISIONS = [
  { number: '120/2025', date: '2025-12-15', title: 'Privind aprobarea bugetului local pe anul 2026' },
  { number: '119/2025', date: '2025-12-15', title: 'Privind stabilirea impozitelor și taxelor locale' },
  { number: '118/2025', date: '2025-11-20', title: 'Privind aprobarea organigramei și statului de funcții' },
  { number: '117/2025', date: '2025-11-20', title: 'Privind închirierea unor spații comerciale' },
  { number: '116/2025', date: '2025-10-18', title: 'Privind aprobarea planului de mobilitate urbană' },
];

export default function HotarariPage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('consiliulLocal'), href: '/consiliul-local' },
        { label: t('hotarari') }
      ]} />
      <PageHeader titleKey="hotarari" icon="gavel" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            {/* Search and Filter */}
            <div className="flex gap-4 mb-8">
              <div className="flex-1">
                <Input 
                  placeholder="Căutare în hotărâri..." 
                  icon={<Search className="w-4 h-4" />}
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter className="w-4 h-4" />
                Filtrează
              </button>
            </div>

            <div className="space-y-3">
              {DECISIONS.map((decision, idx) => (
                <Card key={idx}>
                  <CardContent className="flex items-center justify-between pt-6">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-bold text-primary-700">HCL {decision.number}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(decision.date).toLocaleDateString('ro-RO')}
                        </span>
                      </div>
                      <p className="text-gray-700">{decision.title}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                        <Download className="w-4 h-4" />
                        HCL
                      </button>
                      <button className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                        <Download className="w-4 h-4" />
                        PV
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

