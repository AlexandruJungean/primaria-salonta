import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Building2, Scale, UserCircle, FileText, LayoutGrid, Calendar, Mic, FileCheck, BarChart3 } from 'lucide-react';
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
    pageKey: 'primaria',
    locale: locale as Locale,
    path: '/primaria',
  });
}

const PRIMARIA_SECTIONS = [
  { id: 'legislatie', href: '/primaria/legislatie', icon: Scale },
  { id: 'conducere', href: '/primaria/conducere', icon: UserCircle },
  { id: 'regulament', href: '/primaria/regulament', icon: FileText },
  { id: 'organigrama', href: '/primaria/organigrama', icon: LayoutGrid },
  { id: 'program', href: '/primaria/program', icon: Calendar },
  { id: 'audiente', href: '/primaria/audiente', icon: Mic },
  { id: 'declaratiiAvere', href: '/primaria/declaratii-avere', icon: FileCheck },
  { id: 'rapoarteAnuale', href: '/primaria/rapoarte-anuale', icon: BarChart3 },
];

export default function PrimariaPage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[{ label: t('primaria') }]} />
      <PageHeader titleKey="primaria" icon="building2" />

      <Section background="white">
        <Container>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRIMARIA_SECTIONS.map((section) => {
              const Icon = section.icon;
              return (
                <Link key={section.id} href={section.href}>
                  <Card hover className="h-full">
                    <CardContent className="flex flex-col items-center text-center gap-4 pt-6">
                      <div className="w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center">
                        <Icon className="w-7 h-7 text-primary-700" />
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

