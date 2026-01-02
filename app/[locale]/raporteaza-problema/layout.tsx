import { generatePageMetadata } from '@/lib/seo/metadata';
import { type Locale } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'raporteazaProblema',
    locale: locale as Locale,
    path: '/raporteaza-problema',
  });
}

export default function RaporteazaProblemaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

