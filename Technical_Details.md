# 🔧 Technical Details: Primăria Salonta Website

## Table of Contents
1. [Technology Stack](#1-technology-stack)
2. [Project Architecture](#2-project-architecture)
3. [Supabase Configuration](#3-supabase-configuration)
4. [Internationalization (i18n)](#4-internationalization-i18n)
5. [Component Library](#5-component-library)
6. [API Integrations](#6-api-integrations)
7. [Accessibility Implementation](#7-accessibility-implementation)
8. [Performance Optimization](#8-performance-optimization)
9. [Security Measures](#9-security-measures)
10. [Deployment Strategy](#10-deployment-strategy)
11. [Database Schema](#11-database-schema)
12. [Development Guidelines](#12-development-guidelines)

---

## 1. Technology Stack

### 1.1 Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.1.1 | React framework with SSR/SSG |
| **React** | 19.2.3 | UI component library |
| **TypeScript** | ^5 | Type-safe JavaScript |
| **Tailwind CSS** | ^4 | Utility-first CSS framework |

### 1.2 Backend & Database

| Technology | Purpose |
|------------|---------|
| **Supabase** | BaaS - Database, Auth, Storage, Realtime |
| **PostgreSQL** | Relational database (via Supabase) |

### 1.3 Additional Libraries (Recommended)

```json
{
  "dependencies": {
    "next": "16.1.1",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "@supabase/supabase-js": "^2.x",
    "next-intl": "^3.x",
    "@react-google-maps/api": "^2.x",
    "lucide-react": "^0.x",
    "date-fns": "^3.x",
    "react-hook-form": "^7.x",
    "@hookform/resolvers": "^3.x",
    "zod": "^3.x",
    "framer-motion": "^11.x",
    "embla-carousel-react": "^8.x",
    "react-pdf": "^7.x",
    "next-seo": "^6.x"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@tailwindcss/typography": "^0.5.x",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.1.1",
    "typescript": "^5",
    "prettier": "^3.x",
    "prettier-plugin-tailwindcss": "^0.5.x"
  }
}
```

---

## 2. Project Architecture

### 2.1 Folder Structure

```
web-primaria-salonta/
├── app/
│   ├── [locale]/                    # Locale-based routing
│   │   ├── layout.tsx               # Locale layout
│   │   ├── page.tsx                 # Homepage
│   │   ├── localitatea/             # About the city
│   │   │   ├── page.tsx
│   │   │   ├── localizare/page.tsx
│   │   │   ├── istoric/page.tsx
│   │   │   ├── cultura/page.tsx
│   │   │   ├── harta-digitala/page.tsx
│   │   │   ├── galerie/page.tsx
│   │   │   ├── excursie-virtuala/page.tsx
│   │   │   ├── orase-infratite/page.tsx
│   │   │   ├── cetateni-de-onoare/page.tsx
│   │   │   └── economie/page.tsx
│   │   ├── institutii/              # Subordinate institutions
│   │   │   ├── page.tsx
│   │   │   ├── casa-cultura/page.tsx
│   │   │   ├── biblioteca/page.tsx
│   │   │   ├── muzeu/page.tsx
│   │   │   └── ...
│   │   ├── primaria/                # City Hall section
│   │   │   ├── page.tsx
│   │   │   ├── legislatie/page.tsx
│   │   │   ├── conducere/page.tsx
│   │   │   ├── organigrama/page.tsx
│   │   │   ├── program/page.tsx
│   │   │   ├── audiente/page.tsx
│   │   │   └── declaratii-avere/page.tsx
│   │   ├── consiliul-local/         # Local Council
│   │   │   ├── page.tsx
│   │   │   ├── consilieri/page.tsx
│   │   │   ├── comisii/page.tsx
│   │   │   ├── hotarari/page.tsx
│   │   │   └── ...
│   │   ├── transparenta/            # Transparency
│   │   │   ├── page.tsx
│   │   │   ├── anunturi/page.tsx
│   │   │   ├── dezbateri/page.tsx
│   │   │   └── buletin/page.tsx
│   │   ├── informatii-publice/      # Public Information
│   │   │   ├── page.tsx
│   │   │   ├── achizitii/page.tsx
│   │   │   ├── buget/page.tsx
│   │   │   ├── taxe/page.tsx
│   │   │   ├── gdpr/page.tsx
│   │   │   └── ...
│   │   ├── programe/                # Programs & Strategies
│   │   ├── rapoarte/                # Reports & Studies
│   │   ├── monitorul-oficial/       # Local Official Monitor
│   │   ├── servicii-online/         # Online Services
│   │   │   ├── plati/page.tsx
│   │   │   ├── petitii/page.tsx
│   │   │   └── formulare/page.tsx
│   │   ├── stiri/                   # News
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── evenimente/              # Events
│   │   ├── camere-web/              # Webcams
│   │   ├── contact/                 # Contact
│   │   └── sitemap/                 # Sitemap
│   ├── api/                         # API Routes
│   │   ├── contact/route.ts
│   │   ├── petition/route.ts
│   │   └── newsletter/route.ts
│   ├── globals.css
│   ├── layout.tsx                   # Root layout
│   └── not-found.tsx
├── components/
│   ├── ui/                          # Base UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── navigation-menu.tsx
│   │   ├── accordion.tsx
│   │   ├── tabs.tsx
│   │   ├── badge.tsx
│   │   └── ...
│   ├── layout/                      # Layout components
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   ├── navigation.tsx
│   │   ├── mega-menu.tsx
│   │   ├── mobile-nav.tsx
│   │   ├── sidebar.tsx
│   │   ├── breadcrumbs.tsx
│   │   └── language-switcher.tsx
│   ├── sections/                    # Page sections
│   │   ├── hero.tsx
│   │   ├── news-section.tsx
│   │   ├── events-section.tsx
│   │   ├── quick-links.tsx
│   │   ├── webcams-section.tsx
│   │   ├── map-section.tsx
│   │   ├── external-links.tsx
│   │   └── social-media.tsx
│   ├── features/                    # Feature components
│   │   ├── document-viewer.tsx
│   │   ├── gallery.tsx
│   │   ├── search.tsx
│   │   ├── contact-form.tsx
│   │   ├── petition-form.tsx
│   │   ├── accessibility-toolbar.tsx
│   │   ├── cookie-consent.tsx
│   │   └── newsletter-signup.tsx
│   └── shared/                      # Shared components
│       ├── seo.tsx
│       ├── loading.tsx
│       ├── error-boundary.tsx
│       └── pagination.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts                # Browser client
│   │   ├── server.ts                # Server client
│   │   └── admin.ts                 # Admin client
│   ├── utils/
│   │   ├── cn.ts                    # Class name utility
│   │   ├── format-date.ts
│   │   ├── format-currency.ts
│   │   └── helpers.ts
│   └── constants/
│       ├── navigation.ts
│       ├── social-links.ts
│       └── external-links.ts
├── hooks/
│   ├── use-locale.ts
│   ├── use-supabase.ts
│   ├── use-accessibility.ts
│   └── use-media-query.ts
├── types/
│   ├── database.ts                  # Supabase types
│   ├── content.ts
│   └── navigation.ts
├── messages/                        # i18n translations
│   ├── ro.json
│   ├── hu.json
│   └── en.json
├── public/
│   ├── images/
│   ├── logo/
│   ├── references/
│   ├── documents/                   # PDF files
│   └── icons/
├── styles/
│   └── fonts/                       # Local fonts if needed
├── middleware.ts                    # Locale detection
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── .env.local
├── .env.example
└── package.json
```

### 2.2 Environment Variables

```env
# .env.local

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaxxx...

# App Configuration
NEXT_PUBLIC_SITE_URL=https://salonta.ro
NEXT_PUBLIC_DEFAULT_LOCALE=ro

# Email (for contact forms)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=primsal3@gmail.com
SMTP_PASSWORD=xxx

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## 3. Supabase Configuration

### 3.1 Database Schema Overview

```sql
-- Core Content Tables
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE article_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  locale TEXT NOT NULL CHECK (locale IN ('ro', 'hu', 'en')),
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  meta_title TEXT,
  meta_description TEXT,
  UNIQUE(article_id, locale)
);

CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  subcategory TEXT,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  year INTEGER,
  document_number TEXT,
  document_date DATE,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE document_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  locale TEXT NOT NULL CHECK (locale IN ('ro', 'hu', 'en')),
  title TEXT NOT NULL,
  description TEXT,
  UNIQUE(document_id, locale)
);

CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME,
  location TEXT,
  image_url TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE event_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  locale TEXT NOT NULL CHECK (locale IN ('ro', 'hu', 'en')),
  title TEXT NOT NULL,
  description TEXT,
  UNIQUE(event_id, locale)
);

-- Personnel Tables
CREATE TABLE leadership (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  position TEXT NOT NULL,
  photo_url TEXT,
  email TEXT,
  phone TEXT,
  office_hours TEXT,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE leadership_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  leadership_id UUID REFERENCES leadership(id) ON DELETE CASCADE,
  locale TEXT NOT NULL CHECK (locale IN ('ro', 'hu', 'en')),
  name TEXT NOT NULL,
  position_title TEXT NOT NULL,
  biography TEXT,
  UNIQUE(leadership_id, locale)
);

CREATE TABLE council_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  party TEXT,
  photo_url TEXT,
  email TEXT,
  phone TEXT,
  mandate_start DATE,
  mandate_end DATE,
  active BOOLEAN DEFAULT true
);

CREATE TABLE council_member_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  council_member_id UUID REFERENCES council_members(id) ON DELETE CASCADE,
  locale TEXT NOT NULL CHECK (locale IN ('ro', 'hu', 'en')),
  name TEXT NOT NULL,
  UNIQUE(council_member_id, locale)
);

-- Contact & Forms
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE petitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_number TEXT UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'processing', 'resolved', 'rejected')),
  response TEXT,
  response_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Gallery
CREATE TABLE gallery_albums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  cover_image TEXT,
  sort_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE gallery_album_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id UUID REFERENCES gallery_albums(id) ON DELETE CASCADE,
  locale TEXT NOT NULL CHECK (locale IN ('ro', 'hu', 'en')),
  title TEXT NOT NULL,
  description TEXT,
  UNIQUE(album_id, locale)
);

CREATE TABLE gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id UUID REFERENCES gallery_albums(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE gallery_image_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_id UUID REFERENCES gallery_images(id) ON DELETE CASCADE,
  locale TEXT NOT NULL CHECK (locale IN ('ro', 'hu', 'en')),
  alt_text TEXT,
  caption TEXT,
  UNIQUE(image_id, locale)
);

-- Static Pages (for CMS-managed content)
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  template TEXT DEFAULT 'default',
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE page_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
  locale TEXT NOT NULL CHECK (locale IN ('ro', 'hu', 'en')),
  title TEXT NOT NULL,
  content TEXT,
  meta_title TEXT,
  meta_description TEXT,
  UNIQUE(page_id, locale)
);
```

### 3.2 Row Level Security (RLS) Policies

```sql
-- Enable RLS on all tables
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
-- ... etc

-- Public read access for published content
CREATE POLICY "Public can view published articles" 
ON articles FOR SELECT 
USING (published = true);

CREATE POLICY "Public can view published documents" 
ON documents FOR SELECT 
USING (published = true);

-- Admin full access
CREATE POLICY "Admins have full access to articles" 
ON articles FOR ALL 
USING (auth.jwt() ->> 'role' = 'admin');
```

### 3.3 Storage Buckets

```
supabase-storage/
├── documents/              # PDF documents (public)
├── images/                 # Content images (public)
├── gallery/                # Gallery images (public)
├── avatars/                # Staff photos (public)
└── private/                # Internal documents (private)
```

---

## 4. Internationalization (i18n)

### 4.1 Setup with next-intl

```typescript
// middleware.ts
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['ro', 'hu', 'en'],
  defaultLocale: 'ro',
  localePrefix: 'as-needed' // Only show prefix for non-default
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
```

### 4.2 Translation File Structure

```json
// messages/ro.json
{
  "common": {
    "search": "Căutare",
    "home": "Acasă",
    "back": "Înapoi",
    "readMore": "Citește mai mult",
    "seeAll": "Vezi tot",
    "download": "Descarcă",
    "loading": "Se încarcă...",
    "error": "Eroare",
    "noResults": "Nu s-au găsit rezultate"
  },
  "navigation": {
    "localitatea": "Localitatea",
    "institutii": "Instituții subordonate",
    "primaria": "Primăria",
    "consiliulLocal": "Consiliul Local",
    "transparenta": "Transparență",
    "informatiiPublice": "Informații de interes public",
    "programe": "Programe și strategii",
    "rapoarte": "Rapoarte și studii",
    "monitorulOficial": "Monitorul Oficial Local",
    "serviciiOnline": "Servicii online",
    "stiri": "Știri",
    "evenimente": "Evenimente",
    "camereWeb": "Camere web",
    "contact": "Contact"
  },
  "homepage": {
    "welcome": "Bine ați venit pe site-ul oficial al Primăriei Municipiului Salonta",
    "latestNews": "Ultimele știri",
    "upcomingEvents": "Evenimente viitoare",
    "quickLinks": "Acces rapid",
    "liveWebcams": "Camere web live"
  },
  "footer": {
    "address": "Adresă",
    "phone": "Telefon",
    "email": "Email",
    "schedule": "Program",
    "followUs": "Urmărește-ne",
    "usefulLinks": "Link-uri utile",
    "privacyPolicy": "Politica de confidențialitate",
    "cookiePolicy": "Politica de cookies",
    "accessibility": "Accesibilitate",
    "termsConditions": "Termeni și condiții",
    "copyright": "© {year} Primăria Municipiului Salonta. Toate drepturile rezervate."
  },
  "contact": {
    "title": "Contact",
    "formTitle": "Trimite-ne un mesaj",
    "name": "Nume și prenume",
    "email": "Adresa de email",
    "phone": "Număr de telefon",
    "subject": "Subiect",
    "message": "Mesaj",
    "send": "Trimite",
    "success": "Mesajul a fost trimis cu succes!",
    "error": "A apărut o eroare. Vă rugăm încercați din nou."
  },
  "accessibility": {
    "title": "Instrumente de accesibilitate",
    "increaseText": "Mărește textul",
    "decreaseText": "Micșorează textul",
    "grayscale": "Tonuri de gri",
    "highContrast": "Contrast mare",
    "negativeContrast": "Contrast negativ",
    "lightBackground": "Fundal luminos",
    "underlineLinks": "Subliniază linkurile",
    "readableFont": "Font lizibil",
    "reset": "Resetează"
  }
}
```

```json
// messages/hu.json
{
  "common": {
    "search": "Keresés",
    "home": "Kezdőlap",
    "back": "Vissza",
    "readMore": "Tovább olvasom",
    "seeAll": "Összes megtekintése",
    "download": "Letöltés",
    "loading": "Betöltés...",
    "error": "Hiba",
    "noResults": "Nincs találat"
  },
  "navigation": {
    "localitatea": "A város",
    "institutii": "Alárendelt intézmények",
    "primaria": "Polgármesteri Hivatal",
    "consiliulLocal": "Helyi Tanács",
    "transparenta": "Átláthatóság",
    "informatiiPublice": "Közérdekű információk",
    "programe": "Programok és stratégiák",
    "rapoarte": "Jelentések és tanulmányok",
    "monitorulOficial": "Helyi Hivatalos Közlöny",
    "serviciiOnline": "Online szolgáltatások",
    "stiri": "Hírek",
    "evenimente": "Események",
    "camereWeb": "Webkamerák",
    "contact": "Kapcsolat"
  },
  "homepage": {
    "welcome": "Üdvözöljük Nagyszalonta Város Polgármesteri Hivatalának hivatalos weboldalán",
    "latestNews": "Legfrissebb hírek",
    "upcomingEvents": "Közelgő események",
    "quickLinks": "Gyors hozzáférés",
    "liveWebcams": "Élő webkamerák"
  }
}
```

```json
// messages/en.json
{
  "common": {
    "search": "Search",
    "home": "Home",
    "back": "Back",
    "readMore": "Read more",
    "seeAll": "See all",
    "download": "Download",
    "loading": "Loading...",
    "error": "Error",
    "noResults": "No results found"
  },
  "navigation": {
    "localitatea": "The City",
    "institutii": "Subordinate Institutions",
    "primaria": "City Hall",
    "consiliulLocal": "Local Council",
    "transparenta": "Transparency",
    "informatiiPublice": "Public Information",
    "programe": "Programs & Strategies",
    "rapoarte": "Reports & Studies",
    "monitorulOficial": "Local Official Monitor",
    "serviciiOnline": "Online Services",
    "stiri": "News",
    "evenimente": "Events",
    "camereWeb": "Webcams",
    "contact": "Contact"
  },
  "homepage": {
    "welcome": "Welcome to the official website of Salonta City Hall",
    "latestNews": "Latest News",
    "upcomingEvents": "Upcoming Events",
    "quickLinks": "Quick Access",
    "liveWebcams": "Live Webcams"
  }
}
```

---

## 5. Component Library

### 5.1 Design Tokens (Tailwind Configuration)

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#243b53',
          900: '#1e3a5f', // Primary brand color
          950: '#102a43',
        },
        secondary: {
          50: '#fdf8f3',
          100: '#f9ecd9',
          200: '#f2d6b0',
          300: '#e8bb7d',
          400: '#d4a054',
          500: '#c5a85f', // Secondary brand color
          600: '#a67c2b',
          700: '#8a6424',
          800: '#6f4f1e',
          900: '#5a4019',
        },
        accent: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
      },
      fontFamily: {
        sans: ['var(--font-open-sans)', 'Open Sans', 'sans-serif'],
        heading: ['var(--font-source-serif)', 'Source Serif Pro', 'serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      fontSize: {
        // Accessible font sizes
        'xs': ['0.75rem', { lineHeight: '1.5' }],
        'sm': ['0.875rem', { lineHeight: '1.5715' }],
        'base': ['1rem', { lineHeight: '1.75' }],
        'lg': ['1.125rem', { lineHeight: '1.75' }],
        'xl': ['1.25rem', { lineHeight: '1.75' }],
        '2xl': ['1.5rem', { lineHeight: '1.415' }],
        '3xl': ['1.875rem', { lineHeight: '1.333' }],
        '4xl': ['2.25rem', { lineHeight: '1.277' }],
        '5xl': ['3rem', { lineHeight: '1.2' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
```

### 5.2 Core UI Components

**Button Component:**
```typescript
// components/ui/button.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary-900 text-white hover:bg-primary-800 focus-visible:ring-primary-500',
        secondary: 'bg-secondary-500 text-white hover:bg-secondary-600 focus-visible:ring-secondary-400',
        outline: 'border-2 border-primary-900 text-primary-900 hover:bg-primary-50',
        ghost: 'text-primary-900 hover:bg-primary-50',
        link: 'text-primary-700 underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-11 px-4 text-base',
        lg: 'h-13 px-6 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
```

---

## 6. API Integrations

### 6.1 Google Maps Configuration

```typescript
// lib/google-maps.ts
export const SALONTA_CENTER = {
  lat: 46.8,
  lng: 21.65,
};

export const SALONTA_BOUNDS = {
  north: 46.85,
  south: 46.75,
  east: 21.72,
  west: 21.58,
};

// City boundary polygon (approximate - needs real GeoJSON data)
export const SALONTA_POLYGON = [
  { lat: 46.82, lng: 21.60 },
  { lat: 46.84, lng: 21.62 },
  { lat: 46.83, lng: 21.68 },
  { lat: 46.80, lng: 21.70 },
  { lat: 46.77, lng: 21.68 },
  { lat: 46.76, lng: 21.63 },
  { lat: 46.78, lng: 21.59 },
  { lat: 46.82, lng: 21.60 },
];

export const MAP_STYLES = [
  {
    featureType: 'all',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#1e3a5f' }],
  },
  // Add more custom styles for a branded look
];
```

**Map Component:**
```typescript
// components/features/city-map.tsx
'use client';

import { GoogleMap, LoadScript, Polygon } from '@react-google-maps/api';
import { SALONTA_CENTER, SALONTA_POLYGON, MAP_STYLES } from '@/lib/google-maps';

const containerStyle = {
  width: '100%',
  height: '500px',
};

export function CityMap() {
  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={SALONTA_CENTER}
        zoom={13}
        options={{
          styles: MAP_STYLES,
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        }}
      >
        <Polygon
          paths={SALONTA_POLYGON}
          options={{
            fillColor: '#1e3a5f',
            fillOpacity: 0.1,
            strokeColor: '#1e3a5f',
            strokeOpacity: 0.8,
            strokeWeight: 2,
          }}
        />
      </GoogleMap>
    </LoadScript>
  );
}
```

### 6.2 CCTV Camera Integration

```typescript
// components/features/webcam-embed.tsx
'use client';

interface WebcamEmbedProps {
  title: string;
  streamUrl: string;
  description?: string;
}

export function WebcamEmbed({ title, streamUrl, description }: WebcamEmbedProps) {
  return (
    <div className="rounded-xl overflow-hidden bg-white shadow-card">
      <div className="aspect-video bg-gray-900">
        <iframe
          src={streamUrl}
          title={title}
          className="w-full h-full"
          allow="autoplay; fullscreen"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <h3 className="font-heading text-lg font-semibold text-primary-900">
          {title}
        </h3>
        {description && (
          <p className="mt-1 text-sm text-gray-600">{description}</p>
        )}
        <p className="mt-2 text-xs text-gray-500">
          Pentru vizualizare optimă, instalați{' '}
          <a
            href="https://www.videolan.org/vlc/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-700 hover:underline"
          >
            VLC Player
          </a>
        </p>
      </div>
    </div>
  );
}
```

### 6.3 Webcam Configuration

```typescript
// lib/constants/webcams.ts
export const WEBCAMS = [
  {
    id: 'arany-janos',
    slug: 'casa-memoriala-arany-janos',
    streamUrl: 'https://www.ipcamlive.com/casaaranyjanos',
    translations: {
      ro: {
        title: 'Casa Memorială "Arany János"',
        description: 'Vizualizare live a Complexului Muzeal Arany János',
      },
      hu: {
        title: 'Arany János Emlékmúzeum',
        description: 'Élő közvetítés az Arany János Emlékmúzeumból',
      },
      en: {
        title: 'Arany János Memorial House',
        description: 'Live view of the Arany János Museum Complex',
      },
    },
  },
  {
    id: 'nuca-de-aur',
    slug: 'parcul-nuca-de-aur',
    streamUrl: 'https://www.ipcamlive.com/aranydio1',
    translations: {
      ro: {
        title: 'Parcul "Nuca de Aur"',
        description: 'Vizualizare live a parcului Nuca de Aur',
      },
      hu: {
        title: '"Arany Dió" Park',
        description: 'Élő közvetítés az Arany Dió parkból',
      },
      en: {
        title: '"Golden Walnut" Park',
        description: 'Live view of the Golden Walnut Park',
      },
    },
  },
];
```

---

## 7. Accessibility Implementation

### 7.1 Accessibility Toolbar Component

```typescript
// components/features/accessibility-toolbar.tsx
'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  ZoomIn,
  ZoomOut,
  Contrast,
  Type,
  Link2,
  RotateCcw,
  Accessibility,
  X,
} from 'lucide-react';

interface AccessibilitySettings {
  fontSize: number;
  grayscale: boolean;
  highContrast: boolean;
  negativeContrast: boolean;
  lightBackground: boolean;
  underlineLinks: boolean;
  readableFont: boolean;
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 100,
  grayscale: false,
  highContrast: false,
  negativeContrast: false,
  lightBackground: false,
  underlineLinks: false,
  readableFont: false,
};

export function AccessibilityToolbar() {
  const t = useTranslations('accessibility');
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);

  useEffect(() => {
    // Load settings from localStorage
    const saved = localStorage.getItem('accessibility-settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    // Apply settings to document
    const html = document.documentElement;
    
    html.style.fontSize = `${settings.fontSize}%`;
    html.classList.toggle('grayscale', settings.grayscale);
    html.classList.toggle('high-contrast', settings.highContrast);
    html.classList.toggle('negative-contrast', settings.negativeContrast);
    html.classList.toggle('light-background', settings.lightBackground);
    html.classList.toggle('underline-links', settings.underlineLinks);
    html.classList.toggle('readable-font', settings.readableFont);

    // Save to localStorage
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <>
      {/* Toggle Button - Fixed Position */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed left-0 top-1/4 z-50 bg-primary-900 text-white p-3 rounded-r-lg shadow-lg hover:bg-primary-800 transition-colors"
        aria-label={t('title')}
      >
        <Accessibility className="w-6 h-6" />
      </button>

      {/* Toolbar Panel */}
      {isOpen && (
        <div className="fixed left-0 top-0 z-50 h-full w-80 bg-white shadow-2xl overflow-y-auto">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold text-primary-900">
              {t('title')}
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 space-y-4">
            {/* Font Size */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Text Size: {settings.fontSize}%
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => updateSetting('fontSize', Math.max(80, settings.fontSize - 10))}
                  className="flex-1 flex items-center justify-center gap-2 p-2 border rounded-lg hover:bg-gray-50"
                >
                  <ZoomOut className="w-4 h-4" />
                  {t('decreaseText')}
                </button>
                <button
                  onClick={() => updateSetting('fontSize', Math.min(150, settings.fontSize + 10))}
                  className="flex-1 flex items-center justify-center gap-2 p-2 border rounded-lg hover:bg-gray-50"
                >
                  <ZoomIn className="w-4 h-4" />
                  {t('increaseText')}
                </button>
              </div>
            </div>

            {/* Toggle Options */}
            {[
              { key: 'grayscale', label: t('grayscale'), icon: Contrast },
              { key: 'highContrast', label: t('highContrast'), icon: Contrast },
              { key: 'negativeContrast', label: t('negativeContrast'), icon: Contrast },
              { key: 'lightBackground', label: t('lightBackground'), icon: Contrast },
              { key: 'underlineLinks', label: t('underlineLinks'), icon: Link2 },
              { key: 'readableFont', label: t('readableFont'), icon: Type },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => updateSetting(key as keyof AccessibilitySettings, !settings[key as keyof AccessibilitySettings])}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                  settings[key as keyof AccessibilitySettings]
                    ? 'bg-primary-100 border-primary-500 text-primary-900'
                    : 'hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </button>
            ))}

            {/* Reset Button */}
            <button
              onClick={resetSettings}
              className="w-full flex items-center justify-center gap-2 p-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
            >
              <RotateCcw className="w-4 h-4" />
              {t('reset')}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
```

### 7.2 Accessibility CSS Classes

```css
/* globals.css - Accessibility Styles */

/* Grayscale Mode */
html.grayscale {
  filter: grayscale(100%);
}

/* High Contrast Mode */
html.high-contrast {
  filter: contrast(1.5);
}

html.high-contrast * {
  border-color: #000 !important;
}

/* Negative Contrast Mode */
html.negative-contrast {
  filter: invert(100%);
}

html.negative-contrast img,
html.negative-contrast video {
  filter: invert(100%);
}

/* Light Background Mode */
html.light-background {
  background-color: #fff !important;
}

html.light-background * {
  background-color: #fff !important;
  color: #000 !important;
}

/* Underline Links */
html.underline-links a {
  text-decoration: underline !important;
}

/* Readable Font */
html.readable-font * {
  font-family: Arial, sans-serif !important;
  letter-spacing: 0.05em !important;
  word-spacing: 0.1em !important;
  line-height: 1.8 !important;
}

/* Focus Styles */
:focus-visible {
  outline: 3px solid var(--color-primary-500);
  outline-offset: 2px;
}

/* Skip to Content Link */
.skip-to-content {
  position: absolute;
  left: -9999px;
  z-index: 999;
  padding: 1rem;
  background: var(--color-primary-900);
  color: white;
}

.skip-to-content:focus {
  left: 0;
}
```

---

## 8. Performance Optimization

### 8.1 Image Optimization

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns'],
  },
};

export default nextConfig;
```

### 8.2 Caching Strategy

```typescript
// app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { path, tag, secret } = await request.json();

  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }

  if (path) {
    revalidatePath(path);
  }

  if (tag) {
    revalidateTag(tag);
  }

  return NextResponse.json({ revalidated: true });
}
```

---

## 9. Security Measures

### 9.1 Security Headers

```typescript
// next.config.ts
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com https://www.ipcamlive.com;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      img-src 'self' data: https: blob:;
      font-src 'self' https://fonts.gstatic.com;
      frame-src https://www.ipcamlive.com https://www.google.com;
      connect-src 'self' https://*.supabase.co https://maps.googleapis.com;
    `.replace(/\s{2,}/g, ' ').trim(),
  },
];

const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};
```

