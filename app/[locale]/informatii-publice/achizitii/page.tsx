import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { ShoppingCart, ExternalLink, Calendar, Download, FileText, FolderOpen, Archive, ClipboardList } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { Link } from '@/components/ui/link';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('achizitiiPublice') };
}

// Types for procurement documents
interface ProcurementDocument {
  id: number;
  title: string;
  date: string;
  attachments?: { name: string; url: string }[];
}

interface ProcurementGroup {
  id: number;
  date: string;
  documents: { title: string; url?: string }[];
}

// Mock data - will be replaced with database
const REQUIRED_FORMS = [
  { id: 1, title: 'Achiziții publice directe și Achiziții publice – cerere de oferte', url: '#' },
];

const CURRENT_DOCUMENTS: ProcurementGroup[] = [
  {
    id: 1,
    date: '2025-12-31',
    documents: [
      { title: 'Programul Anual de Achiziții Publice pentru anul 2026 (PAAP) – achiziții directe', url: '#' },
    ],
  },
  {
    id: 2,
    date: '2025-12-31',
    documents: [
      { title: 'Programul Anual de Achiziții Publice pentru anul 2025 (PAAP) – achiziții directe (actualizat la 15.12.2025)', url: '#' },
    ],
  },
  {
    id: 3,
    date: '2025-12-16',
    documents: [
      { title: 'Programul Anual de Achiziții Publice pentru anul 2025 (PAAP) – achiziții directe (actualizat la 03.11.2025)', url: '#' },
    ],
  },
  {
    id: 4,
    date: '2025-07-21',
    documents: [
      { title: 'Programul Anual de Achiziții Publice pentru anul 2025 (PAAP) – achiziții directe (actualizat la 04.07.2025)', url: '#' },
    ],
  },
  {
    id: 5,
    date: '2025-04-11',
    documents: [
      { title: 'Programul Anual de Achiziții Publice pentru anul 2025 (PAAP) – proceduri simplificate (rectificat la 02.04.2025)', url: '#' },
      { title: 'Programul Anual de Achiziții Publice pentru anul 2025 (PAAP) – achiziții directe (rectificat la 02.04.2025)', url: '#' },
    ],
  },
  {
    id: 6,
    date: '2025-02-10',
    documents: [
      { title: 'Programul Anual de Achiziții Publice pentru anul 2025 (PAAP) – proceduri simplificate (inițial)', url: '#' },
      { title: 'Programul Anual de Achiziții Publice pentru anul 2025 (PAAP) – achiziții directe (inițial)', url: '#' },
    ],
  },
  {
    id: 7,
    date: '2024-05-28',
    documents: [
      { title: 'Anunț de atribuire contract de concesiune', url: '#' },
    ],
  },
  {
    id: 8,
    date: '2024-03-05',
    documents: [
      { title: 'Programul Anual de Achiziții Publice pentru anul 2024 (PAAP) – proceduri simplificate (inițial)', url: '#' },
      { title: 'Programul Anual de Achiziții Publice pentru anul 2024 (PAAP) – achiziții directe (inițial)', url: '#' },
    ],
  },
  {
    id: 9,
    date: '2023-01-01',
    documents: [
      { title: 'Programul Anual de Achiziții Publice pentru anul 2023 – achiziții directe', url: '#' },
    ],
  },
  {
    id: 10,
    date: '2022-12-21',
    documents: [
      { title: 'Anunț de atribuire a contractului de vânzare', url: '#' },
    ],
  },
  {
    id: 11,
    date: '2020-06-22',
    documents: [
      { title: 'Caiet de sarcini: dirigentie de santier pt. proiectul „Reabilitare si schimbare destinatie in centru de zi Batranii Comunitatii Salonta"', url: '#' },
    ],
  },
  {
    id: 12,
    date: '2020-06-15',
    documents: [
      { title: 'Caiet de sarcini: Prestari servicii de verificare terhnica a proiectarii pt. proiectul „Reabilitare si schimbare destinatie in centru de zi Batranii Comunitatii Salonta"', url: '#' },
    ],
  },
  {
    id: 13,
    date: '2020-04-03',
    documents: [
      { title: 'Semaforizarea trecerilor de pietoni si a intersectiilor din zona centrala a Mun. Salonta – Caiet de sarcini', url: '#' },
      { title: 'Semaforizarea trecerilor de pietoni si a intersectiilor din zona centrala a Mun. Salonta – Lista cantitati', url: '#' },
      { title: 'Semaforizarea trecerilor de pietoni si a intersectiilor din zona centrala a Mun. Salonta – Plan de incadrare in zona', url: '#' },
      { title: 'Semaforizarea trecerilor de pietoni si a intersectiilor din zona centrala a Mun. Salonta – Plan de situatie', url: '#' },
      { title: 'Semaforizarea trecerilor de pietoni si a intersectiilor din zona centrala a Mun. Salonta – Lista utilaje', url: '#' },
    ],
  },
  {
    id: 14,
    date: '2020-03-20',
    documents: [
      { title: 'PAAP actualizat, conform Bugetul aprobat pentru anul 2020', url: '#' },
    ],
  },
  {
    id: 15,
    date: '2019-10-08',
    documents: [
      { title: 'Furnizare mobilier – în cadrul proiectului transfrontalier Salonta-Békéscsaba, Colțul de natură (ROHU-14)', url: '#' },
      { title: 'Furnizare echipamente: binocluri pentru exterior si luneta fieldscope – în cadrul proiectului transfrontalier Salonta-Békéscsaba, Colțul de natură (ROHU-14)', url: '#' },
      { title: 'Furnizare echipamente IT – în cadrul proiectului transfrontalier Salonta-Békéscsaba, Colțul de natură (ROHU-14)', url: '#' },
      { title: 'Furnizare biciclete – în cadrul proiectului transfrontalier Salonta-Békéscsaba, Colțul de natură (ROHU-14)', url: '#' },
    ],
  },
  {
    id: 16,
    date: '2019-07-16',
    documents: [
      { title: 'Caiet de sarcini: Schimbare corpuri de iluminat public existente cu corpuri de iluminat cu LED', url: '#' },
    ],
  },
  {
    id: 17,
    date: '2019-07-08',
    documents: [
      { title: 'Prestari servicii de audit financiar extern pentru proiectul „Reabilitare si schimbare destinatie in centru de zi Batranii comunitatii Salonta" cod SMIS 115240', url: '#' },
    ],
  },
  {
    id: 18,
    date: '2019-06-13',
    documents: [
      { title: 'Solicitare prestari de servicii funerare si conexe in Cimitirul municipal Salonta', url: '#' },
    ],
  },
  {
    id: 19,
    date: '2019-06-11',
    documents: [
      { title: 'Caiet de sarcini: Prestari servicii de informare si publicitate pentru proiectul „Reabilitare si schimbare destinatie in centru de zi Batranii comunitatii Salonta"', url: '#' },
    ],
  },
];

