import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { Link } from '@/components/ui/link';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { AdminEditButton } from '@/components/admin-edit-button';
import { AddPageCard } from '@/components/add-page-card';
import { getNavPagesBySection } from '@/lib/supabase/services/navigation';
import { getIcon } from '@/lib/constants/icon-map';
import { type Locale } from '@/i18n/routing';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'serviciiOnline',
    locale: locale as Locale,
    path: '/servicii-online',
  });
}

export default async function ServiciiOnlinePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const pages = await getNavPagesBySection('servicii-online');

  return (
    <>
      <Breadcrumbs items={[{ label: t('serviciiOnline') }]} />
      <PageHeader titleKey="serviciiOnline" icon="creditCard" />

      <Section background="white">
        <Container>
          <p className="text-lg text-gray-600 mb-8 text-center max-w-3xl mx-auto">
            Accesează serviciile online ale Primăriei Municipiului Salonta pentru a economisi timp și a rezolva cererile mai rapid.
          </p>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {pages.map((page) => {
              const Icon = getIcon(page.icon);
              return (
                <Link key={page.id} href={page.public_path || '#'}>
                  <Card hover className="h-full">
                    <CardContent className="flex items-center gap-4 pt-6">
                      <div className="w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
                        <Icon className="w-7 h-7 text-primary-700" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{page.title}</h3>
                        {page.description && (
                          <p className="text-sm text-gray-500 mt-1">{page.description}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
            <AddPageCard adminHref="/admin/servicii-online" />
          </div>
        </Container>
      </Section>
      <AdminEditButton href="/admin/servicii-online" />
    </>
  );
}
