'use client';

import { useTranslations } from 'next-intl';
import { FileSearch, Download, Calendar } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

// Types for studies
interface Study {
  id: string;
  title: string;
  date: string;
  description?: string;
  url: string;
}

// Mock data - will be replaced with database content
const STUDIES: Study[] = [
  {
    id: '1',
    title: 'Parcul Kölcsey – Studiu de fezabilitate',
    date: '30.03.2018',
    url: '#',
  },
];

function StudyCard({ study }: { study: Study }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
              <FileSearch className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{study.title}</h3>
              <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {study.date}
              </p>
              {study.description && (
                <p className="text-sm text-gray-600 mt-1">{study.description}</p>
              )}
            </div>
          </div>
          <a
            href={study.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors shrink-0"
          >
            <Download className="w-4 h-4" />
            Descarcă
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

export default function StudiiPage() {
  const t = useTranslations('navigation');
  const ts = useTranslations('studiiPage');

  return (
    <>
      <Breadcrumbs
        items={[
          { label: t('rapoarteStudii'), href: '/rapoarte-studii' },
          { label: t('studii') },
        ]}
      />
      <PageHeader titleKey="studii" icon="fileSearch" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-600 mb-8 text-center">
              {ts('description')}
            </p>

            {STUDIES.length > 0 ? (
              <div className="space-y-4">
                {STUDIES.map((study) => (
                  <StudyCard key={study.id} study={study} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                {ts('noStudies')}
              </div>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}

