import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { AlertCircle, Calendar, Download, User } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('somatii') };
}

// Mock data - will be replaced with database
const SUMMONS = [
  {
    id: 1,
    date: '2025-12-15',
    title: 'Somație pentru plata impozitului pe clădiri',
    debtor: 'P*** I***',
    deadline: '2025-12-30',
    status: 'activ',
  },
  {
    id: 2,
    date: '2025-12-12',
    title: 'Somație pentru plata taxei de habitat',
    debtor: 'M*** A***',
    deadline: '2025-12-27',
    status: 'activ',
  },
  {
    id: 3,
    date: '2025-12-10',
    title: 'Somație pentru plata impozitului pe teren',
    debtor: 'C*** N***',
    deadline: '2025-12-25',
    status: 'expirat',
  },
];

export default function SomatiiPage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('informatiiPublice'), href: '/informatii-publice' },
        { label: t('somatii') }
      ]} />
      <PageHeader titleKey="somatii" icon="alertCircle" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-800 mb-1">Atenție!</h3>
                  <p className="text-red-700 text-sm">
                    Somațiile afișate pe site reprezintă ultima cale legală de comunicare a obligațiilor de plată,
                    după epuizarea celorlalte metode de notificare. Neplata în termenul indicat poate atrage
                    executarea silită și perceperea de penalități.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {SUMMONS.map((summon) => (
                <Card key={summon.id} hover className="border-l-4 border-l-red-400">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                          <AlertCircle className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={summon.status === 'activ' ? 'error' : 'secondary'}>
                              {summon.status === 'activ' ? 'Activ' : 'Expirat'}
                            </Badge>
                            <span className="text-sm text-gray-500 flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(summon.date).toLocaleDateString('ro-RO')}
                            </span>
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-2">{summon.title}</h3>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              Debitor: {summon.debtor}
                            </span>
                            <span className="text-red-600 font-medium">
                              Termen: {new Date(summon.deadline).toLocaleDateString('ro-RO')}
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

            <div className="mt-8 p-4 bg-gray-50 rounded-xl text-center">
              <p className="text-gray-600 text-sm">
                Pentru informații suplimentare sau pentru achitarea obligațiilor, vă rugăm să vă prezentați
                la Serviciul Impozite și Taxe Locale din cadrul Primăriei Municipiului Salonta.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

