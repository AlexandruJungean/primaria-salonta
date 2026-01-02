import { Metadata } from 'next';
import { SEO_CONFIG } from '@/lib/seo/config';

// Dynamic metadata will be generated client-side for news articles
// This provides default metadata and allows for future server-side implementation
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  
  // Default metadata for news articles
  // In production, this would fetch the article from database
  const baseUrl = SEO_CONFIG.siteUrl;
  const url = `${baseUrl}/${locale}/stiri/${slug}`;
  
  return {
    title: 'Știri | Primăria Salonta',
    description: 'Știri și anunțuri de la Primăria Municipiului Salonta',
    alternates: {
      canonical: url,
      languages: {
        'ro': `${baseUrl}/ro/stiri/${slug}`,
        'hu': `${baseUrl}/hu/stiri/${slug}`,
        'en': `${baseUrl}/en/stiri/${slug}`,
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

export default function StiriSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

