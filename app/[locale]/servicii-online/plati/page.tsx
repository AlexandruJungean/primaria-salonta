import { getTranslations } from 'next-intl/server';
import { ExternalLink, CreditCard, Receipt, FileWarning, ShieldCheck } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section, SectionHeader } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { generatePageMetadata } from '@/lib/seo';
import { AdminEditButton } from '@/components/admin-edit-button';
import { getPageWithData } from '@/lib/supabase/services/pages';
import type { Locale } from '@/lib/seo/config';
import type { LucideIcon } from 'lucide-react';

interface PaymentLinkData {
  id: string;
  url: string;
  icon: string;
  translations: {
    ro: { title: string; description: string };
    hu: { title: string; description: string };
    en: { title: string; description: string };
  };
}

interface PlatiData {
  paymentLinks: PaymentLinkData[];
}

const ICON_MAP: Record<string, LucideIcon> = {
  creditCard: CreditCard,
  receipt: Receipt,
  fileWarning: FileWarning,
  CreditCard,
  Receipt,
  FileWarning,
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'platiOnline',
    locale: locale as Locale,
    path: '/servicii-online/plati',
  });
}

export default async function PaymentsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'payments' });
  const tNav = await getTranslations({ locale, namespace: 'navigation' });
  const page = await getPageWithData<PlatiData>('servicii-online-plati');
  const paymentLinks = page?.structured_data?.paymentLinks || [];
  const lang = locale as 'ro' | 'hu' | 'en';

  return (
    <>
      <Breadcrumbs
        items={[
          { label: tNav('serviciiOnline'), href: '/servicii-online' },
          { label: tNav('platiOnline') },
        ]}
      />

      <Section background="gray">
        <Container>
          <SectionHeader title={t('title')} subtitle={t('subtitle')} />

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {paymentLinks.map((payment) => {
              const Icon = ICON_MAP[payment.icon] || CreditCard;
              const translation = payment.translations[lang] || payment.translations.ro;
              return (
                <a key={payment.id} href={payment.url} target="_blank" rel="noopener noreferrer" className="group block">
                  <Card hover className="h-full">
                    <CardContent className="flex flex-col items-center text-center pt-8 pb-6">
                      <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mb-4 group-hover:bg-primary-200 transition-colors">
                        <Icon className="w-8 h-8 text-primary-700" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{translation.title}</h3>
                      <p className="text-gray-600 text-sm mb-4">{translation.description}</p>
                      <span className="inline-flex items-center gap-1 text-primary-700 font-medium group-hover:underline">
                        {t('accessPlatform')}
                        <ExternalLink className="w-4 h-4" />
                      </span>
                    </CardContent>
                  </Card>
                </a>
              );
            })}
          </div>

          <div className="mt-12 max-w-2xl mx-auto">
            <Card className="border-green-200 bg-green-50">
              <CardContent className="flex items-start gap-4 pt-6">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-green-700" />
                </div>
                <div>
                  <h4 className="font-medium text-green-900">{t('securePayment')}</h4>
                  <p className="text-green-700 text-sm mt-1">{page?.content}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>
      <AdminEditButton href="/admin/servicii-online/plati" />
    </>
  );
}
