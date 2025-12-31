import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { LayoutGrid, Download } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('organigrama') };
}

export default function OrganigramaPage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('primaria'), href: '/primaria' },
        { label: t('organigrama') }
      ]} />
      <PageHeader titleKey="organigrama" icon="layoutGrid" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            <p className="text-lg text-gray-600 mb-8 text-center">
              Structura organizatorică a Primăriei Municipiului Salonta
            </p>

            {/* Simplified org chart */}
            <div className="space-y-6">
              {/* Top level */}
              <div className="flex justify-center">
                <Card className="bg-primary-900 text-white">
                  <CardContent className="text-center pt-6 px-8">
                    <h3 className="font-bold text-lg">PRIMAR</h3>
                    <p className="text-primary-200 text-sm">Török László</p>
                  </CardContent>
                </Card>
              </div>

              {/* Second level */}
              <div className="flex justify-center gap-8">
                <Card className="bg-primary-700 text-white">
                  <CardContent className="text-center pt-6 px-6">
                    <h3 className="font-bold">VICEPRIMAR</h3>
                    <p className="text-primary-200 text-sm">Horváth János</p>
                  </CardContent>
                </Card>
                <Card className="bg-primary-700 text-white">
                  <CardContent className="text-center pt-6 px-6">
                    <h3 className="font-bold">SECRETAR GENERAL</h3>
                    <p className="text-primary-200 text-sm">-</p>
                  </CardContent>
                </Card>
              </div>

              {/* Departments */}
              <div className="grid md:grid-cols-3 gap-4 mt-8">
                {[
                  'Serviciul Buget-Contabilitate',
                  'Serviciul Impozite și Taxe',
                  'Serviciul Urbanism',
                  'Serviciul Juridic',
                  'Serviciul Resurse Umane',
                  'Serviciul Relații cu Publicul',
                  'Serviciul Achiziții Publice',
                  'Serviciul Tehnic',
                  'Serviciul Social',
                ].map((dept, idx) => (
                  <Card key={idx}>
                    <CardContent className="text-center pt-4">
                      <p className="text-sm font-medium text-gray-700">{dept}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="mt-12 text-center">
              <Card className="bg-gray-50 inline-block">
                <CardContent className="flex items-center gap-4 pt-6">
                  <span className="text-gray-700">Descarcă organigrama completă</span>
                  <button className="flex items-center gap-2 px-4 py-2 bg-primary-900 text-white rounded-lg hover:bg-primary-800 transition-colors">
                    <Download className="w-4 h-4" />
                    PDF
                  </button>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

