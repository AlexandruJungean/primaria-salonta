import { getTranslations } from 'next-intl/server';
import { Wheat, FileText, Download, Phone, Mail, Clock, MapPin } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { Link } from '@/components/ui/link';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';
import * as documents from '@/lib/supabase/services/documents';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'registruAgricol',
    locale: locale as Locale,
    path: '/registru-agricol',
  });
}

export default async function RegistruAgricolPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tp = await getTranslations({ locale, namespace: 'registruAgricolPage' });

  // Fetch agricultural forms from database
  const forms = await documents.getDocumentsByCategory('registru_agricol', 50);

  const pageLabels = {
    ro: {
      noForms: 'Nu există formulare disponibile.',
      download: 'Descarcă',
      formsTitle: 'Formulare disponibile',
      contactTitle: 'Contact',
      contactText: 'Pentru mai multe informații, contactați Compartimentul Registru Agricol.',
      contact: 'Contact',
    },
    hu: {
      noForms: 'Nincsenek elérhető nyomtatványok.',
      download: 'Letöltés',
      formsTitle: 'Elérhető nyomtatványok',
      contactTitle: 'Kapcsolat',
      contactText: 'További információért forduljon a Mezőgazdasági Nyilvántartási Osztályhoz.',
      contact: 'Kapcsolat',
    },
    en: {
      noForms: 'No forms available.',
      download: 'Download',
      formsTitle: 'Available forms',
      contactTitle: 'Contact',
      contactText: 'For more information, contact the Agricultural Registry Department.',
      contact: 'Contact',
    },
  };

  const labels = pageLabels[locale as keyof typeof pageLabels] || pageLabels.en;

  return (
    <>
      <Breadcrumbs items={[{ label: t('registruAgricol') }]} />
      <PageHeader titleKey="registruAgricol" icon="wheat" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-600 mb-8 text-center">
              {tp('description')}
            </p>

            {/* Forms List */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary-600" />
                {labels.formsTitle}
              </h2>

              {forms.length > 0 ? (
                <div className="space-y-3">
                  {forms.map((form) => (
                    <Card key={form.id} className="hover:shadow-sm transition-shadow">
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5 text-green-700" />
                          </div>
                          <div>
                            <span className="font-medium text-gray-900">{form.title}</span>
                            {form.description && (
                              <p className="text-sm text-gray-500 mt-0.5">{form.description}</p>
                            )}
                          </div>
                        </div>
                        <a
                          href={form.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors shrink-0"
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

            {/* Contact Card */}
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-green-600" />
                  {labels.contactTitle}
                </h3>
                <p className="text-gray-600 mb-4">{labels.contactText}</p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  {labels.contact}
                </Link>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>
    </>
  );
}
