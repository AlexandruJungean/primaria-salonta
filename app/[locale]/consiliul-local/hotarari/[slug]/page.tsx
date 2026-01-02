import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Calendar, FileText, Download, ArrowLeft, Gavel } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { Link } from '@/components/ui/link';
import { notFound } from 'next/navigation';
import { generatePageMetadata, BreadcrumbJsonLd } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';

// Mock data - will be replaced with database content
const SESSIONS_DATA: Record<string, {
  id: string;
  date: string;
  shortDate: string;
  procesVerbalUrl: string;
  decisions: Array<{ number: number; url: string }>;
}> = {
  '30-decembrie-2025': {
    id: '2025-12-30',
    date: '30 decembrie 2025',
    shortDate: '30.12.2025',
    procesVerbalUrl: '#',
    decisions: [
      { number: 263, url: '#' },
      { number: 262, url: '#' },
      { number: 261, url: '#' },
      { number: 260, url: '#' },
      { number: 259, url: '#' },
      { number: 258, url: '#' },
      { number: 257, url: '#' },
      { number: 256, url: '#' },
      { number: 255, url: '#' },
      { number: 254, url: '#' },
    ],
  },
  '15-decembrie-2025': {
    id: '2025-12-15',
    date: '15 decembrie 2025',
    shortDate: '15.12.2025',
    procesVerbalUrl: '#',
    decisions: [
      { number: 253, url: '#' },
      { number: 252, url: '#' },
      { number: 251, url: '#' },
      { number: 250, url: '#' },
      { number: 249, url: '#' },
      { number: 248, url: '#' },
      { number: 247, url: '#' },
      { number: 246, url: '#' },
    ],
  },
  '27-noiembrie-2025': {
    id: '2025-11-27',
    date: '27 noiembrie 2025',
    shortDate: '27.11.2025',
    procesVerbalUrl: '#',
    decisions: [
      { number: 233, url: '#' },
      { number: 232, url: '#' },
      { number: 231, url: '#' },
      { number: 230, url: '#' },
      { number: 229, url: '#' },
      { number: 228, url: '#' },
      { number: 227, url: '#' },
      { number: 226, url: '#' },
      { number: 225, url: '#' },
      { number: 224, url: '#' },
      { number: 223, url: '#' },
      { number: 222, url: '#' },
    ],
  },
  '30-octombrie-2025': {
    id: '2025-10-30',
    date: '30 octombrie 2025',
    shortDate: '30.10.2025',
    procesVerbalUrl: '#',
    decisions: [
      { number: 215, url: '#' },
      { number: 214, url: '#' },
      { number: 213, url: '#' },
      { number: 212, url: '#' },
      { number: 211, url: '#' },
      { number: 210, url: '#' },
      { number: 209, url: '#' },
      { number: 208, url: '#' },
    ],
  },
  '30-septembrie-2025': {
    id: '2025-09-30',
    date: '30 septembrie 2025',
    shortDate: '30.09.2025',
    procesVerbalUrl: '#',
    decisions: [
      { number: 203, url: '#' },
      { number: 202, url: '#' },
      { number: 201, url: '#' },
      { number: 200, url: '#' },
    ],
  },
  '25-septembrie-2025': {
    id: '2025-09-25',
    date: '25 septembrie 2025',
    shortDate: '25.09.2025',
    procesVerbalUrl: '#',
    decisions: [
      { number: 199, url: '#' },
      { number: 198, url: '#' },
      { number: 197, url: '#' },
      { number: 196, url: '#' },
    ],
  },
  '27-august-2025': {
    id: '2025-08-27',
    date: '27 august 2025',
    shortDate: '27.08.2025',
    procesVerbalUrl: '#',
    decisions: [
      { number: 173, url: '#' },
      { number: 172, url: '#' },
      { number: 171, url: '#' },
      { number: 170, url: '#' },
      { number: 169, url: '#' },
      { number: 168, url: '#' },
      { number: 167, url: '#' },
      { number: 166, url: '#' },
      { number: 165, url: '#' },
    ],
  },
  '31-iulie-2025': {
    id: '2025-07-31',
    date: '31 iulie 2025',
    shortDate: '31.07.2025',
    procesVerbalUrl: '#',
    decisions: [
      { number: 158, url: '#' },
      { number: 157, url: '#' },
      { number: 156, url: '#' },
      { number: 155, url: '#' },
      { number: 154, url: '#' },
      { number: 153, url: '#' },
    ],
  },
  '2-iulie-2025': {
    id: '2025-07-02',
    date: '2 iulie 2025',
    shortDate: '02.07.2025',
    procesVerbalUrl: '#',
    decisions: [
      { number: 137, url: '#' },
      { number: 136, url: '#' },
      { number: 135, url: '#' },
      { number: 134, url: '#' },
      { number: 133, url: '#' },
    ],
  },
  '26-iunie-2025': {
    id: '2025-06-26',
    date: '26 iunie 2025',
    shortDate: '26.06.2025',
    procesVerbalUrl: '#',
    decisions: [
      { number: 131, url: '#' },
      { number: 130, url: '#' },
      { number: 129, url: '#' },
      { number: 128, url: '#' },
      { number: 127, url: '#' },
      { number: 126, url: '#' },
      { number: 125, url: '#' },
      { number: 124, url: '#' },
      { number: 123, url: '#' },
      { number: 122, url: '#' },
      { number: 121, url: '#' },
      { number: 120, url: '#' },
      { number: 119, url: '#' },
      { number: 118, url: '#' },
      { number: 117, url: '#' },
    ],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const session = SESSIONS_DATA[slug];
  
  if (!session) {
    return generatePageMetadata({
      pageKey: 'hotarari',
      locale: locale as Locale,
      path: '/consiliul-local/hotarari',
    });
  }

  return generatePageMetadata({
    pageKey: 'hotarari',
    locale: locale as Locale,
    path: `/consiliul-local/hotarari/${slug}`,
    customTitle: `Hotărâri Consiliul Local - ${session.date}`,
    customDescription: `Hotărârile Consiliului Local din ședința din ${session.date}`,
  });
}

export async function generateStaticParams() {
  return Object.keys(SESSIONS_DATA).map((slug) => ({ slug }));
}

function DecisionsList({ session }: { session: typeof SESSIONS_DATA[string] }) {
  const t = useTranslations('hotarariPage');

  return (
    <div className="space-y-6">
      {/* Session Header */}
      <div className="flex items-center gap-4 p-4 bg-primary-50 rounded-xl border border-primary-100">
        <div className="w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
          <Calendar className="w-7 h-7 text-primary-700" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-primary-900">{session.date}</h2>
          <p className="text-sm text-primary-700 mt-0.5">
            {t('sessionDecisions')}
          </p>
        </div>
      </div>

      {/* Proces Verbal */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <h3 className="font-semibold text-amber-900">
                  {t('procesVerbalTitle', { date: session.shortDate })}
                </h3>
                <p className="text-sm text-amber-700">{t('procesVerbalDesc')}</p>
              </div>
            </div>
            <a
              href={session.procesVerbalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium text-sm shrink-0"
            >
              <Download className="w-4 h-4" />
              {t('download')}
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Decisions List */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
          <Gavel className="w-5 h-5 text-primary-600" />
          {t('decisionsTitle')} ({session.decisions.length})
        </h3>
        
        <div className="grid gap-2">
          {session.decisions.map((decision) => (
            <a
              key={decision.number}
              href={decision.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-gray-100 group-hover:bg-primary-100 flex items-center justify-center transition-colors">
                  <FileText className="w-4 h-4 text-gray-500 group-hover:text-primary-600" />
                </div>
                <span className="font-medium text-gray-700 group-hover:text-primary-700">
                  HCLMS nr. {decision.number} din {session.shortDate}
                </span>
              </div>
              <Download className="w-4 h-4 text-gray-400 group-hover:text-primary-600" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function HotarariDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = SESSIONS_DATA[slug];

  if (!session) {
    notFound();
  }

  return <HotarariDetailContent session={session} />;
}

function HotarariDetailContent({ session }: { session: typeof SESSIONS_DATA[string] }) {
  const t = useTranslations('navigation');
  const th = useTranslations('hotarariPage');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('consiliulLocal'), href: '/consiliul-local' },
        { label: t('hotarari'), href: '/consiliul-local/hotarari' },
        { label: session.date }
      ]} />
      
      <PageHeader 
        titleKey="hotarari" 
        icon="gavel"
        subtitle={session.date}
      />

      <Section background="white">
        <Container>
          <div className="max-w-3xl mx-auto">
            {/* Back Link */}
            <Link
              href="/consiliul-local/hotarari"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-800 font-medium mb-6 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              {th('backToList')}
            </Link>

            <DecisionsList session={session} />
          </div>
        </Container>
      </Section>
    </>
  );
}

