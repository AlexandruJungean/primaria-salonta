import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Megaphone, Calendar, FileText, Download, ChevronDown, ChevronUp, MapPin, Users, Building2, AlertCircle } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('anunturi') };
}

// Types for announcements
type AnnouncementType = 'consultare' | 'puz' | 'proiect' | 'general' | 'dezbatere';

interface Attachment {
  title: string;
  url: string;
}

interface Announcement {
  id: number;
  date: string;
  title: string;
  type: AnnouncementType;
  description?: string;
  attachments?: Attachment[];
}

// Sample data - will be loaded from database later
const ANNOUNCEMENTS_2025: Announcement[] = [
  {
    id: 1,
    date: '2025-12-23',
    title: 'Proiect de hotărâre nr. 196/2025 privind indexarea nivelurilor pentru valorile impozabile, impozitele și taxele locale, precum și amenzile aplicabile pentru anul 2026',
    type: 'consultare',
    attachments: [
      { title: 'Proiect HCL 196/2025', url: '#' },
    ],
  },
  {
    id: 2,
    date: '2025-12-23',
    title: 'Proiect de hotărâre nr. 197/23.12.2025 privind reducerea cu 30% a impozitului pentru mijloacele de transport hibride cu emisii de CO2 mai mici sau egale cu 50 g/Km',
    type: 'consultare',
    attachments: [
      { title: 'Proiect HCL 197/2025', url: '#' },
      { title: 'Referat de modificare', url: '#' },
    ],
  },
  {
    id: 3,
    date: '2025-12-02',
    title: 'Proiect de hotărâre nr. 181/02.12.2025 privind aprobarea Regulamentului de organizare și funcționare a Cimitirului din Municipiul Salonta',
    type: 'consultare',
    attachments: [
      { title: 'Proiect HCL 181/2025', url: '#' },
      { title: 'Referat completare taxe cimitir', url: '#' },
    ],
  },
  {
    id: 4,
    date: '2025-11-26',
    title: 'Anunț privind elaborare PUZ – „Schimbare de destinație din zonă de locuit prin dezvoltarea zonei comerciale" situată în Mun. Salonta',
    type: 'puz',
    attachments: [
      { title: 'Cerere Patovan', url: '#' },
      { title: 'Certificat de Urbanism', url: '#' },
      { title: 'Memoriu Oportunitate', url: '#' },
      { title: 'U01.PLAN DE ÎNCADRARE ÎN ZONĂ ȘI PUG', url: '#' },
      { title: 'U02.SITUAȚIA EXISTENTĂ', url: '#' },
      { title: 'U03.CONCEPTUL PROPUS', url: '#' },
    ],
  },
  {
    id: 5,
    date: '2025-11-13',
    title: 'Proiect de hotărâre nr. 167/13.11.2025 privind aprobarea Regulamentului pentru activitățile de dezinsecție, dezinfecție și deratizare',
    type: 'consultare',
  },
  {
    id: 6,
    date: '2025-11-12',
    title: 'Proiect de hotărâre nr. 165/12.11.2025 privind aprobarea Regulamentului privind stabilirea condițiilor de impunere a supraimpozitării pe clădirile și terenurile neîngrijite',
    type: 'consultare',
  },
  {
    id: 7,
    date: '2025-11-11',
    title: 'Proiect de hotărâre nr. 164/11.11.2025 privind aprobarea aplicării tarifelor locale pentru închiriere/concesionare domeniu public sau privat pentru anul 2026',
    type: 'consultare',
  },
  {
    id: 8,
    date: '2025-10-01',
    title: 'Primarul Municipiului Salonta își manifestă intenția de consultare a populației cu privire la stabilirea steagului localității',
    type: 'dezbatere',
    description: 'Se supun dezbaterii trei variante ale proiectului de steag',
  },
  {
    id: 9,
    date: '2025-07-29',
    title: 'Studiu de trafic și Studiu de însorire pentru PUZ – RECONVERSIE FUNCȚIONALĂ DIN ZONĂ INDUSTRIALĂ ÎN ZONĂ DE LOCUINȚE COLECTIVE',
    type: 'puz',
    attachments: [
      { title: 'Adresa Primăria Salonta', url: '#' },
      { title: 'Studii dezbatere PUZ', url: '#' },
      { title: 'Studiu însorire', url: '#' },
      { title: 'Studiu de trafic', url: '#' },
    ],
  },
  {
    id: 10,
    date: '2025-07-11',
    title: 'Minuta dezbaterii publice din data de 08.07.2025 cu privire la PUZ – pentru construire blocuri, amenajare parcare',
    type: 'dezbatere',
    attachments: [
      { title: 'Proces verbal', url: '#' },
    ],
  },
  {
    id: 11,
    date: '2025-07-01',
    title: 'Anunț privind elaborare PUZ – pentru construire blocuri, amenajare parcare și desființare construcții, str. Regele Ferdinand nr. 2',
    type: 'puz',
  },
  {
    id: 12,
    date: '2025-05-27',
    title: 'Proiect de hotărâre nr. 74/27.05.2025 privind indexarea nivelurilor pentru valorile impozabile, impozitele și taxele locale pentru anul 2026',
    type: 'consultare',
    attachments: [
      { title: 'Proiect HCL + Anexe', url: '#' },
    ],
  },
  {
    id: 13,
    date: '2025-05-20',
    title: 'Anunț PUZ – Construire locuințe sociale cu regim de înălțime P+3 în Municipiul Salonta',
    type: 'puz',
    attachments: [
      { title: 'Anunț', url: '#' },
      { title: 'MEMORIU DE PREZENTARE PUZ', url: '#' },
      { title: 'U01 PLAN DE ÎNCADRARE ÎN LOCALITATE', url: '#' },
      { title: 'U04 REGLEMENTĂRI URBANISTICE', url: '#' },
    ],
  },
  {
    id: 14,
    date: '2025-05-16',
    title: 'Procesul verbal și Minuta dezbaterii publice din data de 29.04.2025 cu privire la PUZ – RECONVERSIE FUNCȚIONALĂ',
    type: 'dezbatere',
    attachments: [
      { title: 'PV dezbatere publică', url: '#' },
      { title: 'Minută dezbatere PUZ', url: '#' },
    ],
  },
  {
    id: 15,
    date: '2025-04-22',
    title: 'Anunț PUZ: Reconversie funcțională din zonă industrială în zonă de locuințe colective și funcțiuni complementare',
    type: 'puz',
  },
  {
    id: 16,
    date: '2025-03-04',
    title: 'Anunț PUZ: Amenajare zonă de recreere urbană în municipiul Salonta, intersecție str. Octavian Goga cu str. Ștefan Octavian',
    type: 'puz',
    attachments: [
      { title: 'Anunț PUZ Mun. Salonta', url: '#' },
      { title: 'Certificat de Urbanism', url: '#' },
      { title: 'Partea scrisă', url: '#' },
      { title: 'Planșe', url: '#' },
    ],
  },
  {
    id: 17,
    date: '2025-03-04',
    title: 'Anunț PUZ: REGENERARE URBANĂ ÎN ZONA PIEȚEI LIBERTĂȚII PRIN REVITALIZARE URBANĂ',
    type: 'puz',
    attachments: [
      { title: 'Anunț PUZ', url: '#' },
      { title: 'Planșe A01-A08', url: '#' },
      { title: 'Avize (APM, AQUANOVA, DSP, ISU, etc.)', url: '#' },
      { title: 'Regulament Local de Urbanism', url: '#' },
    ],
  },
  {
    id: 18,
    date: '2025-02-28',
    title: 'Anunț PUZ: Reconversie funcțională din zonă industrială în zonă de locuințe colective, str. Mărășești nr. 5',
    type: 'puz',
    attachments: [
      { title: 'Anunț PUZ Cistan Comimpex', url: '#' },
      { title: 'Aviz oportunitate CJ', url: '#' },
      { title: 'Memoriu final', url: '#' },
      { title: 'Planșe', url: '#' },
    ],
  },
  {
    id: 19,
    date: '2025-02-28',
    title: 'PROIECT: PUZ construire blocuri, amenajare parcare și desființare construcții - S.C. CRISANA PRO CONSTRUCT S.A.',
    type: 'puz',
    attachments: [
      { title: 'Anunț PUZ', url: '#' },
      { title: 'Cerere', url: '#' },
      { title: 'CU 2024', url: '#' },
      { title: 'Partea scrisă', url: '#' },
      { title: 'Planșe U01-U03', url: '#' },
    ],
  },
  {
    id: 20,
    date: '2025-02-27',
    title: 'Proiect de hotărâre nr. 26/27.02.2025 privind actualizarea HCLMS nr. 116/2015 privind aprobarea Regulamentului de organizare a pășunatului',
    type: 'consultare',
  },
  {
    id: 21,
    date: '2025-02-03',
    title: 'Proiect de hotărâre nr. 14/03.02.2025 privind adoptarea Criteriilor cadru pt. stabilirea ordinii de prioritate în soluționarea cererilor de locuințe pentru tineri',
    type: 'consultare',
  },
];

