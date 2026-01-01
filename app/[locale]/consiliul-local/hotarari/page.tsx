'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Calendar, FileText, ChevronRight, Download, ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { Link } from '@/components/ui/link';

// Mock data - will be replaced with database content
const SESSIONS_WITH_DECISIONS = [
  {
    id: '2025-12-30',
    slug: '30-decembrie-2025',
    date: '30 decembrie 2025',
    shortDate: '30.12.2025',
    procesVerbalUrl: '#',
    decisions: [
      { number: 263, title: 'HCLMS nr. 263 din 30.12.2025' },
      { number: 262, title: 'HCLMS nr. 262 din 30.12.2025' },
    ],
    totalDecisions: 15,
  },
  {
    id: '2025-12-15',
    slug: '15-decembrie-2025',
    date: '15 decembrie 2025',
    shortDate: '15.12.2025',
    procesVerbalUrl: '#',
    decisions: [
      { number: 253, title: 'HCLMS nr. 253 din 15.12.2025' },
      { number: 252, title: 'HCLMS nr. 252 din 15.12.2025' },
    ],
    totalDecisions: 12,
  },
  {
    id: '2025-11-27',
    slug: '27-noiembrie-2025',
    date: '27 noiembrie 2025',
    shortDate: '27.11.2025',
    procesVerbalUrl: '#',
    decisions: [
      { number: 233, title: 'HCLMS nr. 233 din 27.11.2025' },
      { number: 232, title: 'HCLMS nr. 232 din 27.11.2025' },
    ],
    totalDecisions: 18,
  },
  {
    id: '2025-10-30',
    slug: '30-octombrie-2025',
    date: '30 octombrie 2025',
    shortDate: '30.10.2025',
    procesVerbalUrl: '#',
    decisions: [
      { number: 215, title: 'HCLMS nr. 215 din 30.10.2025' },
      { number: 214, title: 'HCLMS nr. 214 din 30.10.2025' },
    ],
    totalDecisions: 14,
  },
  {
    id: '2025-09-30',
    slug: '30-septembrie-2025',
    date: '30 septembrie 2025',
    shortDate: '30.09.2025',
    procesVerbalUrl: '#',
    decisions: [
      { number: 203, title: 'HCLMS nr. 203 din 30.09.2025' },
      { number: 202, title: 'HCLMS nr. 202 din 30.09.2025' },
    ],
    totalDecisions: 10,
  },
  {
    id: '2025-09-25',
    slug: '25-septembrie-2025',
    date: '25 septembrie 2025',
    shortDate: '25.09.2025',
    procesVerbalUrl: '#',
    decisions: [
      { number: 199, title: 'HCLMS nr. 199 din 25.09.2025' },
      { number: 198, title: 'HCLMS nr. 198 din 25.09.2025' },
    ],
    totalDecisions: 8,
  },
  {
    id: '2025-08-27',
    slug: '27-august-2025',
    date: '27 august 2025',
    shortDate: '27.08.2025',
    procesVerbalUrl: '#',
    decisions: [
      { number: 173, title: 'HCLMS nr. 173 din 27.08.2025' },
      { number: 172, title: 'HCLMS nr. 172 din 27.08.2025' },
    ],
    totalDecisions: 16,
  },
  {
    id: '2025-07-31',
    slug: '31-iulie-2025',
    date: '31 iulie 2025',
    shortDate: '31.07.2025',
    procesVerbalUrl: '#',
    decisions: [
      { number: 158, title: 'HCLMS nr. 158 din 31.07.2025' },
      { number: 157, title: 'HCLMS nr. 157 din 31.07.2025' },
    ],
    totalDecisions: 11,
  },
  {
    id: '2025-07-02',
    slug: '2-iulie-2025',
    date: '2 iulie 2025',
    shortDate: '02.07.2025',
    procesVerbalUrl: '#',
    decisions: [
      { number: 137, title: 'HCLMS nr. 137 din 02.07.2025' },
      { number: 136, title: 'HCLMS nr. 136 din 02.07.2025' },
    ],
    totalDecisions: 9,
  },
  {
    id: '2025-06-26',
    slug: '26-iunie-2025',
    date: '26 iunie 2025',
    shortDate: '26.06.2025',
    procesVerbalUrl: '#',
    decisions: [
      { number: 131, title: 'HCLMS nr. 131 din 26.06.2025' },
      { number: 130, title: 'HCLMS nr. 130 din 26.06.2025' },
    ],
    totalDecisions: 15,
  },
];

function SessionCard({ session }: { session: typeof SESSIONS_WITH_DECISIONS[0] }) {
  const t = useTranslations('hotarariPage');

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <Link
          href={`/consiliul-local/hotarari/${session.slug}`}
          className="block p-4 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                <Calendar className="w-6 h-6 text-primary-700" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-900 text-lg">{session.date}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {t('procesVerbal', { date: session.shortDate })}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {session.decisions.map((d) => d.title).join(' • ')} …
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-sm text-primary-700 font-medium hidden sm:block">
                {t('continueReading')}
              </span>
              <ArrowRight className="w-5 h-5 text-primary-600" />
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}

export default function HotarariPage() {
  const t = useTranslations('navigation');
  const th = useTranslations('hotarariPage');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('consiliulLocal'), href: '/consiliul-local' },
        { label: t('hotarari') }
      ]} />
      <PageHeader titleKey="hotarari" icon="gavel" />

      <Section background="white">
        <Container>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-gray-600 mb-8 text-center">
              {th('description')}
            </p>

            <div className="space-y-3">
              {SESSIONS_WITH_DECISIONS.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
