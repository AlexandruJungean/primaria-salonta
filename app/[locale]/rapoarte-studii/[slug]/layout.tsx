import { generatePageMetadata } from '@/lib/seo/metadata';
import type { Locale } from '@/lib/seo/config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  
  // Custom metadata based on slug - will be replaced with database query
  const customTitle = {
    ro: 'Raport / Studiu',
    hu: 'Jelentés / Tanulmány',
    en: 'Report / Study',
  }[locale as Locale] || 'Report / Study';

  return generatePageMetadata({
    pageKey: 'rapoarteStudii',
    locale: locale as Locale,
    path: `/rapoarte-studii/${slug}`,
    customTitle,
  });
}

export default function RaportStudiuSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

