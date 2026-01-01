'use client';

import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/components/ui/link';
import { 
  Calendar, 
  User, 
  Clock, 
  ArrowLeft, 
  FileText,
  Quote,
  ExternalLink,
  Download
} from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { formatArticleDate } from '@/lib/utils/format-date';
import { useParams } from 'next/navigation';

// ============================================
// MOCK DATA - Will be replaced with Supabase
// ============================================

// Mock news articles with sections (page builder structure)
const MOCK_NEWS_DETAILS: Record<string, {
  id: string;
  slug: string;
  category: string;
  featured_image_url: string;
  published_at: string;
  author: {
    name: string;
    role: string;
    photo_url?: string;
  };
  translations: {
    ro: { title: string; excerpt: string; meta_title?: string; meta_description?: string };
    hu: { title: string; excerpt: string; meta_title?: string; meta_description?: string };
    en: { title: string; excerpt: string; meta_title?: string; meta_description?: string };
  };
  sections: Array<{
    id: string;
    type: 'text' | 'heading' | 'image' | 'gallery' | 'quote' | 'list' | 'video' | 'document' | 'divider' | 'callout';
    sort_order: number;
    content: {
      ro: string;
      hu: string;
      en: string;
    };
    metadata?: {
      level?: 'h2' | 'h3' | 'h4';
      image_url?: string;
      alt_text?: { ro: string; hu: string; en: string };
      caption?: { ro: string; hu: string; en: string };
      images?: Array<{
        url: string;
        alt: { ro: string; hu: string; en: string };
        caption?: { ro: string; hu: string; en: string };
      }>;
      list_type?: 'bullet' | 'numbered';
      items?: { ro: string[]; hu: string[]; en: string[] };
      video_url?: string;
      document_url?: string;
      document_title?: { ro: string; hu: string; en: string };
      callout_type?: 'info' | 'warning' | 'success';
      attribution?: { ro: string; hu: string; en: string };
    };
  }>;
}> = {
  'despre-violenta-domestica': {
    id: '1',
    slug: 'despre-violenta-domestica',
    category: 'anunturi',
    featured_image_url: '/images/primaria-salonta-1.jpg',
    published_at: '2025-11-11T10:00:00Z',
    author: {
      name: 'Biroul de Comunicare',
      role: 'Primăria Municipiului Salonta',
    },
    translations: {
      ro: { 
        title: 'Despre violența domestică', 
        excerpt: 'Informare despre violența domestică și resurse de ajutor disponibile pentru victimele acesteia.',
        meta_title: 'Despre violența domestică | Primăria Salonta',
        meta_description: 'Informare despre violența domestică și resurse de ajutor disponibile pentru victimele acesteia.'
      },
      hu: { 
        title: 'A családon belüli erőszakról', 
        excerpt: 'Tájékoztatás a családon belüli erőszakról és az áldozatok számára elérhető segítő erőforrásokról.',
        meta_title: 'A családon belüli erőszakról | Nagyszalonta Polgármesteri Hivatala',
        meta_description: 'Tájékoztatás a családon belüli erőszakról és az áldozatok számára elérhető segítő erőforrásokról.'
      },
      en: { 
        title: 'About domestic violence', 
        excerpt: 'Information about domestic violence and help resources available for victims.',
        meta_title: 'About domestic violence | Salonta City Hall',
        meta_description: 'Information about domestic violence and help resources available for victims.'
      },
    },
    sections: [
      {
        id: 's1',
        type: 'heading',
        sort_order: 1,
        content: {
          ro: 'Ce este violența domestică?',
          hu: 'Mi a családon belüli erőszak?',
          en: 'What is domestic violence?',
        },
        metadata: { level: 'h2' },
      },
      {
        id: 's2',
        type: 'text',
        sort_order: 2,
        content: {
          ro: 'Violența domestică reprezintă orice formă de agresiune fizică, psihologică, sexuală sau economică exercitată asupra unui membru de familie. Aceasta poate include loviri, amenințări, intimidări, control financiar și izolare socială.',
          hu: 'A családon belüli erőszak a családtag ellen irányuló fizikai, pszichológiai, szexuális vagy gazdasági agresszió bármely formája. Ez magában foglalhatja az ütéseket, fenyegetéseket, megfélemlítést, pénzügyi kontrollt és a társadalmi elszigetelést.',
          en: 'Domestic violence is any form of physical, psychological, sexual or economic aggression against a family member. This can include beatings, threats, intimidation, financial control and social isolation.',
        },
      },
      {
        id: 's3',
        type: 'callout',
        sort_order: 3,
        content: {
          ro: 'Dacă sunteți victima violenței domestice, sunați la 0800 500 333 (linie gratuită, disponibilă 24/7).',
          hu: 'Ha családon belüli erőszak áldozata, hívja a 0800 500 333 számot (ingyenes vonal, 24/7 elérhető).',
          en: 'If you are a victim of domestic violence, call 0800 500 333 (free line, available 24/7).',
        },
        metadata: { callout_type: 'warning' },
      },
      {
        id: 's4',
        type: 'heading',
        sort_order: 4,
        content: {
          ro: 'Resurse disponibile',
          hu: 'Elérhető erőforrások',
          en: 'Available resources',
        },
        metadata: { level: 'h2' },
      },
      {
        id: 's5',
        type: 'list',
        sort_order: 5,
        content: { ro: '', hu: '', en: '' },
        metadata: {
          list_type: 'bullet',
          items: {
            ro: [
              'Centrul de asistență socială pentru victime',
              'Adăposturi temporare pentru persoane în pericol',
              'Consiliere psihologică gratuită',
              'Asistență juridică pentru obținerea ordinului de protecție',
            ],
            hu: [
              'Szociális segélyszolgálat áldozatok számára',
              'Ideiglenes menedékhelyek a veszélyben lévő személyek számára',
              'Ingyenes pszichológiai tanácsadás',
              'Jogi segítség a védelmi végzés megszerzéséhez',
            ],
            en: [
              'Social assistance center for victims',
              'Temporary shelters for people in danger',
              'Free psychological counseling',
              'Legal assistance for obtaining protection orders',
            ],
          },
        },
      },
      {
        id: 's6',
        type: 'document',
        sort_order: 6,
        content: {
          ro: 'Descărcați ghidul complet despre violența domestică',
          hu: 'Töltse le a családon belüli erőszakról szóló teljes útmutatót',
          en: 'Download the complete guide on domestic violence',
        },
        metadata: {
          document_url: '#',
          document_title: {
            ro: 'Ghid - Violența domestică',
            hu: 'Útmutató - Családon belüli erőszak',
            en: 'Guide - Domestic violence',
          },
        },
      },
    ],
  },
  'ajutor-incalzire-locuinta-2025': {
    id: '2',
    slug: 'ajutor-incalzire-locuinta-2025',
    category: 'anunturi',
    featured_image_url: '/images/primaria-salonta-2.jpg',
    published_at: '2025-10-31T09:00:00Z',
    author: {
      name: 'Serviciul Social',
      role: 'Primăria Municipiului Salonta',
    },
    translations: {
      ro: { 
        title: 'Ajutor pentru încălzirea locuinței – 2025', 
        excerpt: 'Informare privind ajutorul de încălzire pentru sezonul rece 2025-2026.' 
      },
      hu: { 
        title: 'Lakásfűtési támogatás – 2025', 
        excerpt: 'Tájékoztató a 2025-2026-os fűtési szezonra vonatkozó fűtési támogatásról.' 
      },
      en: { 
        title: 'Home heating assistance – 2025', 
        excerpt: 'Information regarding heating assistance for the 2025-2026 cold season.' 
      },
    },
    sections: [
      {
        id: 's1',
        type: 'text',
        sort_order: 1,
        content: {
          ro: 'Primăria Municipiului Salonta anunță deschiderea sesiunii de depunere a cererilor pentru acordarea ajutorului de încălzire a locuinței pentru sezonul rece 2025-2026. Beneficiarii pot solicita sprijin pentru încălzirea cu gaze naturale, energie electrică, lemne sau combustibili petrolieri.',
          hu: 'Nagyszalonta Polgármesteri Hivatala bejelenti a 2025-2026-os fűtési szezonra vonatkozó lakásfűtési támogatás iránti kérelmek benyújtási időszakának megnyitását. A jogosultak támogatást igényelhetnek földgázzal, villamos energiával, fával vagy kőolaj-tüzelőanyaggal történő fűtésre.',
          en: 'Salonta City Hall announces the opening of the application period for home heating assistance for the 2025-2026 cold season. Beneficiaries can request support for heating with natural gas, electricity, wood, or petroleum fuels.',
        },
      },
      {
        id: 's2',
        type: 'heading',
        sort_order: 2,
        content: {
          ro: 'Documente necesare',
          hu: 'Szükséges dokumentumok',
          en: 'Required documents',
        },
        metadata: { level: 'h2' },
      },
      {
        id: 's3',
        type: 'list',
        sort_order: 3,
        content: { ro: '', hu: '', en: '' },
        metadata: {
          list_type: 'numbered',
          items: {
            ro: [
              'Cerere tip (se poate descărca mai jos)',
              'Copie după actele de identitate ale membrilor familiei',
              'Adeverințe de venit pentru toți membrii familiei',
              'Factura de utilități din ultima lună',
              'Contract de închiriere sau act de proprietate',
            ],
            hu: [
              'Típuskérelem (alább letölthető)',
              'Családtagok személyi okmányainak másolata',
              'Jövedelemigazolás minden családtag számára',
              'Az utolsó havi közüzemi számla',
              'Bérleti szerződés vagy tulajdoni lap',
            ],
            en: [
              'Standard application form (can be downloaded below)',
              'Copy of identity documents for family members',
              'Income certificates for all family members',
              'Last month\'s utility bill',
              'Rental contract or property deed',
            ],
          },
        },
      },
      {
        id: 's4',
        type: 'callout',
        sort_order: 4,
        content: {
          ro: 'Termen limită: 15 noiembrie 2025. Cererile depuse după această dată vor fi procesate pentru luna următoare.',
          hu: 'Határidő: 2025. november 15. Az ezen dátum után benyújtott kérelmek a következő hónapra kerülnek feldolgozásra.',
          en: 'Deadline: November 15, 2025. Applications submitted after this date will be processed for the following month.',
        },
        metadata: { callout_type: 'info' },
      },
      {
        id: 's5',
        type: 'document',
        sort_order: 5,
        content: {
          ro: 'Cerere ajutor încălzire',
          hu: 'Fűtési támogatás kérelem',
          en: 'Heating assistance application',
        },
        metadata: {
          document_url: '#',
          document_title: {
            ro: 'Cerere tip - Ajutor încălzire 2025',
            hu: 'Típuskérelem - Fűtési támogatás 2025',
            en: 'Standard form - Heating assistance 2025',
          },
        },
      },
    ],
  },
  'sedinta-consiliu-local-decembrie': {
    id: '4',
    slug: 'sedinta-consiliu-local-decembrie',
    category: 'consiliu',
    featured_image_url: '/images/sedinta-consiliu-salonta-2.jpg',
    published_at: '2025-12-10T08:00:00Z',
    author: {
      name: 'Secretariat Consiliu Local',
      role: 'Primăria Municipiului Salonta',
    },
    translations: {
      ro: { 
        title: 'Ședința Consiliului Local - Decembrie 2025', 
        excerpt: 'Convocarea ședinței ordinare a Consiliului Local al Municipiului Salonta.' 
      },
      hu: { 
        title: 'Helyi Tanács ülése - 2025 december', 
        excerpt: 'Nagyszalonta Helyi Tanácsának rendes ülésének összehívása.' 
      },
      en: { 
        title: 'Local Council Meeting - December 2025', 
        excerpt: 'Convocation of the regular meeting of the Local Council of Salonta Municipality.' 
      },
    },
    sections: [
      {
        id: 's1',
        type: 'text',
        sort_order: 1,
        content: {
          ro: 'Se convoacă ședința ordinară a Consiliului Local al Municipiului Salonta pentru data de 19 decembrie 2025, ora 14:00, în sala de ședințe a Primăriei Municipiului Salonta.',
          hu: 'Összehívásra kerül Nagyszalonta Helyi Tanácsának rendes ülése 2025. december 19-én, 14:00 órakor, a Nagyszalontai Polgármesteri Hivatal üléstermében.',
          en: 'The regular meeting of the Local Council of Salonta Municipality is convened for December 19, 2025, at 2:00 PM, in the meeting room of Salonta City Hall.',
        },
      },
      {
        id: 's2',
        type: 'heading',
        sort_order: 2,
        content: {
          ro: 'Ordine de zi',
          hu: 'Napirend',
          en: 'Agenda',
        },
        metadata: { level: 'h2' },
      },
      {
        id: 's3',
        type: 'list',
        sort_order: 3,
        content: { ro: '', hu: '', en: '' },
        metadata: {
          list_type: 'numbered',
          items: {
            ro: [
              'Aprobarea procesului-verbal al ședinței anterioare',
              'Proiect de hotărâre privind rectificarea bugetului local',
              'Proiect de hotărâre privind taxele și impozitele locale pentru anul 2026',
              'Proiect de hotărâre privind organizarea evenimentelor de Revelion',
              'Diverse',
            ],
            hu: [
              'Az előző ülés jegyzőkönyvének jóváhagyása',
              'Határozattervezet a helyi költségvetés módosításáról',
              'Határozattervezet a 2026-os helyi adókról és illetékekről',
              'Határozattervezet a szilveszteri rendezvények szervezéséről',
              'Egyebek',
            ],
            en: [
              'Approval of the minutes of the previous meeting',
              'Draft decision on rectification of the local budget',
              'Draft decision on local taxes and fees for 2026',
              'Draft decision on organizing New Year\'s Eve events',
              'Miscellaneous',
            ],
          },
        },
      },
      {
        id: 's4',
        type: 'image',
        sort_order: 4,
        content: { ro: '', hu: '', en: '' },
        metadata: {
          image_url: '/images/sedinta-consiliu-salonta-1.jpg',
          alt_text: {
            ro: 'Sala de ședințe a Consiliului Local',
            hu: 'A Helyi Tanács ülésterme',
            en: 'Local Council meeting room',
          },
          caption: {
            ro: 'Sala de ședințe a Consiliului Local Salonta',
            hu: 'A Nagyszalontai Helyi Tanács ülésterme',
            en: 'Salonta Local Council meeting room',
          },
        },
      },
      {
        id: 's5',
        type: 'document',
        sort_order: 5,
        content: {
          ro: 'Dispoziție convocare ședință',
          hu: 'Ülés összehívási rendelkezés',
          en: 'Meeting convocation disposition',
        },
        metadata: {
          document_url: '#',
          document_title: {
            ro: 'Dispoziție nr. 456/2025 - Convocare ședință CL',
            hu: '456/2025 sz. rendelkezés - Helyi Tanács ülésének összehívása',
            en: 'Disposition no. 456/2025 - LC meeting convocation',
          },
        },
      },
    ],
  },
};

