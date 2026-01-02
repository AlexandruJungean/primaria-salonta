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
    "@google-cloud/translate": "^8.x",
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
    "next-seo": "^6.x",
    "react-google-recaptcha-v3": "^1.x"
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
├── i18n/
│   ├── routing.ts                   # Locale routing configuration
│   ├── request.ts                   # Request-based i18n setup
│   └── navigation.ts                # Navigation helpers
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

# Google Cloud Translation API
GOOGLE_TRANSLATE_API_KEY=AIzaxxx...

# App Configuration
NEXT_PUBLIC_SITE_URL=https://salonta.ro
NEXT_PUBLIC_DEFAULT_LOCALE=ro

# Google reCAPTCHA v3
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Lexxx...
RECAPTCHA_SECRET_KEY=6Lexxx...

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

-- ============================================
-- ADDITIONAL TABLES FOR ADMIN DASHBOARD
-- ============================================

-- ============================================
-- NEWS/ARTICLES WITH PAGE BUILDER STRUCTURE
-- ============================================

-- News articles - main table
CREATE TABLE news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('anunturi', 'consiliu', 'proiecte', 'stiri', 'comunicate')),
  featured_image_url TEXT,
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  -- Author information
  author_name TEXT,
  author_role TEXT,
  author_photo_url TEXT,
  -- Romanian (primary)
  title_ro TEXT NOT NULL,
  excerpt_ro TEXT,
  meta_title_ro TEXT,
  meta_description_ro TEXT,
  -- Hungarian (auto-translated)
  title_hu TEXT,
  excerpt_hu TEXT,
  meta_title_hu TEXT,
  meta_description_hu TEXT,
  -- English (auto-translated)
  title_en TEXT,
  excerpt_en TEXT,
  meta_title_en TEXT,
  meta_description_en TEXT,
  -- Translation status
  translation_status TEXT DEFAULT 'pending' CHECK (translation_status IN ('pending', 'completed', 'failed', 'manual')),
  translated_at TIMESTAMPTZ,
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- News content sections/blocks (page builder)
-- Allows building articles with multiple content blocks in custom order
CREATE TABLE news_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  news_id UUID REFERENCES news(id) ON DELETE CASCADE,
  section_type TEXT NOT NULL CHECK (section_type IN (
    'text',           -- Rich text paragraph
    'heading',        -- H2, H3, H4 heading
    'image',          -- Single image with caption
    'gallery',        -- Multiple images in grid
    'quote',          -- Blockquote
    'list',           -- Bullet or numbered list
    'video',          -- Embedded video (YouTube, etc.)
    'document',       -- PDF/document download link
    'divider',        -- Visual separator
    'callout',        -- Highlighted info box
    'table'           -- Data table
  )),
  sort_order INTEGER NOT NULL DEFAULT 0,
  -- Romanian content (primary)
  content_ro TEXT,
  -- Hungarian (auto-translated)
  content_hu TEXT,
  -- English (auto-translated)
  content_en TEXT,
  -- Additional metadata (JSON for flexibility)
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- News section images (for gallery sections or inline images)
CREATE TABLE news_section_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID REFERENCES news_sections(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  -- Romanian (primary)
  alt_text_ro TEXT,
  caption_ro TEXT,
  -- Hungarian (auto-translated)
  alt_text_hu TEXT,
  caption_hu TEXT,
  -- English (auto-translated)
  alt_text_en TEXT,
  caption_en TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- News tags for categorization and filtering
CREATE TABLE news_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name_ro TEXT NOT NULL,
  name_hu TEXT,
  name_en TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Junction table for news-tags relationship
CREATE TABLE news_tags_junction (
  news_id UUID REFERENCES news(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES news_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (news_id, tag_id)
);

-- Index for faster news queries
CREATE INDEX idx_news_published ON news(published, published_at DESC);
CREATE INDEX idx_news_category ON news(category);
CREATE INDEX idx_news_featured ON news(featured) WHERE featured = true;
CREATE INDEX idx_news_sections_order ON news_sections(news_id, sort_order);

-- ============================================
-- REGIONAL PROGRAM NORD-VEST 2021-2027
-- ============================================

-- Main projects table
CREATE TABLE regional_program_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  smis_code TEXT UNIQUE NOT NULL,
  icon_name TEXT DEFAULT 'building2',
  color TEXT DEFAULT 'blue',
  status TEXT DEFAULT 'in_implementare' CHECK (status IN ('in_implementare', 'finalizat', 'anulat')),
  -- Financial values (in RON)
  total_value DECIMAL(15,2),
  eligible_value DECIMAL(15,2),
  fedr_value DECIMAL(15,2),
  national_budget_value DECIMAL(15,2),
  -- Romanian (primary - project titles are official)
  title_ro TEXT NOT NULL,
  short_title_ro TEXT NOT NULL,
  description_ro TEXT,
  -- Hungarian (auto-translated)
  title_hu TEXT,
  short_title_hu TEXT,
  description_hu TEXT,
  -- English (auto-translated)
  title_en TEXT,
  short_title_en TEXT,
  description_en TEXT,
  -- Translation status
  translation_status TEXT DEFAULT 'pending',
  -- Timestamps
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Project documents (press releases, reports, etc.)
CREATE TABLE regional_program_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES regional_program_projects(id) ON DELETE CASCADE,
  document_type TEXT DEFAULT 'comunicat' CHECK (document_type IN ('comunicat', 'raport', 'contract', 'anexa', 'altele')),
  file_url TEXT NOT NULL,
  document_date DATE,
  sort_order INTEGER DEFAULT 0,
  -- Romanian (primary)
  title_ro TEXT NOT NULL,
  -- Hungarian (auto-translated)
  title_hu TEXT,
  -- English (auto-translated)
  title_en TEXT,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Project status updates (timeline/progress reports)
CREATE TABLE regional_program_status_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES regional_program_projects(id) ON DELETE CASCADE,
  status_category TEXT NOT NULL CHECK (status_category IN ('4_luni', '6_luni', 'trimestrial', 'anual', 'altele')),
  period_label TEXT NOT NULL, -- e.g., "August 2024", "Octombrie 2024"
  update_date DATE NOT NULL,
  sort_order INTEGER DEFAULT 0,
  -- Romanian (primary)
  title_ro TEXT NOT NULL,
  content_ro TEXT,
  -- Hungarian (auto-translated)
  title_hu TEXT,
  content_hu TEXT,
  -- English (auto-translated)
  title_en TEXT,
  content_en TEXT,
  translation_status TEXT DEFAULT 'pending',
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Status update images (photos of work progress)
CREATE TABLE regional_program_status_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status_update_id UUID REFERENCES regional_program_status_updates(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  -- Romanian (primary)
  caption_ro TEXT,
  alt_text_ro TEXT,
  -- Hungarian (auto-translated)
  caption_hu TEXT,
  alt_text_hu TEXT,
  -- English (auto-translated)
  caption_en TEXT,
  alt_text_en TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for regional program queries
CREATE INDEX idx_regional_projects_status ON regional_program_projects(status);
CREATE INDEX idx_regional_documents_project ON regional_program_documents(project_id, sort_order);
CREATE INDEX idx_regional_updates_project ON regional_program_status_updates(project_id, sort_order);

-- ============================================
-- LOCAL PROJECTS (Proiecte Locale)
-- ============================================

-- Local projects by year
CREATE TABLE local_projects_years (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year INTEGER UNIQUE NOT NULL,
  results_date DATE,
  guide_title TEXT,
  guide_date DATE,
  logo_url TEXT,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Local project results (per year)
CREATE TABLE local_project_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year_id UUID REFERENCES local_projects_years(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('cultura', 'mediu', 'sport')),
  title_ro TEXT NOT NULL,
  file_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Local project documents (forms, guides, annexes per year and category)
CREATE TABLE local_project_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year_id UUID REFERENCES local_projects_years(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('cultura', 'mediu', 'sport', 'social', 'special')),
  title_ro TEXT NOT NULL,
  file_url TEXT NOT NULL,
  notice TEXT, -- e.g., "Atenție! Ghidul este actualizat!"
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Council Decisions (HCL) - Romanian only
CREATE TABLE council_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_number TEXT NOT NULL,
  decision_date DATE NOT NULL,
  year INTEGER NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  decision_pdf_url TEXT,
  minutes_pdf_url TEXT,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(decision_number, year)
);

-- Mayor's Dispositions - Romanian only
CREATE TABLE dispositions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  disposition_number TEXT NOT NULL,
  disposition_date DATE NOT NULL,
  year INTEGER NOT NULL,
  title TEXT NOT NULL,
  pdf_url TEXT,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(disposition_number, year)
);

-- Regulations - Romanian only
CREATE TABLE regulations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  pdf_url TEXT NOT NULL,
  effective_date DATE,
  published BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Council Meeting Minutes - Romanian only
CREATE TABLE council_minutes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_date DATE NOT NULL,
  session_type TEXT NOT NULL CHECK (session_type IN ('ordinara', 'extraordinara')),
  title TEXT NOT NULL,
  pdf_url TEXT,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Council Sessions/Meetings (Ședințe) - Romanian only
CREATE TABLE council_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_date DATE NOT NULL,
  session_time TIME NOT NULL,
  session_type TEXT DEFAULT 'ordinara' CHECK (session_type IN ('ordinara', 'extraordinara')),
  convocation_pdf_url TEXT, -- Dispoziție convocare
  zoom_url TEXT, -- Live stream URL
  meeting_id TEXT, -- Zoom Meeting ID
  passcode TEXT, -- Zoom Passcode
  agenda_pdf_url TEXT, -- Ordine de zi PDF
  minutes_pdf_url TEXT, -- Proces verbal
  is_live BOOLEAN DEFAULT false, -- Currently streaming
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Local Council Members (Councilors) - Romanian only (names don't translate)
CREATE TABLE councilors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  party TEXT NOT NULL, -- UDMR, PSD, PNL, USR, etc.
  email TEXT,
  phone TEXT,
  photo_url TEXT,
  mandate_start DATE,
  mandate_end DATE,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Specialty Committees/Commissions - Auto-translated
CREATE TABLE council_commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Romanian (primary)
  name_ro TEXT NOT NULL,
  -- Hungarian (auto-translated or manual)
  name_hu TEXT,
  -- English (auto-translated or manual)
  name_en TEXT,
  color TEXT DEFAULT 'bg-primary-600', -- Tailwind color class
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Commission Members (junction table)
CREATE TABLE commission_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commission_id UUID REFERENCES council_commissions(id) ON DELETE CASCADE,
  councilor_id UUID REFERENCES councilors(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'membru' CHECK (role IN ('presedinte', 'vicepresedinte', 'secretar', 'membru')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(commission_id, councilor_id)
);

-- Councilor Declarations (wealth & interests) - Romanian only
CREATE TABLE councilor_declarations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  councilor_id UUID REFERENCES councilors(id) ON DELETE CASCADE,
  declaration_type TEXT NOT NULL CHECK (declaration_type IN ('avere', 'interese')),
  year INTEGER NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('alesi_locali', 'functionari_publici')),
  context TEXT, -- 'pt. începerea mandatului', 'pt. încetare', etc.
  pdf_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Budget Documents - Romanian only
CREATE TABLE budget_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year INTEGER NOT NULL,
  document_type TEXT NOT NULL CHECK (document_type IN ('buget', 'executie', 'rectificare', 'cont_executie')),
  quarter INTEGER, -- For quarterly reports
  title TEXT NOT NULL,
  pdf_url TEXT NOT NULL,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Job Vacancies/Competitions - Auto-translated
CREATE TABLE job_vacancies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department TEXT NOT NULL,
  deadline DATE NOT NULL,
  status TEXT DEFAULT 'activ' CHECK (status IN ('activ', 'inchis', 'anulat')),
  -- Romanian (primary)
  title_ro TEXT NOT NULL,
  requirements_ro TEXT,
  description_ro TEXT,
  -- Hungarian (auto-translated)
  title_hu TEXT,
  requirements_hu TEXT,
  description_hu TEXT,
  -- English (auto-translated)
  title_en TEXT,
  requirements_en TEXT,
  description_en TEXT,
  announcement_pdf_url TEXT,
  results_pdf_url TEXT,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Wealth Declarations - Romanian only
CREATE TABLE wealth_declarations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_name TEXT NOT NULL,
  position TEXT NOT NULL,
  year INTEGER NOT NULL,
  declaration_type TEXT NOT NULL CHECK (declaration_type IN ('avere', 'interese')),
  pdf_url TEXT NOT NULL,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Building Permits - Romanian only
CREATE TABLE building_permits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  permit_number TEXT NOT NULL,
  issue_date DATE NOT NULL,
  year INTEGER NOT NULL,
  address TEXT NOT NULL,
  owner TEXT,
  project_description TEXT,
  pdf_url TEXT,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Urbanism Certificates - Romanian only
CREATE TABLE urbanism_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_number TEXT NOT NULL,
  issue_date DATE NOT NULL,
  year INTEGER NOT NULL,
  address TEXT NOT NULL,
  purpose TEXT,
  pdf_url TEXT,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Urban Plans (PUZ/PUD/PUG) - Romanian only
CREATE TABLE urban_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_type TEXT NOT NULL CHECK (plan_type IN ('PUG', 'PUZ', 'PUD')),
  title TEXT NOT NULL,
  location TEXT,
  status TEXT DEFAULT 'in_lucru' CHECK (status IN ('in_lucru', 'aprobat', 'respins')),
  approval_decision TEXT, -- HCL reference
  pdf_url TEXT,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Public Acquisitions - Romanian only
CREATE TABLE public_acquisitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  acquisition_type TEXT NOT NULL CHECK (acquisition_type IN ('achizitie_directa', 'licitatie', 'cerere_oferte')),
  title TEXT NOT NULL,
  description TEXT,
  estimated_value DECIMAL(15,2),
  deadline DATE,
  status TEXT DEFAULT 'activ' CHECK (status IN ('activ', 'inchis', 'anulat', 'atribuit')),
  documentation_pdf_url TEXT,
  result_pdf_url TEXT,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Downloadable Forms - Romanian only
CREATE TABLE downloadable_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  pdf_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Transparency Reports - Romanian only
CREATE TABLE transparency_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_type TEXT NOT NULL CHECK (report_type IN ('raport_anual', 'dezbatere_publica', 'buletin_informativ')),
  year INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  pdf_url TEXT,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- COVID Updates (archived) - Auto-translated
CREATE TABLE covid_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  update_date DATE NOT NULL,
  -- Romanian (primary)
  title_ro TEXT NOT NULL,
  content_ro TEXT NOT NULL,
  -- Hungarian (auto-translated)
  title_hu TEXT,
  content_hu TEXT,
  -- English (auto-translated)
  title_en TEXT,
  content_en TEXT,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 3.2 Row Level Security (RLS) Policies

**Security Model:**
- ✅ **Public Read Access**: All published content is readable without authentication
- 🔐 **Admin Write Access**: Only users with ADMIN role can insert/update/delete
- 🛡️ **RLS Enforcement**: Policies enforced at database level (cannot be bypassed)

```sql
-- ============================================
-- ADMIN USERS TABLE
-- ============================================

CREATE TABLE admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Only admins can view admin users list
CREATE POLICY "Admins can view admin users"
ON admin_users FOR SELECT
USING (
  auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true)
);

-- Only super_admin can manage admin users
CREATE POLICY "Super admins can manage admin users"
ON admin_users FOR ALL
USING (
  auth.uid() IN (SELECT id FROM admin_users WHERE role = 'super_admin' AND is_active = true)
);

-- ============================================
-- HELPER FUNCTION: Check if user is admin
-- ============================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = auth.uid() 
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- RLS POLICIES FOR ALL CONTENT TABLES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE council_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispositions ENABLE ROW LEVEL SECURITY;
ALTER TABLE regulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE building_permits ENABLE ROW LEVEL SECURITY;
ALTER TABLE urbanism_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE urban_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_vacancies ENABLE ROW LEVEL SECURITY;
ALTER TABLE councilors ENABLE ROW LEVEL SECURITY;
ALTER TABLE council_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE councilor_declarations ENABLE ROW LEVEL SECURITY;
ALTER TABLE wealth_declarations ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloadable_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE regional_program_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE regional_program_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE local_projects_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE transparency_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE petitions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- TEMPLATE: Apply to ALL content tables
-- ============================================

-- DOCUMENTS TABLE (example - repeat for all tables)
-- Public can view all published documents (no auth required)
CREATE POLICY "Public read access for documents"
ON documents FOR SELECT
USING (published = true);

-- Admins can view all documents (including unpublished)
CREATE POLICY "Admin read all documents"
ON documents FOR SELECT
USING (is_admin());

-- Admins can insert documents
CREATE POLICY "Admin insert documents"
ON documents FOR INSERT
WITH CHECK (is_admin());

-- Admins can update documents
CREATE POLICY "Admin update documents"
ON documents FOR UPDATE
USING (is_admin())
WITH CHECK (is_admin());

-- Admins can delete documents
CREATE POLICY "Admin delete documents"
ON documents FOR DELETE
USING (is_admin());

-- ============================================
-- APPLY SAME PATTERN TO ALL TABLES
-- ============================================

-- NEWS
CREATE POLICY "Public read news" ON news FOR SELECT USING (published = true);
CREATE POLICY "Admin read all news" ON news FOR SELECT USING (is_admin());
CREATE POLICY "Admin insert news" ON news FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin update news" ON news FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin delete news" ON news FOR DELETE USING (is_admin());

-- COUNCIL_DECISIONS
CREATE POLICY "Public read council_decisions" ON council_decisions FOR SELECT USING (published = true);
CREATE POLICY "Admin read all council_decisions" ON council_decisions FOR SELECT USING (is_admin());
CREATE POLICY "Admin insert council_decisions" ON council_decisions FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin update council_decisions" ON council_decisions FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin delete council_decisions" ON council_decisions FOR DELETE USING (is_admin());

-- DISPOSITIONS
CREATE POLICY "Public read dispositions" ON dispositions FOR SELECT USING (published = true);
CREATE POLICY "Admin read all dispositions" ON dispositions FOR SELECT USING (is_admin());
CREATE POLICY "Admin insert dispositions" ON dispositions FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin update dispositions" ON dispositions FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin delete dispositions" ON dispositions FOR DELETE USING (is_admin());

-- BUDGET_DOCUMENTS
CREATE POLICY "Public read budget_documents" ON budget_documents FOR SELECT USING (published = true);
CREATE POLICY "Admin read all budget_documents" ON budget_documents FOR SELECT USING (is_admin());
CREATE POLICY "Admin insert budget_documents" ON budget_documents FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin update budget_documents" ON budget_documents FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin delete budget_documents" ON budget_documents FOR DELETE USING (is_admin());

-- COUNCILORS (always public - no published flag needed)
CREATE POLICY "Public read councilors" ON councilors FOR SELECT USING (true);
CREATE POLICY "Admin insert councilors" ON councilors FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin update councilors" ON councilors FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin delete councilors" ON councilors FOR DELETE USING (is_admin());

-- GALLERY_ALBUMS
CREATE POLICY "Public read gallery_albums" ON gallery_albums FOR SELECT USING (published = true);
CREATE POLICY "Admin read all gallery_albums" ON gallery_albums FOR SELECT USING (is_admin());
CREATE POLICY "Admin insert gallery_albums" ON gallery_albums FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin update gallery_albums" ON gallery_albums FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin delete gallery_albums" ON gallery_albums FOR DELETE USING (is_admin());

-- GALLERY_IMAGES (public if album is public)
CREATE POLICY "Public read gallery_images" ON gallery_images FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM gallery_albums 
    WHERE gallery_albums.id = gallery_images.album_id 
    AND gallery_albums.published = true
  )
);
CREATE POLICY "Admin manage gallery_images" ON gallery_images FOR ALL USING (is_admin());

-- CONTACT_SUBMISSIONS (only admins can view, anyone can insert)
CREATE POLICY "Public insert contact" ON contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read contact" ON contact_submissions FOR SELECT USING (is_admin());
CREATE POLICY "Admin update contact" ON contact_submissions FOR UPDATE USING (is_admin());
CREATE POLICY "Admin delete contact" ON contact_submissions FOR DELETE USING (is_admin());

-- PETITIONS (similar to contact)
CREATE POLICY "Public insert petitions" ON petitions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read petitions" ON petitions FOR SELECT USING (is_admin());
CREATE POLICY "Admin update petitions" ON petitions FOR UPDATE USING (is_admin());
CREATE POLICY "Admin delete petitions" ON petitions FOR DELETE USING (is_admin());

-- Repeat similar patterns for all other tables...
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

### 3.4 Storage Bucket Policies

```sql
-- Public read access for all public buckets
CREATE POLICY "Public read documents"
ON storage.objects FOR SELECT
USING (bucket_id IN ('documents', 'images', 'gallery', 'avatars'));

-- Admin upload/delete access
CREATE POLICY "Admin upload files"
ON storage.objects FOR INSERT
WITH CHECK (is_admin());

CREATE POLICY "Admin update files"
ON storage.objects FOR UPDATE
USING (is_admin());

CREATE POLICY "Admin delete files"
ON storage.objects FOR DELETE
USING (is_admin());
```

---

## 3.5 File Compression & Upload Service

### 3.5.1 Image Compression Service

```typescript
// lib/services/image-compression.ts
import imageCompression from 'browser-image-compression';

interface CompressionOptions {
  maxSizeMB: number;
  maxWidthOrHeight: number;
  useWebWorker: boolean;
  fileType: 'image/webp' | 'image/jpeg' | 'image/png';
  initialQuality: number;
}

const DEFAULT_OPTIONS: CompressionOptions = {
  maxSizeMB: 0.5,           // 500KB max
  maxWidthOrHeight: 1920,   // Max dimension
  useWebWorker: true,       // Use web worker for performance
  fileType: 'image/webp',   // Convert to WebP
  initialQuality: 0.8,      // 80% quality
};

export interface CompressionResult {
  originalFile: File;
  compressedFile: File;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}

export async function compressImage(
  file: File,
  options: Partial<CompressionOptions> = {}
): Promise<CompressionResult> {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  
  const originalSize = file.size;
  
  try {
    const compressedFile = await imageCompression(file, {
      maxSizeMB: mergedOptions.maxSizeMB,
      maxWidthOrHeight: mergedOptions.maxWidthOrHeight,
      useWebWorker: mergedOptions.useWebWorker,
      fileType: mergedOptions.fileType,
      initialQuality: mergedOptions.initialQuality,
    });

    // Rename file with .webp extension
    const newFileName = file.name.replace(/\.[^/.]+$/, '.webp');
    const renamedFile = new File([compressedFile], newFileName, {
      type: 'image/webp',
    });

    return {
      originalFile: file,
      compressedFile: renamedFile,
      originalSize,
      compressedSize: renamedFile.size,
      compressionRatio: ((originalSize - renamedFile.size) / originalSize) * 100,
    };
  } catch (error) {
    console.error('Image compression failed:', error);
    throw error;
  }
}

export async function compressImages(
  files: File[],
  options?: Partial<CompressionOptions>,
  onProgress?: (progress: number, current: number, total: number) => void
): Promise<CompressionResult[]> {
  const results: CompressionResult[] = [];
  
  for (let i = 0; i < files.length; i++) {
    const result = await compressImage(files[i], options);
    results.push(result);
    onProgress?.(((i + 1) / files.length) * 100, i + 1, files.length);
  }
  
  return results;
}
```

### 3.5.2 PDF Optimization Service (Server-Side)

```typescript
// lib/services/pdf-compression.ts
// Note: PDF compression happens on the server using pdf-lib

import { PDFDocument } from 'pdf-lib';

export interface PDFCompressionResult {
  originalSize: number;
  compressedSize: number;
  compressedBuffer: ArrayBuffer;
}

export async function compressPDF(
  pdfBuffer: ArrayBuffer
): Promise<PDFCompressionResult> {
  const originalSize = pdfBuffer.byteLength;
  
  // Load the PDF
  const pdfDoc = await PDFDocument.load(pdfBuffer, {
    ignoreEncryption: true,
  });
  
  // Save with compression options
  const compressedBytes = await pdfDoc.save({
    useObjectStreams: true,      // Compress object streams
    addDefaultPage: false,       // Don't add empty pages
    objectsPerTick: 50,          // Process in batches
  });
  
  return {
    originalSize,
    compressedSize: compressedBytes.byteLength,
    compressedBuffer: compressedBytes.buffer,
  };
}
```

### 3.5.3 File Upload Hook with Compression

```typescript
// hooks/use-file-upload.ts
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { compressImage, CompressionResult } from '@/lib/services/image-compression';

interface UploadOptions {
  bucket: 'documents' | 'images' | 'gallery' | 'avatars';
  path?: string;
  compress?: boolean;
}

interface UploadProgress {
  status: 'idle' | 'compressing' | 'uploading' | 'complete' | 'error';
  progress: number;
  originalSize?: number;
  compressedSize?: number;
  error?: string;
}

interface UploadResult {
  url: string;
  path: string;
  originalSize: number;
  finalSize: number;
}

export function useFileUpload() {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    status: 'idle',
    progress: 0,
  });
  
  const supabase = createClient();

  const uploadFile = async (
    file: File,
    options: UploadOptions
  ): Promise<UploadResult> => {
    const { bucket, path = '', compress = true } = options;
    
    let fileToUpload = file;
    let originalSize = file.size;
    
    // Compress images if enabled
    if (compress && file.type.startsWith('image/')) {
      setUploadProgress({
        status: 'compressing',
        progress: 0,
        originalSize: file.size,
      });
      
      const result = await compressImage(file);
      fileToUpload = result.compressedFile;
      
      setUploadProgress({
        status: 'compressing',
        progress: 100,
        originalSize: result.originalSize,
        compressedSize: result.compressedSize,
      });
    }
    
    // Generate unique filename
    const timestamp = Date.now();
    const safeName = fileToUpload.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = path ? `${path}/${timestamp}-${safeName}` : `${timestamp}-${safeName}`;
    
    // Upload to Supabase Storage
    setUploadProgress((prev) => ({
      ...prev,
      status: 'uploading',
      progress: 0,
    }));
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, fileToUpload, {
        cacheControl: '3600',
        upsert: false,
      });
    
    if (error) {
      setUploadProgress({
        status: 'error',
        progress: 0,
        error: error.message,
      });
      throw error;
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);
    
    setUploadProgress({
      status: 'complete',
      progress: 100,
      originalSize,
      compressedSize: fileToUpload.size,
    });
    
    return {
      url: urlData.publicUrl,
      path: data.path,
      originalSize,
      finalSize: fileToUpload.size,
    };
  };

  const uploadFiles = async (
    files: File[],
    options: UploadOptions,
    onProgress?: (current: number, total: number) => void
  ): Promise<UploadResult[]> => {
    const results: UploadResult[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const result = await uploadFile(files[i], options);
      results.push(result);
      onProgress?.(i + 1, files.length);
    }
    
    return results;
  };

  const resetProgress = () => {
    setUploadProgress({ status: 'idle', progress: 0 });
  };

  return {
    uploadFile,
    uploadFiles,
    uploadProgress,
    resetProgress,
  };
}
```

### 3.5.4 Required Dependencies

```bash
npm install browser-image-compression pdf-lib
```

---

## 3.6 Admin Confirmation Dialog Component

### 3.6.1 Confirmation Dialog Component

```typescript
// components/admin/confirmation-dialog.tsx
'use client';

