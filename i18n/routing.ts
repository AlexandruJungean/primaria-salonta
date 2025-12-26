import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['ro', 'hu', 'en'],

  // Used when no locale matches
  defaultLocale: 'ro',

  // Don't show the locale prefix for the default locale
  localePrefix: 'as-needed',

  // Disable automatic browser locale detection - always use Romanian as default
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];

