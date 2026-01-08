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
import * as reports from '@/lib/supabase/services/reports';
import { 
  Calendar, 
  ArrowLeft, 
  FileText, 
  Download,
  User,
  Building2,
  FileSearch,
  ShieldCheck
} from 'lucide-react';

// ============================================
// TYPES & CONSTANTS
// ============================================

type ReportType = 'raport_primar' | 'raport_activitate' | 'studiu' | 'analiza' | 'audit' | 'altele';

const TYPE_LABELS: Record<ReportType, { ro: string; hu: string; en: string; color: string }> = {
  raport_primar: { 
    ro: 'Raport Primar', 
    hu: 'Polgármesteri jelentés', 
    en: 'Mayor Report',
    color: 'bg-blue-100 text-blue-800',
  },
  raport_activitate: { 
    ro: 'Raport de Activitate', 
    hu: 'Tevékenységi jelentés', 
    en: 'Activity Report',
    color: 'bg-green-100 text-green-800',
  },
  studiu: { 
    ro: 'Studiu', 
    hu: 'Tanulmány', 
    en: 'Study',
    color: 'bg-purple-100 text-purple-800',
  },
  analiza: { 
    ro: 'Analiză', 
    hu: 'Elemzés', 
    en: 'Analysis',
    color: 'bg-amber-100 text-amber-800',
  },
  audit: { 
    ro: 'Raport de Audit', 
    hu: 'Ellenőrzési jelentés', 
    en: 'Audit Report',
    color: 'bg-teal-100 text-teal-800',
  },
  altele: { 
    ro: 'Alte Rapoarte', 
    hu: 'Egyéb jelentések', 
    en: 'Other Reports',
    color: 'bg-gray-100 text-gray-800',
  },
};

// ============================================
// METADATA
// ============================================

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const report = await reports.getReportBySlug(slug);
  
  if (!report) {
    return generatePageMetadata({
      pageKey: 'rapoarteStudii',
      locale: locale as Locale,
      path: `/rapoarte-studii/${slug}`,
    });
  }

  return generatePageMetadata({
    pageKey: 'rapoarteStudii',
    locale: locale as Locale,
    path: `/rapoarte-studii/${slug}`,
    customTitle: report.title,
    customDescription: report.summary?.substring(0, 160) || undefined,
  });
}

// ============================================
// STATIC PARAMS
// ============================================

export async function generateStaticParams() {
  const slugs = await reports.getAllReportSlugs();
  return slugs.map(slug => ({ slug }));
}

// ============================================
// COMPONENT
// ============================================

export default async function RaportStudiuDetailPage({ 
  params 
}: { 
  params: Promise<{ locale: string; slug: string }> 
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });

  const report = await reports.getReportBySlug(slug);

  if (!report) {
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
      backToList: 'Înapoi la rapoarte și studii',
      publishedAt: 'Publicat la',
      author: 'Autor',
      year: 'Anul',
      category: 'Categorie',
      description: 'Descriere',
      downloadMain: 'Descarcă documentul',
      noDescription: 'Nu există descriere disponibilă.',
    },
    hu: {
      backToList: 'Vissza a jelentésekhez és tanulmányokhoz',
      publishedAt: 'Közzétéve',
      author: 'Szerző',
      year: 'Év',
      category: 'Kategória',
      description: 'Leírás',
      downloadMain: 'Dokumentum letöltése',
      noDescription: 'Nincs leírás.',
    },
    en: {
      backToList: 'Back to reports and studies',
      publishedAt: 'Published on',
      author: 'Author',
      year: 'Year',
      category: 'Category',
      description: 'Description',
      downloadMain: 'Download document',
      noDescription: 'No description available.',
    },
  };

  const labels = pageLabels[locale as keyof typeof pageLabels] || pageLabels.en;
  const typeLabel = TYPE_LABELS[report.report_type as ReportType] || TYPE_LABELS.altele;
  const TypeIcon = report.report_type === 'audit' ? ShieldCheck : FileSearch;

  return (
    <>
      <Breadcrumbs items={[
        { label: t('rapoarteStudii'), href: '/rapoarte-studii' },
        { label: report.title },
      ]} />

      <PageHeader 
        titleKey="rapoarteStudii" 
        icon="fileSearch"
        subtitle={report.title}
      />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Back Link */}
            <Link
              href="/rapoarte-studii"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-800 font-medium mb-6 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              {labels.backToList}
            </Link>

            {/* Header Card */}
            <Card className="mb-8 overflow-hidden">
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className={typeLabel.color}>
                    <TypeIcon className="w-4 h-4 mr-1" />
                    {typeLabel[locale as keyof typeof typeLabel] || typeLabel.ro}
                  </Badge>
                  {report.report_year && (
                    <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                      {report.report_year}
                    </Badge>
                  )}
                </div>
              </div>
              <CardContent className="pt-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {report.title}
                </h1>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-6">
                  {report.report_date && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{labels.publishedAt}: {formatDate(report.report_date)}</span>
                    </div>
                  )}
                  {report.author && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>{report.author}</span>
                    </div>
                  )}
                  {report.category && (
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <span>{report.category}</span>
                    </div>
                  )}
                </div>

                {/* Download Button */}
                {report.file_url && (
                  <a
                    href={report.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                  >
                    <Download className="w-5 h-5" />
                    {labels.downloadMain}
                  </a>
                )}
              </CardContent>
            </Card>

            {/* Description */}
            {report.summary && (
              <Card>
                <CardHeader>
                  <CardTitle>{labels.description}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div 
                    className="prose prose-gray max-w-none"
                    dangerouslySetInnerHTML={{ __html: report.summary }}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
