import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { 
  ExternalLink,
  ArrowLeft,
  Euro,
  Target,
  Building2,
} from 'lucide-react';
import Image from 'next/image';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { Link } from '@/components/ui/link';
import { ImageGallery } from '@/components/ui/image-gallery';
import { generatePageMetadata, ProgramJsonLd, BreadcrumbJsonLd } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';
import * as programs from '@/lib/supabase/services/programs';
import { translateContentFields, translateContentArray } from '@/lib/google-translate/cache';
import { ProgramUpdatesAccordion } from './program-updates-accordion';
import { ProgramDocumentsSection } from './program-documents-section';
import { ProgramChildrenList } from './program-children-list';

// ============================================
// METADATA
// ============================================

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const program = await programs.getProgramBySlug(slug);
  
  if (!program) {
    return generatePageMetadata({
      pageKey: 'programe',
      locale: locale as Locale,
      path: `/programe/${slug}`,
    });
  }

  return generatePageMetadata({
    pageKey: 'programe',
    locale: locale as Locale,
    path: `/programe/${slug}`,
    customTitle: program.title,
    customDescription: program.short_description || undefined,
  });
}

// ============================================
// STATIC PARAMS
// ============================================

export async function generateStaticParams() {
  const slugs = await programs.getAllProgramSlugs();
  return slugs.map(slug => ({ slug }));
}

// ============================================
// LABELS
// ============================================

const pageLabels = {
  ro: {
    backToPrograms: 'Înapoi la programe',
    documents: 'Documente',
    description: 'Descriere',
    gallery: 'Galerie foto',
    projectUpdates: 'Stadiul proiectului',
    download: 'Descarcă',
    inProgress: 'În desfășurare',
    completed: 'Finalizat',
    planned: 'Planificat',
    cancelled: 'Anulat',
    fundedBy: 'Cofinanțat de Uniunea Europeană',
    objective: 'Obiectiv',
    specificObjective: 'Obiectiv specific',
    callTitle: 'Apel',
    subPrograms: 'Proiecte',
    viewDetails: 'Vezi detalii',
    otherDocuments: 'Alte documente',
  },
  hu: {
    backToPrograms: 'Vissza a programokhoz',
    documents: 'Dokumentumok',
    description: 'Leírás',
    gallery: 'Fotógaléria',
    projectUpdates: 'Projekt állapota',
    download: 'Letöltés',
    inProgress: 'Folyamatban',
    completed: 'Befejezett',
    planned: 'Tervezett',
    cancelled: 'Törölve',
    fundedBy: 'Az Európai Unió társfinanszírozásával',
    objective: 'Célkitűzés',
    specificObjective: 'Konkrét célkitűzés',
    callTitle: 'Pályázat',
    subPrograms: 'Projektek',
    viewDetails: 'Részletek',
    otherDocuments: 'Egyéb dokumentumok',
  },
  en: {
    backToPrograms: 'Back to programs',
    documents: 'Documents',
    description: 'Description',
    gallery: 'Photo gallery',
    projectUpdates: 'Project status',
    download: 'Download',
    inProgress: 'In progress',
    completed: 'Completed',
    planned: 'Planned',
    cancelled: 'Cancelled',
    fundedBy: 'Co-funded by the European Union',
    objective: 'Objective',
    specificObjective: 'Specific objective',
    callTitle: 'Call',
    subPrograms: 'Projects',
    viewDetails: 'View details',
    otherDocuments: 'Other documents',
  },
};

// ============================================
// COMPONENT
// ============================================