const ARCHIVE_2018: ProcurementGroup[] = [
  {
    id: 100,
    date: '2018-08-22',
    documents: [
      { title: 'Caiet de sarcini pt. reparatii rigole deschise neprotejate si podete de acces la proprietati', url: '#' },
    ],
  },
  {
    id: 101,
    date: '2018-07-30',
    documents: [
      { title: 'Caiet de sarcini pt. reparatii strazi asfaltate, covor asfaltic BA16 de 6 cm', url: '#' },
    ],
  },
  {
    id: 102,
    date: '2018-07-18',
    documents: [
      { title: 'Caiet de sarcini pt. realizarea lucrarilor de reparatii trotuare executate cu imbracaminti din beton in grosime de 10 cm', url: '#' },
    ],
  },
  {
    id: 103,
    date: '2018-07-03',
    documents: [
      { title: 'Caiet de sarcini pentru realizarea lucrarilor de reparatii accese pietonale, executate cu imbracaminti asfaltice de 4 cm grosime', url: '#' },
    ],
  },
  {
    id: 104,
    date: '2018-06-29',
    documents: [
      { title: 'Servicii de realizare materiale promotionale in cadrul proiectului „Conservarea, protejarea și promovarea valorilor naturale din zona transfrontalieră Salonta-Békéscsaba – Colțul de natură (ROHU-14)', url: '#' },
    ],
  },
  {
    id: 105,
    date: '2018-06-19',
    documents: [
      { title: 'Servicii de diseminare in cadrul proiectului „Conservarea, protejarea și promovarea valorilor naturale din zona transfrontalieră Salonta-Békéscsaba – Colțul de natură (ROHU-14)', url: '#' },
    ],
  },
  {
    id: 106,
    date: '2018-06-15',
    documents: [
      { title: 'Caiet de sarcini privind executarea de marcaje rutiere', url: '#' },
      { title: 'Servicii de consultanta in domeniul managementului proiectelor in cadrul proiectului „Conservarea, protejarea și promovarea valorilor naturale din zona transfrontalieră Salonta-Békéscsaba – Colțul de natură (ROHU-14)', url: '#' },
      { title: 'Servicii de consultanta in domeniul managementului financiar al proiectelor in cadrul proiectului „Conservarea, protejarea și promovarea valorilor naturale din zona transfrontalieră Salonta-Békéscsaba – Colțul de natură (ROHU-14)', url: '#' },
      { title: 'Servicii de realizare materiale promotionale in cadrul proiectului „Conservarea, protejarea și promovarea valorilor naturale din zona transfrontalieră Salonta-Békéscsaba – Colțul de natură (ROHU-14)', url: '#' },
    ],
  },
  {
    id: 107,
    date: '2018-06-12',
    documents: [
      { title: 'Modernizarea trotuarului pe strazile Kulin Gyorgy si Tincii', url: '#' },
      { title: 'Achizitionam 170 tone lemne foc esenta tare pt. iarna 2018-2019', url: '#' },
    ],
  },
  {
    id: 108,
    date: '2018-05-30',
    documents: [
      { title: 'Proiectare si executie „Reabilitare instalatie electrica de iluminat public, inlocuire corpuri de iluminat in zona P-ta Democratiei"', url: '#' },
    ],
  },
  {
    id: 109,
    date: '2018-05-14',
    documents: [
      { title: 'Reparatii strazi asfaltate prin plombare in Municipiul Salonta', url: '#' },
      { title: 'Reparatii strazi asfaltate „refacere structura rutiera covor asfaltic BA16 de 6 cm grosime dupa cilindrare" in Municipiul Salonta', url: '#' },
    ],
  },
  {
    id: 110,
    date: '2018-04-26',
    documents: [
      { title: 'Servicii de „Inchiriere utilaj pentru constructii cu operator"', url: '#' },
    ],
  },
  {
    id: 111,
    date: '2018-04-16',
    documents: [
      { title: 'Servicii de traducere in cadrul proiectului „Conservarea, protejarea și promovarea valorilor naturale din zona transfrontalieră Salonta-Békéscsaba – Colțul de natură (ROHU-14)', url: '#' },
    ],
  },
  {
    id: 112,
    date: '2018-04-11',
    documents: [
      { title: 'Servicii de intretinere si reparatii a sistemului de iluminat public din mun. Salonta', url: '#' },
    ],
  },
  {
    id: 113,
    date: '2018-03-27',
    documents: [
      { title: 'Servicii de organizare evenimente in cadrul proiectului „Conservarea, protejarea și promovarea valorilor naturale din zona transfrontalieră Salonta-Békéscsaba – Colțul de natură (ROHU-14)', url: '#' },
      { title: 'Servicii de traducere in cadrul proiectului „Conservarea, protejarea și promovarea valorilor naturale din zona transfrontalieră Salonta-Békéscsaba – Colțul de natură (ROHU-14)', url: '#' },
      { title: 'Notă conceptuală – privind investiția „Sistem de încălzire centrală la clădirea Mun. Salonta, str. Republicii nr. 1"', url: '#' },
      { title: 'Notă conceptuală – privind investiția „Reparații capitale la clădirea Primăriei, schimbarea tâmplăriei exterioare"', url: '#' },
    ],
  },
  {
    id: 114,
    date: '2018-03-12',
    documents: [
      { title: 'Servicii de expert achiziții în cadrul proiectului „Conservarea, protejarea și promovarea valorilor naturale din zona transfrontalieră Salonta-Békéscsaba – Colțul de natură" (ROHU-14)', url: '#' },
    ],
  },
];

