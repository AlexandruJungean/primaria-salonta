import { getTranslations } from 'next-intl/server';
import { User } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { generatePageMetadata } from '@/lib/seo';
import { AdminEditButton } from '@/components/admin-edit-button';
import { getPageWithData } from '@/lib/supabase/services/pages';
import type { Locale } from '@/lib/seo/config';

interface CetateniData {
  citizens: { name: string; year: string | null; description: string }[];
  procedure: string;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'cetateniDeOnoare',
    locale: locale as Locale,
    path: '/localitatea/cetateni-de-onoare',
  });
}

export default async function CetateniOnoarePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const page = await getPageWithData<CetateniData>('localitatea-cetateni-de-onoare');
  const citizens = page?.structured_data?.citizens || [];
  const procedure = page?.structured_data?.procedure || '';

  return (
    <>
      <Breadcrumbs items={[
        { label: t('localitatea'), href: '/localitatea' },
        { label: t('cetateniOnoare') }
      ]} />
      <PageHeader titleKey="cetateniOnoare" icon="award" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            {page?.content && (
              <p className="text-xl text-gray-600 mb-8 text-center">{page.content}</p>
            )}

            <div className="space-y-4">
              {citizens.map((citizen) => (
                <Card key={citizen.name}>
                  <CardContent className="flex items-start gap-4 pt-6">
                    <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                      <User className="w-8 h-8 text-primary-700" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{citizen.name}</h3>
                      {citizen.year && (
                        <p className="text-sm text-primary-600 font-medium">Acordat în {citizen.year}</p>
                      )}
                      <p className="text-gray-600 mt-2">{citizen.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {procedure && (
              <div className="mt-12 p-6 bg-amber-50 rounded-xl border border-amber-200">
                <h2 className="text-xl font-semibold text-amber-900 mb-4">Procedura de acordare</h2>
                <p className="text-amber-800">{procedure}</p>
              </div>
            )}
          </div>
        </Container>
      </Section>
      <AdminEditButton href="/admin/localitatea/cetateni-de-onoare" />
    </>
  );
}
