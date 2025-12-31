import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Scale, FileText, Download, Building2, Users, Archive } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('regulamente') };
}

// Regulamente principale - date din baza de date
const MAIN_REGULATIONS = [
  {
    title: 'Regulamentul de organizare și funcționare al Primăriei Municipiului Salonta',
    desc: 'Aprobat prin Hotărârea nr. 135 din 01.07.2024 a Consiliului Local',
    url: '#',
  },
  {
    title: 'Regulament de organizare și funcționare a Consiliului Local al Municipiului Salonta',
    desc: 'Aprobat prin HCL nr. 56 din 27.05.2021 – Republicat prin HCLMS nr. 7 din 23.01.2024',
    url: '#',
  },
  {
    title: 'Regulament de ordine interioară',
    url: '#',
  },
];

// Alte regulamente - date din baza de date
const OTHER_REGULATIONS = [
  { title: 'Republicarea Regulamentului de Organizare și Funcționare a Centrului de zi "Bunicii Comunității" Salonta', url: '#' },
  { title: 'Procedura operațională - Organizarea și desfășurarea probei suplimentare de testare a competențelor specifice: abilități lingvistice', url: '#' },
  { title: 'Regulament privind gestionarea deșeurilor rezultate din activitatea medicală (umană și veterinară) în Mun. Salonta', url: '#' },
  { title: 'Regulamentul de organizare și funcționare a serviciului social de zi, Centru de zi "Bunicii Comunității Salonta"', url: '#' },
  { title: 'Regulamentul privind gestionarea câinilor cu stăpân și stoparea înmulțirii necontrolate a câinilor', url: '#' },
  { title: 'Procedura de acordare a facilităților la plata impozitului pentru furnizorii de servicii sociale', url: '#' },
  { title: 'Regulament de Organizare Funcționare al aparatului de specialitate al Primarului Municipiului Salonta', url: '#' },
  { title: 'Regulamentul privind stabilirea unor măsuri pentru gospodărirea Municipiului Salonta și sancționarea contravențiilor', url: '#' },
  { title: 'Regulamentul de vânzare a locuințelor de tip ANL – republicat', url: '#' },
  { title: 'Regulament privind realizarea, repartizarea, închirierea, exploatarea și administrarea locuințelor sociale și de necesitate', url: '#' },
  { title: 'Regulament pentru înregistrarea, evidența și radierea vehiculelor', url: '#' },
  { title: 'Regulament privind administrarea, întreținerea și utilizarea Bazinului de înot didactic', url: '#' },
  { title: 'Regulament management Casa de Cultură', url: '#' },
  { title: 'Regulament adăpost câini', url: '#' },
  { title: 'Regulamentul programului de internship din cadrul Primăriei Mun. Salonta', url: '#' },
  { title: 'Regulament de eliberare a Acordului și a orarului de funcționare', url: '#' },
  { title: 'Regulament taxă specială salubrizare', url: '#' },
  { title: 'Regulamentul de organizare, administrare și funcționare a Cimitirului', url: '#' },
  { title: 'Program de reabilitare și modernizare chioșcuri', url: '#' },
  { title: 'Nomenclatorul stradal pentru anul 2018', url: '#' },
  { title: 'Regulamentul local de implicare a publicului în elaborarea sau revizuirea planului de urbanism', url: '#' },
  { title: 'Regulamentul privind măsurile de creștere a calității arhitecturale și ambientale a clădirilor', url: '#' },
  { title: 'Nomenclatorul stradal al municipiului Salonta, Anexa nr. 2', url: '#' },
  { title: 'Regulamentul privind amplasarea și autorizarea mijloacelor de publicitate în Mun. Salonta', url: '#' },
  { title: 'Regulament privind prestarea activității/muncii neremunerate în folosul comunității', url: '#' },
  { title: 'Regulamentul de alimentare cu apă și canalizare în Salonta', url: '#' },
];

// Regulamente arhivă - date din baza de date
const ARCHIVE_REGULATIONS = [
  { title: 'Regulament privind prestarea activității/muncii neremunerate în folosul comunității (arhivă)', url: '#' },
  { title: 'Regulament pentru efectuarea transportului public local de persoane prin curse regulate speciale', url: '#' },
  { title: 'Regulament privind întreținerea fațadelor în municipiul Salonta', url: '#' },
  { title: 'Regulamentul locuințelor sociale', url: '#' },
  { title: 'Regulamentul locuințelor sociale destinate chiriașilor evacuați', url: '#' },
  { title: 'Regulamentul privind administrarea haldei de gunoi', url: '#' },
];

function RegulationItem({ title, url }: { title: string; url: string }) {
  return (
    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
        <FileText className="w-5 h-5 text-primary-700" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 text-sm">{title}</h3>
      </div>
      <Link
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-xs font-medium shrink-0"
      >
        <Download className="w-3 h-3" />
        PDF
      </Link>
    </div>
  );
}

export default function RegulamentePage() {
  const t = useTranslations('navigation');
  const tr = useTranslations('regulamentePage');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('monitorulOficial'), href: '/monitorul-oficial' },
        { label: t('regulamente') }
      ]} />
      <PageHeader titleKey="regulamente" icon="scale" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto space-y-10">

            {/* Secțiunea principală */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{tr('mainTitle')}</h2>
                  <p className="text-sm text-gray-500">{tr('mainSubtitle')}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {MAIN_REGULATIONS.map((reg, index) => (
                  <Card key={index} className="border-l-4 border-l-primary-600">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{reg.title}</h3>
                          {reg.desc && (
                            <p className="text-sm text-gray-600 mt-1">{reg.desc}</p>
                          )}
                        </div>
                        <Link
                          href={reg.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium shrink-0"
                        >
                          <Download className="w-4 h-4" />
                          PDF
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Secțiunea - Alte regulamente */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-secondary-500 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{tr('otherTitle')}</h2>
                  <p className="text-sm text-gray-500">{tr('otherSubtitle')}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                {OTHER_REGULATIONS.map((reg, index) => (
                  <RegulationItem key={index} title={reg.title} url={reg.url} />
                ))}
              </div>
            </div>

            {/* Secțiunea - Arhivă */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gray-500 flex items-center justify-center">
                  <Archive className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{tr('archiveTitle')}</h2>
                  <p className="text-sm text-gray-500">{tr('archiveSubtitle')}</p>
                </div>
              </div>
              
              <div className="space-y-2 opacity-75">
                {ARCHIVE_REGULATIONS.map((reg, index) => (
                  <RegulationItem key={index} title={reg.title} url={reg.url} />
                ))}
              </div>
            </div>

          </div>
        </Container>
      </Section>
    </>
  );
}
