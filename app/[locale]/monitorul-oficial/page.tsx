import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { ScrollText, FileText, Scale, Gavel, FileCheck, FileSpreadsheet } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { Link } from '@/components/ui/link';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('monitorulOficial') };
}

const SECTIONS = [
  { id: 'statutUat', href: '/monitorul-oficial/statut', icon: FileText },
  { id: 'regulamente', href: '/monitorul-oficial/regulamente', icon: Scale },
  { id: 'hotarariMol', href: '/monitorul-oficial/hotarari', icon: Gavel },
  { id: 'dispozitii', href: '/monitorul-oficial/dispozitii', icon: FileCheck },
  { id: 'documenteFinanciare', href: '/monitorul-oficial/documente-financiare', icon: FileSpreadsheet },
  { id: 'alteDocumente', href: '/monitorul-oficial/alte-documente', icon: FileText },
];

export default function MonitorulOficialPage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[{ label: t('monitorulOficial') }]} />
      <PageHeader titleKey="monitorulOficial" icon="scrollText" />

      <Section background="white">
        <Container>
          <p className="text-lg text-gray-600 mb-8 text-center max-w-3xl mx-auto">
            Monitorul Oficial Local al Municipiului Salonta cuprinde actele 
            administrative cu caracter normativ emise de autoritățile locale.
          </p>

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