const ANNOUNCEMENTS_2024: Announcement[] = [
  {
    id: 100,
    date: '2024-12-16',
    title: 'Proiect de hotărâre nr. 208/12.12.2024 privind Criteriile de acces în locuință și Criteriile de ierarhizare pentru locuințe ANL',
    type: 'consultare',
  },
  {
    id: 101,
    date: '2024-12-11',
    title: 'Proiect de hotărâre nr. 192/05.12.2024 privind aprobarea Regulamentul condițiilor în care se realizează accesul pe proprietatea publică sau privată',
    type: 'consultare',
  },
  {
    id: 102,
    date: '2024-12-09',
    title: 'Proiect de hotărâre nr. 190/03.12.2024 privind actualizarea delimitării zonelor de impozitare pentru anul 2025',
    type: 'consultare',
  },
  {
    id: 103,
    date: '2024-11-12',
    title: 'Proiect de hotărâre nr. 181/12.11.2024 privind aprobarea tarifelor locale pentru închiriere/concesionare pentru anul 2025',
    type: 'consultare',
  },
  {
    id: 104,
    date: '2024-10-14',
    title: 'Anunț PUZ: Apartamentare imobil în 5 apartamente și transformarea spațiilor rezidențiale în spații comerciale, str. Kulin György nr. 1',
    type: 'puz',
    attachments: [
      { title: 'Anunț PUZ', url: '#' },
      { title: 'Plan reglementări urbanistice', url: '#' },
      { title: 'Plan de încadrare', url: '#' },
      { title: 'Plan situație existentă', url: '#' },
    ],
  },
  {
    id: 105,
    date: '2024-08-20',
    title: 'Amenajare zonă de recreere urbană în mun. Salonta, nr. cad. 114775',
    type: 'consultare',
    attachments: [
      { title: 'Plan Urbanistic Zonal', url: '#' },
      { title: 'Proces verbal de predare-primire', url: '#' },
    ],
  },
  {
    id: 106,
    date: '2024-07-17',
    title: 'Anunț PUZ: PROFI ROM FOOD S.R.L. – etapa II',
    type: 'puz',
    attachments: [
      { title: 'Avize multiple (APM, DSP, Electrica, Poliție, etc.)', url: '#' },
      { title: 'Regulament Local de Urbanism', url: '#' },
    ],
  },
  {
    id: 107,
    date: '2024-07-09',
    title: 'Anunț PUZ: Introducere teren în intravilan, CF 103823 Salonta',
    type: 'puz',
    attachments: [
      { title: 'Partea scrisă', url: '#' },
      { title: 'Planșe U01-U03', url: '#' },
    ],
  },
  {
    id: 108,
    date: '2024-06-19',
    title: 'Proiect de hotărâre nr. 102/19.06.2024 privind indexarea nivelurilor pentru impozitele și taxele locale pentru anul 2025',
    type: 'consultare',
  },
  {
    id: 109,
    date: '2024-04-19',
    title: 'Proiect de hotărâre nr. 79/19.04.2024 privind aprobarea Regulamentului privind gestionarea deșeurilor rezultate din activitatea medicală',
    type: 'consultare',
  },
  {
    id: 110,
    date: '2024-03-05',
    title: 'Proiect de hotărâre nr. 44/05.03.2024 privind aprobarea actualizării Regulamentului taxei speciale de salubrizare',
    type: 'consultare',
  },
  {
    id: 111,
    date: '2024-02-09',
    title: 'Bugetul inițial general consolidat al Municipiului Salonta pe anul 2024',
    type: 'consultare',
  },
  {
    id: 112,
    date: '2024-01-12',
    title: 'Proiect de Hotărâre nr. 1/12.01.2024 privind aprobarea programului de acțiune comunitară pentru anul 2024',
    type: 'consultare',
  },
  {
    id: 113,
    date: '2024-01-11',
    title: 'Anunț PUZ: Parcelare teren pt. construire locuințe și reglementare drum acces',
    type: 'puz',
    attachments: [
      { title: 'Planșe U01-U05', url: '#' },
      { title: 'Avize', url: '#' },
    ],
  },
  {
    id: 114,
    date: '2024-01-11',
    title: 'Anunț PUZ: PROFI ROM FOOD S.R.L. – etapa I – Consultarea populației',
    type: 'puz',
    attachments: [
      { title: 'Avize multiple', url: '#' },
      { title: 'Memoriu Justificativ', url: '#' },
      { title: 'Planșe PL0-PL2', url: '#' },
      { title: 'Regulament Local de Urbanism', url: '#' },
    ],
  },
];

