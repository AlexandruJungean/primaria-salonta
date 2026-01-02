/**
 * SEO Metadata Utilities
 * Helper functions for generating consistent metadata across pages
 */

import { Metadata } from 'next';
import { SEO_CONFIG, PAGE_SEO, PageKey, Locale } from './config';

const baseUrl = SEO_CONFIG.siteUrl;

// ============================================
// GENERATE PAGE METADATA
// ============================================

interface GenerateMetadataOptions {
  pageKey?: PageKey;
  locale: Locale;
  customTitle?: string;
  customDescription?: string;
  customKeywords?: string;
  customImage?: string;
  path: string;
  noIndex?: boolean;
  article?: {
    publishedTime: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
}

export function generatePageMetadata({
  pageKey,
  locale,
  customTitle,
  customDescription,
  customKeywords,
  customImage,
  path,
  noIndex = false,
  article,
}: GenerateMetadataOptions): Metadata {
  // Get page-specific SEO or use custom values
  const pageSeo = pageKey ? PAGE_SEO[pageKey]?.[locale] : null;
  
  const title = customTitle || pageSeo?.title || SEO_CONFIG.siteName[locale];
  const description = customDescription || pageSeo?.description || '';
  const keywords = customKeywords || pageSeo?.keywords || '';
  const image = customImage || SEO_CONFIG.images.ogImage;
  
  const url = `${baseUrl}/${locale}${path}`;
  const ogLocale = locale === 'ro' ? 'ro_RO' : locale === 'hu' ? 'hu_HU' : 'en_US';

  // Generate alternate language URLs
  const alternates: Metadata['alternates'] = {
    canonical: url,
    languages: {
      'ro': `${baseUrl}/ro${path}`,
      'hu': `${baseUrl}/hu${path}`,
      'en': `${baseUrl}/en${path}`,
      'x-default': `${baseUrl}/ro${path}`,
    },
  };

  const metadata: Metadata = {
    title,
    description,
    keywords,
    authors: [{ name: SEO_CONFIG.organization.name }],
    creator: SEO_CONFIG.organization.name,
    publisher: SEO_CONFIG.organization.name,
    metadataBase: new URL(baseUrl),
    alternates,
    
    openGraph: {
      type: article ? 'article' : 'website',
      locale: ogLocale,
      url,
      title,
      description,
      siteName: SEO_CONFIG.siteName[locale],
      images: [
        {
          url: image.startsWith('http') ? image : `${baseUrl}${image}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(article && {
        publishedTime: article.publishedTime,
        modifiedTime: article.modifiedTime,
        authors: [article.author || SEO_CONFIG.organization.name],
        section: article.section,
        tags: article.tags,
      }),
    },
    
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image.startsWith('http') ? image : `${baseUrl}${image}`],
      creator: SEO_CONFIG.twitter.handle,
    },
    
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
  };

  return metadata;
}

// ============================================
// GENERATE DYNAMIC METADATA FOR NEWS/ARTICLES
// ============================================

interface ArticleMetadataOptions {
  title: string;
  description: string;
  slug: string;
  locale: Locale;
  imageUrl?: string;
  publishedTime: string;
  modifiedTime?: string;
  author?: string;
  category?: string;
  tags?: string[];
}

export function generateArticleMetadata({
  title,
  description,
  slug,
  locale,
  imageUrl,
  publishedTime,
  modifiedTime,
  author,
  category,
  tags,
}: ArticleMetadataOptions): Metadata {
  return generatePageMetadata({
    locale,
    customTitle: `${title} | ${SEO_CONFIG.siteName[locale]}`,
    customDescription: description,
    customImage: imageUrl,
    path: `/stiri/${slug}`,
    article: {
      publishedTime,
      modifiedTime,
      author,
      section: category,
      tags,
    },
  });
}

// ============================================
// GENERATE METADATA FOR DOCUMENT PAGES
// ============================================

interface DocumentPageMetadataOptions {
  pageKey: PageKey;
  locale: Locale;
  year?: number;
  category?: string;
}

export function generateDocumentPageMetadata({
  pageKey,
  locale,
  year,
  category,
}: DocumentPageMetadataOptions): Metadata {
  const pageSeo = PAGE_SEO[pageKey]?.[locale];
  
  // Use string concatenation to avoid template literal type issues
  let title: string = pageSeo?.title ?? '';
  let description: string = pageSeo?.description ?? '';
  
  // Add year or category to title if provided
  if (year) {
    title = title + ' - ' + year.toString();
    description = description + ' Anul ' + year.toString() + '.';
  }
  
  if (category) {
    title = title + ' - ' + category;
  }

  const pathMap: Record<string, string> = {
    autorizatiiConstruire: '/informatii-publice/autorizatii-construire',
    certificateUrbanism: '/informatii-publice/certificate-urbanism',
    buget: '/informatii-publice/buget',
    hotarari: '/consiliul-local/hotarari',
    concursuri: '/informatii-publice/concursuri',
    licitatii: '/informatii-publice/licitatii',
    achizitii: '/informatii-publice/achizitii',
    formulare: '/informatii-publice/formulare',
    taxeImpozite: '/informatii-publice/taxe-impozite',
  };

  return generatePageMetadata({
    locale,
    customTitle: title,
    customDescription: description,
    customKeywords: pageSeo?.keywords as string | undefined,
    path: pathMap[pageKey] || '',
  });
}

// ============================================
// SEO HELPER FUNCTIONS
// ============================================

/**
 * Generate canonical URL for a page
 */
export function getCanonicalUrl(path: string, locale: Locale = 'ro'): string {
  return `${baseUrl}/${locale}${path}`;
}

/**
 * Generate hreflang tags for alternate languages
 */
export function getHreflangTags(path: string): Record<string, string> {
  return {
    'ro': `${baseUrl}/ro${path}`,
    'hu': `${baseUrl}/hu${path}`,
    'en': `${baseUrl}/en${path}`,
    'x-default': `${baseUrl}/ro${path}`,
  };
}

/**
 * Truncate text for meta description (max 160 chars)
 */
export function truncateDescription(text: string, maxLength: number = 160): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3).trim() + '...';
}

/**
 * Generate title with site name suffix
 */
export function generateTitle(pageTitle: string, locale: Locale = 'ro'): string {
  return `${pageTitle} | ${SEO_CONFIG.siteName[locale]}`;
}

/**
 * Clean and format keywords
 */
export function formatKeywords(keywords: string | string[]): string {
  if (Array.isArray(keywords)) {
    return keywords.join(', ');
  }
  return keywords;
}

/**
 * Generate Open Graph image URL
 */
export function getOgImageUrl(imagePath?: string): string {
  if (!imagePath) return `${baseUrl}${SEO_CONFIG.images.ogImage}`;
  if (imagePath.startsWith('http')) return imagePath;
  return `${baseUrl}${imagePath}`;
}

// ============================================
// EXPORT REUSABLE METADATA TEMPLATES
// ============================================

export const DEFAULT_VIEWPORT = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#1E3A5F',
};

export const DEFAULT_ICONS = {
  icon: [
    { url: '/favicon.ico', sizes: 'any' },
    { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
  ],
  apple: [
    { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
  ],
};

