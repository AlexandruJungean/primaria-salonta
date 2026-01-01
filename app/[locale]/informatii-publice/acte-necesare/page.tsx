import { getTranslations } from 'next-intl/server';
import { 
  FileText, 
  Building2, 
  Landmark, 
  Wheat, 
  ChevronDown,
  FileCheck,
  ClipboardList,
  ListChecks
} from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('acteNecesare') };
}

// Types
interface DocumentRequirement {
  id: number;
  title: string;
  items: string[];
  note?: string;
}

interface ServiceSection {
  id: string;
  title: string;
  requirements: string[];
}

// BIROUL URBANISM - Mock data (will be replaced with database)
const URBANISM_DOCUMENTS: DocumentRequirement[] = [
  {
    id: 1,
    title: '1. Documentele necesare emiterii certificatului de urbanism',
    items: [
      'cererea-tip (formularul-model F.1 „CERERE pentru emiterea certificatului de urbanism"), în conformitate cu precizările privind completarea acesteia',
      'planuri cadastrale/topografice, cu evidenţierea imobilelor în cauză, astfel:\n   1. pentru imobilele neînscrise în evidenţele de cadastru şi publicitate imobiliară: plan de încadrare în zonă (la scara 1:10.000, 1:5.000, 1:2.000, 1:1.000 sau 1:500), eliberat de OCPI;\nsau\n   2. pentru imobilele înscrise în evidenţele de cadastru şi publicitate imobiliară: extras din planul cadastral de pe ortofotoplan şi extras de carte funciară pentru informare actualizat la zi, eliberate de OCPI;',
      'documentul de plată a taxei de eliberare a certificatului de urbanism, în copie (calculul taxei se face la camera 11 etaj).',
    ],
  },
  {
    id: 2,
    title: '2. Documente necesare prelungirii valabilităţii certificatului de urbanism',
    items: [
      'cerere-tip (Formularul – model F.7 – „CERERE pentru prelungirea valabilităţii certificatului de urbanism");',
      'certificatul de urbanism emis, în original;',
      'taxa de prelungire a valabilităţii certificatului de urbanism.',
    ],
  },
  {
    id: 3,
    title: '3. Documentele necesare emiterii autorizaţiei de construire/desfiinţare',
    items: [
      'cererea pentru emiterea autorizaţiei de construire, inclusiv anexa – se utilizează formularul model F.8 „CERERE pentru emiterea autorizaţiei de construire/desfiinţare"',
      'certificatul de urbanism, în copie;',
      'extrasul de plan cadastral actualizat la zi şi extrasul de carte funciară de informare actualizat la zi;',
      'documentaţia tehnică, 2 exemplare originale – cu respectarea conţinutului-cadru prezentat în Anexa 1 la Legea 50/1991;',
      'avizele, acordurile, actul administrativ al autorităţii pentru protecţia mediului, studiile de specialitate etc. solicitate prin certificatul de urbanism, în copie;',
      'dovada înregistrării proiectului la OAR şi taxa timbru arhitect, dacă este cazul;',
      'documentele de plată a taxei pentru emiterea autorizaţiei de construire/desfiinţare (calculul taxei se face la camera 11 etaj).',
    ],
  },
  {
    id: 4,
    title: '4. Documente necesare prelungirii valabilităţii autorizaţiei de construire/desfiinţare',
    items: [
      'cerere-tip (Formularul – model F.12 – "CERERE pentru prelungirea valabilităţii autorizaţiei de construire/desfiinţare");',
      'autorizaţia de construire/desfiinţare emisă, în original;',
      'memoriu justificativ;',
      'taxa de prelungire a valabilităţii autorizaţiei de construire/desfiinţare.',
    ],
  },
  {
    id: 5,
    title: '5. Documente necesare pentru regularizarea taxei la autorizaţia de construire/desfiinţare',
    items: [
      'cerere-tip (camera 11 parter) semnată (şi ştampilată în cazul persoanelor juridice)',
      'elemente de identificare a solicitantului:\n   – copie după actul de identitate: C.I./B.I. pentru persoanele fizice\n   – certificat de înregistrare fiscală pentru persoanele juridice',
      'copie după Autorizaţia de construire/desfiinţare',
      'copie Proces-verbal înştiinţare de plată (camera 7 parter)',
      'dovada achitării taxei de regularizare (calculul se face la camera 11 etaj)',
    ],
  },
  {
    id: 6,
    title: '6. Documente necesare pentru eliberarea Certificatului de atestare a edificării/extinderii construcţiei pentru construcţii realizate după 1 aug 2001 – art. 37 alin. (1) din Legea 7/1996',
    items: [
      'cerere tip (camera 11 parter) semnată (şi ştampilată în cazul persoanelor juridice)',
      'elemente de identificare a solicitantului:\n   – copie după actul de identitate: C.I./B.I. pentru persoanele fizice, certificat de înregistrare fiscală pentru persoanele juridice',
      'copie după Autorizaţia de construire',
      'copie Proces-verbal de recepţie',
      'documentaţie cadastrală (topograf autorizat de ANCPI)',
      'document de plată a taxei pentru eliberarea unei adeverinţe (9,00 lei – camera 10 parter)',
    ],
  },
  {
    id: 7,
    title: '7. Documente necesare pentru eliberarea Adeverinţei pentru radierea unei construcţii',
    items: [
      'cerere (camera 11 parter);',
      'elemente de identificare a solicitantului:\n   – copie după actul de identitate: C.I./B.I. pentru persoanele fizice\n   – certificat de înregistrare fiscală pentru persoanele juridice',
      'copie după Autorizaţia de desfiinţare',
      'documentaţie cadastrală (topograf autorizat de ANCPI)',
      'document de plată a taxei pentru eliberarea unei adeverinţe (9,00 lei – camera 10 parter)',
    ],
  },
  {
    id: 8,
    title: '8. Documente necesare pentru eliberarea Adeverinţei privind schimbarea denumirii străzii',
    items: [
      'cerere (camera 11 parter);',
      'copie după actul de identitate: C.I./B.I.',
    ],
  },
  {
    id: 9,
    title: '9. Documente necesare pentru emiterea Certificatului de nomenclatură stradală şi adresă (Anexa 3 la HCLMS 154/19.07.2018)',
    items: [
      '1. cerere – formular model tip – semnată de proprietar/ toţi proprietarii',
      '2. actul de identitate pentru proprietar/ toţi proprietarii – copie tip xerox\n   – în cazul persoanelor juridice, se anexează copia după certificatul de înregistrare fiscală.',
      '3. documentaţia pentru identificarea imobilului:\n   – extras actualizat de carte funciară pentru informare sau copie actualizată după cartea funciară\n   – în cazul apartamentelor din imobilele colective, se anexează şi extras CF/ copie CF colectivă\n   – planuri de situaţie, planuri de încadrare în zonă/localitate, cât şi orice alte planuri/schiţe referitoare la imobil.',
      '4. certificat de rol fiscal actualizat/ istoric de rol fiscal actualizat – după caz',
      '5. documentul de plată a taxei pentru eliberarea certificatului de nomenclatură stradală şi adresă, în valoare de 9,00 lei.',
    ],
  },
  {
    id: 10,
    title: '10. Lista documentelor necesare pentru atribuirea adresei unui număr administrativ nou (Anexa 4 la HCLMS 154/19.07.2018)',
    items: [
      '1. cerere – formular model tip – semnată de proprietar/ toţi proprietarii',
      '2. actul de identitate pentru proprietar/ toţi proprietarii – copie tip xerox\n   ‒ în cazul persoanelor juridice se anexează certificatul de înmatriculare la camera de comerţ şi industrie',
      '3. actul de proprietate/ deţinere dacă actul este:\n   a) contract de vânzare-cumpărare legalizat și extras de carte funciară actualizat\n   b) sentinţa civilă, definitivă şi irevocabilă/executorie (legalizată de instanţele de judecată; raportul de expertiză întocmit în dosarul în cauză sau schiţa/schiţele parte integrantă din tranzacţiile consfinţite de instanţele de judecată – în copie legalizată)\n   c) titlul de proprietate, eliberat conform legii 18/1991, legii 1/2000, legii 247/2005 – copie legalizată (se anexează şi procesul-verbal de punere în posesie, precum şi schiţa anexă – în copie legalizată; în anumite cazuri, se va anexa şi extras de plan parcelar emis de primărie)\n   d) act de lotizare/ dezmembrare/ alipire/ ieşire din indiviziune şi schiţă anexă – copie legalizată (se anexează şi actul de proprietate iniţial – copie tip xerox)\n   e) certificatul/ certificatele de moştenitor (se anexează actul de proprietate – copie legalizată, pentru imobilul care a făcut obiectul succesiunii)\n   f) act/ contract de concesiune încheiat cu municipiul Salonta (se anexează schiţă/ plan/ raport de identificare/ ridicare topografică parte integrantă din actul/ contractul de concesiune – în cazul în care există – copie legalizată)\n   g) pentru procedura de înscriere în cartea funciară a proprietăţilor municipiului (se anexează adresă/adrese privind situaţia juridică/ regim juridic, precum şi schiţa/ planul/ raportul de identificare/ ridicare topografică)',
      '4. documentaţie pentru identificarea imobilului:\n   a) cadastru/ documentaţie (obligatoriu vizată OCPI) coordonate contur, tabel mişcare parcelară/ fişa corpului de proprietate/ fişa bunului imobil, extras de carte funciară şi încheiere de carte funciară (în copie tip xerox)\n   – în cazul în care se constată sarcini: ex. banca – se va solicita acordul scris al acesteia privind atribuirea/schimbarea de adresă poştală/ administrativă; ex. uzufruct viager – se va solicita acordul scris şi copie buletin/ carte de identitate a persoanei care îşi păstrează dreptul de uzufruct viager\n   b) aviz tehnic pentru obţinerea numărului administrativ (eliberat de OCPI)\n   – în cazul în care suprafaţa din aviz este mai mare decât cea din act, se va solicita specificarea acestei diferenţe în documentaţia vizată OCPI, iar adresa de răspuns va conţine clar faptul că număr poştal se va atribui pentru întreaga suprafaţă, cu menţiunea specificată de OCPI\n   – orice alte înscrisuri (planuri, schiţe anexe etc) referitoare la imobilul în cauză',
      '5. certificat de rol fiscal actualizat/ istoric de rol fiscal actualizat – după caz',
      '6. chitanţă – contravaloare 9,00 lei, în original – ce se achită la casieria primăriei',
      '7. dosar – documentaţia precizată mai sus trebuie depusă în dosar cu şină',
    ],
  },
  {
    id: 11,
    title: '11. Documente necesare pentru eliberarea Adeverinţei pentru spaţiu depozitare caroserie autovehicul',
    items: [
      'cerere tip (camera 11 parter) semnată (şi ştampilată în cazul persoanelor juridice)',
      'elemente de identificare a solicitantului:\n   – copie după actul de identitate: C.I./B.I. pentru persoanele fizice, certificat de înregistrare fiscală pentru persoanele juridice',
      'copie certificat de ROL fiscal (camera 7 parter)',
      'copie cartea de identitate a autovehiculului',
      'acordul proprietarului imobilului pentru gararea autovehiculului (dacă solicitantul adeverinţei nu este şi proprietarul imobilului)',
      'fotografii cu vehiculul garat (numărul de circulaţie să fie vizibil)',
      'document de plată a taxei pentru eliberarea unei adeverinţe (9,00 lei – camera 10 parter)',
    ],
  },
  {
    id: 12,
    title: '12. Documentaţie necesară pentru realizarea recepţiei la terminarea lucrărilor',
    items: [
      'convocator comisie de recepţie (formular cam. 11 Parter – se depune la registratura primăriei cu cel puţin 15 zile înainte de data stabilită de beneficiarul autorizaţiei pentru realizarea recepţiei);',
      'dovada achitării cotelor către Inspectoratul de Stat în Construcţii – Bihor;',
    ],
    note: 'La data stabilită pentru recepţie, prin grija beneficiarului, se vor preda reprezentantului primăriei următoarele documente (ele NU se depun împreună cu convocatorul, ci se prezintă pe teren):\n– referatele proiectanţilor (arhitect, structurist, instalaţii etc);\n– referatul dirigintelui de şantier;\n– copii ale tuturor dispoziţiilor de şantier;\n– certificat de performanţă energetică actualizat;\n– plan de situaţie/ Plan de amplasament actualizat, întocmit de topograf autorizat ANCPI;\n– formularul-tip "PROCES-VERBAL DE RECEPŢIE la terminarea lucrărilor" (cam. 11 Parter) 2 exemplare originale',
  },
  {
    id: 13,
    title: '13. Etapa pregătitoare de informare şi consultare a publicului – anunţarea intenţiei de elaborare a documentaţiilor de urbanism PUD/PUZ',
    items: [
      'cerere-tip prin care se solicită demararea procedurii de consultare a publicului;',
      'certificat de urbanism;',
      'actul de proprietate;',
      'propunere panou Model 1 (în format A4) ce va conţine obligatoriu:\n   – planul (estimativ) al procesului de consultare a populaţiei;\n   – datele de contact ale reprezentantului proiectantului;\n   – date de identificare a vecinilor direcţi (nume, adresă de contact);\n   – plan de încadrare/ plan de situaţie cu evidenţierea zonei studiate;',
      'declaraţie autentificată privind corectitudinea datelor;',
    ],
  },
];

