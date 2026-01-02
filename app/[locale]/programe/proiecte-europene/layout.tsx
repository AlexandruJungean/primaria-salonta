import { generatePageMetadata } from '@/lib/seo/metadata';
import { type Locale } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'proiecteEuropene',
    locale: locale as Locale,
    path: '/programe/proiecte-europene',
  });
}

export default function ProiecteEuropeneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

