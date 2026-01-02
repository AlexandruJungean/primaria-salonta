/**
 * SEO Configuration for Primăria Salonta
 * Comprehensive SEO settings for all pages
 */

export const SEO_CONFIG = {
  siteName: {
    ro: 'Primăria Municipiului Salonta',
    hu: 'Nagyszalonta Polgármesteri Hivatala',
    en: 'Salonta City Hall',
  },
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://salonta.ro',
  defaultLocale: 'ro',
  locales: ['ro', 'hu', 'en'] as const,
  
  // Organization info for structured data
  organization: {
    name: 'Primăria Municipiului Salonta',
    alternateName: ['Salonta City Hall', 'Nagyszalonta Polgármesteri Hivatal'],
    legalName: 'Primăria Municipiului Salonta',
    foundingDate: '1695',
    taxID: 'RO4348450', // CUI
    address: {
      streetAddress: 'Str. Republicii nr. 1',
      addressLocality: 'Salonta',
      addressRegion: 'Bihor',
      postalCode: '415500',
      addressCountry: 'RO',
    },
    geo: {
      latitude: 46.8,
      longitude: 21.65,
    },
    contact: {
      phones: ['0359-409730', '0359-409731', '0259-373243'],
      fax: '0359-409733',
      emails: ['primsal@rdslink.ro', 'primsal3@gmail.com'],
    },
    socialMedia: {
      facebook: 'https://www.facebook.com/PrimariaSalontaNagyszalontaPolgarmesteriHivatala',
      instagram: 'https://www.instagram.com/primaria.municipiuluisalonta/',
      tiktok: 'https://www.tiktok.com/@primariasalonta_',
    },
    openingHours: {
      weekdays: { opens: '08:00', closes: '16:00' },
      saturday: null,
      sunday: null,
    },
  },
  
  // Default images
  images: {
    ogImage: '/og-image.png',
    logo: '/logo/logo.png',
    logoTransparent: '/logo/logo-transparent.png',
    favicon: '/favicon.ico',
  },
  
  // Twitter/X handle
  twitter: {
    handle: '@PrimariaSalonta',
    cardType: 'summary_large_image' as const,
  },
};

