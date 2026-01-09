import { getTranslations } from 'next-intl/server';
import { ScrollText, Download, FileText, Archive, Paperclip } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';
import * as documents from '@/lib/supabase/services/documents';
import type { DocumentWithAnnexes } from '@/lib/types/database';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'regulamente',
    locale: locale as Locale,
    path: '/informatii-publice/regulamente',
  });
}

export default async function RegulamentePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tPage = await getTranslations({ locale, namespace: 'regulamentePublicePage' });

  // Fetch documents from database with annexes grouped
  const allDocs = await documents.getDocumentsByCategoryWithAnnexes('regulamente');

  // Split into current and archive based on subcategory
  const currentRegulations = allDocs.filter(doc => doc.subcategory !== 'arhiva');
  const archiveRegulations = allDocs.filter(doc => doc.subcategory === 'arhiva');

  // Helper to get file extension label
  const getDownloadLabel = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (ext === 'doc' || ext === 'docx') return 'DOC';
    return 'PDF';
  };

  const pageLabels = {
    ro: {
      noDocuments: 'Nu există regulamente disponibile.',
      annexes: 'Anexe',
    },
    hu: {
      noDocuments: 'Nincsenek elérhető szabályzatok.',
      annexes: 'Mellékletek',
    },
    en: {
      noDocuments: 'No regulations available.',
      annexes: 'Annexes',
    },
  };

  const labels = pageLabels[locale as keyof typeof pageLabels] || pageLabels.en;

  // Document item component
  const DocumentItem = ({ doc, isArchive = false }: { doc: DocumentWithAnnexes; isArchive?: boolean }) => (
    <div className={`rounded-lg border ${isArchive ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'}`}>
      <a
        href={doc.file_url}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-start gap-3 p-4 ${isArchive ? 'hover:bg-gray-100' : 'hover:bg-violet-50'} transition-colors group rounded-t-lg ${doc.annexes.length === 0 ? 'rounded-b-lg' : ''}`}
      >
        <ScrollText className={`w-5 h-5 ${isArchive ? 'text-gray-400' : 'text-violet-500'} shrink-0 mt-0.5`} />
        <span className={`flex-1 ${isArchive ? 'text-gray-600 group-hover:text-gray-900' : 'text-gray-700 group-hover:text-violet-900'}`}>
          {doc.title}
        </span>
        <span className={`text-xs ${isArchive ? 'text-gray-400 group-hover:text-gray-600' : 'text-gray-400 group-hover:text-violet-600'} shrink-0 mt-0.5 flex items-center gap-1`}>
          <Download className="w-4 h-4" />
          {getDownloadLabel(doc.file_name)}
        </span>
      </a>
      
      {/* Annexes */}
      {doc.annexes.length > 0 && (
        <div className={`border-t ${isArchive ? 'border-gray-200 bg-gray-100/50' : 'border-gray-100 bg-violet-50/30'} px-4 py-2 rounded-b-lg`}>
          <div className="flex items-center gap-2 mb-2">
            <Paperclip className={`w-4 h-4 ${isArchive ? 'text-gray-400' : 'text-violet-400'}`} />
            <span className={`text-xs font-medium ${isArchive ? 'text-gray-500' : 'text-violet-600'}`}>
              {labels.annexes} ({doc.annexes.length})
            </span>
          </div>
          <div className="space-y-1 ml-6">
            {doc.annexes.map((annex) => (
              <a
                key={annex.id}
                href={annex.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 py-1.5 px-2 rounded text-sm ${isArchive ? 'hover:bg-gray-200 text-gray-600 hover:text-gray-900' : 'hover:bg-violet-100 text-gray-600 hover:text-violet-900'} transition-colors group`}
              >
                <FileText className="w-4 h-4 shrink-0" />
                <span className="flex-1">{annex.title}</span>
                <span className="text-xs text-gray-400 group-hover:text-current flex items-center gap-1">
                  <Download className="w-3 h-3" />
                  {getDownloadLabel(annex.file_name)}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <Breadcrumbs items={[
        { label: t('informatiiPublice'), href: '/informatii-publice' },
        { label: t('regulamente') }
      ]} />
      <PageHeader titleKey="regulamente" icon="scrollText" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            {/* Info Banner */}
            <Card className="mb-8 bg-violet-50 border-violet-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <ScrollText className="w-8 h-8 text-violet-600 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-violet-900 mb-2">{tPage('infoTitle')}</h3>
                    <p className="text-violet-800 text-sm">
                      {tPage('infoText')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Regulations */}
            {currentRegulations.length > 0 && (
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-violet-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{tPage('currentTitle')}</h2>
                    <span className="text-sm text-gray-500">({currentRegulations.length} {tPage('documents')})</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {currentRegulations.map((reg) => (
                    <DocumentItem key={reg.id} doc={reg} />
                  ))}
                </div>
              </div>
            )}

            {/* Archive Regulations */}
            {archiveRegulations.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
                    <Archive className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{tPage('archiveTitle')}</h2>
                    <span className="text-sm text-gray-500">({archiveRegulations.length} {tPage('documents')})</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {archiveRegulations.map((reg) => (
                    <DocumentItem key={reg.id} doc={reg} isArchive />
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {currentRegulations.length === 0 && archiveRegulations.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {labels.noDocuments}
              </div>
            )}

            {/* Info Note */}
            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <FileText className="w-8 h-8 text-gray-400 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">{tPage('noteTitle')}</h3>
                    <p className="text-gray-600 text-sm">
                      {tPage('noteText')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>
    </>
  );
}