export default async function ProgramPage({ 
  params 
}: { 
  params: Promise<{ locale: string; slug: string }> 
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });

  const programData = await programs.getProgramBySlug(slug);

  if (!programData) {
    notFound();
  }

  const labels = pageLabels[locale as keyof typeof pageLabels] || pageLabels.en;

  // Translate program content based on locale
  const programTranslated = await translateContentFields(
    programData,
    ['title', 'short_description', 'full_description', 'objective', 'specific_objective', 'call_title'],
    locale as 'ro' | 'hu' | 'en'
  );

  // Translate documents if present
  const translatedDocuments = programData.documents 
    ? await translateContentArray(programData.documents, ['title'], locale as 'ro' | 'hu' | 'en')
    : [];

  // Translate children if present
  const translatedChildren = programData.children 
    ? await translateContentArray(programData.children, ['title', 'short_description'], locale as 'ro' | 'hu' | 'en')
    : [];

  const program = {
    ...programTranslated,
    documents: translatedDocuments,
    images: programData.images || [],
    updates: programData.updates || [],
    children: translatedChildren,
  };

  // Get images by type
  const galleryImages = program.images?.filter(img => img.image_type === 'gallery') || [];
  const sponsorLogos = program.images?.filter(img => img.image_type === 'sponsor') || [];
  const featuredImage = program.images?.find(img => img.image_type === 'featured');

  // Build external links from URL fields
  const externalLinks: { url: string; label: string }[] = [];
  if (program.website_url) externalLinks.push({ url: program.website_url, label: 'Website proiect' });
  if (program.program_url) externalLinks.push({ url: program.program_url, label: 'Pagina programului' });
  if (program.facebook_url) externalLinks.push({ url: program.facebook_url, label: 'Facebook' });
  if (program.instagram_url) externalLinks.push({ url: program.instagram_url, label: 'Instagram' });

  // Group documents
  const documentGroups = programs.groupDocuments(program.documents || [], program.document_grouping);

  // Breadcrumb items for JSON-LD
  const breadcrumbItems = [
    { name: 'Acasă', url: '/' },
    { name: t('programe'), url: '/programe' },
    { name: program.title, url: `/programe/${slug}` },
  ];

  return (
    <>
      {/* JSON-LD Structured Data */}
      <ProgramJsonLd
        name={program.title}
        description={program.short_description || program.full_description || ''}
        url={`/programe/${slug}`}
        imageUrl={featuredImage?.image_url || sponsorLogos[0]?.image_url}
        startDate={programData.start_date || undefined}
        endDate={programData.end_date || undefined}
        status={programData.status as 'planificat' | 'in_desfasurare' | 'finalizat' | 'anulat'}
        fundingSource={programData.funding_notice || undefined}
        budget={programData.budget_total || undefined}
        currency={programData.currency || 'RON'}
        locale={locale}
      />
      <BreadcrumbJsonLd items={breadcrumbItems} locale={locale} />

      <Breadcrumbs items={[
        { label: t('programe'), href: '/programe' },
        { label: program.title }
      ]} />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            {/* Sponsor Logos */}
            {sponsorLogos.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
                {sponsorLogos.map((logo) => (
                  <Image
                    key={logo.id}
                    src={logo.image_url}
                    alt={logo.alt_text || 'Logo'}
                    width={200}
                    height={80}
                    className="h-16 w-auto object-contain"
                  />
                ))}
              </div>
            )}

            {/* Back link */}
            <Link 
              href="/programe"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              {labels.backToPrograms}
            </Link>

            {/* Program Header */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
                    {program.program_type === 'program-regional' || program.program_type === 'proiecte-europene' ? (
                      <Euro className="w-7 h-7 text-primary-700" />
                    ) : (
                      <Building2 className="w-7 h-7 text-primary-700" />
                    )}
                  </div>
                  <div className="flex-1">
                    {program.smis_code && (
                      <span className="text-xs font-mono text-gray-500 mb-2 block">
                        SMIS {program.smis_code}
                      </span>
                    )}
                    <CardTitle className="text-xl font-bold text-gray-900 leading-snug">
                      {program.title}
                    </CardTitle>
                    {program.short_description && (
                      <p className="text-gray-600 mt-2">{program.short_description}</p>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Featured Image */}
            {featuredImage && (
              <div className="mb-6 rounded-xl overflow-hidden">
                <Image
                  src={featuredImage.image_url}
                  alt={featuredImage.alt_text || program.title}
                  width={1200}
                  height={600}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}

            {/* Description */}
            {program.full_description && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary-600" />
                    {labels.description}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div 
                    className="prose prose-gray max-w-none"
                    dangerouslySetInnerHTML={{ __html: program.full_description.replace(/\n/g, '<br />') }}
                  />
                </CardContent>
              </Card>
            )}

            {/* Sub-programs / Children */}
            {program.children && program.children.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary-600" />
                  {labels.subPrograms}
                </h2>
                <ProgramChildrenList 
                  children={program.children} 
                  viewDetailsLabel={labels.viewDetails}
                  parentSlug={slug}
                />
              </div>
            )}

            {/* Documents */}
            {program.documents && program.documents.length > 0 && (
              <ProgramDocumentsSection 
                documentGroups={documentGroups}
                grouping={program.document_grouping}
                labels={labels}
              />
            )}

            {/* Project Updates */}
            {program.updates && program.updates.length > 0 && (
              <div className="mb-6">
                <ProgramUpdatesAccordion 
                  updates={program.updates} 
                  title={labels.projectUpdates}
                />
              </div>
            )}

            {/* Photo Gallery */}
            {galleryImages.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {labels.gallery}
                </h2>
                <ImageGallery 
                  images={galleryImages.map(img => ({
                    id: img.id,
                    image_url: img.image_url,
                    caption: img.caption,
                    alt_text: img.alt_text,
                  }))} 
                  columns={4} 
                />
              </div>
            )}

            {/* External Links */}
            {externalLinks.length > 0 && (
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                {externalLinks.map((link, index) => (
                  <a 
                    key={index}
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-800 text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {link.label}
                  </a>
                ))}
              </div>
            )}

            {/* Funding Notice (for EU funded programs) */}
            {program.funding_notice && (
              <div className="mt-8 p-6 bg-blue-50 border border-blue-100 rounded-xl text-center">
                <p className="text-sm text-blue-800 mb-2">
                  {labels.fundedBy}
                </p>
                <p className="text-lg font-semibold text-blue-900">
                  {program.funding_notice}
                </p>
              </div>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
