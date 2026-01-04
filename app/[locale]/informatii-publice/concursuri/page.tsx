import { getTranslations } from 'next-intl/server';
import { BadgeCheck, Calendar, Download, FileText, ClipboardList, ScrollText, FolderOpen } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { generatePageMetadata, BreadcrumbJsonLd } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'carieraConcursuri',
    locale: locale as Locale,
    path: '/informatii-publice/concursuri',
  });
}

// Types
interface FormDocument {
  id: number;
  title: string;
  pdfUrl: string;
}

interface JobAnnouncement {
  id: number;
  title: string;
  date?: string;
  documents: { title: string; pdfUrl: string }[];
}

interface Disposition {
  id: number;
  title: string;
  pdfUrl: string;
}

interface YearDispositions {
  year: number;
  dispositions: Disposition[];
}

// Mock data - Forms
const FORMS: FormDocument[] = [
  { id: 1, title: 'Anunţurile posturilor scoase la concurs', pdfUrl: '#' },
  { id: 2, title: 'Formular de înscriere contractuali', pdfUrl: '#' },
  { id: 3, title: 'Formular de înscriere funcționari publici', pdfUrl: '#' },
  { id: 4, title: 'Model adeverință vechime', pdfUrl: '#' },
];

// Mock data - Current job announcements
const JOB_ANNOUNCEMENTS: JobAnnouncement[] = [
  {
    id: 1,
    title: 'PV final: Îngrijitor – Comp. Administrativ (cod COR 911201)',
    documents: [
      { title: 'PV final', pdfUrl: '#' },
    ],
  },
  {
    id: 2,
    title: 'PV interviu: Îngrijitor – Comp. Administrativ (cod COR 911201)',
    date: '08.12.2025',
    documents: [
      { title: 'PV interviu', pdfUrl: '#' },
    ],
  },
  {
    id: 3,
    title: 'PV proba practică: Îngrijitor – Comp. Administrativ (cod COR 911201)',
    date: '08.12.2025',
    documents: [
      { title: 'PV proba practică', pdfUrl: '#' },
    ],
  },
  {
    id: 4,
    title: 'PV selecție dosare: Îngrijitor – Comp. Administrativ (cod COR 911201)',
    date: '28.11.2025',
    documents: [
      { title: 'PV selecție dosare', pdfUrl: '#' },
    ],
  },
  {
    id: 5,
    title: 'Îngrijitor – Comp. Administrativ (cod COR 911201)',
    date: '14.11.2025',
    documents: [
      { title: 'Anunț', pdfUrl: '#' },
      { title: 'Fișa postului', pdfUrl: '#' },
    ],
  },
];

