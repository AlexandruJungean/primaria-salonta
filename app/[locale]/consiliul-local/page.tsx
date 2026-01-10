import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Users, Briefcase, ClipboardList, Gavel, ScrollText, FileCheck, BarChart3 } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { Link } from '@/components/ui/link';
import { generatePageMetadata, BreadcrumbJsonLd } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'consiliulLocal',
    locale: locale as Locale,
    path: '/consiliul-local',
  });
}

const COUNCIL_SECTIONS = [
  { id: 'consilieriLocali', href: '/consiliul-local/consilieri', icon: Users },
  { id: 'comisii', href: '/consiliul-local/comisii', icon: Briefcase },
  { id: 'ordineZi', href: '/consiliul-local/ordine-de-zi', icon: ClipboardList },
  { id: 'hotarari', href: '/consiliul-local/hotarari', icon: Gavel },
  { id: 'hotarariRepublicate', href: '/consiliul-local/hotarari-republicate', icon: ScrollText },
  { id: 'declaratiiAvereConsiliu', href: '/consiliul-local/declaratii-avere', icon: FileCheck },
  { id: 'rapoarteActivitate', href: '/consiliul-local/rapoarte-activitate', icon: BarChart3 },
];

export default function ConsiliulLocalPage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[{ label: t('consiliulLocal') }]} />
      <PageHeader titleKey="consiliulLocal" icon="users" />

      <Section background="white">
        <Container>
          <p className="text-lg text-gray-600 mb-8 text-center max-w-3xl mx-auto">
            Consiliul Local al Municipiului Salonta este autoritatea deliberativă 
            a administrației publice locale, format din consilieri locali aleși.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {COUNCIL_SECTIONS.map((section) => {
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