const ARCHIVE_2017: ProcurementGroup[] = [
  {
    id: 200,
    date: '2017-10-23',
    documents: [
      { title: 'Caiet de sarcini privind „Amenajare spatii verzi pe str. Arany Janos"', url: '#' },
      { title: 'Semaforizarea trecerilor de pietoni si intersectiilor din zona centrala a Mun. Salonta, strazile P-ta Libertatii si str. Republicii', url: '#' },
    ],
  },
  {
    id: 201,
    date: '2017-10-04',
    documents: [
      { title: 'Lucrari de reparatii accese pietonale executate cu imbracaminti asfaltice de 4 cm grosime, in mun. Salonta', url: '#' },
    ],
  },
  {
    id: 202,
    date: '2017-09-04',
    documents: [
      { title: 'Caiet de sarcini privind refacerea structurii rutiere dupa lucrari de canalizatie menajera si alimentare cu apa in Municipiul Salonta + Lista cuprinzand cantitatile de lucrari', url: '#' },
    ],
  },
  {
    id: 203,
    date: '2017-07-24',
    documents: [
      { title: 'Nota conceptuala privind necesitatea si oportunitatea realizarii obiectivului de investitie „Modernizarea sistemului de incalzire al cladirii Primariei Municipiului Salonta, str. Republicii nr. 1"', url: '#' },
    ],
  },
  {
    id: 204,
    date: '2017-06-27',
    documents: [
      { title: 'Reparatii curente strazi in mun. Salonta, executie', url: '#' },
    ],
  },
  {
    id: 205,
    date: '2017-06-13',
    documents: [
      { title: 'Rigole deschise pentru colectarea si deversarea apelor meteorice si podete de acces spre proprietati pe strazile: Goethe, N. Grigorescu, Leonardo da Vinci, Rozvany Gyorgy, Mikszath Kalman, Liszt Ferencz, Bercsenyi Miklos, Pacii si J. Calvin din mun. Salonta + Deviz', url: '#' },
    ],
  },
  {
    id: 206,
    date: '2017-06-06',
    documents: [
      { title: 'Reparatii curente strazi in municipiul Salonta', url: '#' },
    ],
  },
  {
    id: 207,
    date: '2017-05-22',
    documents: [
      { title: 'Nota conceptuala privind obiectivul de investitii: Cvartalul de blocuri cuprins intre strazile Oradiei – Octavian Goga – Zilahy Lajos', url: '#' },
    ],
  },
  {
    id: 208,
    date: '2017-02-22',
    documents: [
      { title: 'Proiectul stemei municipiului Salonta', url: '#' },
    ],
  },
];

