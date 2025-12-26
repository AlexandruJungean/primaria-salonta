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
    openGraph: {
      title: t('title'),
      description: t('description'),
      locale: locale,
      type: 'website',
    },
  };
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
      <body className={`${openSans.variable} ${sourceSerif.variable} antialiased min-h-screen flex flex-col`}>
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

