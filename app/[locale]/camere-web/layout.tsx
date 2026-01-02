import { generatePageMetadata } from '@/lib/seo/metadata';
import { type Locale } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'camereWeb',
    locale: locale as Locale,
    path: '/camere-web',
  });
}

export default function CamereWebLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

