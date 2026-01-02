import { Metadata } from 'next';
import { SEO_CONFIG } from '@/lib/seo/config';

// Dynamic metadata for project detail pages
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; projectId: string }>;
}): Promise<Metadata> {
  const { locale, projectId } = await params;
  
  // Default metadata for project pages
  // In production, this would fetch the project from database
  const baseUrl = SEO_CONFIG.siteUrl;
  const url = `${baseUrl}/${locale}/programe/program-regional-nord-vest/${projectId}`;
  
  return {
    title: 'Proiect Regional Nord-Vest | Primăria Salonta',
    description: 'Detalii despre proiectele finanțate prin Programul Regional Nord-Vest în Municipiul Salonta',
    alternates: {
      canonical: url,
      languages: {
        'ro': `${baseUrl}/ro/programe/program-regional-nord-vest/${projectId}`,
        'hu': `${baseUrl}/hu/programe/program-regional-nord-vest/${projectId}`,
        'en': `${baseUrl}/en/programe/program-regional-nord-vest/${projectId}`,
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

export default function ProjectDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

