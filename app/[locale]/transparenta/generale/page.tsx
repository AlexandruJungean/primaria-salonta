import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { FileText, Download, ExternalLink, AlertCircle, CreditCard, BookOpen, FileCheck, Scale, Users, Info } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('generale') };
}

// These will be loaded from database later
const DISPOZITII = [
  {
    title: 'Dispoziția nr. 357/24.05.2023',
    description: 'Privind desemnarea doamnei Alb Ioana Simona, Șef serviciu APL – persoană responsabilă cu aplicarea prevederilor Legii nr. 361/2022, privind protecția avertizorilor în interes public și aprobarea Procedurii de sistem cod PS-20',
    url: '#',
  },
  {
    title: 'Dispoziția nr. 366/2022',
    description: 'Privind înlocuirea doamnei Caba Maria Florica cu doamna Alb Ioana Simona, ca responsabil în cadrul Primăriei Municipiului Salonta cu aplicarea prevederilor Legii nr. 52/2003',
    url: '#',
  },
  {
    title: 'Dispoziția nr. 365/2022',
    description: 'Privind înlocuirea doamnei Caba Maria Florica cu doamna Alb Ioana Simona, în Comisia de analiză privind încălcarea dreptului de acces la informațiile de interes public conform Legii nr. 544/2001',
    url: '#',
  },
  {
    title: 'Dispoziția nr. 107/2021',
    description: 'Privind înlocuirea d-nei Alb Ioana Simona pe perioada suspendării raportului de serviciu cu d-na Caba Maria Florica, ca responsabil cu aplicarea prevederilor Legii nr. 52/2003',
    url: '#',
  },
  {
    title: 'Dispoziție responsabili Legea 52/2003 și Legea 544/2001',
    description: 'Privind desemnarea responsabililor din cadrul Primăriei Salonta cu aplicarea prevederilor Legii nr. 52/2003 și a Legii nr. 544/2001',
    url: '#',
  },
];

const FORMULARE = [
  { title: 'Anexa 4 (cerere)', description: 'Cerere pentru solicitare informații de interes public', url: '#' },
  { title: 'Reclamație administrativă', description: 'Conform Legii 544/2001', url: '#' },
];

const RAPOARTE = [
  {
    year: '2024',
    items: [
      { title: 'Raport periodic de activitate pentru anul 2024', url: '#' },
      { title: 'Anexa 1 – venituri la 31 dec 2024', url: '#' },
      { title: 'Anexa 2 – cheltuieli la 31 dec 2024', url: '#' },
      { title: 'Anexa 3 – Contracte achiziții', url: '#' },
      { title: 'Raport anual privind transparența decizională pentru anul 2024', url: '#' },
      { title: 'Raport de evaluare a implementării Legii nr. 544/2001 pt. anul 2024', url: '#' },
    ],
  },
  {
    year: '2023',
    items: [
      { title: 'Raport MO 544', url: '#' },
      { title: 'Anexa 1 – venituri la 31 dec 2023', url: '#' },
      { title: 'Anexa 2 – cheltuieli la 31 dec 2023', url: '#' },
      { title: 'Anexa 3 – contracte achiziții 2023', url: '#' },
      { title: 'Raport anual privind transparența decizională pentru anul 2023', url: '#' },
      { title: 'Raport de evaluare a implementării Legii nr. 544/2001 pt. anul 2023', url: '#' },
    ],
  },
  {
    year: '2022',
    items: [
      { title: 'Raport de activitate anual privind implementării Legii nr. 544 pt. anul 2022', url: '#' },
      { title: 'Anexa 1 – venituri 2022', url: '#' },
      { title: 'Anexa 2 – cheltuieli 2022', url: '#' },
      { title: 'Anexa 3 – contracte achiziții 2022', url: '#' },
      { title: 'Raport anual privind transparența decizională pentru anul 2022', url: '#' },
      { title: 'Raport de evaluare a implementării Legii nr. 544/2001 pt. anul 2022', url: '#' },
    ],
  },
  {
    year: '2021',
    items: [
      { title: 'Raport anual privind transparența decizională pentru anul 2021', url: '#' },
      { title: 'Raport de evaluare a implementării Legii nr. 544 pt. anul 2021', url: '#' },
    ],
  },
  {
    year: '2020',
    items: [
      { title: 'Raport de evaluare a implementării Legii nr. 544 pt. anul 2020', url: '#' },
    ],
  },
  {
    year: '2019',
    items: [
      { title: 'Raport de evaluare a implementării Legii nr. 544 pt. anul 2019', url: '#' },
    ],
  },
  {
    year: '2018',
    items: [
      { title: 'Raport de evaluare a implementării Legii nr. 544/2001 în anul 2018', url: '#' },
      { title: 'Raport anual privind transparența decizională pentru anul 2018', url: '#' },
    ],
  },
  {
    year: '2017',
    items: [
      { title: 'Raport de evaluare a implementării Legii nr. 544/2001 în anul 2017', url: '#' },
      { title: 'Raport privind transparența decizională la nivelul Primăriei Municipiului Salonta pe anul 2017', url: '#' },
    ],
  },
  {
    year: '2016',
    items: [
      { title: 'Raport de evaluare a implementării Legii nr. 544/2001 în anul 2016', url: '#' },
      { title: 'Fișa de evaluare centralizată a implementării Legii nr. 544/2001 pentru anul 2016', url: '#' },
      { title: 'Raport privind transparența decizională la nivelul Primăriei Municipiului Salonta pe anul 2016', url: '#' },
    ],
  },
  {
    year: '2015',
    items: [
      { title: 'Raport privind transparența decizională la nivelul Primăriei municipiului Salonta – pentru anul 2015', url: '#' },
    ],
  },
  {
    year: '2014',
    items: [
      { title: 'Raport privind transparența decizională la nivelul Primăriei municipiului Salonta – pentru anul 2014', url: '#' },
    ],
  },
  {
    year: '2013',
    items: [
      { title: 'Raport privind transparența decizională la nivelul Primăriei municipiului Salonta – pentru anul 2013', url: '#' },
    ],
  },
];