const ARCHIVE_2016: ProcurementGroup[] = [
  {
    id: 300,
    date: '2016-10-11',
    documents: [
      { title: 'Caiet de sarcini pentru Servicii de arhivare si selectionare a documentelor, pt. Primaria Municipiului Salonta', url: '#' },
    ],
  },
  {
    id: 301,
    date: '2016-10-06',
    documents: [
      { title: 'Decizie de anulare a procedurii de achizitie publica: „Reabilitare si modernizare str. Bocskai István din Municipiul Salonta"', url: '#' },
    ],
  },
  {
    id: 302,
    date: '2016-09-18',
    documents: [
      { title: 'Reabilitare si modernizare str. Bocskai István din Municipiul Salonta', url: '#' },
      { title: 'Proiect tehnic si caietul de sarcini', url: '#' },
      { title: 'Liste cantitati reduse', url: '#' },
      { title: 'Formulare achizitii', url: '#' },
    ],
  },
  {
    id: 303,
    date: '2016-07-29',
    documents: [
      { title: 'Consultanta si asistenta tehnica (dirigentie de santier) in derularea investitiei: „Extindere retea de canalizare menajera in mun. Salonta – str. Bercsenyi Miklos, Ion Creanga si Ioan Slavici si realizare racorduri"', url: '#' },
    ],
  },
  {
    id: 304,
    date: '2016-07-22',
    documents: [
      { title: 'Solicitare oferta de pret pentru achizitia a 170 tone lemne de foc, esenta tare, pentru iarna 2016/2017', url: '#' },
      { title: 'Caietul de sarcini', url: '#' },
      { title: 'Formulare', url: '#' },
    ],
  },
  {
    id: 305,
    date: '2016-07-08',
    documents: [
      { title: 'Serviciul de consultanta si dirigentie de santier pentru lucrarea de reabilitare si modernizare str. Arany János din mun. Salonta', url: '#' },
    ],
  },
  {
    id: 306,
    date: '2016-03-04',
    documents: [
      { title: 'Consultare si asistenta tehnica (dirigentie de santier) in derularea investitiei: „Reabilitare Casa Roth – interventii de prima urgenta si reabilitare fatada la Casa Roth Armin, Salonta, Piata Libertatii nr. 8"', url: '#' },
    ],
  },
  {
    id: 307,
    date: '2016-03-01',
    documents: [
      { title: 'Reabilitare Casa Roth – interventii de prima urgenta si reabilitare fatada la Casa Roth Armin, Salonta, Piata Libertatii nr. 8', url: '#' },
    ],
  },
  {
    id: 308,
    date: '2016-02-05',
    documents: [
      { title: 'Serviciul de consultanta si dirigentie de santier pt. lucrarea de reabilitare si modernizare str. Kossuth din mun. Salonta', url: '#' },
    ],
  },
];

