import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { Link } from '@/components/ui/link';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';
import * as jobs from '@/lib/supabase/services/jobs';
import { 
  Calendar, 
  Clock,
  MapPin,
  ArrowLeft, 
  FileText, 
  Download,
  Briefcase,
  Mail,
  Phone,
  Building2,
  AlertCircle
} from 'lucide-react';

// ============================================
// TYPES & CONSTANTS
// ============================================

type PositionType = 'functionar_public' | 'personal_contractual' | 'conducere' | 'temporar';
type JobStatus = 'activ' | 'incheiat' | 'anulat' | 'suspendat';

const POSITION_TYPE_LABELS: Record<PositionType, { ro: string; hu: string; en: string; color: string }> = {
  functionar_public: { 
    ro: 'Funcționar Public', 
    hu: 'Köztisztviselő', 
    en: 'Public Official',
    color: 'bg-blue-100 text-blue-800',
  },
  personal_contractual: { 
    ro: 'Personal Contractual', 
    hu: 'Szerződéses személyzet', 
    en: 'Contractual Staff',
    color: 'bg-purple-100 text-purple-800',
  },
  conducere: {
    ro: 'Personal de Conducere',
    hu: 'Vezetői személyzet',
    en: 'Management Staff',
    color: 'bg-amber-100 text-amber-800',
  },
  temporar: {
    ro: 'Post Temporar',
    hu: 'Ideiglenes állás',
    en: 'Temporary Position',
    color: 'bg-gray-100 text-gray-800',
  },
};

const JOB_STATUS_LABELS: Record<JobStatus, { ro: string; hu: string; en: string; color: string }> = {
  activ: { 
    ro: 'Înscrieri deschise', 
    hu: 'Nyitott jelentkezés', 
    en: 'Open for applications',
    color: 'bg-green-100 text-green-800',
  },
  incheiat: { 
    ro: 'Finalizat', 
    hu: 'Lezárva', 
    en: 'Closed',
    color: 'bg-gray-100 text-gray-800',
  },
  anulat: { 
    ro: 'Anulat', 
    hu: 'Törölve', 
    en: 'Cancelled',
    color: 'bg-red-100 text-red-800',
  },
  suspendat: { 
    ro: 'Suspendat', 
    hu: 'Felfüggesztve', 
    en: 'Suspended',
    color: 'bg-amber-100 text-amber-800',
  },
};

const DOCUMENT_TYPE_LABELS: Record<string, { ro: string; hu: string; en: string }> = {
  anunt: { ro: 'Anunț concurs', hu: 'Pályázati hirdetmény', en: 'Competition announcement' },
  bibliografie: { ro: 'Bibliografie', hu: 'Bibliográfia', en: 'Bibliography' },
  formular: { ro: 'Formular înscriere', hu: 'Jelentkezési lap', en: 'Application form' },
  rezultate: { ro: 'Rezultate', hu: 'Eredmények', en: 'Results' },
  contestatie: { ro: 'Contestație', hu: 'Fellebbezés', en: 'Appeal' },
  final: { ro: 'Rezultate finale', hu: 'Végeredmények', en: 'Final results' },
  altele: { ro: 'Alte documente', hu: 'Egyéb dokumentumok', en: 'Other documents' },
};

// ============================================
// METADATA
// ============================================

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const job = await jobs.getJobVacancyBySlug(slug);
  
  if (!job) {
    return generatePageMetadata({
      pageKey: 'informatiiPublice',
      locale: locale as Locale,
      path: `/informatii-publice/concursuri/${slug}`,
    });
  }

  return generatePageMetadata({
    pageKey: 'informatiiPublice',
    locale: locale as Locale,
    path: `/informatii-publice/concursuri/${slug}`,
    customTitle: job.title,
    customDescription: job.description?.substring(0, 160) || undefined,
  });
}

// ============================================
// STATIC PARAMS
// ============================================

export async function generateStaticParams() {
  const slugs = await jobs.getAllJobSlugs();
  return slugs.map(slug => ({ slug }));
}

