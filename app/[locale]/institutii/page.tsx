import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Building, BookOpen, Landmark, Heart, Utensils, Users, Bird, Waves } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent, CardImage } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { Link } from '@/components/ui/link';
import { generatePageMetadata, BreadcrumbJsonLd } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'institutii',
    locale: locale as Locale,
    path: '/institutii',
  });
}

const INSTITUTIONS = [
  { id: 'casaCultura', href: '/institutii/casa-cultura', icon: Building, image: '/images/casa-de-cultura-salonta-1.jpg' },
  { id: 'biblioteca', href: '/institutii/biblioteca', icon: BookOpen, image: '/images/primaria-salonta-1.jpg' },
  { id: 'muzeu', href: '/institutii/muzeu', icon: Landmark, image: '/images/muzeu-salonta.jpg' },
  { id: 'asistentaMedicala', href: '/institutii/asistenta-medicala', icon: Heart, image: null },
  { id: 'cantinaSociala', href: '/institutii/cantina-sociala', icon: Utensils, image: null },
  { id: 'centrulZi', href: '/institutii/centrul-de-zi', icon: Users, image: null },
  { id: 'cuibulDropiei', href: '/institutii/cuibul-dropiei', icon: Bird, image: null },
  { id: 'bazinInot', href: '/institutii/bazin-inot', icon: Waves, image: '/images/bazin-de-inot-salonta-1.jpeg' },
];

export default function InstitutiiPage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[{ label: t('institutii') }]} />
      <PageHeader titleKey="institutii" icon="building" />

      <Section background="white">
        <Container>
          <p className="text-xl text-gray-600 mb-8 text-center max-w-3xl mx-auto">
            Primăria Municipiului Salonta coordonează activitatea mai multor 
            instituții subordonate care oferă servicii culturale, sociale și 
            de agrement pentru comunitate.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {INSTITUTIONS.map((inst) => {
              const Icon = inst.icon;
              return (
                <Link key={inst.id} href={inst.href}>
                  <Card hover className="h-full overflow-hidden">
                    {inst.image ? (
                      <CardImage>
                        <Image
                          src={inst.image}
                          alt={t(inst.id)}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </CardImage>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center">
                        <Icon className="w-16 h-16 text-primary-300" />
                      </div>
                    )}
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-primary-700" />
                        </div>
                        <h3 className="font-semibold text-gray-900">{t(inst.id)}</h3>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </Container>
      </Section>
    </>
  );
}

