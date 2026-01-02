import { generatePageMetadata } from '@/lib/seo/metadata';
import { type Locale } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'proiecteLocale',
    locale: locale as Locale,
    path: '/programe/proiecte-locale',
  });
}

export default function ProiecteLocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

