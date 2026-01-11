import { getTranslations } from 'next-intl/server';
import { Download, ExternalLink, AlertCircle, CreditCard, BookOpen, Scale, Users, Info } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';
import { getDocumentsBySourceFolderWithAnnexes } from '@/lib/supabase/services/documents';
import { GeneraleDocuments } from './generale-documents';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'transparentaGenerale',
    locale: locale as Locale,
    path: '/transparenta/generale',
  });
}

export default async function GeneralePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tg = await getTranslations({ locale, namespace: 'generalePage' });

  // Fetch documents from database (with annexes grouped)
  const allDocs = await getDocumentsBySourceFolderWithAnnexes('generale', 500);

  // Categorize documents based on title patterns
  const dispozitii = allDocs.filter(doc => 
    doc.title.toLowerCase().includes('dispozi')
  );

  const formulare = allDocs.filter(doc => 
    doc.title.toLowerCase().includes('anexa 4') || 
    doc.title.toLowerCase().includes('reclamatie administrativa') ||
    doc.title.toLowerCase().includes('reclamație administrativă')
  );

  const rapoarte = allDocs.filter(doc => 
    doc.title.toLowerCase().includes('raport') || 
    doc.title.toLowerCase().includes('anexa 1') || 
    doc.title.toLowerCase().includes('anexa 2') || 
    doc.title.toLowerCase().includes('anexa 3') ||
    doc.title.toLowerCase().includes('fisa de evaluare') ||
    doc.title.toLowerCase().includes('fișa de evaluare')
  );

  // Group rapoarte by year
  const rapoarteByYear = rapoarte.reduce((acc, doc) => {
    const year = doc.year || 2024;
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(doc);
    return acc;
  }, {} as Record<number, typeof rapoarte>);

  // Sort years descending
  const sortedYears = Object.keys(rapoarteByYear)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <>
      <Breadcrumbs items={[
        { label: t('transparenta'), href: '/transparenta' },
        { label: t('generale') }
      ]} />
      <PageHeader titleKey="generale" icon="fileText" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto space-y-12">

            {/* Dispoziții & Rapoarte - Collapsible Client Component */}
            <GeneraleDocuments
              dispozitii={dispozitii}
              rapoarteByYear={rapoarteByYear}
              sortedYears={sortedYears}
              labels={{
                dispozitiiTitle: tg('dispozitiiTitle'),
                rapoarteTitle: tg('rapoarteTitle'),
                rapoarteAnuale: tg('rapoarteAnuale'),
              }}
            />

            {/* Cont pentru plăți Section */}
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-blue-600" />
                {tg('contPlatiTitle')}
              </h2>
              <p className="text-gray-700 mb-4">
                {tg('contPlatiDesc')}
              </p>
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <p className="font-mono text-lg font-semibold text-gray-900">RO76TREZ08321360250XXXXX</p>
                <p className="text-sm text-gray-600 mt-1">{tg('contPlatiDetails')}</p>
              </div>
            </div>

            {/* Formulare Section */}
            {formulare.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <BookOpen className="w-7 h-7 text-green-600" />
                  {tg('formulareTitle')}
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {formulare.map((doc) => (
                    <a
                      key={doc.id}
                      href={doc.file_url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-primary-300 transition-all"
                    >
                      <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                        <Download className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                          {doc.title}
                        </h3>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Ghidul Cetățeanului Section */}
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Users className="w-7 h-7 text-primary-600" />
                {tg('ghidulCetateanului')}
              </h2>
              
              <div className="space-y-6 text-gray-700">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">{tg('ceLegea52Title')}</h3>
                  <p className="mb-3">{tg('ceLegea52Desc')}</p>
                  <ol className="list-decimal list-inside space-y-1 ml-4">
                    <li>{tg('ceLegea52Item1')}</li>
                    <li>{tg('ceLegea52Item2')}</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">{tg('cuiSeAdreseazaTitle')}</h3>
                  <p>{tg('cuiSeAdreseazaDesc')}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">{tg('cePresupuneTitle')}</h3>
                  <p className="mb-2">{tg('cePresupuneDesc1')}</p>
                  <p>{tg('cePresupuneDesc2')}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">{tg('avantajeTitle')}</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>{tg('avantajeItem1')}</li>
                    <li>{tg('avantajeItem2')}</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">{tg('proceduraTitle')}</h3>
                  <p className="mb-2">{tg('proceduraDesc1')}</p>
                  <p className="mb-2">{tg('proceduraDesc2')}</p>
                  <p>{tg('proceduraDesc3')}</p>
                </div>
              </div>
            </div>

            {/* Contestare decizii Section */}
            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Scale className="w-6 h-6 text-amber-600" />
                {tg('contestareTitle')}
              </h2>
              <p className="text-gray-700 mb-4">{tg('contestareDesc')}</p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-amber-700">1.</span>
                  <span>{tg('contestareItem1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-amber-700">2.</span>
                  <span>{tg('contestareItem2')}</span>
                </li>
              </ul>
              <p className="text-sm text-gray-600 mt-4">{tg('contestareNote')}</p>
            </div>

            {/* Link-uri utile Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <ExternalLink className="w-7 h-7 text-purple-600" />
                {tg('linkuriUtileTitle')}
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <a
                  href="https://www.protectia-consumatorilor.ro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-purple-300 transition-all"
                >
                  <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                    <ExternalLink className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                      ANPC
                    </h3>
                    <p className="text-sm text-gray-500">www.protectia-consumatorilor.ro</p>
                  </div>
                </a>
                <a
                  href="mailto:reclamatii@protectia-consumatorilor.ro"
                  className="group flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-purple-300 transition-all"
                >
                  <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                    <Info className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {tg('reclamatiiANPC')}
                    </h3>
                    <p className="text-sm text-gray-500">reclamatii@protectia-consumatorilor.ro</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Info Note */}
            <div className="flex items-start gap-4 bg-gray-100 rounded-xl p-6">
              <AlertCircle className="w-6 h-6 text-gray-500 shrink-0 mt-0.5" />
              <p className="text-sm text-gray-600">
                {tg('infoNote')}
              </p>
            </div>

          </div>
        </Container>
      </Section>
    </>
  );
}
