import { generatePageMetadata } from '@/lib/seo/metadata';
import { type Locale } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'studii',
    locale: locale as Locale,
    path: '/rapoarte-studii/studii',
  });
}

export default function StudiiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

