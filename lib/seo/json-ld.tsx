/**
 * JSON-LD Structured Data Components
 * Comprehensive schema.org implementations for SEO
 */

import { SEO_CONFIG } from './config';

const baseUrl = SEO_CONFIG.siteUrl;

// ============================================
// ORGANIZATION SCHEMA (GovernmentOrganization)
// ============================================
export function OrganizationJsonLd() {
  const org = SEO_CONFIG.organization;
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'GovernmentOrganization',
    '@id': `${baseUrl}/#organization`,
    name: org.name,
    alternateName: org.alternateName,
    legalName: org.legalName,
    url: baseUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${baseUrl}${SEO_CONFIG.images.logo}`,
      width: 512,
      height: 512,
    },
    image: `${baseUrl}${SEO_CONFIG.images.ogImage}`,
    description: 'Primăria Municipiului Salonta - autoritate a administrației publice locale care administrează și gestionează interesele comunității locale.',
    foundingDate: org.foundingDate,
    address: {
      '@type': 'PostalAddress',
      streetAddress: org.address.streetAddress,
      addressLocality: org.address.addressLocality,
      addressRegion: org.address.addressRegion,
      postalCode: org.address.postalCode,
      addressCountry: org.address.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: org.geo.latitude,
      longitude: org.geo.longitude,
    },
    contactPoint: org.contact.phones.map((phone, index) => ({
      '@type': 'ContactPoint',
      telephone: phone,
      contactType: index === 0 ? 'customer service' : 'general',
      email: org.contact.emails[0],
      availableLanguage: ['Romanian', 'Hungarian', 'English'],
      areaServed: 'RO',
    })),
    sameAs: [
      org.socialMedia.facebook,
      org.socialMedia.instagram,
      org.socialMedia.tiktok,
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: org.openingHours.weekdays?.opens,
        closes: org.openingHours.weekdays?.closes,
      },
    ],
    areaServed: {
      '@type': 'City',
      name: 'Salonta',
      containedInPlace: {
        '@type': 'AdministrativeArea',
        name: 'Bihor County',
      },
    },
    memberOf: {
      '@type': 'GovernmentOrganization',
      name: 'Consiliul Județean Bihor',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

// ============================================
// WEBSITE SCHEMA (with SearchAction)
// ============================================
export function WebSiteJsonLd({ locale = 'ro' }: { locale?: string }) {
  const siteName = SEO_CONFIG.siteName[locale as keyof typeof SEO_CONFIG.siteName] || SEO_CONFIG.siteName.ro;
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    url: baseUrl,
    name: siteName,
    description: 'Site-ul oficial al Primăriei Municipiului Salonta',
    publisher: {
      '@id': `${baseUrl}/#organization`,
    },
    inLanguage: [
      { '@type': 'Language', name: 'Romanian', alternateName: 'ro' },
      { '@type': 'Language', name: 'Hungarian', alternateName: 'hu' },
      { '@type': 'Language', name: 'English', alternateName: 'en' },
    ],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/${locale}/cautare?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

// ============================================
// BREADCRUMB SCHEMA
// ============================================
interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbJsonLd({ 
  items, 
  locale = 'ro' 
}: { 
  items: BreadcrumbItem[];
  locale?: string;
}) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${baseUrl}/${locale}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

// ============================================
// WEBPAGE SCHEMA
// ============================================
interface WebPageJsonLdProps {
  title: string;
  description: string;
  url: string;
  locale?: string;
  datePublished?: string;
  dateModified?: string;
  breadcrumb?: BreadcrumbItem[];
}

export function WebPageJsonLd({
  title,
  description,
  url,
  locale = 'ro',
  datePublished,
  dateModified,
  breadcrumb,
}: WebPageJsonLdProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${baseUrl}/${locale}${url}#webpage`,
    url: `${baseUrl}/${locale}${url}`,
    name: title,
    description,
    isPartOf: {
      '@id': `${baseUrl}/#website`,
    },
    about: {
      '@id': `${baseUrl}/#organization`,
    },
    inLanguage: locale === 'ro' ? 'ro-RO' : locale === 'hu' ? 'hu-HU' : 'en-US',
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified }),
    ...(breadcrumb && {
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumb.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url.startsWith('http') ? item.url : `${baseUrl}/${locale}${item.url}`,
        })),
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

