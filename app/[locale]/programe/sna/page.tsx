'use client';

import { useTranslations } from 'next-intl';
import { Shield, Download, FileText, AlertTriangle, CheckCircle } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

// Types for SNA documents
interface SNADocument {
  id: string;
  title: string;
  description?: string;
  url: string;
}

// SNA 2021-2025 Documents
const SNA_2021_2025: SNADocument[] = [
  {
    id: '1',
    title: 'Dispoziția nr. 564/2023',
    description: 'înlocuirea d-lui Taussig László responsabil cu implementarea Planului de Integritate al Strategiei Naționale Anticorupție 2021-2025 la nivelul Primăriei Mun. Salonta, cu d-l Buda Adrian Călin',
    url: '#',
  },
  {
    id: '2',
    title: 'Dispoziția nr. 431/30.06.2023',
    description: 'privind desemnarea Consilierului de etică în cadrul Primăriei Mun. Salonta',
    url: '#',
  },
  {
    id: '3',
    title: 'Raport privind progresele și stadiul implementării SNA 2021-2025',
    description: 'la nivelul Municipiului Salonta în anul 2023',
    url: '#',
  },
  {
    id: '4',
    title: 'Metodologia de evaluare a incidentelor de integritate',
    description: 'produse la nivelul UAT Salonta',
    url: '#',
  },
  {
    id: '5',
    title: 'Dispoziția nr. 285/28.06.2022',
    description: 'privind aprobarea Planului de Integritate',
    url: '#',
  },
  {
    id: '6',
    title: 'Planul de integritate al Municipiului Salonta',
    url: '#',
  },
  {
    id: '7',
    title: 'Declarație privind asumarea agendei de integritate organizațională',
    url: '#',
  },
];

// SNA 2016-2020 Documents
const SNA_2016_2020: SNADocument[] = [
  {
    id: '1',
    title: 'Dispoziția nr. 504/2017',
    description: 'privind aprobarea Planului de acțiune sectorial al Primăriei Salonta pentru implementarea strategiei naționale anticorupție pe perioada 2016-2020',
    url: '#',
  },
  {
    id: '2',
    title: 'Dispoziția nr. 455/2017',
    description: 'privind actualizarea listei persoanelor responsabile cu implementarea SNA 2016-2020 în cadrul Primăriei Municipiului Salonta',
    url: '#',
  },
  {
    id: '3',
    title: 'Dispoziția nr. 331/2016',
    url: '#',
  },
  {
    id: '4',
    title: 'Declarația de aderare',
    url: '#',
  },
];

function DocumentItem({ doc }: { doc: SNADocument }) {
  return (
    <a
      href={doc.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
    >
      <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0 group-hover:bg-amber-200 transition-colors">
        <FileText className="w-4 h-4 text-amber-700" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
          {doc.title}
        </h4>
        {doc.description && (
          <p className="text-sm text-gray-500 mt-0.5">{doc.description}</p>
        )}
      </div>
      <Download className="w-4 h-4 text-gray-400 group-hover:text-primary-600 shrink-0 mt-1" />
    </a>
  );
}

export default function SNAPage() {
  const t = useTranslations('navigation');
  const ts = useTranslations('snaPage');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('programe'), href: '/programe' },
        { label: ts('title') }
      ]} />
      <PageHeader 
        titleKey="title" 
        namespace="snaPage"
        icon="shieldCheck" 
        descriptionKey="description"
      />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Info Banner */}
            <div className="mb-8 p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-3">
              <Shield className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                {ts('infoText')}
              </p>
            </div>

            {/* SNA 2021-2025 */}
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{ts('period2021_2025')}</CardTitle>
                    <p className="text-sm text-gray-500 mt-0.5">{ts('period2021_2025_subtitle')}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="divide-y divide-gray-100">
                  {SNA_2021_2025.map((doc) => (
                    <DocumentItem key={doc.id} doc={doc} />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* SNA 2016-2020 */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-gray-700">{ts('period2016_2020')}</CardTitle>
                    <p className="text-sm text-gray-400 mt-0.5">{ts('period2016_2020_subtitle')}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="divide-y divide-gray-100">
                  {SNA_2016_2020.map((doc) => (
                    <DocumentItem key={doc.id} doc={doc} />
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

