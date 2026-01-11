import { getTranslations } from 'next-intl/server';
import { Euro, Download, FileText } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';
import * as documents from '@/lib/supabase/services/documents';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'pnrr',
    locale: locale as Locale,
    path: '/programe/pnrr',
  });
}

export default async function PnrrPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });

  // Fetch PNRR documents from database
  const pnrrDocs = await documents.getDocumentsBySourceFolder('pnrr');

  const pageLabels = {
    ro: {
      noDocuments: 'Nu există documente PNRR disponibile.',
      download: 'Descarcă',
      fundedBy: 'Finanțat de Uniunea Europeană – Next Generation EU',
      description: 'Proiecte finanțate prin Planul Național de Redresare și Reziliență (PNRR) implementate de Primăria Municipiului Salonta.',
    },
    hu: {
      noDocuments: 'Nincsenek elérhető PNRR dokumentumok.',
      download: 'Letöltés',
      fundedBy: 'Az Európai Unió – Next Generation EU finanszírozásával',
      description: 'A Nemzeti Helyreállítási és Reziliencia Terv (PNRR) keretében finanszírozott projektek, amelyeket Nagyszalonta Polgármesteri Hivatala valósít meg.',
    },
    en: {
      noDocuments: 'No PNRR documents available.',
      download: 'Download',
      fundedBy: 'Funded by the European Union – Next Generation EU',
      description: 'Projects funded through the National Recovery and Resilience Plan (PNRR) implemented by Salonta City Hall.',
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

  // Group documents by project (description field)
  const projectsMap = new Map<string, typeof pnrrDocs>();
  pnrrDocs.forEach(doc => {
    const projectName = doc.description || 'Alte documente';
    if (!projectsMap.has(projectName)) {
      projectsMap.set(projectName, []);
    }
    projectsMap.get(projectName)!.push(doc);
  });

  // Convert to array and sort by project name
  const projects = Array.from(projectsMap.entries()).sort((a, b) => {
    // Keep "Alte documente" at the end
    if (a[0] === 'Alte documente') return 1;
    if (b[0] === 'Alte documente') return -1;
    return a[0].localeCompare(b[0], 'ro');
  });

  return (
    <>
      <Breadcrumbs items={[
        { label: t('programe'), href: '/programe' },
        { label: t('pnrr') }
      ]} />
      <PageHeader titleKey="pnrr" icon="euro" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            {/* Intro */}
            <div className="mb-8 text-center">
              <p className="text-gray-600">
                {labels.description}
              </p>
            </div>

            {/* EU Funding Notice */}
            <Card className="mb-8 bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
                    <Euro className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-blue-900">{labels.fundedBy}</p>
                    <p className="text-sm text-blue-700 mt-1">
                      Planul Național de Redresare și Reziliență
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Projects List */}
            {projects.length > 0 ? (
              <div className="space-y-6">
                {projects.map(([projectName, docs]) => (
                  <Card key={projectName} className="overflow-hidden">
                    <CardContent className="p-0">
                      {/* Project Header */}
                      <div className="p-4 bg-gray-50 border-b">
                        <h3 className="font-semibold text-gray-900">
                          {projectName}
                        </h3>
                      </div>
                      
                      {/* Project Documents */}
                      <div className="divide-y">
                        {docs.map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between gap-4 p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                                <FileText className="w-4 h-4 text-primary-700" />
                              </div>
                              <span className="text-sm text-gray-700">
                                {doc.title}
                              </span>
                            </div>
                            <a
                              href={doc.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-3 py-1.5 bg-primary-900 text-white rounded-lg hover:bg-primary-800 transition-colors text-xs font-medium shrink-0"
                            >
                              <Download className="w-3.5 h-3.5" />
                              {getFileType(doc.file_name)}
                            </a>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
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
