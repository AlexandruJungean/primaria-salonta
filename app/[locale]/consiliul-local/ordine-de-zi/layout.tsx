import { generatePageMetadata } from '@/lib/seo/metadata';
import { type Locale } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'ordineDeZi',
    locale: locale as Locale,
    path: '/consiliul-local/ordine-de-zi',
  });
}

export default function OrdineDeZiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

