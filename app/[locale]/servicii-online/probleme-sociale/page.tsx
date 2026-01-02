import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Download, FileText, Heart, Info } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import Link from 'next/link';
import { generatePageMetadata, BreadcrumbJsonLd } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'problemeSociale',
    locale: locale as Locale,
    path: '/servicii-online/probleme-sociale',
  });
}

// Social problem forms - documents from database
const SOCIAL_FORMS = [
  { id: 1, titleKey: 'cererePrestatiiExceptionale', url: '#' },
  { id: 2, titleKey: 'cerereAjutorUrgenta', url: '#' },
  { id: 3, titleKey: 'declaratieVenit', url: '#' },
];

export default function ProblemeSocialePage() {
  const t = useTranslations('navigation');
  const tp = useTranslations('problemeSocialePage');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('serviciiOnline'), href: '/servicii-online' },
        { label: t('problemeSociale') }
      ]} />
      <PageHeader titleKey="problemeSociale" icon="heart" />

      <Section background="white">
        <Container>
          <div className="max-w-3xl mx-auto">
            
            {/* Info card */}
            <Card className="mb-8 bg-rose-50 border-rose-200">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-rose-600 flex items-center justify-center shrink-0">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900 mb-2">{tp('infoTitle')}</h2>
                    <p className="text-sm text-gray-700">{tp('infoText')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Forms list */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-rose-600" />
                {tp('formsTitle')}
              </h2>
              <div className="space-y-3">
                {SOCIAL_FORMS.map((form) => (
                  <Card key={form.id}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-gray-500" />
                        <span className="text-gray-900">{tp(`forms.${form.titleKey}`)}</span>
                      </div>
                      <Link 
                        href={form.url}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        PDF
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Contact info */}
            <Card className="bg-gray-50">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <Info className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{tp('contactTitle')}</h3>
                    <p className="text-sm text-gray-600">{tp('contactText')}</p>
                    <Link 
                      href="/contact" 
                      className="inline-block mt-3 text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      {tp('contactLink')} →
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </Container>
      </Section>
    </>
  );
}

