import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Tag, Calendar, Download, MapPin, Banknote } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('publicatiiVanzare') };
}

// Mock data - will be replaced with database
const SALES = [
  {
    id: 1,
    date: '2025-12-15',
    title: 'Publicație de vânzare silită - Imobil str. Republicii nr. 25',
    type: 'imobil',
    location: 'Str. Republicii nr. 25',
    startPrice: '120.000 €',
    executor: 'BEJ Ionescu',
  },
  {
    id: 2,
    date: '2025-12-12',
    title: 'Publicație de vânzare silită - Autoturism marca BMW',
    type: 'mobil',
    location: 'Sediul BEJ Pop',
    startPrice: '8.500 €',
    executor: 'BEJ Pop',
  },
  {
    id: 3,
    date: '2025-12-08',
    title: 'Publicație de vânzare silită - Teren intravilan 500mp',
    type: 'teren',
    location: 'Str. Crișan nr. 15',
    startPrice: '25.000 €',
    executor: 'BEJ Mureșan',
  },
];

const TYPE_COLORS: Record<string, string> = {
  imobil: 'bg-blue-100 text-blue-700',
  mobil: 'bg-amber-100 text-amber-700',
  teren: 'bg-green-100 text-green-700',
};

const TYPE_LABELS: Record<string, string> = {
  imobil: 'Imobil',
  mobil: 'Bun mobil',
  teren: 'Teren',
};

export default function PublicatiiVanzarePage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('informatiiPublice'), href: '/informatii-publice' },
        { label: t('publicatiiVanzare') }
      ]} />
      <PageHeader titleKey="publicatiiVanzare" icon="tag" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-8">
              <p className="text-gray-700 text-sm">
                Publicațiile de vânzare sunt afișate în conformitate cu prevederile Codului de procedură civilă
                și cu solicitările birourilor executorilor judecătorești.
              </p>
            </div>

            <div className="space-y-4">
              {SALES.map((sale) => (
                <Card key={sale.id} hover>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                          <Tag className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={TYPE_COLORS[sale.type]}>
                              {TYPE_LABELS[sale.type]}
                            </Badge>
                            <span className="text-sm text-gray-500 flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(sale.date).toLocaleDateString('ro-RO')}
                            </span>
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-2">{sale.title}</h3>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {sale.location}
                            </span>
                            <span className="flex items-center gap-1 font-semibold text-primary-600">
                              <Banknote className="w-4 h-4" />
                              {sale.startPrice}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">Executor: {sale.executor}</p>
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

