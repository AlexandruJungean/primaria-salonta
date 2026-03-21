import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { generatePageMetadata } from '@/lib/seo';
import { AdminEditButton } from '@/components/admin-edit-button';
import { getPageWithData } from '@/lib/supabase/services/pages';
import type { Locale } from '@/lib/seo/config';

interface CulturaData {
  personalities: { id: string; name: string; image: string }[];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'cultura',
    locale: locale as Locale,
    path: '/localitatea/cultura',
  });
}

export default async function CulturaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tPage = await getTranslations({ locale, namespace: 'culturaPage' });
  const page = await getPageWithData<CulturaData>('localitatea-cultura');
  const personalities = page?.structured_data?.personalities || [];

  return (
    <>
      <Breadcrumbs items={[
        { label: t('localitatea'), href: '/localitatea' },
        { label: t('cultura') }
      ]} />
      <PageHeader titleKey="cultura" icon="palette" />

      <Section background="white">
        <Container>
          <div className="prose prose-lg prose-gray max-w-5xl mx-auto mb-12">
            <p className="lead text-xl text-gray-600 mb-6">
              {tPage('intro')}
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">{tPage('personalitiesTitle')}</h2>
            <div className="grid md:grid-cols-3 gap-6 not-prose">
              {personalities.map((person) => (
                <div key={person.id} className="text-center group">
                  <div className="relative w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow">
                    <Image
                      src={person.image}
                      alt={person.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg">{person.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{tPage(`personalities.${person.id}`)}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>
      <AdminEditButton href="/admin/localitatea/cultura" />
    </>
  );
}