import { useState } from 'react';
import { AlertTriangle, Trash2, Edit3, CheckCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

type DialogVariant = 'delete' | 'edit' | 'publish' | 'warning';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  variant?: DialogVariant;
  title: string;
  description: string;
  itemName?: string;
  confirmText?: string;
  cancelText?: string;
  requireTypedConfirmation?: boolean;
  confirmationPhrase?: string;
  isLoading?: boolean;
}

const VARIANT_CONFIG = {
  delete: {
    icon: Trash2,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    buttonBg: 'bg-red-600 hover:bg-red-700',
    buttonText: 'Șterge',
  },
  edit: {
    icon: Edit3,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    buttonBg: 'bg-amber-600 hover:bg-amber-700',
    buttonText: 'Salvează modificările',
  },
  publish: {
    icon: CheckCircle,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    buttonBg: 'bg-green-600 hover:bg-green-700',
    buttonText: 'Publică',
  },
  warning: {
    icon: AlertTriangle,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    buttonBg: 'bg-amber-600 hover:bg-amber-700',
    buttonText: 'Continuă',
  },
};

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  variant = 'warning',
  title,
  description,
  itemName,
  confirmText,
  cancelText = 'Anulează',
  requireTypedConfirmation = false,
  confirmationPhrase = 'CONFIRM',
  isLoading = false,
}: ConfirmationDialogProps) {
  const [typedConfirmation, setTypedConfirmation] = useState('');
  const config = VARIANT_CONFIG[variant];
  const Icon = config.icon;
  
  const canConfirm = requireTypedConfirmation
    ? typedConfirmation === confirmationPhrase
    : true;

  const handleConfirm = async () => {
    if (!canConfirm || isLoading) return;
    await onConfirm();
    setTypedConfirmation('');
  };

  const handleClose = () => {
    if (isLoading) return;
    setTypedConfirmation('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Dialog */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={handleClose}
          disabled={isLoading}
          className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-6">
          {/* Icon */}
          <div className={cn('w-12 h-12 rounded-full flex items-center justify-center mb-4', config.iconBg)}>
            <Icon className={cn('w-6 h-6', config.iconColor)} />
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 mb-4">
            {description}
          </p>

          {/* Item name highlight */}
          {itemName && (
            <div className="bg-gray-100 rounded-lg p-3 mb-4">
              <p className="text-sm font-medium text-gray-800 truncate">
                "{itemName}"
              </p>
            </div>
          )}

          {/* Typed confirmation for critical actions */}
          {requireTypedConfirmation && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Tastați <span className="font-mono font-bold text-red-600">{confirmationPhrase}</span> pentru a confirma:
              </p>
              <input
                type="text"
                value={typedConfirmation}
                onChange={(e) => setTypedConfirmation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder={confirmationPhrase}
                disabled={isLoading}
              />
            </div>
          )}

          {/* Warning text for delete */}
          {variant === 'delete' && (
            <p className="text-sm text-red-600 mb-4">
              ⚠️ Această acțiune nu poate fi anulată.
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={!canConfirm || isLoading}
            className={cn(
              'flex-1 px-4 py-2.5 rounded-lg text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
              config.buttonBg
            )}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Se procesează...
              </span>
            ) : (
              confirmText || config.buttonText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
```

### 3.6.2 useConfirmation Hook

```typescript
// hooks/use-confirmation.ts
'use client';

import { useState, useCallback } from 'react';

interface ConfirmationState {
  isOpen: boolean;
  variant: 'delete' | 'edit' | 'publish' | 'warning';
  title: string;
  description: string;
  itemName?: string;
  onConfirm: () => void | Promise<void>;
  requireTypedConfirmation?: boolean;
}

const initialState: ConfirmationState = {
  isOpen: false,
  variant: 'warning',
  title: '',
  description: '',
  onConfirm: () => {},
};

export function useConfirmation() {
  const [state, setState] = useState<ConfirmationState>(initialState);
  const [isLoading, setIsLoading] = useState(false);

  const confirm = useCallback((options: Omit<ConfirmationState, 'isOpen'>) => {
    setState({
      ...options,
      isOpen: true,
    });
  }, []);

  const confirmDelete = useCallback((
    itemName: string,
    onConfirm: () => void | Promise<void>,
    requireTyped = false
  ) => {
    confirm({
      variant: 'delete',
      title: 'Confirmare ștergere',
      description: 'Sunteți sigur că doriți să ștergeți acest element?',
      itemName,
      onConfirm,
      requireTypedConfirmation: requireTyped,
    });
  }, [confirm]);

  const confirmEdit = useCallback((
    itemName: string,
    onConfirm: () => void | Promise<void>
  ) => {
    confirm({
      variant: 'edit',
      title: 'Salvare modificări',
      description: 'Sunteți sigur că doriți să salvați aceste modificări?',
      itemName,
      onConfirm,
    });
  }, [confirm]);

  const confirmPublish = useCallback((
    itemName: string,
    onConfirm: () => void | Promise<void>
  ) => {
    confirm({
      variant: 'publish',
      title: 'Confirmare publicare',
      description: 'Sunteți sigur că doriți să publicați acest element?',
      itemName,
      onConfirm,
    });
  }, [confirm]);

  const close = useCallback(() => {
    setState(initialState);
    setIsLoading(false);
  }, []);

  const handleConfirm = useCallback(async () => {
    setIsLoading(true);
    try {
      await state.onConfirm();
      close();
    } catch (error) {
      console.error('Confirmation action failed:', error);
      setIsLoading(false);
    }
  }, [state.onConfirm, close]);

  return {
    isOpen: state.isOpen,
    variant: state.variant,
    title: state.title,
    description: state.description,
    itemName: state.itemName,
    requireTypedConfirmation: state.requireTypedConfirmation,
    isLoading,
    confirm,
    confirmDelete,
    confirmEdit,
    confirmPublish,
    close,
    handleConfirm,
  };
}
```

### 3.6.3 Usage Example in Admin Component

```typescript
// app/admin/documents/document-list.tsx
'use client';

import { useState } from 'react';
import { Trash2, Edit } from 'lucide-react';
import { ConfirmationDialog } from '@/components/admin/confirmation-dialog';
import { useConfirmation } from '@/hooks/use-confirmation';
import { deleteDocument } from '@/lib/actions/documents';

interface Document {
  id: string;
  title: string;
  // ... other fields
}

export function DocumentList({ documents }: { documents: Document[] }) {
  const confirmation = useConfirmation();

  const handleDelete = async (doc: Document) => {
    confirmation.confirmDelete(
      doc.title,
      async () => {
        await deleteDocument(doc.id);
        // Refresh the list or show success toast
      },
      true // Require typed confirmation for documents
    );
  };

  return (
    <>
      <div className="space-y-4">
        {documents.map((doc) => (
          <div key={doc.id} className="flex items-center justify-between p-4 bg-white rounded-lg border">
            <span>{doc.title}</span>
            <div className="flex gap-2">
              <button
                onClick={() => {/* Navigate to edit */}}
                className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(doc)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmation.isOpen}
        onClose={confirmation.close}
        onConfirm={confirmation.handleConfirm}
        variant={confirmation.variant}
        title={confirmation.title}
        description={confirmation.description}
        itemName={confirmation.itemName}
        requireTypedConfirmation={confirmation.requireTypedConfirmation}
        confirmationPhrase="STERGE"
        isLoading={confirmation.isLoading}
      />
    </>
  );
}
```

---

## 4. Internationalization (i18n)

### 4.1 Setup with next-intl v4 (App Router)

**Note:** next-intl v4 uses a routing-based approach instead of middleware for Next.js 15+.

```typescript
// i18n/routing.ts
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
```

```typescript
// i18n/request.ts
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

```typescript
// i18n/navigation.ts
import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
```

```typescript
// next.config.ts
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default withNextIntl(nextConfig);
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

## 6. API Integrations & Components

### 6.0 Google Cloud Translation API Integration

The website uses Google Cloud Translation API to automatically translate dynamic content (news, events, announcements) from Romanian to Hungarian and English. This allows admins to write content in a single language while serving a multilingual website.

#### 6.0.1 Translation Service

```typescript
// lib/services/translation.ts
import { Translate } from '@google-cloud/translate/build/src/v2';

const translate = new Translate({
  key: process.env.GOOGLE_TRANSLATE_API_KEY,
});

export type SupportedLocale = 'ro' | 'hu' | 'en';

interface TranslationResult {
  ro: string;
  hu: string;
  en: string;
}

/**
 * Translates text from Romanian to all supported languages
 * @param text - Original Romanian text
 * @returns Object with translations for all locales
 */
export async function translateText(text: string): Promise<TranslationResult> {
  if (!text || text.trim() === '') {
    return { ro: text, hu: text, en: text };
  }

  try {
    const [huTranslation] = await translate.translate(text, { from: 'ro', to: 'hu' });
    const [enTranslation] = await translate.translate(text, { from: 'ro', to: 'en' });

    return {
      ro: text,
      hu: huTranslation,
      en: enTranslation,
    };
  } catch (error) {
    console.error('Translation error:', error);
    // Fallback to original text if translation fails
    return { ro: text, hu: text, en: text };
  }
}

/**
 * Batch translate multiple fields
 * @param fields - Object with field names and Romanian values
 * @returns Object with translated fields for all locales
 */
export async function translateFields(
  fields: Record<string, string>
): Promise<Record<string, TranslationResult>> {
  const results: Record<string, TranslationResult> = {};
  
  await Promise.all(
    Object.entries(fields).map(async ([key, value]) => {
      results[key] = await translateText(value);
    })
  );

  return results;
}
```

#### 6.0.2 Translation Hook for Admin Dashboard

```typescript
// hooks/use-translation.ts
'use client';

import { useState } from 'react';

interface UseTranslationOptions {
  onSuccess?: (translations: Record<string, any>) => void;
  onError?: (error: Error) => void;
}

export function useTranslation(options?: UseTranslationOptions) {
  const [isTranslating, setIsTranslating] = useState(false);

  const translateContent = async (content: Record<string, string>) => {
    setIsTranslating(true);
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) throw new Error('Translation failed');

      const translations = await response.json();
      options?.onSuccess?.(translations);
      return translations;
    } catch (error) {
      options?.onError?.(error as Error);
      throw error;
    } finally {
      setIsTranslating(false);
    }
  };

  return { translateContent, isTranslating };
}
```

#### 6.0.3 Translation API Route

```typescript
// app/api/translate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { translateFields } from '@/lib/services/translation';

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();

    if (!content || typeof content !== 'object') {
      return NextResponse.json(
        { error: 'Invalid content format' },
        { status: 400 }
      );
    }

    const translations = await translateFields(content);
    return NextResponse.json(translations);
  } catch (error) {
    console.error('Translation API error:', error);
    return NextResponse.json(
      { error: 'Translation failed' },
      { status: 500 }
    );
  }
}
```

#### 6.0.4 Database Schema for Translated Content

```sql
-- Example: Articles with auto-translation support
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  -- Original Romanian content (primary)
  title_ro TEXT NOT NULL,
  excerpt_ro TEXT,
  content_ro TEXT,
  -- Auto-translated Hungarian
  title_hu TEXT,
  excerpt_hu TEXT,
  content_hu TEXT,
  -- Auto-translated English
  title_en TEXT,
  excerpt_en TEXT,
  content_en TEXT,
  -- Translation metadata
  translation_status TEXT DEFAULT 'pending' CHECK (translation_status IN ('pending', 'completed', 'failed', 'manual')),
  translated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Trigger to auto-translate on insert/update
CREATE OR REPLACE FUNCTION trigger_translate_article()
RETURNS TRIGGER AS $$
BEGIN
  -- Mark for translation if Romanian content changed
  IF NEW.title_ro IS DISTINCT FROM OLD.title_ro 
     OR NEW.excerpt_ro IS DISTINCT FROM OLD.excerpt_ro 
     OR NEW.content_ro IS DISTINCT FROM OLD.content_ro THEN
    NEW.translation_status := 'pending';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER article_translation_trigger
BEFORE UPDATE ON articles
FOR EACH ROW
EXECUTE FUNCTION trigger_translate_article();
```

#### 6.0.5 Content Categories and Translation Rules

| Category | Auto-Translate | Notes |
|----------|----------------|-------|
| News/Articles | ✅ Yes | Title, excerpt, content |
| Events | ✅ Yes | Title, description, location names |
| Announcements | ✅ Yes | Title, content |
| Job Vacancies | ✅ Yes | Title, requirements, description |
| Gallery | ✅ Yes | Titles, captions, alt text |
| COVID Updates | ✅ Yes | Title, content |
| HCL (Council Decisions) | ❌ No | Legal documents - Romanian only |
| Dispositions | ❌ No | Legal documents - Romanian only |
| Budget Documents | ❌ No | Financial documents - Romanian only |
| Regulations | ❌ No | Legal documents - Romanian only |
| Building Permits | ❌ No | Legal documents - Romanian only |
| Urban Plans | ❌ No | Technical documents - Romanian only |
| Wealth Declarations | ❌ No | Legal documents - Romanian only |

### 6.1 Hero Carousel Component

```typescript
// components/sections/hero-carousel.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface HeroSlide {
  id: string;
  image: string;
  alt: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'primaria',
    image: '/images/primaria-salonta-1.jpg',
    alt: 'Primăria Municipiului Salonta',
  },
  {
    id: 'muzeu',
    image: '/images/muzeu-salonta.jpg',
    alt: 'Complexul Muzeal Arany János',
  },
  {
    id: 'parc',
    image: '/images/parc-salonta-3.jpg',
    alt: 'Parcul Central Salonta',
  },
  {
    id: 'casa-cultura',
    image: '/images/casa-de-cultura-salonta-1.jpg',
    alt: 'Casa de Cultură Zilahy Lajos',
  },
  {
    id: 'bazin',
    image: '/images/bazin-de-inot-salonta-1.jpeg',
    alt: 'Bazinul de Înot Salonta',
  },
];

const AUTO_SLIDE_INTERVAL = 6000; // 6 seconds

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(nextSlide, AUTO_SLIDE_INTERVAL);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  return (
    <section className="relative h-[600px] md:h-[700px] w-full overflow-hidden">
      {/* Slides */}
      {HERO_SLIDES.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            'absolute inset-0 transition-opacity duration-1000',
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          )}
        >
          <Image
            src={slide.image}
            alt={slide.alt}
            fill
            className="object-cover"
            priority={index === 0}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        </div>
      ))}

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
        {/* Logo & Title */}
        <Image
          src="/logo/logo-transparent.png"
          alt="Primăria Salonta"
          width={120}
          height={120}
          className="mb-6"
        />
        <h1 className="text-4xl md:text-6xl font-heading font-bold text-white text-center mb-4">
          Primăria Municipiului Salonta
        </h1>
        <p className="text-xl md:text-2xl text-white/90 text-center mb-8">
          Site-ul oficial al Primăriei Municipiului Salonta
        </p>

        {/* Search Bar */}
        <div className="w-full max-w-xl mb-8">
          <div className="relative">
            <input
              type="search"
              placeholder="Căutare..."
              className="w-full px-6 py-4 rounded-full bg-white/95 text-gray-900 placeholder-gray-500 shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary-900 text-white rounded-full hover:bg-primary-800 transition-colors">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Access Buttons */}
        <div className="flex flex-wrap justify-center gap-3">
          {/* Quick links will be rendered here */}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-white transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-white transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {HERO_SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              'w-3 h-3 rounded-full transition-all',
              index === currentSlide
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/70'
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
```

### 6.1 Mega Menu Navigation Component

```typescript
// components/layout/mega-menu.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface MenuItem {
  id: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: MenuItem[];
}

