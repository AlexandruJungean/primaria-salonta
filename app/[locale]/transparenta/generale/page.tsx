import { getTranslations } from 'next-intl/server';
import { Download, ExternalLink, CreditCard, BookOpen, Scale, Users, Info, Mail } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';
import { getDocumentsBySourceFolderWithAnnexes } from '@/lib/supabase/services/documents';
import { getPageContent, getExternalLinks } from '@/lib/supabase/services/page-content';
import { GeneraleDocuments } from './generale-documents';
import { translateContentArray, translateContentMap } from '@/lib/google-translate/cache';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'transparentaGenerale',
    locale: locale as Locale,
    path: '/transparenta/generale',
  });
}

export default async function GeneralePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tg = await getTranslations({ locale, namespace: 'generalePage' });

  // Fetch content and links from database
  const [contentMap, externalLinks, allDocsData] = await Promise.all([
    getPageContent('transparenta-generale'),
    getExternalLinks('transparenta-generale'),
    getDocumentsBySourceFolderWithAnnexes('generale', 500),
  ]);

  // Translate content map based on locale
  const content = await translateContentMap(contentMap, locale as 'ro' | 'hu' | 'en');

  // Translate external links
  const links = await translateContentArray(
    externalLinks,
    ['title', 'description'],
    locale as 'ro' | 'hu' | 'en'
  );
  
  // Translate document titles based on locale
  const allDocs = await translateContentArray(
    allDocsData,
    ['title', 'description'],
    locale as 'ro' | 'hu' | 'en'
  );

  // Categorize documents based on subcategory field
  const dispozitii = allDocs.filter(doc => doc.subcategory === 'dispozitii');
  const formulare = allDocs.filter(doc => doc.subcategory === 'formulare');
  const rapoarte = allDocs.filter(doc => doc.subcategory === 'rapoarte');

  // Group rapoarte by year
  const rapoarteByYear = rapoarte.reduce((acc, doc) => {
    const year = doc.year || 2024;
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(doc);
    return acc;
  }, {} as Record<number, typeof rapoarte>);

  // Sort years descending
  const sortedYears = Object.keys(rapoarteByYear)
    .map(Number)
    .sort((a, b) => b - a);

  // Helper function to get content with fallback
  const c = (key: string, fallback: string = '') => content[key] || fallback;

  return (
    <>
      <Breadcrumbs items={[
        { label: t('transparenta'), href: '/transparenta' },
        { label: t('generale') }
      ]} />
      <PageHeader titleKey="generale" icon="fileText" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto space-y-12">

            {/* Dispoziții & Rapoarte - Collapsible Client Component */}
            <GeneraleDocuments
              dispozitii={dispozitii}
              rapoarteByYear={rapoarteByYear}
              sortedYears={sortedYears}
              labels={{
                dispozitiiTitle: tg('dispozitiiTitle'),
                rapoarteTitle: tg('rapoarteTitle'),
                rapoarteAnuale: tg('rapoarteAnuale'),
              }}
            />

            {/* Cont pentru plăți Section */}
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-blue-600" />
                {tg('contPlatiTitle')}
              </h2>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {c('cont_plati', tg('contPlatiDesc'))}
              </p>
            </div>

            {/* Formulare Section */}
            {formulare.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <BookOpen className="w-7 h-7 text-green-600" />
                  {tg('formulareTitle')}
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {formulare.map((doc) => (
                    <a
                      key={doc.id}
                      href={doc.file_url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-primary-300 transition-all"
                    >
                      <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                        <Download className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                          {doc.title}
                        </h3>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Ghidul Cetățeanului Section */}
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Users className="w-7 h-7 text-primary-600" />
                {tg('ghidulCetateanului')}
              </h2>
              <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                {c('ghid_cetatean', '')}
              </div>
            </div>

            {/* Contestare decizii Section */}
            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Scale className="w-6 h-6 text-amber-600" />
                {tg('contestareTitle')}
              </h2>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {c('contestare', '')}
              </p>
            </div>

            {/* Link-uri utile Section */}
            {links.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <ExternalLink className="w-7 h-7 text-purple-600" />
                  {tg('linkuriUtileTitle')}
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {links.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target={link.open_in_new_tab ? '_blank' : undefined}
                      rel={link.open_in_new_tab ? 'noopener noreferrer' : undefined}
                      className="group flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-purple-300 transition-all"
                    >
                      <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                        {link.link_type === 'email' ? (
                          <Mail className="w-6 h-6 text-purple-600" />
                        ) : link.icon === 'info' ? (
                          <Info className="w-6 h-6 text-purple-600" />
                        ) : (
                          <ExternalLink className="w-6 h-6 text-purple-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                          {link.title}
                        </h3>
                        {link.description && (
                          <p className="text-sm text-gray-500">{link.description}</p>
                        )}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

          </div>
        </Container>
      </Section>
    </>
  );
}
