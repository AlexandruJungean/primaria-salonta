import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { CreditCard, Send } from 'lucide-react';
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
    pageKey: 'serviciiOnline',
    locale: locale as Locale,
    path: '/servicii-online',
  });
}

const SERVICES = [
  { 
    id: 'platiOnline', 
    href: '/servicii-online/plati', 
    icon: CreditCard,
    description: 'Plătește taxe, impozite și amenzi online'
  },
  { 
    id: 'petitiiOnline', 
    href: '/servicii-online/petitii', 
    icon: Send,
    description: 'Depune petiții și cereri online'
  },
];

export default function ServiciiOnlinePage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[{ label: t('serviciiOnline') }]} />
      <PageHeader titleKey="serviciiOnline" icon="creditCard" />

      <Section background="white">
        <Container>
          <p className="text-lg text-gray-600 mb-8 text-center max-w-3xl mx-auto">
            Accesează serviciile online ale Primăriei Municipiului Salonta 
            pentru a economisi timp și a rezolva cererile mai rapid.
          </p>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {SERVICES.map((service) => {
              const Icon = service.icon;
              return (
                <Link key={service.id} href={service.href}>
                  <Card hover className="h-full">
                    <CardContent className="flex flex-col items-center text-center gap-4 pt-8 pb-6">
                      <div className="w-16 h-16 rounded-xl bg-primary-100 flex items-center justify-center">
                        <Icon className="w-8 h-8 text-primary-700" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">{t(service.id)}</h3>
                        <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                      </div>
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

