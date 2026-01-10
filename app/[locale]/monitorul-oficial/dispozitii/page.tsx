import { getTranslations } from 'next-intl/server';
import { FileCheck, FileText, Download, BookOpen, FileWarning } from 'lucide-react';
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
    pageKey: 'dispozitii',
    locale: locale as Locale,
    path: '/monitorul-oficial/dispozitii',
  });
}

/**
 * Extract year from document title for sorting
 */
function extractYearFromTitle(title: string): number {
  const match = title.match(/\b(20\d{2})\b/);
  return match ? parseInt(match[1], 10) : 0;
}

export default async function DispozitiiPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const td = await getTranslations({ locale, namespace: 'dispozitiiMolPage' });

  // Fetch disposition registers from database
  const registers = await getDocumentsBySourceFolder('dispozitiile-autoritatii-executive');
  
  // Sort by year descending
  const sortedRegisters = [...registers].sort((a, b) => {
    const yearA = a.year || extractYearFromTitle(a.title);
    const yearB = b.year || extractYearFromTitle(b.title);
    return yearB - yearA;
  });

  return (
    <>
      <Breadcrumbs items={[
        { label: t('monitorulOficial'), href: '/monitorul-oficial' },
        { label: t('dispozitii') }
      ]} />
      <PageHeader titleKey="dispozitii" icon="fileCheck" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto space-y-10">

            {/* Link principal */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">{td('mainTitle')}</h2>
              <Link href="/informatii-publice/dispozitii">
                <Card className="hover:shadow-md transition-shadow border-l-4 border-l-green-600">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                      <FileCheck className="w-6 h-6 text-green-700" />
                    </div>
                    <span className="font-semibold text-gray-900">{td('mainTitle')}</span>
                  </CardContent>
                </Card>
              </Link>
            </div>

            {/* Registre dispoziții */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{td('registersTitle')}</h2>
                  <p className="text-sm text-gray-500">{td('registersSubtitle')}</p>
                </div>
              </div>
              
              {sortedRegisters.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <FileWarning className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-600 text-sm">{td('noDocuments')}</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  {sortedRegisters.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-gray-900 text-sm">
                          {doc.title}
                        </span>
                      </div>
                      <Link
                        href={doc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs font-medium shrink-0"
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
