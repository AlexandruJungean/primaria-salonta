'use client';

import { useTranslations } from 'next-intl';
import { FileText, Download, ShieldCheck } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

// Types for audit reports
interface AuditReport {
  id: string;
  title: string;
  year?: string;
  period?: string;
  url: string;
}

// Mock data - will be replaced with database content
const AUDIT_REPORTS: AuditReport[] = [
  {
    id: '1',
    title: 'Raportul de audit realizat de Curtea de Conturi pentru anul 2022',
    year: '2022',
    url: '#',
  },
  {
    id: '2',
    title: 'Audit financiar pe anul 2021',
    year: '2021',
    url: '#',
  },
  {
    id: '3',
    title: 'Audit al performanței pe perioada 2018-2020',
    period: '2018-2020',
    url: '#',
  },
  {
    id: '4',
    title: 'Audit financiar pe anul 2019',
    year: '2019',
    url: '#',
  },
  {
    id: '5',
    title: 'Raportul de audit realizat de Curtea de Conturi (2016)',
    year: '2016',
    url: '#',
  },
  {
    id: '6',
    title: 'Raportul de audit realizat de Curtea de Conturi (2014)',
    year: '2014',
    url: '#',
  },
];

function ReportCard({ report }: { report: AuditReport }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-primary-700" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{report.title}</h3>
              {(report.year || report.period) && (
                <p className="text-sm text-gray-500 mt-0.5">
                  {report.year ? `Anul ${report.year}` : `Perioada ${report.period}`}
                </p>
              )}
            </div>
          </div>
          <a
            href={report.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors shrink-0"
          >
            <Download className="w-4 h-4" />
            Descarcă
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

export default function RapoartePage() {
  const t = useTranslations('navigation');
  const tr = useTranslations('rapoarteAuditPage');

  return (
    <>
      <Breadcrumbs
        items={[
          { label: t('rapoarteStudii'), href: '/rapoarte-studii' },
          { label: t('rapoarteAudit') },
        ]}
      />
      <PageHeader titleKey="rapoarteAudit" icon="shieldCheck" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-600 mb-8 text-center">
              {tr('description')}
            </p>

            {/* Info box */}
            <div className="mb-8 p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <p className="text-sm text-blue-800">
                {tr('infoText')}
              </p>
            </div>

            <div className="space-y-4">
              {AUDIT_REPORTS.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

