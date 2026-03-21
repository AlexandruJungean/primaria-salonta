import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { CustomPageRenderer } from '@/components/pages/custom-page-renderer';
import { AdminEditButton } from '@/components/admin-edit-button';
import { getPageBySlug } from '@/lib/supabase/services/pages';
import { getNavPageByPageId } from '@/lib/supabase/services/navigation';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    return { title: 'Not Found' };
  }

  return {
    title: page.meta_title || page.title,
    description: page.meta_description || page.title,
  };
}

export default async function CustomPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  const navPage = await getNavPageByPageId(page.id);
  const sectionTitle = navPage?.nav_sections?.title;
  const sectionSlug = navPage?.nav_sections?.slug;
  const sectionPublicPath = sectionSlug ? `/${sectionSlug}` : undefined;

  const blocks = (page.structured_data as { blocks?: unknown[] })?.blocks || [];

  return (
    <>
      <Breadcrumbs
        items={[
          ...(sectionTitle && sectionPublicPath
            ? [{ label: sectionTitle, href: sectionPublicPath }]
            : []),
          { label: page.title },
        ]}
      />
      <PageHeader
        titleKey={page.title}
        icon={navPage?.icon || 'fileText'}
        useRawTitle
      />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <CustomPageRenderer blocks={blocks as Parameters<typeof CustomPageRenderer>[0]['blocks']} />
          </div>
        </Container>
      </Section>

      {navPage && (
        <AdminEditButton href={`/admin/pagini-custom/${page.id}`} />
      )}
    </>
  );
}
