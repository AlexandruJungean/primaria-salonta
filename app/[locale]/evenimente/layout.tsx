import { generatePageMetadata } from '@/lib/seo/metadata';
import { type Locale } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'evenimente',
    locale: locale as Locale,
    path: '/evenimente',
  });
}

export default function EvenimenteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

