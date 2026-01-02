import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Newspaper, FileText, Download, ExternalLink } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import Link from 'next/link';
import { generatePageMetadata, BreadcrumbJsonLd } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'buletinInformativ',
    locale: locale as Locale,
    path: '/transparenta/buletin-informativ',
  });
}

// Buletine informative pentru punctul b)
const BULETINE = [
  { date: 'Septembrie 2025', url: '#' },
  { date: 'Martie 2025', url: '#' },
  { date: 'Septembrie 2024', url: '#' },
  { date: 'Martie 2024', url: '#' },
  { date: 'Septembrie 2023', url: '#' },
  { date: 'Martie 2023', url: '#' },
  { date: '30 Septembrie 2022', url: '#' },
  { date: 'Martie 2022', url: '#' },
  { date: 'Septembrie 2021', url: '#' },
  { date: '31 Martie 2021', url: '#' },
  { date: '30 Septembrie 2020', url: '#' },
  { date: 'Martie 2020', url: '#' },
  { date: 'Septembrie 2019', url: '#' },
  { date: '31.03.2019', url: '#' },
];

export default function BuletinInformativPage() {
  const t = useTranslations('navigation');
  const tb = useTranslations('buletinPage');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('transparenta'), href: '/transparenta' },
        { label: t('buletinInformativ') }
      ]} />
      <PageHeader titleKey="buletinInformativ" icon="newspaper" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="space-y-6">

              {/* a) Acte normative */}
              <Card>
                <CardContent className="py-5">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center shrink-0 font-bold text-sm">
                      a
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium mb-3">
                        {tb('sectionA')}
                      </p>
                      <a
                        href="https://legislatie.just.ro/Public/DetaliiDocument/215925"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-800 text-sm"
                      >
                        <FileText className="w-4 h-4" />
                        OUG nr. 57/2019 privind Codul administrativ
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* b) Structura organizatorică + Buletine */}
              <Card>
                <CardContent className="py-5">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center shrink-0 font-bold text-sm">
                      b
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium mb-4">
                        {tb('sectionB')}
                      </p>
                      <div className="space-y-2">
                        {BULETINE.map((buletin, idx) => (
                          <a
                            key={idx}
                            href={buletin.url}
                            className="flex items-center gap-2 text-primary-600 hover:text-primary-800 text-sm py-1 group"
                          >
                            <Download className="w-4 h-4 text-gray-400 group-hover:text-primary-600" />
                            <span>{tb('bulletin')} – {buletin.date}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* c) Conducere */}
              <Card>
                <CardContent className="py-5">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center shrink-0 font-bold text-sm">
                      c
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium mb-2">
                        {tb('sectionC')}
                      </p>
                      <Link
                        href="/primaria/conducere"
                        className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-800 text-sm"
                      >
                        {tb('viewPage')}
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* d) Contact */}
              <Card>
                <CardContent className="py-5">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center shrink-0 font-bold text-sm">
                      d
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium mb-2">
                        {tb('sectionD')}
                      </p>
                      <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-800 text-sm"
                      >
                        {tb('viewPage')}
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* e) Audiențe */}
              <Card>
                <CardContent className="py-5">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center shrink-0 font-bold text-sm">
                      e
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium mb-2">
                        {tb('sectionE')}
                      </p>
                      <Link
                        href="/primaria/audiente"
                        className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-800 text-sm"
                      >
                        {tb('viewPage')}
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* f) Buget */}
              <Card>
                <CardContent className="py-5">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center shrink-0 font-bold text-sm">
                      f
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium mb-2">
                        {tb('sectionF')}
                      </p>
                      <Link
                        href="/transparenta/buget"
                        className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-800 text-sm"
                      >
                        {tb('viewPage')}
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* g) Programe și strategii */}
              <Card>
                <CardContent className="py-5">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center shrink-0 font-bold text-sm">
                      g
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium mb-2">
                        {tb('sectionG')}
                      </p>
                      <Link
                        href="/programe/strategia-de-dezvoltare"
                        className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-800 text-sm"
                      >
                        {tb('viewPage')}
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* h) Documente interes public */}
              <Card>
                <CardContent className="py-5">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center shrink-0 font-bold text-sm">
                      h
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium mb-3">
                        {tb('sectionH')}
                      </p>
                      <a
                        href="#"
                        className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-800 text-sm"
                      >
                        <Download className="w-4 h-4" />
                        Anexa A
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* i) Categorii documente */}
              <Card>
                <CardContent className="py-5">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center shrink-0 font-bold text-sm">
                      i
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium mb-3">
                        {tb('sectionI')}
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <a
                          href="#"
                          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-800 text-sm"
                        >
                          <Download className="w-4 h-4" />
                          Anexa B
                        </a>
                        <a
                          href="#"
                          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-800 text-sm"
                        >
                          <Download className="w-4 h-4" />
                          Anexa C
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* j) Contestare */}
              <Card>
                <CardContent className="py-5">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center shrink-0 font-bold text-sm">
                      j
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium mb-2">
                        {tb('sectionJ')}
                      </p>
                      <Link
                        href="/transparenta/generale"
                        className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-800 text-sm"
                      >
                        {tb('viewPage')}
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
