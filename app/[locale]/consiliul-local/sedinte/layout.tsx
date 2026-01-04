import { generatePageMetadata } from '@/lib/seo/metadata';
import type { Locale } from '@/lib/seo/config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'consiliulLocal',
    locale: locale as Locale,
    path: '/consiliul-local/sedinte',
  });
}

export default function SedinteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

