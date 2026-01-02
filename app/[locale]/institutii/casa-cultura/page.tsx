import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Building, MapPin, Phone, Clock } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { generatePageMetadata, BreadcrumbJsonLd } from '@/lib/seo';
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
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <div className="relative aspect-video rounded-xl overflow-hidden mb-6">
                <Image
                  src="/images/casa-de-cultura-salonta-1.jpg"
                  alt="Casa de Cultură Zilahy Lajos"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              
              <div className="space-y-4">
                <Card>
                  <CardContent className="flex items-center gap-4 pt-6">
                    <MapPin className="w-5 h-5 text-primary-600" />
                    <span>Str. Republicii, Salonta</span>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex items-center gap-4 pt-6">
                    <Phone className="w-5 h-5 text-primary-600" />
                    <span>0259 373 XXX</span>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex items-center gap-4 pt-6">
                    <Clock className="w-5 h-5 text-primary-600" />
                    <span>Luni - Vineri: 8:00 - 16:00</span>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="prose prose-lg">
              <h2>Despre Casa de Cultură</h2>
              <p>
                Casa de Cultură &quot;Zilahy Lajos&quot; din Salonta este principala 
                instituție culturală a municipiului, găzduind evenimente culturale, 
                spectacole, concerte și expoziții.
              </p>

              <h2>Activități</h2>
              <ul>
                <li>Spectacole de teatru și dans</li>
                <li>Concerte și recitaluri</li>
                <li>Expoziții de artă</li>
                <li>Evenimente culturale și festivaluri</li>
                <li>Cursuri și ateliere artistice</li>
                <li>Conferințe și seminarii</li>
              </ul>

              <h2>Facilități</h2>
              <ul>
                <li>Sală de spectacole cu 300+ locuri</li>
                <li>Săli pentru evenimente și conferințe</li>
                <li>Spații pentru expoziții</li>
                <li>Dotări tehnice moderne</li>
              </ul>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