const ANNOUNCEMENTS_2023: Announcement[] = [
  {
    id: 200,
    date: '2023-12-20',
    title: 'Proiect de Hotărâre nr. 229/20.12.2023 privind aprobarea Planului de acțiune pentru serviciile sociale pentru anul 2024',
    type: 'consultare',
  },
  {
    id: 201,
    date: '2023-12-08',
    title: 'Proiect de Hotărâre nr. 211/08.12.2023 privind aprobarea completării Regulamentului de organizare a serviciului de parcare cu plată',
    type: 'consultare',
  },
  {
    id: 202,
    date: '2023-11-10',
    title: 'Proiect de Hotărâre nr. 190/20.11.2023 privind actualizarea Zonelor de impozitare pentru anul 2024',
    type: 'consultare',
  },
  {
    id: 203,
    date: '2023-11-10',
    title: 'Proiect de Hotărâre nr. 186/10.11.2023 privind aprobarea tarifelor locale pentru anul 2024',
    type: 'consultare',
  },
  {
    id: 204,
    date: '2023-11-07',
    title: 'PUZ: schimbare destinație casă de locuit și anexă în spațiu comercial, beneficiar Vlad Ecaterina',
    type: 'puz',
    attachments: [
      { title: 'Adresa PUZ', url: '#' },
      { title: 'Avize', url: '#' },
      { title: 'Planșe PDF', url: '#' },
      { title: 'RLU final', url: '#' },
    ],
  },
  {
    id: 205,
    date: '2023-10-19',
    title: 'Proiect de Hotărâre nr. 172/19.10.2023 privind aprobarea Regulamentului pentru gestionarea câinilor cu stăpân',
    type: 'consultare',
  },
  {
    id: 206,
    date: '2023-10-16',
    title: 'Proiect de Hotărâre nr. 163/16.10.2023 privind aprobarea Planului Strategic al municipiului Salonta 2023-2027',
    type: 'consultare',
  },
  {
    id: 207,
    date: '2023-10-12',
    title: 'Anunț PUZ: Construire halā producție, depozitare și birouri, str. Sarcadului nr. 16',
    type: 'puz',
  },
  {
    id: 208,
    date: '2023-10-03',
    title: 'Anunț PUZ: Extindere intravilan în vederea parcelării și construirii de locuințe, str. Emanoil Gojdu nr. 9',
    type: 'puz',
  },
  {
    id: 209,
    date: '2023-09-21',
    title: 'Proiect de Hotărâre nr. 148/20.09.2023 pentru acordarea facilităților la plata impozitului pentru clădirile utilizate pentru servicii sociale',
    type: 'consultare',
  },
  {
    id: 210,
    date: '2023-09-13',
    title: 'Proiect de Hotărâre nr. 147/13.09.2023 privind aprobarea Programului de Îmbunătățire a Eficienței Energetice',
    type: 'consultare',
  },
  {
    id: 211,
    date: '2023-08-29',
    title: 'Anunț PUZ: Construire locuințe sociale cu regim de înălțime P+3, nr. cad 11420',
    type: 'puz',
  },
  {
    id: 212,
    date: '2023-07-25',
    title: 'Anunț PUZ: Schimbare destinație casă de locuit și anexă în spațiu comercial',
    type: 'puz',
  },
  {
    id: 213,
    date: '2023-07-17',
    title: 'Proiect de Hotărâre nr. 131/17.07.2023 privind stabilirea tarifelor pentru Bazinul de înot',
    type: 'consultare',
  },
  {
    id: 214,
    date: '2023-06-28',
    title: 'Proiect de Hotărâre nr. 121/28.06.2023 privind modificarea PMUD 2017-2032',
    type: 'consultare',
  },
  {
    id: 215,
    date: '2023-05-26',
    title: 'Proiect de hotărâre nr. 85/25.04.2023, privind indexarea impozitelor și taxelor locale pentru anul 2024',
    type: 'consultare',
  },
  {
    id: 216,
    date: '2023-05-02',
    title: 'Proiect de Hotărâre nr. 91/02.05.2023 privind modificarea Strategiei de Dezvoltare Locală 2021-2027',
    type: 'consultare',
  },
  {
    id: 217,
    date: '2023-03-22',
    title: 'Anunț PUZ: Construire halā de producție, depozitare și birouri administrative',
    type: 'puz',
  },
  {
    id: 218,
    date: '2023-01-13',
    title: 'Raportul de specialitate și Proiectul de buget al municipiului Salonta pe anul 2023',
    type: 'consultare',
  },
];

