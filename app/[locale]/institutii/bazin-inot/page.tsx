import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Waves, MapPin, Ticket, Thermometer, CheckCircle } from 'lucide-react';
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
    pageKey: 'bazinInot',
    locale: locale as Locale,
    path: '/institutii/bazin-inot',
  });
}

export default function BazinInotPage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('institutii'), href: '/institutii' },
        { label: t('bazinInot') }
      ]} />
      <PageHeader titleKey="bazinInot" icon="waves" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            {/* Opening Info */}
            <Card className="mb-8 bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Waves className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="font-semibold text-blue-900">Bazinul de înot al Municipiului Salonta</p>
                    <p className="text-blue-700 text-sm">Deschis din 11 aprilie 2023</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              {/* Images */}
              <div className="space-y-4">
                <div className="relative aspect-video rounded-xl overflow-hidden">
                  <Image
                    src="/images/bazin-de-inot-salonta-1.webp"
                    alt="Bazinul de Înot Salonta"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                <div className="relative aspect-video rounded-xl overflow-hidden">
                  <Image
                    src="/images/bazin-de-inot-salonta-2.webp"
                    alt="Bazinul de Înot Salonta"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>

              {/* Info Cards */}
              <div className="space-y-4">
                <Card>
                  <CardContent className="flex items-center gap-4 pt-6">
                    <MapPin className="w-5 h-5 text-blue-600 shrink-0" />
                    <span className="text-sm">Salonta, jud. Bihor</span>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex items-center gap-4 pt-6">
                    <Ticket className="w-5 h-5 text-blue-600 shrink-0" />
                    <span className="text-sm">Bilete și abonamente disponibile local</span>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex items-center gap-4 pt-6">
                    <Thermometer className="w-5 h-5 text-blue-600 shrink-0" />
                    <span className="text-sm font-medium">Saună finlandeză inclusă în dotare</span>
                  </CardContent>
                </Card>
                <Card className="bg-blue-50">
                  <CardContent className="pt-6">
                    <p className="text-blue-800 text-sm font-medium mb-2">Lecții de înot disponibile!</p>
                    <p className="text-blue-700 text-sm">Vă puteți înscrie la lecții de înot pentru toate vârstele.</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Benefits Section */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>De ce să alegeți înotul?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Apa este un mediu care ne oferă senzația unică de a pluti, la fel ca și cum am fi învăluiți în aer. Înotul ne oferă această senzație incredibilă de a ne simți fără greutate și de a ne mișca într-un spațiu care pare aproape lipsit de gravitație.
                </p>
                <p className="text-gray-600 mb-6">
                  Înotul este cel mai eficient și complex sport, datorită faptului că nu prezintă rezervele tipice majorității sporturilor. Fiind un sport fără vârstă, acesta poate fi practicat din prima zi de viață până în ultima, asigurând, prin eficiența și complexitatea sa, un climat favorabil menținerii sănătății.
                </p>

                <h3 className="font-semibold text-gray-900 mb-4">Beneficiile practicării înotului:</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-blue-600 shrink-0" />
                    <span className="text-sm text-gray-700">Buna dezvoltare a calităților motrice</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-blue-600 shrink-0" />
                    <span className="text-sm text-gray-700">Tonifierea întregii musculaturi</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-blue-600 shrink-0" />
                    <span className="text-sm text-gray-700">Sporirea capacității de coordonare</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-blue-600 shrink-0" />
                    <span className="text-sm text-gray-700">Eleganța în mișcări și postură</span>
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
