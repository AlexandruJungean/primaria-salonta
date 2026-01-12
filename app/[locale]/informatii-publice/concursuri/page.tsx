import { getTranslations } from 'next-intl/server';
import { BadgeCheck, Download, FileText, ClipboardList, Briefcase, Calendar, Clock, FolderDown } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { Collapsible, CollapsibleGroup } from '@/components/ui/collapsible';
import { getJobVacancies, DOCUMENT_TYPE_LABELS, STATUS_LABELS } from '@/lib/supabase/services/job-vacancies';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';

const GENERAL_FORMS_SLUG = 'formulare-generale';

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

  const allJobs = await getJobVacancies();

  // Separate general forms from regular jobs
  const generalFormsEntry = allJobs.find(job => job.slug === GENERAL_FORMS_SLUG);
  const jobs = allJobs.filter(job => job.slug !== GENERAL_FORMS_SLUG);

  // Separate active and finished jobs
  const activeJobs = jobs.filter(job => job.status === 'activ' || job.status === 'in_desfasurare');
  const finishedJobs = jobs.filter(job => job.status === 'finalizat' || job.status === 'anulat');

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('ro-RO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const pageLabels = {
    ro: {
      infoTitle: 'Informații despre concursuri',
      infoText: 'Aici găsiți toate concursurile și posturile vacante disponibile la Primăria Municipiului Salonta. Documentele necesare pentru înscriere pot fi descărcate direct din această pagină.',
      generalFormsTitle: 'Formulare generale pentru înscriere',
      generalFormsDesc: 'Descărcați formularele tipizate necesare pentru înscrierea la orice concurs.',
      activeJobsTitle: 'Concursuri Active',
      finishedJobsTitle: 'Concursuri Finalizate',
      noActiveJobs: 'Nu există concursuri active în acest moment.',
      deadline: 'Termen limită',
      contestDate: 'Data concurs',
      documents: 'documente',
      noteTitle: 'Informații importante',
      noteText: 'Pentru informații suplimentare despre concursuri, vă rugăm să contactați Biroul Resurse Umane al Primăriei Municipiului Salonta.',
    },
    hu: {
      infoTitle: 'Információk a versenyekről',
      infoText: 'Itt találja Nagyszalonta Polgármesteri Hivatalának összes pályázatát és betöltetlen állását. A jelentkezéshez szükséges dokumentumok közvetlenül erről az oldalról letölthetők.',
      generalFormsTitle: 'Általános jelentkezési nyomtatványok',
      generalFormsDesc: 'Töltse le a pályázatokhoz szükséges űrlapokat.',
      activeJobsTitle: 'Aktív pályázatok',
      finishedJobsTitle: 'Befejezett pályázatok',
      noActiveJobs: 'Jelenleg nincsenek aktív pályázatok.',
      deadline: 'Határidő',
      contestDate: 'Verseny dátuma',
      documents: 'dokumentum',
      noteTitle: 'Fontos információk',
      noteText: 'A pályázatokkal kapcsolatos további információkért kérjük, forduljon Nagyszalonta Polgármesteri Hivatalának Humánerőforrás Irodájához.',
    },
    en: {
      infoTitle: 'Competition Information',
      infoText: 'Here you can find all available competitions and vacancies at Salonta City Hall. The documents required for registration can be downloaded directly from this page.',
      generalFormsTitle: 'General Application Forms',
      generalFormsDesc: 'Download the standard forms required for any competition registration.',
      activeJobsTitle: 'Active Competitions',
      finishedJobsTitle: 'Completed Competitions',
      noActiveJobs: 'There are no active competitions at the moment.',
      deadline: 'Deadline',
      contestDate: 'Contest date',
      documents: 'documents',
      noteTitle: 'Important Information',
      noteText: 'For additional information about competitions, please contact the Human Resources Office of Salonta City Hall.',
    },
  };

  const labels = pageLabels[locale as keyof typeof pageLabels] || pageLabels.ro;

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
                    <h3 className="font-semibold text-emerald-900 mb-2">{labels.infoTitle}</h3>
                    <p className="text-emerald-800 text-sm">{labels.infoText}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* General Forms Section */}
            {generalFormsEntry && generalFormsEntry.job_vacancy_documents && generalFormsEntry.job_vacancy_documents.length > 0 && (
              <Card className="mb-8 border-blue-200 bg-blue-50/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <FolderDown className="w-5 h-5 text-blue-700" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-blue-900">{labels.generalFormsTitle}</CardTitle>
                      <p className="text-sm text-blue-700 mt-1">{labels.generalFormsDesc}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {generalFormsEntry.job_vacancy_documents
                      .sort((a, b) => a.sort_order - b.sort_order)
                      .map((doc) => (
                        <a
                          key={doc.id}
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 hover:border-blue-400 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4 text-blue-700" />
                          </div>
                          <span className="flex-1 text-blue-900 text-sm truncate font-medium">
                            {doc.title || doc.file_name}
                          </span>
                          <Download className="w-4 h-4 text-blue-600 shrink-0" />
                        </a>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {jobs.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">{labels.noActiveJobs}</p>
              </div>
            ) : (
              <>
                {/* Active Jobs */}
                {activeJobs.length > 0 && (
                  <div className="mb-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-emerald-700" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">{labels.activeJobsTitle}</h2>
                    </div>

                    <CollapsibleGroup>
                      {activeJobs.map((job, index) => (
                        <Collapsible
                          key={job.id}
                          title={
                            <div className="flex items-center justify-between w-full pr-4">
                              <span className="flex items-center gap-3">
                                <BadgeCheck className="w-5 h-5 text-emerald-600" />
                                <span className="font-semibold">{job.position}</span>
                                {job.department && (
                                  <span className="text-sm text-gray-500 font-normal">
                                    ({job.department})
                                  </span>
                                )}
                              </span>
                              <span className="flex items-center gap-4 text-sm">
                                {job.application_deadline && (
                                  <span className="flex items-center gap-1 text-amber-600">
                                    <Clock className="w-4 h-4" />
                                    {formatDate(job.application_deadline)}
                                  </span>
                                )}
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                  job.status === 'activ' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                }`}>
                                  {STATUS_LABELS[job.status]}
                                </span>
                              </span>
                            </div>
                          }
                          defaultOpen={index === 0}
                        >
                          <div className="space-y-4">
                            {/* Job Details */}
                            <div className="grid gap-3 md:grid-cols-2">
                              {job.application_deadline && (
                                <div className="flex items-center gap-2 text-sm">
                                  <Calendar className="w-4 h-4 text-gray-400" />
                                  <span className="text-gray-600">{labels.deadline}:</span>
                                  <span className="font-medium">{formatDate(job.application_deadline)}</span>
                                </div>
                              )}
                              {job.exam_date && (
                                <div className="flex items-center gap-2 text-sm">
                                  <Calendar className="w-4 h-4 text-gray-400" />
                                  <span className="text-gray-600">{labels.contestDate}:</span>
                                  <span className="font-medium">{formatDate(job.exam_date)}</span>
                                </div>
                              )}
                            </div>

                            {/* Description */}
                            {job.description && (
                              <p className="text-gray-600 text-sm">{job.description}</p>
                            )}

                            {/* Documents */}
                            {job.job_vacancy_documents && job.job_vacancy_documents.length > 0 && (
                              <div className="grid gap-2">
                                {job.job_vacancy_documents
                                  .sort((a, b) => a.sort_order - b.sort_order)
                                  .map((doc) => (
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
                                      <div className="flex-1 min-w-0">
                                        <span className="text-gray-700 text-sm block truncate">
                                          {doc.title || doc.file_name}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                          {DOCUMENT_TYPE_LABELS[doc.document_type]}
                                        </span>
                                      </div>
                                      <Download className="w-4 h-4 text-emerald-600 shrink-0" />
                                    </a>
                                  ))}
                              </div>
                            )}
                          </div>
                        </Collapsible>
                      ))}
                    </CollapsibleGroup>
                  </div>
                )}

                {/* Finished Jobs */}
                {finishedJobs.length > 0 && (
                  <div className="mb-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                        <ClipboardList className="w-5 h-5 text-gray-500" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">{labels.finishedJobsTitle}</h2>
                    </div>

                    <CollapsibleGroup>
                      {finishedJobs.map((job) => (
                        <Collapsible
                          key={job.id}
                          title={
                            <div className="flex items-center justify-between w-full pr-4">
                              <span className="flex items-center gap-3">
                                <BadgeCheck className="w-5 h-5 text-gray-400" />
                                <span className="font-semibold text-gray-600">{job.position}</span>
                              </span>
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                job.status === 'finalizat' ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-600'
                              }`}>
                                {STATUS_LABELS[job.status]}
                              </span>
                            </div>
                          }
                        >
                          {job.job_vacancy_documents && job.job_vacancy_documents.length > 0 && (
                            <div className="grid gap-2">
                              {job.job_vacancy_documents
                                .sort((a, b) => a.sort_order - b.sort_order)
                                .map((doc) => (
                                  <a
                                    key={doc.id}
                                    href={doc.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                  >
                                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                                      <FileText className="w-4 h-4 text-gray-500" />
                                    </div>
                                    <span className="flex-1 text-gray-600 text-sm truncate">
                                      {doc.title || doc.file_name}
                                    </span>
                                    <Download className="w-4 h-4 text-gray-400 shrink-0" />
                                  </a>
                                ))}
                            </div>
                          )}
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
                    <h3 className="font-semibold text-gray-700 mb-2">{labels.noteTitle}</h3>
                    <p className="text-gray-600 text-sm">{labels.noteText}</p>
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
