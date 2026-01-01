import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Wheat, Calendar, Download, MapPin, Ruler } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('oferteTerenuri') };
}

// Mock data - will be replaced with database
const LAND_OFFERS = [
  {
    id: 1,
    date: '2025-12-15',
    title: 'Ofertă vânzare teren arabil - Tarlaua 45',
    location: 'Extravilan Salonta, Tarlaua 45',
    surface: '2.5 ha',
    price: '35.000 €',
    status: 'activ',
  },
  {
    id: 2,
    date: '2025-12-10',
    title: 'Ofertă vânzare teren agricol - Zona Vest',
    location: 'Extravilan Salonta, Zona Vest',
    surface: '1.2 ha',
    price: '18.000 €',
    status: 'activ',
  },
  {
    id: 3,
    date: '2025-12-05',
    title: 'Ofertă vânzare pășune - Tarlaua 12',
    location: 'Extravilan Salonta, Tarlaua 12',
    surface: '5.0 ha',
    price: '45.000 €',
    status: 'expirat',
  },
];

export default function OferteTerenPage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('informatiiPublice'), href: '/informatii-publice' },
        { label: t('oferteTerenuri') }
      ]} />
      <PageHeader titleKey="oferteTerenuri" icon="wheat" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8">
              <p className="text-green-800 text-sm">
                <strong>Legea nr. 17/2014:</strong> Vânzarea terenurilor agricole situate în extravilan se face
                cu respectarea dreptului de preempțiune al coproprietarilor, arendașilor, vecinilor și statului român.
              </p>
            </div>

            <div className="space-y-4">
              {LAND_OFFERS.map((offer) => (
                <Card key={offer.id} hover>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                          <Wheat className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={offer.status === 'activ' ? 'success' : 'secondary'}>
                              {offer.status === 'activ' ? 'Activ' : 'Expirat'}
                            </Badge>
                            <span className="text-sm text-gray-500 flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(offer.date).toLocaleDateString('ro-RO')}
                            </span>
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-2">{offer.title}</h3>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {offer.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Ruler className="w-4 h-4" />
                              {offer.surface}
                            </span>
                            <span className="font-semibold text-green-600">
                              {offer.price}
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

