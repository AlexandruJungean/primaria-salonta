import { getTranslations } from 'next-intl/server';
import { FileText, Scale, User, Calendar } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { getAssetDeclarations } from '@/lib/supabase/services';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'declaratiiAvere',
    locale: locale as Locale,
    path: '/consiliul-local/declaratii-avere',
  });
}

export default async function DeclaratiiAverePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('navigation');
  const td = await getTranslations('declaratiiPage');

  // Fetch declarations only for council members (consiliul_local department)
  const { data: declarations } = await getAssetDeclarations({ 
    limit: 500,
    department: 'consiliul_local'
  });

  // Group declarations by year
  const declarationsByYear = declarations.reduce((acc, decl) => {
    if (!acc[decl.declaration_year]) {
      acc[decl.declaration_year] = [];
    }
    acc[decl.declaration_year].push(decl);
    return acc;
  }, {} as Record<number, typeof declarations>);

  // Get years sorted descending
  const years = Object.keys(declarationsByYear)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <>
      <Breadcrumbs items={[
        { label: t('consiliulLocal'), href: '/consiliul-local' },
        { label: t('declaratiiAvere') }
      ]} />
      <PageHeader titleKey="declaratiiAvere" icon="fileCheck" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-600 mb-8 text-center">
              {td('description')}
            </p>

            {years.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>Nu există declarații disponibile momentan.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {years.map((year) => {
                  const yearDeclarations = declarationsByYear[year] || [];
                  // Sort by person name
                  yearDeclarations.sort((a, b) => 
                    a.person_name.localeCompare(b.person_name, 'ro')
                  );
                  
                  return (
                    <Card key={year}>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-primary-700" />
                          </div>
                          <h2 className="text-xl font-bold text-gray-900">
                            {td('declarationsYear', { year })}
                          </h2>
                          <span className="text-sm text-gray-500">
                            ({td('persons', { count: yearDeclarations.length })})
                          </span>
                        </div>

                        {yearDeclarations.length === 0 ? (
                          <p className="text-gray-500 text-sm">Nu există declarații pentru acest an.</p>
                        ) : (
                          <div className="space-y-2">
                            {yearDeclarations.map((decl) => (
                              <div
                                key={decl.id}
                                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors gap-3"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                                    <User className="w-4 h-4 text-primary-600" />
                                  </div>
                                  <span className="font-medium text-gray-900">{decl.person_name}</span>
                                </div>
                                
                                <div className="flex items-center gap-2 ml-11 sm:ml-0 flex-shrink-0">
                                  {decl.avere_file_url && (
                                    <a
                                      href={decl.avere_file_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 transition-colors hover:bg-emerald-100 hover:border-emerald-300"
                                      title={td('wealth')}
                                    >
                                      <FileText className="w-3.5 h-3.5" />
                                      {td('wealth')}
                                    </a>
                                  )}
                                  {decl.interese_file_url && (
                                    <a
                                      href={decl.interese_file_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-blue-200 bg-blue-50 text-blue-700 transition-colors hover:bg-blue-100 hover:border-blue-300"
                                      title={td('interests')}
                                    >
                                      <Scale className="w-3.5 h-3.5" />
                                      {td('interests')}
                                    </a>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