const TYPE_CONFIG: Record<AnnouncementType, { label: string; icon: React.ElementType; color: string; bgColor: string }> = {
  consultare: { label: 'Consultare publică', icon: Users, color: 'text-blue-700', bgColor: 'bg-blue-100' },
  puz: { label: 'Anunț PUZ', icon: MapPin, color: 'text-green-700', bgColor: 'bg-green-100' },
  proiect: { label: 'Proiect HCL', icon: FileText, color: 'text-purple-700', bgColor: 'bg-purple-100' },
  general: { label: 'Anunț general', icon: Megaphone, color: 'text-gray-700', bgColor: 'bg-gray-100' },
  dezbatere: { label: 'Dezbatere publică', icon: Users, color: 'text-orange-700', bgColor: 'bg-orange-100' },
};

function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  const config = TYPE_CONFIG[announcement.type];
  const Icon = config.icon;
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-lg ${config.bgColor} flex items-center justify-center shrink-0`}>
            <Icon className={`w-5 h-5 ${config.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.bgColor} ${config.color}`}>
                {config.label}
              </span>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(announcement.date).toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' })}
              </span>
            </div>
            <h3 className="font-medium text-gray-900 text-sm leading-snug mb-2">
              {announcement.title}
            </h3>
            {announcement.description && (
              <p className="text-sm text-gray-600 mb-2">{announcement.description}</p>
            )}
            {announcement.attachments && announcement.attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {announcement.attachments.map((att, idx) => (
                  <a
                    key={idx}
                    href={att.url}
                    className="inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-800 bg-primary-50 hover:bg-primary-100 px-2 py-1 rounded transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    {att.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function YearSection({ year, announcements }: { year: string; announcements: Announcement[] }) {
  const ta = useTranslations('anunturiPage');
  
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-primary-600 text-white px-4 py-2 rounded-full text-lg font-bold">
          {year}
        </span>
        <span className="text-gray-500 text-sm">
          {announcements.length} {ta('announcements')}
        </span>
      </div>
      <div className="space-y-3">
        {announcements.map((ann) => (
          <AnnouncementCard key={ann.id} announcement={ann} />
        ))}
      </div>
    </div>
  );
}

export default function AnunturiPage() {
  const t = useTranslations('navigation');
  const ta = useTranslations('anunturiPage');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('transparenta'), href: '/transparenta' },
        { label: t('anunturi') }
      ]} />
      <PageHeader titleKey="anunturi" icon="megaphone" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            {/* Legend */}
            <div className="bg-gray-50 rounded-xl p-4 mb-8">
              <h3 className="font-semibold text-gray-900 mb-3">{ta('legend')}</h3>
              <div className="flex flex-wrap gap-4">
                {Object.entries(TYPE_CONFIG).map(([key, config]) => {
                  const Icon = config.icon;
                  return (
                    <div key={key} className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded ${config.bgColor} flex items-center justify-center`}>
                        <Icon className={`w-3 h-3 ${config.color}`} />
                      </div>
                      <span className="text-sm text-gray-600">{config.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Announcements by Year */}
            <YearSection year="2025" announcements={ANNOUNCEMENTS_2025} />
            <YearSection year="2024" announcements={ANNOUNCEMENTS_2024} />
            <YearSection year="2023" announcements={ANNOUNCEMENTS_2023} />

            {/* Info Note */}
            <div className="flex items-start gap-4 bg-amber-50 border border-amber-200 rounded-xl p-6 mt-8">
              <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-amber-800 font-medium mb-1">{ta('archiveNote')}</p>
                <p className="text-sm text-amber-700">
                  {ta('archiveNoteDesc')}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