export default function GeneralePage() {
  const t = useTranslations('navigation');
  const tg = useTranslations('generalePage');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('transparenta'), href: '/transparenta' },
        { label: t('generale') }
      ]} />
      <PageHeader titleKey="generale" icon="fileText" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto space-y-12">

            {/* Dispoziții Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <FileCheck className="w-7 h-7 text-primary-600" />
                {tg('dispozitiiTitle')}
              </h2>
              <div className="space-y-4">
                {DISPOZITII.map((doc, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-4 pb-4">
                      <a href={doc.url} className="group flex items-start gap-4">
                        <FileText className="w-5 h-5 text-primary-600 mt-1 shrink-0" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                            {doc.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                        </div>
                        <Download className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors shrink-0" />
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Cont pentru plăți Section */}
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-blue-600" />
                {tg('contPlatiTitle')}
              </h2>
              <p className="text-gray-700 mb-4">
                {tg('contPlatiDesc')}
              </p>
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <p className="font-mono text-lg font-semibold text-gray-900">RO76TREZ08321360250XXXXX</p>
                <p className="text-sm text-gray-600 mt-1">{tg('contPlatiDetails')}</p>
              </div>
            </div>

            {/* Formulare Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <BookOpen className="w-7 h-7 text-green-600" />
                {tg('formulareTitle')}
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {FORMULARE.map((form, index) => (
                  <a
                    key={index}
                    href={form.url}
                    className="group flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-primary-300 transition-all"
                  >
                    <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                      <Download className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {form.title}
                      </h3>
                      <p className="text-sm text-gray-500">{form.description}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Rapoarte Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <FileText className="w-7 h-7 text-orange-600" />
                {tg('rapoarteTitle')}
              </h2>
              <div className="space-y-6">
                {RAPOARTE.map((yearGroup) => (
                  <Card key={yearGroup.year}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-bold">
                          {yearGroup.year}
                        </span>
                        {tg('rapoarteAnuale')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {yearGroup.items.map((item, index) => (
                          <li key={index}>
                            <a
                              href={item.url}
                              className="group flex items-center gap-3 text-gray-700 hover:text-primary-600 transition-colors py-1"
                            >
                              <FileText className="w-4 h-4 text-gray-400 group-hover:text-primary-600 shrink-0" />
                              <span className="text-sm">{item.title}</span>
                              <Download className="w-3 h-3 text-gray-300 group-hover:text-primary-600 ml-auto shrink-0" />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Ghidul Cetățeanului Section */}
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Users className="w-7 h-7 text-primary-600" />
                {tg('ghidulCetateanului')}
              </h2>
              
              <div className="space-y-6 text-gray-700">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">{tg('ceLegea52Title')}</h3>
                  <p className="mb-3">{tg('ceLegea52Desc')}</p>
                  <ol className="list-decimal list-inside space-y-1 ml-4">
                    <li>{tg('ceLegea52Item1')}</li>
                    <li>{tg('ceLegea52Item2')}</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">{tg('cuiSeAdreseazaTitle')}</h3>
                  <p>{tg('cuiSeAdreseazaDesc')}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">{tg('cePresupuneTitle')}</h3>
                  <p className="mb-2">{tg('cePresupuneDesc1')}</p>
                  <p>{tg('cePresupuneDesc2')}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">{tg('avantajeTitle')}</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>{tg('avantajeItem1')}</li>
                    <li>{tg('avantajeItem2')}</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">{tg('proceduraTitle')}</h3>
                  <p className="mb-2">{tg('proceduraDesc1')}</p>
                  <p className="mb-2">{tg('proceduraDesc2')}</p>
                  <p>{tg('proceduraDesc3')}</p>
                </div>
              </div>
            </div>

            {/* Contestare decizii Section */}
            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Scale className="w-6 h-6 text-amber-600" />
                {tg('contestareTitle')}
              </h2>
              <p className="text-gray-700 mb-4">{tg('contestareDesc')}</p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-amber-700">1.</span>
                  <span>{tg('contestareItem1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-amber-700">2.</span>
                  <span>{tg('contestareItem2')}</span>
                </li>
              </ul>
              <p className="text-sm text-gray-600 mt-4">{tg('contestareNote')}</p>
            </div>

            {/* Link-uri utile Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <ExternalLink className="w-7 h-7 text-purple-600" />
                {tg('linkuriUtileTitle')}
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <a
                  href="https://www.protectia-consumatorilor.ro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-purple-300 transition-all"
                >
                  <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                    <ExternalLink className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                      ANPC
                    </h3>
                    <p className="text-sm text-gray-500">www.protectia-consumatorilor.ro</p>
                  </div>
                </a>
                <a
                  href="mailto:reclamatii@protectia-consumatorilor.ro"
                  className="group flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-purple-300 transition-all"
                >
                  <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                    <Info className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {tg('reclamatiiANPC')}
                    </h3>
                    <p className="text-sm text-gray-500">reclamatii@protectia-consumatorilor.ro</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Info Note */}
            <div className="flex items-start gap-4 bg-gray-100 rounded-xl p-6">
              <AlertCircle className="w-6 h-6 text-gray-500 shrink-0 mt-0.5" />
              <p className="text-sm text-gray-600">
                {tg('infoNote')}
              </p>
            </div>

          </div>
        </Container>
      </Section>
    </>
  );
}
