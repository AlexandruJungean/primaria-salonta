import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Open_Sans, Source_Serif_4 } from 'next/font/google';
import '../globals.css';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AccessibilityToolbar } from '@/components/features/accessibility-toolbar';
import { NavigationProvider } from '@/components/layout/navigation-context';
import { getInstitutionsForNav } from '@/lib/supabase/services/institutions';
import { 
  SEO_CONFIG, 
  OrganizationJsonLd, 
  WebSiteJsonLd,
  LocalBusinessJsonLd,
  DEFAULT_ICONS,
} from '@/lib/seo';

const openSans = Open_Sans({
  variable: '--font-open-sans',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
});

const sourceSerif = Source_Serif_4({
  variable: '--font-source-serif',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
});

const baseUrl = SEO_CONFIG.siteUrl;

// Viewport configuration
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#1E3A5F' },
    { media: '(prefers-color-scheme: dark)', color: '#1E3A5F' },
  ],
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  const siteName = SEO_CONFIG.siteName[locale as keyof typeof SEO_CONFIG.siteName] || SEO_CONFIG.siteName.ro;

  return {
    title: {
      default: t('title'),
      template: `%s | ${siteName}`,
    },
    description: t('description'),
    keywords: t('keywords'),
    authors: [{ name: SEO_CONFIG.organization.name, url: baseUrl }],
    creator: SEO_CONFIG.organization.name,
    publisher: SEO_CONFIG.organization.name,
    formatDetection: {
      email: true,
      address: true,
      telephone: true,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        'ro': `${baseUrl}/ro`,
        'hu': `${baseUrl}/hu`,
        'en': `${baseUrl}/en`,
        'x-default': `${baseUrl}/ro`,
      },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: baseUrl,
      siteName: siteName,
      locale: locale === 'ro' ? 'ro_RO' : locale === 'hu' ? 'hu_HU' : 'en_US',
      type: 'website',
      images: [
        {
          url: `${baseUrl}${SEO_CONFIG.images.ogImage}`,
          width: 1200,
          height: 630,
          alt: t('title'),
          type: 'image/jpeg',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: SEO_CONFIG.twitter.handle,
      creator: SEO_CONFIG.twitter.handle,
      title: t('title'),
      description: t('description'),
      images: [`${baseUrl}${SEO_CONFIG.images.ogImage}`],
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: DEFAULT_ICONS,
    // manifest: '/manifest.json', // Dezactivat pentru a preveni popup-ul PWA pe mobil
    category: 'government',
    classification: 'Government Website',
    referrer: 'origin-when-cross-origin',
    verification: {
      // Add Google Search Console verification when available
      // google: 'your-google-verification-code',
      // yandex: 'your-yandex-verification-code',
      // bing: 'your-bing-verification-code',
    },
    // appleWebApp dezactivat pentru a preveni popup-ul PWA pe iOS
    // appleWebApp: {
    //   capable: true,
    //   statusBarStyle: 'default',
    //   title: siteName,
    // },
    other: {
      'msapplication-TileColor': '#1E3A5F',
      'msapplication-config': '/browserconfig.xml',
      'theme-color': '#1E3A5F',
      'color-scheme': 'light',
      'format-detection': 'telephone=yes',
      // Dezactivate pentru a preveni popup-ul PWA pe mobil
      // 'mobile-web-app-capable': 'yes',
      // 'apple-mobile-web-app-capable': 'yes',
      // 'apple-mobile-web-app-status-bar-style': 'default',
      // Geo tags for local SEO
      'geo.region': 'RO-BH',
      'geo.placename': 'Salonta',
      'geo.position': `${SEO_CONFIG.organization.geo.latitude};${SEO_CONFIG.organization.geo.longitude}`,
      'ICBM': `${SEO_CONFIG.organization.geo.latitude}, ${SEO_CONFIG.organization.geo.longitude}`,
    },
  };
}

// Combined JSON-LD Structured Data for maximum SEO
function CombinedJsonLd({ locale }: { locale: string }) {
  return (
    <>
      <OrganizationJsonLd />
      <WebSiteJsonLd locale={locale} />
      <LocalBusinessJsonLd />
    </>
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale
  if (!routing.locales.includes(locale as 'ro' | 'hu' | 'en')) {
    notFound();
  }

  // Get messages for the current locale
  const messages = await getMessages();
  
  // Fetch dynamic institutions for navigation
  const institutions = await getInstitutionsForNav();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <CombinedJsonLd locale={locale} />
      </head>
      <body className={`${openSans.variable} ${sourceSerif.variable} antialiased min-h-screen flex flex-col`}>
        <NextIntlClientProvider messages={messages}>
          <NavigationProvider institutions={institutions}>
            {/* Skip to Content Link */}
            <a href="#main-content" className="skip-to-content">
              Skip to content
            </a>

            {/* Accessibility Toolbar */}
            <AccessibilityToolbar />

            {/* Header */}
            <Header />

            {/* Main Content */}
            <main id="main-content" className="flex-1">
              {children}
            </main>

            {/* Footer */}
            <Footer />
          </NavigationProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

