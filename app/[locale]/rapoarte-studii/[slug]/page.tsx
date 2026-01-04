'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useParams } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { Link } from '@/components/ui/link';
import { notFound } from 'next/navigation';
import { 
  Calendar, 
  ArrowLeft, 
  FileText, 
  Download,
  User,
  Building2,
  Tag,
  FileSearch,
  ShieldCheck
} from 'lucide-react';

// ============================================
// MOCK DATA - Will be replaced with Supabase
// ============================================

type ReportType = 'audit' | 'studiu' | 'raport_anual' | 'analiza' | 'evaluare';

interface Attachment {
  id: string;
  title: { ro: string; hu: string; en: string };
  url: string;
  fileType: string;
  fileSize?: string;
}

interface ReportStudy {
  id: string;
  slug: string;
  type: ReportType;
  year: number;
  publishedAt: string;
  title: { ro: string; hu: string; en: string };
  description: { ro: string; hu: string; en: string };
  summary?: { ro: string; hu: string; en: string };
  author?: string;
  department?: { ro: string; hu: string; en: string };
  keywords: { ro: string[]; hu: string[]; en: string[] };
  mainDocumentUrl: string;
  attachments: Attachment[];
}

const TYPE_LABELS: Record<ReportType, { ro: string; hu: string; en: string; icon: typeof FileSearch; color: string }> = {
  audit: { 
    ro: 'Raport de Audit', 
    hu: 'Ellenőrzési jelentés', 
    en: 'Audit Report',
    icon: ShieldCheck,
    color: 'bg-blue-100 text-blue-800',
  },
  studiu: { 
    ro: 'Studiu', 
    hu: 'Tanulmány', 
    en: 'Study',
    icon: FileSearch,
    color: 'bg-purple-100 text-purple-800',
  },
  raport_anual: { 
    ro: 'Raport Anual', 
    hu: 'Éves jelentés', 
    en: 'Annual Report',
    icon: FileText,
    color: 'bg-green-100 text-green-800',
  },
  analiza: { 
    ro: 'Analiză', 
    hu: 'Elemzés', 
    en: 'Analysis',
    icon: FileSearch,
    color: 'bg-amber-100 text-amber-800',
  },
  evaluare: { 
    ro: 'Evaluare', 
    hu: 'Értékelés', 
    en: 'Evaluation',
    icon: ShieldCheck,
    color: 'bg-teal-100 text-teal-800',
  },
};