// Mock data - Mayor's Dispositions
const DISPOSITIONS_DATA: YearDispositions[] = [
  {
    year: 2025,
    dispositions: [
      { id: 1, title: 'Dispoziția nr. 305/09.04.2025 privind numirea Comisiei paritare din cadrul Primăriei Municipiului Salonta', pdfUrl: '#' },
      { id: 2, title: 'Dispozitia nr. 304/09.04.2025 privind interzicerea comercializării și consumului de băuturi alcoolice în ziua de desfăşurare a Alegerilor pentru Președintele României din anul 2025 şi a Alegerilor locale pentru Președintele Consiliului Județean Bihor din data de 4 mai 2024', pdfUrl: '#' },
      { id: 3, title: 'Dispozitia nr. 281/08.04.2025 privind stabilirea și asigurarea locurilor speciale pentru afişajul electoral ȋn Municipiul Salonta, ce vor fi utilizate a Alegerile locale parțiale din data de 4 mai 2025 pentru alegerea Președintelui Consiliului Județean Bihor', pdfUrl: '#' },
      { id: 4, title: 'Dispozitia nr. 221/18.03.2025 privind stabilirea și asigurarea locurilor speciale pentru afişajul electoral ȋn Municipiul Salonta, ce vor fi utilizate la Alegerile pentru Președintele României din anul 2025', pdfUrl: '#' },
      { id: 5, title: 'Dispoziția nr. 2/2025 privind aprobarea acoperirii deficitului bugetului local rezultat la incheierea exercitiului bugetar al anului 2024', pdfUrl: '#' },
    ],
  },
  {
    year: 2024,
    dispositions: [
      { id: 10, title: 'Dispozitia nr. 549/14.10.2024 – privind stabilirea locurilor speciale pentru afişajul electoral ȋn Municipiul Salonta, ce vor fi utilizate la Alegerile pentru Senat și Camera Deputaților din anul 2024', pdfUrl: '#' },
      { id: 11, title: 'Dispozitia nr. 540/07.10.2024 – privind stabilirea locurilor speciale pentru afişajul electoral ȋn Municipiul Salonta, ce vor fi utilizate la Alegerile pentru Președintele României în anul 2024', pdfUrl: '#' },
      { id: 12, title: 'Dispoziția nr. 339/20.06.2024 privind stabilirea salariilor de bază din cadrul aparatului de specialitate al Primarului Municipiului Salonta, începând de 01.07.2024', pdfUrl: '#' },
      { id: 13, title: 'Dispoziția nr. 282/03.06.2024 privind interzicerea comercializării sau consumului băuturilor alcoolice pe o distanţă de 500 de metri în jurul localului secţiilor de votare din Municipiul Salonta, județul Bihor, cu ocazia desfășurării alegerilordin data de 9 iunie 2024', pdfUrl: '#' },
      { id: 14, title: 'Dispoziția nr. 228/09.05.2024 privind stabilirea locurilor speciale pentru afişaj electoral ȋn Municipiul Salonta , ce vor fi utilizate ȋn campania electorală la alegerile din data de 9 iunie 2024', pdfUrl: '#' },
      { id: 15, title: 'Dispozitia nr. 173/10.04.2024 privind desemnarea unor functionari publici, ca persoane cu atributii de exercitare a controlului financiar preventiv propriu', pdfUrl: '#' },
      { id: 16, title: 'Dispoziția nr. 18/12.01.2024 – aprobarea Planului de activități sau lucrări de interes local ce trebuie prestate de către beneficiarii de ajutor de incluziune apți de muncă în condițiile Legii nr. 196/2016', pdfUrl: '#' },
      { id: 17, title: 'Dispoziția nr. 3/9.01.2024 – aprobarea acoperirii deficitului bugetului local rezultat la încheierea exercițiului bugetar al anului 2023', pdfUrl: '#' },
    ],
  },
  {
    year: 2023,
    dispositions: [
      { id: 20, title: 'Disp. nr. 651/2023 privind desemnarea d-nei Galea Iulia ca persoana cu atributii de exercitare a controlului financiar-preventiv propriu, in lipsa d-nei Kis Anamaria, Sef Serviciu Economic', pdfUrl: '#' },
      { id: 21, title: 'Dispoziția nr. 564/2023 – înlocuirea d-lui Taussig László responsabil cu implementarea Planului de Integritate al Strategiei Naționale Anticorupție 2021-2025 la nivelul Primăriei Mun. Salonta, cu d-l Buda Adrian Călin', pdfUrl: '#' },
      { id: 22, title: 'Dispoziția nr. 483/2023 – privind împuternicirea d-lui Petelei Ambrus Örs, personal contractual, ca agent constatator cu verificarea și constatarea prevederilor Art. 1 din Legea nr. 62/2018 și aplicarea sancțiunilor potrivit Art. 3 din Legea nr. 62/2018, privind combaterea buruienii ambrozia', pdfUrl: '#' },
      { id: 23, title: 'Dispoziția nr. 482/2023 – desemnarea d-lui Fazekas Zsolt, funcționar public de execuție, ca responsabil cu aplicarea prevederilor Legii nr. 62/2018 privind combaterea buruienii ambrozia pe raza Municipiului Salonta', pdfUrl: '#' },
    ],
  },
  {
    year: 2022,
    dispositions: [
      { id: 30, title: 'Dispozitia nr. 651/15.12.2022 – încredințarea spre păstrare și utilizare a sigiliilor folosite pentru proiectele și actele normative emise sau adoptate de autoritate publică locală a municipiului Salonta', pdfUrl: '#' },
      { id: 31, title: 'Dispozitia nr. 600/15.11.2022 – constituirea Comandamentului local pentru deszapezire in sezonul rece 2022-2023', pdfUrl: '#' },
      { id: 32, title: 'Dispozitia nr. 594/11.11.2022 – reorganizarea comitetului local si a centrului local pentru situatii de urgenta', pdfUrl: '#' },
      { id: 33, title: 'Dispoziția nr. 334 din 29 iulie 2022 – numirea unui membru din partea autorităţilor publice locale în comitetul executiv a Asociaţiei de proprietari ANL „OMV" Salonta', pdfUrl: '#' },
      { id: 34, title: 'Dispozitia nr. 234 – desemnarea domnului Kiri Norbert cu urmarirea respectarii regulilor si masurilor de protectie a cetatenilor cu ocazia Zilelor Salontane', pdfUrl: '#' },
      { id: 35, title: 'Dispoziția nr. 109 – stabilire locații privind Autorecenzarea asistată – RPL2021', pdfUrl: '#' },
      { id: 36, title: 'Dispoziția nr. 97 – persoană responsabilă cu preluarea bunurilor arheologice', pdfUrl: '#' },
    ],
  },
  {
    year: 2021,
    dispositions: [
      { id: 40, title: 'Dispozitia nr. 413/2021 – privind constituirea Comandamentului local pentru deszapezire', pdfUrl: '#' },
      { id: 41, title: 'Dispozitia nr. 324/2021 – concurs profesor informatica', pdfUrl: '#' },
      { id: 42, title: 'Dispozitia nr. 176/2021 – responsabili combaterea ambroziei', pdfUrl: '#' },
      { id: 43, title: 'Dispozitia nr. 170/2021 – personal prim ajutor', pdfUrl: '#' },
      { id: 44, title: 'Dispozitia nr. 63/2021 – Comisia de control intern managerial', pdfUrl: '#' },
      { id: 45, title: 'Dispozitia nr. 61/2021 – Comisia de inventariere', pdfUrl: '#' },
      { id: 46, title: 'Dispozitia nr. 58/2021 – persoana responsabila cu monitorizarea proceselor legate de interdictiile post-angajare', pdfUrl: '#' },
      { id: 47, title: 'Dispozitia nr. 1/2021 – aprobarea acoperirii deficitului bugetar local', pdfUrl: '#' },
    ],
  },
  {
    year: 2020,
    dispositions: [
      { id: 50, title: 'Dispozitia nr. 304 – sediu birou electoral municipal alegeri locale 2020', pdfUrl: '#' },
      { id: 51, title: 'Dispoziția nr. 178 din 2020 privind acceptare donatie', pdfUrl: '#' },
      { id: 52, title: 'Dispoziția nr. 168 din 2020 privind reorganizarea Compartimentului specializat în sprijinirea, îndrumarea și controlul asociațiilor de proprietari din cadrul primăriei Municipiului Salonta', pdfUrl: '#' },
      { id: 53, title: 'Dispoziția nr. 177 din 2020 privind convocare CLMS în ședință ordinară', pdfUrl: '#' },
      { id: 54, title: 'Dispoziția nr. 164 din 2020 privind reorganizarea comitetului local şi a centrului operativ cu activitate temporară pentru situaţii de urgenţă', pdfUrl: '#' },
      { id: 55, title: 'Dispoziția nr. 155 din 2020 privind convocare CLMS în ședință ordinară', pdfUrl: '#' },
      { id: 56, title: 'Dispoziția nr. 117 din 2020 privind convocare CLMS în ședință extraordinară', pdfUrl: '#' },
      { id: 57, title: 'Dispozitia nr. 109/2020 privind constituirea Comisiei municipale pt. recensamantul general agricol runda 2020', pdfUrl: '#' },
      { id: 58, title: 'Dispoziția nr. 101 din 2020 privind convocare CLMS în ședință ordinară', pdfUrl: '#' },
      { id: 59, title: 'Dispoziția nr. 66 din 2020 privind convocare CLMS în ședință ordinară', pdfUrl: '#' },
      { id: 60, title: 'Dispoziția nr. 53 din 2020 privind aprobarea Metodologie de organizare concurs', pdfUrl: '#' },
      { id: 61, title: 'Dispoziția nr. 1 din 2020 privind aprobarea acoperirii deficitului bugetului local rezultat la încheierea exercițiului bugetar 2019', pdfUrl: '#' },
    ],
  },
  {
    year: 2019,
    dispositions: [
      { id: 70, title: 'Dispozitia nr. 451/2019 privind rectificarea bugetului general consolidat al Mun. Salonta aferent anului 2019', pdfUrl: '#' },
      { id: 71, title: 'Dispozitia nr. 327/2019 privind stabilirea locurilor speciale de afisaj de pe raza mun. Salonta pentru alegerea Presedintelui Romaniei in 2019', pdfUrl: '#' },
      { id: 72, title: 'Dispozitia nr. 276/2019 privind numirea d-nei Borze Laura Betty ca persoana cu atributii de exercitare a controlului financiar preventiv pe perioada concediilor d-nei Kis Anamaria, Sef Serviciu Economic', pdfUrl: '#' },
      { id: 73, title: 'Dispozitia nr. 172/2019 privind desemnarea responsabilului in domeniul situatiilor de urgenta in cadrul Zilelor orasului in perioada 17-19.05.2019', pdfUrl: '#' },
      { id: 74, title: 'Dispozitia nr. 153/2019 privind numirea responsabilului cu evidenta militara', pdfUrl: '#' },
      { id: 75, title: 'Dispozitia nr. 145/2019 privind actualizarea componentei Comisiei pt. probleme de aparare', pdfUrl: '#' },
      { id: 76, title: 'Dispozitia nr. 130/2019 privind stabilirea locurilor speciale de afisaj pe raza mun. Salonta in cadrul alegerilor pt. Parlamentul European in data de 26.05.2019', pdfUrl: '#' },
      { id: 77, title: 'Dispozitia nr. 25/2019 privind reorganizarea comitetului local si a centrului operativ cu activitatea temporara pt. situatii de urgenta', pdfUrl: '#' },
    ],
  },
  {
    year: 2018,
    dispositions: [
      { id: 80, title: 'Dispozitia nr. 409/2018 privind aprobarea Procedurii de organizare a probelor suplimentare de testare a competentelor specifice la concursurile organizate de catre Primaria Mun. Salonta', pdfUrl: '#' },
      { id: 81, title: 'Disp. nr. 372/2018 privind desemnarea d-rei Popute Raluca Georgiana cu atributii de control pentru constatarea si sanctionarea contraventiilor, in temeiul Legii nr. 153/2011, pe teritoriul mun. Salonta', pdfUrl: '#' },
      { id: 82, title: 'Disp. nr. 346/2018 privind numirea comisiei de evaluare si selectie a partenerului privat in vederea pregatirii si depunerii proiectului in cadrul POCU 2014-2020, Bunicii Comunitatii (AP 4/PI 9.ii/OS 4.4)', pdfUrl: '#' },
      { id: 83, title: 'Disp. nr. 308/2018 privind reglementarea accesului si actionarea echipamentelor de alarmare', pdfUrl: '#' },
      { id: 84, title: 'Disp. nr. 306/2018 privind numirea Consiliului Comunitar Consultativ la nivelul mun. Salonta', pdfUrl: '#' },
      { id: 85, title: 'Disp. nr. 295/2018 privind numirea comisiei de analiza priv. incalcarea dreptului de acces la informatiile de interes public din cadrul Primariei Salonta cf. Legii nr. 544/2001', pdfUrl: '#' },
      { id: 86, title: 'Disp. nr. 220/2018 privind numirea Comisiei de disciplina din cadrul Primariei', pdfUrl: '#' },
      { id: 87, title: 'Disp. nr. 208/2018 privind desemnarea responsabilului cu protectia datelor cu caracter personal in cadrul Primariei Salonta', pdfUrl: '#' },
      { id: 88, title: 'Disp. nr. 213/2018 privind stabilirea ajutorului pt. inmormantarea persoanelor din familiile beneficiare de ajutor social, conf. Legii nr. 416/2001', pdfUrl: '#' },
      { id: 89, title: 'Disp. nr. 210/2018 privind aprobarea Codului etic si de integritate a personalului din cadrul Primariei', pdfUrl: '#' },
      { id: 90, title: 'Disp. nr. 204/2018 privind desemnarea purtatorului de cuvant al Primariei', pdfUrl: '#' },
      { id: 91, title: 'Disp. nr. 172/2018 privind desemnarea personalului responsabil cu urmarirea respectarii regulilor de protectie a cetatenilor in domeniul situatiilor de urgenta in cadrul Zilelor orasului in perioada 25-27.05.2018', pdfUrl: '#' },
      { id: 92, title: 'Disp. nr. 165/2018 privind desemnarea d-nei Borze Laura Betty ca persoana cu atributii de exercitare a controlului financiar-preventiv propriu', pdfUrl: '#' },
      { id: 93, title: 'Disp. nr. 162/2018 privind reorganizarea Comisiei pentru monitorizarea sistemului de control intern/managerial', pdfUrl: '#' },
      { id: 94, title: 'Disp. nr. 154/2018 privind desemnarea d-nei Laza Florica si a d-rei Popute Raluca ca agenti constatatori', pdfUrl: '#' },
      { id: 95, title: 'Disp. nr. 142/2018 privind desemnarea d-nei Marc Erika si a d-nei Varga Judith Alexandra', pdfUrl: '#' },
      { id: 96, title: 'Disp. nr. 141/2018 priv. numirea personalului responsabil cu instruirea in domeniul securitatii si sanatatii in munca', pdfUrl: '#' },
      { id: 97, title: 'Disp. nr. 138/2018 privind constituirea comisiei cu atributii de evaluare si inventariere a bunurilor primite cu titlu gratuit', pdfUrl: '#' },
      { id: 98, title: 'Disp. nr. 136/2018 priv. numirea d-nei Toth Anna-Maria ca lucrator in activitatile de prevenire si protectie in domeniul securitatii si sanatatii in munca', pdfUrl: '#' },
      { id: 99, title: 'Disp. nr. 134/2018 privind desemnarea d-rei Tosa Laura Bianca ca responsabila cu implementarea prevederilor referitoare la declaratiile de avere', pdfUrl: '#' },
    ],
  },
  {
    year: 2014,
    dispositions: [
      { id: 100, title: 'Disp. nr. 9/2014 privind desemnarea d-lui Luncan Florin ca persoana cu atributii de exercitare a controlului financiar-preventiv', pdfUrl: '#' },
    ],
  },
  {
    year: 2011,
    dispositions: [
      { id: 110, title: 'Disp. nr. 384/2011 privind desemnarea d-nei Kis Anamaria ca persoana cu atributii de exercitare a controlului financiar-preventiv', pdfUrl: '#' },
    ],
  },
];

