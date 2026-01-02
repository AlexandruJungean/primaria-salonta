import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Users, User, FileText, Download, ClipboardList } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { generatePageMetadata, BreadcrumbJsonLd } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'consilieri',
    locale: locale as Locale,
    path: '/consiliul-local/consilieri',
  });
}

// Mock data - will be replaced with database content
const DOCUMENTS = [
  {
    id: 1,
    title: 'Regulament de organizare şi funcţionare a Consiliului Local al Municipiului Salonta',
    subtitle: 'Aprobat prin Hotărârea Consiliului Local nr. 56 din 27.05.2021 – Republicat prin HCLMS nr. 7 din 23.01.2024',
    url: '#'
  },
  {
    id: 2,
    title: 'Minuta ședinței privind lucrările şedinţei de constituire a Consiliului Local al Municipiului Salonta din data 25.10.2024',
    url: '#'
  },
  {
    id: 3,
    title: 'Ordinul Prefectului nr. 583/25.10.2024 privind constatarea ca legal constituit a Consiliului Local al Municipiului Salonta',
    url: '#'
  },
];

// Councilors by party - mock data from database
const COUNCILORS_BY_PARTY = [
  {
    party: 'UDMR',
    color: 'bg-green-600',
    members: [
      'Blaj Cristian',
      'Bondár Zsolt',
      'Cseke Sándor',
      'Gáll Éva',
      'Horváth János',
      'Kiri Evelin',
      'Nan-Sajti Dániel',
      'Szabó Sándor',
      'Szász Dénes-Albert',
      'Szőke-Sorean Éva',
      'Tornai Melinda',
      'Vigh József',
    ]
  },
  {
    party: 'PSD',
    color: 'bg-red-600',
    members: ['Szatmari Adrian']
  },
  {
    party: 'PNL',
    color: 'bg-yellow-500',
    members: [
      'Galea Marcel-Ioan',
      'Manciu Valentin-Iulian',
      'Neaga Florica-Maria',
    ]
  },
  {
    party: 'USR',
    color: 'bg-blue-600',
    members: ['Sala Răzvan-Sergiu']
  },
];

const RESPONSIBILITIES = [
  'avizează sau aprobă, după caz, studii, prognoze și programe de dezvoltare economico-socială, de organizare și amenajare a teritoriului, documentații de amenajare a teritoriului și urbanism, inclusiv participarea la programe de dezvoltare județeană, regională, zonală și de cooperare transfrontalieră, în condițiile legii',
  'aprobă bugetul local, împrumuturile, virările de credite și modul de utilizare a rezervei bugetare; aprobă contul de încheiere a exercițiului bugetar; stabilește impozite și taxe locale, precum și taxe speciale, în condițiile legii',
  'administrează domeniul public și domeniul privat al comunei sau orașului',
  'hotărăște darea în administrare, concesionarea sau închirierea bunurilor proprietate publică a comunei sau orașului, după caz, precum și a serviciilor publice de interes local, în condițiile legii',
  'înființează instituții publice, societăți comerciale și servicii publice de interes local; urmărește, controlează și analizează activitatea acestora; instituie, cu respectarea criteriilor generale stabilite prin lege, norme de organizare și funcționare pentru instituțiile și serviciile publice de interes local',
  'hotărăște asupra înființării și reorganizării regiilor autonome de interes local; exercită, în numele unității administrativ-teritoriale, toate drepturile acționarului la societățile comerciale pe care le-a înființat',
  'analizează și aprobă, în condițiile legii, documentațiile de amenajare a teritoriului și urbanism ale localităților, stabilind mijloacele materiale și financiare necesare în vederea realizării acestora',
  'stabilește măsurile necesare pentru construirea, întreținerea și modernizarea drumurilor, podurilor, precum și a întregii infrastructuri aparținând căilor de comunicații de interes local',
  'aprobă, în limitele competențelor sale, documentațiile tehnico-economice pentru lucrările de investiții de interes local și asigură condițiile necesare în vederea realizării acestora',
  'contribuie la organizarea de activități științifice, culturale, artistice, sportive și de agrement',
  'acționează pentru protecția și refacerea mediului înconjurător, în scopul creșterii calității vieții; contribuie la protecția, conservarea, restaurarea și punerea în valoare a monumentelor istorice și de arhitectură, a parcurilor și rezervațiilor naturale',
  'asigură libertatea comerțului și încurajează libera inițiativă, în condițiile legii',
];

export default function ConsilieriPage() {
  const t = useTranslations('navigation');
  const tc = useTranslations('consilieriPage');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('consiliulLocal'), href: '/consiliul-local' },
        { label: t('consilieriLocali') }
      ]} />
      <PageHeader titleKey="consilieriLocali" icon="users" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">

            {/* First Document - Regulament */}
            <Card className="mb-6">
              <CardContent className="p-0">
                <div className="flex items-start justify-between p-4 gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center shrink-0 mt-1">
                      <FileText className="w-5 h-5 text-primary-700" />
                    </div>
                    <div>
                      <span className="font-medium text-gray-900 text-sm leading-snug block">
                        {DOCUMENTS[0].title}
                      </span>
                      <span className="text-xs text-gray-500 mt-1 block">
                        {DOCUMENTS[0].subtitle}
                      </span>
                    </div>
                  </div>
                  <a
                    href={DOCUMENTS[0].url}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-900 text-white rounded-lg hover:bg-primary-800 transition-colors text-sm font-medium shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    PDF
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Introduction Text */}
            <Card className="mb-6 bg-gray-50">
              <CardContent className="p-6">
                <p className="text-gray-700 leading-relaxed">
                  {tc('introduction')}
                </p>
              </CardContent>
            </Card>

            {/* Constitution Documents */}
            <div className="space-y-3 mb-8">
              {DOCUMENTS.slice(1).map((doc) => (
                <Card key={doc.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between p-4 gap-4">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5 text-gray-500" />
                        </div>
                        <span className="font-medium text-gray-900 text-sm leading-snug">
                          {doc.title}
                        </span>
                      </div>
                      <a
                        href={doc.url}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-900 text-white rounded-lg hover:bg-primary-800 transition-colors text-sm font-medium shrink-0"
                      >
                        <Download className="w-4 h-4" />
                        PDF
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Councilors by Party */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary-600" />
                  {tc('councilorsTitle')}
                </h2>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {COUNCILORS_BY_PARTY.map((group) => (
                    <div key={group.party} className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`w-4 h-4 rounded ${group.color}`}></div>
                        <h3 className="font-bold text-gray-900">{group.party}</h3>
                        <span className="text-xs text-gray-500">({group.members.length})</span>
                      </div>
                      <ul className="space-y-1.5">
                        {group.members.map((member, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                            <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            {member}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Main Responsibilities */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-primary-600" />
                  {tc('responsibilitiesTitle')}
                </h2>
                
                <ol className="space-y-3">
                  {RESPONSIBILITIES.map((resp, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-gray-600">
                      <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 font-semibold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      {resp}
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

          </div>
        </Container>
      </Section>
    </>
  );
}