// SERVICIUL DE DEZVOLTARE URBANĂ - Mock data
const URBAN_DEVELOPMENT_SERVICES: ServiceSection[] = [
  {
    id: 'permis-spargere',
    title: 'Permis de spargere',
    requirements: [
      'cerere',
      'copie autorizatie de constructie',
      '2 planuri de situatie',
      'contract de refacere încheiat cu persoana fizica/juridica în domeniu sau angajament din partea titularului cererii (daca este cazul)',
      'dovada platii taxei speciale',
    ],
  },
  {
    id: 'amenajari-spatii-verzi',
    title: 'Amenajări, reparații, intervenții spații verzi și locuri de joacă',
    requirements: [
      'solicitare în scris persoana fizica sau juridica cu tabel nominal (asociatii de locatari/proprietari) – solicitanti',
      'schita si miniproiect cu propuneri',
    ],
  },
  {
    id: 'ocupare-domeniu-public',
    title: 'Ocuparea domeniului public cu diferite materiale',
    requirements: [
      'Solicitare în scris care va cuprinde: suprafata ocupata în mp, perioada de depozitare (durata)',
      'Achitare taxa pentru ocuparea domeniului public',
    ],
  },
  {
    id: 'avizare-instrainare-apartament',
    title: 'Avizare adeverințe pentru înstrăinare apartament',
    requirements: [
      'Cerere si adeverinta tip de la camera 19',
      'Extrasul din ultima lista de plata a cotelor de distributie la cheltuielile asociatiei de proprietari (semnat si parafat)',
      'Copia chitantei de plata pe ultima luna',
      'Copie dupa extrasul de carte funciara a proprietatii de înstrainat (nu mai vechi de 30 zile)',
    ],
  },
  {
    id: 'autorizatie-taxi-operatori',
    title: 'Autorizație taxi – operatori transport',
    requirements: [
      'Cererea solicitantului',
      'Certificatul de înmatriculare la Oficiul Registrului Comertului al operatorului de transport ca agent economic, persoana juridica',
      'Codul fiscal al agentului economic',
      'Declaratie notariala din care sa reiasa cota de participare a operatorului de transport si membrilor familiei în alte firme de transport de persoane în regim de taxi',
      'Licenta de transport pentru localitatea de sediu sau exemplarul de serviciu al acesteia pentru o filiala, sucursala sau punct de lucru din alt judet, eliberata de catre agentia Autoritatii Rutiere Române unde operatorul are sediul',
      'Licentele de executie pe vehicul pentru taxiurile care vor fi utilizate sub licenta de transport sau sub exemplarul de serviciu al acesteia, dupa caz, valabila pentru localitatea respectiva, numita localitate de autorizare',
      'Contractele individuale de munca ale conducatorilor auto utilizati în localitatea de autorizare, angajati pe perioada nedeterminata, vizate de autoritatea publica competenta, potrivit legii',
      'Atestatele profesionale ale conducatorilor auto angajati ca taximetristi. Operatorul de transport taxi trebuie sa faca dovada ca are ca angajati proprii cel putin atâtia conducatori auto câte licente de executie pe vehicul detine pentru localitatea respectiva',
      'Certificatul de înmatriculare al autovehiculului',
      'Dovada detinerii legale a autovehiculului în conformitate cu prevederile Legii nr. 38 si a normelor metodologice de aplicare a acesteia aprobate prin Ordinul Ministrului administratiei publice nr. 257/2003',
      'Dovada ca toate taxiurile sunt deservite printr-un dispecer taxi, sub rezerva ca dupa obtinerea autorizatiei taxi, va prezenta copie dupa contractul de deservire încheiat cu un dispecer taxi',
      'Recomandare din partea Camerei taximetristilor, ca filiala a Camerei Nationale a Taximetristilor din România, sau din partea filialei unei asociatii profesionale reprezentative existente, care se va elibera gratuit de catre aceasta',
      'Contract de asistenta tehnica cu un service autorizat',
      'Certificat de atestare fiscala a platii impozitelor si taxelor prevazute de lege, catre bugetul local. Plata impozitelor si taxelor catre bugetul local se va verifica de catre Directia de specialitate din cadrul Primariei Municipiului',
    ],
  },
  {
    id: 'autorizatie-taxi-independenti',
    title: 'Autorizație taxi – independenți',
    requirements: [
      'Cererea solicitantului',
      'Autorizatie eliberata pentru executarea unor activitati economice, conform Legii nr. 507/2002',
      'Licenta de taxi eliberata de agentia Autoritatii Rutiere Române din judetul de domiciliu sau resedinta',
      'Licenta pe vehicul pentru autovehiculul utilizat, detinut în proprietate sau cu contract de leasing, eliberata de agentia Autoritatii Rutiere Române',
      'Atestatul de pregatire profesionala valabil',
      'Certificatul de înmatriculare a autovehiculului si cartea de identitate a vehiculului',
      'Dovada vechimii în activitatea de taximetrie (extras de rol emis de Administratia Financiara)',
      'Dovada ca taximetristul este deservit de un dispecer taxi, sub rezerva ca va prezenta, dupa obtinerea autorizatiei taxi, copie dupa contractul de deservire încheiat cu un dispecer taxi',
      'Recomandare din partea Camerei Taximetristilor, ca filiala a Camerei Nationale a Taximetristilor din România, sau din partea filialei unei asociatii profesionale reprezentative existente, care se va elibera gratuit de catre aceasta',
      'Contract de asistenta tehnica cu un service autorizat',
    ],
  },
  {
    id: 'certificat-vehicule-ocazional',
    title: 'Certificat înmatriculare vehicule care circulă ocazional',
    requirements: [
      'cerere solicitant',
      'Actul de identitate al solicitantului, în original si copie, în cazul persoanelor fizice, sau certificatul de înmatriculare la Oficiul Registrul Comertului, în original si copie, în cazul persoanelor juridice',
      'Actul de proprietatate al vehiculului în original si copie',
      'Dovada efectuarii inspectiei tehnice conform legii',
      'Dovada de plata a contravalorii certificatului de înregistrare, precum si a placutelor cu numarul de înregistrare',
      'Dovada achitarii taxelor catre bugetul local',
    ],
  },
  {
    id: 'adeverinta-licenta-transport',
    title: 'Adeverință pentru obținerea licenței de transport',
    requirements: [
      'Cerere tip',
      'Anexa: Lista cu vehiculele – 2 ex.',
      'Statutul societatii, certificat înmatriculare, sentinta civila',
      'Plan de situatie',
      'Extras CF original si la zi (30 zile)',
      'Contract vânzare-cumparare autentificat (pt. cumparare recenta)',
      'Acord/contract inchiriere autentificat cu proprietarul spatiului',
      'Acord autentificat al colocatarilor (pt. parcare in curte comuna)',
    ],
  },
  {
    id: 'adeverinta-bransare-gaze',
    title: 'Adeverință – accept branșare la rețea de gaze naturale',
    requirements: [
      'Cerere',
      'Tabel nominal și număr apartament anexat (în cazul asociațiilor de proprietari)',
      'Copie extras CF colectiv sau individual, nu mai vechi de 30 zile',
      'Plan de încadrare în zona sau plan de situatie (scara 1:500)',
      'Copie chitanta sau ordin de plata achitare contributie la retea',
      'Adeverinta de la Directia Patrimoniu pentru apartamentul (spatiul) aflat în proprietatea primariei',
      'Copie dupa calculatie debit necesar de gaze naturale întocmita de proiectant autorizat (pentru persoane juridice)',
    ],
  },
];