// Page-specific SEO configurations
export const PAGE_SEO = {
  // Homepage
  home: {
    ro: {
      title: 'Primăria Municipiului Salonta | Site Oficial',
      description: 'Site-ul oficial al Primăriei Municipiului Salonta - Informații pentru cetățeni, servicii online, transparență, taxe și impozite, formulare, anunțuri și evenimente.',
      keywords: 'Primăria Salonta, Municipiul Salonta, Bihor, servicii publice, administrație locală, taxe impozite, formulare online, anunțuri',
    },
    hu: {
      title: 'Nagyszalonta Polgármesteri Hivatala | Hivatalos Oldal',
      description: 'Nagyszalonta Polgármesteri Hivatalának hivatalos weboldala - Információk polgároknak, online szolgáltatások, átláthatóság, adók és illetékek.',
      keywords: 'Nagyszalonta, Polgármesteri Hivatal, Bihar megye, közszolgáltatások, helyi önkormányzat, adók',
    },
    en: {
      title: 'Salonta City Hall | Official Website',
      description: 'Official website of Salonta City Hall - Information for citizens, online services, transparency, taxes, forms, announcements and events.',
      keywords: 'Salonta City Hall, Salonta Municipality, Bihor, public services, local administration, taxes',
    },
  },
  
  // Localitatea
  localitatea: {
    ro: {
      title: 'Localitatea Salonta - Prezentare Generală',
      description: 'Descoperă municipiul Salonta - localizare, istorie, cultură, economie, obiective turistice și informații despre comunitatea locală din Bihor.',
      keywords: 'Salonta, municipiu, Bihor, Romania, localizare, istorie, cultură, economie, turism',
    },
    hu: {
      title: 'Nagyszalonta Település - Általános Bemutatkozás',
      description: 'Fedezd fel Nagyszalontát - elhelyezkedés, történelem, kultúra, gazdaság, turisztikai látványosságok és információk a helyi közösségről.',
      keywords: 'Nagyszalonta, település, Bihar, Románia, elhelyezkedés, történelem, kultúra',
    },
    en: {
      title: 'Salonta City - General Presentation',
      description: 'Discover Salonta - location, history, culture, economy, tourist attractions and information about the local community in Bihor.',
      keywords: 'Salonta, city, Bihor, Romania, location, history, culture, economy, tourism',
    },
  },
  
  // Istoric
  istoric: {
    ro: {
      title: 'Istoria Municipiului Salonta',
      description: 'Istoria bogată a municipiului Salonta din secolul al XV-lea până în prezent. Descoperă moștenirea culturală și personalitățile care au marcat orașul.',
      keywords: 'istoria Salonta, Arany János, moștenire culturală, patrimoniu, istorie locală',
    },
    hu: {
      title: 'Nagyszalonta Története',
      description: 'Nagyszalonta gazdag története a XV. századtól napjainkig. Fedezd fel a kulturális örökséget és a várost meghatározó személyiségeket.',
      keywords: 'Nagyszalonta története, Arany János, kulturális örökség, helytörténet',
    },
    en: {
      title: 'History of Salonta',
      description: 'The rich history of Salonta from the 15th century to present. Discover the cultural heritage and personalities that shaped the city.',
      keywords: 'Salonta history, Arany János, cultural heritage, local history',
    },
  },
  
  // Primăria
  primaria: {
    ro: {
      title: 'Primăria Municipiului Salonta - Informații Instituționale',
      description: 'Informații despre Primăria Salonta - conducere, organigramă, program cu publicul, audiențe, legislație și regulament de funcționare.',
      keywords: 'Primăria Salonta, primar, viceprimar, secretar, program, audiențe, conducere',
    },
    hu: {
      title: 'Nagyszalonta Polgármesteri Hivatala - Intézményi Információk',
      description: 'Információk a Polgármesteri Hivatalról - vezetőség, szervezeti felépítés, ügyfélfogadás, fogadóórák, jogszabályok.',
      keywords: 'Polgármesteri Hivatal, polgármester, alpolgármester, ügyfélfogadás',
    },
    en: {
      title: 'Salonta City Hall - Institutional Information',
      description: 'Information about Salonta City Hall - leadership, organizational chart, public hours, audiences, legislation.',
      keywords: 'Salonta City Hall, mayor, deputy mayor, secretary, public hours',
    },
  },
  
  // Consiliul Local
  consiliulLocal: {
    ro: {
      title: 'Consiliul Local Salonta',
      description: 'Consiliul Local al Municipiului Salonta - consilieri locali, comisii de specialitate, hotărâri, ordine de zi și procese verbale.',
      keywords: 'Consiliul Local Salonta, consilieri, hotărâri, comisii, ședințe',
    },
    hu: {
      title: 'Nagyszalonta Helyi Tanácsa',
      description: 'Nagyszalonta Helyi Tanácsa - helyi tanácsosok, szakbizottságok, határozatok, napirend és jegyzőkönyvek.',
      keywords: 'Helyi Tanács, tanácsosok, határozatok, bizottságok, ülések',
    },
    en: {
      title: 'Salonta Local Council',
      description: 'Salonta Local Council - local councilors, specialty committees, decisions, agendas and minutes.',
      keywords: 'Local Council, councilors, decisions, committees, meetings',
    },
  },
  
  // Servicii Online
  serviciiOnline: {
    ro: {
      title: 'Servicii Online - Plăți, Petiții, Formulare',
      description: 'Servicii online ale Primăriei Salonta - plată taxe și impozite online, depunere petiții, descărcare formulare tipizate.',
      keywords: 'servicii online, plăți online, taxe impozite, petiții, formulare, Ghișeul.ro',
    },
    hu: {
      title: 'Online Szolgáltatások - Fizetések, Beadványok, Űrlapok',
      description: 'Nagyszalonta Polgármesteri Hivatalának online szolgáltatásai - online adófizetés, beadvány benyújtás, űrlapok letöltése.',
      keywords: 'online szolgáltatások, online fizetés, adók, beadványok, űrlapok',
    },
    en: {
      title: 'Online Services - Payments, Petitions, Forms',
      description: 'Salonta City Hall online services - online tax payments, submit petitions, download forms.',
      keywords: 'online services, online payments, taxes, petitions, forms',
    },
  },
  
  // Taxe și Impozite
  taxeImpozite: {
    ro: {
      title: 'Impozite și Taxe Locale Salonta',
      description: 'Informații despre impozite și taxe locale în Salonta - niveluri de impozitare, facilități fiscale, plată online, coduri IBAN.',
      keywords: 'impozite Salonta, taxe locale, plată impozite, facilități fiscale, IBAN',
    },
    hu: {
      title: 'Helyi Adók és Illetékek Nagyszalonta',
      description: 'Információk a helyi adókról és illetékekről Nagyszalontán - adószintek, adókedvezmények, online fizetés, IBAN kódok.',
      keywords: 'adók Nagyszalonta, helyi adók, adófizetés, adókedvezmények',
    },
    en: {
      title: 'Local Taxes and Fees Salonta',
      description: 'Information about local taxes and fees in Salonta - tax levels, tax facilities, online payment, IBAN codes.',
      keywords: 'Salonta taxes, local taxes, tax payment, tax facilities',
    },
  },
  
  // Contact
  contact: {
    ro: {
      title: 'Contact Primăria Salonta',
      description: 'Date de contact Primăria Salonta - adresă, telefon, email, program de lucru, formular de contact și hartă interactivă.',
      keywords: 'contact Primăria Salonta, adresă, telefon, email, program',
    },
    hu: {
      title: 'Kapcsolat - Nagyszalonta Polgármesteri Hivatala',
      description: 'Kapcsolati adatok - cím, telefon, email, munkaprogram, kapcsolatfelvételi űrlap és interaktív térkép.',
      keywords: 'kapcsolat, cím, telefon, email, munkaprogram',
    },
    en: {
      title: 'Contact Salonta City Hall',
      description: 'Contact information - address, phone, email, working hours, contact form and interactive map.',
      keywords: 'contact, address, phone, email, working hours',
    },
  },
  
  // Transparență
  transparenta: {
    ro: {
      title: 'Transparență Instituțională - Primăria Salonta',
      description: 'Secțiunea de transparență - anunțuri publice, dezbateri publice, buletin informativ și informații de interes public.',
      keywords: 'transparență, anunțuri, dezbateri publice, informații publice, Legea 544',
    },
    hu: {
      title: 'Intézményi Átláthatóság - Nagyszalonta',
      description: 'Átláthatósági szekció - közlemények, nyilvános viták, tájékoztató és közérdekű információk.',
      keywords: 'átláthatóság, közlemények, nyilvános viták, közérdekű információk',
    },
    en: {
      title: 'Institutional Transparency - Salonta',
      description: 'Transparency section - public announcements, public debates, informative bulletin and public interest information.',
      keywords: 'transparency, announcements, public debates, public information',
    },
  },
  
  // Formulare Online
  formulare: {
    ro: {
      title: 'Formulare Online - Descarcă Formulare Tipizate',
      description: 'Descarcă formulare tipizate pentru: taxe locale, urbanism, asistență socială, stare civilă, agricultură și alte servicii publice.',
      keywords: 'formulare, formulare tipizate, cereri, documente, taxe, urbanism, asistență socială',
    },
    hu: {
      title: 'Online Űrlapok - Nyomtatványok Letöltése',
      description: 'Tölts le nyomtatványokat: helyi adók, urbanisztika, szociális segélyezés, anyakönyv, mezőgazdaság és egyéb közszolgáltatások.',
      keywords: 'űrlapok, nyomtatványok, kérelmek, dokumentumok, adók, urbanisztika',
    },
    en: {
      title: 'Online Forms - Download Standard Forms',
      description: 'Download standard forms for: local taxes, urbanism, social assistance, civil status, agriculture and other public services.',
      keywords: 'forms, standard forms, applications, documents, taxes, urbanism',
    },
  },
  
  // Știri
  stiri: {
    ro: {
      title: 'Știri și Noutăți - Primăria Salonta',
      description: 'Ultimele știri și noutăți de la Primăria Salonta - comunicate de presă, anunțuri, evenimente și informații locale.',
      keywords: 'știri Salonta, noutăți, comunicate, anunțuri, evenimente locale',
    },
    hu: {
      title: 'Hírek és Újdonságok - Nagyszalonta',
      description: 'Legfrissebb hírek és újdonságok Nagyszalontáról - sajtóközlemények, közlemények, események és helyi információk.',
      keywords: 'hírek Nagyszalonta, újdonságok, közlemények, események',
    },
    en: {
      title: 'News and Updates - Salonta',
      description: 'Latest news and updates from Salonta City Hall - press releases, announcements, events and local information.',
      keywords: 'Salonta news, updates, press releases, announcements, local events',
    },
  },
  
  // Camere Web
  camereWeb: {
    ro: {
      title: 'Camere Web Live - Salonta în Timp Real',
      description: 'Vizualizează Salonta în timp real prin camerele web live - Casa Memorială Arany János și Parcul Nuca de Aur.',
      keywords: 'camere web, live, Salonta, Arany János, Nuca de Aur, webcam',
    },
    hu: {
      title: 'Élő Webkamerák - Nagyszalonta Valós Időben',
      description: 'Nézd Nagyszalontát valós időben élő webkamerákon - Arany János Emlékmúzeum és Arany Dió Park.',
      keywords: 'webkamerák, élő, Nagyszalonta, Arany János, webcam',
    },
    en: {
      title: 'Live Webcams - Salonta in Real Time',
      description: 'Watch Salonta in real time through live webcams - Arany János Memorial House and Golden Walnut Park.',
      keywords: 'webcams, live, Salonta, Arany János, webcam',
    },
  },
  
  // Concursuri
  concursuri: {
    ro: {
      title: 'Concursuri și Posturi Vacante - Primăria Salonta',
      description: 'Anunțuri de angajare la Primăria Salonta - posturi vacante, concursuri, bibliografie, formulare de înscriere și rezultate.',
      keywords: 'concursuri, posturi vacante, angajare, cariere, Primăria Salonta',
    },
    hu: {
      title: 'Álláspályázatok - Nagyszalonta Polgármesteri Hivatala',
      description: 'Álláslehetőségek a Polgármesteri Hivatalnál - üres álláshelyek, pályázatok, bibliográfia, jelentkezési űrlapok és eredmények.',
      keywords: 'álláspályázatok, üres álláshelyek, karrier, munka',
    },
    en: {
      title: 'Job Vacancies - Salonta City Hall',
      description: 'Job announcements at Salonta City Hall - vacancies, competitions, bibliography, application forms and results.',
      keywords: 'job vacancies, careers, employment, Salonta City Hall',
    },
  },
  
  // Hotărâri Consiliu Local
  hotarari: {
    ro: {
      title: 'Hotărâri Consiliul Local Salonta',
      description: 'Arhiva hotărârilor Consiliului Local Salonta - căutare, vizualizare și descărcare hotărâri pe ani.',
      keywords: 'hotărâri, Consiliul Local, HCL, decizii, documente oficiale',
    },
    hu: {
      title: 'Helyi Tanácsi Határozatok Nagyszalonta',
      description: 'Nagyszalonta Helyi Tanácsa határozatainak archívuma - keresés, megtekintés és letöltés évek szerint.',
      keywords: 'határozatok, Helyi Tanács, döntések, hivatalos dokumentumok',
    },
    en: {
      title: 'Local Council Decisions Salonta',
      description: 'Archive of Salonta Local Council decisions - search, view and download decisions by year.',
      keywords: 'decisions, Local Council, official documents',
    },
  },
  
  // Buget
  buget: {
    ro: {
      title: 'Bugetul Municipiului Salonta',
      description: 'Bugetul local al Municipiului Salonta - buget inițial, rectificări, execuție bugetară, situații financiare trimestriale.',
      keywords: 'buget Salonta, buget local, execuție bugetară, finanțe publice',
    },
    hu: {
      title: 'Nagyszalonta Költségvetése',
      description: 'Nagyszalonta helyi költségvetése - kezdeti költségvetés, módosítások, költségvetési végrehajtás, negyedéves pénzügyi kimutatások.',
      keywords: 'költségvetés, helyi költségvetés, végrehajtás, pénzügyek',
    },
    en: {
      title: 'Salonta Municipality Budget',
      description: 'Local budget of Salonta Municipality - initial budget, rectifications, budget execution, quarterly financial statements.',
      keywords: 'budget Salonta, local budget, budget execution, public finances',
    },
  },
  
  // GDPR
  gdpr: {
    ro: {
      title: 'GDPR - Protecția Datelor Personale',
      description: 'Informații GDPR - protecția datelor cu caracter personal, drepturile persoanelor vizate, responsabil protecția datelor (DPO).',
      keywords: 'GDPR, protecția datelor, date personale, DPO, drepturi',
    },
    hu: {
      title: 'GDPR - Személyes Adatok Védelme',
      description: 'GDPR információk - személyes adatok védelme, érintetti jogok, adatvédelmi tisztviselő (DPO).',
      keywords: 'GDPR, adatvédelem, személyes adatok, DPO, jogok',
    },
    en: {
      title: 'GDPR - Personal Data Protection',
      description: 'GDPR information - personal data protection, data subject rights, data protection officer (DPO).',
      keywords: 'GDPR, data protection, personal data, DPO, rights',
    },
  },
  
  // Autorizații Construire
  autorizatiiConstruire: {
    ro: {
      title: 'Autorizații de Construire - Primăria Salonta',
      description: 'Lista autorizațiilor de construire eliberate de Primăria Salonta, arhivă pe ani și documentație necesară.',
      keywords: 'autorizații construire, construcții, urbanism, documentație',
    },
    hu: {
      title: 'Építési Engedélyek - Nagyszalonta',
      description: 'Nagyszalonta Polgármesteri Hivatala által kiadott építési engedélyek listája, archívum és szükséges dokumentáció.',
      keywords: 'építési engedélyek, építkezés, urbanisztika, dokumentáció',
    },
    en: {
      title: 'Building Permits - Salonta City Hall',
      description: 'List of building permits issued by Salonta City Hall, archive by year and required documentation.',
      keywords: 'building permits, construction, urbanism, documentation',
    },
  },
  
  // Certificate Urbanism
  certificateUrbanism: {
    ro: {
      title: 'Certificate de Urbanism - Primăria Salonta',
      description: 'Lista certificatelor de urbanism eliberate de Primăria Salonta și informații despre procedura de obținere.',
      keywords: 'certificate urbanism, urbanism, construcții, documentație',
    },
    hu: {
      title: 'Urbanisztikai Bizonyítványok - Nagyszalonta',
      description: 'Nagyszalonta Polgármesteri Hivatala által kiadott urbanisztikai bizonyítványok listája és az igénylési eljárás.',
      keywords: 'urbanisztikai bizonyítványok, urbanisztika, építkezés',
    },
    en: {
      title: 'Urbanism Certificates - Salonta City Hall',
      description: 'List of urbanism certificates issued by Salonta City Hall and information about the application process.',
      keywords: 'urbanism certificates, construction, documentation',
    },
  },
  
  // Muzeu
  muzeu: {
    ro: {
      title: 'Complexul Muzeal Arany János - Salonta',
      description: 'Vizitează Complexul Muzeal Arany János din Salonta - Casa Memorială a poetului maghiar, expoziții, program de vizitare.',
      keywords: 'Muzeu Salonta, Arany János, Casa Memorială, cultură, turism',
    },
    hu: {
      title: 'Arany János Emlékmúzeum - Nagyszalonta',
      description: 'Látogasd meg az Arany János Emlékmúzeumot Nagyszalontán - a magyar költő emlékháza, kiállítások, látogatási program.',
      keywords: 'Emlékmúzeum, Arany János, Nagyszalonta, kultúra, turizmus',
    },
    en: {
      title: 'Arany János Museum Complex - Salonta',
      description: 'Visit the Arany János Museum Complex in Salonta - Memorial House of the Hungarian poet, exhibitions, visiting hours.',
      keywords: 'Museum Salonta, Arany János, Memorial House, culture, tourism',
    },
  },
  
  // Licitații
  licitatii: {
    ro: {
      title: 'Licitații Publice - Primăria Salonta',
      description: 'Anunțuri licitații publice organizate de Primăria Salonta - licitații terenuri, concesiuni, vânzări.',
      keywords: 'licitații, licitații publice, concesiuni, terenuri, vânzări',
    },
    hu: {
      title: 'Nyilvános Árverések - Nagyszalonta',
      description: 'Nagyszalonta Polgármesteri Hivatala által szervezett nyilvános árverések - telkek, koncessziók, eladások.',
      keywords: 'árverések, nyilvános árverések, koncessziók, telkek',
    },
    en: {
      title: 'Public Auctions - Salonta City Hall',
      description: 'Public auction announcements organized by Salonta City Hall - land auctions, concessions, sales.',
      keywords: 'auctions, public auctions, concessions, land, sales',
    },
  },
  
  // Achiziții Publice
  achizitii: {
    ro: {
      title: 'Achiziții Publice - Primăria Salonta',
      description: 'Secțiunea de achiziții publice - anunțuri de participare, documentație de atribuire, planul anual de achiziții.',
      keywords: 'achiziții publice, licitații, SEAP, atribuire contracte',
    },
    hu: {
      title: 'Közbeszerzések - Nagyszalonta',
      description: 'Közbeszerzési szekció - részvételi felhívások, odaítélési dokumentáció, éves beszerzési terv.',
      keywords: 'közbeszerzések, pályázatok, szerződések',
    },
    en: {
      title: 'Public Procurement - Salonta City Hall',
      description: 'Public procurement section - participation announcements, award documentation, annual procurement plan.',
      keywords: 'public procurement, tenders, contracts',
    },
  },
  
  // Voluntariat
  voluntariat: {
    ro: {
      title: 'Activitate de Voluntariat - Primăria Salonta',
      description: 'Programul de voluntariat al Primăriei Salonta - oportunități, înscriere, beneficii și activități pentru voluntari.',
      keywords: 'voluntariat, voluntari, activități, comunitate, Salonta',
    },
    hu: {
      title: 'Önkéntes Tevékenységek - Nagyszalonta',
      description: 'Nagyszalonta Polgármesteri Hivatalának önkéntes programja - lehetőségek, jelentkezés, előnyök és tevékenységek.',
      keywords: 'önkéntesség, önkéntesek, tevékenységek, közösség',
    },
    en: {
      title: 'Volunteer Activities - Salonta City Hall',
      description: 'Salonta City Hall volunteer program - opportunities, registration, benefits and activities for volunteers.',
      keywords: 'volunteering, volunteers, activities, community',
    },
  },
} as const;

export type PageKey = keyof typeof PAGE_SEO;
export type Locale = typeof SEO_CONFIG.locales[number];

