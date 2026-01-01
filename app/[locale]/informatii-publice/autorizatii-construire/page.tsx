import { getTranslations } from 'next-intl/server';
import { Hammer, Calendar, Download, FileText, Archive, FolderOpen } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('autorizatiiConstruire') };
}

// Types for building permits
interface PermitPeriod {
  id: number;
  title: string;
  period: string;
  year: number;
  pdfUrl: string;
}

// Mock data - will be replaced with database fetch
const CURRENT_PERMITS: PermitPeriod[] = [
  { id: 1, title: 'AC martie 2020', period: 'Martie 2020', year: 2020, pdfUrl: '#' },
  { id: 2, title: 'AC februarie 2020', period: 'Februarie 2020', year: 2020, pdfUrl: '#' },
  { id: 3, title: 'AC ianuarie 2020', period: 'Ianuarie 2020', year: 2020, pdfUrl: '#' },
  { id: 4, title: 'AC noiembrie – decembrie 2019', period: 'Noiembrie - Decembrie 2019', year: 2019, pdfUrl: '#' },
  { id: 5, title: 'AC octombrie 2019', period: 'Octombrie 2019', year: 2019, pdfUrl: '#' },
  { id: 6, title: 'AC iulie – septembrie 2019', period: 'Iulie - Septembrie 2019', year: 2019, pdfUrl: '#' },
  { id: 7, title: 'AC iunie 2019', period: 'Iunie 2019', year: 2019, pdfUrl: '#' },
  { id: 8, title: 'AC mai 2019', period: 'Mai 2019', year: 2019, pdfUrl: '#' },
  { id: 9, title: 'AC aprilie 2019', period: 'Aprilie 2019', year: 2019, pdfUrl: '#' },
  { id: 10, title: 'AC martie 2019', period: 'Martie 2019', year: 2019, pdfUrl: '#' },
  { id: 11, title: 'AC februarie 2019', period: 'Februarie 2019', year: 2019, pdfUrl: '#' },
  { id: 12, title: 'AC ianuarie 2019', period: 'Ianuarie 2019', year: 2019, pdfUrl: '#' },
  { id: 13, title: 'AC noiembrie – decembrie 2018', period: 'Noiembrie - Decembrie 2018', year: 2018, pdfUrl: '#' },
  { id: 14, title: 'AC octombrie 2018', period: 'Octombrie 2018', year: 2018, pdfUrl: '#' },
  { id: 15, title: 'AC septembrie 2018', period: 'Septembrie 2018', year: 2018, pdfUrl: '#' },
  { id: 16, title: 'AC luna august 2018', period: 'August 2018', year: 2018, pdfUrl: '#' },
  { id: 17, title: 'AC luna iulie 2018', period: 'Iulie 2018', year: 2018, pdfUrl: '#' },
  { id: 18, title: 'AC luna iunie 2018', period: 'Iunie 2018', year: 2018, pdfUrl: '#' },
  { id: 19, title: 'AC luna mai 2018', period: 'Mai 2018', year: 2018, pdfUrl: '#' },
  { id: 20, title: 'AC luna aprilie 2018', period: 'Aprilie 2018', year: 2018, pdfUrl: '#' },
  { id: 21, title: 'Autorizatii de construire eliberate in perioada ianuarie-martie 2018', period: 'Ianuarie - Martie 2018', year: 2018, pdfUrl: '#' },
];

