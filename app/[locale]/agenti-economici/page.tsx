import { getTranslations } from 'next-intl/server';
import { Briefcase, FileText, Download, Phone, ExternalLink } from 'lucide-react';
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
    pageKey: 'agentiEconomici',
    locale: locale as Locale,
    path: '/agenti-economici',
  });
}

export default async function AgentiEconomiciPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tp = await getTranslations({ locale, namespace: 'agentiEconomiciPage' });

  // Fetch business-related documents from database
  const docs = await documents.getDocumentsByCategory('agenti_economici', 50);

  const pageLabels = {
    ro: {
      noDocs: 'Nu există documente disponibile.',
      download: 'Descarcă',
      docsTitle: 'Documente și formulare',
      contactTitle: 'Contact',
      contactText: 'Pentru mai multe informații, contactați Compartimentul Agenți Economici.',
      contact: 'Contact',
      linksTitle: 'Linkuri utile',
    },
    hu: {
      noDocs: 'Nincsenek elérhető dokumentumok.',
      download: 'Letöltés',
      docsTitle: 'Dokumentumok és nyomtatványok',
      contactTitle: 'Kapcsolat',
      contactText: 'További információért forduljon a Gazdasági Ügyek Osztályához.',
      contact: 'Kapcsolat',
      linksTitle: 'Hasznos linkek',
    },
    en: {
      noDocs: 'No documents available.',
      download: 'Download',
      docsTitle: 'Documents and forms',
      contactTitle: 'Contact',
      contactText: 'For more information, contact the Economic Agents Department.',
      contact: 'Contact',
      linksTitle: 'Useful links',
    },
  };

  const labels = pageLabels[locale as keyof typeof pageLabels] || pageLabels.en;

  const usefulLinks = [
    { label: 'ONRC - Registrul Comerțului', url: 'https://www.onrc.ro' },
    { label: 'ANAF - Agenția Națională de Administrare Fiscală', url: 'https://www.anaf.ro' },
    { label: 'Camera de Comerț Bihor', url: 'https://www.ccibh.ro' },
  ];

  return (
    <>
      <Breadcrumbs items={[{ label: t('agentiEconomici') }]} />
      <PageHeader titleKey="agentiEconomici" icon="briefcase" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-600 mb-8 text-center">
              {tp('description')}
            </p>

            {/* Documents List */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary-600" />
                {labels.docsTitle}
              </h2>

              {docs.length > 0 ? (
                <div className="space-y-3">
                  {docs.map((doc) => (
                    <Card key={doc.id} className="hover:shadow-sm transition-shadow">
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5 text-blue-700" />
                          </div>
                          <div>
                            <span className="font-medium text-gray-900">{doc.title}</span>
                            {doc.description && (
                              <p className="text-sm text-gray-500 mt-0.5">{doc.description}</p>
                            )}
                          </div>
                        </div>
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shrink-0"
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
                  {labels.noDocs}
                </div>
              )}
            </div>

            {/* Useful Links */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="w-5 h-5 text-primary-600" />
                  {labels.linksTitle}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {usefulLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary-600 hover:text-primary-800 py-1"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {link.label}
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact Card */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-blue-600" />
                  {labels.contactTitle}
                </h3>
                <p className="text-gray-600 mb-4">{labels.contactText}</p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
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
