import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { Link } from '@/components/ui/link';
import { generatePageMetadata, BreadcrumbJsonLd } from '@/lib/seo';
import { AdminEditButton } from '@/components/admin-edit-button';
import { AddPageCard } from '@/components/add-page-card';
import { getNavPagesBySection } from '@/lib/supabase/services/navigation';
import { getIcon } from '@/lib/constants/icon-map';
import type { Locale } from '@/lib/seo/config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'transparenta',
    locale: locale as Locale,
    path: '/transparenta',
  });
}

export default async function TransparentaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const pages = await getNavPagesBySection('transparenta');

  return (
    <>
      <Breadcrumbs items={[{ label: t('transparenta') }]} />
      <PageHeader titleKey="transparenta" icon="eye" />

      <Section background="white">
        <Container>
          <p className="text-lg text-gray-600 mb-8 text-center max-w-3xl mx-auto">
            Transparența decizională - informații publice conform Legii 52/2003 
            și Legii 544/2001 privind accesul la informațiile de interes public.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {pages.map((page) => {
              const Icon = getIcon(page.icon);
              return (
                <Link key={page.id} href={page.public_path || '#'}>
                  <Card hover className="h-full">
                    <CardContent className="flex flex-col items-center text-center gap-4 pt-6">
                      <div className="w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center">
                        <Icon className="w-7 h-7 text-primary-700" />
                      </div>
                      <h3 className="font-semibold text-gray-900">{page.title}</h3>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
            <AddPageCard adminHref="/admin/transparenta" variant="centered" />
          </div>
        </Container>
      </Section>
      <AdminEditButton href="/admin/transparenta" />
    </>
  );
}
