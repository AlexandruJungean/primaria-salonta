import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { 
  FileText, Download, ExternalLink, Users, FileCheck, 
  Calendar, Briefcase, Heart, AlertCircle, ClipboardList,
  Archive, Link as LinkIcon, ScrollText
} from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('alteDocumente') };
}

// Quick links to other pages
const QUICK_LINKS = [
  { key: 'ordineZi', href: '/consiliul-local/ordine-de-zi' },
  { key: 'proceseVerbale', href: '/consiliul-local/hotarari' },
  { key: 'publicatiiCasatorii', href: '/stare-civila' },
  { key: 'dezbateriPublice', href: '/transparenta/dezbateri-publice' },
  { key: 'declaratiiAlesiFunctionari', href: '/primaria/declaratii-avere' },
  { key: 'declaratiiConsilieri', href: '/consiliul-local/declaratii-avere' },
];

// Transparency announcements - documents from database
const TRANSPARENCY_ANNOUNCEMENTS = [
  { doc: 'Informarea în prealabil, din oficiu, asupra problemelor de interes public, care urmează să fie dezbătute', url: '#' },
  { doc: 'Informarea în prealabil, din oficiu, asupra proiectelor de acte administrative, cu caracter normativ', url: '#' },
];

// Transparency reports by year - documents from database
const TRANSPARENCY_REPORTS = [
  { year: 2024, url: '#' },
  { year: 2023, url: '#' },
  { year: 2022, url: '#' },
  { year: 2021, url: '#' },
  { year: 2020, url: '#' },
  { year: 2018, url: '#' },
];

// Other reports
type OtherReport = { doc: string; url: string } | { doc: string; href: string };
const OTHER_REPORTS: OtherReport[] = [
  { doc: 'Raportul anual de activitate a primarului – august 2020', url: '#' },
  { doc: 'Rapoarte de activitate ale consilierilor locali', href: '/consiliul-local/rapoarte-activitate' },
];

// Council session minutes 2025 - documents from database
const MINUTES_2025 = [
  { date: '30.12.2025', url: '#' },
  { date: '15.12.2025', url: '#' },
  { date: '27.11.2025', url: '#' },
  { date: '30.10.2025', url: '#' },
  { date: '25.09.2025', url: '#' },
  { date: '30.09.2025', url: '#' },
  { date: '27.08.2025', url: '#' },
  { date: '31.07.2025', url: '#' },
  { date: '02.07.2025', url: '#' },
  { date: '26.06.2025', url: '#' },
  { date: '17.06.2025', url: '#' },
  { date: '29.05.2025', url: '#' },
  { date: '26.05.2025', url: '#' },
  { date: '22.05.2025', url: '#' },
  { date: '30.04.2025', url: '#' },
  { date: '10.04.2025', url: '#' },
  { date: '31.03.2025', url: '#' },
  { date: '21.03.2025', url: '#' },
  { date: '13.03.2025', isExtraordinary: true, url: '#' },
  { date: '27.02.2025', url: '#' },
  { date: '13.02.2025', url: '#' },
  { date: '30.01.2025', url: '#' },
];

// Minutes archives - documents from database
const MINUTES_ARCHIVES = [2024, 2023, 2022, 2021, 2020];

// Wealth declarations and mandate validations - documents from database
const MANDATE_VALIDATIONS = [
  { doc: 'Hotărârea Civilă nr. 445/23.06.2025 privind validare consilier local supleant', url: '#' },
  { doc: 'HCLMS nr. 109 din 17.06.2025 – constatare încetare de drept, prin demisie, a mandatului de consilier local al d-lui Pirtea Mihai George', url: '#' },
  { doc: 'Hotărârea Civilă nr. 220/07.04.2025 privind validare consilier local supleant', url: '#' },
  { doc: 'HCLMS nr.52 din 31.03.2025 – constatare încetare de drept, prin demisie, a mandatului de consilier local al domnului Nagy Árpád – Ferencz', url: '#' },
  { doc: 'Ordinul Prefectului nr. 583/25.10.2024 privind constatarea ca legal constituit a Consiliului Local al Municipiului Salonta', url: '#' },
  { doc: 'Încheiere Civilă nr. 712 din 16.10.2024 privind validare mandat consilieri locali – Consiliul local al Municipiului Salonta', url: '#' },
  { doc: 'Încheierea Civilă nr.763 din 04 noiembrie 2024 a Judecătoriei Salonta privind validare mandate consilier local supleant', url: '#' },
  { doc: 'Încheiere Civilă nr. 703 din 14.10.2024 privind validare mandat primar Török László', url: '#' },
];

// Career links - internal pages
const CAREER_LINKS = [
  { titleKey: 'concursuri', href: '/informatii-publice/concursuri' },
  { titleKey: 'anunturi', href: '/transparenta/anunturi' },
  { titleKey: 'formulare', href: '/servicii-online/formulare' },
];

// Social problems - internal page (single page with both RO/HU forms)
const SOCIAL_LINK = { titleKey: 'problemeSociale', href: '/servicii-online/probleme-sociale' };

// Coronavirus info - internal page link
const COVID_LINK = { titleKey: 'coronavirus', href: '/informatii-publice/coronavirus' };