// Category labels for display
const CATEGORY_LABELS: Record<string, Record<string, string>> = {
  anunturi: { ro: 'Anunț', hu: 'Hirdetmény', en: 'Announcement' },
  consiliu: { ro: 'Consiliu Local', hu: 'Helyi Tanács', en: 'Local Council' },
  proiecte: { ro: 'Proiecte', hu: 'Projektek', en: 'Projects' },
  stiri: { ro: 'Știri', hu: 'Hírek', en: 'News' },
  comunicate: { ro: 'Comunicat', hu: 'Közlemény', en: 'Press Release' },
};

// ============================================
// SECTION RENDERERS
// ============================================

interface SectionProps {
  section: typeof MOCK_NEWS_DETAILS[string]['sections'][number];
  locale: 'ro' | 'hu' | 'en';
}

function TextSection({ section, locale }: SectionProps) {
  return (
    <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
      <p>{section.content[locale]}</p>
    </div>
  );
}

function HeadingSection({ section, locale }: SectionProps) {
  const level = section.metadata?.level || 'h2';
  const className = {
    h2: 'text-2xl font-bold text-primary-900 mt-8 mb-4',
    h3: 'text-xl font-semibold text-primary-800 mt-6 mb-3',
    h4: 'text-lg font-semibold text-primary-700 mt-4 mb-2',
  }[level];

  const Tag = level;
  return <Tag className={className}>{section.content[locale]}</Tag>;
}