interface MegaMenuProps {
  items: MenuItem[];
}

export function MegaMenu({ items }: MegaMenuProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const t = useTranslations('navigation');

  return (
    <nav className="hidden lg:flex items-center gap-1">
      {items.map((item) => (
        <div
          key={item.id}
          className="relative"
          onMouseEnter={() => setActiveMenu(item.id)}
          onMouseLeave={() => setActiveMenu(null)}
        >
          <button
            className={cn(
              'flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors',
              activeMenu === item.id
                ? 'bg-primary-100 text-primary-900'
                : 'text-gray-700 hover:bg-gray-100'
            )}
          >
            {t(item.id)}
            {item.children && (
              <ChevronDown
                className={cn(
                  'w-4 h-4 transition-transform',
                  activeMenu === item.id && 'rotate-180'
                )}
              />
            )}
          </button>

          {/* Mega Menu Dropdown */}
          {item.children && activeMenu === item.id && (
            <div className="absolute top-full left-0 w-screen max-w-4xl bg-white rounded-xl shadow-xl border border-gray-200 p-6 animate-slide-down">
              <div className="grid grid-cols-3 gap-6">
                {item.children.map((child) => (
                  <Link
                    key={child.id}
                    href={child.href}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    {child.icon && (
                      <child.icon className="w-5 h-5 text-primary-600 mt-0.5 group-hover:text-primary-700" />
                    )}
                    <div>
                      <div className="font-medium text-gray-900 group-hover:text-primary-700">
                        {t(child.id)}
                      </div>
                      {/* Optional description can be added here */}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}
```

**Navigation Structure for Mega Menu:**
```typescript
// lib/constants/navigation.ts
import {
  Building2,
  Landmark,
  Users,
  FileText,
  Briefcase,
  BarChart3,
  Monitor,
  Newspaper,
  Video,
  Phone,
} from 'lucide-react';

export const MAIN_NAVIGATION = [
  {
    id: 'localitatea',
    href: '/localitatea',
    children: [
      { id: 'localizare', href: '/localitatea/localizare', icon: MapPin },
      { id: 'istoric', href: '/localitatea/istoric', icon: Clock },
      { id: 'cultura', href: '/localitatea/cultura', icon: Palette },
      { id: 'harta', href: '/localitatea/harta-digitala', icon: Map },
      { id: 'galerie', href: '/localitatea/galerie', icon: Image },
      { id: 'excursieVirtuala', href: '/localitatea/excursie-virtuala', icon: Eye },
      { id: 'oraseInfratite', href: '/localitatea/orase-infratite', icon: Globe },
      { id: 'cetateniOnoare', href: '/localitatea/cetateni-de-onoare', icon: Award },
      { id: 'economie', href: '/localitatea/economie', icon: TrendingUp },
    ],
  },
  {
    id: 'institutii',
    href: '/institutii',
    children: [
      { id: 'casaCultura', href: '/institutii/casa-cultura', icon: Building },
      { id: 'biblioteca', href: '/institutii/biblioteca', icon: BookOpen },
      { id: 'muzeu', href: '/institutii/muzeu', icon: Landmark },
      { id: 'asistentaMedicala', href: '/institutii/asistenta-medicala', icon: Heart },
      { id: 'cantinaSociala', href: '/institutii/cantina-sociala', icon: Utensils },
      { id: 'centrulZi', href: '/institutii/centrul-de-zi', icon: Users },
      { id: 'cuibulDropiei', href: '/institutii/cuibul-dropiei', icon: Bird },
      { id: 'bazinInot', href: '/institutii/bazin-inot', icon: Waves },
    ],
  },
  // ... continue for all menu sections
];
```

### 6.2 Google Maps Configuration

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

### 6.3 Online Payment Links Configuration

```typescript
// lib/constants/payment-links.ts
export const PAYMENT_LINKS = [
  {
    id: 'ghiseul',
    url: 'https://www.ghiseul.ro/ghiseul/public/',
    icon: 'CreditCard',
    translations: {
      ro: {
        title: 'Ghișeul.ro',
        description: 'Platforma națională pentru plăți online către instituțiile publice',
      },
      hu: {
        title: 'Ghișeul.ro',
        description: 'Nemzeti online fizetési platform közintézmények felé',
      },
      en: {
        title: 'Ghișeul.ro',
        description: 'National platform for online payments to public institutions',
      },
    },
  },
  {
    id: 'impozite-taxe',
    url: 'https://www.globalpay.ro/public/salonta/login/index/redirctrl/debite/rediract/debite/lang/ro',
    icon: 'Receipt',
    translations: {
      ro: {
        title: 'Impozite și taxe',
        description: 'Plătește impozite pe clădiri, terenuri și alte taxe locale',
      },
      hu: {
        title: 'Adók és illetékek',
        description: 'Fizessen épület-, telek- és egyéb helyi adókat',
      },
      en: {
        title: 'Taxes and fees',
        description: 'Pay building taxes, land taxes, and other local fees',
      },
    },
  },
  {
    id: 'amenzi',
    url: 'https://www.globalpay.ro/public/salonta/login/index/redirctrl/amenzi/rediract/index/lang/ro',
    icon: 'FileWarning',
    translations: {
      ro: {
        title: 'Amenzi contravenționale',
        description: 'Plătește amenzi de circulație și alte amenzi contravenționale',
      },
      hu: {
        title: 'Szabálysértési bírságok',
        description: 'Fizessen közlekedési és egyéb szabálysértési bírságokat',
      },
      en: {
        title: 'Contravention fines',
        description: 'Pay traffic fines and other contravention fines',
      },
    },
  },
];

// components/features/payment-cards.tsx
'use client';

import { useTranslations, useLocale } from 'next-intl';
import { ExternalLink, CreditCard, Receipt, FileWarning } from 'lucide-react';
import { PAYMENT_LINKS } from '@/lib/constants/payment-links';

const ICONS = {
  CreditCard,
  Receipt,
  FileWarning,
};

export function PaymentCards() {
  const locale = useLocale() as 'ro' | 'hu' | 'en';
  const t = useTranslations('payments');

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {PAYMENT_LINKS.map((payment) => {
        const Icon = ICONS[payment.icon as keyof typeof ICONS];
        const translation = payment.translations[locale];

        return (
          <a
            key={payment.id}
            href={payment.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center p-8 bg-white rounded-2xl shadow-card hover:shadow-card-hover border border-gray-100 transition-all hover:-translate-y-1"
          >
            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mb-4 group-hover:bg-primary-200 transition-colors">
              <Icon className="w-8 h-8 text-primary-700" />
            </div>
            <h3 className="text-xl font-heading font-semibold text-primary-900 mb-2 text-center">
              {translation.title}
            </h3>
            <p className="text-gray-600 text-center text-sm mb-4">
              {translation.description}
            </p>
            <span className="inline-flex items-center gap-1 text-primary-700 font-medium group-hover:underline">
              {t('accessPlatform')}
              <ExternalLink className="w-4 h-4" />
            </span>
          </a>
        );
      })}
    </div>
  );
}
```

### 6.5 Leadership & Schedule Configuration

```typescript
// lib/constants/leadership.ts
export const LEADERSHIP = [
  {
    id: 'primar',
    position: 'primar',
    photo: '/images/consilul local/primar-torok-laszlo.jpg',
    email: 'primsal@rdslink.ro',
    phone: '0359-409730',
    translations: {
      ro: {
        name: 'Török László',
        position: 'Primar',
        audienceSchedule: 'Săptămâni impare, Miercuri: 9:00 - 11:00',
      },
      hu: {
        name: 'Török László',
        position: 'Polgármester',
        audienceSchedule: 'Páratlan hetek, Szerda: 9:00 - 11:00',
      },
      en: {
        name: 'Török László',
        position: 'Mayor',
        audienceSchedule: 'Odd weeks, Wednesday: 9:00 - 11:00',
      },
    },
  },
  {
    id: 'viceprimar',
    position: 'viceprimar',
    photo: '/images/consilul local/viceprimar-horvath-janos.jpg',
    email: 'primsal@rdslink.ro',
    phone: '0359-409730',
    translations: {
      ro: {
        name: 'Horváth János',
        position: 'Viceprimar',
        audienceSchedule: 'Săptămâni pare, Miercuri: 9:00 - 11:00',
      },
      hu: {
        name: 'Horváth János',
        position: 'Alpolgármester',
        audienceSchedule: 'Páros hetek, Szerda: 9:00 - 11:00',
      },
      en: {
        name: 'Horváth János',
        position: 'Deputy Mayor',
        audienceSchedule: 'Even weeks, Wednesday: 9:00 - 11:00',
      },
    },
  },
  {
    id: 'secretar',
    position: 'secretar',
    photo: null, // TBD
    email: 'primsal@rdslink.ro',
    phone: '0359-409730',
    translations: {
      ro: {
        name: 'TBD', // To be provided
        position: 'Secretar General',
        audienceSchedule: 'În fiecare săptămână, Joi: 9:00 - 11:00',
      },
      hu: {
        name: 'TBD',
        position: 'Főjegyző',
        audienceSchedule: 'Minden héten, Csütörtök: 9:00 - 11:00',
      },
      en: {
        name: 'TBD',
        position: 'General Secretary',
        audienceSchedule: 'Every week, Thursday: 9:00 - 11:00',
      },
    },
  },
];

// lib/constants/public-hours.ts
export const PUBLIC_HOURS = {
  translations: {
    ro: {
      title: 'Program cu publicul',
      audienceTitle: 'Audiențe',
      registrationNote: 'Înscrierea la audiențe se face la camera 11 (parter) a Primăriei Municipiului Salonta, pe baza actului de identitate.',
    },
    hu: {
      title: 'Ügyfélfogadás',
      audienceTitle: 'Fogadóórák',
      registrationNote: 'A fogadóórákra való feliratkozás a Nagyszalontai Polgármesteri Hivatal 11-es szobájában (földszint) történik, személyi igazolvány alapján.',
    },
    en: {
      title: 'Public Hours',
      audienceTitle: 'Audiences',
      registrationNote: 'Registration for audiences is done at room 11 (ground floor) of Salonta City Hall, based on ID card.',
    },
  },
  offices: [
    {
      id: 'general',
      room: null,
      hours: [
        { days: 'Luni - Vineri', from: '8:00', to: '11:00' },
        { days: 'Luni - Vineri', from: '13:00', to: '16:00' },
      ],
      translations: {
        ro: { name: 'Toate birourile de la parter' },
        hu: { name: 'Minden földszinti iroda' },
        en: { name: 'All ground floor offices' },
      },
    },
    {
      id: 'casierie',
      room: '10',
      floor: 'parter',
      hours: [{ days: 'Luni - Vineri', from: '8:00', to: '16:00' }],
      translations: {
        ro: { name: 'Casierie' },
        hu: { name: 'Pénztár' },
        en: { name: 'Cashier' },
      },
    },
    {
      id: 'relatii-public',
      room: '11',
      floor: 'parter',
      hours: [{ days: 'Luni - Vineri', from: '8:00', to: '16:00' }],
      translations: {
        ro: { name: 'Biroul de relații cu publicul' },
        hu: { name: 'Ügyfélszolgálat' },
        en: { name: 'Public Relations Office' },
      },
    },
  ],
};

// lib/constants/contact.ts
export const CONTACT_INFO = {
  address: {
    street: 'Str. Republicii nr. 1',
    city: 'Salonta',
    county: 'Bihor',
    country: 'Romania',
    postalCode: '415500',
    full: 'Str. Republicii nr.1, Salonta, Jud.Bihor',
  },
  phone: {
    main: '0359-409730',
    landline: ['0359-409730', '0359-409731', '0259-373243'],
    fax: '0359-409733',
    display: '0359-409730, 0359-409731, 0259-373243',
  },
  email: {
    primary: 'primsal@rdslink.ro',
    secondary: 'primsal3@gmail.com',
    display: 'primsal@rdslink.ro, primsal3@gmail.com',
  },
  coordinates: {
    lat: 46.8,
    lng: 21.65,
  },
  socialMedia: {
    facebook: 'https://www.facebook.com/PrimariaSalontaNagyszalontaPolgarmesteriHivatala',
    instagram: 'https://www.instagram.com/primaria.municipiuluisalonta/',
    tiktok: 'https://www.tiktok.com/@primariasalonta_',
  },
};
```

### 6.6 Webcam Configuration

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

## 6.7 Admin Dashboard Implementation

### 6.7.1 Admin Route Structure

```
app/
├── admin/
│   ├── layout.tsx              # Admin layout with sidebar
│   ├── page.tsx                # Dashboard overview
│   ├── login/
│   │   └── page.tsx            # Authentication page
│   ├── documents/
│   │   ├── page.tsx            # Document list
│   │   ├── new/page.tsx        # Create document
│   │   └── [id]/
│   │       └── page.tsx        # Edit document
│   ├── news/
│   │   ├── page.tsx            # News list
│   │   ├── new/page.tsx        # Create news
│   │   └── [id]/page.tsx       # Edit news
│   ├── events/
│   │   ├── page.tsx            # Events list
│   │   └── ...
│   ├── gallery/
│   │   ├── page.tsx            # Albums list
│   │   └── [albumId]/page.tsx  # Album images
│   ├── councilors/
│   │   ├── page.tsx            # Councilors list
│   │   └── ...
│   ├── commissions/
│   │   └── page.tsx            # Commissions management
│   ├── declarations/
│   │   └── page.tsx            # Wealth declarations
│   ├── forms/
│   │   └── page.tsx            # Downloadable forms
│   ├── budget/
│   │   └── page.tsx            # Budget documents
│   ├── hcl/
│   │   └── page.tsx            # Council decisions
│   ├── dispositions/
│   │   └── page.tsx            # Mayor dispositions
│   ├── petitions/
│   │   └── page.tsx            # View petitions
│   ├── contact/
│   │   └── page.tsx            # Contact submissions
│   └── settings/
│       └── page.tsx            # Site settings
```

### 6.7.2 Admin Authentication (Next.js 16 - Layout-based)

In Next.js 16, authentication is handled at the **layout level** using Server Components instead of middleware. This approach is more performant and integrates better with the App Router.

```typescript
// lib/supabase/server.ts
import { createServerClient as createSupabaseServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createServerClient() {
  const cookieStore = await cookies();
  
  return createSupabaseServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from Server Component - ignore
          }
        },
      },
    }
  );
}

// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

```typescript
// lib/auth/get-admin.ts
import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'super_admin';
  is_active: boolean;
}

/**
 * Get current admin user or redirect to login
 * Use this in admin layouts/pages that require authentication
 */
export async function getAdminOrRedirect(): Promise<AdminUser> {
  const supabase = await createServerClient();
  
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/admin/login');
  }
  
  const { data: adminUser, error } = await supabase
    .from('admin_users')
    .select('*')
    .eq('id', session.user.id)
    .eq('is_active', true)
    .single();
  
  if (error || !adminUser) {
    // Not an admin - sign out and redirect
    await supabase.auth.signOut();
    redirect('/admin/login?error=unauthorized');
  }
  
  return adminUser as AdminUser;
}

/**
 * Check if current user is admin (without redirect)
 * Use this for conditional rendering
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
  const supabase = await createServerClient();
  
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) return false;
  
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('id')
    .eq('id', session.user.id)
    .eq('is_active', true)
    .single();
  
  return !!adminUser;
}
```

```typescript
// app/admin/login/page.tsx
import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import { AdminLoginForm } from './login-form';

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; redirect?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createServerClient();
  
  // If already logged in as admin, redirect to dashboard
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session) {
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', session.user.id)
      .eq('is_active', true)
      .single();
    
    if (adminUser) {
      redirect(params.redirect || '/admin');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md">
        <AdminLoginForm 
          error={params.error} 
          redirectTo={params.redirect} 
        />
      </div>
    </div>
  );
}
```

```typescript
// app/admin/login/login-form.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Lock, Mail, AlertCircle } from 'lucide-react';

interface AdminLoginFormProps {
  error?: string;
  redirectTo?: string;
}

export function AdminLoginForm({ error: initialError, redirectTo }: AdminLoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(initialError);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(undefined);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError('Email sau parolă incorectă');
      setIsLoading(false);
      return;
    }

    // Verify admin status
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      const { data: adminUser } = await supabase
        .from('admin_users')
        .select('id')
        .eq('id', session.user.id)
        .eq('is_active', true)
        .single();

      if (!adminUser) {
        await supabase.auth.signOut();
        setError('Nu aveți permisiuni de administrator');
        setIsLoading(false);
        return;
      }
    }

    router.push(redirectTo || '/admin');
    router.refresh();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary-900 rounded-xl flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-gray-600">Primăria Municipiului Salonta</p>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="admin@primaria-salonta.ro"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Parolă
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Se autentifică...' : 'Autentificare'}
        </button>
      </form>
    </div>
  );
}
```

### 6.7.3 Admin Layout Component

```typescript
// app/admin/layout.tsx
import { getAdminOrRedirect } from '@/lib/auth/get-admin';
import { AdminSidebar } from '@/components/admin/sidebar';
import { AdminHeader } from '@/components/admin/header';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This will redirect to /admin/login if not authenticated as admin
  const adminUser = await getAdminOrRedirect();

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar user={adminUser} />
      <div className="lg:pl-64">
        <AdminHeader user={adminUser} />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

```typescript
// app/admin/(dashboard)/layout.tsx
// This groups all authenticated admin pages
// The parent layout already handles auth, so children can focus on content

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
```

**Route Group Structure:**
```
app/
├── admin/
│   ├── layout.tsx              # Auth check + sidebar/header
│   ├── login/
│   │   ├── page.tsx            # Login page (no auth required)
│   │   └── login-form.tsx      # Client component for login
│   └── (dashboard)/            # Route group - inherits parent layout
│       ├── page.tsx            # Dashboard overview
│       ├── documents/
│       │   └── page.tsx
│       ├── news/
│       │   └── page.tsx
│       └── ...
```

**Note:** The login page is **outside** the route group so it doesn't inherit the auth-protected layout.

```typescript
// app/api/auth/signout/route.ts
import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const supabase = await createServerClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}
```
```

### 6.7.4 Admin Sidebar Navigation

```typescript
// components/admin/sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Newspaper,
  Calendar,
  Image,
  Users,
  Building2,
  Wallet,
  Gavel,
  FileSignature,
  ClipboardList,
  DollarSign,
  MessageSquare,
  Mail,
  Settings,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const ADMIN_NAVIGATION = [
  {
    group: 'Principal',
    items: [
      { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    group: 'Conținut',
    items: [
      { href: '/admin/news', label: 'Știri', icon: Newspaper },
      { href: '/admin/events', label: 'Evenimente', icon: Calendar },
      { href: '/admin/gallery', label: 'Galerie', icon: Image },
      { href: '/admin/documents', label: 'Documente', icon: FileText },
    ],
  },
  {
    group: 'Consiliu Local',
    items: [
      { href: '/admin/councilors', label: 'Consilieri', icon: Users },
      { href: '/admin/commissions', label: 'Comisii', icon: Building2 },
      { href: '/admin/hcl', label: 'Hotărâri CL', icon: Gavel },
      { href: '/admin/declarations', label: 'Declarații', icon: FileSignature },
    ],
  },
  {
    group: 'Documente Oficiale',
    items: [
      { href: '/admin/dispositions', label: 'Dispoziții', icon: FileText },
      { href: '/admin/budget', label: 'Buget', icon: DollarSign },
      { href: '/admin/forms', label: 'Formulare', icon: ClipboardList },
    ],
  },
  {
    group: 'Comunicare',
    items: [
      { href: '/admin/petitions', label: 'Petiții', icon: MessageSquare },
      { href: '/admin/contact', label: 'Mesaje Contact', icon: Mail },
    ],
  },
  {
    group: 'Setări',
    items: [
      { href: '/admin/settings', label: 'Setări', icon: Settings },
    ],
  },
];

export function AdminSidebar({ user }: { user: { full_name: string; email: string } }) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-primary-900 text-white hidden lg:block">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-primary-800">
        <div className="w-10 h-10 bg-secondary-500 rounded-lg flex items-center justify-center font-bold">
          PS
        </div>
        <div>
          <p className="font-semibold">Admin Panel</p>
          <p className="text-xs text-primary-300">Primăria Salonta</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-3 py-4 space-y-6 overflow-y-auto h-[calc(100vh-180px)]">
        {ADMIN_NAVIGATION.map((group) => (
          <div key={group.group}>
            <p className="px-3 mb-2 text-xs font-semibold text-primary-400 uppercase tracking-wider">
              {group.group}
            </p>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== '/admin' && pathname.startsWith(item.href));
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                        isActive
                          ? 'bg-primary-800 text-white'
                          : 'text-primary-300 hover:bg-primary-800/50 hover:text-white'
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-primary-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-primary-700 rounded-full flex items-center justify-center">
            {user.full_name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{user.full_name}</p>
            <p className="text-xs text-primary-400 truncate">{user.email}</p>
          </div>
        </div>
        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            className="flex items-center gap-2 w-full px-3 py-2 text-primary-300 hover:text-white hover:bg-primary-800 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Deconectare</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
```

### 6.7.5 Document Manager Component

```typescript
// app/admin/documents/page.tsx
import { Suspense } from 'react';
import { createServerClient } from '@/lib/supabase/server';
import { DocumentsTable } from './documents-table';
import { DocumentFilters } from './document-filters';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default async function DocumentsPage({
  searchParams,
}: {
  searchParams: { category?: string; year?: string; search?: string };
}) {
  const supabase = createServerClient();
  
  let query = supabase
    .from('documents')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (searchParams.category) {
    query = query.eq('category', searchParams.category);
  }
  
  if (searchParams.year) {
    query = query.eq('year', parseInt(searchParams.year));
  }
  
  if (searchParams.search) {
    query = query.ilike('file_name', `%${searchParams.search}%`);
  }
  
  const { data: documents, error } = await query;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documente</h1>
          <p className="text-gray-600">Gestionează documentele din toate categoriile</p>
        </div>
        <Link
          href="/admin/documents/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Document nou
        </Link>
      </div>

      {/* Filters */}
      <DocumentFilters />

      {/* Table */}
      <Suspense fallback={<div>Se încarcă...</div>}>
        <DocumentsTable documents={documents || []} />
      </Suspense>
    </div>
  );
}
```

### 6.7.6 Generic Document Categories

For the admin panel, all documents are managed through a unified interface with category filtering:

```typescript
// lib/constants/admin-document-categories.ts
export const DOCUMENT_CATEGORIES = [
  // Informații Publice
  { value: 'autorizatii_construire', label: 'Autorizații de construire', group: 'Informații Publice' },
  { value: 'certificate_urbanism', label: 'Certificate de urbanism', group: 'Informații Publice' },
  { value: 'buget', label: 'Buget', group: 'Informații Publice' },
  { value: 'taxe_impozite', label: 'Impozite și taxe', group: 'Informații Publice' },
  { value: 'licitatii', label: 'Licitații publice', group: 'Informații Publice' },
  { value: 'achizitii', label: 'Achiziții publice', group: 'Informații Publice' },
  { value: 'concursuri', label: 'Concursuri', group: 'Informații Publice' },
  { value: 'mediu', label: 'Mediu', group: 'Informații Publice' },
  { value: 'oferte_terenuri', label: 'Oferte terenuri agricole', group: 'Informații Publice' },
  { value: 'planuri_urbanistice', label: 'Planuri urbanistice', group: 'Informații Publice' },
  { value: 'publicatii_casatorie', label: 'Publicații de căsătorie', group: 'Informații Publice' },
  { value: 'publicatii_vanzare', label: 'Publicații de vânzare', group: 'Informații Publice' },
  { value: 'receptie_lucrari', label: 'Recepție lucrări', group: 'Informații Publice' },
  { value: 'regulamente', label: 'Regulamente', group: 'Informații Publice' },
  { value: 'retele_telecom', label: 'Rețele telecomunicații', group: 'Informații Publice' },
  { value: 'somatii', label: 'Somații', group: 'Informații Publice' },
  { value: 'formulare', label: 'Formulare online', group: 'Informații Publice' },
  { value: 'gdpr', label: 'GDPR', group: 'Informații Publice' },
  
  // Consiliu Local
  { value: 'hcl', label: 'Hotărâri Consiliu Local', group: 'Consiliu Local' },
  { value: 'procese_verbale', label: 'Procese verbale', group: 'Consiliu Local' },
  { value: 'ordine_zi', label: 'Ordine de zi', group: 'Consiliu Local' },
  { value: 'declaratii_avere', label: 'Declarații de avere', group: 'Consiliu Local' },
  { value: 'declaratii_interese', label: 'Declarații de interese', group: 'Consiliu Local' },
  { value: 'rapoarte_activitate', label: 'Rapoarte de activitate', group: 'Consiliu Local' },
  
  // Primăria
  { value: 'dispozitii', label: 'Dispoziții Primar', group: 'Primăria' },
  { value: 'rapoarte_primar', label: 'Rapoarte anuale Primar', group: 'Primăria' },
  { value: 'organigrama', label: 'Organigramă', group: 'Primăria' },
  { value: 'rof', label: 'ROF', group: 'Primăria' },
  
  // Monitorul Oficial Local
  { value: 'mol_statut', label: 'Statutul UAT', group: 'Monitorul Oficial' },
  { value: 'mol_regulamente', label: 'Regulamente administrative', group: 'Monitorul Oficial' },
  { value: 'mol_financiar', label: 'Documente financiare', group: 'Monitorul Oficial' },
  { value: 'mol_alte', label: 'Alte documente', group: 'Monitorul Oficial' },
  
  // Transparență
  { value: 'anunturi', label: 'Anunțuri', group: 'Transparență' },
  { value: 'dezbateri_publice', label: 'Dezbateri publice', group: 'Transparență' },
  { value: 'buletin_informativ', label: 'Buletin informativ', group: 'Transparență' },
  
  // Programe
  { value: 'proiecte_europene', label: 'Proiecte europene', group: 'Programe' },
  { value: 'proiecte_locale', label: 'Proiecte locale', group: 'Programe' },
  { value: 'strategie', label: 'Strategii', group: 'Programe' },
  { value: 'pnrr', label: 'PNRR', group: 'Programe' },
  { value: 'pmud', label: 'PMUD', group: 'Programe' },
  
  // Rapoarte
  { value: 'audit', label: 'Rapoarte audit', group: 'Rapoarte' },
  { value: 'studii', label: 'Studii', group: 'Rapoarte' },
] as const;

export type DocumentCategory = typeof DOCUMENT_CATEGORIES[number]['value'];
```

### 6.7.7 Server Actions for CRUD Operations

```typescript
// lib/actions/documents.ts
'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/lib/supabase/server';

export async function createDocument(formData: FormData) {
  const supabase = createServerClient();
  
  // Verify admin
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Unauthorized');
  
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('id')
    .eq('id', session.user.id)
    .eq('is_active', true)
    .single();
  
  if (!adminUser) throw new Error('Unauthorized');
  
  const data = {
    category: formData.get('category') as string,
    subcategory: formData.get('subcategory') as string | null,
    file_url: formData.get('file_url') as string,
    file_name: formData.get('file_name') as string,
    file_size: parseInt(formData.get('file_size') as string),
    year: formData.get('year') ? parseInt(formData.get('year') as string) : null,
    document_number: formData.get('document_number') as string | null,
    document_date: formData.get('document_date') as string | null,
    published: formData.get('published') === 'true',
  };
  
  const { error } = await supabase.from('documents').insert(data);
  
  if (error) throw error;
  
  revalidatePath('/admin/documents');
  revalidatePath('/informatii-publice');
}

export async function updateDocument(id: string, formData: FormData) {
  const supabase = createServerClient();
  
  // Verify admin (same as above)
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Unauthorized');
  
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('id')
    .eq('id', session.user.id)
    .eq('is_active', true)
    .single();
  
  if (!adminUser) throw new Error('Unauthorized');
  
  const data = {
    category: formData.get('category') as string,
    subcategory: formData.get('subcategory') as string | null,
    file_name: formData.get('file_name') as string,
    year: formData.get('year') ? parseInt(formData.get('year') as string) : null,
    document_number: formData.get('document_number') as string | null,
    document_date: formData.get('document_date') as string | null,
    published: formData.get('published') === 'true',
  };
  
  const { error } = await supabase
    .from('documents')
    .update(data)
    .eq('id', id);
  
  if (error) throw error;
  
  revalidatePath('/admin/documents');
  revalidatePath('/informatii-publice');
}

export async function deleteDocument(id: string) {
  const supabase = createServerClient();
  
  // Verify admin
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Unauthorized');
  
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('id')
    .eq('id', session.user.id)
    .eq('is_active', true)
    .single();
  
  if (!adminUser) throw new Error('Unauthorized');
  
  // Get document to delete file from storage
  const { data: document } = await supabase
    .from('documents')
    .select('file_url')
    .eq('id', id)
    .single();
  
  if (document?.file_url) {
    // Extract path from URL and delete from storage
    const path = document.file_url.split('/').pop();
    if (path) {
      await supabase.storage.from('documents').remove([path]);
    }
  }
  
  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  
  revalidatePath('/admin/documents');
  revalidatePath('/informatii-publice');
}
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

### 9.3 Google reCAPTCHA v3 Integration

All public forms are protected with Google reCAPTCHA v3 for invisible bot protection.

```typescript
// lib/recaptcha.ts
export async function verifyRecaptcha(token: string): Promise<boolean> {
  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      secret: process.env.RECAPTCHA_SECRET_KEY!,
      response: token,
    }),
  });

  const data = await response.json();
  return data.success && data.score >= 0.5;
}

