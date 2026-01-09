import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Building, MapPin, Phone, User, FileText, Music, Theater, Palette } from 'lucide-react';
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
    pageKey: 'casaCultura',
    locale: locale as Locale,
    path: '/institutii/casa-cultura',
  });
}

export default function CasaCulturaPage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('institutii'), href: '/institutii' },
        { label: t('casaCultura') }
      ]} />
      <PageHeader titleKey="casaCultura" icon="building" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Left Column - Image and Contact */}
              <div>
                <div className="relative aspect-video rounded-xl overflow-hidden mb-6">
                  <Image
                    src="/images/casa-de-cultura-salonta-1.webp"
                    alt="Casa de Cultură Zilahy Lajos"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                
                <div className="space-y-4">
                  <Card>
                    <CardContent className="flex items-center gap-4 pt-6">
                      <MapPin className="w-5 h-5 text-purple-600" />
                      <span>Str. Iuliu Maniu nr. 10, Salonta</span>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="flex items-center gap-4 pt-6">
                      <Phone className="w-5 h-5 text-purple-600" />
                      <span>0259-373104</span>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="flex items-center gap-4 pt-6">
                      <User className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-sm text-gray-500">Director</p>
                        <p className="font-medium">Kovács István</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Right Column - Content */}
              <div>
                <div className="prose prose-lg mb-8">
                  <h2>Despre Casa de Cultură</h2>
                  <p>
                    Casa de Cultură „Zilahy Lajos" din Salonta este principala 
                    instituție culturală a municipiului, găzduind evenimente culturale, 
                    spectacole, concerte și expoziții.
                  </p>
                </div>

                {/* Activities */}
                <h3 className="font-semibold text-gray-900 mb-4">Activități</h3>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <Card className="bg-purple-50">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Theater className="w-5 h-5 text-purple-600" />
                        <span className="font-medium text-sm">Spectacole</span>
                      </div>
                      <p className="text-xs text-gray-600">Teatru și dans</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-blue-50">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Music className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-sm">Concerte</span>
                      </div>
                      <p className="text-xs text-gray-600">Muzică și recitaluri</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-50">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Palette className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-sm">Expoziții</span>
                      </div>
                      <p className="text-xs text-gray-600">Artă și cultură</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-amber-50">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Building className="w-5 h-5 text-amber-600" />
                        <span className="font-medium text-sm">Evenimente</span>
                      </div>
                      <p className="text-xs text-gray-600">Festivaluri și conferințe</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Facilities */}
                <div className="prose prose-lg">
                  <h3>Facilități</h3>
                  <ul>
                    <li>Sală de spectacole cu 300+ locuri</li>
                    <li>Săli pentru evenimente și conferințe</li>
                    <li>Spații pentru expoziții</li>
                    <li>Dotări tehnice moderne</li>
                  </ul>
                </div>

                {/* Declarations Note */}
                <Card className="mt-6 bg-gray-50 border-gray-200">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <FileText className="w-5 h-5 text-gray-400 shrink-0" />
                      <p className="text-gray-600 text-sm">
                        Declarațiile de avere și interese ale conducerii sunt disponibile conform legii la sediul instituției.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