function ImageSection({ section, locale }: SectionProps) {
  const imageUrl = section.metadata?.image_url;
  const altText = section.metadata?.alt_text?.[locale] || '';
  const caption = section.metadata?.caption?.[locale];

  if (!imageUrl) return null;

  return (
    <figure className="my-6">
      <div className="relative aspect-video rounded-xl overflow-hidden">
        <Image
          src={imageUrl}
          alt={altText}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 800px"
        />
      </div>
      {caption && (
        <figcaption className="text-center text-sm text-gray-500 mt-2 italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function GallerySection({ section, locale }: SectionProps) {
  const images = section.metadata?.images || [];
  
  if (images.length === 0) return null;

  return (
    <div className="my-6 grid grid-cols-2 md:grid-cols-3 gap-4">
      {images.map((img, index) => (
        <figure key={index} className="relative aspect-square rounded-lg overflow-hidden">
          <Image
            src={img.url}
            alt={img.alt[locale]}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
          {img.caption && (
            <figcaption className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2">
              {img.caption[locale]}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}

function QuoteSection({ section, locale }: SectionProps) {
  const attribution = section.metadata?.attribution?.[locale];
  
  return (
    <blockquote className="my-6 border-l-4 border-primary-600 pl-6 py-2 bg-primary-50 rounded-r-lg">
      <div className="flex gap-2">
        <Quote className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
        <div>
          <p className="text-lg italic text-gray-700">{section.content[locale]}</p>
          {attribution && (
            <cite className="block mt-2 text-sm text-gray-500 not-italic">— {attribution}</cite>
          )}
        </div>
      </div>
    </blockquote>
  );
}

function ListSection({ section, locale }: SectionProps) {
  const items = section.metadata?.items?.[locale] || [];
  const isNumbered = section.metadata?.list_type === 'numbered';
  
  const Tag = isNumbered ? 'ol' : 'ul';
  
  return (
    <Tag className={`my-4 pl-6 space-y-2 ${isNumbered ? 'list-decimal' : 'list-disc'}`}>
      {items.map((item, index) => (
        <li key={index} className="text-gray-700">{item}</li>
      ))}
    </Tag>
  );
}

function DocumentSection({ section, locale }: SectionProps) {
  const t = useTranslations('common');
  const docUrl = section.metadata?.document_url || '#';
  const docTitle = section.metadata?.document_title?.[locale] || section.content[locale];
  
  return (
    <div className="my-4">
      <a
        href={docUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors group"
      >
        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <FileText className="w-6 h-6 text-red-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 group-hover:text-primary-700 truncate">
            {docTitle}
          </p>
          <p className="text-sm text-gray-500">{t('download')} PDF</p>
        </div>
        <Download className="w-5 h-5 text-gray-400 group-hover:text-primary-600" />
      </a>
    </div>
  );
}

function DividerSection() {
  return <hr className="my-8 border-gray-200" />;
}

function CalloutSection({ section, locale }: SectionProps) {
  const type = section.metadata?.callout_type || 'info';
  
  const styles = {
    info: 'bg-blue-50 border-blue-500 text-blue-800',
    warning: 'bg-amber-50 border-amber-500 text-amber-800',
    success: 'bg-green-50 border-green-500 text-green-800',
  }[type];
  
  return (
    <div className={`my-6 p-4 border-l-4 rounded-r-lg ${styles}`}>
      <p className="font-medium">{section.content[locale]}</p>
    </div>
  );
}

function VideoSection({ section }: SectionProps) {
  const videoUrl = section.metadata?.video_url;
  
  if (!videoUrl) return null;
  
  // Extract YouTube video ID if it's a YouTube URL
  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };
  
  const youtubeId = getYouTubeId(videoUrl);
  
  if (youtubeId) {
    return (
      <div className="my-6 aspect-video rounded-xl overflow-hidden">
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title="Video"
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }
  
  return (
    <a 
      href={videoUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className="my-6 flex items-center gap-2 text-primary-700 hover:text-primary-900"
    >
      <ExternalLink className="w-5 h-5" />
      View video
    </a>
  );
}

// Section renderer component
function RenderSection({ section, locale }: SectionProps) {
  switch (section.type) {
    case 'text':
      return <TextSection section={section} locale={locale} />;
    case 'heading':
      return <HeadingSection section={section} locale={locale} />;
    case 'image':
      return <ImageSection section={section} locale={locale} />;
    case 'gallery':
      return <GallerySection section={section} locale={locale} />;
    case 'quote':
      return <QuoteSection section={section} locale={locale} />;
    case 'list':
      return <ListSection section={section} locale={locale} />;
    case 'document':
      return <DocumentSection section={section} locale={locale} />;
    case 'divider':
      return <DividerSection />;
    case 'callout':
      return <CalloutSection section={section} locale={locale} />;
    case 'video':
      return <VideoSection section={section} locale={locale} />;
    default:
      return null;
  }
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function NewsDetailPage() {
  const t = useTranslations('news');
  const tCommon = useTranslations('common');
  const locale = useLocale() as 'ro' | 'hu' | 'en';
  const params = useParams();
  const slug = params.slug as string;

  // Get news data (will be replaced with Supabase query)
  const news = MOCK_NEWS_DETAILS[slug];

  if (!news) {
    return (
      <>
        <Breadcrumbs items={[
          { label: t('title'), href: '/stiri' },
          { label: tCommon('notFound') },
        ]} />
        <Section background="white">
          <Container>
            <div className="text-center py-16">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {tCommon('notFound')}
              </h1>
              <p className="text-gray-600 mb-8">
                {locale === 'ro' && 'Articolul solicitat nu a fost găsit.'}
                {locale === 'hu' && 'A kért cikk nem található.'}
                {locale === 'en' && 'The requested article was not found.'}
              </p>
              <Link href="/stiri" className="text-primary-700 hover:text-primary-900 inline-flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                {locale === 'ro' && 'Înapoi la știri'}
                {locale === 'hu' && 'Vissza a hírekhez'}
                {locale === 'en' && 'Back to news'}
              </Link>
            </div>
          </Container>
        </Section>
      </>
    );
  }

  const translation = news.translations[locale];
  const sortedSections = [...news.sections].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <>
      <Breadcrumbs items={[
        { label: t('title'), href: '/stiri' },
        { label: translation.title },
      ]} />

      {/* Hero Image */}
      <div className="relative h-[300px] md:h-[400px] w-full">
        <Image
          src={news.featured_image_url}
          alt={translation.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      </div>

      <Section background="white">
        <Container>
          <article className="max-w-3xl mx-auto -mt-24 relative z-10">
            {/* Article Header Card */}
            <Card className="mb-8 overflow-visible">
              <CardContent className="p-8">
                {/* Category Badge */}
                <Badge variant="default" className="mb-4">
                  {CATEGORY_LABELS[news.category]?.[locale] || news.category}
                </Badge>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {translation.title}
                </h1>

                {/* Excerpt */}
                <p className="text-lg text-gray-600 mb-6">
                  {translation.excerpt}
                </p>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 border-t pt-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <time dateTime={news.published_at}>
                      {formatArticleDate(news.published_at, locale)}
                    </time>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{news.author.name}</span>
                  </div>
                  {news.author.role && (
                    <span className="text-gray-400">• {news.author.role}</span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Article Content - Sections */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              {sortedSections.map((section) => (
                <RenderSection key={section.id} section={section} locale={locale} />
              ))}
            </div>

            {/* Back Link */}
            <div className="mt-8 pt-6 border-t">
              <Link 
                href="/stiri" 
                className="text-primary-700 hover:text-primary-900 inline-flex items-center gap-2 font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                {locale === 'ro' && 'Înapoi la toate știrile'}
                {locale === 'hu' && 'Vissza az összes hírhez'}
                {locale === 'en' && 'Back to all news'}
              </Link>
            </div>
          </article>
        </Container>
      </Section>
    </>
  );
}

