import { getTranslations } from 'next-intl/server';
import { Gavel, FileText, Download, BookOpen, ClipboardList, FileWarning } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';
import { getDocumentsBySourceFolder } from '@/lib/supabase/services/documents';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'hotarari',
    locale: locale as Locale,
    path: '/monitorul-oficial/hotarari',
  });
}

// Link-uri principale către paginile consiliului local
const MAIN_LINKS = [
  { id: 'hotarari-clms', href: '/consiliul-local/hotarari' },
  { id: 'hotarari-republicate', href: '/consiliul-local/hotarari-republicate' },
];

/**
 * Check if document is a project register (proiecte de hotărâri)
 */
function isProjectRegister(title: string): boolean {
  const lowerTitle = title.toLowerCase();
  return lowerTitle.includes('proiect');
}

export default async function HotarariMolPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const th = await getTranslations({ locale, namespace: 'hotarariMolPage' });

  // Fetch all registers from database
  const allDocuments = await getDocumentsBySourceFolder('hotararile-autoritatii-deliberative');
  
  // Separate into decision registers and project registers
  // Sort by database year only
  const decisionRegisters = allDocuments
    .filter(doc => !isProjectRegister(doc.title))
    .sort((a, b) => (b.year || 0) - (a.year || 0));
  
  const projectRegisters = allDocuments
    .filter(doc => isProjectRegister(doc.title))
    .sort((a, b) => (b.year || 0) - (a.year || 0));

  return (
    <>
      <Breadcrumbs items={[
        { label: t('monitorulOficial'), href: '/monitorul-oficial' },
        { label: t('hotarariMol') }
      ]} />
      <PageHeader titleKey="hotarariMol" icon="gavel" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto space-y-10">

            {/* Link-uri principale */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">{th('mainTitle')}</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {MAIN_LINKS.map((link) => (
                  <Link key={link.id} href={link.href}>
                    <Card className="hover:shadow-md transition-shadow h-full border-l-4 border-l-primary-600">
                      <CardContent className="p-5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                          <Gavel className="w-6 h-6 text-primary-700" />
                        </div>
                        <span className="font-semibold text-gray-900">{th(link.id)}</span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            {/* Registre hotărâri adoptate */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{th('registersTitle')}</h2>
                  <p className="text-sm text-gray-500">{th('registersSubtitle')}</p>
                </div>
              </div>
              
              {decisionRegisters.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <FileWarning className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-600 text-sm">{th('noDocuments')}</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  {decisionRegisters.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <FileText className="w-5 h-5 text-blue-600 shrink-0" />
                        <span className="font-medium text-gray-900 text-sm truncate" title={doc.title}>
                          {doc.title}
                        </span>
                      </div>
                      <Link
                        href={doc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium shrink-0"
                      >
                        <Download className="w-3 h-3" />
                        PDF
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Registre proiecte de hotărâri */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center">
                  <ClipboardList className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{th('projectsTitle')}</h2>
                  <p className="text-sm text-gray-500">{th('projectsSubtitle')}</p>
                </div>
              </div>
              
              {projectRegisters.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <FileWarning className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-600 text-sm">{th('noDocuments')}</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  {projectRegisters.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <FileText className="w-5 h-5 text-amber-600 shrink-0" />
                        <span className="font-medium text-gray-900 text-sm truncate" title={doc.title}>
                          {doc.title}
                        </span>
                      </div>
                      <Link
                        href={doc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-xs font-medium shrink-0"
                      >
                        <Download className="w-3 h-3" />
                        PDF
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </Container>
      </Section>
    </>
  );
}
