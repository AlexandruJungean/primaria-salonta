import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Open_Sans, Source_Serif_4 } from 'next/font/google';
import '../globals.css';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AccessibilityToolbar } from '@/components/features/accessibility-toolbar';

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

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://primaria-salonta.ro';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    title: {
      default: t('title'),
      template: `%s | ${t('title')}`,
    },
    description: t('description'),
    keywords: t('keywords'),
    authors: [{ name: 'Primăria Municipiului Salonta' }],
    creator: 'Primăria Municipiului Salonta',
    publisher: 'Primăria Municipiului Salonta',
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
      siteName: t('title'),
      locale: locale === 'ro' ? 'ro_RO' : locale === 'hu' ? 'hu_HU' : 'en_US',
      type: 'website',
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: t('title'),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: ['/og-image.jpg'],
    },
    robots: {
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
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
    },
    manifest: '/manifest.json',
    verification: {
      // Add Google Search Console verification when available
      // google: 'your-google-verification-code',
    },
  };
}

// JSON-LD Structured Data for Organization
function OrganizationJsonLd() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'GovernmentOrganization',
    name: 'Primăria Municipiului Salonta',
    alternateName: ['Salonta City Hall', 'Nagyszalonta Polgármesteri Hivatal'],
    url: baseUrl,
    logo: `${baseUrl}/logo/logo.png`,
    image: `${baseUrl}/og-image.jpg`,
    description: 'Site-ul oficial al Primăriei Municipiului Salonta - Informații pentru cetățeni, servicii online, transparență și comunitate.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Str. Republicii nr. 1',
      addressLocality: 'Salonta',
      addressRegion: 'Bihor',
      postalCode: '415500',
      addressCountry: 'RO',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 46.8,
      longitude: 21.65,
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+40-728-105-762',
        contactType: 'customer service',
        email: 'primsal3@gmail.com',
        availableLanguage: ['Romanian', 'Hungarian', 'English'],
      },
    ],
    sameAs: [
      'https://www.facebook.com/PrimariaSalontaNagyszalontaPolgarmesteriHivatala',
      'https://www.instagram.com/primaria.municipiuluisalonta/',
    ],
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '16:00',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
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

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <OrganizationJsonLd />
      </head>
      <body className={`${openSans.variable} ${sourceSerif.variable} antialiased min-h-screen flex flex-col overflow-x-hidden`}>
        <NextIntlClientProvider messages={messages}>
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
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

