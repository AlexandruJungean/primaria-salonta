import { getTranslations } from 'next-intl/server';
import { Heart, Download, FileText, AlertTriangle, ArrowRight } from 'lucide-react';
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
    pageKey: 'voluntariat',
    locale: locale as Locale,
    path: '/voluntariat',
  });
}

export default async function VoluntariatPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tp = await getTranslations({ locale, namespace: 'voluntariatPage' });

  // Fetch volunteer activity documents from database
  const volunteerDocs = await documents.getDocumentsBySourceFolder('activitate-de-voluntariat');

  const pageLabels = {
    ro: {
      noDocuments: 'Nu există documente disponibile.',
      download: 'Descarcă',
      svsuTitle: 'Serviciul Voluntar pentru Situații de Urgență',
      svsuDescription: 'SVSU este o formă de voluntariat dedicată prevenirii și gestionării situațiilor de urgență. Oferă pregătire specializată și posibilitatea de a ajuta comunitatea în momente critice.',
      svsuLink: 'Află mai multe despre SVSU',
      otherVolunteering: 'Alte forme de voluntariat',
    },
    hu: {
      noDocuments: 'Nincsenek elérhető dokumentumok.',
      download: 'Letöltés',
      svsuTitle: 'Önkéntes Sürgősségi Szolgálat',
      svsuDescription: 'Az SVSU egy vészhelyzetek megelőzésére és kezelésére szakosodott önkéntes forma. Szakképzést és lehetőséget kínál a közösség segítésére kritikus pillanatokban.',
      svsuLink: 'Tudj meg többet az SVSU-ról',
      otherVolunteering: 'Egyéb önkéntes formák',
    },
    en: {
      noDocuments: 'No documents available.',
      download: 'Download',
      svsuTitle: 'Voluntary Emergency Service',
      svsuDescription: 'SVSU is a form of volunteering dedicated to preventing and managing emergency situations. It offers specialized training and the opportunity to help the community in critical moments.',
      svsuLink: 'Learn more about SVSU',
      otherVolunteering: 'Other forms of volunteering',
    },
  };

  const labels = pageLabels[locale as keyof typeof pageLabels] || pageLabels.en;

  return (
    <>
      <Breadcrumbs items={[{ label: t('voluntariat') }]} />
      <PageHeader titleKey="voluntariat" icon="heart" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {tp('introTitle')}
              </h2>
              <p className="text-lg text-gray-600">
                {tp('introText')}
              </p>
            </div>

            {/* Documents Section */}
            <div className="mb-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-rose-600" />
                {tp('documentsTitle')}
              </h3>

              {volunteerDocs.length > 0 ? (
                <div className="space-y-3">
                  {volunteerDocs.map((doc) => (
                    <Card key={doc.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center shrink-0">
                              <FileText className="w-5 h-5 text-rose-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{doc.title}</h4>
                              {doc.description && (
                                <p className="text-sm text-gray-500">{doc.description}</p>
                              )}
                            </div>
                          </div>
                          <a
                            href={doc.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white text-sm font-medium rounded-lg hover:bg-rose-700 transition-colors shrink-0"
                          >
                            <Download className="w-4 h-4" />
                            {labels.download}
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                  {labels.noDocuments}
                </div>
              )}
            </div>

            {/* Other Volunteering Forms - SVSU Link */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                {labels.otherVolunteering}
              </h3>

              <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-7 h-7 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">
                        {labels.svsuTitle}
                      </h4>
                      <p className="text-gray-600 mb-4">
                        {labels.svsuDescription}
                      </p>
                      <Link
                        href="/programe/svsu"
                        className="inline-flex items-center gap-2 text-orange-700 font-medium hover:text-orange-800 transition-colors"
                      >
                        {labels.svsuLink}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <Card className="bg-rose-50 border-rose-100">
              <CardContent className="p-6 text-center">
                <Heart className="w-12 h-12 text-rose-500 mx-auto mb-4" />
                <p className="text-gray-700">
                  {tp('contactInfo')}
                </p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>
    </>
  );
}