// components/features/recaptcha-provider.tsx
'use client';

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

export function RecaptchaProvider({ children }: { children: React.ReactNode }) {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: 'head',
      }}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
}

// Usage in form components:
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

function ContactForm() {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSubmit = async (data: FormData) => {
    if (!executeRecaptcha) return;
    
    const token = await executeRecaptcha('contact_form');
    // Send token to backend for verification
    await submitForm({ ...data, recaptchaToken: token });
  };
}
```

**Required Package:**
```bash
npm install react-google-recaptcha-v3
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
| `GOOGLE_TRANSLATE_API_KEY` | ✅ | Google Cloud Translation API key (server-side only) |
| `NEXT_PUBLIC_SITE_URL` | ✅ | Production website URL |
| `SMTP_HOST` | ⚡ | Email server host |
| `SMTP_PORT` | ⚡ | Email server port |
| `SMTP_USER` | ⚡ | Email username |
| `SMTP_PASSWORD` | ⚡ | Email password |
| `REVALIDATION_SECRET` | ⚡ | Secret for on-demand revalidation |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | ✅ | Google reCAPTCHA v3 site key |
| `RECAPTCHA_SECRET_KEY` | ✅ | Google reCAPTCHA v3 secret key |
| `NEXT_PUBLIC_GA_ID` | ❓ | Google Analytics ID |

