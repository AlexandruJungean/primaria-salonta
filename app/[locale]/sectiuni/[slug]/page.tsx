import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { Link } from '@/components/ui/link';
import { AdminEditButton } from '@/components/admin-edit-button';
import { AddPageCard } from '@/components/add-page-card';
import { getNavPagesBySection, getNavSectionBySlug } from '@/lib/supabase/services/navigation';
import { getIcon } from '@/lib/constants/icon-map';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const section = await getNavSectionBySlug(slug);
  if (!section) return { title: 'Not Found' };
  return {
    title: section.title,
    description: section.description || section.title,
  };
}

export default async function CustomSectionPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const section = await getNavSectionBySlug(slug);

  if (!section) {
    notFound();
  }

  const pages = await getNavPagesBySection(slug);

  return (
    <>
      <Breadcrumbs items={[{ label: section.title }]} />
      <PageHeader titleKey={section.title} icon={section.icon} useRawTitle />

      <Section background="white">
        <Container>
          {section.description && (
            <p className="text-lg text-gray-600 mb-8 text-center max-w-3xl mx-auto">
              {section.description}
            </p>
          )}

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
            <AddPageCard adminHref={section.admin_path} />
          </div>

          {pages.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Nu există pagini în această secțiune.
            </div>
          )}
        </Container>
      </Section>
      <AdminEditButton href={section.admin_path} />
    </>
  );
}
