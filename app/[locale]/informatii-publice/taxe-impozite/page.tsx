import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Receipt, Download, CreditCard, Calculator } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { Link } from '@/components/ui/link';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('taxeImpozite') };
}

export default function TaxeImpozitePage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('informatiiPublice'), href: '/informatii-publice' },
        { label: t('taxeImpozite') }
      ]} />
      <PageHeader titleKey="taxeImpozite" icon="receipt" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            {/* Quick access to online payment */}
            <Card className="bg-primary-50 border-primary-200 mb-8">
              <CardContent className="flex items-center justify-between pt-6">
                <div className="flex items-center gap-4">
                  <CreditCard className="w-10 h-10 text-primary-700" />
                  <div>
                    <h3 className="font-semibold text-primary-900">Plătește online</h3>
                    <p className="text-sm text-primary-700">Taxe și impozite locale</p>
                  </div>
                </div>
                <Link 
                  href="/servicii-online/plati"
                  className="px-4 py-2 bg-primary-900 text-white rounded-lg hover:bg-primary-800"
                >
                  Plăți online
                </Link>
              </CardContent>
            </Card>

            <div className="prose prose-lg mb-8">
              <h2>Impozite și taxe locale 2025</h2>
              <p>
                Nivelurile impozitelor și taxelor locale pentru anul 2025 au fost 
                stabilite prin HCL nr. XX/2024, în conformitate cu Codul Fiscal.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-primary-600" />
                    Impozit clădiri
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>Persoane fizice: 0.1% din valoarea impozabilă</li>
                    <li>Persoane juridice: 0.5% - 1.3%</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-primary-600" />
                    Impozit teren
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>Intravilan: în funcție de zonă și categorie</li>
                    <li>Extravilan: conform categoriei de folosință</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="flex items-center justify-between pt-6">
                <div>
                  <h4 className="font-semibold text-gray-900">Regulament taxe și impozite 2025</h4>
                  <p className="text-sm text-gray-500">HCL nr. XX/2024</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Download className="w-4 h-4" />
                  Descarcă
                </button>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>
    </>
  );
}

