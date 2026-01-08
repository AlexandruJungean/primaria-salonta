import { getTranslations } from 'next-intl/server';
import { Users, FileText, Download, Phone, Mail, Clock, MapPin } from 'lucide-react';
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
    pageKey: 'stareCivila',
    locale: locale as Locale,
    path: '/stare-civila',
  });
}

export default async function StareCivilaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tp = await getTranslations({ locale, namespace: 'stareCivilaPage' });

  // Fetch civil status forms from database
  const forms = await documents.getDocumentsByCategory('stare_civila', 50);

  const pageLabels = {
    ro: {
      noForms: 'Nu există formulare disponibile.',
      download: 'Descarcă',
      formsTitle: 'Formulare disponibile',
      contactTitle: 'Contact',
      contactText: 'Pentru mai multe informații, contactați Serviciul de Stare Civilă.',
      contact: 'Contact',
      servicesTitle: 'Servicii oferite',
      services: [
        'Înregistrarea nașterilor',
        'Înregistrarea căsătoriilor',
        'Înregistrarea deceselor',
        'Eliberarea certificatelor de stare civilă',
        'Transcrierea actelor de stare civilă',
        'Reconstituirea actelor de stare civilă',
      ],
    },
    hu: {
      noForms: 'Nincsenek elérhető nyomtatványok.',
      download: 'Letöltés',
      formsTitle: 'Elérhető nyomtatványok',
      contactTitle: 'Kapcsolat',
      contactText: 'További információért forduljon az Anyakönyvi Hivatalhoz.',
      contact: 'Kapcsolat',
      servicesTitle: 'Nyújtott szolgáltatások',
      services: [
        'Születések anyakönyvezése',
        'Házasságok anyakönyvezése',
        'Elhalálozások anyakönyvezése',
        'Anyakönyvi kivonatok kiadása',
        'Anyakönyvi okiratok átírása',
        'Anyakönyvi okiratok pótlása',
      ],
    },
    en: {
      noForms: 'No forms available.',
      download: 'Download',
      formsTitle: 'Available forms',
      contactTitle: 'Contact',
      contactText: 'For more information, contact the Civil Status Service.',
      contact: 'Contact',
      servicesTitle: 'Services offered',
      services: [
        'Birth registration',
        'Marriage registration',
        'Death registration',
        'Issuance of civil status certificates',
        'Transcription of civil status documents',
        'Reconstitution of civil status documents',
      ],
    },
  };

  const labels = pageLabels[locale as keyof typeof pageLabels] || pageLabels.en;

  return (
    <>
      <Breadcrumbs items={[{ label: t('stareCivila') }]} />
      <PageHeader titleKey="stareCivila" icon="users" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-600 mb-8 text-center">
              {tp('description')}
            </p>

            {/* Services Card */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary-600" />
                  {labels.servicesTitle}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid sm:grid-cols-2 gap-2">
                  {labels.services.map((service, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-700">
                      <span className="w-2 h-2 bg-primary-500 rounded-full shrink-0" />
                      {service}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

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
                          <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5 text-indigo-700" />
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
                          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shrink-0"
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
            <Card className="bg-indigo-50 border-indigo-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-indigo-600" />
                  {labels.contactTitle}
                </h3>
                <p className="text-gray-600 mb-4">{labels.contactText}</p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
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
