import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { HardHat, Calendar, Download, MapPin, CheckCircle } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('receptieLucrari') };
}

// Mock data - will be replaced with database
const RECEPTIONS = [
  {
    id: 1,
    date: '2025-12-15',
    title: 'Recepție lucrări - Construire locuință P+1',
    location: 'Str. Republicii nr. 45',
    beneficiary: 'Pop Alexandru',
    type: 'finala',
  },
  {
    id: 2,
    date: '2025-12-12',
    title: 'Recepție lucrări - Extindere spațiu comercial',
    location: 'Str. Libertății nr. 12',
    beneficiary: 'SC Example SRL',
    type: 'finala',
  },
  {
    id: 3,
    date: '2025-12-10',
    title: 'Recepție la terminarea lucrărilor - Modernizare imobil',
    location: 'Str. Crișan nr. 8',
    beneficiary: 'Kovács Tibor',
    type: 'terminare',
  },
];

export default function ReceptieLucrariPage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('informatiiPublice'), href: '/informatii-publice' },
        { label: t('receptieLucrari') }
      ]} />
      <PageHeader titleKey="receptieLucrari" icon="hardHat" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
              <p className="text-blue-800 text-sm">
                Conform legislației în vigoare, recepția lucrărilor de construcții se efectuează la terminarea
                lucrărilor și la expirarea perioadei de garanție prevăzute în contract.
              </p>
            </div>

            <div className="space-y-4">
              {RECEPTIONS.map((reception) => (
                <Card key={reception.id} hover>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                          <HardHat className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={reception.type === 'finala' ? 'success' : 'default'}>
                              {reception.type === 'finala' ? 'Recepție finală' : 'La terminare'}
                            </Badge>
                            <span className="text-sm text-gray-500 flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(reception.date).toLocaleDateString('ro-RO')}
                            </span>
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-2">{reception.title}</h3>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {reception.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              {reception.beneficiary}
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

