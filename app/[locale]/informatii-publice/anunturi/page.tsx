import { getTranslations } from 'next-intl/server';
import { Megaphone, Calendar, Download, ExternalLink, FileText, Info, Link as LinkIcon } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('anunturi') };
}

// Types for announcements
interface Attachment {
  title: string;
  url: string;
}

interface Announcement {
  id: number;
  date: string;
  title: string;
  category: string;
  attachments?: Attachment[];
  externalLink?: string;
}

// Mock data - will be replaced with database fetch
const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 1,
    date: '2025-12-29',
    title: 'Anunt privind aprobarea declansarii procedurii de expropriere a unor imobile (terenuri) proprietate privata, care constituie coridorul de expropriere aferent lucrarii de utilitate publica de interes local: „Amenajare Coridor Albastru in Municipiul Salonta"',
    category: 'urbanism',
    attachments: [{ title: 'Anunț', url: '#' }],
  },
  {
    id: 2,
    date: '2025-12-10',
    title: 'PV selectare dosare pentru candidatii în Consiliul de Administrație al Societății Dezvoltarea și Administrarea Patrimoniului Salonta S.A.',
    category: 'administrație',
    attachments: [{ title: 'PV selectare dosare', url: '#' }],
  },
  {
    id: 3,
    date: '2025-11-17',
    title: 'PV final – Analiza noului proiect de management al managerului Casa de Cultură „Zilahy Lajos" Salonta',
    category: 'cultură',
    attachments: [{ title: 'PV final', url: '#' }],
  },
  {
    id: 4,
    date: '2025-11-10',
    title: 'PV afișare, etapa II – Analiza noului proiect de management al managerului Casa de Cultură „Zilahy Lajos" Salonta',
    category: 'cultură',
    attachments: [{ title: 'PV etapa II', url: '#' }],
  },
  {
    id: 5,
    date: '2025-11-06',
    title: 'PV afișare, etapa I – Analiza noului proiect de management al managerului Casa de Cultură „Zilahy Lajos" Salonta',
    category: 'cultură',
    attachments: [{ title: 'PV etapa I', url: '#' }],
  },
  {
    id: 6,
    date: '2025-11-04',
    title: 'Primăria Municipiului Salonta organizează și desfășoară analiza noului proiect de management al managerului Casei de Cultură „Zilahy Lajos"',
    category: 'cultură',
    attachments: [{ title: 'Anunț', url: '#' }],
  },
  {
    id: 7,
    date: '2025-10-22',
    title: 'HCLMS nr. 180 din 25.09.2025 privind completarea HCLMS 165/2022 pentru aprobarea Programului local multianual de creştere a performanţei energetice a blocurilor de locuinţe în Municipiul Salonta – Etapa II',
    category: 'hotărâri',
    attachments: [{ title: 'HCLMS 180/2025', url: '#' }],
  },
  {
    id: 8,
    date: '2025-09-17',
    title: 'Anunț de recrutare pentru membru în Consiliul de Administrație al Societății Dezvoltarea și Administrarea Patrimoniului Salonta S.A.',
    category: 'recrutare',
    attachments: [
      { title: 'Anunț', url: '#' },
      { title: 'Formulare', url: '#' },
    ],
  },
  {
    id: 9,
    date: '2025-09-12',
    title: 'Raport inițial al Comisiei de selecție și nominalizare a membrilor Consiliului de Administrație al societății Dezvoltarea și Administrarea Patrimoniului Salonta SA',
    category: 'administrație',
    attachments: [
      { title: 'Raport inițial', url: '#' },
      { title: 'Planul de selecție', url: '#' },
    ],
  },
  {
    id: 10,
    date: '2025-09-01',
    title: 'Răspuns la solicitare de clarificare – privind Parcul de Specializare Inteligentă Salonta',
    category: 'licitații',
    attachments: [{ title: 'Răspuns clarificare', url: '#' }],
  },
  {
    id: 11,
    date: '2025-08-28',
    title: 'Actualizare suplimentară privind calendarul procedurii și prelungirea termenului de depunere a ofertelor privind concesionarea prin licitație publică a terenurilor aflate în perimetrul Parcului de Specializare Inteligentă Salonta, situat pe str. Iosif Vulcan',
    category: 'licitații',
    attachments: [{ title: 'Actualizare calendar', url: '#' }],
  },
  {
    id: 12,
    date: '2025-08-22',
    title: 'Actualizare privind calendarul procedurii și prelungirea termenului de depunere a ofertelor privind concesionarea prin licitație publică a terenurilor aflate în perimetrul Parcului de Specializare Inteligentă Salonta, situat pe str. Iosif Vulcan',
    category: 'licitații',
    attachments: [{ title: 'Actualizare calendar', url: '#' }],
  },
  {
    id: 13,
    date: '2025-08-05',
    title: 'Hotararea nr. 148/31.07.2025 privind aprobarea studiului de fezabilitate, a indicatorilor tehnico-economici aferente lucrarii de utilitate publica de interes local „Infiintare a 12 foraje pentru cresterea capacitatii de alimentare cu apa a Municipiului Salonta" si exproprierea pentru cauza de utilitate publica a imobilelor inscrise in CF nr. 107727, supr. 24440 mp, CF nr. 107802, supr. 4200 mp, CF nr. 107732, supr. 12500 mp, aflate in proprietate privata',
    category: 'hotărâri',
    attachments: [{ title: 'HCLMS 148/2025', url: '#' }],
  },
  {
    id: 14,
    date: '2025-08-01',
    title: 'Anunț privind concesionarea prin licitație publică a terenurilor aflate în perimetrul Parcului de Specializare Inteligentă Salonta, situat pe str. Iosif Vulcan – runda a II-a',
    category: 'licitații',
    attachments: [{ title: 'Anunț concesionare', url: '#' }],
  },
  {
    id: 15,
    date: '2025-07-23',
    title: 'Anunt de mediu privind decizia etapei de incadrare: „Infiintarea a 12 foraje pentru cresterea capacitatii de alimentare cu apa a Municipiului Salonta"',
    category: 'mediu',
    attachments: [{ title: 'Anunț mediu', url: '#' }],
  },
  {
    id: 16,
    date: '2025-06-18',
    title: 'Decizia nr. 81/18.06.2025 a SC AquaNova Hargita SRL privind prețul apei potabile produse, transportate și distribuite în mun. Salonta și a tarifului de canalizare-epurare pentru mun. Salonta',
    category: 'utilități',
    attachments: [{ title: 'Decizie', url: '#' }],
  },
  {
    id: 17,
    date: '2025-06-10',
    title: 'Anunț aferent procedurii de contractare a serviciilor de acordare credit bancar pentru asigurarea cofinanțării unor proiecte din fonduri externe nerambursabile și a unor lucrări adiacente',
    category: 'financiar',
    attachments: [
      { title: 'Anunț', url: '#' },
      { title: 'Documentația de atribuire', url: '#' },
    ],
  },
  {
    id: 18,
    date: '2025-06-04',
    title: 'Anunt privind concesionarea, prin licitație publică, a terenurilor aflate în perimetrul Parcului de Specializare Inteligentă Salonta, situat pe str.Iosif Vulcan',
    category: 'licitații',
    attachments: [
      { title: 'Anunț', url: '#' },
      { title: 'HCLMS nr. 104/29.05.2025', url: '#' },
      { title: 'Formulare', url: '#' },
    ],
  },
  {
    id: 19,
    date: '2025-05-29',
    title: 'PV de recepție nr. 361/2025. Denumirea lucrării: Plan cu amplasamentul lucrării necesar la exproprierea pentru cauză de utilitate publică de interes local privind investiția „Amenajare Coridor Albastru in Mun. Salonta"',
    category: 'urbanism',
    attachments: [{ title: 'PV recepție', url: '#' }],
  },
  {
    id: 20,
    date: '2025-05-23',
    title: 'PV ședința de adjudecare prin licitație publică a loturilor de teren ce compun suprafața de 121,42 ha pășune permanentă din izlazul comunal',
    category: 'agricol',
    attachments: [{ title: 'PV adjudecare', url: '#' }],
  },
  {
    id: 21,
    date: '2025-05-22',
    title: 'PV ședința de deschidere a documentațiilor depuse în Etapa II, pentru închirierea prin licitație publică a pășunilor din izlazul comunal conform HCLMS nr. 77/30.04.2025',
    category: 'agricol',
    attachments: [{ title: 'PV deschidere', url: '#' }],
  },
  {
    id: 22,
    date: '2025-05-06',
    title: 'Hotărârea nr. 77 din 30 aprilie 2025, privind aprobarea organizării licitației publice pentru închirierea loturilor care compun suprafața de 121,42 ha pășune permanentă situată în Mun. Salonta',
    category: 'hotărâri',
    attachments: [
      { title: 'HCLMS 77/2025', url: '#' },
      { title: 'HCLMS 75/2025', url: '#' },
    ],
  },
  {
    id: 23,
    date: '2025-04-25',
    title: 'Proces verbal al ședinței de analiză a cererilor și documentației depuse pentru închirierea pășunilor disponibile din izlazul comunal',
    category: 'agricol',
    attachments: [{ title: 'PV analiză', url: '#' }],
  },
  {
    id: 24,
    date: '2025-03-21',
    title: 'Hotărârea nr. 48 din 21 martie 2025 privind aprobarea Listei de repartizare a 36 locuințe pentru tineri, destinate închirierii, construite prin Agenția Națională de Locuințe, situate în municipiul Salonta, str. A.S.Puskin, nr. 11',
    category: 'locuințe',
    attachments: [{ title: 'HCLMS 48/2025', url: '#' }],
  },
  {
    id: 25,
    date: '2025-03-13',
    title: 'Hotărârea nr. 46 din 13 martie 2025 privind aprobarea Listei de priorități a solicitanților de locuințe ANL, în vederea închirierii locuințelor ANL aflate în administrarea Municipiului Salonta, sesiunea 2025',
    category: 'locuințe',
    attachments: [{ title: 'HCLMS 46/2025', url: '#' }],
  },
  {
    id: 26,
    date: '2024-12-16',
    title: 'SC Salgaz SA – operator de distributie gaze naturale, angajeaza o persoană pentru serviciul tehnic',
    category: 'recrutare',
    attachments: [{ title: 'Anunț angajare', url: '#' }],
  },
  {
    id: 27,
    date: '2024-12-12',
    title: 'ADI Ecolect Group Bihor – propunere modificare tarife pentru gestionarea deșeurilor',
    category: 'utilități',
    attachments: [
      { title: 'Propunere modificare tarife', url: '#' },
      { title: 'Hotărâre AGA nr. 18/2024', url: '#' },
    ],
  },
  {
    id: 28,
    date: '2024-12-05',
    title: 'Anunț public – privind procedura evaluării de mediu pentru planuri și programe, în vederea obținerii avizului de mediu pentru PUZ',
    category: 'mediu',
    attachments: [{ title: 'Anunț', url: '#' }],
  },
  {
    id: 29,
    date: '2024-09-26',
    title: 'Anunț începere implementare proiect PNRR: „Extinderea rețelei de canalizare a apelor uzate în Municipiul Salonta pe un număr de 16 străzi, retehnologizarea stațiilor de pompare vechi ale sistemului de canalizare menajeră", cod proiect C1I100122000002',
    category: 'proiecte',
    attachments: [{ title: 'Anunț PNRR', url: '#' }],
  },
  {
    id: 30,
    date: '2024-09-20',
    title: 'Proiect de hotărâre nr.138 / 20.09.2024 pentru acordarea scutirilor de la plata majorărilor de întârziere aferente obligațiilor bugetare datorate bugetului local de către persoanele fizice și juridice',
    category: 'taxe',
    attachments: [{ title: 'Proiect hotărâre', url: '#' }],
  },
  {
    id: 31,
    date: '2024-08-12',
    title: 'Buletine analize apă potabilă – fântâni publice și rețea',
    category: 'utilități',
    attachments: [
      { title: 'Buletin analize – fântâna Arany János', url: '#' },
      { title: 'Buletin analize rețeaua publică', url: '#' },
      { title: 'Buletin analize – fântâna Andrei Mureșanu', url: '#' },
      { title: 'Buletin analize – fântâna Kulin', url: '#' },
      { title: 'Buletin analize – fântâna Petőfi Sándor', url: '#' },
      { title: 'Buletin analize – fântâna Tincii', url: '#' },
    ],
  },
  {
    id: 32,
    date: '2024-07-01',
    title: 'Anunț public privind infrastructura pentru transport verde – piste biciclete',
    category: 'urbanism',
    attachments: [
      { title: 'Anunț infrastructură transport verde', url: '#' },
      { title: 'Anunț reabilitare pistă biciclete', url: '#' },
    ],
  },
  {
    id: 33,
    date: '2024-06-01',
    title: 'DGASPC Bihor – material informativ destinat persoanelor interesate despre condițiile de obținere a atestatului, procedurile de atestare și statutul asistentului maternal',
    category: 'social',
    attachments: [{ title: 'Material informativ', url: '#' }],
  },
  {
    id: 34,
    date: '2024-05-13',
    title: 'Anunț mediu: Asigurarea infrastructurii pentru transport verde prin amenajarea pistelor de biciclete în Municipiul Salonta / Reabilitare pistă de biciclete între municipiul Salonta și frontiera cu Ungaria',
    category: 'mediu',
    attachments: [
      { title: 'Anunț piste biciclete', url: '#' },
      { title: 'Anunț reabilitare pistă', url: '#' },
    ],
  },
  {
    id: 35,
    date: '2024-05-01',
    title: 'Informare – Ce se întâmplă cu copiii d-voastră cât timp sunteți plecați la muncă în străinătate?',
    category: 'social',
    attachments: [{ title: 'Informare', url: '#' }],
  },
  {
    id: 36,
    date: '2024-04-09',
    title: 'Curtea de Apel Oradea – concurs grefier arhivar cu studii superioare, pe perioadă determinată, la Judecătoria Salonta',
    category: 'recrutare',
    attachments: [{ title: 'Anunț concurs', url: '#' }],
  },
  {
    id: 37,
    date: '2024-03-21',
    title: 'Anunț public – privind depunerea solicitării de emitere a acordului de mediu',
    category: 'mediu',
    attachments: [{ title: 'Anunț', url: '#' }],
  },
  {
    id: 38,
    date: '2024-03-05',
    title: 'Curtea de Apel Oradea – concurs de recrutare pentru ocupare de posturi',
    category: 'recrutare',
    attachments: [{ title: 'Anunț concurs', url: '#' }],
  },
  {
    id: 39,
    date: '2024-01-01',
    title: 'Adăpost canin – Municipiul Salonta',
    category: 'general',
    externalLink: '/informatii-publice/adapost-caini',
  },
  {
    id: 40,
    date: '2023-12-20',
    title: 'Anunț privind lista instituțiilor publice care se vor desființa/reorganiza/fuziona: Unitatea de Asistență Medico-Socială pentru bolnavi cronici și Cantina Socială a Municipiului Salonta',
    category: 'administrație',
    attachments: [{ title: 'Anunț reorganizare', url: '#' }],
  },
  {
    id: 41,
    date: '2023-11-28',
    title: 'Rezultatul final al analizei noului proiect de management al managerului Complexului Muzeal „Arany János"',
    category: 'cultură',
    attachments: [{ title: 'Rezultat final', url: '#' }],
  },
  {
    id: 42,
    date: '2022-11-16',
    title: 'PV afisare, rezultat final – Analiza noului proiect de management al managerului Casei de Cultură',
    category: 'cultură',
    attachments: [{ title: 'PV rezultat final', url: '#' }],
  },
  {
    id: 43,
    date: '2022-08-05',
    title: 'Programul local multianual de creştere a performanţei energetice a blocurilor de locuinţe în Municipiul Salonta – Etapa II',
    category: 'locuințe',
    attachments: [{ title: 'Program eficiență energetică', url: '#' }],
  },
  {
    id: 44,
    date: '2022-03-25',
    title: 'Programul local multianual de creștere a performanței energetice a blocurilor de locuințe în mun. Salonta – Etapa I',
    category: 'locuințe',
    attachments: [{ title: 'Program eficiență energetică', url: '#' }],
  },
  {
    id: 45,
    date: '2021-07-15',
    title: 'Lista de priorități/repartiție a locuințelor ANL pe anul 2021',
    category: 'locuințe',
    attachments: [{ title: 'Lista locuințe ANL', url: '#' }],
  },
  {
    id: 46,
    date: '2019-11-13',
    title: 'Anunț – Facilități fiscale',
    category: 'taxe',
    attachments: [{ title: 'Anunț facilități', url: '#' }],
  },
  {
    id: 47,
    date: '2019-06-27',
    title: 'Proiect de hotărâre – Regulamentul de stabilire a taxei speciale de salubrizare',
    category: 'taxe',
    attachments: [{ title: 'Proiect regulament', url: '#' }],
  },
  {
    id: 48,
    date: '2019-06-12',
    title: 'Adresa DSP, privind aplicarea masurilor de dezinsectie',
    category: 'sănătate',
    attachments: [{ title: 'Adresă DSP', url: '#' }],
  },
  {
    id: 49,
    date: '2019-01-18',
    title: 'Anunt de participare – privind delegarea prin negociere competitiva a gestiunii serviciului public de administrare a parcarilor publice din Salonta',
    category: 'licitații',
    attachments: [{ title: 'Anunț participare', url: '#' }],
  },
  {
    id: 50,
    date: '2018-12-20',
    title: 'Plan de masuri de sarbatori',
    category: 'general',
    attachments: [{ title: 'Plan măsuri', url: '#' }],
  },
  {
    id: 51,
    date: '2018-12-06',
    title: 'Anunt DGASPCBH Bihor privind evaluarea copiilor cu dizabilitati, in vederea incadrarii in grad de handicap / Anunt public privind decizia etapei de incadrare',
    category: 'social',
    attachments: [
      { title: 'Anunț DGASPC', url: '#' },
      { title: 'Anunț decizie încadrare', url: '#' },
    ],
  },
  {
    id: 52,
    date: '2018-05-17',
    title: 'Lista de prioritati/repartitie a locuintelor ANL pe anul 2018',
    category: 'locuințe',
    attachments: [{ title: 'Lista ANL 2018', url: '#' }],
  },
  {
    id: 53,
    date: '2017-01-01',
    title: 'Lista de prioritati/repartitie a locuintelor sociale pe anul 2017',
    category: 'locuințe',
    attachments: [{ title: 'Lista locuințe sociale', url: '#' }],
  },
];

