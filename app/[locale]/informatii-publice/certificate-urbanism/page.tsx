import { getTranslations } from 'next-intl/server';
import { Home, Calendar, Download, FileText, Archive, FolderOpen } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('certificateUrbanism') };
}

// Types for urbanism certificates
interface CertificatePeriod {
  id: number;
  title: string;
  period: string;
  year: number;
  pdfUrl: string;
}

// Mock data - will be replaced with database fetch
const CURRENT_CERTIFICATES: CertificatePeriod[] = [
  { id: 1, title: 'CU martie 2020', period: 'Martie 2020', year: 2020, pdfUrl: '#' },
  { id: 2, title: 'CU februarie 2020', period: 'Februarie 2020', year: 2020, pdfUrl: '#' },
  { id: 3, title: 'CU ianuarie 2020', period: 'Ianuarie 2020', year: 2020, pdfUrl: '#' },
  { id: 4, title: 'CU noiembrie-decembrie 2019', period: 'Noiembrie - Decembrie 2019', year: 2019, pdfUrl: '#' },
  { id: 5, title: 'CU septembrie – octombrie 2019', period: 'Septembrie - Octombrie 2019', year: 2019, pdfUrl: '#' },
  { id: 6, title: 'CU iulie – septembrie 2019', period: 'Iulie - Septembrie 2019', year: 2019, pdfUrl: '#' },
  { id: 7, title: 'CU iunie 2019', period: 'Iunie 2019', year: 2019, pdfUrl: '#' },
  { id: 8, title: 'CU mai 2019', period: 'Mai 2019', year: 2019, pdfUrl: '#' },
  { id: 9, title: 'CU aprilie 2019', period: 'Aprilie 2019', year: 2019, pdfUrl: '#' },
  { id: 10, title: 'CU martie 2019', period: 'Martie 2019', year: 2019, pdfUrl: '#' },
  { id: 11, title: 'CU februarie 2019', period: 'Februarie 2019', year: 2019, pdfUrl: '#' },
  { id: 12, title: 'CU ianuarie 2019', period: 'Ianuarie 2019', year: 2019, pdfUrl: '#' },
  { id: 13, title: 'CU noiembrie-decembrie 2018', period: 'Noiembrie - Decembrie 2018', year: 2018, pdfUrl: '#' },
  { id: 14, title: 'CU octombrie 2018', period: 'Octombrie 2018', year: 2018, pdfUrl: '#' },
  { id: 15, title: 'CU septembrie 2018', period: 'Septembrie 2018', year: 2018, pdfUrl: '#' },
  { id: 16, title: 'CU luna august 2018', period: 'August 2018', year: 2018, pdfUrl: '#' },
  { id: 17, title: 'CU luna iulie 2018', period: 'Iulie 2018', year: 2018, pdfUrl: '#' },
  { id: 18, title: 'CU luna iunie 2018', period: 'Iunie 2018', year: 2018, pdfUrl: '#' },
  { id: 19, title: 'CU luna mai 2018', period: 'Mai 2018', year: 2018, pdfUrl: '#' },
  { id: 20, title: 'CU luna aprilie 2018', period: 'Aprilie 2018', year: 2018, pdfUrl: '#' },
  { id: 21, title: 'Certificate de urbanism eliberate in perioada ianuarie-martie 2018', period: 'Ianuarie - Martie 2018', year: 2018, pdfUrl: '#' },
];

