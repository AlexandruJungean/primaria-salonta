import { generatePageMetadata } from '@/lib/seo/metadata';
import { type Locale } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'stareCivila',
    locale: locale as Locale,
    path: '/stare-civila',
  });
}

export default function StareCivilaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

