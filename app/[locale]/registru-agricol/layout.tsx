import { generatePageMetadata } from '@/lib/seo/metadata';
import { type Locale } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'registruAgricol',
    locale: locale as Locale,
    path: '/registru-agricol',
  });
}

export default function RegistruAgricolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

