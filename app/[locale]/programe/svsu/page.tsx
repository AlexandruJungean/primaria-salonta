import { getTranslations } from 'next-intl/server';
import { AlertTriangle, Download, FileText } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';
import * as documents from '@/lib/supabase/services/documents';
import * as pageImages from '@/lib/supabase/services/page-images';
import { ImageGallery } from '@/components/ui/image-gallery';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'svsu',
    locale: locale as Locale,
    path: '/programe/svsu',
  });
}

export default async function SvsuPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tp = await getTranslations({ locale, namespace: 'svsuPage' });

  // Fetch SVSU documents from database
  // Documents are stored with source_folder from migration (programe/serviciul-voluntar-pentru-situatii-de-urgenta-svsu)
  const svsuDocs = await documents.getDocumentsBySourceFolder('serviciul-voluntar-pentru-situatii-de-urgenta-svsu');
  
  // Fetch page images from database
  const images = await pageImages.getPageImages('svsu');

  const pageLabels = {
    ro: {
      noDocuments: 'Nu există documente disponibile.',
      download: 'Descarcă',
      description: 'Serviciul Voluntar pentru Situații de Urgență (SVSU) asigură prevenirea și gestionarea situațiilor de urgență la nivelul Municipiului Salonta.',
      preventiveMeasures: 'Măsuri preventive',
      otherDocs: 'Alte documente',
    },
    hu: {
      noDocuments: 'Nincsenek elérhető dokumentumok.',
      download: 'Letöltés',
      description: 'Az Önkéntes Sürgősségi Szolgálat (SVSU) biztosítja a vészhelyzetek megelőzését és kezelését Nagyszalonta településén.',
      preventiveMeasures: 'Megelőző intézkedések',
      otherDocs: 'Egyéb dokumentumok',
    },
    en: {
      noDocuments: 'No documents available.',
      download: 'Download',
      description: 'The Voluntary Service for Emergency Situations (SVSU) ensures the prevention and management of emergency situations in Salonta Municipality.',
      preventiveMeasures: 'Preventive measures',
      otherDocs: 'Other documents',
    },
  };

  const labels = pageLabels[locale as keyof typeof pageLabels] || pageLabels.en;

  // Get file extension for display
  const getFileType = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'doc' || ext === 'docx') return 'DOC';
    if (ext === 'xls' || ext === 'xlsx') return 'XLS';
    return 'PDF';
  };

  // Group documents by type based on title patterns
  const groupDocs = () => {
    const preventive: typeof svsuDocs = [];
    const other: typeof svsuDocs = [];

    svsuDocs.forEach(doc => {
      const title = doc.title.toLowerCase();
      if (
        title.includes('siguranta') ||
        title.includes('evacuare') ||
        title.includes('brosura') ||
        title.includes('afis') ||
        title.includes('pliant')
      ) {
        preventive.push(doc);
      } else {
        other.push(doc);
      }
    });

    return { preventive, other };
  };

  const { preventive, other } = groupDocs();

  return (
    <>
      <Breadcrumbs items={[
        { label: t('programe'), href: '/programe' },
        { label: t('svsu') }
      ]} />
      <PageHeader titleKey="svsu" icon="alertTriangle" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-600 mb-8 text-center">
              {labels.description}
            </p>

            {svsuDocs.length > 0 ? (
              <div className="space-y-6">
                {/* Other documents (Fișa SVSU, Planificare, Registru) */}
                {other.length > 0 && (
                  <Card className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="p-4 bg-orange-50 border-b border-orange-100">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="w-5 h-5 text-orange-700 shrink-0" />
                          <h3 className="font-semibold text-gray-900">
                            {labels.otherDocs}
                          </h3>
                        </div>
                      </div>
                      <div className="divide-y">
                        {other.map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between gap-4 p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                                <FileText className="w-4 h-4 text-gray-600" />
                              </div>
                              <span className="text-sm text-gray-700">{doc.title}</span>
                            </div>
                            <a
                              href={doc.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-3 py-1.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-xs font-medium shrink-0"
                            >
                              <Download className="w-3.5 h-3.5" />
                              {getFileType(doc.file_name)}
                            </a>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Preventive measures documents */}
                {preventive.length > 0 && (
                  <Card className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="p-4 bg-orange-50 border-b border-orange-100">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="w-5 h-5 text-orange-700 shrink-0" />
                          <h3 className="font-semibold text-gray-900">
                            {labels.preventiveMeasures}
                          </h3>
                        </div>
                      </div>
                      <div className="divide-y">
                        {preventive.map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between gap-4 p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                                <FileText className="w-4 h-4 text-gray-600" />
                              </div>
                              <span className="text-sm text-gray-700">{doc.title}</span>
                            </div>
                            <a
                              href={doc.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-3 py-1.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-xs font-medium shrink-0"
                            >
                              <Download className="w-3.5 h-3.5" />
                              {getFileType(doc.file_name)}
                            </a>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Images Gallery with Lightbox */}
                {images.length > 0 && (
                  <div className="mt-8">
                    <ImageGallery images={images} columns={3} />
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                {labels.noDocuments}
              </div>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