// ============================================
// COMPONENT
// ============================================

export default async function JobDetailPage({ 
  params 
}: { 
  params: Promise<{ locale: string; slug: string }> 
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });

  const job = await jobs.getJobVacancyBySlug(slug);

  if (!job) {
    notFound();
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString(
      locale === 'ro' ? 'ro-RO' : locale === 'hu' ? 'hu-HU' : 'en-US',
      { day: 'numeric', month: 'long', year: 'numeric' }
    );
  };

  const pageLabels = {
    ro: {
      backToList: 'Înapoi la concursuri',
      publishedAt: 'Publicat',
      deadline: 'Termen limită înscriere',
      department: 'Departament',
      location: 'Locație',
      examDate: 'Data examen',
      description: 'Descrierea postului',
      requirements: 'Cerințe',
      benefits: 'Beneficii',
      documents: 'Documente concurs',
      contact: 'Contact',
      applyNow: 'Aplică acum',
      deadlinePassed: 'Termenul de înscriere a expirat',
      noDescription: 'Nu există descriere disponibilă.',
      noRequirements: 'Nu sunt specificate cerințe.',
      noBenefits: 'Nu sunt specificate beneficii.',
    },
    hu: {
      backToList: 'Vissza a pályázatokhoz',
      publishedAt: 'Közzétéve',
      deadline: 'Jelentkezési határidő',
      department: 'Osztály',
      location: 'Helyszín',
      examDate: 'Vizsga dátuma',
      description: 'Állásleírás',
      requirements: 'Követelmények',
      benefits: 'Juttatások',
      documents: 'Pályázati dokumentumok',
      contact: 'Kapcsolat',
      applyNow: 'Jelentkezés',
      deadlinePassed: 'A jelentkezési határidő lejárt',
      noDescription: 'Nincs leírás.',
      noRequirements: 'Nincsenek megadva követelmények.',
      noBenefits: 'Nincsenek megadva juttatások.',
    },
    en: {
      backToList: 'Back to competitions',
      publishedAt: 'Published',
      deadline: 'Application deadline',
      department: 'Department',
      location: 'Location',
      examDate: 'Exam date',
      description: 'Job description',
      requirements: 'Requirements',
      benefits: 'Benefits',
      documents: 'Competition documents',
      contact: 'Contact',
      applyNow: 'Apply now',
      deadlinePassed: 'Application deadline has passed',
      noDescription: 'No description available.',
      noRequirements: 'No requirements specified.',
      noBenefits: 'No benefits specified.',
    },
  };

  const labels = pageLabels[locale as keyof typeof pageLabels] || pageLabels.en;
  const isDeadlinePassed = job.application_deadline ? new Date(job.application_deadline) < new Date() : false;

  const positionTypeLabel = POSITION_TYPE_LABELS[job.position_type] || POSITION_TYPE_LABELS.personal_contractual;
  const statusLabel = JOB_STATUS_LABELS[job.status] || JOB_STATUS_LABELS.activ;

  return (
    <>
      <Breadcrumbs items={[
        { label: t('informatiiPublice'), href: '/informatii-publice' },
        { label: t('carieraConcursuri'), href: '/informatii-publice/concursuri' },
        { label: job.title },
      ]} />

      <PageHeader 
        titleKey="carieraConcursuri" 
        icon="badgeCheck"
        subtitle={job.title}
      />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Back Link */}
            <Link
              href="/informatii-publice/concursuri"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-800 font-medium mb-6 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              {labels.backToList}
            </Link>

            {/* Header Card */}
            <Card className="mb-8 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className={positionTypeLabel.color}>
                    {positionTypeLabel[locale as keyof typeof positionTypeLabel] || positionTypeLabel.ro}
                  </Badge>
                  <Badge className={statusLabel.color}>
                    {statusLabel[locale as keyof typeof statusLabel] || statusLabel.ro}
                  </Badge>
                </div>
              </div>
              <CardContent className="pt-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {job.title}
                </h1>
                {job.department && (
                  <p className="text-gray-600 mb-4">{job.department}</p>
                )}

                {/* Job Info Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{labels.publishedAt}</p>
                      <p className="font-semibold text-gray-900">{formatDate(job.created_at)}</p>
                    </div>
                  </div>

                  {job.application_deadline && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                        <Clock className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{labels.deadline}</p>
                        <p className={`font-semibold ${isDeadlinePassed ? 'text-red-600' : 'text-gray-900'}`}>
                          {formatDate(job.application_deadline)}
                        </p>
                      </div>
                    </div>
                  )}

                  {job.exam_location && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{labels.location}</p>
                        <p className="font-semibold text-gray-900 text-sm">{job.exam_location}</p>
                      </div>
                    </div>
                  )}

                  {job.exam_date && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                        <Briefcase className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{labels.examDate}</p>
                        <p className="font-semibold text-gray-900">{formatDate(job.exam_date)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Description */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary-600" />
                      {labels.description}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {job.description ? (
                      <div 
                        className="prose prose-gray max-w-none"
                        dangerouslySetInnerHTML={{ __html: job.description }}
                      />
                    ) : (
                      <p className="text-gray-500">{labels.noDescription}</p>
                    )}
                  </CardContent>
                </Card>

                {/* Requirements */}
                {job.requirements && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary-600" />
                        {labels.requirements}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div 
                        className="prose prose-gray max-w-none"
                        dangerouslySetInnerHTML={{ __html: job.requirements }}
                      />
                    </CardContent>
                  </Card>
                )}

                {/* Benefits */}
                {job.benefits && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary-600" />
                        {labels.benefits}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div 
                        className="prose prose-gray max-w-none"
                        dangerouslySetInnerHTML={{ __html: job.benefits }}
                      />
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Documents */}
                {job.documents && job.documents.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <FileText className="w-5 h-5 text-primary-600" />
                        {labels.documents}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {job.documents.map((doc) => {
                          const docTypeLabel = DOCUMENT_TYPE_LABELS[doc.document_type] || DOCUMENT_TYPE_LABELS.altele;
                          return (
                            <a
                              key={doc.id}
                              href={doc.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                                  <FileText className="w-4 h-4 text-red-600" />
                                </div>
                                <div className="min-w-0">
                                  <p className="font-medium text-gray-900 group-hover:text-primary-700 text-sm truncate">
                                    {doc.title || docTypeLabel[locale as keyof typeof docTypeLabel] || docTypeLabel.ro}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {docTypeLabel[locale as keyof typeof docTypeLabel] || docTypeLabel.ro}
                                  </p>
                                </div>
                              </div>
                              <Download className="w-4 h-4 text-gray-400 group-hover:text-primary-600 shrink-0 ml-2" />
                            </a>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Contact */}
                {(job.contact_email || job.contact_phone || job.contact_person) && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Building2 className="w-5 h-5 text-primary-600" />
                        {labels.contact}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {job.contact_person && (
                        <div className="text-sm text-gray-700 font-medium">
                          {job.contact_person}
                        </div>
                      )}
                      {job.contact_email && (
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-gray-400" />
                          <a href={`mailto:${job.contact_email}`} className="text-primary-600 hover:underline text-sm">
                            {job.contact_email}
                          </a>
                        </div>
                      )}
                      {job.contact_phone && (
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-gray-400" />
                          <a href={`tel:${job.contact_phone.replace(/[.\s-]/g, '')}`} className="text-primary-600 hover:underline text-sm">
                            {job.contact_phone}
                          </a>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Apply Button */}
                {job.status === 'activ' && !isDeadlinePassed && job.contact_email && (
                  <a
                    href={`mailto:${job.contact_email}?subject=${encodeURIComponent(job.title)}`}
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
                  >
                    <Mail className="w-5 h-5" />
                    {labels.applyNow}
                  </a>
                )}

                {isDeadlinePassed && (
                  <div className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gray-100 text-gray-500 rounded-lg font-medium">
                    <AlertCircle className="w-5 h-5" />
                    {labels.deadlinePassed}
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
