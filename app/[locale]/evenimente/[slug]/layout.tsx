import { Metadata } from 'next';
import { SEO_CONFIG } from '@/lib/seo/config';

// Dynamic metadata will be generated client-side for event pages
// This provides default metadata and allows for future server-side implementation
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  
  // Default metadata for event pages
  // In production, this would fetch the event from database
  const baseUrl = SEO_CONFIG.siteUrl;
  const url = `${baseUrl}/${locale}/evenimente/${slug}`;
  
  return {
    title: 'Eveniment | Primăria Salonta',
    description: 'Detalii despre evenimentele organizate în Municipiul Salonta',
    alternates: {
      canonical: url,
      languages: {
        'ro': `${baseUrl}/ro/evenimente/${slug}`,
        'hu': `${baseUrl}/hu/evenimente/${slug}`,
        'en': `${baseUrl}/en/evenimente/${slug}`,
      },
    },
    openGraph: {
      type: 'article',
      url,
      siteName: 'Primăria Municipiului Salonta',
    },
    twitter: {
      card: 'summary_large_image',
    },
  };
}

export default function EvenimentSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

