import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { ShoppingCart, ExternalLink, Calendar, Download } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('achizitiiPublice') };
}

const ACQUISITIONS = [
  { id: 1, date: '2025-12-10', title: 'Servicii de întreținere spații verzi', status: 'activ', value: '150.000 lei' },
  { id: 2, date: '2025-11-25', title: 'Lucrări de reparații străzi', status: 'finalizat', value: '500.000 lei' },
  { id: 3, date: '2025-11-15', title: 'Achiziție echipamente IT', status: 'finalizat', value: '80.000 lei' },
];

export default function AchizitiiPage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('informatiiPublice'), href: '/informatii-publice' },
        { label: t('achizitiiPublice') }
      ]} />
      <PageHeader titleKey="achizitiiPublice" icon="shoppingCart" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-8 p-4 bg-primary-50 rounded-xl">
              <span>Consultați anunțurile publice pe:</span>
              <a
                href="https://www.e-licitatie.ro"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary-700 hover:underline inline-flex items-center gap-1"
              >
                SEAP (e-licitatie.ro) <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <div className="space-y-3">
              {ACQUISITIONS.map((acq) => (
                <Card key={acq.id}>
                  <CardContent className="flex items-center justify-between pt-6">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={acq.status === 'activ' ? 'success' : 'default'}>
                          {acq.status === 'activ' ? 'Activ' : 'Finalizat'}
                        </Badge>
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(acq.date).toLocaleDateString('ro-RO')}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900">{acq.title}</h3>
                      <p className="text-sm text-primary-600">Valoare estimată: {acq.value}</p>
                    </div>
                    <button className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Download className="w-4 h-4" />
                      Detalii
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

