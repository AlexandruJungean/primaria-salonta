import { getTranslations } from 'next-intl/server';
import { Leaf, FileText, Download, TreePine, Trash2, Droplets, ChevronDown } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';
import * as documentsService from '@/lib/supabase/services/documents';
import { MediuCollapsibleSections } from './collapsible-sections';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'mediu',
    locale: locale as Locale,
    path: '/informatii-publice/mediu',
  });
}

export default async function MediuPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tPage = await getTranslations({ locale, namespace: 'mediuPage' });

  // Fetch all mediu documents from database
  const allDocs = await documentsService.getDocumentsByCategory('mediu');

  // Group documents by subcategory
  const salubrizareDocs = allDocs.filter(doc => doc.subcategory === 'salubrizare');
  const apaCanalDocs = allDocs.filter(doc => doc.subcategory === 'apa_canal');
  const spatiiVerziDocs = allDocs.filter(doc => doc.subcategory === 'spatii_verzi');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('informatiiPublice'), href: '/informatii-publice' },
        { label: t('mediu') }
      ]} />
      <PageHeader titleKey="mediu" icon="leaf" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            {/* Info Banner */}
            <Card className="mb-8 bg-green-50 border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Leaf className="w-8 h-8 text-green-600 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-green-900 mb-2">{tPage('infoTitle')}</h3>
                    <p className="text-green-800 text-sm">
                      {tPage('infoText')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Collapsible Sections */}
            <MediuCollapsibleSections 
              salubrizareDocs={salubrizareDocs}
              apaCanalDocs={apaCanalDocs}
              spatiiVerziDocs={spatiiVerziDocs}
            />

            {/* Info Note */}
            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <FileText className="w-8 h-8 text-gray-400 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">{tPage('noteTitle')}</h3>
                    <p className="text-gray-600 text-sm">
                      {tPage('noteText')}
                    </p>
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
