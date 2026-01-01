import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Radio, Calendar, Download, MapPin, Building2 } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('reteleTelecom') };
}

// Mock data - will be replaced with database
const AUTHORIZATIONS = [
  {
    id: 1,
    date: '2025-12-10',
    title: 'Autorizație construire stație de bază telecomunicații',
    operator: 'Orange România',
    location: 'Str. Republicii nr. 100',
    status: 'aprobat',
  },
  {
    id: 2,
    date: '2025-11-28',
    title: 'Autorizație extindere rețea fibră optică',
    operator: 'Digi Communications',
    location: 'Zona Industrială',
    status: 'aprobat',
  },
  {
    id: 3,
    date: '2025-11-15',
    title: 'Solicitare amplasare antenă telecomunicații',
    operator: 'Vodafone România',
    location: 'Str. Crișan nr. 45',
    status: 'in_analiza',
  },
];

export default function ReteleTelecomPage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('informatiiPublice'), href: '/informatii-publice' },
        { label: t('reteleTelecom') }
      ]} />
      <PageHeader titleKey="reteleTelecom" icon="radio" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-8">
              <p className="text-indigo-800 text-sm">
                Conform Legii nr. 154/2012 privind regimul infrastructurii rețelelor de comunicații electronice,
                autorizațiile pentru amplasarea echipamentelor de telecomunicații se emit de către autoritatea
                administrației publice locale.
              </p>
            </div>

            <div className="space-y-4">
              {AUTHORIZATIONS.map((auth) => (
                <Card key={auth.id} hover>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                          <Radio className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={auth.status === 'aprobat' ? 'success' : 'warning'}>
                              {auth.status === 'aprobat' ? 'Aprobat' : 'În analiză'}
                            </Badge>
                            <span className="text-sm text-gray-500 flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(auth.date).toLocaleDateString('ro-RO')}
                            </span>
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-2">{auth.title}</h3>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Building2 className="w-4 h-4" />
                              {auth.operator}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {auth.location}
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