const CATEGORY_LABELS: Record<string, { ro: string; hu: string; en: string; color: string }> = {
  general: { ro: 'General', hu: 'Általános', en: 'General', color: 'bg-gray-100 text-gray-700' },
  administrație: { ro: 'Administrație', hu: 'Közigazgatás', en: 'Administration', color: 'bg-blue-100 text-blue-700' },
  cultură: { ro: 'Cultură', hu: 'Kultúra', en: 'Culture', color: 'bg-purple-100 text-purple-700' },
  hotărâri: { ro: 'Hotărâri', hu: 'Határozatok', en: 'Decisions', color: 'bg-indigo-100 text-indigo-700' },
  licitații: { ro: 'Licitații', hu: 'Árverések', en: 'Auctions', color: 'bg-orange-100 text-orange-700' },
  mediu: { ro: 'Mediu', hu: 'Környezet', en: 'Environment', color: 'bg-green-100 text-green-700' },
  urbanism: { ro: 'Urbanism', hu: 'Városrendezés', en: 'Urban Planning', color: 'bg-teal-100 text-teal-700' },
  agricol: { ro: 'Agricol', hu: 'Mezőgazdaság', en: 'Agriculture', color: 'bg-lime-100 text-lime-700' },
  locuințe: { ro: 'Locuințe', hu: 'Lakások', en: 'Housing', color: 'bg-amber-100 text-amber-700' },
  recrutare: { ro: 'Recrutare', hu: 'Toborzás', en: 'Recruitment', color: 'bg-rose-100 text-rose-700' },
  utilități: { ro: 'Utilități', hu: 'Közművek', en: 'Utilities', color: 'bg-cyan-100 text-cyan-700' },
  financiar: { ro: 'Financiar', hu: 'Pénzügyi', en: 'Financial', color: 'bg-emerald-100 text-emerald-700' },
  proiecte: { ro: 'Proiecte', hu: 'Projektek', en: 'Projects', color: 'bg-sky-100 text-sky-700' },
  taxe: { ro: 'Taxe', hu: 'Adók', en: 'Taxes', color: 'bg-red-100 text-red-700' },
  social: { ro: 'Social', hu: 'Szociális', en: 'Social', color: 'bg-pink-100 text-pink-700' },
  sănătate: { ro: 'Sănătate', hu: 'Egészségügy', en: 'Health', color: 'bg-fuchsia-100 text-fuchsia-700' },
};

