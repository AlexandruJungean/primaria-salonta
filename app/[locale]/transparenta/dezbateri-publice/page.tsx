import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { MessageSquare, Calendar, FileText, Download, Users, AlertCircle } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('dezbateriPublice') };
}

interface Attachment {
  title: string;
  url: string;
}

interface Debate {
  id: number;
  date: string;
  title: string;
  description?: string;
  attachments?: Attachment[];
}

// Dezbateri 2019
const DEBATES_2019: Debate[] = [
  {
    id: 1,
    date: '2019-04-15',
    title: 'Dezbatere publică privind Stabilirea nivelurilor pentru valorile impozabile, impozitele și taxele locale și alte asemenea taxe asimilate acestora, precum și amenzile aplicabile pentru anul 2020',
    attachments: [
      { title: 'Document dezbatere', url: '#' },
    ],
  },
  {
    id: 2,
    date: '2019-04-10',
    title: 'Dezbatere publică privind Programul Anual al Achizițiilor Publice 2019, actualizat',
    attachments: [
      { title: 'PAAP 2019 actualizat', url: '#' },
    ],
  },
  {
    id: 3,
    date: '2019-04-10',
    title: 'Dezbatere publică privind Aprobarea bugetului general consolidat pe anul 2019; respectiv actualizarea PAAP pentru anul 2019',
    attachments: [
      { title: 'Proiect buget 2019', url: '#' },
      { title: 'PAAP 2019', url: '#' },
    ],
  },
];

// Dezbateri 2018
const DEBATES_2018: Debate[] = [
  {
    id: 10,
    date: '2018-11-27',
    title: 'Anunț nr. 6505/6506/27.11.2018',
    description: 'Proiecte de hotărâre privind aprobarea taxelor pentru închirierea/concesionarea și ocuparea domeniului public și privat al mun. Salonta, pentru anul 2019',
    attachments: [
      { title: 'Proiect de hotărâre - închiriere/concesionare', url: '#' },
      { title: 'Proiect de hotărâre - ocupare domeniu public', url: '#' },
    ],
  },
  {
    id: 11,
    date: '2018-08-20',
    title: 'Dezbatere publică referitoare la Studiul privind impactul asupra mediului pentru proiectul „Înființare fermă zootehnică" – SC Abra Agrosuin SRL',
    attachments: [
      { title: 'Studiu de impact', url: '#' },
    ],
  },
  {
    id: 12,
    date: '2018-02-22',
    title: 'Dezbatere publică privind bugetul local pe anul 2018',
    attachments: [
      { title: 'Proiect buget 2018', url: '#' },
    ],
  },
];

// Arhivă 2016
const DEBATES_2016: Debate[] = [
  {
    id: 20,
    date: '2016-12-09',
    title: 'PV dezbatere publică din 09.12.2016 privind impozitele și taxele locale pentru anul 2017',
    attachments: [
      { title: 'Proces verbal', url: '#' },
    ],
  },
  {
    id: 21,
    date: '2016-07-11',
    title: 'PROCES-VERBAL nr. 5676/11.07.2016 privind desfășurarea lucrărilor comisiei desemnate prin HCLMS nr. 18/08.07.2016 de renegociere a tarifelor aferente serviciului de salubrizare',
    attachments: [
      { title: 'Proces verbal nr. 5676', url: '#' },
    ],
  },
  {
    id: 22,
    date: '2016-07-08',
    title: 'PROCES-VERBAL nr. 5620 din 08.07.2016 întocmit cu ocazia dezbaterii publice cu privire la: Modificarea tarifelor pentru activitățile specifice serviciului de salubrizare',
    description: 'Ca urmare a obligației transportării întregii cantități de deșeuri colectate de pe raza mun. Salonta și depozitarea acestora la depozitul ecologic din Oradea',
    attachments: [
      { title: 'Proces verbal nr. 5620', url: '#' },
    ],
  },
];

// Arhivă 2015
const DEBATES_2015: Debate[] = [
  {
    id: 30,
    date: '2015-09-25',
    title: 'Proces verbal întocmit la 25.09.2015, cu ocazia dezbaterii publice cu privire la: Studiul de fezabilitate și a indicatorilor tehnico-economici aferenți',
    description: 'Nr. 3361/06.05.2015, elaborat de SC Drum Proiect SRL Oradea, pentru Investiția: „Străpungere Str. Jean Kalvin"',
    attachments: [
      { title: 'Proces verbal 25.09.2015', url: '#' },
      { title: 'Studiu de fezabilitate', url: '#' },
    ],
  },
];

function DebateCard({ debate }: { debate: Debate }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 text-purple-700" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(debate.date).toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' })}
              </span>
            </div>
            <h3 className="font-medium text-gray-900 text-sm leading-snug mb-1">
              {debate.title}
            </h3>
            {debate.description && (
              <p className="text-sm text-gray-600 mb-2">{debate.description}</p>
            )}
            {debate.attachments && debate.attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {debate.attachments.map((att, idx) => (
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

function YearSection({ year, debates, isArchive = false }: { year: string; debates: Debate[]; isArchive?: boolean }) {
  const td = useTranslations('dezbateriPage');
  
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <span className={`${isArchive ? 'bg-gray-500' : 'bg-purple-600'} text-white px-4 py-2 rounded-full text-lg font-bold`}>
          {isArchive ? `${td('archive')} ${year}` : year}
        </span>
        <span className="text-gray-500 text-sm">
          {debates.length} {td('debates')}
        </span>
      </div>
      <div className="space-y-3">
        {debates.map((debate) => (
          <DebateCard key={debate.id} debate={debate} />
        ))}
      </div>
    </div>
  );
}

export default function DezbateriPublicePage() {
  const t = useTranslations('navigation');
  const td = useTranslations('dezbateriPage');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('transparenta'), href: '/transparenta' },
        { label: t('dezbateriPublice') }
      ]} />
      <PageHeader titleKey="dezbateriPublice" icon="messageSquare" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            {/* Intro */}
            <div className="bg-purple-50 rounded-2xl p-6 mb-8 border border-purple-100">
              <div className="flex items-start gap-4">
                <MessageSquare className="w-8 h-8 text-purple-600 shrink-0" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">{td('introTitle')}</h2>
                  <p className="text-gray-700">{td('introText')}</p>
                </div>
              </div>
            </div>

            {/* Recent Debates */}
            <YearSection year="2019" debates={DEBATES_2019} />
            <YearSection year="2018" debates={DEBATES_2018} />

            {/* Archive Section */}
            <div className="border-t border-gray-200 pt-8 mt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FileText className="w-6 h-6 text-gray-500" />
                {td('archiveTitle')}
              </h2>
              
              <YearSection year="2016" debates={DEBATES_2016} isArchive />
              <YearSection year="2015" debates={DEBATES_2015} isArchive />
            </div>

            {/* Info Note */}
            <div className="flex items-start gap-4 bg-gray-100 rounded-xl p-6 mt-8">
              <AlertCircle className="w-6 h-6 text-gray-500 shrink-0 mt-0.5" />
              <p className="text-sm text-gray-600">
                {td('infoNote')}
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
