import { generatePageMetadata } from '@/lib/seo/metadata';
import { type Locale } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'pnrr',
    locale: locale as Locale,
    path: '/programe/pnrr',
  });
}

export default function PnrrLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

