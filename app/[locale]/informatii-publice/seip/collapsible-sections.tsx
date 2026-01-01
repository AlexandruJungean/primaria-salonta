'use client';

import { useState } from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';

interface Section {
  id: string;
  title: string;
  legalRef?: string;
  penalty?: string;
  content: React.ReactNode;
}

interface CollapsibleSectionProps {
  section: Section;
  defaultOpen?: boolean;
}

function CollapsibleSection({ section, defaultOpen = false }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden ${isOpen ? 'bg-gray-50' : 'bg-white'}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-4 hover:bg-gray-100 transition-colors text-left ${isOpen ? 'bg-white border-b border-gray-200' : ''}`}
      >
        <div>
          <h3 className="font-semibold text-gray-900">{section.title}</h3>
          {section.legalRef && (
            <p className="text-xs text-gray-500 mt-0.5">{section.legalRef}</p>
          )}
        </div>
        <ChevronDown 
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-4 space-y-4">
          {section.penalty && (
            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span className="text-amber-800">{section.penalty}</span>
            </div>
          )}
          {section.content}
        </div>
      </div>
    </div>
  );
}

function RequiredDocsList({ items }: { items: string[] }) {
  return (
    <div>
      <h4 className="font-medium text-gray-900 mb-2 text-sm uppercase tracking-wide">Acte necesare:</h4>
      <ul className="space-y-1.5">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
            <span className="w-1.5 h-1.5 bg-primary-500 rounded-full shrink-0 mt-2" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
      <strong>Notă:</strong> {children}
    </div>
  );
}

// Evidence Department Sections
const EVIDENTA_SECTIONS: Section[] = [
  {
    id: 'prima-eliberare',
    title: 'Prima eliberare',
    legalRef: 'Conf. art. 13 alin. (2) din OUG 97/2005, aprobată prin Legea 290/2005',
    penalty: 'Sancțiunea contravențională: 25-50 RON',
    content: (
      <div className="space-y-4">
        <p className="text-sm text-gray-700">
          La împlinirea vârstei de 14 ani, minorul depune cererea pentru eliberarea primului act de identitate, 
          însoțit de unul dintre părinți sau, după caz, de reprezentantul său legal, de persoana desemnată 
          din cadrul centrului specializat, aflat sub autoritatea Serviciului Public de Asistență Socială 
          sau de persoana căreia i-a fost încredințat în plasament.
        </p>
        <RequiredDocsList items={[
          'Certificat de naștere (original + copie)',
          'Actul de identitate al unuia din părinți (de preferință al mamei) sau al reprezentantului său legal (original + copie)',
          'Certificatul de căsătorie al părinților (original + copie)',
          'Act cu care se face dovada stabilirii domiciliului (original)',
          'Contravaloarea cărții de identitate: 7 RON, se achită la casieria Primăriei',
          'Fotografia pentru cartea de identitate se realizează în cadrul Biroului Evidență Populației, prin preluarea unei imagini video, și este inclusă în preț',
          'Timbru fiscal: 1 RON - se poate achita la casieria Primăriei sau pot fi cumpărate timbre fiscale de la oficiile poștale',
        ]} />
        <Note>
          <ul className="list-disc list-inside space-y-1 mt-1">
            <li>În cazul în care părinții au domicilii diferite, aceștia vor da declarație cu privire la adresa unde minorul are domiciliul stabil.</li>
            <li>În cazul în care părinții sunt divorțați, se prezintă și hotărârea judecătorească definitivă din care rezultă cui a fost încredințat minorul.</li>
            <li>În cazul încredințării minorului unui reprezentant legal, acesta trebuie să prezinte hotărârea de încredințare tutelară (originală) eliberată de autoritatea tutelară de la locul de domiciliu.</li>
          </ul>
        </Note>
        <p className="text-sm text-gray-600 italic">
          Dacă solicitantul nu poate prezenta unul sau mai multe din documentele de mai sus, 
          atunci i se va elibera o carte de identitate provizorie.
        </p>
      </div>
    ),
  },
  {
    id: 'dobandire-cetatenie',
    title: 'Eliberarea actelor de identitate ca urmare a dobândirii cetățeniei române',
    content: (
      <div className="space-y-4">
        <RequiredDocsList items={[
          'Cerere pentru eliberarea actului de identitate (pentru minori, cererile vor fi semnate și de părinți)',
          'Certificatul constatator privind dobândirea cetățeniei române eliberat de Ministerul Justiției sau misiunile diplomatice ori oficiile consulare ale României în străinătate (în original și două copii xerox) sau adeverința eliberată de Serviciul pentru Probleme de Migrări și Cetățenie din cadrul Direcției Generale de Pașapoarte',
          'Certificatele de naștere și de căsătorie (dacă este cazul), certificatele de naștere ale copiilor sub 14 ani, eliberate de autoritățile române, în original și copie xerox',
          'Hotărârea de divorț definitivă și irevocabilă (dacă este cazul), în original și copie xerox',
          'Documentele cu care se face dovada domiciliului',
          'Un document cu fotografie cu care se face dovada identității, în original și copie xerox (act de identitate străin, pașaport, permis de conducere, etc.)',
          'Chitanța reprezentând contravaloarea cărții de identitate (7 RON) achitată la Casieria Primăriei',
          'Taxa timbru 1 RON achitată la Casieria Primăriei',
          'Legitimația eliberată de Autoritatea pentru Străini - aceasta se va preda la data la care se eliberează actul de identitate',
        ]} />
        <Note>
          Minorii care au împlinit vârsta de 14 ani și nu sunt înscriși în certificatul constatator al unuia dintre părinți, 
          se vor adresa Serviciului pentru Probleme de Migrări și Cetățenie din cadrul Direcției Generale de Pașapoarte, 
          pentru clarificarea situației.
        </Note>
      </div>
    ),
  },
  {
    id: 'restabilire-domiciliu',
    title: 'Restabilirea domiciliului în România',
    content: (
      <div className="space-y-4">
        <p className="text-sm text-gray-700">
          Cetățenii români cu domiciliul în străinătate care doresc să-și schimbe domiciliul în România 
          se prezintă la Serviciul Public Comunitar de Evidență a Persoanelor, pe a cărui rază teritorială 
          este situat imobilul unde își stabilesc domiciliul.
        </p>
        <RequiredDocsList items={[
          'Cerere tip pentru eliberarea actului de identitate, ca urmare a schimbării domiciliului din străinătate în România',
          'Pașaportul românesc valabil sau expirat, original și copie, ori certificatul constatator privind dobândirea cetățeniei române, emis de Ministerul Justiției sau de misiunile diplomatice și oficiile consulare ale României din străinătate, original și copie',
          'Actul de identitate și/sau pașaportul, eliberate de autoritățile străine, original și copie; pentru pașaport sunt necesare copii ale filei informatizate și ale filelor destinate aplicării vizelor și ștampilelor autorităților de frontieră',
          'Taxa consulară pentru restabilire 41 RON, se achită la CEC',
          'Certificatele de stare civilă, care trebuie să fie emise de oficiile de stare civilă din România; pentru hotărârile judecătorești privind statutul civil al titularului, pronunțate în străinătate și investite cu formula executorie, se prezintă copii traduse și legalizate',
          'Chitanța reprezentând contravaloarea cărții de identitate (7 RON) achitată la Casieria Primăriei',
          'Timbru fiscal în valoare de 1 RON',
        ]} />
        <Note>
          <ul className="list-disc list-inside space-y-1 mt-1">
            <li>Solicitanții a căror naștere sau căsătorie nu a fost înregistrată în registrele de stare civilă române, vor solicita transcrierea certificatelor de stare civilă obținute în străinătate, atât pentru ei, cât și pentru copiii minori.</li>
            <li>În situația în care numai unul dintre părinți își schimbă domiciliul din străinătate în România, împreună cu copiii minori, este necesar consimțământul celuilalt părinte, dat în formă autentică la notarul public, sau copia hotărârii judecătorești prin care copiii au fost încredințați părintelui care își schimbă domiciliul în România.</li>
          </ul>
        </Note>
      </div>
    ),
  },
  {
    id: 'schimbare-nume',
    title: 'Schimbare de nume',
    legalRef: 'Conform art. 18 din OUG 97/2005',
    penalty: 'Sancțiunea contravențională: 25-50 RON',
    content: (
      <div className="space-y-4">
        <p className="text-sm text-gray-700">
          În termen de 15 zile de la modificarea numelui, prenumelui titularului, prenumele părinților, 
          data sau locul nașterii, ca urmare a căsătoriei, divorțului sau pe cale administrativă, 
          persoana fizică în cauză ori reprezentantul său legal are obligația să solicite formațiunii 
          de evidență a populației eliberarea unei noi cărți de identitate.
        </p>
        <RequiredDocsList items={[
          'Act de identitate: Buletin de identitate / Carte de identitate și cartea de alegător / Carte de identitate provizorie',
          'Certificat de naștere (original + copie)',
          'Certificat de căsătorie, după caz (original + copie)',
          'Certificate de naștere ale copiilor sub 14 ani (originale + copii)',
          'Hotărâre judecătorească definitivă (după caz)',
          'Decizia de schimbare a numelui, prenumelui (după caz)',
          'Act cu care se face dovada stabilirii domiciliului (original + copie)',
          'Contravaloarea cărții de identitate: 7 RON, se achită la casieria Primăriei',
          'Fotografia pentru cartea de identitate se realizează în cadrul Biroului Evidență Populației, prin preluarea unei imagini video, și este inclusă în preț',
          'Timbru fiscal: 1 RON - se poate achita la casieria Primăriei',
        ]} />
        <p className="text-sm text-gray-600 italic">
          Dacă solicitantul nu poate prezenta unul sau mai multe din documentele de mai sus, 
          atunci i se va elibera o carte de identitate provizorie.
        </p>
      </div>
    ),
  },
  {
    id: 'resedinta',
    title: 'Reședință',
    legalRef: 'Conform art. 23 din OUG 97/2005',
    penalty: 'Sancțiunea contravențională: 75-150 RON',
    content: (
      <div className="space-y-4">
        <p className="text-sm text-gray-700">
          Persoana care locuiește temporar mai mult de 45 de zile la altă adresă decât cea de domiciliu, 
          este obligată să se prezinte la formațiunea de evidență a populației pentru înscrierea, 
          în cartea de identitate și în documentele de evidență, a mențiunii de stabilire a reședinței.
        </p>
        <p className="text-sm text-gray-700">
          Mențiunea de stabilire a reședinței se acordă pentru perioada solicitată, dar nu mai mare de un an, 
          și are valabilitate pe timpul cât persoana locuiește la reședința stabilită. 
          La expirarea acestui termen, persoana poate solicita înscrierea unei noi mențiuni de stabilire a reședinței.
        </p>
        <RequiredDocsList items={[
          'Act de identitate al solicitantului',
          'Act de identitate al găzduitorului',
          'Certificat de naștere și căsătorie solicitant, după caz',
          'Act cu care se face dovada stabilirii reședinței (al găzduitorului)',
          'Timbru fiscal: 1 RON - se poate achita la casieria Primăriei',
        ]} />
        <Note>
          Formularul pentru acordarea vizei de reședință se eliberează la Biroul Evidență Populației; 
          se completează de către solicitant și găzduitor.
        </Note>
      </div>
    ),
  },
  {
    id: 'expirare',
    title: 'Expirare',
    legalRef: 'Conform art. 18 din OUG 97/2005',
    penalty: 'Sancțiunea contravențională: 25-50 RON',
    content: (
      <div className="space-y-4">
        <p className="text-sm text-gray-700">
          Cu cel puțin 15 zile înainte de expirarea termenului de valabilitate a cărții de identitate, 
          persoana fizică în cauză ori reprezentantul său legal are obligația să solicite formațiunii 
          de evidență a populației eliberarea unei noi cărți de identitate.
        </p>
        <RequiredDocsList items={[
          'Certificat de naștere (original + copie)',
          'Certificat de căsătorie, după caz (original + copie)',
          'Certificate de naștere ale copiilor sub 14 ani (originale + copii)',
          'Act de identitate: Buletin de identitate / Carte de identitate și cartea de alegător / Carte de identitate provizorie',
          'Act cu care se face dovada stabilirii domiciliului (original + copie)',
          'Contravaloarea cărții de identitate: 7 RON, se achită la casieria Primăriei',
          'Fotografia pentru cartea de identitate se realizează în cadrul Biroului Evidență Populației, prin preluarea unei imagini video, și este inclusă în preț',
          'Timbru fiscal: 1 RON - se poate achita la casieria Primăriei',
        ]} />
        <p className="text-sm text-gray-600 italic">
          Dacă solicitantul nu poate prezenta unul sau mai multe din documentele de mai sus, 
          atunci i se va elibera o carte de identitate provizorie.
        </p>
      </div>
    ),
  },
  {
    id: 'domiciliu',
    title: 'Domiciliu',
    legalRef: 'Conform art. 18 din OUG 97/2005',
    penalty: 'Sancțiunea contravențională: 75-150 RON',
    content: (
      <div className="space-y-4">
        <p className="text-sm text-gray-700">
          Persoana care își schimbă domiciliul este obligată ca, în termen de 15 zile de la data mutării 
          la noua adresă, să se prezinte la formațiunea de evidență a populației pentru eliberarea 
          unei noi cărți de identitate.
        </p>
        <RequiredDocsList items={[
          'Act de identitate (în cazul cărții de identitate se prezintă și cartea de alegător)',
          'Certificat de naștere (original + copie)',
          'Certificat de căsătorie, după caz (original + copie)',
          'Certificate de naștere ale copiilor sub 14 ani (originale + copii)',
          'Act cu care se face dovada stabilirii domiciliului (original și copie – câte una pentru fiecare persoană cu act de identitate)',
          'Dovada de la Centrul Militar Județean pentru luare în evidență la noua adresă, după caz',
          'Contravaloarea cărții de identitate: 7 RON, se achită la casieria Primăriei',
          'Fotografia pentru cartea de identitate se realizează în cadrul Biroului Evidență Populației, prin preluarea unei imagini video, și este inclusă în preț',
          'Timbru fiscal: 1 RON - se poate achita la casieria Primăriei',
        ]} />
        <Note>
          În situația în care solicitantul nu este titularul actului doveditor al stabilirii domiciliului, 
          este necesară prezența titularului pentru a-și exprima consimțământul în vederea stabilirii domiciliului.
        </Note>
        <p className="text-sm text-gray-600 italic">
          Dacă solicitantul nu poate prezenta unul din certificatele de stare civilă de mai sus, 
          atunci i se va elibera o carte de identitate provizorie.
        </p>
      </div>
    ),
  },
  {
    id: 'deteriorare-pierdere-furt',
    title: 'Deteriorare / Pierdere / Furt',
    legalRef: 'Conform art. 13 alin. (5) din OUG 95/2005',
    penalty: 'Sancțiunea contravențională: 25-50 RON',
    content: (
      <div className="space-y-4">
        <p className="text-sm text-gray-700">
          În termen de 15 zile de la deteriorarea, distrugerea, pierderea sau furtul actului de identitate, 
          persoana fizică în cauză ori reprezentantul său legal are obligația să solicite formațiunii 
          de evidență a populației eliberarea unei noi cărți de identitate.
        </p>
        <RequiredDocsList items={[
          'Certificat de naștere (original + copie)',
          'Certificat de căsătorie, după caz (original + copie)',
          'Certificate de naștere ale copiilor sub 14 ani (originale + copii)',
          'Act cu care se face dovada stabilirii domiciliului (original + copie)',
          'Un document cu fotografie pentru atestarea identității (original și copie xerox)',
          'În cazul furtului, dovada obținută de la organul de poliție pe raza căruia s-a produs furtul (original și copie xerox)',
          'Cartea de alegător, dacă e cazul și nu a fost pierdută, furată sau deteriorată',
          'Contravaloarea cărții de identitate: 7 RON, se achită la casieria Primăriei',
          'Fotografia pentru cartea de identitate se realizează în cadrul Biroului Evidență Populației, prin preluarea unei imagini video, și este inclusă în preț',
          'Timbru fiscal: 4 RON - se poate achita la casieria Primăriei',
        ]} />
        <p className="text-sm text-gray-600 italic">
          Dacă solicitantul nu poate prezenta unul sau mai multe din documentele de mai sus, 
          atunci i se va elibera o carte de identitate provizorie.
        </p>
      </div>
    ),
  },
  {
    id: 'carte-identitate-provizorie',
    title: 'Cartea de identitate provizorie',
    legalRef: 'Conform art. 19 din OUG 97/2005',
    content: (
      <div className="space-y-4">
        <p className="text-sm text-gray-700">
          Cartea de identitate provizorie se eliberează când persoana fizică care solicită eliberarea 
          cărții de identitate nu posedă toate actele necesare (certificate de stare civilă, 
          act doveditor al stabilirii domiciliului) eliberării acesteia, sau în cazul când persoana 
          fizică care solicită eliberarea cărții de identitate nu are spațiu de locuit asigurat.
        </p>
        <RequiredDocsList items={[
          'Act de identitate (dacă nu e pierdut, furat, distrus sau deteriorat): Buletin de identitate / Carte de identitate și carte de alegător / Carte de identitate provizorie',
          'Certificat de naștere (original) – dacă nu e pierdut',
          'Certificat de căsătorie, după caz (original) – dacă nu e pierdut',
          'Act care face dovada stabilirii domiciliului (original) – dacă există',
          '3 fotografii tip act de identitate (30/40 mm cu bandă albă de 4 mm în partea de jos a fotografiei) – aceste fotografii se realizează la atelierele foto de pe raza municipiului Oradea',
          'Contravaloarea cărții de identitate provizorii: 1 RON, se achită la casieria Primăriei',
          'Timbru fiscal: 1 RON sau 4 RON (în cazul pierderii, furtului sau deteriorării vechiului act de identitate) - se poate achita la casieria Primăriei',
        ]} />
      </div>
    ),
  },
];

// Civil Status Department Sections
const STARE_CIVILA_SECTIONS: Section[] = [
  {
    id: 'inregistrare-nastere',
    title: 'Înregistrarea nașterii',
    content: (
      <RequiredDocsList items={[
        'Certificatul constatator al nașterii eliberat de Spitalul Salonta sau Cabinete Med. Indiv.',
        'Cărțile / buletinele de identitate ale soților în original',
        'Certificatul de căsătorie în original al părinților',
        'Certificatul de naștere al mamei în cazul în care părinții nu sunt căsătoriți',
        'Declarația de recunoaștere a paternității și a stabilirii numelui copilului în cazul în care părinții nu sunt căsătoriți',
        'Cerere de înregistrarea tardivă a nașterii după trecerea termenului stabilit de lege – se taxează cu taxă timbru (se achită la Casieria Primăriei)',
      ]} />
    ),
  },
  {
    id: 'inregistrare-deces',
    title: 'Înregistrarea decesului',
    content: (
      <RequiredDocsList items={[
        'Certificatul constatator al decesului eliberat de spital, cabinetele individuale ale medicilor de familie',
        'Cartea / Buletinul de identitate al decedatului',
        'Certificatul de naștere, certificatul de căsătorie originale al decedatului',
        'Aprobarea organelor de poliție în cazul morții violente',
        'Aprobarea procuraturii în cazul trecerii termenului de înregistrare stabilit prin lege',
        'Cartea / buletinul de identitate al celui care declară decesul',
      ]} />
    ),
  },
  {
    id: 'inregistrare-casatorie',
    title: 'Înregistrarea căsătoriei',
    content: (
      <RequiredDocsList items={[
        'Certificatele medicale prenupțiale eliberate de medicii de familie',
        'Cărțile / buletinele de identitate ale viitorilor soți',
        'Copie xerox și originalul certificatelor de naștere',
        'După caz: sentințe de divorț originale, definitive și irevocabile, copie xerox al certificatului de deces',
        'Taxa specială pentru oficierea căsătoriilor în zilele de repaus',
        'Taxă timbru (se achită la casieria Primăriei)',
        'Cerere eliberare livret de familie',
        'Cerere eliberare autorizație pentru nuntă',
      ]} />
    ),
  },
  {
    id: 'eliberare-certificate-pierdere',
    title: 'Eliberare certificate în caz de pierdere, deteriorare',
    content: (
      <RequiredDocsList items={[
        'Cererea prin care se solicită certificatul respectiv',
        'Cartea / buletinul de identitate al solicitantului, valabilă',
        'Taxe speciale: pentru eliberare, regim de urgență, identificări persoane',
        'Taxă de timbru',
        'Taxă amendă în cazul eliberării triplicatului (se achită la Casieria Primăriei)',
        'Copie xerox al pașaportului în cazul cetățenilor străini',
        'Procură specială în cazul solicitării certificatului de către alte persoane decât cele prevăzute în lege',
      ]} />
    ),
  },
  {
    id: 'alocatie-copil',
    title: 'Cerere alocație pentru copil nou născut',
    content: (
      <RequiredDocsList items={[
        'Cererea tipizată pentru eliberarea alocației',
        'Declarația tip dată pe propria răspundere',
        'Copiile xerox ale copiilor',
        'Copia xerox al buletinului mamei',
        'După caz: adeverință de la Primăria locului de înregistrare a nașterii copilului',
        'După caz: sentințe de divorț, certificat de căsătorie',
      ]} />
    ),
  },
  {
    id: 'livret-familie',
    title: 'Eliberarea livretului de familie',
    content: (
      <RequiredDocsList items={[
        'Cererea tip a capului de familie',
        'Buletinele soților în original',
        'Certificatele de naștere ale copiilor în original',
        'Certificatul de căsătorie',
        'După caz: sentințe de divorț, de încredințare, certificat deces etc.',
        'După caz: nota internă de la autoritatea tutelară',
      ]} />
    ),
  },
  {
    id: 'transcriere-acte',
    title: 'Transcrierea actelor de stare civilă la cerere',
    content: (
      <RequiredDocsList items={[
        'Cererea solicitantului',
        'Certificatul de stare civilă în original și copia xerox',
        'Traducerea legalizată a certificatului și copia xerox',
        'Copia actului de identitate pentru dovedirea ultimului domiciliu',
        'Copii xerox ale certificatelor de naștere, căsătorie, sentință divorț după caz',
        'Taxa specială pentru transcriere',
        'Taxă de timbru (se achită la Casieria Primăriei)',
      ]} />
    ),
  },
  {
    id: 'inregistrare-divorturi',
    title: 'Înregistrarea divorțurilor la cerere',
    content: (
      <RequiredDocsList items={[
        'Cererea solicitantului',
        'Sentința de divorț',
        'Taxă timbru',
      ]} />
    ),
  },
  {
    id: 'schimbare-nume-stare-civila',
    title: 'Schimbare de nume',
    content: (
      <RequiredDocsList items={[
        'Cererea tip a solicitantului',
        'Copii xerox ale certificatelor de stare civilă',
        'Taxă de timbru',
        'Monitorul Oficial privind publicarea cererii de schimbare de nume',
        'Cazierul judiciar și fiscal al celui în cauză',
      ]} />
    ),
  },
  {
    id: 'inregistrare-adoptii',
    title: 'Înregistrarea adopțiilor',
    content: (
      <RequiredDocsList items={[
        'Cererea solicitantului',
        'Sentința civilă de adopție',
        'Taxă de timbru',
      ]} />
    ),
  },
  {
    id: 'eliberare-arhiva',
    title: 'Eliberarea cererilor din arhivă',
    content: (
      <RequiredDocsList items={[
        'Cererea solicitantului',
        'Taxă specială',
        'Taxă de timbru (se achită la Casieria Primăriei)',
      ]} />
    ),
  },
];

interface DepartmentProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  sections: Section[];
  defaultOpen?: boolean;
}

function Department({ title, description, icon, iconBg, sections, defaultOpen = false }: DepartmentProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`border-2 border-gray-200 rounded-xl overflow-hidden ${isOpen ? 'bg-white' : 'bg-gray-50'}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 hover:bg-gray-100 transition-colors text-left"
      >
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-xl ${iconBg} flex items-center justify-center`}>
            {icon}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400 hidden sm:block">{sections.length} servicii</span>
          <ChevronDown 
            className={`w-6 h-6 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          />
        </div>
      </button>
      
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[20000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-5 pt-0 space-y-3 border-t border-gray-200">
          {sections.map((section, idx) => (
            <CollapsibleSection 
              key={section.id} 
              section={section} 
              defaultOpen={idx === 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function SeipCollapsibleSections() {
  return (
    <div className="space-y-6">
      <Department
        title="1. Compartimentul de Evidență"
        description="Acte de identitate și evidența populației"
        icon={
          <svg className="w-7 h-7 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
          </svg>
        }
        iconBg="bg-blue-100"
        sections={EVIDENTA_SECTIONS}
        defaultOpen={true}
      />

      <Department
        title="2. Compartimentul de Stare Civilă"
        description="Certificate de naștere, căsătorie, deces și alte acte"
        icon={
          <svg className="w-7 h-7 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        }
        iconBg="bg-emerald-100"
        sections={STARE_CIVILA_SECTIONS}
      />
    </div>
  );
}