export default async function AnunturiPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tPage = await getTranslations({ locale, namespace: 'anunturiPage' });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(
      locale === 'hu' ? 'hu-HU' : locale === 'en' ? 'en-GB' : 'ro-RO',
      { day: '2-digit', month: '2-digit', year: 'numeric' }
    );
  };

  // Group announcements by year
  const groupedByYear = ANNOUNCEMENTS.reduce((acc, announcement) => {
    const year = new Date(announcement.date).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(announcement);
    return acc;
  }, {} as Record<number, Announcement[]>);

  const years = Object.keys(groupedByYear).map(Number).sort((a, b) => b - a);

  return (
    <>
      <Breadcrumbs items={[
        { label: t('informatiiPublice'), href: '/informatii-publice' },
        { label: t('anunturi') }
      ]} />
      <PageHeader titleKey="anunturi" icon="megaphone" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            {/* Category Legend */}
            <Card className="mb-8">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Info className="w-5 h-5 text-gray-400" />
                  <h3 className="font-semibold text-gray-700">{tPage('legend')}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(CATEGORY_LABELS).map(([key, value]) => (
                    <Badge key={key} className={value.color}>
                      {value[locale as 'ro' | 'hu' | 'en']}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Announcements by Year */}
            {years.map((year) => (
              <div key={year} className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary-700" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{year}</h2>
                  <span className="text-sm text-gray-500">
                    ({groupedByYear[year].length} {tPage('announcements')})
                  </span>
                </div>

                <div className="space-y-3">
                  {groupedByYear[year].map((announcement) => (
                    <Card key={announcement.id} hover>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                            <Megaphone className="w-5 h-5 text-primary-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <Badge className={CATEGORY_LABELS[announcement.category]?.color || 'bg-gray-100 text-gray-700'}>
                                {CATEGORY_LABELS[announcement.category]?.[locale as 'ro' | 'hu' | 'en'] || announcement.category}
                              </Badge>
                              <span className="text-sm text-gray-500 flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {formatDate(announcement.date)}
                              </span>
                            </div>
                            <h3 className="font-medium text-gray-900 mb-3">{announcement.title}</h3>
                            
                            {/* Attachments */}
                            {announcement.attachments && announcement.attachments.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {announcement.attachments.map((attachment, idx) => (
                                  <a
                                    key={idx}
                                    href={attachment.url}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-primary-300 transition-colors"
                                  >
                                    <Download className="w-4 h-4 text-primary-600" />
                                    <span className="text-gray-700">{attachment.title}</span>
                                  </a>
                                ))}
                              </div>
                            )}

                            {/* External Link */}
                            {announcement.externalLink && (
                              <a
                                href={announcement.externalLink}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-primary-300 transition-colors"
                              >
                                <LinkIcon className="w-4 h-4 text-primary-600" />
                                <span className="text-gray-700">{tPage('viewDetails') || 'Detalii'}</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}

            {/* Archive Note */}
            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <FileText className="w-8 h-8 text-gray-400 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">{tPage('archiveNote')}</h3>
                    <p className="text-gray-600 text-sm">
                      {tPage('archiveNoteDesc')}
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
