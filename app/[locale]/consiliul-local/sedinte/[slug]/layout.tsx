import { generatePageMetadata } from '@/lib/seo/metadata';
import type { Locale } from '@/lib/seo/config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  
  // Custom metadata based on slug - will be replaced with database query
  const customTitle = {
    ro: 'Ședință Consiliul Local',
    hu: 'Helyi Tanács ülése',
    en: 'Local Council Session',
  }[locale as Locale] || 'Local Council Session';

  return generatePageMetadata({
    pageKey: 'consiliulLocal',
    locale: locale as Locale,
    path: `/consiliul-local/sedinte/${slug}`,
    customTitle,
  });
}

export default function SedintaSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

