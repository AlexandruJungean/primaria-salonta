import { MetadataRoute } from 'next';
import { SEO_CONFIG } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SEO_CONFIG.siteUrl;
  const locales = SEO_CONFIG.locales;
  const currentDate = new Date();

  // All pages in the site with SEO priorities
  const pages = [
    // Homepage - highest priority
    { path: '', priority: 1.0, changeFrequency: 'daily' as const },
    
    // High-traffic service pages
    { path: '/stiri', priority: 0.95, changeFrequency: 'daily' as const },
    { path: '/servicii-online', priority: 0.95, changeFrequency: 'weekly' as const },
    { path: '/servicii-online/plati', priority: 0.95, changeFrequency: 'weekly' as const },
    { path: '/informatii-publice/taxe-impozite', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/informatii-publice/formulare', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/contact', priority: 0.9, changeFrequency: 'monthly' as const },
    
    // Important transparency pages
    { path: '/transparenta', priority: 0.85, changeFrequency: 'weekly' as const },
    { path: '/transparenta/anunturi', priority: 0.85, changeFrequency: 'daily' as const },
    { path: '/informatii-publice/concursuri', priority: 0.85, changeFrequency: 'weekly' as const },
    
    // Main sections
    { path: '/camere-web', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/localitatea', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/primaria', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/primaria/program', priority: 0.85, changeFrequency: 'monthly' as const },
    { path: '/primaria/audiente', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/primaria/conducere', priority: 0.75, changeFrequency: 'yearly' as const },
    
    // Localitatea
    { path: '/localitatea/localizare', priority: 0.7, changeFrequency: 'yearly' as const },
    { path: '/localitatea/istoric', priority: 0.7, changeFrequency: 'yearly' as const },
    { path: '/localitatea/cultura', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/localitatea/economie', priority: 0.65, changeFrequency: 'monthly' as const },
    { path: '/localitatea/galerie', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/localitatea/excursie-virtuala', priority: 0.6, changeFrequency: 'yearly' as const },
    { path: '/localitatea/harta-digitala', priority: 0.65, changeFrequency: 'yearly' as const },
    { path: '/localitatea/orase-infratite', priority: 0.5, changeFrequency: 'yearly' as const },
    { path: '/localitatea/cetateni-de-onoare', priority: 0.5, changeFrequency: 'yearly' as const },
    
    // Institutii
    { path: '/institutii', priority: 0.75, changeFrequency: 'monthly' as const },
    { path: '/institutii/casa-cultura', priority: 0.65, changeFrequency: 'monthly' as const },
    { path: '/institutii/biblioteca', priority: 0.65, changeFrequency: 'monthly' as const },
    { path: '/institutii/muzeu', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/institutii/bazin-inot', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/institutii/asistenta-medicala', priority: 0.65, changeFrequency: 'monthly' as const },
    { path: '/institutii/cantina-sociala', priority: 0.55, changeFrequency: 'monthly' as const },
    { path: '/institutii/centrul-de-zi', priority: 0.55, changeFrequency: 'monthly' as const },
    { path: '/institutii/cuibul-dropiei', priority: 0.55, changeFrequency: 'monthly' as const },
    
    // Primaria
    { path: '/primaria/organigrama', priority: 0.6, changeFrequency: 'yearly' as const },
    { path: '/primaria/legislatie', priority: 0.5, changeFrequency: 'yearly' as const },
    { path: '/primaria/regulament', priority: 0.5, changeFrequency: 'yearly' as const },
    { path: '/primaria/declaratii-avere', priority: 0.6, changeFrequency: 'yearly' as const },
    { path: '/primaria/rapoarte-anuale', priority: 0.6, changeFrequency: 'yearly' as const },
    
    // Consiliul Local
    { path: '/consiliul-local', priority: 0.75, changeFrequency: 'monthly' as const },
    { path: '/consiliul-local/consilieri', priority: 0.65, changeFrequency: 'yearly' as const },
    { path: '/consiliul-local/comisii', priority: 0.55, changeFrequency: 'yearly' as const },
    { path: '/consiliul-local/ordine-de-zi', priority: 0.75, changeFrequency: 'weekly' as const },
    { path: '/consiliul-local/hotarari', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/consiliul-local/hotarari-republicate', priority: 0.55, changeFrequency: 'monthly' as const },
    { path: '/consiliul-local/declaratii-avere', priority: 0.55, changeFrequency: 'yearly' as const },
    { path: '/consiliul-local/rapoarte-activitate', priority: 0.5, changeFrequency: 'yearly' as const },
    { path: '/consiliul-local/procese-verbale', priority: 0.65, changeFrequency: 'weekly' as const },
    
    // Transparenta
    { path: '/transparenta/generale', priority: 0.65, changeFrequency: 'monthly' as const },
    { path: '/transparenta/dezbateri-publice', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/transparenta/buletin-informativ', priority: 0.55, changeFrequency: 'monthly' as const },
    
    // Informatii Publice
    { path: '/informatii-publice', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/informatii-publice/achizitii', priority: 0.75, changeFrequency: 'weekly' as const },
    { path: '/informatii-publice/licitatii', priority: 0.75, changeFrequency: 'weekly' as const },
    { path: '/informatii-publice/buget', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/informatii-publice/autorizatii-construire', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/informatii-publice/certificate-urbanism', priority: 0.65, changeFrequency: 'weekly' as const },
    { path: '/informatii-publice/planuri-urbanistice', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/informatii-publice/mediu', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/informatii-publice/gdpr', priority: 0.5, changeFrequency: 'yearly' as const },
    { path: '/informatii-publice/somatii', priority: 0.65, changeFrequency: 'weekly' as const },
    { path: '/informatii-publice/regulamente', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/informatii-publice/seip', priority: 0.65, changeFrequency: 'monthly' as const },
    { path: '/informatii-publice/solicitare-informatii', priority: 0.6, changeFrequency: 'yearly' as const },
    { path: '/informatii-publice/publicatii-casatorie', priority: 0.6, changeFrequency: 'weekly' as const },
    { path: '/informatii-publice/publicatii-vanzare', priority: 0.6, changeFrequency: 'weekly' as const },
    { path: '/informatii-publice/receptie-lucrari', priority: 0.55, changeFrequency: 'monthly' as const },
    { path: '/informatii-publice/retele-telecom', priority: 0.5, changeFrequency: 'yearly' as const },
    { path: '/informatii-publice/oferte-terenuri', priority: 0.6, changeFrequency: 'weekly' as const },
    
    // Programe
    { path: '/programe', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/programe/strategie-dezvoltare', priority: 0.6, changeFrequency: 'yearly' as const },
    { path: '/programe/pmud', priority: 0.55, changeFrequency: 'yearly' as const },
    { path: '/programe/pnrr', priority: 0.65, changeFrequency: 'monthly' as const },
    { path: '/programe/proiecte-europene', priority: 0.65, changeFrequency: 'monthly' as const },
    { path: '/programe/proiecte-locale', priority: 0.65, changeFrequency: 'monthly' as const },
    { path: '/programe/program-regional-nord-vest', priority: 0.65, changeFrequency: 'monthly' as const },
    { path: '/programe/svsu', priority: 0.55, changeFrequency: 'monthly' as const },
    { path: '/programe/plan-sectorial-sna', priority: 0.5, changeFrequency: 'yearly' as const },
    { path: '/voluntariat', priority: 0.6, changeFrequency: 'monthly' as const },
    
    // Monitorul Oficial
    { path: '/monitorul-oficial', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/monitorul-oficial/statut', priority: 0.5, changeFrequency: 'yearly' as const },
    { path: '/monitorul-oficial/regulamente', priority: 0.55, changeFrequency: 'yearly' as const },
    { path: '/monitorul-oficial/hotarari', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/monitorul-oficial/dispozitii', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/monitorul-oficial/documente-financiare', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/monitorul-oficial/alte-documente', priority: 0.45, changeFrequency: 'monthly' as const },
    
    // Servicii Online
    { path: '/servicii-online/petitii', priority: 0.85, changeFrequency: 'monthly' as const },
    
    // Rapoarte și Studii
    { path: '/rapoarte-studii', priority: 0.6, changeFrequency: 'yearly' as const },
    { path: '/rapoarte-studii/rapoarte', priority: 0.55, changeFrequency: 'yearly' as const },
    { path: '/rapoarte-studii/studii', priority: 0.5, changeFrequency: 'yearly' as const },
    
    // Alte pagini cetățeni
    { path: '/sport', priority: 0.65, changeFrequency: 'monthly' as const },
    { path: '/educatie', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/transport', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/voluntariat', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/raporteaza-problema', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/faq', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/evenimente', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/agenti-economici', priority: 0.5, changeFrequency: 'monthly' as const },
    
    // Legal pages (lower priority but still indexed)
    { path: '/politica-confidentialitate', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/politica-cookies', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/accesibilitate', priority: 0.35, changeFrequency: 'yearly' as const },
    { path: '/sitemap', priority: 0.3, changeFrequency: 'monthly' as const },
  ];

  // Generate sitemap entries with alternates for all locales
  const sitemapEntries: MetadataRoute.Sitemap = [];

  for (const page of pages) {
    for (const locale of locales) {
      // Create alternates object for hreflang
      const alternates: { languages: Record<string, string> } = {
        languages: {},
      };
      
      for (const altLocale of locales) {
        alternates.languages[altLocale] = `${baseUrl}/${altLocale}${page.path}`;
      }
      // Add x-default pointing to Romanian
      alternates.languages['x-default'] = `${baseUrl}/ro${page.path}`;

      sitemapEntries.push({
        url: `${baseUrl}/${locale}${page.path}`,
        lastModified: currentDate,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates,
      });
    }
  }

  return sitemapEntries;
}