// BIROUL AGRICOL - Mock data
const AGRICULTURAL_DOCUMENTS = [
  'Solicitare afișare ofertă de vânzare teren agricol',
  'Eliberare adeverință',
  'Solicitare teren agricol în folosință',
  'Eliberare certificat de Producător Agricol',
  'Eliberare bilet de adeverire a proprietății animalelor',
  'Eliberare adeverință teren, animale, etc. înscrise în Reg. agr.',
  'Eliberare adeverință pt. Notariat (terenul face sau nu ob.L18/91)',
  'Solicitare teren agricol în baza L42/90',
  'Diverse cereri cu privire la Legea Fondului Funciar (L18/91)',
  'Solicitare înscriere în registrul agricol cu terenul dobândit',
  'Înregistrare contracte de arendare',
  'Solicitare teren agricol în baza Legii 44/1994',
  'Subvenții pentru agricultură',
  'Diverse',
];

// Component for expandable document section
function DocumentSection({ doc }: { doc: DocumentRequirement }) {
  return (
    <Card className="mb-4">
      <CardHeader className="bg-gray-50">
        <CardTitle className="text-base font-semibold text-gray-900 flex items-start gap-3">
          <FileCheck className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
          <span>{doc.title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <ul className="space-y-3">
          {doc.items.map((item, index) => (
            <li key={index} className="flex items-start gap-3 text-sm text-gray-700">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0 mt-2" />
              <span className="whitespace-pre-line">{item}</span>
            </li>
          ))}
        </ul>
        {doc.note && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800 whitespace-pre-line">
              <strong>Notă:</strong> {doc.note}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Component for service section
function ServiceCard({ service }: { service: ServiceSection }) {
  return (
    <Card className="mb-4">
      <CardHeader className="bg-gray-50">
        <CardTitle className="text-base font-semibold text-gray-900 flex items-start gap-3">
          <ClipboardList className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <span>{service.title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-sm font-medium text-gray-600 mb-3">Acte necesare:</p>
        <ol className="space-y-2">
          {service.requirements.map((req, index) => (
            <li key={index} className="flex items-start gap-3 text-sm text-gray-700">
              <span className="font-semibold text-primary-600 shrink-0">{index + 1}.</span>
              <span>{req}</span>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}

export default async function ActeNecesarePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tPage = await getTranslations({ locale, namespace: 'acteNecesarePage' });

  return (
    <>
      <Breadcrumbs items={[
        { label: t('informatiiPublice'), href: '/informatii-publice' },
        { label: t('acteNecesare') }
      ]} />
      <PageHeader titleKey="acteNecesare" icon="fileText" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            <p className="text-gray-600 mb-8 text-center">
              {tPage('description')}
            </p>

            {/* Quick Navigation */}
            <div className="grid md:grid-cols-3 gap-4 mb-12">
              <a 
                href="#urbanism" 
                className="flex items-center gap-3 p-4 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-primary-600 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-gray-900">{tPage('urbanismOffice')}</span>
              </a>
              <a 
                href="#dezvoltare-urbana" 
                className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center">
                  <Landmark className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-gray-900">{tPage('urbanDevelopmentService')}</span>
              </a>
              <a 
                href="#agricol" 
                className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-600 flex items-center justify-center">
                  <Wheat className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-gray-900">{tPage('agriculturalOffice')}</span>
              </a>
            </div>

            {/* BIROUL URBANISM */}
            <section id="urbanism" className="mb-16 scroll-mt-24">
              <div className="flex items-center gap-4 mb-6 pb-4 border-b-2 border-primary-200">
                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary-700" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{tPage('urbanismOffice')}</h2>
              </div>
              
              <div className="space-y-4">
                {URBANISM_DOCUMENTS.map((doc) => (
                  <DocumentSection key={doc.id} doc={doc} />
                ))}
              </div>
            </section>

            {/* SERVICIUL DE DEZVOLTARE URBANĂ */}
            <section id="dezvoltare-urbana" className="mb-16 scroll-mt-24">
              <div className="flex items-center gap-4 mb-6 pb-4 border-b-2 border-emerald-200">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <Landmark className="w-6 h-6 text-emerald-700" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{tPage('urbanDevelopmentService')}</h2>
              </div>
              
              <div className="space-y-4">
                {URBAN_DEVELOPMENT_SERVICES.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            </section>

            {/* BIROUL AGRICOL */}
            <section id="agricol" className="scroll-mt-24">
              <div className="flex items-center gap-4 mb-6 pb-4 border-b-2 border-amber-200">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                  <Wheat className="w-6 h-6 text-amber-700" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{tPage('agriculturalOffice')}</h2>
              </div>
              
              <Card>
                <CardHeader className="bg-gray-50">
                  <CardTitle className="text-base font-semibold text-gray-900 flex items-start gap-3">
                    <ListChecks className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <span>{tPage('issuedDocuments')}</span>
                    </CardTitle>
                  </CardHeader>
                <CardContent className="pt-4">
                  <ul className="grid md:grid-cols-2 gap-3">
                    {AGRICULTURAL_DOCUMENTS.map((doc, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm text-gray-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-2" />
                            <span>{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
            </section>

          </div>
        </Container>
      </Section>
    </>
  );
}
