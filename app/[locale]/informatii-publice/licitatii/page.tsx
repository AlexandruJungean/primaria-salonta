import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Gavel, Calendar, Download, MapPin } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('licitatii') };
}

// Mock data - will be replaced with database
const AUCTIONS = [
  {
    id: 1,
    date: '2025-12-20',
    title: 'Licitație publică pentru închirierea spațiului comercial din Piața Centrală',
    location: 'Piața Centrală, nr. 5',
    startPrice: '500 lei/lună',
    status: 'activ',
  },
  {
    id: 2,
    date: '2025-12-18',
    title: 'Licitație publică pentru vânzarea autoturismului marca Dacia Logan',
    location: 'Sediul Primăriei',
    startPrice: '15.000 lei',
    status: 'activ',
  },
  {
    id: 3,
    date: '2025-12-10',
    title: 'Licitație publică pentru concesionarea terenului din zona industrială',
    location: 'Zona industrială, parcela 12',
    startPrice: '2.000 lei/an',
    status: 'finalizat',
  },
];

export default function LicitatiiPage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('informatiiPublice'), href: '/informatii-publice' },
        { label: t('licitatii') }
      ]} />
      <PageHeader titleKey="licitatii" icon="gavel" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
              <p className="text-amber-800 text-sm">
                <strong>Notă:</strong> Licitațiile publice se desfășoară la sediul Primăriei Municipiului Salonta.
                Pentru înscriere, vă rugăm să consultați documentele atașate fiecărei licitații.
              </p>
            </div>

            <div className="space-y-4">
              {AUCTIONS.map((auction) => (
                <Card key={auction.id} hover>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                          <Gavel className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={auction.status === 'activ' ? 'success' : 'default'}>
                              {auction.status === 'activ' ? 'Activ' : 'Finalizat'}
                            </Badge>
                            <span className="text-sm text-gray-500 flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(auction.date).toLocaleDateString('ro-RO')}
                            </span>
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-2">{auction.title}</h3>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {auction.location}
                            </span>
                            <span className="font-semibold text-primary-600">
                              Preț pornire: {auction.startPrice}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 shrink-0">
                        <Download className="w-4 h-4" />
                        Detalii
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

