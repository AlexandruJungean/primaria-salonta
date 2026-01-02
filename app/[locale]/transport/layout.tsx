import { generatePageMetadata } from '@/lib/seo/metadata';
import { type Locale } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'transport',
    locale: locale as Locale,
    path: '/transport',
  });
}

export default function TransportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

