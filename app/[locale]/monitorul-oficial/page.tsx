import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { Link } from '@/components/ui/link';
import { generatePageMetadata, BreadcrumbJsonLd } from '@/lib/seo';
import { AdminEditButton } from '@/components/admin-edit-button';
import { getNavPagesBySection } from '@/lib/supabase/services/navigation';
import { getIcon } from '@/lib/constants/icon-map';
import type { Locale } from '@/lib/seo/config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'monitorulOficial',
    locale: locale as Locale,
    path: '/monitorul-oficial',
  });
}

export default async function MonitorulOficialPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const pages = await getNavPagesBySection('monitorul-oficial');

  return (
    <>
      <Breadcrumbs items={[{ label: t('monitorulOficial') }]} />
      <PageHeader titleKey="monitorulOficial" icon="scrollText" />

      <Section background="white">
        <Container>
          <p className="text-lg text-gray-600 mb-8 text-center max-w-3xl mx-auto">
            Monitorul Oficial Local al Municipiului Salonta cuprinde actele 
            administrative cu caracter normativ emise de autoritățile locale.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pages.map((page) => {
              const Icon = getIcon(page.icon);
              return (
                <Link key={page.id} href={page.public_path || '#'}>
                  <Card hover className="h-full">
                    <CardContent className="flex items-center gap-4 pt-6">
                      <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                        <Icon className="w-6 h-6 text-primary-700" />
                      </div>
                      <h3 className="font-semibold text-gray-900">{page.title}</h3>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </Container>
      </Section>
      <AdminEditButton href="/admin/monitorul-oficial" />
    </>
  );
}