export default async function ConcursuriPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tPage = await getTranslations({ locale, namespace: 'concursuriPage' });

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
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-primary-600" />
                  {tPage('formsTitle')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {FORMS.map((form) => (
                    <a
                      key={form.id}
                      href={form.pdfUrl}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-primary-300 transition-colors"
                    >
                      <Download className="w-4 h-4 text-primary-600" />
                      <span className="text-gray-700">{form.title}</span>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Current Job Announcements */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-emerald-700" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{tPage('currentJobsTitle')}</h2>
              </div>

              <div className="space-y-3">
                {JOB_ANNOUNCEMENTS.map((job) => (
                  <Card key={job.id} hover>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                          <BadgeCheck className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            <h3 className="font-medium text-gray-900">{job.title}</h3>
                            {job.date && (
                              <span className="text-sm text-gray-500 flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {job.date}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {job.documents.map((doc, idx) => (
                              <a
                                key={idx}
                                href={doc.pdfUrl}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-emerald-300 transition-colors"
                              >
                                <Download className="w-4 h-4 text-emerald-600" />
                                <span className="text-gray-700">{doc.title}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Mayor's Dispositions Section */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
                  <ScrollText className="w-5 h-5 text-violet-700" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{tPage('dispositionsTitle')}</h2>
              </div>

              {DISPOSITIONS_DATA.map((yearData) => (
                <div key={yearData.year} className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-700">{yearData.year}</h3>
                    <span className="text-sm text-gray-500">
                      ({yearData.dispositions.length} {tPage('documents')})
                    </span>
                  </div>

                  <div className="space-y-2">
                    {yearData.dispositions.map((disp) => (
                      <Card key={disp.id} hover>
                        <CardContent className="flex items-center justify-between pt-4 pb-4">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
                              <FileText className="w-4 h-4 text-violet-600" />
                            </div>
                            <p className="text-sm text-gray-700">{disp.title}</p>
                          </div>
                          <a
                            href={disp.pdfUrl}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-violet-300 transition-colors shrink-0 ml-4"
                          >
                            <Download className="w-4 h-4 text-violet-600" />
                            PDF
                          </a>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>

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
