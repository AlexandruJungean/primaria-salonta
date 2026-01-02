import { generatePageMetadata } from '@/lib/seo/metadata';
import { type Locale } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'agentiEconomici',
    locale: locale as Locale,
    path: '/agenti-economici',
  });
}

export default function AgentiEconomiciLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

