import { getTranslations } from 'next-intl/server';
import { 
  FileText, Download, ExternalLink, Users, FileCheck, 
  Calendar, Briefcase, Heart, AlertCircle, ClipboardList,
  Archive, Link as LinkIcon, ScrollText, FileWarning
} from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';
import { getDocumentsBySourceFolder } from '@/lib/supabase/services/documents';
import type { Document } from '@/lib/types/database';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'alteDocumente',
    locale: locale as Locale,
    path: '/monitorul-oficial/alte-documente',
  });
}

// Quick links to other pages
const QUICK_LINKS = [
  { key: 'ordineZi', href: '/consiliul-local/ordine-de-zi' },
  { key: 'proceseVerbale', href: '/consiliul-local/hotarari' },
  { key: 'publicatiiCasatorii', href: '/informatii-publice/publicatii-casatorie' },
  { key: 'dezbateriPublice', href: '/transparenta/dezbateri-publice' },
  { key: 'declaratiiAlesiFunctionari', href: '/primaria/declaratii-avere' },
  { key: 'declaratiiConsilieri', href: '/consiliul-local/declaratii-avere' },
];

// Career links - internal pages
const CAREER_LINKS = [
  { titleKey: 'concursuri', href: '/informatii-publice/concursuri' },
  { titleKey: 'anunturi', href: '/informatii-publice/anunturi' },
  { titleKey: 'formulare', href: '/informatii-publice/formulare' },
];

// Social problems - internal page
const SOCIAL_LINK = { titleKey: 'problemeSociale', href: '/servicii-online/probleme-sociale' };

// Coronavirus info - internal page link
const COVID_LINK = { titleKey: 'coronavirus', href: '/informatii-publice/coronavirus' };

// Document categorization helpers
function isTransparencyReport(title: string): boolean {
  const lower = title.toLowerCase();
  return lower.includes('transparenta decizionala') || 
         lower.includes('transparență decizională') ||
         lower.includes('raport anual privind transparenta');
}

function isMayorReport(title: string): boolean {
  return title.toLowerCase().includes('raportul anual de activitate a primarului');
}

function isMinute(title: string): boolean {
  return title.toLowerCase().includes('minuta');
}

function isMandateValidation(title: string): boolean {
  const lower = title.toLowerCase();
  return lower.includes('validare') || 
         lower.includes('încetare') || 
         lower.includes('incetare') ||
         lower.includes('ordinul prefectului') ||
         lower.includes('hotărârea civilă') ||
         lower.includes('hotararea civila') ||
         lower.includes('încheiere civilă') ||
         lower.includes('incheiere civila') ||
         lower.includes('încheierea civilă') ||
         lower.includes('incheierea civila');
}

function isRegister(title: string): boolean {
  return title.toLowerCase().includes('registru');
}

function extractYearFromTitle(title: string): number {
  const match = title.match(/\b(20\d{2})\b/);
  return match ? parseInt(match[1], 10) : 2025;
}