function DocumentGroup({ group, locale }: { group: ProcurementGroup; locale: string }) {
  const formattedDate = new Date(group.date).toLocaleDateString(locale === 'hu' ? 'hu-HU' : locale === 'en' ? 'en-GB' : 'ro-RO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <Card hover>
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-primary-700" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>{formattedDate}</span>
            </div>
            <ul className="space-y-2">
              {group.documents.map((doc, index) => (
                <li key={index}>
                  <a
                    href={doc.url || '#'}
                    className="flex items-start gap-2 text-gray-700 hover:text-primary-700 transition-colors group"
                  >
                    <Download className="w-4 h-4 mt-0.5 shrink-0 text-gray-400 group-hover:text-primary-600" />
                    <span className="flex-1">{doc.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ArchiveSection({ 
  title, 
  groups, 
  locale 
}: { 
  title: string; 
  groups: ProcurementGroup[]; 
  locale: string;
}) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
          <Archive className="w-5 h-5 text-amber-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      </div>
      <div className="space-y-3">
        {groups.map((group) => (
          <DocumentGroup key={group.id} group={group} locale={locale} />
        ))}
      </div>
    </div>
  );
}

export default async function AchizitiiPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tPage = await getTranslations({ locale, namespace: 'achizitiiPage' });

  return (
    <>
      <Breadcrumbs items={[
        { label: t('informatiiPublice'), href: '/informatii-publice' },
        { label: t('achizitiiPublice') }
      ]} />
      <PageHeader titleKey="achizitiiPublice" icon="shoppingCart" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            {/* SEAP Link */}
            <div className="flex items-center justify-center gap-4 mb-8 p-4 bg-primary-50 rounded-xl">
              <span className="text-gray-700">{tPage('seapNote')}</span>
              <a
                href="https://www.e-licitatie.ro"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary-700 hover:underline inline-flex items-center gap-1"
              >
                SEAP (e-licitatie.ro) <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Required Forms Section */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-primary-600" />
                  {tPage('requiredForms')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {REQUIRED_FORMS.map((form) => (
                    <li key={form.id}>
                      <Link
                        href={form.url}
                        className="flex items-center gap-2 text-gray-700 hover:text-primary-700 transition-colors"
                      >
                        <Download className="w-4 h-4 text-primary-500" />
                        <span>{form.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                  </CardContent>
                </Card>

            {/* Current Documents */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-primary-700" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{tPage('currentDocuments')}</h2>
              </div>
              <div className="space-y-3">
                {CURRENT_DOCUMENTS.map((group) => (
                  <DocumentGroup key={group.id} group={group} locale={locale} />
                ))}
              </div>
            </div>

            {/* Archives */}
            <ArchiveSection title={tPage('archive2018')} groups={ARCHIVE_2018} locale={locale} />
            <ArchiveSection title={tPage('archive2017')} groups={ARCHIVE_2017} locale={locale} />
            <ArchiveSection title={tPage('archive2016')} groups={ARCHIVE_2016} locale={locale} />
          </div>
        </Container>
      </Section>
    </>
  );
}