const MOCK_REPORTS: Record<string, ReportStudy> = {
  'raport-audit-curte-conturi-2024': {
    id: '1',
    slug: 'raport-audit-curte-conturi-2024',
    type: 'audit',
    year: 2024,
    publishedAt: '2024-06-15',
    title: {
      ro: 'Raportul Curții de Conturi privind finanțele publice locale pe anul 2023',
      hu: 'A Számvevőszék jelentése a 2023-as helyi közpénzügyekről',
      en: 'Court of Accounts Report on Local Public Finances for 2023',
    },
    description: {
      ro: 'Raportul de audit financiar efectuat de Curtea de Conturi a României asupra situațiilor financiare ale Primăriei Municipiului Salonta pentru exercițiul financiar încheiat la 31 decembrie 2023.',
      hu: 'A Romániai Számvevőszék pénzügyi ellenőrzési jelentése Nagyszalonta Polgármesteri Hivatalának pénzügyi kimutatásairól a 2023. december 31-én záruló pénzügyi évről.',
      en: 'Financial audit report conducted by the Romanian Court of Accounts on the financial statements of Salonta City Hall for the financial year ended December 31, 2023.',
    },
    summary: {
      ro: 'Auditul a constatat conformitatea generală cu reglementările financiare în vigoare, cu recomandări minore privind îmbunătățirea evidențelor contabile.',
      hu: 'Az ellenőrzés megállapította az általános megfelelést a hatályos pénzügyi előírásoknak, kisebb ajánlásokkal a számviteli nyilvántartások javítására.',
      en: 'The audit found general compliance with current financial regulations, with minor recommendations for improving accounting records.',
    },
    author: 'Curtea de Conturi a României - Camera de Conturi Bihor',
    department: {
      ro: 'Serviciul Economic',
      hu: 'Gazdasági Osztály',
      en: 'Economic Department',
    },
    keywords: {
      ro: ['audit', 'finanțe publice', 'buget local', 'Curtea de Conturi'],
      hu: ['ellenőrzés', 'közpénzügyek', 'helyi költségvetés', 'Számvevőszék'],
      en: ['audit', 'public finances', 'local budget', 'Court of Accounts'],
    },
    mainDocumentUrl: '#',
    attachments: [
      {
        id: 'a1',
        title: { ro: 'Raport complet', hu: 'Teljes jelentés', en: 'Full report' },
        url: '#',
        fileType: 'PDF',
        fileSize: '2.4 MB',
      },
      {
        id: 'a2',
        title: { ro: 'Anexa 1 - Situații financiare', hu: '1. melléklet - Pénzügyi kimutatások', en: 'Annex 1 - Financial statements' },
        url: '#',
        fileType: 'PDF',
        fileSize: '1.1 MB',
      },
      {
        id: 'a3',
        title: { ro: 'Răspunsul instituției', hu: 'Az intézmény válasza', en: 'Institution response' },
        url: '#',
        fileType: 'PDF',
        fileSize: '450 KB',
      },
    ],
  },
  'studiu-mobilitate-urbana-2024': {
    id: '2',
    slug: 'studiu-mobilitate-urbana-2024',
    type: 'studiu',
    year: 2024,
    publishedAt: '2024-03-20',
    title: {
      ro: 'Studiu privind Mobilitatea Urbană Durabilă în Municipiul Salonta',
      hu: 'Tanulmány a Fenntartható Városi Mobilitásról Nagyszalontán',
      en: 'Study on Sustainable Urban Mobility in Salonta Municipality',
    },
    description: {
      ro: 'Studiu de fezabilitate și analiză privind dezvoltarea sistemului de transport public și mobilitate urbană durabilă în Municipiul Salonta, în contextul implementării PMUD 2021-2030.',
      hu: 'Megvalósíthatósági tanulmány és elemzés a tömegközlekedési rendszer és fenntartható városi mobilitás fejlesztéséről Nagyszalontán, a 2021-2030 PMUD megvalósításának keretében.',
      en: 'Feasibility study and analysis on the development of public transport system and sustainable urban mobility in Salonta Municipality, in the context of PMUD 2021-2030 implementation.',
    },
    summary: {
      ro: 'Studiul identifică principalele provocări în transportul urban și propune soluții pentru îmbunătățirea mobilității, inclusiv piste de biciclete, modernizarea stațiilor de autobuz și optimizarea rutelor.',
      hu: 'A tanulmány azonosítja a városi közlekedés fő kihívásait és megoldásokat javasol a mobilitás javítására, beleértve a kerékpárutakat, buszmegállók korszerűsítését és az útvonalak optimalizálását.',
      en: 'The study identifies main challenges in urban transport and proposes solutions for improving mobility, including bike lanes, bus station modernization, and route optimization.',
    },
    author: 'SC Urban Planning Consult SRL',
    department: {
      ro: 'Serviciul Urbanism și Amenajarea Teritoriului',
      hu: 'Városrendezési és Területrendezési Osztály',
      en: 'Urban Planning Department',
    },
    keywords: {
      ro: ['mobilitate urbană', 'transport public', 'PMUD', 'dezvoltare durabilă'],
      hu: ['városi mobilitás', 'tömegközlekedés', 'PMUD', 'fenntartható fejlődés'],
      en: ['urban mobility', 'public transport', 'PMUD', 'sustainable development'],
    },
    mainDocumentUrl: '#',
    attachments: [
      {
        id: 'a1',
        title: { ro: 'Studiu complet', hu: 'Teljes tanulmány', en: 'Full study' },
        url: '#',
        fileType: 'PDF',
        fileSize: '8.5 MB',
      },
      {
        id: 'a2',
        title: { ro: 'Anexa - Hărți și planuri', hu: 'Melléklet - Térképek és tervek', en: 'Annex - Maps and plans' },
        url: '#',
        fileType: 'PDF',
        fileSize: '15 MB',
      },
      {
        id: 'a3',
        title: { ro: 'Rezumat executiv', hu: 'Vezetői összefoglaló', en: 'Executive summary' },
        url: '#',
        fileType: 'PDF',
        fileSize: '800 KB',
      },
    ],
  },
  'raport-anual-primarie-2023': {
    id: '3',
    slug: 'raport-anual-primarie-2023',
    type: 'raport_anual',
    year: 2023,
    publishedAt: '2024-02-28',
    title: {
      ro: 'Raportul Anual de Activitate al Primăriei Municipiului Salonta - 2023',
      hu: 'Nagyszalonta Polgármesteri Hivatalának 2023-as Éves Tevékenységi Jelentése',
      en: 'Annual Activity Report of Salonta City Hall - 2023',
    },
    description: {
      ro: 'Raportul anual prezintă activitatea Primăriei Municipiului Salonta pe parcursul anului 2023, incluzând proiectele realizate, investițiile efectuate, serviciile oferite cetățenilor și obiectivele îndeplinite.',
      hu: 'Az éves jelentés bemutatja Nagyszalonta Polgármesteri Hivatalának 2023-as tevékenységét, beleértve a megvalósított projekteket, a végrehajtott beruházásokat, a polgároknak nyújtott szolgáltatásokat és a teljesített célkitűzéseket.',
      en: 'The annual report presents the activity of Salonta City Hall during 2023, including completed projects, investments made, services provided to citizens, and objectives achieved.',
    },
    author: 'Primăria Municipiului Salonta',
    keywords: {
      ro: ['raport anual', 'activitate', 'proiecte', 'investiții'],
      hu: ['éves jelentés', 'tevékenység', 'projektek', 'beruházások'],
      en: ['annual report', 'activity', 'projects', 'investments'],
    },
    mainDocumentUrl: '#',
    attachments: [
      {
        id: 'a1',
        title: { ro: 'Raport complet', hu: 'Teljes jelentés', en: 'Full report' },
        url: '#',
        fileType: 'PDF',
        fileSize: '5.2 MB',
      },
      {
        id: 'a2',
        title: { ro: 'Infografic rezumat', hu: 'Összefoglaló infografika', en: 'Summary infographic' },
        url: '#',
        fileType: 'PDF',
        fileSize: '1.5 MB',
      },
    ],
  },
  'analiza-demografica-2024': {
    id: '4',
    slug: 'analiza-demografica-2024',
    type: 'analiza',
    year: 2024,
    publishedAt: '2024-05-10',
    title: {
      ro: 'Analiză Demografică și Socio-Economică a Municipiului Salonta',
      hu: 'Nagyszalonta Demográfiai és Társadalmi-Gazdasági Elemzése',
      en: 'Demographic and Socio-Economic Analysis of Salonta Municipality',
    },
    description: {
      ro: 'Analiza detaliată a situației demografice și socio-economice a Municipiului Salonta, incluzând date despre populație, ocuparea forței de muncă, educație, sănătate și infrastructură.',
      hu: 'Nagyszalonta demográfiai és társadalmi-gazdasági helyzetének részletes elemzése, beleértve a népességre, foglalkoztatásra, oktatásra, egészségügyre és infrastruktúrára vonatkozó adatokat.',
      en: 'Detailed analysis of the demographic and socio-economic situation of Salonta Municipality, including data on population, employment, education, health, and infrastructure.',
    },
    author: 'Institutul Național de Statistică - Direcția Județeană Bihor',
    department: {
      ro: 'Compartimentul Strategii și Programe',
      hu: 'Stratégiák és Programok Osztály',
      en: 'Strategies and Programs Department',
    },
    keywords: {
      ro: ['demografie', 'analiză socio-economică', 'statistici', 'populație'],
      hu: ['demográfia', 'társadalmi-gazdasági elemzés', 'statisztikák', 'népesség'],
      en: ['demographics', 'socio-economic analysis', 'statistics', 'population'],
    },
    mainDocumentUrl: '#',
    attachments: [
      {
        id: 'a1',
        title: { ro: 'Analiză completă', hu: 'Teljes elemzés', en: 'Full analysis' },
        url: '#',
        fileType: 'PDF',
        fileSize: '3.8 MB',
      },
      {
        id: 'a2',
        title: { ro: 'Date statistice brute', hu: 'Nyers statisztikai adatok', en: 'Raw statistical data' },
        url: '#',
        fileType: 'XLSX',
        fileSize: '500 KB',
      },
    ],
  },
};