✅ = Required | ⚡ = Required for specific features | ❓ = Optional

### B. Additional Dependencies for Admin Panel

```bash
# Supabase SSR (for Next.js 15+ Server Components)
npm install @supabase/ssr

# Image compression (client-side)
npm install browser-image-compression

# PDF manipulation (server-side)
npm install pdf-lib

# Data tables
npm install @tanstack/react-table

# Date picker
npm install react-day-picker

# Rich text editor (for news builder)
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link

# File upload UI
npm install react-dropzone
```

**Note:** The project already has these dependencies installed:
- `@supabase/supabase-js` - Core Supabase client
- `zod` - Schema validation
- `react-hook-form` + `@hookform/resolvers` - Form handling
- `date-fns` - Date utilities

### C. Useful Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript check

# Dependencies
npm install @google-cloud/translate  # Google Cloud Translation API

# Supabase
npx supabase login   # Login to Supabase
npx supabase init    # Initialize Supabase
npx supabase db push # Push schema changes
npx supabase gen types typescript --linked > types/database.ts

# Admin Panel Setup
npx supabase db reset                   # Reset database with RLS policies
npm run seed:admin                      # Create first admin user (custom script)
```

### D. Database Migration Checklist

When migrating from mock data to database:

1. **Create Tables**
   ```bash
   npx supabase db push
   ```

2. **Apply RLS Policies**
   - Run all `CREATE POLICY` statements from section 3.2
   - Verify with: `SELECT * FROM pg_policies;`

3. **Create First Admin User**
   ```sql
   -- After user signs up via Supabase Auth
   INSERT INTO admin_users (id, email, full_name, role)
   VALUES ('user-uuid-here', 'admin@primaria-salonta.ro', 'Administrator', 'super_admin');
   ```

4. **Migrate Mock Data**
   - Export mock data from page files
   - Transform to database format
   - Insert via admin panel or SQL scripts

5. **Update Page Components**
   - Replace mock data with Supabase queries
   - Use server components for data fetching
   - Implement error handling and loading states

6. **Test Access Control**
   - Verify public can read published content
   - Verify only admins can modify content
   - Test RLS policies with different users

### C. Google Cloud Translation API Setup

1. **Enable the API:**
   - Go to Google Cloud Console
   - Enable "Cloud Translation API"
   - Create API credentials (API Key)

2. **Set Environment Variable:**
   ```bash
   GOOGLE_TRANSLATE_API_KEY=your_api_key_here
   ```

3. **Usage Limits (Free Tier):**
   - 500,000 characters/month free
   - Estimated usage: ~50,000 chars/month for typical content updates

4. **Cost Estimation (Beyond Free Tier):**
   - $20 per million characters
   - Typical article (1000 chars) = $0.02 to translate to 2 languages

---

*Document Version: 2.0*
*Last Updated: January 2, 2026*
*Author: Development Team*

**Changelog v2.0:**
- Added comprehensive RLS policies for public read / admin write access
- Added admin_users table and is_admin() helper function
- Added file compression services (image + PDF)
- Added confirmation dialog component and hook
- Added admin dashboard implementation details
- Added document categories for unified management
- Added server actions for CRUD operations
- Updated contact information with correct phone numbers
- Added migration checklist and additional dependencies

