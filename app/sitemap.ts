import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://primaria-salonta.ro';
  const locales = ['ro', 'hu', 'en'];
  const currentDate = new Date();

  // All pages in the site
  const pages = [
    // Homepage
    { path: '', priority: 1.0, changeFrequency: 'daily' as const },
    
    // Main sections
    { path: '/stiri', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/contact', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/camere-web', priority: 0.7, changeFrequency: 'weekly' as const },
    
    // Localitatea
    { path: '/localitatea', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/localitatea/localizare', priority: 0.6, changeFrequency: 'yearly' as const },
    { path: '/localitatea/istoric', priority: 0.6, changeFrequency: 'yearly' as const },
    { path: '/localitatea/cultura', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/localitatea/economie', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/localitatea/galerie', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/localitatea/excursie-virtuala', priority: 0.5, changeFrequency: 'yearly' as const },
    { path: '/localitatea/harta-digitala', priority: 0.6, changeFrequency: 'yearly' as const },
    { path: '/localitatea/orase-infratite', priority: 0.5, changeFrequency: 'yearly' as const },
    { path: '/localitatea/cetateni-de-onoare', priority: 0.5, changeFrequency: 'yearly' as const },
    
    // Institutii
    { path: '/institutii', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/institutii/casa-cultura', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/institutii/biblioteca', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/institutii/muzeu', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/institutii/bazin-inot', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/institutii/asistenta-medicala', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/institutii/cantina-sociala', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/institutii/centrul-de-zi', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/institutii/cuibul-dropiei', priority: 0.5, changeFrequency: 'monthly' as const },
    
    // Primaria
    { path: '/primaria', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/primaria/conducere', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/primaria/organigrama', priority: 0.6, changeFrequency: 'yearly' as const },
    { path: '/primaria/program', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/primaria/audiente', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/primaria/legislatie', priority: 0.5, changeFrequency: 'yearly' as const },
    { path: '/primaria/regulament', priority: 0.5, changeFrequency: 'yearly' as const },
    { path: '/primaria/declaratii-avere', priority: 0.6, changeFrequency: 'yearly' as const },
    { path: '/primaria/rapoarte-anuale', priority: 0.6, changeFrequency: 'yearly' as const },
    
    // Consiliul Local
    { path: '/consiliul-local', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/consiliul-local/consilieri', priority: 0.6, changeFrequency: 'yearly' as const },
    { path: '/consiliul-local/comisii', priority: 0.5, changeFrequency: 'yearly' as const },
    { path: '/consiliul-local/ordine-de-zi', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/consiliul-local/hotarari', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/consiliul-local/hotarari-republicate', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/consiliul-local/declaratii-avere', priority: 0.5, changeFrequency: 'yearly' as const },
    { path: '/consiliul-local/rapoarte-activitate', priority: 0.5, changeFrequency: 'yearly' as const },
    
    // Transparenta
    { path: '/transparenta', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/transparenta/generale', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/transparenta/anunturi', priority: 0.8, changeFrequency: 'daily' as const },
    { path: '/transparenta/dezbateri-publice', priority: 0.6, changeFrequency: 'weekly' as const },
    { path: '/transparenta/buletin-informativ', priority: 0.5, changeFrequency: 'monthly' as const },
    
    // Informatii Publice
    { path: '/informatii-publice', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/informatii-publice/achizitii', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/informatii-publice/buget', priority: 0.6, changeFrequency: 'yearly' as const },
    { path: '/informatii-publice/taxe-impozite', priority: 0.8, changeFrequency: 'yearly' as const },
    { path: '/informatii-publice/concursuri', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/informatii-publice/autorizatii-construire', priority: 0.6, changeFrequency: 'weekly' as const },
    { path: '/informatii-publice/certificate-urbanism', priority: 0.5, changeFrequency: 'weekly' as const },
    { path: '/informatii-publice/planuri-urbanistice', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/informatii-publice/mediu', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/informatii-publice/gdpr', priority: 0.4, changeFrequency: 'yearly' as const },
    
    // Programe
    { path: '/programe', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/programe/strategie-dezvoltare', priority: 0.6, changeFrequency: 'yearly' as const },
    { path: '/programe/pmud', priority: 0.5, changeFrequency: 'yearly' as const },
    { path: '/programe/pnrr', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/programe/proiecte-europene', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/programe/proiecte-locale', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/programe/svsu', priority: 0.5, changeFrequency: 'monthly' as const },
    
    // Monitorul Oficial
    { path: '/monitorul-oficial', priority: 0.6, changeFrequency: 'weekly' as const },
    { path: '/monitorul-oficial/statut', priority: 0.5, changeFrequency: 'yearly' as const },
    { path: '/monitorul-oficial/regulamente', priority: 0.5, changeFrequency: 'yearly' as const },
    { path: '/monitorul-oficial/hotarari', priority: 0.6, changeFrequency: 'weekly' as const },
    { path: '/monitorul-oficial/dispozitii', priority: 0.6, changeFrequency: 'weekly' as const },
    { path: '/monitorul-oficial/documente-financiare', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/monitorul-oficial/alte-documente', priority: 0.4, changeFrequency: 'monthly' as const },
    
    // Servicii Online
    { path: '/servicii-online', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/servicii-online/plati', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/servicii-online/petitii', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/servicii-online/formulare', priority: 0.8, changeFrequency: 'monthly' as const },
    
    // Legal pages
    { path: '/politica-confidentialitate', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/politica-cookies', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/accesibilitate', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/sitemap', priority: 0.3, changeFrequency: 'monthly' as const },
  ];

  // Generate sitemap entries for all locales
  const sitemapEntries: MetadataRoute.Sitemap = [];

  for (const page of pages) {
    for (const locale of locales) {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${page.path}`,
        lastModified: currentDate,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
      });
    }
  }

  return sitemapEntries;
}

