import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Building, BookOpen, Landmark, Heart, Utensils, Users, Leaf, Waves } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent, CardImage } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { Link } from '@/components/ui/link';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';
import * as institutionsService from '@/lib/supabase/services/institutions';
import { translateContentArray } from '@/lib/google-translate/cache';

// Icon mapping
const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  building: Building,
  bookOpen: BookOpen,
  landmark: Landmark,
  heart: Heart,
  utensils: Utensils,
  users: Users,
  bird: Leaf,
  leaf: Leaf,
  waves: Waves,
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'institutii',
    locale: locale as Locale,
    path: '/institutii',
  });
}

export default async function InstitutiiPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  
  // Fetch institutions from database
  const institutionsData = await institutionsService.getAllInstitutions();
  
  // Translate content based on locale
  const institutions = await translateContentArray(
    institutionsData,
    ['name', 'short_description'],
    locale as 'ro' | 'hu' | 'en'
  );
  
  // Get localized intro text
  const introText = locale === 'hu' 
    ? 'Szalonta Önkormányzata több alárendelt intézmény tevékenységét koordinálja, amelyek kulturális, szociális és szabadidős szolgáltatásokat nyújtanak a közösség számára.'
    : locale === 'en'
    ? 'The Municipality of Salonta coordinates the activity of several subordinate institutions that provide cultural, social and leisure services for the community.'
    : 'Primăria Municipiului Salonta coordonează activitatea mai multor instituții subordonate care oferă servicii culturale, sociale și de agrement pentru comunitate.';

  return (
    <>
      <Breadcrumbs items={[{ label: t('institutii') }]} />
      <PageHeader titleKey="institutii" icon="building" />

      <Section background="white">
        <Container>
          <p className="text-xl text-gray-600 mb-8 text-center max-w-3xl mx-auto">
            {introText}
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {institutions.map((inst) => {
              const Icon = ICONS[inst.icon] || Building;
              
              return (
                <Link key={inst.id} href={`/institutii/${inst.slug}`}>
                  <Card hover className="h-full overflow-hidden">
                    {inst.image_url ? (
                      <CardImage>
                        <Image
                          src={inst.image_url}
                          alt={inst.name}
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
                        <div>
                          <h3 className="font-semibold text-gray-900">{inst.name}</h3>
                          {inst.short_description && (
                            <p className="text-sm text-gray-500 mt-1">{inst.short_description}</p>
                          )}
                        </div>
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
