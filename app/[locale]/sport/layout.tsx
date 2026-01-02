import { generatePageMetadata } from '@/lib/seo/metadata';
import { type Locale } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'sport',
    locale: locale as Locale,
    path: '/sport',
  });
}

export default function SportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