### 9.2 Input Validation

```typescript
// lib/validations/contact.ts
import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z.string()
    .email('Please enter a valid email address'),
  phone: z.string()
    .regex(/^(\+40|0)[0-9]{9}$/, 'Please enter a valid Romanian phone number')
    .optional()
    .or(z.literal('')),
  subject: z.string()
    .min(5, 'Subject must be at least 5 characters')
    .max(200, 'Subject must be less than 200 characters'),
  message: z.string()
    .min(20, 'Message must be at least 20 characters')
    .max(5000, 'Message must be less than 5000 characters'),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
```

---

## 10. Deployment Strategy

### 10.1 Vercel Configuration

```json
// vercel.json
{
  "framework": "nextjs",
  "regions": ["fra1"],
  "env": {
    "NEXT_PUBLIC_SITE_URL": "https://primaria-salonta.vercel.app"
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Credentials", "value": "true" },
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET,POST,PUT,DELETE,OPTIONS" },
        { "key": "Access-Control-Allow-Headers", "value": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" }
      ]
    }
  ]
}
```

### 10.2 CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linting
        run: npm run lint
      
      - name: Run type check
        run: npm run type-check
      
      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
          NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: ${{ secrets.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY }}
```

---

## 11. Database Schema

See Section 3.1 for the complete database schema.

### 11.1 Document Categories

```typescript
// lib/constants/document-categories.ts
export const DOCUMENT_CATEGORIES = {
  // Monitorul Oficial Local
  MOL_STATUT: 'mol-statut',
  MOL_REGULAMENTE: 'mol-regulamente',
  MOL_HOTARARI: 'mol-hotarari',
  MOL_DISPOZITII: 'mol-dispozitii',
  MOL_FINANCIAR: 'mol-financiar',
  MOL_ALTE: 'mol-alte',
  
  // Financial
  BUDGET: 'budget',
  AUDIT: 'audit',
  FINANCIAL_REPORTS: 'financial-reports',
  
  // Public Procurement
  PROCUREMENT: 'procurement',
  AUCTIONS: 'auctions',
  
  // Urban Planning
  BUILDING_PERMITS: 'building-permits',
  URBANISM_CERTIFICATES: 'urbanism-certificates',
  URBAN_PLANS: 'urban-plans',
  
  // Transparency
  WEALTH_DECLARATIONS: 'wealth-declarations',
  PUBLIC_DEBATES: 'public-debates',
  ANNUAL_REPORTS: 'annual-reports',
  
  // Council
  COUNCIL_DECISIONS: 'council-decisions',
  COUNCIL_AGENDAS: 'council-agendas',
  COUNCIL_MINUTES: 'council-minutes',
  
  // Other
  FORMS: 'forms',
  REGULATIONS: 'regulations',
  STRATEGIES: 'strategies',
} as const;
```

---

## 12. Development Guidelines

### 12.1 Code Style

- Use TypeScript strict mode
- Follow ESLint and Prettier configurations
- Use meaningful component and function names
- Add JSDoc comments for complex functions
- Keep components small and focused

### 12.2 Git Workflow

```
main           - Production branch
├── develop    - Development branch
├── feature/*  - Feature branches
├── fix/*      - Bug fix branches
└── hotfix/*   - Production hotfixes
```

### 12.3 Commit Convention

```
feat: Add new feature
fix: Bug fix
docs: Documentation changes
style: Code style changes (formatting, etc.)
refactor: Code refactoring
perf: Performance improvements
test: Add or update tests
chore: Maintenance tasks
```

### 12.4 Testing Strategy

```typescript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
};
```

---

## Appendix: Quick Reference

### A. Environment Variables Checklist

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase service role key (server-side only) |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | ✅ | Google Maps API key |
| `NEXT_PUBLIC_SITE_URL` | ✅ | Production website URL |
| `SMTP_HOST` | ⚡ | Email server host |
| `SMTP_PORT` | ⚡ | Email server port |
| `SMTP_USER` | ⚡ | Email username |
| `SMTP_PASSWORD` | ⚡ | Email password |
| `REVALIDATION_SECRET` | ⚡ | Secret for on-demand revalidation |
| `NEXT_PUBLIC_GA_ID` | ❓ | Google Analytics ID |

✅ = Required | ⚡ = Required for specific features | ❓ = Optional

### B. Useful Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript check

# Supabase
npx supabase login   # Login to Supabase
npx supabase init    # Initialize Supabase
npx supabase db push # Push schema changes
npx supabase gen types typescript --linked > types/database.ts
```

---

*Document Version: 1.0*
*Last Updated: December 25, 2025*
*Author: Development Team*