// ============================================
// LOCAL BUSINESS SCHEMA (for specific services)
// ============================================
export function LocalBusinessJsonLd() {
  const org = SEO_CONFIG.organization;
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${baseUrl}/#localbusiness`,
    name: org.name,
    image: `${baseUrl}${SEO_CONFIG.images.ogImage}`,
    telephone: org.contact.phones[0],
    email: org.contact.emails[0],
    address: {
      '@type': 'PostalAddress',
      streetAddress: org.address.streetAddress,
      addressLocality: org.address.addressLocality,
      addressRegion: org.address.addressRegion,
      postalCode: org.address.postalCode,
      addressCountry: org.address.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: org.geo.latitude,
      longitude: org.geo.longitude,
    },
    url: baseUrl,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '16:00',
      },
    ],
    priceRange: 'Free',
    paymentAccepted: 'Cash, Credit Card',
    currenciesAccepted: 'RON',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

// ============================================
// ARTICLE SCHEMA (for news)
// ============================================
interface ArticleJsonLdProps {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  locale?: string;
}

export function ArticleJsonLd({
  title,
  description,
  url,
  imageUrl,
  datePublished,
  dateModified,
  authorName = 'Primăria Municipiului Salonta',
  locale = 'ro',
}: ArticleJsonLdProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: title,
    description,
    image: imageUrl ? `${baseUrl}${imageUrl}` : `${baseUrl}${SEO_CONFIG.images.ogImage}`,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Organization',
      name: authorName,
      url: baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: SEO_CONFIG.organization.name,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}${SEO_CONFIG.images.logo}`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/${locale}${url}`,
    },
    inLanguage: locale === 'ro' ? 'ro-RO' : locale === 'hu' ? 'hu-HU' : 'en-US',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

// ============================================
// EVENT SCHEMA
// ============================================
interface EventJsonLdProps {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: string;
  imageUrl?: string;
  url: string;
  locale?: string;
}

export function EventJsonLd({
  name,
  description,
  startDate,
  endDate,
  location = 'Salonta, Bihor',
  imageUrl,
  url,
  locale = 'ro',
}: EventJsonLdProps) {
  const org = SEO_CONFIG.organization;
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name,
    description,
    startDate,
    endDate: endDate || startDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: location,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Salonta',
        addressRegion: 'Bihor',
        addressCountry: 'RO',
      },
    },
    image: imageUrl ? `${baseUrl}${imageUrl}` : `${baseUrl}${SEO_CONFIG.images.ogImage}`,
    organizer: {
      '@type': 'Organization',
      name: org.name,
      url: baseUrl,
    },
    performer: {
      '@type': 'Organization',
      name: org.name,
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'RON',
      availability: 'https://schema.org/InStock',
      url: `${baseUrl}/${locale}${url}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

// ============================================
// FAQ SCHEMA
// ============================================
interface FAQItem {
  question: string;
  answer: string;
}

export function FAQJsonLd({ items }: { items: FAQItem[] }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

// ============================================
// GOVERNMENT SERVICE SCHEMA
// ============================================
interface GovernmentServiceJsonLdProps {
  name: string;
  description: string;
  url: string;
  serviceType: string;
  locale?: string;
}

export function GovernmentServiceJsonLd({
  name,
  description,
  url,
  serviceType,
  locale = 'ro',
}: GovernmentServiceJsonLdProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'GovernmentService',
    name,
    description,
    url: `${baseUrl}/${locale}${url}`,
    serviceType,
    provider: {
      '@type': 'GovernmentOrganization',
      name: SEO_CONFIG.organization.name,
      url: baseUrl,
    },
    areaServed: {
      '@type': 'City',
      name: 'Salonta',
    },
    audience: {
      '@type': 'Audience',
      audienceType: 'Citizens',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

// ============================================
// PLACE SCHEMA (for tourism pages)
// ============================================
interface PlaceJsonLdProps {
  name: string;
  description: string;
  imageUrl?: string;
  url: string;
  locale?: string;
}

export function PlaceJsonLd({
  name,
  description,
  imageUrl,
  url,
  locale = 'ro',
}: PlaceJsonLdProps) {
  const org = SEO_CONFIG.organization;
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name,
    description,
    image: imageUrl ? `${baseUrl}${imageUrl}` : `${baseUrl}${SEO_CONFIG.images.ogImage}`,
    url: `${baseUrl}/${locale}${url}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Salonta',
      addressRegion: 'Bihor',
      addressCountry: 'RO',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: org.geo.latitude,
      longitude: org.geo.longitude,
    },
    isAccessibleForFree: true,
    publicAccess: true,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

