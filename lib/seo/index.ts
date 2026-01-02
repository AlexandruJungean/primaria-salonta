/**
 * SEO Module - Comprehensive SEO utilities for Primăria Salonta
 * 
 * This module provides:
 * - SEO configuration for all pages
 * - JSON-LD structured data components
 * - Metadata generation utilities
 * - Helper functions for SEO optimization
 */

// Configuration
export { SEO_CONFIG, PAGE_SEO } from './config';
export type { PageKey, Locale } from './config';

// JSON-LD Components
export {
  OrganizationJsonLd,
  WebSiteJsonLd,
  BreadcrumbJsonLd,
  WebPageJsonLd,
  LocalBusinessJsonLd,
  ArticleJsonLd,
  EventJsonLd,
  FAQJsonLd,
  GovernmentServiceJsonLd,
  PlaceJsonLd,
  PersonJsonLd,
  ContactPageJsonLd,
} from './json-ld';

// Metadata Utilities
export {
  generatePageMetadata,
  generateArticleMetadata,
  generateDocumentPageMetadata,
  getCanonicalUrl,
  getHreflangTags,
  truncateDescription,
  generateTitle,
  formatKeywords,
  getOgImageUrl,
  DEFAULT_VIEWPORT,
  DEFAULT_ICONS,
} from './metadata';

