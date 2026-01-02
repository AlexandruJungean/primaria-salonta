import { generatePageMetadata } from '@/lib/seo/metadata';
import { type Locale } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'petitiiOnline',
    locale: locale as Locale,
    path: '/servicii-online/petitii',
  });
}

export default function PetitiiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