// Registers - documents from database
const REGISTERS = [
  { doc: 'Registrul privind înregistrarea refuzurilor de a semna, contrasemna, aviza actele administrative, precum obiecțiile cu privire la legalitate, efectuate în scris', url: '#' },
  { doc: 'Registru consemnare sugestii', url: '#' },
];

function DocumentItem({ title, url }: { title: string; url: string }) {
  return (
    <div className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex items-center gap-2 min-w-0">
        <FileText className="w-4 h-4 text-gray-500 shrink-0" />
        <span className="text-sm text-gray-700">{title}</span>
      </div>
      <Link
        href={url}
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
    <div className={`${bgColor} px-6 py-4 flex items-center gap-3 -mx-6 -mt-6 mb-6`}>
      <Icon className="w-6 h-6 text-white" />
      <h2 className="text-lg font-bold text-white">{title}</h2>
    </div>
  );
}

export default function AlteDocumentePage() {
  const t = useTranslations('navigation');
  const ta = useTranslations('alteDocumentePage');

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

            {/* Transparency Announcements */}
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <SectionHeader icon={AlertCircle} title={ta('transparencyAnnouncementsTitle')} bgColor="bg-amber-600" />
                <div className="space-y-2">
                  {TRANSPARENCY_ANNOUNCEMENTS.map((doc, i) => (
                    <DocumentItem key={i} title={doc.doc} url={doc.url} />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Transparency Reports */}
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <SectionHeader icon={FileCheck} title={ta('transparencyReportsTitle')} bgColor="bg-blue-600" />
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {TRANSPARENCY_REPORTS.map((report, i) => (
                      <DocumentItem 
                        key={i} 
                        title={ta('transparencyReportYear', { year: report.year })} 
                        url={report.url} 
                      />
                    ))}
                  </div>
                  <div className="border-t pt-4 space-y-2">
                    {OTHER_REPORTS.map((report, i) => {
                      if ('href' in report) {
                        return (
                          <Link
                            key={i}
                            href={report.href}
                            className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4 text-blue-600" />
                            <span className="text-sm text-gray-700">{report.doc}</span>
                          </Link>
                        );
                      }
                      return <DocumentItem key={i} title={report.doc} url={report.url} />;
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Council Session Minutes */}
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <SectionHeader icon={ScrollText} title={ta('councilMinutesTitle')} bgColor="bg-green-600" />
                <div className="space-y-6">
                  {/* 2025 Minutes */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-green-600" />
                      2025
                    </h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {MINUTES_2025.map((minute, i) => (
                        <DocumentItem 
                          key={i} 
                          title={`${ta('minuteSession')} ${minute.date}${'isExtraordinary' in minute ? ` (${ta('extraordinary')})` : ''}`} 
                          url={minute.url} 
                        />
                      ))}
                    </div>
                  </div>

                  {/* Archives */}
                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Archive className="w-5 h-5 text-gray-500" />
                      {ta('archives')}
                    </h3>
                    <div className="grid sm:grid-cols-3 lg:grid-cols-5 gap-2">
                      {MINUTES_ARCHIVES.map((year, i) => (
                        <Link
                          key={i}
                          href="#"
                          className="flex items-center justify-center gap-2 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium text-gray-700"
                        >
                          <Archive className="w-4 h-4" />
                          {ta('archiveYear', { year })}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Wealth Declarations and Mandate Validations */}
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <SectionHeader icon={Users} title={ta('mandateValidationsTitle')} bgColor="bg-purple-600" />
                <div className="space-y-2">
                  {MANDATE_VALIDATIONS.map((doc, i) => (
                    <DocumentItem key={i} title={doc.doc} url={doc.url} />
                  ))}
                </div>
                {/* Archive section - documents from database */}
                <div className="mt-4 pt-4 border-t">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Archive className="w-5 h-5 text-purple-600" />
                    {ta('archiveMandateTitle')}
                  </h3>
                  <div className="space-y-2">
                    <DocumentItem title="Sentința civilă nr. 86/2023 privind validarea mandatului consilierului local supleant" url="#" />
                    <DocumentItem title="HCLMS nr. 3 din 31.01.2023 – constatare încetare mandat Gali Éva" url="#" />
                    <DocumentItem title="Sentința civilă nr. 45/2022 privind validarea mandatului consilierului local supleant" url="#" />
                    <DocumentItem title="Încheierea civilă nr. 341/2020 privind validarea mandatului primarului" url="#" />
                    <DocumentItem title="Încheierea civilă nr. 349/2020 privind validarea mandatelor consilierilor locali" url="#" />
                    <DocumentItem title="Ordinul Prefectului nr. 588/20.10.2020 privind constatarea ca legal constituit a Consiliului Local al mun. Salonta" url="#" />
                    <DocumentItem title="Încheierea civilă nr.397/2020 privind validarea mandatului consilierului local supleant" url="#" />
                  </div>
                </div>
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
                <div className="space-y-2">
                  {REGISTERS.map((doc, i) => (
                    <DocumentItem key={i} title={doc.doc} url={doc.url} />
                  ))}
                </div>
              </CardContent>
            </Card>

          </div>
        </Container>
      </Section>
    </>
  );
}