const ARCHIVE_CERTIFICATES: CertificatePeriod[] = [
  { id: 100, title: 'Certificate de urbanism eliberate in perioada august-decembrie 2017', period: 'August - Decembrie 2017', year: 2017, pdfUrl: '#' },
  { id: 101, title: 'Certificate de urbanism eliberate in luna august 2017', period: 'August 2017', year: 2017, pdfUrl: '#' },
  { id: 102, title: 'Certificate de urbanism eliberate in perioada iunie-iulie 2017', period: 'Iunie - Iulie 2017', year: 2017, pdfUrl: '#' },
  { id: 103, title: 'Certificate de urbanism eliberate in perioada aprilie-mai 2017', period: 'Aprilie - Mai 2017', year: 2017, pdfUrl: '#' },
  { id: 104, title: 'Certificate de urbanism eliberate in perioada ianuarie-martie 2017', period: 'Ianuarie - Martie 2017', year: 2017, pdfUrl: '#' },
  { id: 105, title: 'Certificate de urbanism eliberate in perioada noiembrie-decembrie 2016', period: 'Noiembrie - Decembrie 2016', year: 2016, pdfUrl: '#' },
  { id: 106, title: 'Certificate de urbanism eliberate in perioada septembrie-octombrie 2016', period: 'Septembrie - Octombrie 2016', year: 2016, pdfUrl: '#' },
  { id: 107, title: 'Certificate de urbanism eliberate in perioada iulie-august 2016', period: 'Iulie - August 2016', year: 2016, pdfUrl: '#' },
  { id: 108, title: 'Certificate de urbanism eliberate in luna iunie 2016', period: 'Iunie 2016', year: 2016, pdfUrl: '#' },
  { id: 109, title: 'Certificate de urbanism eliberate in luna mai 2016', period: 'Mai 2016', year: 2016, pdfUrl: '#' },
  { id: 110, title: 'Certificate de urbanism eliberate in perioada februarie-aprilie 2016', period: 'Februarie - Aprilie 2016', year: 2016, pdfUrl: '#' },
  { id: 111, title: 'Certificate de urbanism eliberate in perioada octombrie 2015-ianuarie 2016', period: 'Octombrie 2015 - Ianuarie 2016', year: 2015, pdfUrl: '#' },
  { id: 112, title: 'Certificate de urbanism eliberate in perioada ianuarie-septembrie 2015', period: 'Ianuarie - Septembrie 2015', year: 2015, pdfUrl: '#' },
  { id: 113, title: 'Certificate de urbanism eliberate in lunile august-noiembrie 2014', period: 'August - Noiembrie 2014', year: 2014, pdfUrl: '#' },
  { id: 114, title: 'Certificate de urbanism eliberate in lunile martie-iulie 2014', period: 'Martie - Iulie 2014', year: 2014, pdfUrl: '#' },
  { id: 115, title: 'Certificate de urbanism eliberate in lunile decembrie 2013-februarie 2014', period: 'Decembrie 2013 - Februarie 2014', year: 2014, pdfUrl: '#' },
  { id: 116, title: 'Certificate de urbanism eliberate in lunile august-noiembrie 2013', period: 'August - Noiembrie 2013', year: 2013, pdfUrl: '#' },
  { id: 117, title: 'Certificate de urbanism eliberate in lunile aprilie-iulie 2013', period: 'Aprilie - Iulie 2013', year: 2013, pdfUrl: '#' },
  { id: 118, title: 'Certificate de urbanism eliberate in lunile ianuarie-martie 2013', period: 'Ianuarie - Martie 2013', year: 2013, pdfUrl: '#' },
  { id: 119, title: 'Certificate de urbanism eliberate in lunile octombrie-decembrie 2012', period: 'Octombrie - Decembrie 2012', year: 2012, pdfUrl: '#' },
  { id: 120, title: 'Certificate de urbanism eliberate in lunile iulie-septembrie 2012', period: 'Iulie - Septembrie 2012', year: 2012, pdfUrl: '#' },
  { id: 121, title: 'Certificate de urbanism eliberate in lunile ianuarie-iunie 2012', period: 'Ianuarie - Iunie 2012', year: 2012, pdfUrl: '#' },
  { id: 122, title: 'Certificate de urbanism eliberate in lunile octombrie-decembrie 2011', period: 'Octombrie - Decembrie 2011', year: 2011, pdfUrl: '#' },
  { id: 123, title: 'Certificate de urbanism eliberate in lunile mai-septembrie 2011', period: 'Mai - Septembrie 2011', year: 2011, pdfUrl: '#' },
  { id: 124, title: 'Certificate de urbanism eliberate in luna aprilie 2011', period: 'Aprilie 2011', year: 2011, pdfUrl: '#' },
  { id: 125, title: 'Certificate de urbanism eliberate in 2011', period: '2011', year: 2011, pdfUrl: '#' },
];

function CertificateCard({ certificate }: { certificate: CertificatePeriod }) {
  return (
    <Card hover>
      <CardContent className="flex items-center justify-between pt-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-teal-700" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{certificate.title}</h3>
            <span className="text-sm text-gray-500 flex items-center gap-1 mt-1">
              <Calendar className="w-4 h-4" />
              {certificate.period}
            </span>
          </div>
        </div>
        <a
          href={certificate.pdfUrl}
          className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-teal-300 transition-colors shrink-0"
        >
          <Download className="w-4 h-4 text-teal-600" />
          PDF
        </a>
      </CardContent>
    </Card>
  );
}

function CertificatesByYear({ certificates, year }: { certificates: CertificatePeriod[]; year: number }) {
  const yearCertificates = certificates.filter(c => c.year === year);
  if (yearCertificates.length === 0) return null;

  return (
    <div className="space-y-3">
      {yearCertificates.map((certificate) => (
        <CertificateCard key={certificate.id} certificate={certificate} />
      ))}
    </div>
  );
}

export default async function CertificateUrbanismPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tPage = await getTranslations({ locale, namespace: 'certificateUrbanismPage' });

  // Group certificates by year
  const currentYears = [...new Set(CURRENT_CERTIFICATES.map(c => c.year))].sort((a, b) => b - a);
  const archiveYears = [...new Set(ARCHIVE_CERTIFICATES.map(c => c.year))].sort((a, b) => b - a);

  return (
    <>
      <Breadcrumbs items={[
        { label: t('informatiiPublice'), href: '/informatii-publice' },
        { label: t('certificateUrbanism') }
      ]} />
      <PageHeader titleKey="certificateUrbanism" icon="home" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            {/* Info Banner */}
            <Card className="mb-8 bg-teal-50 border-teal-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Home className="w-8 h-8 text-teal-600 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-teal-900 mb-2">{tPage('infoTitle')}</h3>
                    <p className="text-teal-800 text-sm">
                      {tPage('infoText')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Certificates Section */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-teal-700" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{tPage('currentTitle')}</h2>
              </div>

              {currentYears.map((year) => (
                <div key={year} className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-700">{year}</h3>
                    <span className="text-sm text-gray-500">
                      ({CURRENT_CERTIFICATES.filter(c => c.year === year).length} {tPage('documents')})
                    </span>
                  </div>
                  <CertificatesByYear certificates={CURRENT_CERTIFICATES} year={year} />
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
                      ({ARCHIVE_CERTIFICATES.filter(c => c.year === year).length} {tPage('documents')})
                    </span>
                  </div>
                  <CertificatesByYear certificates={ARCHIVE_CERTIFICATES} year={year} />
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
