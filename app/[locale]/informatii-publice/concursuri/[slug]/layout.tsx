import { generatePageMetadata } from '@/lib/seo/metadata';
import type { Locale } from '@/lib/seo/config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'carieraConcursuri',
    locale: locale as Locale,
    path: '/informatii-publice/concursuri',
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

