import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Utensils, MapPin, Phone, Mail, User, FileText } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'cantinaSociala',
    locale: locale as Locale,
    path: '/institutii/cantina-sociala',
  });
}

export default function CantinaSocialaPage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('institutii'), href: '/institutii' },
        { label: t('cantinaSociala') }
      ]} />
      <PageHeader titleKey="cantinaSociala" icon="utensils" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            {/* CIF Info */}
            <Card className="mb-8 bg-orange-50 border-orange-200">
              <CardContent className="pt-6">
                <p className="text-orange-800 text-sm">
                  <strong>Cod de identificare fiscală:</strong> 18748960
                </p>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="flex items-center gap-4 pt-6">
                  <MapPin className="w-5 h-5 text-orange-600 shrink-0" />
                  <span className="text-sm">Str. Prof. dr. Ion Cantacuzino nr. 2-4, Salonta</span>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center gap-4 pt-6">
                  <Phone className="w-5 h-5 text-orange-600 shrink-0" />
                  <span className="text-sm">0721 509 630</span>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center gap-4 pt-6">
                  <Mail className="w-5 h-5 text-orange-600 shrink-0" />
                  <a href="mailto:csalonta@yahoo.com" className="text-sm text-orange-600 hover:underline">csalonta@yahoo.com</a>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center gap-4 pt-6">
                  <User className="w-5 h-5 text-orange-600 shrink-0" />
                  <div className="text-sm">
                    <p className="text-gray-500">Director</p>
                    <p className="font-medium">Varga Anikó</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* About */}
            <div className="prose prose-lg max-w-none mb-8">
              <h2>Despre Cantina Socială</h2>
              <p>
                Cantina Socială din Salonta oferă mese gratuite sau la prețuri 
                reduse pentru persoanele aflate în situații de dificultate socială.
              </p>

              <h2>Beneficiari</h2>
              <ul>
                <li>Persoane fără venituri sau cu venituri reduse</li>
                <li>Persoane fără adăpost</li>
                <li>Persoane vârstnice singure</li>
                <li>Familii cu mulți copii aflate în dificultate</li>
                <li>Persoane cu dizabilități</li>
              </ul>

              <h2>Servicii oferite</h2>
              <ul>
                <li>Masă caldă zilnic (prânz)</li>
                <li>Distribuire alimente</li>
                <li>Consiliere socială</li>
              </ul>

              <h2>Înscriere</h2>
              <p>
                Pentru a beneficia de serviciile Cantinei Sociale, este necesară 
                o evaluare socială realizată de Direcția de Asistență Socială. 
                Actele necesare pot fi depuse la sediul Primăriei.
              </p>
            </div>

            {/* Declarations Note */}
            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <FileText className="w-6 h-6 text-gray-400 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Declarații de avere și interese</h3>
                    <p className="text-gray-600 text-sm">
                      Declarațiile de avere și interese ale conducerii sunt disponibile conform legii la sediul instituției.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>
    </>
  );
}
