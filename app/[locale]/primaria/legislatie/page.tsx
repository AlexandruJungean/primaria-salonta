import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Scale, ExternalLink } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('legislatie') };
}

export default function LegislatiePage() {
  const t = useTranslations('navigation');
  const tl = useTranslations('legislatiePage');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('primaria'), href: '/primaria' },
        { label: t('legislatie') }
      ]} />
      <PageHeader titleKey="legislatie" icon="scale" />

      <Section background="white">
        <Container>
          <div className="max-w-3xl mx-auto">
            {/* Main legislation reference */}
            <Card className="bg-primary-50 border-primary-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center shrink-0">
                    <Scale className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      {tl('administrativeCode')}
                    </h2>
                    <p className="text-gray-600 mb-4">
                      {tl('administrativeCodeDescription')}
                    </p>
                    <a
                      href="https://legislatie.just.ro/Public/DetaliiDocument/215925"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary-900 text-white rounded-lg hover:bg-primary-800 transition-colors text-sm font-medium"
                    >
                      {tl('viewDocument')}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional useful links */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{tl('otherLegislation')}</h3>
              <div className="space-y-3">
                {[
                  { title: 'Constituția României', url: 'https://www.cdep.ro/pls/dic/site.page?id=339' },
                  { title: 'Legea 52/2003 - Transparență decizională', url: 'https://legislatie.just.ro/Public/DetaliiDocument/41571' },
                  { title: 'Legea 544/2001 - Acces la informații publice', url: 'https://legislatie.just.ro/Public/DetaliiDocument/31438' },
                ].map((law, idx) => (
                  <a
                    key={idx}
                    href={law.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                  >
                    <span className="text-gray-700 group-hover:text-primary-700">
                      {law.title}
                    </span>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary-600 shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