// ============================================
// PERSON SCHEMA (for leadership pages)
// ============================================
interface PersonJsonLdProps {
  name: string;
  jobTitle: string;
  description?: string;
  imageUrl?: string;
  email?: string;
  telephone?: string;
}

export function PersonJsonLd({
  name,
  jobTitle,
  description,
  imageUrl,
  email,
  telephone,
}: PersonJsonLdProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    jobTitle,
    ...(description && { description }),
    ...(imageUrl && { image: `${baseUrl}${imageUrl}` }),
    ...(email && { email }),
    ...(telephone && { telephone }),
    worksFor: {
      '@type': 'GovernmentOrganization',
      name: SEO_CONFIG.organization.name,
      url: baseUrl,
    },
    memberOf: {
      '@type': 'GovernmentOrganization',
      name: SEO_CONFIG.organization.name,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

// ============================================
// PROGRAM/PROJECT SCHEMA
// ============================================
interface ProgramJsonLdProps {
  name: string;
  description: string;
  url: string;
  imageUrl?: string;
  startDate?: string;
  endDate?: string;
  status?: 'planificat' | 'in_desfasurare' | 'finalizat' | 'anulat';
  fundingSource?: string;
  budget?: number;
  currency?: string;
  locale?: string;
}

export function ProgramJsonLd({
  name,
  description,
  url,
  imageUrl,
  startDate,
  endDate,
  status,
  fundingSource,
  budget,
  currency = 'RON',
  locale = 'ro',
}: ProgramJsonLdProps) {
  // Map status to schema.org event status
  const statusMap: Record<string, string> = {
    planificat: 'https://schema.org/EventScheduled',
    in_desfasurare: 'https://schema.org/EventScheduled',
    finalizat: 'https://schema.org/EventCancelled', // Using as "completed"
    anulat: 'https://schema.org/EventCancelled',
  };

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'GovernmentService',
    name,
    description,
    url: `${baseUrl}/${locale}${url}`,
    ...(imageUrl && { image: imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}` }),
    provider: {
      '@type': 'GovernmentOrganization',
      name: SEO_CONFIG.organization.name,
      url: baseUrl,
    },
    areaServed: {
      '@type': 'City',
      name: 'Salonta',
      containedInPlace: {
        '@type': 'AdministrativeArea',
        name: 'Județul Bihor',
      },
    },
    serviceType: 'Government Program',
    ...(fundingSource && {
      funder: {
        '@type': 'Organization',
        name: fundingSource,
      },
    }),
    ...(budget && {
      offers: {
        '@type': 'Offer',
        price: budget,
        priceCurrency: currency,
      },
    }),
    ...(startDate && { availabilityStarts: startDate }),
    ...(endDate && { availabilityEnds: endDate }),
    ...(status && { additionalType: statusMap[status] || statusMap.in_desfasurare }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

// ============================================
// CONTACT PAGE SCHEMA
// ============================================
export function ContactPageJsonLd({ locale = 'ro' }: { locale?: string }) {
  const org = SEO_CONFIG.organization;
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: locale === 'ro' ? 'Contact Primăria Salonta' : locale === 'hu' ? 'Kapcsolat' : 'Contact',
    description: locale === 'ro' 
      ? 'Pagina de contact a Primăriei Municipiului Salonta'
      : locale === 'hu'
      ? 'Nagyszalonta Polgármesteri Hivatalának kapcsolati oldala'
      : 'Contact page of Salonta City Hall',
    url: `${baseUrl}/${locale}/contact`,
    mainEntity: {
      '@type': 'GovernmentOrganization',
      '@id': `${baseUrl}/#organization`,
      name: org.name,
      telephone: org.contact.phones[0],
      email: org.contact.emails[0],
      faxNumber: org.contact.fax,
      address: {
        '@type': 'PostalAddress',
        streetAddress: org.address.streetAddress,
        addressLocality: org.address.addressLocality,
        addressRegion: org.address.addressRegion,
        postalCode: org.address.postalCode,
        addressCountry: org.address.addressCountry,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

