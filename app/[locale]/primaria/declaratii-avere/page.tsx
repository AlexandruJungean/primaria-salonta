import { Users, Briefcase, FileText } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section, SectionHeader } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';
import * as documentsService from '@/lib/supabase/services/documents';
import type { AssetDeclaration } from '@/lib/types/database';
import { CollapsibleYearSection } from './collapsible-year-section';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'declaratiiAvere',
    locale: locale as Locale,
    path: '/primaria/declaratii-avere',
  });
}

// Page texts
const PAGE_TEXTS = {
  ro: {
    title: 'Declarații de avere și interese',
    electedOfficials: 'Aleși locali',
    electedOfficialsSubtitle: 'Primar și Viceprimar',
    publicServants: 'Funcționari publici',
    publicServantsSubtitle: 'Angajații Primăriei Municipiului Salonta',
    noData: 'Nu există declarații disponibile.',
    infoTitle: 'Informații',
    infoText: 'Declarațiile de avere și de interese sunt depuse conform Legii nr. 176/2010 privind integritatea în exercitarea funcțiilor și demnităților publice.',
    year: 'Declarații depuse în',
  },
  hu: {
    title: 'Vagyon- és érdekeltségi nyilatkozatok',
    electedOfficials: 'Helyi választott tisztségviselők',
    electedOfficialsSubtitle: 'Polgármester és Alpolgármester',
    publicServants: 'Köztisztviselők',
    publicServantsSubtitle: 'Nagyszalonta Polgármesteri Hivatalának alkalmazottai',
    noData: 'Nincsenek elérhető nyilatkozatok.',
    infoTitle: 'Információk',
    infoText: 'A vagyon- és érdekeltségi nyilatkozatokat a 176/2010-es törvény szerint nyújtják be a közfunkciók és méltóságok tisztasága érdekében.',
    year: 'Benyújtott nyilatkozatok',
  },
  en: {
    title: 'Asset and Interest Declarations',
    electedOfficials: 'Elected Officials',
    electedOfficialsSubtitle: 'Mayor and Deputy Mayor',
    publicServants: 'Public Servants',
    publicServantsSubtitle: 'Employees of Salonta City Hall',
    noData: 'No declarations available.',
    infoTitle: 'Information',
    infoText: 'Asset and interest declarations are submitted according to Law no. 176/2010 regarding integrity in exercising public functions and dignities.',
    year: 'Declarations submitted in',
  },
};

// Breadcrumb translations
const NAV_TRANSLATIONS = {
  ro: { primaria: 'Primăria', declaratiiAvere: 'Declarații de avere' },
  hu: { primaria: 'Polgármesteri Hivatal', declaratiiAvere: 'Vagyonnyilatkozatok' },
  en: { primaria: 'City Hall', declaratiiAvere: 'Asset Declarations' },
};

interface DeclarationTableProps {
  declarations: AssetDeclaration[];
  yearLabel: string;
}

function DeclarationTable({ declarations, yearLabel }: DeclarationTableProps) {
  // Group by year
  const byYear = declarations.reduce((acc, decl) => {
    const year = decl.declaration_year;
    if (!acc[year]) acc[year] = [];
    acc[year].push(decl);
    return acc;
  }, {} as Record<number, AssetDeclaration[]>);

  // Sort years descending
  const years = Object.keys(byYear).map(Number).sort((a, b) => b - a);

  if (years.length === 0) {
    return null;
  }

  // Pregătim datele pentru componenta client
  const yearData = years.map(year => ({
    year,
    declarations: byYear[year].map(entry => ({
      id: entry.id,
      person_name: entry.person_name,
      avere_file_url: entry.avere_file_url,
      interese_file_url: entry.interese_file_url,
    }))
  }));

  return (
    <CollapsibleYearSection 
      yearData={yearData} 
      yearLabel={yearLabel}
    />
  );
}

export default async function DeclaratiiAverePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const currentLocale = (locale as 'ro' | 'hu' | 'en') || 'ro';

  // Fetch all declarations grouped by department
  const declarationsByDept = await documentsService.getAssetDeclarationsByDepartment();

  // Toate declarațiile din primaria
  const allPrimaria = declarationsByDept['primaria'] || [];
  
  // Aleși locali = DOAR Primar și Viceprimar (sunt în departamentul primaria)
  const electedOfficials = allPrimaria.filter(d => {
    const pos = d.position?.toLowerCase() || '';
    return pos.includes('primar') || pos.includes('viceprimar');
  });
  
  // Funcționari publici = restul din primaria (cu position = "Funcționar public")
  const publicServants = allPrimaria.filter(d => {
    const pos = d.position?.toLowerCase() || '';
    return pos.includes('funcționar') || pos.includes('functionar');
  });

  const t = PAGE_TEXTS[currentLocale];
  const nav = NAV_TRANSLATIONS[currentLocale];

  const hasData = electedOfficials.length > 0 || publicServants.length > 0;

  return (
    <>
      <Breadcrumbs items={[
        { label: nav.primaria, href: '/primaria' },
        { label: nav.declaratiiAvere }
      ]} />

      <Section background="white">
        <Container>
          <SectionHeader title={t.title} />
          
          <div className="max-w-4xl mx-auto">
            {!hasData ? (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>{t.noData}</p>
              </div>
            ) : (
              <>
                {/* Aleși locali Section */}
                {electedOfficials.length > 0 && (
                  <Card className="mb-8">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                          <Users className="w-6 h-6 text-primary-700" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-gray-900">{t.electedOfficials}</h2>
                          <p className="text-sm text-gray-500">{t.electedOfficialsSubtitle}</p>
                        </div>
                      </div>
                      <DeclarationTable declarations={electedOfficials} yearLabel={t.year} />
                    </CardContent>
                  </Card>
                )}

                {/* Funcționari publici Section */}
                {publicServants.length > 0 && (
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                          <Briefcase className="w-6 h-6 text-orange-700" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-gray-900">{t.publicServants}</h2>
                          <p className="text-sm text-gray-500">{t.publicServantsSubtitle}</p>
                        </div>
                      </div>
                      <DeclarationTable declarations={publicServants} yearLabel={t.year} />
                    </CardContent>
                  </Card>
                )}

                {/* Info Note */}
                <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-2">{t.infoTitle}</h3>
                  <p className="text-gray-600 text-sm">
                    {t.infoText}
                  </p>
                </div>
              </>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
