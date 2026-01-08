import { getTranslations } from 'next-intl/server';
import { BadgeCheck, Calendar, Download, FileText, ClipboardList, FolderOpen, Briefcase } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { Link } from '@/components/ui/link';
import { getJobVacancies, getDocumentsByCategory } from '@/lib/supabase/services';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';

const STATUS_LABELS: Record<string, Record<string, string>> = {
  activ: { ro: 'Activ', hu: 'Aktív', en: 'Active' },
  incheiat: { ro: 'Încheiat', hu: 'Lezárult', en: 'Closed' },
  anulat: { ro: 'Anulat', hu: 'Törölve', en: 'Cancelled' },
  suspendat: { ro: 'Suspendat', hu: 'Felfüggesztve', en: 'Suspended' },
};

const STATUS_COLORS: Record<string, string> = {
  activ: 'bg-green-100 text-green-800',
  incheiat: 'bg-gray-100 text-gray-800',
  anulat: 'bg-red-100 text-red-800',
  suspendat: 'bg-yellow-100 text-yellow-800',
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'carieraConcursuri',
    locale: locale as Locale,
    path: '/informatii-publice/concursuri',
  });
}

export default async function ConcursuriPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tPage = await getTranslations({ locale, namespace: 'concursuriPage' });

  // Fetch job vacancies from database
  const { data: jobs } = await getJobVacancies({ limit: 50 });
  
  // Fetch forms from documents
  const forms = await getDocumentsByCategory('formulare_concursuri');

  // Separate active and past jobs
  const activeJobs = jobs.filter(job => job.status === 'activ');
  const pastJobs = jobs.filter(job => job.status !== 'activ');

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

            {/* Active Job Vacancies */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-emerald-700" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{tPage('currentJobsTitle')}</h2>
              </div>

              {activeJobs.length === 0 ? (
                <Card className="bg-gray-50">
                  <CardContent className="pt-6 text-center py-8">
                    <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Nu există concursuri active momentan.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {activeJobs.map((job) => (
                    <Card key={job.id} hover>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                            <BadgeCheck className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-2">
                              <Link 
                                href={`/informatii-publice/concursuri/${job.slug}`}
                                className="font-medium text-gray-900 hover:text-primary-700"
                              >
                                {job.title}
                              </Link>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[job.status]}`}>
                                {STATUS_LABELS[job.status]?.[locale] || job.status}
                              </span>
                            </div>
                            
                            {job.application_deadline && (
                              <p className="text-sm text-gray-500 flex items-center gap-1 mb-2">
                                <Calendar className="w-4 h-4" />
                                Termen: {new Date(job.application_deadline).toLocaleDateString('ro-RO')}
                              </p>
                            )}
                            
                            {job.department && (
                              <p className="text-sm text-gray-600">{job.department}</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Past Job Vacancies */}
            {pastJobs.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-gray-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Concursuri anterioare</h2>
                </div>

                <div className="space-y-2">
                  {pastJobs.map((job) => (
                    <Card key={job.id} hover className="opacity-75 hover:opacity-100">
                      <CardContent className="flex items-center justify-between pt-4 pb-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4 text-gray-500" />
                          </div>
                          <div>
                            <Link 
                              href={`/informatii-publice/concursuri/${job.slug}`}
                              className="text-sm text-gray-700 hover:text-primary-700"
                            >
                              {job.title}
                            </Link>
                            <span className={`text-xs px-2 py-0.5 rounded-full ml-2 ${STATUS_COLORS[job.status]}`}>
                              {STATUS_LABELS[job.status]?.[locale] || job.status}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
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
