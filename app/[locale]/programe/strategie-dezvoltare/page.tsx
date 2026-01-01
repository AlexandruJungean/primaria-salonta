'use client';

import { useTranslations } from 'next-intl';
import { FileText, Download, ExternalLink } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

// Types for strategy documents
interface Attachment {
  label: string;
  url: string;
}

interface StrategyDocument {
  id: string;
  title: string;
  description?: string;
  attachments?: Attachment[];
  url?: string;
}

// Mock data - will be replaced with database content
const STRATEGY_DOCUMENTS: StrategyDocument[] = [
  {
    id: '1',
    title: 'Strategia de Dezvoltare Locală pentru anii 2021-2027 – republicată',
    attachments: [
      { label: 'Decizia APM aferentă Strategiei de dezvoltare a Municipiului Salonta 2021-2027', url: '#' },
    ],
    url: '#',
  },
  {
    id: '2',
    title: 'Strategia municipiului Salonta pentru anii 2014-2020',
    attachments: [
      { label: 'Anexa 1', url: '#' },
    ],
    url: '#',
  },
];

function DocumentCard({ document }: { document: StrategyDocument }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6 text-primary-700" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 leading-tight">{document.title}</h3>
                {document.description && (
                  <p className="text-sm text-gray-600 mt-1">{document.description}</p>
                )}
              </div>
            </div>
            {document.url && (
              <a
                href={document.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors shrink-0"
              >
                <Download className="w-4 h-4" />
                Descarcă
              </a>
            )}
          </div>

          {/* Attachments */}
          {document.attachments && document.attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
              {document.attachments.map((attachment, idx) => (
                <a
                  key={idx}
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
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

export default function StrategieDezvoltarePage() {
  const t = useTranslations('navigation');
  const ts = useTranslations('strategiePage');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('programe'), href: '/programe' },
        { label: t('strategieDezvoltare') }
      ]} />
      <PageHeader titleKey="strategieDezvoltare" icon="target" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-600 mb-8 text-center">
              {ts('description')}
            </p>

            <div className="space-y-4">
              {STRATEGY_DOCUMENTS.map((document) => (
                <DocumentCard key={document.id} document={document} />
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
