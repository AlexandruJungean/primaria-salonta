import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Users, MapPin, Phone, Heart, Activity, MessageCircle, Facebook } from 'lucide-react';
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
    pageKey: 'centrulDeZi',
    locale: locale as Locale,
    path: '/institutii/centrul-de-zi',
  });
}

export default function CentrulZiPage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('institutii'), href: '/institutii' },
        { label: t('centrulZi') }
      ]} />
      <PageHeader titleKey="centrulZi" icon="users" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            {/* Info Banner */}
            <Card className="mb-8 bg-purple-50 border-purple-200">
              <CardContent className="pt-6">
                <p className="text-purple-800 text-sm">
                  <strong>Cod serviciu social:</strong> 8810CZ V-II | <strong>Certificat de acreditare:</strong> Seria AF nr. 005904
                </p>
              </CardContent>
            </Card>

            {/* Contact Cards */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardContent className="flex items-center gap-4 pt-6">
                  <MapPin className="w-5 h-5 text-purple-600 shrink-0" />
                  <span className="text-sm">Str. Ion Cantacuzino nr. 2-4, Salonta</span>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center gap-4 pt-6">
                  <Phone className="w-5 h-5 text-purple-600 shrink-0" />
                  <span className="text-sm">0770 427 288</span>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center gap-4 pt-6">
                  <Facebook className="w-5 h-5 text-purple-600 shrink-0" />
                  <a href="https://www.facebook.com/buniciicomunitatiisalonta" target="_blank" rel="noopener noreferrer" className="text-sm text-purple-600 hover:underline">
                    Facebook
                  </a>
                </CardContent>
              </Card>
            </div>

            {/* About */}
            <div className="prose prose-lg max-w-none mb-8">
              <h2>Despre Centrul de Zi</h2>
              <p>
                Serviciul social Centru de zi „Bunicii Comunității Salonta" este înființat și administrat de Primăria Municipiului Salonta – Direcția de Asistență Socială.
              </p>
              <p>
                Obiectul de activitate al centrului de zi îl constituie organizarea unor activități diverse, menite să susțină creșterea numărului de persoane care au depășit situația de vulnerabilitate, în urma participării la serviciile sociale oferite în cadrul centrului de zi.
              </p>
            </div>

            {/* Services Grid */}
            <h2 className="text-xl font-bold text-gray-900 mb-6">Servicii oferite</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader className="bg-purple-50">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Heart className="w-5 h-5 text-purple-600" />
                    Asistență socială
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Consiliere socială</li>
                    <li>• Sesiuni de informare pe diverse teme</li>
                    <li>• Suport emoțional</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="bg-blue-50">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MessageCircle className="w-5 h-5 text-blue-600" />
                    Consiliere psihologică
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Consiliere individuală</li>
                    <li>• Consiliere de grup</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="bg-green-50">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Activity className="w-5 h-5 text-green-600" />
                    Terapii și relaxare
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Gimnastică individuală</li>
                    <li>• Gimnastică de grup</li>
                    <li>• Terapii de relaxare</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="bg-amber-50">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="w-5 h-5 text-amber-600" />
                    Socializare și recreere
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Activități de socializare și petrecere a timpului liber</li>
                    <li>• Jocuri de societate</li>
                    <li>• Bibliotecă</li>
                    <li>• Ieșiri în aer liber, excursii</li>
                    <li>• Diverse evenimente</li>
                    <li>• Acompaniere la evenimente socio-culturale din comunitate</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