// ============================================
// COMPONENT
// ============================================

export default function RaportStudiuDetailPage() {
  const t = useTranslations('navigation');
  const locale = useLocale() as 'ro' | 'hu' | 'en';
  const params = useParams();
  const slug = params.slug as string;

  const report = MOCK_REPORTS[slug];

  if (!report) {
    notFound();
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(
      locale === 'ro' ? 'ro-RO' : locale === 'hu' ? 'hu-HU' : 'en-US',
      { day: 'numeric', month: 'long', year: 'numeric' }
    );
  };

  const TypeIcon = TYPE_LABELS[report.type].icon;

  const pageLabels = {
    ro: {
      backToList: 'Înapoi la rapoarte și studii',
      publishedAt: 'Publicat la',
      author: 'Autor',
      department: 'Departament responsabil',
      keywords: 'Cuvinte cheie',
      summary: 'Rezumat',
      description: 'Descriere',
      documents: 'Documente atașate',
      downloadMain: 'Descarcă documentul principal',
      relatedReports: 'Rapoarte similare',
    },
    hu: {
      backToList: 'Vissza a jelentésekhez és tanulmányokhoz',
      publishedAt: 'Közzétéve',
      author: 'Szerző',
      department: 'Felelős osztály',
      keywords: 'Kulcsszavak',
      summary: 'Összefoglaló',
      description: 'Leírás',
      documents: 'Csatolt dokumentumok',
      downloadMain: 'Fő dokumentum letöltése',
      relatedReports: 'Kapcsolódó jelentések',
    },
    en: {
      backToList: 'Back to reports and studies',
      publishedAt: 'Published on',
      author: 'Author',
      department: 'Responsible department',
      keywords: 'Keywords',
      summary: 'Summary',
      description: 'Description',
      documents: 'Attached documents',
      downloadMain: 'Download main document',
      relatedReports: 'Related reports',
    },
  };

  const labels = pageLabels[locale];

  // Get related reports (same type, excluding current)
  const relatedReports = Object.values(MOCK_REPORTS)
    .filter(r => r.type === report.type && r.id !== report.id)
    .slice(0, 3);

  return (
    <>
      <Breadcrumbs items={[
        { label: t('rapoarteStudii'), href: '/rapoarte-studii' },
        { label: report.title[locale] },
      ]} />

      <PageHeader 
        titleKey="rapoarteStudii" 
        icon="fileSearch"
        subtitle={report.title[locale]}
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
                  <Badge className={TYPE_LABELS[report.type].color}>
                    <TypeIcon className="w-4 h-4 mr-1" />
                    {TYPE_LABELS[report.type][locale]}
                  </Badge>
                  <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                    {report.year}
                  </Badge>
                </div>
              </div>
              <CardContent className="pt-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {report.title[locale]}
                </h1>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{labels.publishedAt}: {formatDate(report.publishedAt)}</span>
                  </div>
                  {report.author && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>{report.author}</span>
                    </div>
                  )}
                </div>

                {/* Download Main Document Button */}
                <div className="mt-6">
                  <a
                    href={report.mainDocumentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                  >
                    <Download className="w-5 h-5" />
                    {labels.downloadMain}
                  </a>
                </div>
              </CardContent>
            </Card>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Summary */}
                {report.summary && (
                  <Card className="border-primary-200 bg-primary-50">
                    <CardHeader>
                      <CardTitle className="text-primary-900">{labels.summary}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-primary-800 leading-relaxed">{report.summary[locale]}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Description */}
                <Card>
                  <CardHeader>
                    <CardTitle>{labels.description}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{report.description[locale]}</p>
                  </CardContent>
                </Card>

                {/* Attachments */}
                {report.attachments.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary-600" />
                        {labels.documents}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {report.attachments.map((attachment) => (
                          <a
                            key={attachment.id}
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                                <FileText className="w-5 h-5 text-red-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 group-hover:text-primary-700">
                                  {attachment.title[locale]}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {attachment.fileType}
                                  {attachment.fileSize && ` • ${attachment.fileSize}`}
                                </p>
                              </div>
                            </div>
                            <Download className="w-5 h-5 text-gray-400 group-hover:text-primary-600" />
                          </a>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Department */}
                {report.department && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                          <Building2 className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">{labels.department}</p>
                          <p className="font-medium text-gray-900">{report.department[locale]}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Keywords */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Tag className="w-4 h-4 text-primary-600" />
                      {labels.keywords}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {report.keywords[locale].map((keyword, idx) => (
                        <Badge key={idx} variant="outline" className="bg-gray-50">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Related Reports */}
            {relatedReports.length > 0 && (
              <div className="mt-12">
                <h2 className="text-xl font-bold text-gray-900 mb-6">{labels.relatedReports}</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {relatedReports.map((related) => (
                    <Link key={related.id} href={`/rapoarte-studii/${related.slug}`}>
                      <Card hover className="h-full">
                        <CardContent className="pt-6">
                          <Badge className={`${TYPE_LABELS[related.type].color} mb-3`}>
                            {TYPE_LABELS[related.type][locale]}
                          </Badge>
                          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                            {related.title[locale]}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {formatDate(related.publishedAt)}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}

