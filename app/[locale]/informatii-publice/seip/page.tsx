import { Info } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { SeipCollapsibleSections } from './collapsible-sections';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';
import { getTranslations } from 'next-intl/server';
import { getPageContent } from '@/lib/supabase/services/page-content';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'seip',
    locale: locale as Locale,
    path: '/informatii-publice/seip',
  });
}

export default async function SeipPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  
  // Fetch editable content from database
  const content = await getPageContent('seip');
  
  // Get intro content with fallbacks
  const introTitle = content['intro_title'] || 'Serviciul Public Comunitar de Evidență Informatizată a Persoanei';
  const introDescription = content['intro_description'] || 'A fost înființat prin HCL nr.6/2005 sub autoritatea Consiliului local și se află sub coordonarea secretarului municipiului.';
  const introLocation = content['intro_location'] || 'Formularele și lista documentelor necesare eliberării actelor în această materie se găsesc la sediul Primăriei, cam.5 parter.';

  return (
    <>
      <Breadcrumbs items={[
        { label: t('informatiiPublice'), href: '/informatii-publice' },
        { label: t('seip') }
      ]} />
      <PageHeader titleKey="seip" icon="network" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            {/* Info Banner - Editable from database */}
            <Card className="mb-8 border-primary-200 bg-gradient-to-r from-primary-50 to-blue-50">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
                    <Info className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{introTitle}</h2>
                    <p className="text-gray-700 mb-4">{introDescription}</p>
                    <p className="text-sm text-gray-600">{introLocation}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Departments with Collapsible Sections */}
            <SeipCollapsibleSections />
          </div>
        </Container>
      </Section>
    </>
  );
}
