import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Eye, FileText, Megaphone, MessageSquare, Newspaper } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { Link } from '@/components/ui/link';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('transparenta') };
}

const SECTIONS = [
  { id: 'generale', href: '/transparenta/generale', icon: FileText },
  { id: 'anunturi', href: '/transparenta/anunturi', icon: Megaphone },
  { id: 'dezbateriPublice', href: '/transparenta/dezbateri-publice', icon: MessageSquare },
  { id: 'buletinInformativ', href: '/transparenta/buletin-informativ', icon: Newspaper },
];

export default function TransparentaPage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[{ label: t('transparenta') }]} />
      <PageHeader titleKey="transparenta" icon="eye" />

      <Section background="white">
        <Container>
          <p className="text-lg text-gray-600 mb-8 text-center max-w-3xl mx-auto">
            Transparența decizională - informații publice conform Legii 52/2003 
            și Legii 544/2001 privind accesul la informațiile de interes public.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {SECTIONS.map((section) => {
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

