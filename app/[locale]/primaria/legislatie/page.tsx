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

const LEGISLATION = [
  { title: 'Constituția României', url: 'https://www.cdep.ro/pls/dic/site.page?id=339' },
  { title: 'Codul Administrativ (OUG 57/2019)', url: 'https://legislatie.just.ro/Public/DetaliiDocument/215925' },
  { title: 'Legea 52/2003 - Transparență decizională', url: 'https://legislatie.just.ro/Public/DetaliiDocument/41571' },
  { title: 'Legea 544/2001 - Acces la informații publice', url: 'https://legislatie.just.ro/Public/DetaliiDocument/31438' },
  { title: 'Legea 215/2001 - Administrație publică locală', url: 'https://legislatie.just.ro/Public/DetaliiDocument/29778' },
  { title: 'Legea 227/2015 - Codul Fiscal', url: 'https://legislatie.just.ro/Public/DetaliiDocument/171226' },
  { title: 'Legea 98/2016 - Achiziții publice', url: 'https://legislatie.just.ro/Public/DetaliiDocument/179201' },
];

export default function LegislatiePage() {
  const t = useTranslations('navigation');

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
            <p className="text-lg text-gray-600 mb-8 text-center">
              Legislație relevantă pentru activitatea administrației publice locale.
            </p>

            <div className="space-y-3">
              {LEGISLATION.map((law, idx) => (
                <Card key={idx}>
                  <CardContent className="pt-6">
                    <a
                      href={law.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-4 group"
                    >
                      <span className="text-gray-900 group-hover:text-primary-700 transition-colors">
                        {law.title}
                      </span>
                      <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-primary-600 shrink-0" />
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

