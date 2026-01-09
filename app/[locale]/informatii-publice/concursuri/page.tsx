'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { BadgeCheck, Download, FileText, ClipboardList, Briefcase } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { Collapsible, CollapsibleGroup } from '@/components/ui/collapsible';

interface Document {
  id: string;
  title: string;
  file_url: string;
  file_name: string;
  subcategory: string | null;
}

export default function ConcursuriPage() {
  const t = useTranslations('navigation');
  const tPage = useTranslations('concursuriPage');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDocuments() {
      try {
        const response = await fetch('/api/documents?category=concursuri');
        if (response.ok) {
          const data = await response.json();
          setDocuments(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchDocuments();
  }, []);

  // Separate forms from job documents
  const forms = documents.filter(doc => doc.subcategory === 'formulare');
  const jobDocuments = documents.filter(doc => doc.subcategory !== 'formulare');

  // Group job documents by subcategory (job position)
  const groupedJobs = new Map<string, Document[]>();
  jobDocuments.forEach((doc) => {
    const key = doc.subcategory || 'altele';
    if (!groupedJobs.has(key)) {
      groupedJobs.set(key, []);
    }
    groupedJobs.get(key)!.push(doc);
  });

  return (
    <>
      <Breadcrumbs items={[
        { label: t('informatiiPublice'), href: '/informatii-publice' },
        { label: t('carieraConcursuri') }
      ]} />
      <PageHeader titleKey="carieraConcursuri" icon="badgeCheck" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            {/* Info Banner */}
            <Card className="mb-8 bg-emerald-50 border-emerald-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <BadgeCheck className="w-8 h-8 text-emerald-600 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-emerald-900 mb-2">{tPage('infoTitle')}</h3>
                    <p className="text-emerald-800 text-sm">
                      {tPage('infoText')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
                <p className="text-gray-500 mt-4">Se încarcă...</p>
              </div>
            ) : documents.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">{tPage('noJobs')}</p>
              </div>
            ) : (
              <>
                {/* Forms Section */}
                {forms.length > 0 && (
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ClipboardList className="w-5 h-5 text-primary-600" />
                        {tPage('formsTitle')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {forms.map((form) => (
                          <a
                            key={form.id}
                            href={form.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-primary-300 transition-colors"
                          >
                            <Download className="w-4 h-4 text-primary-600" />
                            <span className="text-gray-700">{form.title}</span>
                          </a>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Job Documents Section */}
                {groupedJobs.size > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-emerald-700" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">{tPage('currentJobsTitle')}</h2>
                    </div>

                    <CollapsibleGroup>
                      {Array.from(groupedJobs.entries()).map(([position, docs], index) => (
                        <Collapsible
                          key={position}
                          title={
                            <span className="flex items-center gap-3">
                              <BadgeCheck className="w-5 h-5 text-emerald-600" />
                              <span className="font-semibold">{position}</span>
                              <span className="text-sm text-gray-500 font-normal">
                                ({docs.length} {docs.length === 1 ? 'document' : 'documente'})
                              </span>
                            </span>
                          }
                          defaultOpen={index === 0}
                        >
                          <div className="grid gap-2">
                            {docs.map((doc) => (
                              <a
                                key={doc.id}
                                href={doc.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-emerald-300 transition-colors"
                              >
                                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                                  <FileText className="w-4 h-4 text-emerald-700" />
                                </div>
                                <span className="flex-1 text-gray-700 text-sm">{doc.title}</span>
                                <Download className="w-4 h-4 text-emerald-600 shrink-0" />
                              </a>
                            ))}
                          </div>
                        </Collapsible>
                      ))}
                    </CollapsibleGroup>
                  </div>
                )}
              </>
            )}

            {/* Info Note */}
            <Card className="mt-8 bg-gray-50 border-gray-200">
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