function DocumentItem({ doc }: { doc: Document }) {
  return (
    <div className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex items-center gap-2 min-w-0">
        <FileText className="w-4 h-4 text-gray-500 shrink-0" />
        <span className="text-sm text-gray-700 truncate" title={doc.title}>{doc.title}</span>
      </div>
      <Link
        href={doc.file_url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 px-2 py-1 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded text-xs font-medium shrink-0"
      >
        <Download className="w-3 h-3" />
        PDF
      </Link>
    </div>
  );
}

function InternalLinkItem({ title, href }: { title: string; href: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
    >
      <div className="flex items-center gap-2 min-w-0">
        <ExternalLink className="w-4 h-4 text-primary-600 shrink-0" />
        <span className="text-sm text-gray-700">{title}</span>
      </div>
      <span className="flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs font-medium shrink-0">
        →
      </span>
    </Link>
  );
}

function QuickLinkItem({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 p-4 bg-primary-50 border border-primary-200 rounded-lg hover:bg-primary-100 transition-colors group"
    >
      <div className="w-10 h-10 rounded-lg bg-primary-600 flex items-center justify-center shrink-0 group-hover:bg-primary-700 transition-colors">
        <ExternalLink className="w-5 h-5 text-white" />
      </div>
      <span className="font-medium text-gray-900 group-hover:text-primary-700">{label}</span>
    </Link>
  );
}

function SectionHeader({ 
  icon: Icon, 
  title, 
  bgColor 
}: { 
  icon: React.ComponentType<{ className?: string }>; 
  title: string; 
  bgColor: string;
}) {
  return (
    <div className={`${bgColor} px-6 py-4 flex items-center gap-3 -mx-6 -mt-6 mb-6 rounded-t-lg`}>
      <Icon className="w-6 h-6 text-white" />
      <h2 className="text-lg font-bold text-white">{title}</h2>
    </div>
  );
}

export default async function AlteDocumentePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const ta = await getTranslations({ locale, namespace: 'alteDocumentePage' });

  // Fetch documents from database
  const allDocuments = await getDocumentsBySourceFolder('alte-documente');

  // Categorize documents
  const transparencyReports = allDocuments.filter(d => isTransparencyReport(d.title));
  const mayorReports = allDocuments.filter(d => isMayorReport(d.title));
  const minutes = allDocuments.filter(d => isMinute(d.title));
  const mandateValidations = allDocuments.filter(d => isMandateValidation(d.title));
  const registers = allDocuments.filter(d => isRegister(d.title));

  // Group minutes by year
  const minutesByYear = minutes.reduce((acc, doc) => {
    const year = extractYearFromTitle(doc.title);
    if (!acc[year]) acc[year] = [];
    acc[year].push(doc);
    return acc;
  }, {} as Record<number, Document[]>);

  // Sort years descending
  const sortedYears = Object.keys(minutesByYear)
    .map(Number)
    .sort((a, b) => b - a);

  // Sort transparency reports by year descending
  transparencyReports.sort((a, b) => extractYearFromTitle(b.title) - extractYearFromTitle(a.title));

  // Sort mandate validations by year descending
  mandateValidations.sort((a, b) => extractYearFromTitle(b.title) - extractYearFromTitle(a.title));

  return (
    <>
      <Breadcrumbs items={[
        { label: t('monitorulOficial'), href: '/monitorul-oficial' },
        { label: t('alteDocumente') }
      ]} />
      <PageHeader titleKey="alteDocumente" icon="fileText" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto space-y-10">

            {/* Quick Links to other pages */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center">
                  <LinkIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{ta('quickLinksTitle')}</h2>
                  <p className="text-sm text-gray-500">{ta('quickLinksSubtitle')}</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {QUICK_LINKS.map((link, i) => (
                  <QuickLinkItem key={i} label={ta(`links.${link.key}`)} href={link.href} />
                ))}
              </div>
            </div>

            {/* Transparency Reports */}
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <SectionHeader icon={FileCheck} title={ta('transparencyReportsTitle')} bgColor="bg-blue-600" />
                
                {transparencyReports.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {transparencyReports.map((doc) => (
                        <DocumentItem key={doc.id} doc={doc} />
                      ))}
                    </div>
                    
                    {/* Mayor report and link to activity reports */}
                    <div className="border-t pt-4 space-y-2">
                      {mayorReports.map((doc) => (
                        <DocumentItem key={doc.id} doc={doc} />
                      ))}
                      <Link
                        href="/consiliul-local/rapoarte-activitate"
                        className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-700">{ta('councilActivityReports')}</span>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <FileWarning className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p>{ta('noDocuments')}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Council Session Minutes */}
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <SectionHeader icon={ScrollText} title={ta('councilMinutesTitle')} bgColor="bg-green-600" />
                
                {minutes.length > 0 ? (
                  <div className="space-y-6">
                    {sortedYears.map((year) => (
                      <div key={year}>
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-green-600" />
                          {year}
                          <span className="text-sm font-normal text-gray-500">
                            ({minutesByYear[year].length} {minutesByYear[year].length === 1 ? 'document' : 'documente'})
                          </span>
                        </h3>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {minutesByYear[year].map((doc) => (
                            <DocumentItem key={doc.id} doc={doc} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <FileWarning className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p>{ta('noDocuments')}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Mandate Validations */}
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <SectionHeader icon={Users} title={ta('mandateValidationsTitle')} bgColor="bg-purple-600" />
                
                {mandateValidations.length > 0 ? (
                  <div className="space-y-2">
                    {mandateValidations.map((doc) => (
                      <DocumentItem key={doc.id} doc={doc} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <FileWarning className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p>{ta('noDocuments')}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Career Documents & Social Problems - side by side */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Career */}
              <Card className="overflow-hidden">
                <CardContent className="p-5">
                  <SectionHeader icon={Briefcase} title={ta('careerTitle')} bgColor="bg-teal-600" />
                  <div className="space-y-2">
                    {CAREER_LINKS.map((link, i) => (
                      <InternalLinkItem key={i} title={t(link.titleKey)} href={link.href} />
                    ))}
                  </div>
                  <Link 
                    href="/stiri" 
                    className="mt-4 flex items-center gap-2 p-3 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors text-sm"
                  >
                    <ExternalLink className="w-4 h-4 text-teal-600" />
                    <span className="text-gray-700">{ta('newsAndEvents')}</span>
                  </Link>
                </CardContent>
              </Card>

              {/* Social Problems */}
              <Card className="overflow-hidden">
                <CardContent className="p-5">
                  <SectionHeader icon={Heart} title={ta('socialProblemsTitle')} bgColor="bg-rose-600" />
                  <div className="space-y-2">
                    <InternalLinkItem title={t(SOCIAL_LINK.titleKey)} href={SOCIAL_LINK.href} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* COVID Info */}
            <Card className="overflow-hidden border-orange-200 bg-orange-50">
              <CardContent className="p-5">
                <SectionHeader icon={AlertCircle} title={ta('covidInfoTitle')} bgColor="bg-orange-500" />
                <div className="space-y-2">
                  <InternalLinkItem title={ta('covidLinkTitle')} href={COVID_LINK.href} />
                </div>
              </CardContent>
            </Card>

            {/* Registers */}
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <SectionHeader icon={ClipboardList} title={ta('registersTitle')} bgColor="bg-gray-700" />
                
                {registers.length > 0 ? (
                  <div className="space-y-2">
                    {registers.map((doc) => (
                      <DocumentItem key={doc.id} doc={doc} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <FileWarning className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p>{ta('noDocuments')}</p>
                  </div>
                )}
              </CardContent>
            </Card>

          </div>
        </Container>
      </Section>
    </>
  );
}
