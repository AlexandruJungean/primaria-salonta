import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { Link } from '@/components/ui/link';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { WebPageJsonLd } from '@/lib/seo/json-ld';
import { AdminEditButton } from '@/components/admin-edit-button';
import { getNavPagesBySection } from '@/lib/supabase/services/navigation';
import { getIcon } from '@/lib/constants/icon-map';
import { type Locale } from '@/i18n/routing';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'rapoarteStudii',
    locale: locale as Locale,
    path: '/rapoarte-studii',
  });
}

export default async function RapoarteStudiiPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tp = await getTranslations({ locale, namespace: 'rapoarteStudiiPage' });
  const pages = await getNavPagesBySection('rapoarte-studii');

  return (
    <>
      <WebPageJsonLd
        title="Rapoarte și Studii"
        description="Rapoarte de audit și studii ale Primăriei Municipiului Salonta"
        url="/rapoarte-studii"
      />
      <Breadcrumbs items={[{ label: t('rapoarteStudii') }]} />
      <PageHeader titleKey="rapoarteStudii" icon="fileSearch" />

      <Section background="white">
        <Container>
          <p className="text-lg text-gray-600 mb-8 text-center max-w-3xl mx-auto">
            {tp('description')}
          </p>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
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
      <AdminEditButton href="/admin/rapoarte-studii" />
    </>
  );
}
