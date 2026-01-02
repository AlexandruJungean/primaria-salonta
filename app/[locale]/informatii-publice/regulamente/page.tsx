import { getTranslations } from 'next-intl/server';
import { ScrollText, Download, FileText, Archive } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { generatePageMetadata, BreadcrumbJsonLd } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'regulamente',
    locale: locale as Locale,
    path: '/informatii-publice/regulamente',
  });
}

// Types
interface Regulation {
  id: number;
  title: string;
  pdfUrl: string;
}

// Mock data - will be replaced with database fetch
const REGULATIONS: Regulation[] = [
  { id: 1, title: 'Republicarea Regulamentului de Organizare și Funcționare a Centrului de zi "Bunicii Comunității" Salonta aprobat prin Hotărârea nr.7/30.01.2020 cu modificările și completările ulterioare', pdfUrl: '#' },
  { id: 2, title: 'Procedura operatională Organizarea și desfășurarea probei suplimentare de testare a competențelor specifice: abilități lingvistice la concursurile organizate de Primăria Municipiului Salonta', pdfUrl: '#' },
  { id: 3, title: 'Regulament privind gestionarea deșeurilor rezultate din activitatea medicală (umană și veterinară) în Mun. Salonta', pdfUrl: '#' },
  { id: 4, title: 'Regulamentul de organizare și funcționare a serviciului social de zi, Centru de zi "Bunicii Comunității Salonta"', pdfUrl: '#' },
  { id: 5, title: 'Regulamentul privind gestionarea câinilor cu stăpân și stoparea înmulțirii necontrolate a câinilor de rasă comună sau metiși din Municipiul Salonta', pdfUrl: '#' },
  { id: 6, title: 'Procedura de acordare a facilităților la plata impozitului pentru furnizorii de servicii sociale', pdfUrl: '#' },
  { id: 7, title: 'Regulament de Organizare Funcționare al aparatului de specialitate al Primarului Municipiului Salonta', pdfUrl: '#' },
  { id: 8, title: 'Regulamentul privind stabilirea unor măsuri pentru gospodărirea Municipiului Salonta, precum și a faptelor ce constituie contravenții, constatarea și sancționarea acestora', pdfUrl: '#' },
  { id: 9, title: 'Regulamentul de vânzare a locuințelor de tip ANL – republicat', pdfUrl: '#' },
  { id: 10, title: 'Regulament privind realizarea, repartizarea, închirierea, exploatarea și administrarea locuințelor sociale și de necesitate din Municipiul Salonta – republicat', pdfUrl: '#' },
  { id: 11, title: 'Regulament pentru înregistrarea, evidența și radierea vehiculelor a căror proprietari își au domiciliul, reședința ori sediul pe raza Municipiului Salonta', pdfUrl: '#' },
  { id: 12, title: 'Regulament privind administrarea, întreținerea și utilizarea Bazinului de înot didactic situat în Municipiul Salonta', pdfUrl: '#' },
  { id: 13, title: 'Regulament management Casa de Cultura', pdfUrl: '#' },
  { id: 14, title: 'Regulament adapost caini', pdfUrl: '#' },
  { id: 15, title: 'Regulamentul programului de internship din cadrul Primăriei Mun. Salonta', pdfUrl: '#' },
  { id: 16, title: 'Regulament de eliberare a Acordului și a orarului de funcționare', pdfUrl: '#' },
  { id: 17, title: 'Regulament taxă specială salubrizare', pdfUrl: '#' },
  { id: 18, title: 'Regulamentul de organizare, administrare și funcționare a Cimitirului', pdfUrl: '#' },
  { id: 19, title: 'Program de reabilitare și modernizare chioșcuri', pdfUrl: '#' },
  { id: 20, title: 'Nomenclatorul stradal pentru anul 2018', pdfUrl: '#' },
  { id: 21, title: 'Regulamentul local de implicare a publicului in elaborarea sau revizuirea planului de urbanism si de amenajare a teritoriului', pdfUrl: '#' },
  { id: 22, title: 'Regulamentul privind masurile de crestere a calitatii arhitecturale si ambientale a cladirilor', pdfUrl: '#' },
  { id: 23, title: 'Nomenclatorul stradal al municipiului Salonta, Anexa nr. 2', pdfUrl: '#' },
  { id: 24, title: 'Regulamentul privind amplasarea si autorizarea mijloacelor de publicitate in Mun. Salonta', pdfUrl: '#' },
  { id: 25, title: 'Regulament privind prestarea activitatii/muncii neremunerate in folosul comunitatii', pdfUrl: '#' },
  { id: 26, title: 'Regulamentul de alimentare cu apa si canalizare in Salonta', pdfUrl: '#' },
];

const ARCHIVE_REGULATIONS: Regulation[] = [
  { id: 101, title: 'Regulament privind prestarea activitatii/muncii neremunerate in folosul comunitatii', pdfUrl: '#' },
  { id: 102, title: 'Regulament pentru efectuarea transportului public local de persoane prin curse regulate speciale', pdfUrl: '#' },
  { id: 103, title: 'Regulament privind intretinerea fatadelor in municipiul Salonta', pdfUrl: '#' },
  { id: 104, title: 'Regulamentul locuintelor sociale', pdfUrl: '#' },
  { id: 105, title: 'Regulamentul locuintelor sociale destinate chiriasilor evacuati', pdfUrl: '#' },
  { id: 106, title: 'Regulamentul privind adminstrarea haldei de gunoi', pdfUrl: '#' },
];

export default async function RegulamentePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tPage = await getTranslations({ locale, namespace: 'regulamentePublicePage' });

  return (
    <>
      <Breadcrumbs items={[
        { label: t('informatiiPublice'), href: '/informatii-publice' },
        { label: t('regulamente') }
      ]} />
      <PageHeader titleKey="regulamente" icon="scrollText" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            {/* Info Banner */}
            <Card className="mb-8 bg-violet-50 border-violet-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <ScrollText className="w-8 h-8 text-violet-600 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-violet-900 mb-2">{tPage('infoTitle')}</h3>
                    <p className="text-violet-800 text-sm">
                      {tPage('infoText')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Regulations */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-violet-700" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{tPage('currentTitle')}</h2>
                  <span className="text-sm text-gray-500">({REGULATIONS.length} {tPage('documents')})</span>
                </div>
              </div>

              <div className="space-y-2">
                {REGULATIONS.map((reg) => (
                  <a
                    key={reg.id}
                    href={reg.pdfUrl}
                    className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:bg-violet-50 hover:border-violet-300 transition-colors group"
                  >
                    <ScrollText className="w-5 h-5 text-violet-500 shrink-0 mt-0.5" />
                    <span className="flex-1 text-gray-700 group-hover:text-violet-900">{reg.title}</span>
                    <Download className="w-4 h-4 text-gray-400 group-hover:text-violet-600 shrink-0 mt-0.5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Archive Regulations */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
                  <Archive className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{tPage('archiveTitle')}</h2>
                  <span className="text-sm text-gray-500">({ARCHIVE_REGULATIONS.length} {tPage('documents')})</span>
                </div>
              </div>

              <div className="space-y-2">
                {ARCHIVE_REGULATIONS.map((reg) => (
                  <a
                    key={reg.id}
                    href={reg.pdfUrl}
                    className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 transition-colors group"
                  >
                    <ScrollText className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                    <span className="flex-1 text-gray-600 group-hover:text-gray-900">{reg.title}</span>
                    <Download className="w-4 h-4 text-gray-400 group-hover:text-gray-600 shrink-0 mt-0.5" />
                  </a>
                ))}
              </div>
            </div>

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
