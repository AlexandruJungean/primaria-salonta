'use client';

import { useTranslations } from 'next-intl';
import { FileText, Download } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

// Types for republished decisions
interface Attachment {
  label: string;
  url: string;
}

interface RepublishedDecision {
  id: string;
  number: string;
  date: string;
  title: string;
  republishedThrough?: string; // e.g., "Republicată prin HCLMS nr.181/25.09.2025"
  attachments?: Attachment[];
  url: string;
}

// Mock data - will be replaced with database content
const REPUBLISHED_DECISIONS: RepublishedDecision[] = [
  {
    id: '1',
    number: '172',
    date: '27.08.2025',
    title: 'privind aprobarea planurilor de amplasament şi delimitare a imobilului pentru imobilul identificat ca Aleea Petre Păulescu',
    republishedThrough: 'Republicată prin HCLMS nr.181/25.09.2025',
    url: '#',
  },
  {
    id: '2',
    number: '71',
    date: '30.04.2025',
    title: 'privind aprobarea PUZ – Apartamentare imobil în 5 apartamente și transformarea spațiilor rezidențiale în spații comerciale, jud. Bihor, mun. Salonta, strada Kulin Gyorgy, nr. 1, nr. Cad. 110359',
    republishedThrough: 'Republicată prin HCLMS nr.186/25.09.2025',
    url: '#',
  },
  {
    id: '3',
    number: '69',
    date: '30.04.2025',
    title: 'privind aprobarea proiectului "Amenajare Coridor Albastru în Municipiul Salonta" și a cheltuielilor legate de proiect',
    republishedThrough: 'Republicată prin HCLMS nr.190/25.09.2025',
    url: '#',
  },
  {
    id: '4',
    number: '103',
    date: '30.04.2024',
    title: 'privind aprobarea documentației tehnico-economice și a indicatorilor tehnico – economici – Faza Studiu de Fezabilitate pentru obiectivul de investiții: "AMENAJARE CORIDOR ALBASTRU ÎN MUNICIPIUL SALONTA"',
    republishedThrough: 'Republicată prin HCLMS nr.146/31.07.2025 și prin HCLMS nr.189/25.09.2025',
    url: '#',
  },
  {
    id: '5',
    number: '128',
    date: '26.06.2025',
    title: 'privind completarea Art. 3 al HCLMS nr. 87/26.05.2025 privind aprobarea declanșării procedurii de expropriere a unor imobile (terenuri) aferente lucrării de utilitate publică de interes local „Amenajare Coridor Albastru în Mun. Salonta"',
    url: '#',
  },
  {
    id: '6',
    number: '87',
    date: '26.05.2025',
    title: 'privind aprobarea declanșării procedurii de expropriere a unor imobile (terenuri) aferente lucrării de utilitate publică de interes local „Amenajare Coridor Albastru în Mun. Salonta"',
    url: '#',
  },
  {
    id: '7',
    number: '37',
    date: '13.03.2025',
    title: 'privind modificarea formei juridice a societatii „Dezvoltarea si administrarea patrimoniului Salonta"',
    url: '#',
  },
  {
    id: '8',
    number: 'ROF',
    date: '30.01.2020',
    title: 'Republicarea Regulamentului de Organizare și Funcționare a Centrului de zi "Bunicii Comunității" Salonta aprobat prin Hotărârea nr.7/30.01.2020 cu modificările și completările ulterioare',
    url: '#',
  },
  {
    id: '9',
    number: '140',
    date: '16.07.2024',
    title: 'privind însușirea Contractului de Asistență Juridică nr. 36/08.07.2024',
    republishedThrough: 'Referat de corectare nr. 9047 din 11.11.2024',
    url: '#',
  },
  {
    id: '10',
    number: '169',
    date: '30.08.2024',
    title: 'privind alegerea președintelui de ședință CLMS pentru luna septembrie 2024',
    url: '#',
  },
  {
    id: '11',
    number: '7',
    date: '30.01.2020',
    title: 'privind aprobarea Regulamentului de organizare și funcționare a serviciului social de zi, Centru de zi "Bunicii Comunităţii Salonta"',
    url: '#',
  },
  {
    id: '12',
    number: '22',
    date: '23.01.2024',
    title: 'privind aprobarea proiectului cu titlul "Reabilitare interioară casa Roth Armin, Piața Libertății nr.8, municipiul Salonta, județul Bihor" și a cheltuielilor aferente acestuia',
    url: '#',
  },
  {
    id: '13',
    number: '21',
    date: '23.01.2024',
    title: 'privind aprobarea Proiectului Tehnic actualizat și a indicatorilor tehnico-economici pentru proiectul cu titlul „Reabilitare interioară casa ROTH ARMIN, Piața Libertății, nr.8, Municipiul Salonta, Județul Bihor"',
    url: '#',
  },
  {
    id: '14',
    number: '283',
    date: '21.12.2023',
    title: 'privind aprobarea etapizării proiectului „Creșterea producției de energie din resurse regenerabile mai puțin exploatate obținute în perimetrul geotermal Salonta" Cod SMIS 2014+ 125691',
    url: '#',
  },
  {
    id: '15',
    number: '169',
    date: '11.08.2023',
    title: 'privind aprobarea Proiectului Tehnic, a indicatorilor tehnico-economici și a Studiului de oportunitate pentru proiectul cu titlul „CORIDOR DE MOBILITATE URBANĂ PRIN CREAREA PISTELOR DE BICICLETE ȘI CORIDOR PRIORITAR PENTRU MIJLOC DE TRANSPORT ÎN COMUN ECOLOGIC. TRASEUL I DE LA EST LA VEST ȘI TRASEUL II DE LA SUD LA VEST ÎN MUNICIPIUL SALONTA"',
    url: '#',
  },
  {
    id: '16',
    number: '263',
    date: '13.12.2023',
    title: 'privind aprobarea proiectului și a cheltuielilor legate de implementarea proiectului cu titlul: „Coridor de mobilitate urbană prin crearea pistelor de biciclete și coridor prioritar pentru mijloc de transport în comun ecologic. Traseul I de la Est la Vest și Traseul II de la Sud la Vest în Municipiul Salonta"',
    url: '#',
  },
  {
    id: '17',
    number: '73',
    date: '28.03.2024',
    title: 'privind modificarea anexei nr. 1 la Hotărârea nr. 298/21.12.2022 privind însușirea propunerii de stemă a Municipiului Salonta',
    url: '#',
  },
  {
    id: '18',
    number: '77',
    date: '28.03.2024',
    title: 'privind aprobarea – modificării HCLMS nr. 31 din 13.02.2024 privind „Aprobarea indicatorilor pentru finanțarea elaborării și actualizării Planului Urbanistic General și Regulamentului Local de Urbanism al Municipiului Salonta, jud. Bihor"',
    url: '#',
  },
  {
    id: '19',
    number: '226',
    date: '2022',
    title: 'HCLMS nr. 226/2022',
    url: '#',
  },
  {
    id: '20',
    number: '192',
    date: '2023',
    title: 'republicare Regulament Complex Muzeal',
    url: '#',
  },
  {
    id: '21',
    number: '180',
    date: '2023',
    title: 'PAD retea curent electric zona Puskin',
    url: '#',
  },
  {
    id: '22',
    number: '272',
    date: '29.11.2022',
    title: 'privind aprobarea depunerii spre finanţare a proiectului „Extinderea rețelei de canalizare a apelor uzate în Municipiul Salonta pe un număr de 16 străzi, retehnologizarea stațiilor de pompare vechi ale sistemului de canalizare menajeră" – titlu apel PNRR/2022/C1/I1',
    url: '#',
  },
  {
    id: '23',
    number: '93',
    date: '2023',
    title: 'privind preluarea în domeniul public al Municipiului Salonta a terenului intravilan cu suprafața de 43 mp identificat cu nr. cad 114519 înscris în CF nr. 114519, ca urmare a renunțării numiților Polyánki Csaba-János și Polyanki-Gál Katalin la dreptul lor de proprietate',
    url: '#',
  },
  {
    id: '24',
    number: '61',
    date: '2022',
    title: 'privind aprobarea „Regulamentului privind realizarea, repartizarea, închirierea, exploatarea şi administrarea locuinţelor sociale și de necesitate din Municipiul Salonta"',
    url: '#',
  },
  {
    id: '25',
    number: '60',
    date: '2022',
    title: 'privind aprobarea „Regulamentului de vânzare a locuinţelor de tip ANL"',
    url: '#',
  },
  {
    id: '26',
    number: '237',
    date: '27.10.2022',
    title: 'privind aprobarea organizării a unei noi sesiuni de licitaţie publică deschisă cu strigare a loturilor din păşunea permanentă situată în Municipiul Salonta',
    republishedThrough: 'Republicată conform HCLMS nr.293/21.12.2022',
    url: '#',
  },
  {
    id: '27',
    number: '182',
    date: '2022',
    title: 'privind aprobarea indicatorilor tehnico-economici actualizați și a devizului general actualizat pentru obiectivul de investiții „Modernizare 10 străzi"',
    attachments: [
      { label: 'Anexa nr. 1', url: '#' },
      { label: 'Anexa nr. 2', url: '#' },
    ],
    url: '#',
  },
  {
    id: '28',
    number: '111',
    date: '2022',
    title: 'privind aprobarea proiectului „Asigurarea infrastructurii pentru transportul verde prin amenajarea pistelor pentru biciclete"',
    attachments: [{ label: 'Anexă', url: '#' }],
    url: '#',
  },
  {
    id: '29',
    number: '11',
    date: '2022',
    title: 'privind aprobarea Planului de analiză şi acoperire a riscurilor (PAAR)',
    attachments: [{ label: 'Anexa nr. 3', url: '#' }],
    url: '#',
  },
  {
    id: '30',
    number: '84',
    date: '2022',
    title: 'privind proiectul „Cresterea eficientei energetice"',
    attachments: [{ label: 'Anexă', url: '#' }],
    url: '#',
  },
  {
    id: '31',
    number: '152',
    date: '2022',
    title: 'PAD-uri str. Lăutarilor (stație apă)',
    url: '#',
  },
  {
    id: '32',
    number: '76',
    date: '2022',
    title: 'Proiect nr. 5 (blocuri)',
    attachments: [{ label: 'Anexă republicată', url: '#' }],
    url: '#',
  },
  {
    id: '33',
    number: '75',
    date: '2022',
    title: 'Proiect nr. 4 (blocuri)',
    attachments: [{ label: 'Anexă republicată', url: '#' }],
    url: '#',
  },
  {
    id: '34',
    number: '74',
    date: '2022',
    title: 'Proiect nr. 3 (blocuri)',
    attachments: [{ label: 'Anexă republicată', url: '#' }],
    url: '#',
  },
  {
    id: '35',
    number: '73',
    date: '2022',
    title: 'Proiect nr. 2 (blocuri)',
    attachments: [{ label: 'Anexă republicată', url: '#' }],
    url: '#',
  },
  {
    id: '36',
    number: '72',
    date: '2022',
    title: 'Proiect nr. 1 (blocuri)',
    attachments: [{ label: 'Anexă republicată', url: '#' }],
    url: '#',
  },
  {
    id: '37',
    number: '247',
    date: '2021',
    title: 'SF Spital',
    attachments: [{ label: 'Anexă', url: '#' }],
    url: '#',
  },
  {
    id: '38',
    number: '99',
    date: '2020',
    title: 'ROF și ROI Complexul Muzeal „Arany János"',
    attachments: [
      { label: 'Anexă – ROF Muzeu rectificativ', url: '#' },
      { label: 'Anexă – ROI Muzeu rectificativ', url: '#' },
    ],
    url: '#',
  },
  {
    id: '39',
    number: '163',
    date: '30.09.2021',
    title: 'Hotărârea nr. 163 din 30.09.2021',
    url: '#',
  },
  {
    id: '40',
    number: '192',
    date: '2021',
    title: 'Anghel Saligny - 10 străzi',
    attachments: [{ label: 'Anexă', url: '#' }],
    url: '#',
  },
  {
    id: '41',
    number: '191',
    date: '2021',
    title: 'Anghel Saligny - 11 străzi',
    attachments: [{ label: 'Anexă', url: '#' }],
    url: '#',
  },
  {
    id: '42',
    number: '177',
    date: '2021',
    title: 'predare MDLPA prin CNI – amplasament construire Creșa mică',
    url: '#',
  },
  {
    id: '43',
    number: '175',
    date: '2021',
    title: 'Program eficienta energetica – iluminat public',
    url: '#',
  },
  {
    id: '44',
    number: '169',
    date: '2021',
    title: 'reprezentanti CA unitati invatamant 2021-2022',
    url: '#',
  },
  {
    id: '45',
    number: '15',
    date: '2020',
    title: 'Aprobare PT+Deviz – Centru de Zi Bătrânii Comunității Salonta',
    url: '#',
  },
  {
    id: '46',
    number: '112',
    date: '2020',
    title: 'Statiune turistica',
    url: '#',
  },
  {
    id: '47',
    number: '56',
    date: '2020',
    title: 'stabilirea modalităților de acordare a unor ajutoare de urgență',
    url: '#',
  },
  {
    id: '48',
    number: '154',
    date: '2009',
    title: 'privind realizarea investiției: „Blocuri pt. tineret în regim de închiriere, realizate prin ANL, strada Puşkin – 60 apartamente – P+3E, Salonta"',
    url: '#',
  },
  {
    id: '49',
    number: '113',
    date: '2019',
    title: 'schimbare destinaţie unitate de învăţământ',
    url: '#',
  },
  {
    id: '50',
    number: '147',
    date: '2019',
    title: 'Reabilitare si modernizare DJ795 Salonta – Tinca, drept administrare CJ Bihor',
    attachments: [{ label: 'Anexă', url: '#' }],
    url: '#',
  },
  {
    id: '51',
    number: '57',
    date: '2019',
    title: 'Hotărârea nr. 57/2019 (2)',
    url: '#',
  },
  {
    id: '52',
    number: '120',
    date: '2019',
    title: 'cofinanțare locuințe sociale',
    attachments: [{ label: 'Anexă', url: '#' }],
    url: '#',
  },
  {
    id: '53',
    number: '58',
    date: '2019',
    title: 'schimbare destinaţie unitate de învăţământ',
    url: '#',
  },
  {
    id: '54',
    number: '57',
    date: '2019',
    title: 'Hotărârea nr. 57/2019',
    url: '#',
  },
];

