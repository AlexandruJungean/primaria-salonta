import { getTranslations } from 'next-intl/server';
import { MessageSquare, FileText, AlertCircle } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';
import * as documentsService from '@/lib/supabase/services/documents';
import type { Document } from '@/lib/types/database';
import { DezbateriDocuments } from './dezbateri-documents';
import { translateContentArray } from '@/lib/google-translate/cache';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'dezbateriPublice',
    locale: locale as Locale,
    path: '/transparenta/dezbateri-publice',
  });
}

export default async function DezbateriPublicePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const td = await getTranslations({ locale, namespace: 'dezbateriPage' });

  // Fetch documents from database
  const allDocumentsData = await documentsService.getDocumentsBySourceFolder('dezbateri-publice', 500);
  
  // Translate document titles based on locale
  const allDocuments = await translateContentArray(
    allDocumentsData,
    ['title', 'description'],
    locale as 'ro' | 'hu' | 'en'
  );

  // Group documents by year (using doc.year from database directly)
  const documentsByYear: Record<number, Document[]> = {};
  
  allDocuments.forEach(doc => {
    // Use year from database, fallback to current year only if not set
    const year = doc.year || new Date().getFullYear();
    
    if (!documentsByYear[year]) {
      documentsByYear[year] = [];
    }
    documentsByYear[year].push(doc);
  });

  // Sort years descending
  const sortedYears = Object.keys(documentsByYear)
    .map(y => parseInt(y, 10))
    .sort((a, b) => b - a);

  // Define archive threshold (years before 2017 are considered archive)
  const archiveThreshold = 2017;
  const recentYears = sortedYears.filter(y => y >= archiveThreshold);
  const archiveYears = sortedYears.filter(y => y < archiveThreshold);

  return (
    <>
      <Breadcrumbs items={[
        { label: t('transparenta'), href: '/transparenta' },
        { label: t('dezbateriPublice') }
      ]} />
      <PageHeader titleKey="dezbateriPublice" icon="messageSquare" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            {/* Intro */}
            <div className="bg-purple-50 rounded-2xl p-6 mb-8 border border-purple-100">
              <div className="flex items-start gap-4">
                <MessageSquare className="w-8 h-8 text-purple-600 shrink-0" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">{td('introTitle')}</h2>
                  <p className="text-gray-700">{td('introText')}</p>
                </div>
              </div>
            </div>

            {/* Documents by Year - Collapsible */}
            {sortedYears.length > 0 ? (
              <DezbateriDocuments
                documentsByYear={documentsByYear}
                recentYears={recentYears}
                archiveYears={archiveYears}
                translations={{
                  archive: td('archive'),
                  archiveTitle: td('archiveTitle'),
                  debates: td('debates'),
                }}
              />
            ) : (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">{td('noDebates')}</p>
              </div>
            )}

            {/* Info Note */}
            <div className="flex items-start gap-4 bg-gray-100 rounded-xl p-6 mt-8">
              <AlertCircle className="w-6 h-6 text-gray-500 shrink-0 mt-0.5" />
              <p className="text-sm text-gray-600">
                {td('infoNote')}
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
