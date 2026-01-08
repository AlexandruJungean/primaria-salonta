import { getTranslations } from 'next-intl/server';
import { Download, FileText, Heart, Info } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { Link } from '@/components/ui/link';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';
import * as documents from '@/lib/supabase/services/documents';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'problemeSociale',
    locale: locale as Locale,
    path: '/servicii-online/probleme-sociale',
  });
}

export default async function ProblemeSocialePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tp = await getTranslations({ locale, namespace: 'problemeSocialePage' });

  // Fetch social forms from database
  const socialForms = await documents.getDocumentsByCategory('formulare_sociale', 50);

  const pageLabels = {
    ro: {
      infoTitle: 'Asistență Socială',
      infoText: 'Primăria Municipiului Salonta oferă sprijin persoanelor aflate în situații dificile prin diverse forme de ajutor social. Descărcați formularele necesare și depuneți-le la sediul primăriei sau online.',
      formsTitle: 'Formulare disponibile',
      noForms: 'Nu există formulare disponibile.',
      download: 'PDF',
      contactTitle: 'Contact',
      contactText: 'Pentru mai multe informații, contactați Serviciul de Asistență Socială.',
    },
    hu: {
      infoTitle: 'Szociális Segítség',
      infoText: 'Nagyszalonta Polgármesteri Hivatala különböző szociális segélyekkel támogatja a nehéz helyzetben lévő személyeket. Töltse le a szükséges nyomtatványokat és nyújtsa be a hivatalban vagy online.',
      formsTitle: 'Elérhető nyomtatványok',
      noForms: 'Nincsenek elérhető nyomtatványok.',
      download: 'PDF',
      contactTitle: 'Kapcsolat',
      contactText: 'További információért forduljon a Szociális Szolgálathoz.',
    },
    en: {
      infoTitle: 'Social Assistance',
      infoText: 'Salonta City Hall offers support to people in difficult situations through various forms of social aid. Download the necessary forms and submit them at the city hall or online.',
      formsTitle: 'Available forms',
      noForms: 'No forms available.',
      download: 'PDF',
      contactTitle: 'Contact',
      contactText: 'For more information, contact the Social Assistance Service.',
    },
  };

  const labels = pageLabels[locale as keyof typeof pageLabels] || pageLabels.en;

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
                    <h2 className="font-bold text-gray-900 mb-2">{labels.infoTitle}</h2>
                    <p className="text-sm text-gray-700">{labels.infoText}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Forms list */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-rose-600" />
                {labels.formsTitle}
              </h2>
              {socialForms.length > 0 ? (
                <div className="space-y-3">
                  {socialForms.map((form) => (
                    <Card key={form.id}>
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-gray-500" />
                          <div>
                            <span className="text-gray-900">{form.title}</span>
                            {form.description && (
                              <p className="text-sm text-gray-500 mt-0.5">{form.description}</p>
                            )}
                          </div>
                        </div>
                        <a 
                          href={form.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          {labels.download}
                        </a>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {labels.noForms}
                </div>
              )}
            </div>

            {/* Contact info */}
            <Card className="bg-gray-50">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center shrink-0">
                    <Info className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{labels.contactTitle}</h3>
                    <p className="text-sm text-gray-600 mb-3">{labels.contactText}</p>
                    <Link
                      href="/contact"
                      className="text-sm text-primary-600 hover:text-primary-800 font-medium"
                    >
                      {t('contact')} →
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
