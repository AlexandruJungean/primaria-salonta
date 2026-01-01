import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Target, Map, Euro, Globe, Building, Building2, Siren, ShieldCheck } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { Link } from '@/components/ui/link';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('programe') };
}

const SECTIONS = [
  { id: 'strategieDezvoltare', href: '/programe/strategie-dezvoltare', icon: Target },
  { id: 'pmud', href: '/programe/pmud', icon: Map },
  { id: 'pnrr', href: '/programe/pnrr', icon: Euro },
  { id: 'proiecteEuropene', href: '/programe/proiecte-europene', icon: Globe },
  { id: 'proiecteLocale', href: '/programe/proiecte-locale', icon: Building },
  { id: 'programRegionalNordVest', href: '/programe/program-regional-nord-vest', icon: Building2 },
  { id: 'svsu', href: '/programe/svsu', icon: Siren },
  { id: 'sna', href: '/programe/sna', icon: ShieldCheck },
];

export default function ProgramePage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[{ label: t('programe') }]} />
      <PageHeader titleKey="programe" icon="target" />

      <Section background="white">
        <Container>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SECTIONS.map((section) => {
              const Icon = section.icon;
              return (
                <Link key={section.id} href={section.href}>
                  <Card hover className="h-full">
                    <CardContent className="flex items-center gap-4 pt-6">
                      <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                        <Icon className="w-6 h-6 text-primary-700" />
                      </div>
                      <h3 className="font-semibold text-gray-900">{t(section.id)}</h3>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </Container>
      </Section>
    </>
  );
}

