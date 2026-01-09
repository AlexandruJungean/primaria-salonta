import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Heart, MapPin, Phone, User, Users, FileText } from 'lucide-react';
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
    pageKey: 'asistentaMedicala',
    locale: locale as Locale,
    path: '/institutii/asistenta-medicala',
  });
}

export default function AsistentaMedicalaPage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('institutii'), href: '/institutii' },
        { label: t('asistentaMedicala') }
      ]} />
      <PageHeader titleKey="asistentaMedicala" icon="heart" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            {/* Title Card */}
            <Card className="mb-8 bg-rose-50 border-rose-200">
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold text-rose-900">
                  Unitatea de Asistență Medico-Socială Salonta
                </h2>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="flex items-center gap-4 pt-6">
                  <MapPin className="w-5 h-5 text-rose-600 shrink-0" />
                  <span className="text-sm">Str. I.C. Cantacuzino 2-4, Salonta</span>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center gap-4 pt-6">
                  <Phone className="w-5 h-5 text-rose-600 shrink-0" />
                  <span className="text-sm">0259-406135</span>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center gap-4 pt-6">
                  <Users className="w-5 h-5 text-rose-600 shrink-0" />
                  <span className="text-sm">Capacitate: 44 bolnavi</span>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center gap-4 pt-6">
                  <Heart className="w-5 h-5 text-rose-600 shrink-0" />
                  <span className="text-sm">Îngrijire non-stop</span>
                </CardContent>
              </Card>
            </div>

            {/* Staff */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-rose-600" />
                  Conducere și personal medical
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Director</p>
                    <p className="font-semibold text-gray-900">Varga Anikó</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Medic</p>
                    <p className="font-semibold text-gray-900">Dr. Paul Gavril Vasile</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Services */}
            <div className="prose prose-lg max-w-none mb-8">
              <h2>Despre instituție</h2>
              <p>
                Unitatea de Asistență Medico-Socială din Salonta oferă servicii 
                de îngrijire medicală și asistență socială pentru persoane vârstnice 
                și persoane cu dizabilități.
              </p>

              <h2>Servicii oferite</h2>
              <ul>
                <li>Îngrijire medicală permanentă</li>
                <li>Asistență socială</li>
                <li>Cazare și masă</li>
                <li>Activități de recuperare și socializare</li>
                <li>Consiliere psihologică</li>
              </ul>
            </div>

            {/* Documents Note */}
            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <FileText className="w-6 h-6 text-gray-400 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Acte necesare pentru internare</h3>
                    <p className="text-gray-600 text-sm">
                      Pentru informații despre actele necesare pentru internare, vă rugăm să contactați instituția la numărul de telefon afișat.
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
