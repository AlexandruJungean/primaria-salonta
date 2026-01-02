import { generatePageMetadata } from '@/lib/seo/metadata';
import { type Locale } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'sanatate',
    locale: locale as Locale,
    path: '/sanatate',
  });
}

export default function SanatateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

