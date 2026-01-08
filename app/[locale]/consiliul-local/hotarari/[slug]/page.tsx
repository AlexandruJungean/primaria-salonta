import { getTranslations } from 'next-intl/server';
import { Calendar, FileText, Download, ArrowLeft, Gavel } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { Link } from '@/components/ui/link';
import { notFound } from 'next/navigation';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';
import { getCouncilSessionBySlug, getAllSessionSlugs } from '@/lib/supabase/services';
import type { CouncilSessionWithDetails } from '@/lib/types/database';

function formatDate(dateString: string, locale: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(
    locale === 'ro' ? 'ro-RO' : locale === 'hu' ? 'hu-HU' : 'en-US',
    { day: 'numeric', month: 'long', year: 'numeric' }
  );
}

function formatShortDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const session = await getCouncilSessionBySlug(slug);
  
  if (!session) {
    return generatePageMetadata({
      pageKey: 'hotarari',
      locale: locale as Locale,
      path: '/consiliul-local/hotarari',
    });
  }

  const dateFormatted = formatDate(session.session_date, locale);

  return generatePageMetadata({
    pageKey: 'hotarari',
    locale: locale as Locale,
    path: `/consiliul-local/hotarari/${slug}`,
    customTitle: `Hotărâri Consiliul Local - ${dateFormatted}`,
    customDescription: `Hotărârile Consiliului Local din ședința din ${dateFormatted}`,
  });
}

export async function generateStaticParams() {
  const slugs = await getAllSessionSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function HotarariDetailPage({ 
  params 
}: { 
  params: Promise<{ locale: string; slug: string }> 
}) {
  const { locale, slug } = await params;
  const session = await getCouncilSessionBySlug(slug);

  if (!session) {
    notFound();
  }

  const t = await getTranslations('navigation');
  const th = await getTranslations('hotarariPage');

  const dateFormatted = formatDate(session.session_date, locale);
  const shortDate = formatShortDate(session.session_date);

  // Find proces verbal document
  const procesVerbal = session.documents.find(d => d.document_type === 'proces_verbal');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('consiliulLocal'), href: '/consiliul-local' },
        { label: t('hotarari'), href: '/consiliul-local/hotarari' },
        { label: dateFormatted }
      ]} />
      
      <PageHeader 
        titleKey="hotarari" 
        icon="gavel"
        subtitle={dateFormatted}
      />

      <Section background="white">
        <Container>
          <div className="max-w-3xl mx-auto">
            {/* Back Link */}
            <Link
              href="/consiliul-local/hotarari"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-800 font-medium mb-6 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              {th('backToList')}
            </Link>

            <div className="space-y-6">
              {/* Session Header */}
              <div className="flex items-center gap-4 p-4 bg-primary-50 rounded-xl border border-primary-100">
                <div className="w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
                  <Calendar className="w-7 h-7 text-primary-700" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-primary-900">{dateFormatted}</h2>
                  <p className="text-sm text-primary-700 mt-0.5">
                    {th('sessionDecisions')}
                  </p>
                </div>
              </div>

              {/* Proces Verbal */}
              {procesVerbal && (
                <Card className="border-amber-200 bg-amber-50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5 text-amber-700" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-amber-900">
                            {th('procesVerbalTitle', { date: shortDate })}
                          </h3>
                          <p className="text-sm text-amber-700">{th('procesVerbalDesc')}</p>
                        </div>
                      </div>
                      <a
                        href={procesVerbal.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium text-sm shrink-0"
                      >
                        <Download className="w-4 h-4" />
                        {th('download')}
                      </a>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Session Documents (other than proces verbal) */}
              {session.documents.filter(d => d.document_type !== 'proces_verbal').length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-primary-600" />
                    Documente ședință
                  </h3>
                  <div className="grid gap-2">
                    {session.documents
                      .filter(d => d.document_type !== 'proces_verbal')
                      .map((doc) => (
                        <a
                          key={doc.id}
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-md bg-gray-100 group-hover:bg-primary-100 flex items-center justify-center transition-colors">
                              <FileText className="w-4 h-4 text-gray-500 group-hover:text-primary-600" />
                            </div>
                            <span className="font-medium text-gray-700 group-hover:text-primary-700">
                              {doc.title || doc.file_name}
                            </span>
                          </div>
                          <Download className="w-4 h-4 text-gray-400 group-hover:text-primary-600" />
                        </a>
                      ))}
                  </div>
                </div>
              )}

              {/* Decisions List */}
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                  <Gavel className="w-5 h-5 text-primary-600" />
                  {th('decisionsTitle')} ({session.decisions.length})
                </h3>
                
                {session.decisions.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    Nu există hotărâri pentru această ședință.
                  </p>
                ) : (
                  <div className="grid gap-2">
                    {session.decisions.map((decision) => {
                      // Get first document for the decision (usually the hotărâre itself)
                      const mainDoc = decision.documents.find(d => d.document_type === 'hotarare') || decision.documents[0];
                      
                      return (
                        <div key={decision.id} className="space-y-1">
                          {mainDoc ? (
                            <a
                              href={mainDoc.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all group"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-md bg-gray-100 group-hover:bg-primary-100 flex items-center justify-center transition-colors">
                                  <FileText className="w-4 h-4 text-gray-500 group-hover:text-primary-600" />
                                </div>
                                <div>
                                  <span className="font-medium text-gray-700 group-hover:text-primary-700 block">
                                    HCLMS nr. {decision.decision_number} din {shortDate}
                                  </span>
                                  {decision.title && (
                                    <span className="text-sm text-gray-500 line-clamp-1">
                                      {decision.title}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <Download className="w-4 h-4 text-gray-400 group-hover:text-primary-600" />
                            </a>
                          ) : (
                            <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center">
                                  <FileText className="w-4 h-4 text-gray-400" />
                                </div>
                                <div>
                                  <span className="font-medium text-gray-600 block">
                                    HCLMS nr. {decision.decision_number} din {shortDate}
                                  </span>
                                  {decision.title && (
                                    <span className="text-sm text-gray-500 line-clamp-1">
                                      {decision.title}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <span className="text-xs text-gray-400">Fără document</span>
                            </div>
                          )}
                          
                          {/* Additional documents for this decision (anexe, etc.) */}
                          {decision.documents.filter(d => d.document_type !== 'hotarare').length > 0 && (
                            <div className="ml-11 space-y-1">
                              {decision.documents
                                .filter(d => d.document_type !== 'hotarare')
                                .map((doc) => (
                                  <a
                                    key={doc.id}
                                    href={doc.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-2 bg-gray-50 border border-gray-100 rounded hover:border-primary-200 hover:bg-primary-50 transition-all group text-sm"
                                  >
                                    <div className="flex items-center gap-2">
                                      <FileText className="w-3 h-3 text-gray-400 group-hover:text-primary-500" />
                                      <span className="text-gray-600 group-hover:text-primary-600">
                                        {doc.title || doc.file_name}
                                      </span>
                                    </div>
                                    <Download className="w-3 h-3 text-gray-300 group-hover:text-primary-500" />
                                  </a>
                                ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
