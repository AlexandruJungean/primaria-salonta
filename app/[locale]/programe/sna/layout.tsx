import { generatePageMetadata } from '@/lib/seo/metadata';
import { type Locale } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'sna',
    locale: locale as Locale,
    path: '/programe/sna',
  });
}

export default function SNALayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

