import { useTranslations } from 'next-intl';
import { ShieldCheck, FileSearch } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { Link } from '@/components/ui/link';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { WebPageJsonLd } from '@/lib/seo/json-ld';
import { type Locale } from '@/i18n/routing';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'rapoarteStudii',
    locale: locale as Locale,
    path: '/rapoarte-studii',
  });
}

const SECTIONS = [
  { id: 'rapoarteAudit', href: '/rapoarte-studii/rapoarte', icon: ShieldCheck },
  { id: 'studii', href: '/rapoarte-studii/studii', icon: FileSearch },
];

export default function RapoarteStudiiPage() {
  const t = useTranslations('navigation');
  const tp = useTranslations('rapoarteStudiiPage');

  return (
    <>
      <WebPageJsonLd
        title="Rapoarte și Studii"
        description="Rapoarte de audit și studii ale Primăriei Municipiului Salonta"
        url="/rapoarte-studii"
      />
      <Breadcrumbs items={[{ label: t('rapoarteStudii') }]} />
      <PageHeader titleKey="rapoarteStudii" icon="fileSearch" />

      <Section background="white">
        <Container>
          <p className="text-lg text-gray-600 mb-8 text-center max-w-3xl mx-auto">
            {tp('description')}
          </p>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
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