const ARCHIVE_PERMITS: PermitPeriod[] = [
  { id: 100, title: 'Autorizatii de construire eliberate in luna decembrie 2017', period: 'Decembrie 2017', year: 2017, pdfUrl: '#' },
  { id: 101, title: 'Autorizatii de construire eliberate in perioada august-noiembrie 2017', period: 'August - Noiembrie 2017', year: 2017, pdfUrl: '#' },
  { id: 102, title: 'Autorizatii de construire eliberate in perioada aprilie-iulie 2017', period: 'Aprilie - Iulie 2017', year: 2017, pdfUrl: '#' },
  { id: 103, title: 'Autorizatii de construire eliberate in perioada ianuarie-martie 2017', period: 'Ianuarie - Martie 2017', year: 2017, pdfUrl: '#' },
  { id: 104, title: 'Autorizatii de construire eliberate in perioada noiembrie-decembrie 2016', period: 'Noiembrie - Decembrie 2016', year: 2016, pdfUrl: '#' },
  { id: 105, title: 'Autorizatii de construire eliberate in perioada septembrie-octombrie 2016', period: 'Septembrie - Octombrie 2016', year: 2016, pdfUrl: '#' },
  { id: 106, title: 'Autorizatii de construire eliberate in perioada iulie-august 2016', period: 'Iulie - August 2016', year: 2016, pdfUrl: '#' },
  { id: 107, title: 'Autorizatii de construire eliberate in luna iunie 2016', period: 'Iunie 2016', year: 2016, pdfUrl: '#' },
  { id: 108, title: 'Autorizatii de construire eliberate in luna mai 2016', period: 'Mai 2016', year: 2016, pdfUrl: '#' },
  { id: 109, title: 'Autorizatii de construire eliberate in perioada februarie-aprilie 2016', period: 'Februarie - Aprilie 2016', year: 2016, pdfUrl: '#' },
  { id: 110, title: 'Autorizatii de construire eliberate in perioada noiembrie 2015-ianuarie 2016', period: 'Noiembrie 2015 - Ianuarie 2016', year: 2015, pdfUrl: '#' },
  { id: 111, title: 'Autorizatii de construire eliberate in perioada decembrie 2014-octombrie 2015', period: 'Decembrie 2014 - Octombrie 2015', year: 2015, pdfUrl: '#' },
  { id: 112, title: 'Autorizatii de construire eliberate in lunile august-noiembrie 2014', period: 'August - Noiembrie 2014', year: 2014, pdfUrl: '#' },
  { id: 113, title: 'Autorizatii de construire eliberate in lunile martie-iulie 2014', period: 'Martie - Iulie 2014', year: 2014, pdfUrl: '#' },
  { id: 114, title: 'Autorizatii de construire eliberate in lunile decembrie 2013-februarie 2014', period: 'Decembrie 2013 - Februarie 2014', year: 2014, pdfUrl: '#' },
  { id: 115, title: 'Autorizatii de construire eliberate in lunile august-noiembrie 2013', period: 'August - Noiembrie 2013', year: 2013, pdfUrl: '#' },
  { id: 116, title: 'Autorizatii de construire eliberate in lunile aprilie-iulie 2013', period: 'Aprilie - Iulie 2013', year: 2013, pdfUrl: '#' },
  { id: 117, title: 'Autorizatii de construire eliberate in lunile ianuarie-martie 2013', period: 'Ianuarie - Martie 2013', year: 2013, pdfUrl: '#' },
  { id: 118, title: 'Autorizatii de construire eliberate in lunile octombrie-decembrie 2012', period: 'Octombrie - Decembrie 2012', year: 2012, pdfUrl: '#' },
  { id: 119, title: 'Autorizatii de construire eliberate in lunile iulie-septembrie 2012', period: 'Iulie - Septembrie 2012', year: 2012, pdfUrl: '#' },
  { id: 120, title: 'Autorizatii de construire eliberate in lunile ianuarie-iunie 2012', period: 'Ianuarie - Iunie 2012', year: 2012, pdfUrl: '#' },
  { id: 121, title: 'Autorizatii de construire eliberate in lunile octombrie-decembrie 2011', period: 'Octombrie - Decembrie 2011', year: 2011, pdfUrl: '#' },
  { id: 122, title: 'Autorizatii de construire eliberate in lunile mai-septembrie 2011', period: 'Mai - Septembrie 2011', year: 2011, pdfUrl: '#' },
  { id: 123, title: 'Autorizatii de construire eliberate in luna aprilie 2011', period: 'Aprilie 2011', year: 2011, pdfUrl: '#' },
  { id: 124, title: 'Autorizatii de construire eliberate in 2011', period: '2011', year: 2011, pdfUrl: '#' },
];

function PermitCard({ permit }: { permit: PermitPeriod }) {
  return (
    <Card hover>
      <CardContent className="flex items-center justify-between pt-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-primary-700" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{permit.title}</h3>
            <span className="text-sm text-gray-500 flex items-center gap-1 mt-1">
              <Calendar className="w-4 h-4" />
              {permit.period}
            </span>
          </div>
        </div>
        <a
          href={permit.pdfUrl}
          className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-primary-300 transition-colors shrink-0"
        >
          <Download className="w-4 h-4 text-primary-600" />
          PDF
        </a>
      </CardContent>
    </Card>
  );
}

function PermitsByYear({ permits, year }: { permits: PermitPeriod[]; year: number }) {
  const yearPermits = permits.filter(p => p.year === year);
  if (yearPermits.length === 0) return null;

  return (
    <div className="space-y-3">
      {yearPermits.map((permit) => (
        <PermitCard key={permit.id} permit={permit} />
      ))}
    </div>
  );
}

export default async function AutorizatiiConstruirePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tPage = await getTranslations({ locale, namespace: 'autorizatiiConstruirePage' });

  // Group current permits by year
  const currentYears = [...new Set(CURRENT_PERMITS.map(p => p.year))].sort((a, b) => b - a);
  const archiveYears = [...new Set(ARCHIVE_PERMITS.map(p => p.year))].sort((a, b) => b - a);

  return (
    <>
      <Breadcrumbs items={[
        { label: t('informatiiPublice'), href: '/informatii-publice' },
        { label: t('autorizatiiConstruire') }
      ]} />
      <PageHeader titleKey="autorizatiiConstruire" icon="hammer" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            {/* Info Banner */}
            <Card className="mb-8 bg-primary-50 border-primary-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Hammer className="w-8 h-8 text-primary-600 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-primary-900 mb-2">{tPage('infoTitle')}</h3>
                    <p className="text-primary-800 text-sm">
                      {tPage('infoText')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Permits Section */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-primary-700" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{tPage('currentTitle')}</h2>
              </div>

              {currentYears.map((year) => (
                <div key={year} className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-700">{year}</h3>
                    <span className="text-sm text-gray-500">
                      ({CURRENT_PERMITS.filter(p => p.year === year).length} {tPage('documents')})
                    </span>
                  </div>
                  <PermitsByYear permits={CURRENT_PERMITS} year={year} />
                </div>
              ))}
            </div>

            {/* Archive Section */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Archive className="w-5 h-5 text-amber-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{tPage('archiveTitle')}</h2>
              </div>

              {archiveYears.map((year) => (
                <div key={year} className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-700">{year}</h3>
                    <span className="text-sm text-gray-500">
                      ({ARCHIVE_PERMITS.filter(p => p.year === year).length} {tPage('documents')})
                    </span>
                  </div>
                  <PermitsByYear permits={ARCHIVE_PERMITS} year={year} />
                </div>
              ))}
            </div>

            {/* Info Note */}
            <Card className="mt-8 bg-gray-50 border-gray-200">
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