function DecisionCard({ decision }: { decision: RepublishedDecision }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex flex-col gap-3">
          {/* Header with number and date */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-primary-700" />
              </div>
              <div>
                <span className="font-bold text-primary-700">
                  HCLMS nr. {decision.number}
                </span>
                <span className="text-gray-500 text-sm ml-2">
                  din {decision.date}
                </span>
              </div>
            </div>
            <a
              href={decision.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors shrink-0"
            >
              <Download className="w-4 h-4" />
              Descarcă
            </a>
          </div>

          {/* Title */}
          <p className="text-gray-700 text-sm leading-relaxed">
            {decision.title}
          </p>

          {/* Republished through info */}
          {decision.republishedThrough && (
            <p className="text-sm text-amber-700 bg-amber-50 px-3 py-1.5 rounded-md inline-block">
              {decision.republishedThrough}
            </p>
          )}

          {/* Attachments */}
          {decision.attachments && decision.attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
              {decision.attachments.map((attachment, idx) => (
                <a
                  key={idx}
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
                >
                  <Download className="w-3 h-3" />
                  {attachment.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function HotarariRepublicatePage() {
  const t = useTranslations('navigation');
  const th = useTranslations('hotarariRepublicatePage');

  return (
    <>
      <Breadcrumbs
        items={[
          { label: t('consiliulLocal'), href: '/consiliul-local' },
          { label: t('hotarariRepublicate') },
        ]}
      />
      <PageHeader titleKey="hotarariRepublicate" icon="fileStack" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-600 mb-8 text-center">
              {th('description')}
            </p>

            <div className="space-y-4">
              {REPUBLISHED_DECISIONS.map((decision) => (
                <DecisionCard key={decision.id} decision={decision} />
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
