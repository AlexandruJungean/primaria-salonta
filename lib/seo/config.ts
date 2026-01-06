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
      title: 'Primăria Municipiului Salonta | Site Oficial | Bihor',
      description: 'Site-ul oficial al Primăriei Salonta, Bihor - Servicii online pentru cetățeni, taxe și impozite, formulare, transparență și evenimente locale.',
      keywords: 'Primăria Salonta, Municipiul Salonta, Bihor, servicii publice, administrație locală, taxe impozite, formulare online, anunțuri',
    },
    hu: {
      title: 'Nagyszalonta Polgármesteri Hivatala | Hivatalos Oldal',
      description: 'Nagyszalonta Polgármesteri Hivatalának hivatalos weboldala Bihar megyében - Online szolgáltatások, adók, illetékek, átláthatóság és közösségi események.',
      keywords: 'Nagyszalonta, Polgármesteri Hivatal, Bihar megye, közszolgáltatások, helyi önkormányzat, adók',
    },
    en: {
      title: 'Salonta City Hall | Official Website | Bihor, Romania',
      description: 'Official website of Salonta City Hall in Bihor County, Romania - Online services, taxes, forms, transparency and local events for citizens.',
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
  
  // Carieră și Concursuri
  carieraConcursuri: {
    ro: {
      title: 'Carieră și Concursuri - Primăria Salonta',
      description: 'Posturi vacante și concursuri de angajare la Primăria Municipiului Salonta. Anunțuri, cerințe, documente necesare și rezultate.',
      keywords: 'carieră, concursuri, posturi vacante, angajare, locuri de muncă, Primăria Salonta',
    },
    hu: {
      title: 'Karrier és Versenyek - Nagyszalonta Polgármesteri Hivatala',
      description: 'Üres álláshelyek és álláspályázatok a Nagyszalontai Polgármesteri Hivatalnál. Hirdetmények, követelmények, dokumentumok és eredmények.',
      keywords: 'karrier, álláspályázatok, üres álláshelyek, munkalehetőségek',
    },
    en: {
      title: 'Career and Competitions - Salonta City Hall',
      description: 'Job vacancies and hiring competitions at Salonta City Hall. Announcements, requirements, documents and results.',
      keywords: 'career, job vacancies, hiring competitions, employment, Salonta City Hall',
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

  // Informații Publice (main page)
  informatiiPublice: {
    ro: {
      title: 'Informații Publice - Primăria Salonta',
      description: 'Informații de interes public - documente, autorizații, certificate, taxe, licitații, anunțuri și formulare.',
      keywords: 'informații publice, documente, autorizații, certificate, taxe, formulare',
    },
    hu: {
      title: 'Közérdekű Információk - Nagyszalonta',
      description: 'Közérdekű információk - dokumentumok, engedélyek, bizonyítványok, adók, árverések, közlemények és űrlapok.',
      keywords: 'közérdekű információk, dokumentumok, engedélyek, adók, űrlapok',
    },
    en: {
      title: 'Public Information - Salonta City Hall',
      description: 'Public information - documents, permits, certificates, taxes, auctions, announcements and forms.',
      keywords: 'public information, documents, permits, certificates, taxes, forms',
    },
  },

  // Mediu
  mediu: {
    ro: {
      title: 'Mediu - Primăria Salonta',
      description: 'Informații despre protecția mediului, salubrizare, apă și canal, și spații verzi în municipiul Salonta.',
      keywords: 'mediu, salubrizare, apă, canal, spații verzi, colectare selectivă',
    },
    hu: {
      title: 'Környezetvédelem - Nagyszalonta',
      description: 'Információk a környezetvédelemről, hulladékgazdálkodásról, vízellátásról és zöldterületekről.',
      keywords: 'környezetvédelem, hulladék, víz, csatorna, zöldterületek',
    },
    en: {
      title: 'Environment - Salonta City Hall',
      description: 'Information about environmental protection, sanitation, water and sewage, and green spaces.',
      keywords: 'environment, sanitation, water, sewage, green spaces',
    },
  },

  // Oferte Terenuri
  oferteTerenuri: {
    ro: {
      title: 'Oferte Terenuri Agricole - Legea 17/2014',
      description: 'Registrul ofertelor de vânzare terenuri agricole conform Legii 17/2014 în municipiul Salonta.',
      keywords: 'terenuri agricole, vânzare terenuri, Legea 17/2014, extravilan',
    },
    hu: {
      title: 'Mezőgazdasági Telkek Értékesítése - 17/2014 Törvény',
      description: 'Mezőgazdasági telkek értékesítési ajánlatainak nyilvántartása a 17/2014 törvény szerint.',
      keywords: 'mezőgazdasági telkek, telekértékesítés, 17/2014 törvény',
    },
    en: {
      title: 'Agricultural Land Offers - Law 17/2014',
      description: 'Registry of agricultural land sale offers according to Law 17/2014 in Salonta.',
      keywords: 'agricultural land, land sales, Law 17/2014',
    },
  },

  // Planuri Urbanistice
  planuriUrbanistice: {
    ro: {
      title: 'Planuri Urbanistice - PUG Salonta',
      description: 'Planul Urbanistic General al municipiului Salonta - documentație, legende, regulament local de urbanism.',
      keywords: 'PUG, plan urbanistic, urbanism, Salonta, RLU',
    },
    hu: {
      title: 'Városrendezési Tervek - Nagyszalonta',
      description: 'Nagyszalonta Általános Városrendezési Terve - dokumentáció, jelmagyarázatok, helyi urbanisztikai szabályzat.',
      keywords: 'városrendezési terv, urbanisztika, szabályzat',
    },
    en: {
      title: 'Urban Planning - Salonta',
      description: 'General Urban Plan of Salonta - documentation, legends, local urbanism regulations.',
      keywords: 'urban plan, urbanism, regulations, PUG',
    },
  },

  // Publicații Căsătorie
  publicatiiCasatorie: {
    ro: {
      title: 'Publicații de Căsătorie - Primăria Salonta',
      description: 'Publicațiile de căsătorie afișate la Primăria Municipiului Salonta conform legii.',
      keywords: 'publicații căsătorie, căsătorii, stare civilă, Salonta',
    },
    hu: {
      title: 'Házassági Hirdetmények - Nagyszalonta',
      description: 'Házassági hirdetmények Nagyszalonta Polgármesteri Hivatalánál a törvény szerint.',
      keywords: 'házassági hirdetmények, házasság, anyakönyv',
    },
    en: {
      title: 'Marriage Publications - Salonta City Hall',
      description: 'Marriage publications posted at Salonta City Hall according to law.',
      keywords: 'marriage publications, marriages, civil status',
    },
  },

  // Publicații Vânzare
  publicatiiVanzare: {
    ro: {
      title: 'Publicații de Vânzare - Primăria Salonta',
      description: 'Publicații de vânzare imobile și terenuri afișate la Primăria Municipiului Salonta.',
      keywords: 'publicații vânzare, vânzare imobile, terenuri, licitații',
    },
    hu: {
      title: 'Értékesítési Hirdetmények - Nagyszalonta',
      description: 'Ingatlanok és telkek értékesítési hirdetményei Nagyszalonta Polgármesteri Hivatalánál.',
      keywords: 'értékesítési hirdetmények, ingatlanok, telkek',
    },
    en: {
      title: 'Sale Publications - Salonta City Hall',
      description: 'Real estate and land sale publications posted at Salonta City Hall.',
      keywords: 'sale publications, real estate, land',
    },
  },

  // Recepție Lucrări
  receptieLucrari: {
    ro: {
      title: 'Recepție Lucrări de Construcții - Primăria Salonta',
      description: 'Informații și documentație necesară pentru recepția lucrărilor de construcții în Salonta.',
      keywords: 'recepție lucrări, construcții, documentație, terminare lucrări',
    },
    hu: {
      title: 'Építési Munkák Átvétele - Nagyszalonta',
      description: 'Információk és szükséges dokumentáció építési munkák átvételéhez.',
      keywords: 'munkák átvétele, építkezés, dokumentáció',
    },
    en: {
      title: 'Construction Works Reception - Salonta',
      description: 'Information and documentation required for construction works reception.',
      keywords: 'works reception, construction, documentation',
    },
  },

  // Regulamente
  regulamente: {
    ro: {
      title: 'Regulamente - Primăria Salonta',
      description: 'Regulamente și norme locale adoptate de Consiliul Local al Municipiului Salonta.',
      keywords: 'regulamente, norme locale, hotărâri, Consiliul Local',
    },
    hu: {
      title: 'Szabályzatok - Nagyszalonta',
      description: 'Nagyszalonta Helyi Tanácsa által elfogadott helyi szabályzatok és normák.',
      keywords: 'szabályzatok, helyi normák, határozatok',
    },
    en: {
      title: 'Regulations - Salonta City Hall',
      description: 'Local regulations and norms adopted by Salonta Local Council.',
      keywords: 'regulations, local norms, decisions',
    },
  },

  // Rețele Telecomunicații
  reteleTelecom: {
    ro: {
      title: 'Rețele Telecomunicații - Primăria Salonta',
      description: 'Reglementări privind accesul pe proprietatea publică pentru construirea rețelelor de telecomunicații.',
      keywords: 'telecomunicații, rețele, Legea 159/2016, infrastructură',
    },
    hu: {
      title: 'Távközlési Hálózatok - Nagyszalonta',
      description: 'Szabályozások a köztulajdonhoz való hozzáférésről távközlési hálózatok építéséhez.',
      keywords: 'távközlés, hálózatok, infrastruktúra',
    },
    en: {
      title: 'Telecommunications Networks - Salonta',
      description: 'Regulations regarding access to public property for building telecommunications networks.',
      keywords: 'telecommunications, networks, Law 159/2016, infrastructure',
    },
  },

  // SEIP
  seip: {
    ro: {
      title: 'SEIP - Serviciul de Evidență a Persoanei',
      description: 'Serviciul Public Comunitar de Evidență Informatizată a Persoanei - cărți de identitate, acte stare civilă.',
      keywords: 'SEIP, evidența persoanei, carte identitate, stare civilă, acte',
    },
    hu: {
      title: 'Személyi Nyilvántartó Szolgálat - Nagyszalonta',
      description: 'Helyi Személyi Nyilvántartó Szolgálat - személyi igazolvány, anyakönyvi okiratok.',
      keywords: 'személyi nyilvántartás, személyi igazolvány, anyakönyv',
    },
    en: {
      title: 'SEIP - Personal Records Service - Salonta',
      description: 'Local Personal Records Service - identity cards, civil status documents.',
      keywords: 'personal records, identity card, civil status, documents',
    },
  },

  // Solicitare Informații
  solicitareInformatii: {
    ro: {
      title: 'Solicitare Informații de Interes Public - Legea 544/2001',
      description: 'Cerere pentru acces la informații de interes public conform Legii 544/2001.',
      keywords: 'informații publice, Legea 544, acces informații, cerere',
    },
    hu: {
      title: 'Közérdekű Információ Kérése - 544/2001 Törvény',
      description: 'Kérelem közérdekű információkhoz való hozzáféréshez az 544/2001 törvény szerint.',
      keywords: 'közérdekű információk, 544-es törvény, hozzáférés',
    },
    en: {
      title: 'Request Public Information - Law 544/2001',
      description: 'Request for access to public information according to Law 544/2001.',
      keywords: 'public information, Law 544, access to information',
    },
  },

  // Somații
  somatii: {
    ro: {
      title: 'Somații - Primăria Salonta',
      description: 'Anunțuri colective privind comunicarea actelor administrative fiscale.',
      keywords: 'somații, anunțuri colective, acte administrative, fiscale',
    },
    hu: {
      title: 'Idézések - Nagyszalonta',
      description: 'Közös hirdetmények az adóügyi közigazgatási aktusok közléséről.',
      keywords: 'idézések, közös hirdetmények, közigazgatási aktusok',
    },
    en: {
      title: 'Summons - Salonta City Hall',
      description: 'Collective announcements regarding fiscal administrative acts communication.',
      keywords: 'summons, collective announcements, administrative acts',
    },
  },

  // Acte Necesare
  acteNecesare: {
    ro: {
      title: 'Acte Necesare - Primăria Salonta',
      description: 'Lista documentelor necesare pentru diverse servicii publice oferite de Primăria Salonta.',
      keywords: 'acte necesare, documente, servicii publice, proceduri',
    },
    hu: {
      title: 'Szükséges Dokumentumok - Nagyszalonta',
      description: 'A Polgármesteri Hivatal különböző közszolgáltatásaihoz szükséges dokumentumok listája.',
      keywords: 'szükséges dokumentumok, közszolgáltatások, eljárások',
    },
    en: {
      title: 'Required Documents - Salonta City Hall',
      description: 'List of documents required for various public services offered by Salonta City Hall.',
      keywords: 'required documents, public services, procedures',
    },
  },

  // Adăpost Câini
  adapostCaini: {
    ro: {
      title: 'Adăpost Câini - Primăria Salonta',
      description: 'Informații despre adăpostul pentru câini fără stăpân din Salonta - adopții, reglementări.',
      keywords: 'adăpost câini, câini fără stăpân, adopții, animale',
    },
    hu: {
      title: 'Kutyamenhely - Nagyszalonta',
      description: 'Információk a nagyszalontai kóbor kutyamenhelyről - örökbefogadás, szabályozások.',
      keywords: 'kutyamenhely, kóbor kutyák, örökbefogadás',
    },
    en: {
      title: 'Dog Shelter - Salonta City Hall',
      description: 'Information about the stray dog shelter in Salonta - adoptions, regulations.',
      keywords: 'dog shelter, stray dogs, adoptions, animals',
    },
  },

  // Anunțuri
  anunturi: {
    ro: {
      title: 'Anunțuri Publice - Primăria Salonta',
      description: 'Anunțuri publice și comunicări oficiale ale Primăriei Municipiului Salonta.',
      keywords: 'anunțuri, comunicări, informări publice, Primăria Salonta',
    },
    hu: {
      title: 'Nyilvános Közlemények - Nagyszalonta',
      description: 'Nagyszalonta Polgármesteri Hivatalának nyilvános közleményei és hivatalos értesítései.',
      keywords: 'közlemények, hivatalos értesítések, tájékoztatók',
    },
    en: {
      title: 'Public Announcements - Salonta City Hall',
      description: 'Public announcements and official communications from Salonta City Hall.',
      keywords: 'announcements, communications, public information',
    },
  },

  // Dispoziții
  dispozitii: {
    ro: {
      title: 'Dispoziții ale Primarului - Primăria Salonta',
      description: 'Arhiva dispozițiilor emise de Primarul Municipiului Salonta.',
      keywords: 'dispoziții, primar, acte administrative, hotărâri',
    },
    hu: {
      title: 'Polgármesteri Rendeletek - Nagyszalonta',
      description: 'Nagyszalonta polgármestere által kiadott rendeletek archívuma.',
      keywords: 'rendeletek, polgármester, közigazgatási aktusok',
    },
    en: {
      title: 'Mayor Dispositions - Salonta City Hall',
      description: 'Archive of dispositions issued by the Mayor of Salonta.',
      keywords: 'dispositions, mayor, administrative acts',
    },
  },

  // Coronavirus
  coronavirus: {
    ro: {
      title: 'Informații COVID-19 - Primăria Salonta',
      description: 'Informații și măsuri privind prevenirea și combaterea pandemiei COVID-19 în Salonta.',
      keywords: 'COVID-19, coronavirus, pandemie, măsuri, prevenție',
    },
    hu: {
      title: 'COVID-19 Információk - Nagyszalonta',
      description: 'Információk és intézkedések a COVID-19 járvány megelőzéséről és leküzdéséről.',
      keywords: 'COVID-19, koronavírus, járvány, intézkedések',
    },
    en: {
      title: 'COVID-19 Information - Salonta City Hall',
      description: 'Information and measures regarding COVID-19 pandemic prevention in Salonta.',
      keywords: 'COVID-19, coronavirus, pandemic, measures, prevention',
    },
  },

  // Conducere
  conducere: {
    ro: {
      title: 'Conducerea Primăriei Salonta',
      description: 'Conducerea Primăriei - Primar, Viceprimar, Secretar General - informații de contact și program audiențe.',
      keywords: 'conducere, primar, viceprimar, secretar, audiențe',
    },
    hu: {
      title: 'A Polgármesteri Hivatal Vezetősége - Nagyszalonta',
      description: 'A hivatal vezetősége - Polgármester, Alpolgármester, Főjegyző - elérhetőségek és fogadóórák.',
      keywords: 'vezetőség, polgármester, alpolgármester, főjegyző',
    },
    en: {
      title: 'City Hall Leadership - Salonta',
      description: 'City Hall leadership - Mayor, Deputy Mayor, Secretary General - contact info and audience hours.',
      keywords: 'leadership, mayor, deputy mayor, secretary, audiences',
    },
  },

  // Organigrama
  organigrama: {
    ro: {
      title: 'Organigrama Primăriei Salonta',
      description: 'Structura organizatorică a Primăriei Municipiului Salonta - departamente și servicii.',
      keywords: 'organigramă, structură, departamente, servicii, organizare',
    },
    hu: {
      title: 'Szervezeti Felépítés - Nagyszalonta',
      description: 'Nagyszalonta Polgármesteri Hivatalának szervezeti felépítése - osztályok és szolgáltatások.',
      keywords: 'szervezeti felépítés, osztályok, szolgáltatások',
    },
    en: {
      title: 'Organizational Chart - Salonta City Hall',
      description: 'Organizational structure of Salonta City Hall - departments and services.',
      keywords: 'organizational chart, structure, departments, services',
    },
  },

  // Program
  program: {
    ro: {
      title: 'Program de Lucru - Primăria Salonta',
      description: 'Programul de lucru și program cu publicul al Primăriei Municipiului Salonta.',
      keywords: 'program, orar, lucru cu publicul, audiențe',
    },
    hu: {
      title: 'Munkaprogram - Nagyszalonta',
      description: 'Nagyszalonta Polgármesteri Hivatalának munkaprogramja és ügyfélfogadási óráinak.',
      keywords: 'munkaprogram, ügyfélfogadás, órák',
    },
    en: {
      title: 'Working Hours - Salonta City Hall',
      description: 'Working hours and public audience schedule of Salonta City Hall.',
      keywords: 'working hours, schedule, public hours, audiences',
    },
  },

  // Legislație
  legislatie: {
    ro: {
      title: 'Legislație - Primăria Salonta',
      description: 'Legislație relevantă pentru administrația publică locală și activitatea Primăriei Salonta.',
      keywords: 'legislație, legi, ordonanțe, norme, administrație publică',
    },
    hu: {
      title: 'Jogszabályok - Nagyszalonta',
      description: 'A helyi közigazgatásra vonatkozó jogszabályok és a Polgármesteri Hivatal tevékenysége.',
      keywords: 'jogszabályok, törvények, rendeletek, közigazgatás',
    },
    en: {
      title: 'Legislation - Salonta City Hall',
      description: 'Relevant legislation for local public administration and Salonta City Hall activities.',
      keywords: 'legislation, laws, ordinances, norms, public administration',
    },
  },

  // Regulament Organizare
  regulamentOrganizare: {
    ro: {
      title: 'Regulament de Organizare și Funcționare',
      description: 'Regulamentul de Organizare și Funcționare al Primăriei Municipiului Salonta.',
      keywords: 'ROF, regulament, organizare, funcționare, Primăria',
    },
    hu: {
      title: 'Szervezeti és Működési Szabályzat',
      description: 'Nagyszalonta Polgármesteri Hivatalának Szervezeti és Működési Szabályzata.',
      keywords: 'SZMSZ, szabályzat, szervezet, működés',
    },
    en: {
      title: 'Organization and Operation Regulation',
      description: 'Organization and Operation Regulation of Salonta City Hall.',
      keywords: 'regulation, organization, operation, city hall',
    },
  },

  // Audiențe
  audiente: {
    ro: {
      title: 'Audiențe - Primăria Salonta',
      description: 'Program de audiențe la Primăria Salonta - înscriere, program și informații pentru cetățeni.',
      keywords: 'audiențe, program, înscriere, primar, cetățeni',
    },
    hu: {
      title: 'Fogadóórák - Nagyszalonta',
      description: 'Fogadóórák a Polgármesteri Hivatalnál - időpontfoglalás, program és információk.',
      keywords: 'fogadóórák, program, időpontfoglalás, polgármester',
    },
    en: {
      title: 'Audiences - Salonta City Hall',
      description: 'Audience schedule at Salonta City Hall - registration, schedule and citizen information.',
      keywords: 'audiences, schedule, registration, mayor, citizens',
    },
  },

  // Declarații Avere
  declaratiiAvere: {
    ro: {
      title: 'Declarații de Avere și Interese',
      description: 'Declarațiile de avere și de interese ale funcționarilor publici din Primăria Salonta.',
      keywords: 'declarații avere, declarații interese, funcționari, ANI',
    },
    hu: {
      title: 'Vagyonnyilatkozatok és Érdekeltségi Nyilatkozatok',
      description: 'Nagyszalonta Polgármesteri Hivatala köztisztviselőinek vagyon- és érdekeltségi nyilatkozatai.',
      keywords: 'vagyonnyilatkozatok, érdekeltségi nyilatkozatok, köztisztviselők',
    },
    en: {
      title: 'Asset and Interest Declarations',
      description: 'Asset and interest declarations of public officials from Salonta City Hall.',
      keywords: 'asset declarations, interest declarations, officials',
    },
  },

  // Rapoarte Anuale
  rapoarteAnuale: {
    ro: {
      title: 'Rapoarte Anuale - Primăria Salonta',
      description: 'Rapoartele anuale de activitate ale Primăriei Municipiului Salonta.',
      keywords: 'rapoarte anuale, activitate, bilanț, Primăria',
    },
    hu: {
      title: 'Éves Jelentések - Nagyszalonta',
      description: 'Nagyszalonta Polgármesteri Hivatalának éves tevékenységi jelentései.',
      keywords: 'éves jelentések, tevékenység, mérleg',
    },
    en: {
      title: 'Annual Reports - Salonta City Hall',
      description: 'Annual activity reports of Salonta City Hall.',
      keywords: 'annual reports, activity, balance, city hall',
    },
  },

  // Consilieri
  consilieri: {
    ro: {
      title: 'Consilieri Locali - Consiliul Local Salonta',
      description: 'Lista consilierilor locali ai Municipiului Salonta - contact, partid politic și comisii.',
      keywords: 'consilieri locali, Consiliul Local, ales local, reprezentanți',
    },
    hu: {
      title: 'Helyi Tanácsosok - Nagyszalonta',
      description: 'Nagyszalonta helyi tanácsosainak listája - elérhetőség, politikai párt és bizottságok.',
      keywords: 'helyi tanácsosok, tanács, képviselők',
    },
    en: {
      title: 'Local Councilors - Salonta Local Council',
      description: 'List of Salonta local councilors - contact, political party and committees.',
      keywords: 'local councilors, local council, representatives',
    },
  },

  // Comisii
  comisii: {
    ro: {
      title: 'Comisii de Specialitate - Consiliul Local Salonta',
      description: 'Comisiile de specialitate ale Consiliului Local Salonta - membri și atribuții.',
      keywords: 'comisii, specialitate, Consiliul Local, membri',
    },
    hu: {
      title: 'Szakbizottságok - Nagyszalonta Helyi Tanácsa',
      description: 'Nagyszalonta Helyi Tanácsa szakbizottságai - tagok és feladatkörök.',
      keywords: 'bizottságok, szakbizottságok, tanács, tagok',
    },
    en: {
      title: 'Specialty Committees - Salonta Local Council',
      description: 'Specialty committees of Salonta Local Council - members and responsibilities.',
      keywords: 'committees, specialty, local council, members',
    },
  },

  // Monitorul Oficial
  monitorulOficial: {
    ro: {
      title: 'Monitorul Oficial Local - Primăria Salonta',
      description: 'Monitorul Oficial Local al Municipiului Salonta - hotărâri, dispoziții, regulamente, documente.',
      keywords: 'Monitorul Oficial, documente oficiale, hotărâri, dispoziții',
    },
    hu: {
      title: 'Helyi Hivatalos Közlöny - Nagyszalonta',
      description: 'Nagyszalonta Helyi Hivatalos Közlönye - határozatok, rendeletek, szabályzatok, dokumentumok.',
      keywords: 'Hivatalos Közlöny, hivatalos dokumentumok, határozatok',
    },
    en: {
      title: 'Local Official Gazette - Salonta',
      description: 'Local Official Gazette of Salonta - decisions, dispositions, regulations, documents.',
      keywords: 'Official Gazette, official documents, decisions',
    },
  },

  // Statut
  statut: {
    ro: {
      title: 'Statutul Municipiului Salonta',
      description: 'Statutul Municipiului Salonta - document fundamental al administrației locale.',
      keywords: 'statut, municipiu, administrație locală, document',
    },
    hu: {
      title: 'Nagyszalonta Város Alapszabálya',
      description: 'Nagyszalonta város alapszabálya - a helyi önkormányzat alapvető dokumentuma.',
      keywords: 'alapszabály, város, helyi önkormányzat',
    },
    en: {
      title: 'Statute of Salonta Municipality',
      description: 'Statute of Salonta Municipality - fundamental document of local administration.',
      keywords: 'statute, municipality, local administration',
    },
  },

  // Documente Financiare
  documenteFinanciare: {
    ro: {
      title: 'Documente Financiare - Primăria Salonta',
      description: 'Documente financiare și situații contabile ale Primăriei Municipiului Salonta.',
      keywords: 'documente financiare, situații contabile, bilanț, finanțe',
    },
    hu: {
      title: 'Pénzügyi Dokumentumok - Nagyszalonta',
      description: 'Pénzügyi dokumentumok és számviteli kimutatások.',
      keywords: 'pénzügyi dokumentumok, számviteli kimutatások, mérleg',
    },
    en: {
      title: 'Financial Documents - Salonta City Hall',
      description: 'Financial documents and accounting statements of Salonta City Hall.',
      keywords: 'financial documents, accounting statements, balance',
    },
  },

  // Alte Documente
  alteDocumente: {
    ro: {
      title: 'Alte Documente Oficiale - Primăria Salonta',
      description: 'Alte documente oficiale și acte administrative ale Primăriei Municipiului Salonta.',
      keywords: 'documente oficiale, acte administrative, arhivă',
    },
    hu: {
      title: 'Egyéb Hivatalos Dokumentumok - Nagyszalonta',
      description: 'Egyéb hivatalos dokumentumok és közigazgatási aktusok.',
      keywords: 'hivatalos dokumentumok, közigazgatási aktusok, archívum',
    },
    en: {
      title: 'Other Official Documents - Salonta City Hall',
      description: 'Other official documents and administrative acts of Salonta City Hall.',
      keywords: 'official documents, administrative acts, archive',
    },
  },

  // Transparență - Anunțuri
  transparentaAnunturi: {
    ro: {
      title: 'Anunțuri Transparență - Primăria Salonta',
      description: 'Anunțuri publice în secțiunea de transparență instituțională.',
      keywords: 'anunțuri, transparență, informare publică',
    },
    hu: {
      title: 'Átláthatósági Közlemények - Nagyszalonta',
      description: 'Nyilvános közlemények az intézményi átláthatósági szekcióban.',
      keywords: 'közlemények, átláthatóság, nyilvános tájékoztatás',
    },
    en: {
      title: 'Transparency Announcements - Salonta',
      description: 'Public announcements in the institutional transparency section.',
      keywords: 'announcements, transparency, public information',
    },
  },

  // Dezbateri Publice
  dezbateriPublice: {
    ro: {
      title: 'Dezbateri Publice - Primăria Salonta',
      description: 'Dezbateri publice și consultări cetățenești organizate de Primăria Salonta.',
      keywords: 'dezbateri publice, consultări, participare cetățenească',
    },
    hu: {
      title: 'Nyilvános Viták - Nagyszalonta',
      description: 'A Polgármesteri Hivatal által szervezett nyilvános viták és állampolgári konzultációk.',
      keywords: 'nyilvános viták, konzultációk, állampolgári részvétel',
    },
    en: {
      title: 'Public Debates - Salonta City Hall',
      description: 'Public debates and citizen consultations organized by Salonta City Hall.',
      keywords: 'public debates, consultations, citizen participation',
    },
  },

  // Buletin Informativ
  buletinInformativ: {
    ro: {
      title: 'Buletin Informativ - Primăria Salonta',
      description: 'Buletinul informativ al Primăriei Municipiului Salonta - rapoarte și informări.',
      keywords: 'buletin informativ, rapoarte, informări, Primăria',
    },
    hu: {
      title: 'Tájékoztató - Nagyszalonta',
      description: 'Nagyszalonta Polgármesteri Hivatalának tájékoztatója - jelentések és tájékoztatók.',
      keywords: 'tájékoztató, jelentések, információk',
    },
    en: {
      title: 'Information Bulletin - Salonta City Hall',
      description: 'Information bulletin of Salonta City Hall - reports and briefings.',
      keywords: 'information bulletin, reports, briefings',
    },
  },

  // Transparență - Generale
  transparentaGenerale: {
    ro: {
      title: 'Informații Generale Transparență - Primăria Salonta',
      description: 'Informații generale privind transparența instituțională și accesul la informații publice.',
      keywords: 'transparență, informații publice, acces, Legea 544',
    },
    hu: {
      title: 'Általános Átláthatósági Információk - Nagyszalonta',
      description: 'Általános információk az intézményi átláthatóságról és a közérdekű adatokhoz való hozzáférésről.',
      keywords: 'átláthatóság, közérdekű adatok, hozzáférés',
    },
    en: {
      title: 'General Transparency Information - Salonta',
      description: 'General information about institutional transparency and access to public information.',
      keywords: 'transparency, public information, access, Law 544',
    },
  },

  // Localizare
  localizare: {
    ro: {
      title: 'Localizare Salonta - Poziție Geografică',
      description: 'Localizarea geografică a municipiului Salonta - coordonate, acces, drumuri și căi ferate.',
      keywords: 'localizare, Salonta, poziție geografică, acces, hartă',
    },
    hu: {
      title: 'Nagyszalonta Elhelyezkedése - Földrajzi Pozíció',
      description: 'Nagyszalonta földrajzi elhelyezkedése - koordináták, megközelíthetőség, utak és vasutak.',
      keywords: 'elhelyezkedés, földrajzi pozíció, megközelíthetőség, térkép',
    },
    en: {
      title: 'Salonta Location - Geographic Position',
      description: 'Geographic location of Salonta - coordinates, access, roads and railways.',
      keywords: 'location, Salonta, geographic position, access, map',
    },
  },

  // Cultură
  cultura: {
    ro: {
      title: 'Cultură și Tradiții - Salonta',
      description: 'Viața culturală a municipiului Salonta - tradiții, evenimente, instituții culturale.',
      keywords: 'cultură, tradiții, evenimente culturale, Salonta',
    },
    hu: {
      title: 'Kultúra és Hagyományok - Nagyszalonta',
      description: 'Nagyszalonta kulturális élete - hagyományok, események, kulturális intézmények.',
      keywords: 'kultúra, hagyományok, kulturális események',
    },
    en: {
      title: 'Culture and Traditions - Salonta',
      description: 'Cultural life of Salonta - traditions, events, cultural institutions.',
      keywords: 'culture, traditions, cultural events, Salonta',
    },
  },

  // Economie
  economie: {
    ro: {
      title: 'Economia Municipiului Salonta',
      description: 'Informații despre economia municipiului Salonta - industrie, agricultură, oportunități de investiții.',
      keywords: 'economie, Salonta, industrie, agricultură, investiții',
    },
    hu: {
      title: 'Nagyszalonta Gazdasága',
      description: 'Információk Nagyszalonta gazdaságáról - ipar, mezőgazdaság, befektetési lehetőségek.',
      keywords: 'gazdaság, ipar, mezőgazdaság, befektetések',
    },
    en: {
      title: 'Salonta Economy',
      description: 'Information about Salonta economy - industry, agriculture, investment opportunities.',
      keywords: 'economy, Salonta, industry, agriculture, investments',
    },
  },

  // Orașe Înfrățite
  oraseInfratite: {
    ro: {
      title: 'Orașe Înfrățite - Salonta',
      description: 'Orașele înfrățite cu municipiul Salonta - parteneriate internaționale și cooperare.',
      keywords: 'orașe înfrățite, parteneriate, cooperare internațională',
    },
    hu: {
      title: 'Testvérvárosok - Nagyszalonta',
      description: 'Nagyszalonta testvérvárosai - nemzetközi partnerségek és együttműködés.',
      keywords: 'testvérvárosok, partnerségek, nemzetközi együttműködés',
    },
    en: {
      title: 'Twin Cities - Salonta',
      description: 'Twin cities of Salonta - international partnerships and cooperation.',
      keywords: 'twin cities, partnerships, international cooperation',
    },
  },

  // Hartă Digitală
  hartaDigitala: {
    ro: {
      title: 'Hartă Digitală - Salonta',
      description: 'Harta digitală interactivă a municipiului Salonta - locații, puncte de interes, instituții.',
      keywords: 'hartă digitală, Salonta, locații, puncte de interes, GIS',
    },
    hu: {
      title: 'Digitális Térkép - Nagyszalonta',
      description: 'Nagyszalonta interaktív digitális térképe - helyszínek, nevezetességek, intézmények.',
      keywords: 'digitális térkép, helyszínek, nevezetességek, GIS',
    },
    en: {
      title: 'Digital Map - Salonta',
      description: 'Interactive digital map of Salonta - locations, points of interest, institutions.',
      keywords: 'digital map, Salonta, locations, points of interest, GIS',
    },
  },

  // Galerie
  galerie: {
    ro: {
      title: 'Galerie Foto - Salonta',
      description: 'Galerie foto a municipiului Salonta - imagini cu obiective turistice, evenimente și peisaje.',
      keywords: 'galerie foto, imagini, Salonta, obiective turistice',
    },
    hu: {
      title: 'Fotógaléria - Nagyszalonta',
      description: 'Nagyszalonta fotógalériája - képek turisztikai látványosságokról, eseményekről és tájakról.',
      keywords: 'fotógaléria, képek, látványosságok',
    },
    en: {
      title: 'Photo Gallery - Salonta',
      description: 'Photo gallery of Salonta - images of tourist attractions, events and landscapes.',
      keywords: 'photo gallery, images, Salonta, tourist attractions',
    },
  },

  // Excursie Virtuală
  excursieVirtuala: {
    ro: {
      title: 'Excursie Virtuală - Salonta',
      description: 'Excursie virtuală prin municipiul Salonta - tururi 360°, fotografii panoramice.',
      keywords: 'excursie virtuală, tur virtual, 360, Salonta, panoramic',
    },
    hu: {
      title: 'Virtuális Túra - Nagyszalonta',
      description: 'Virtuális túra Nagyszalontán - 360°-os túrák, panorámafotók.',
      keywords: 'virtuális túra, 360, panorámafotók',
    },
    en: {
      title: 'Virtual Tour - Salonta',
      description: 'Virtual tour of Salonta - 360° tours, panoramic photos.',
      keywords: 'virtual tour, 360, Salonta, panoramic',
    },
  },

  // Cetățeni de Onoare
  cetateniDeOnoare: {
    ro: {
      title: 'Cetățeni de Onoare - Salonta',
      description: 'Lista cetățenilor de onoare ai municipiului Salonta și personalitățile marcante.',
      keywords: 'cetățeni de onoare, personalități, Salonta, distincții',
    },
    hu: {
      title: 'Díszpolgárok - Nagyszalonta',
      description: 'Nagyszalonta díszpolgárainak listája és kiemelkedő személyiségek.',
      keywords: 'díszpolgárok, személyiségek, kitüntetések',
    },
    en: {
      title: 'Honorary Citizens - Salonta',
      description: 'List of honorary citizens of Salonta and notable personalities.',
      keywords: 'honorary citizens, personalities, Salonta, distinctions',
    },
  },

  // Instituții
  institutii: {
    ro: {
      title: 'Instituții Publice - Salonta',
      description: 'Instituțiile publice din municipiul Salonta - muzeu, bibliotecă, centru cultural, piscină.',
      keywords: 'instituții, Salonta, muzeu, bibliotecă, cultură, sport',
    },
    hu: {
      title: 'Közintézmények - Nagyszalonta',
      description: 'Nagyszalonta közintézményei - múzeum, könyvtár, művelődési központ, uszoda.',
      keywords: 'közintézmények, múzeum, könyvtár, kultúra, sport',
    },
    en: {
      title: 'Public Institutions - Salonta',
      description: 'Public institutions in Salonta - museum, library, cultural center, swimming pool.',
      keywords: 'institutions, Salonta, museum, library, culture, sports',
    },
  },

  // Bibliotecă
  biblioteca: {
    ro: {
      title: 'Biblioteca Municipală - Salonta',
      description: 'Biblioteca Municipală Salonta - servicii, program, colecții și evenimente culturale.',
      keywords: 'bibliotecă, Salonta, cărți, lectură, evenimente culturale',
    },
    hu: {
      title: 'Városi Könyvtár - Nagyszalonta',
      description: 'Nagyszalonta Városi Könyvtára - szolgáltatások, nyitvatartás, gyűjtemények és kulturális események.',
      keywords: 'könyvtár, könyvek, olvasás, kulturális események',
    },
    en: {
      title: 'Municipal Library - Salonta',
      description: 'Salonta Municipal Library - services, schedule, collections and cultural events.',
      keywords: 'library, Salonta, books, reading, cultural events',
    },
  },

  // Casa de Cultură
  casaCultura: {
    ro: {
      title: 'Casa de Cultură - Salonta',
      description: 'Casa de Cultură a municipiului Salonta - evenimente, spectacole, activități culturale.',
      keywords: 'casa de cultură, Salonta, evenimente, spectacole, cultură',
    },
    hu: {
      title: 'Művelődési Ház - Nagyszalonta',
      description: 'Nagyszalonta Művelődési Háza - események, előadások, kulturális tevékenységek.',
      keywords: 'művelődési ház, események, előadások, kultúra',
    },
    en: {
      title: 'House of Culture - Salonta',
      description: 'Salonta House of Culture - events, shows, cultural activities.',
      keywords: 'house of culture, Salonta, events, shows, culture',
    },
  },

  // Bazin de Înot
  bazinInot: {
    ro: {
      title: 'Bazinul de Înot - Salonta',
      description: 'Bazinul de înot acoperit din Salonta - program, tarife, servicii și facilitați.',
      keywords: 'bazin înot, piscină, Salonta, sport, înot',
    },
    hu: {
      title: 'Fedett Uszoda - Nagyszalonta',
      description: 'Nagyszalonta fedett uszodája - nyitvatartás, árak, szolgáltatások és létesítmények.',
      keywords: 'uszoda, úszás, sport, létesítmények',
    },
    en: {
      title: 'Swimming Pool - Salonta',
      description: 'Salonta indoor swimming pool - schedule, prices, services and facilities.',
      keywords: 'swimming pool, Salonta, sports, swimming',
    },
  },

  // Cantina Socială
  cantinaSociala: {
    ro: {
      title: 'Cantina Socială - Salonta',
      description: 'Cantina de Ajutor Social din Salonta - servicii, beneficiari, program.',
      keywords: 'cantina socială, asistență socială, Salonta',
    },
    hu: {
      title: 'Szociális Étkeztetés - Nagyszalonta',
      description: 'Nagyszalonta szociális étkeztetési szolgáltatása - szolgáltatások, jogosultak, program.',
      keywords: 'szociális étkeztetés, szociális segély',
    },
    en: {
      title: 'Social Canteen - Salonta',
      description: 'Social Canteen in Salonta - services, beneficiaries, schedule.',
      keywords: 'social canteen, social assistance, Salonta',
    },
  },

  // Centrul de Zi
  centrulDeZi: {
    ro: {
      title: 'Centrul de Zi Bunicii Comunității - Salonta',
      description: 'Centrul de zi pentru vârstnici Bunicii Comunității din Salonta - servicii și activități.',
      keywords: 'centru de zi, vârstnici, asistență socială, Salonta',
    },
    hu: {
      title: 'Idősek Nappali Központja - Nagyszalonta',
      description: 'Nagyszalonta időseknek szóló nappali központja - szolgáltatások és tevékenységek.',
      keywords: 'nappali központ, idősek, szociális szolgáltatások',
    },
    en: {
      title: 'Day Center for Elderly - Salonta',
      description: 'Day center for elderly Community Grandparents in Salonta - services and activities.',
      keywords: 'day center, elderly, social assistance, Salonta',
    },
  },

  // Cuibul Dropiei
  cuibulDropiei: {
    ro: {
      title: 'Cuibul Dropiei - Complex Sportiv Salonta',
      description: 'Complexul sportiv Cuibul Dropiei din Salonta - aquapark, piscine, spa, fitness.',
      keywords: 'Cuibul Dropiei, aquapark, piscină, spa, fitness, Salonta',
    },
    hu: {
      title: 'Túzokfészek - Sportkomplexum Nagyszalonta',
      description: 'Nagyszalonta Túzokfészek sportkomplexuma - aquapark, medencék, spa, fitness.',
      keywords: 'Túzokfészek, aquapark, uszoda, spa, fitness',
    },
    en: {
      title: 'Bustard Nest - Sports Complex Salonta',
      description: 'Bustard Nest sports complex in Salonta - aquapark, pools, spa, fitness.',
      keywords: 'Bustard Nest, aquapark, pool, spa, fitness, Salonta',
    },
  },

  // Asistență Medicală
  asistentaMedicala: {
    ro: {
      title: 'Asistență Medicală - Salonta',
      description: 'Informații despre asistența medicală în Salonta - spitale, clinici, medici de familie.',
      keywords: 'asistență medicală, spital, clinică, medici, Salonta',
    },
    hu: {
      title: 'Egészségügyi Ellátás - Nagyszalonta',
      description: 'Információk az egészségügyi ellátásról Nagyszalontán - kórházak, klinikák, családorvosok.',
      keywords: 'egészségügyi ellátás, kórház, klinika, orvosok',
    },
    en: {
      title: 'Medical Assistance - Salonta',
      description: 'Information about medical assistance in Salonta - hospitals, clinics, family doctors.',
      keywords: 'medical assistance, hospital, clinic, doctors, Salonta',
    },
  },

  // Plăți Online
  platiOnline: {
    ro: {
      title: 'Plăți Online - Ghișeul.ro',
      description: 'Plătește online taxe și impozite locale prin Ghișeul.ro - rapid, sigur și convenabil.',
      keywords: 'plăți online, Ghișeul.ro, taxe, impozite, plată card',
    },
    hu: {
      title: 'Online Fizetés - Ghișeul.ro',
      description: 'Fizessen online helyi adókat és illetékeket a Ghișeul.ro-n keresztül - gyorsan, biztonságosan.',
      keywords: 'online fizetés, Ghișeul.ro, adók, illetékek, kártyás fizetés',
    },
    en: {
      title: 'Online Payments - Ghișeul.ro',
      description: 'Pay online local taxes and fees through Ghișeul.ro - fast, secure and convenient.',
      keywords: 'online payments, Ghișeul.ro, taxes, fees, card payment',
    },
  },

  // Probleme Sociale
  problemeSociale: {
    ro: {
      title: 'Raportare Probleme Sociale - Primăria Salonta',
      description: 'Raportează probleme sociale și situații vulnerabile în municipiul Salonta.',
      keywords: 'probleme sociale, asistență socială, raportare, vulnerabil',
    },
    hu: {
      title: 'Szociális Problémák Bejelentése - Nagyszalonta',
      description: 'Szociális problémák és veszélyeztetett helyzetek bejelentése Nagyszalontán.',
      keywords: 'szociális problémák, szociális segély, bejelentés',
    },
    en: {
      title: 'Report Social Issues - Salonta City Hall',
      description: 'Report social issues and vulnerable situations in Salonta.',
      keywords: 'social issues, social assistance, report, vulnerable',
    },
  },

  // Programe
  programe: {
    ro: {
      title: 'Programe și Proiecte - Primăria Salonta',
      description: 'Programele și proiectele derulate de Primăria Municipiului Salonta - fonduri europene, investiții.',
      keywords: 'programe, proiecte, fonduri europene, investiții, dezvoltare',
    },
    hu: {
      title: 'Programok és Projektek - Nagyszalonta',
      description: 'Nagyszalonta Polgármesteri Hivatala által végrehajtott programok és projektek - EU-s pályázatok, beruházások.',
      keywords: 'programok, projektek, EU-s pályázatok, beruházások, fejlesztés',
    },
    en: {
      title: 'Programs and Projects - Salonta City Hall',
      description: 'Programs and projects implemented by Salonta City Hall - European funds, investments.',
      keywords: 'programs, projects, European funds, investments, development',
    },
  },

  // Rapoarte și Studii
  rapoarteStudii: {
    ro: {
      title: 'Rapoarte și Studii - Primăria Salonta',
      description: 'Rapoarte, studii și analize elaborate de sau pentru Primăria Municipiului Salonta.',
      keywords: 'rapoarte, studii, analize, cercetare, Primăria Salonta',
    },
    hu: {
      title: 'Jelentések és Tanulmányok - Nagyszalonta',
      description: 'Jelentések, tanulmányok és elemzések a Polgármesteri Hivatal számára vagy által készítve.',
      keywords: 'jelentések, tanulmányok, elemzések, kutatás',
    },
    en: {
      title: 'Reports and Studies - Salonta City Hall',
      description: 'Reports, studies and analyses prepared by or for Salonta City Hall.',
      keywords: 'reports, studies, analyses, research, Salonta',
    },
  },

  // Accesibilitate
  accesibilitate: {
    ro: {
      title: 'Declarație de Accesibilitate - Primăria Salonta',
      description: 'Declarația de accesibilitate a site-ului Primăriei Salonta conform standardelor WCAG.',
      keywords: 'accesibilitate, WCAG, site accesibil, dizabilități',
    },
    hu: {
      title: 'Akadálymentességi Nyilatkozat - Nagyszalonta',
      description: 'A Polgármesteri Hivatal weboldalának akadálymentességi nyilatkozata a WCAG szabványok szerint.',
      keywords: 'akadálymentesség, WCAG, hozzáférhető weboldal',
    },
    en: {
      title: 'Accessibility Statement - Salonta City Hall',
      description: 'Accessibility statement for Salonta City Hall website according to WCAG standards.',
      keywords: 'accessibility, WCAG, accessible website, disabilities',
    },
  },

  // Politica de Confidențialitate
  politicaConfidentialitate: {
    ro: {
      title: 'Politica de Confidențialitate - Primăria Salonta',
      description: 'Politica de confidențialitate și protecția datelor personale pe site-ul Primăriei Salonta.',
      keywords: 'confidențialitate, date personale, GDPR, politică',
    },
    hu: {
      title: 'Adatvédelmi Szabályzat - Nagyszalonta',
      description: 'Adatvédelmi szabályzat és személyes adatok védelme a Polgármesteri Hivatal weboldalán.',
      keywords: 'adatvédelem, személyes adatok, GDPR, szabályzat',
    },
    en: {
      title: 'Privacy Policy - Salonta City Hall',
      description: 'Privacy policy and personal data protection on Salonta City Hall website.',
      keywords: 'privacy, personal data, GDPR, policy',
    },
  },

  // Politica Cookies
  politicaCookies: {
    ro: {
      title: 'Politica de Cookies - Primăria Salonta',
      description: 'Politica de utilizare a cookie-urilor pe site-ul Primăriei Municipiului Salonta.',
      keywords: 'cookies, politică cookies, date navigare',
    },
    hu: {
      title: 'Cookie Szabályzat - Nagyszalonta',
      description: 'Cookie-k használatának szabályzata a Polgármesteri Hivatal weboldalán.',
      keywords: 'cookie-k, cookie szabályzat, böngészési adatok',
    },
    en: {
      title: 'Cookie Policy - Salonta City Hall',
      description: 'Cookie usage policy on Salonta City Hall website.',
      keywords: 'cookies, cookie policy, browsing data',
    },
  },

  // Sitemap
  sitemap: {
    ro: {
      title: 'Harta Site-ului - Primăria Salonta',
      description: 'Harta completă a site-ului Primăriei Municipiului Salonta - toate paginile și secțiunile.',
      keywords: 'hartă site, sitemap, navigare, pagini',
    },
    hu: {
      title: 'Oldaltérkép - Nagyszalonta',
      description: 'Nagyszalonta Polgármesteri Hivatala weboldalának teljes térképe - minden oldal és szekció.',
      keywords: 'oldaltérkép, sitemap, navigáció, oldalak',
    },
    en: {
      title: 'Sitemap - Salonta City Hall',
      description: 'Complete sitemap of Salonta City Hall website - all pages and sections.',
      keywords: 'sitemap, navigation, pages',
    },
  },

  // Agenți Economici
  agentiEconomici: {
    ro: {
      title: 'Agenți Economici - Primăria Salonta',
      description: 'Director cu firmele și agenții economici din Municipiul Salonta.',
      keywords: 'agenți economici, firme, societăți, Salonta',
    },
    hu: {
      title: 'Gazdasági Szereplők - Nagyszalonta',
      description: 'Nagyszalontai cégek és gazdasági szereplők jegyzéke.',
      keywords: 'gazdasági szereplők, cégek, vállalkozások',
    },
    en: {
      title: 'Economic Agents - Salonta City Hall',
      description: 'Directory of companies and economic agents in Salonta Municipality.',
      keywords: 'economic agents, companies, businesses, Salonta',
    },
  },

  // Educație
  educatie: {
    ro: {
      title: 'Educație - Primăria Salonta',
      description: 'Informații despre școli, grădinițe și instituții de învățământ din Municipiul Salonta.',
      keywords: 'educație, școli, grădinițe, licee, învățământ, Salonta',
    },
    hu: {
      title: 'Oktatás - Nagyszalonta',
      description: 'Információk az iskolákról, óvodákról és oktatási intézményekről Nagyszalontán.',
      keywords: 'oktatás, iskolák, óvodák, líceumok',
    },
    en: {
      title: 'Education - Salonta City Hall',
      description: 'Information about schools, kindergartens and educational institutions in Salonta.',
      keywords: 'education, schools, kindergartens, high schools, Salonta',
    },
  },

  // Evenimente
  evenimente: {
    ro: {
      title: 'Evenimente - Primăria Salonta',
      description: 'Calendar cu evenimente culturale, sportive și comunitare în Municipiul Salonta.',
      keywords: 'evenimente, calendar, spectacole, concerte, Salonta',
    },
    hu: {
      title: 'Események - Nagyszalonta',
      description: 'Kulturális, sport és közösségi események naptára Nagyszalontán.',
      keywords: 'események, naptár, előadások, koncertek',
    },
    en: {
      title: 'Events - Salonta City Hall',
      description: 'Calendar of cultural, sports and community events in Salonta Municipality.',
      keywords: 'events, calendar, shows, concerts, Salonta',
    },
  },

  // FAQ
  faq: {
    ro: {
      title: 'Întrebări Frecvente (FAQ) - Primăria Salonta',
      description: 'Răspunsuri la cele mai frecvente întrebări despre serviciile Primăriei Salonta.',
      keywords: 'FAQ, întrebări frecvente, răspunsuri, ajutor',
    },
    hu: {
      title: 'Gyakori Kérdések (GYIK) - Nagyszalonta',
      description: 'Válaszok a leggyakoribb kérdésekre a Polgármesteri Hivatal szolgáltatásairól.',
      keywords: 'GYIK, gyakori kérdések, válaszok, segítség',
    },
    en: {
      title: 'Frequently Asked Questions (FAQ) - Salonta City Hall',
      description: 'Answers to frequently asked questions about Salonta City Hall services.',
      keywords: 'FAQ, frequently asked questions, answers, help',
    },
  },

  // Raportează Problemă
  raporteazaProblema: {
    ro: {
      title: 'Raportează o Problemă - Primăria Salonta',
      description: 'Raportați probleme precum gropi în asfalt, iluminat stradal defect sau alte probleme din Salonta.',
      keywords: 'raportare probleme, sesizări, gropi, iluminat, Salonta',
    },
    hu: {
      title: 'Probléma Bejelentés - Nagyszalonta',
      description: 'Jelentsen be problémákat, mint kátyúk, hibás közvilágítás vagy más városi problémákat.',
      keywords: 'probléma bejelentés, kátyúk, közvilágítás',
    },
    en: {
      title: 'Report a Problem - Salonta City Hall',
      description: 'Report issues like potholes, broken street lighting or other city problems in Salonta.',
      keywords: 'report problems, issues, potholes, street lighting',
    },
  },

  // Registru Agricol
  registruAgricol: {
    ro: {
      title: 'Registru Agricol - Primăria Salonta',
      description: 'Informații despre registrul agricol, adeverințe și documente necesare pentru agricultura locală.',
      keywords: 'registru agricol, adeverințe, agricultură, terenuri',
    },
    hu: {
      title: 'Mezőgazdasági Nyilvántartás - Nagyszalonta',
      description: 'Információk a mezőgazdasági nyilvántartásról, igazolásokról és szükséges dokumentumokról.',
      keywords: 'mezőgazdasági nyilvántartás, igazolások, mezőgazdaság',
    },
    en: {
      title: 'Agricultural Registry - Salonta City Hall',
      description: 'Information about agricultural registry, certificates and required documents.',
      keywords: 'agricultural registry, certificates, farming, land',
    },
  },

  // Sănătate
  sanatate: {
    ro: {
      title: 'Sănătate - Primăria Salonta',
      description: 'Informații despre spitale, farmacii, cabinete medicale și servicii de urgență din Salonta.',
      keywords: 'sănătate, spitale, farmacii, medici, urgență, Salonta',
    },
    hu: {
      title: 'Egészségügy - Nagyszalonta',
      description: 'Információk a kórházakról, gyógyszertárakról, orvosi rendelőkről és sürgősségi szolgáltatásokról.',
      keywords: 'egészségügy, kórházak, gyógyszertárak, orvosok',
    },
    en: {
      title: 'Health - Salonta City Hall',
      description: 'Information about hospitals, pharmacies, medical offices and emergency services in Salonta.',
      keywords: 'health, hospitals, pharmacies, doctors, emergency',
    },
  },

  // Sport
  sport: {
    ro: {
      title: 'Sport - Primăria Salonta',
      description: 'Facilități sportive, terenuri de sport, bazine și zone de agrement din Municipiul Salonta.',
      keywords: 'sport, terenuri, bazin, agrement, fitness, Salonta',
    },
    hu: {
      title: 'Sport - Nagyszalonta',
      description: 'Sportlétesítmények, sportpályák, uszodák és szabadidős területek Nagyszalontán.',
      keywords: 'sport, pályák, uszoda, szabadidő, fitness',
    },
    en: {
      title: 'Sports - Salonta City Hall',
      description: 'Sports facilities, fields, pools and recreation areas in Salonta Municipality.',
      keywords: 'sports, fields, pool, recreation, fitness, Salonta',
    },
  },

  // Stare Civilă
  stareCivila: {
    ro: {
      title: 'Stare Civilă - Primăria Salonta',
      description: 'Servicii de stare civilă - certificate de naștere, căsătorie, deces și alte acte oficiale.',
      keywords: 'stare civilă, naștere, căsătorie, deces, certificate',
    },
    hu: {
      title: 'Anyakönyvi Hivatal - Nagyszalonta',
      description: 'Anyakönyvi szolgáltatások - születési, házassági, halálozási anyakönyvi kivonatok.',
      keywords: 'anyakönyv, születés, házasság, halálozás, okmányok',
    },
    en: {
      title: 'Civil Registry - Salonta City Hall',
      description: 'Civil registry services - birth, marriage, death certificates and official documents.',
      keywords: 'civil registry, birth, marriage, death, certificates',
    },
  },

  // Transport
  transport: {
    ro: {
      title: 'Transport - Primăria Salonta',
      description: 'Informații despre transportul public, rute și orare în Municipiul Salonta.',
      keywords: 'transport, autobuz, rute, orare, transport public',
    },
    hu: {
      title: 'Közlekedés - Nagyszalonta',
      description: 'Információk a tömegközlekedésről, útvonalakról és menetrendekről Nagyszalontán.',
      keywords: 'közlekedés, busz, útvonalak, menetrend',
    },
    en: {
      title: 'Transport - Salonta City Hall',
      description: 'Information about public transport, routes and schedules in Salonta Municipality.',
      keywords: 'transport, bus, routes, schedules, public transport',
    },
  },

  // PMUD
  pmud: {
    ro: {
      title: 'Plan de Mobilitate Urbană Durabilă (PMUD) - Primăria Salonta',
      description: 'Planul de Mobilitate Urbană Durabilă al Municipiului Salonta 2017-2032.',
      keywords: 'PMUD, mobilitate urbană, transport durabil, Salonta',
    },
    hu: {
      title: 'Fenntartható Városi Mobilitási Terv (PMUD) - Nagyszalonta',
      description: 'Nagyszalonta Fenntartható Városi Mobilitási Terve 2017-2032.',
      keywords: 'PMUD, városi mobilitás, fenntartható közlekedés',
    },
    en: {
      title: 'Sustainable Urban Mobility Plan (SUMP) - Salonta City Hall',
      description: 'Sustainable Urban Mobility Plan for Salonta Municipality 2017-2032.',
      keywords: 'SUMP, urban mobility, sustainable transport, Salonta',
    },
  },

  // PNRR
  pnrr: {
    ro: {
      title: 'Proiecte PNRR - Primăria Salonta',
      description: 'Proiecte finanțate prin Planul Național de Redresare și Reziliență în Municipiul Salonta.',
      keywords: 'PNRR, fonduri europene, proiecte, investiții',
    },
    hu: {
      title: 'PNRR Projektek - Nagyszalonta',
      description: 'A Nemzeti Helyreállítási és Reziliencia Terv által finanszírozott projektek.',
      keywords: 'PNRR, EU-s pályázatok, projektek, beruházások',
    },
    en: {
      title: 'NRRP Projects - Salonta City Hall',
      description: 'Projects funded through the National Recovery and Resilience Plan in Salonta.',
      keywords: 'NRRP, European funds, projects, investments',
    },
  },

  // Strategie Dezvoltare
  strategieDezvoltare: {
    ro: {
      title: 'Strategie de Dezvoltare Locală - Primăria Salonta',
      description: 'Strategia de Dezvoltare Locală a Municipiului Salonta - viziune și obiective pe termen lung.',
      keywords: 'strategie dezvoltare, viziune, obiective, Salonta',
    },
    hu: {
      title: 'Helyi Fejlesztési Stratégia - Nagyszalonta',
      description: 'Nagyszalonta Helyi Fejlesztési Stratégiája - hosszú távú vízió és célkitűzések.',
      keywords: 'fejlesztési stratégia, vízió, célkitűzések',
    },
    en: {
      title: 'Local Development Strategy - Salonta City Hall',
      description: 'Local Development Strategy of Salonta Municipality - long-term vision and objectives.',
      keywords: 'development strategy, vision, objectives, Salonta',
    },
  },

  // Proiecte Europene
  proiecteEuropene: {
    ro: {
      title: 'Proiecte Europene - Primăria Salonta',
      description: 'Proiecte finanțate din fonduri europene implementate de Primăria Municipiului Salonta.',
      keywords: 'proiecte europene, fonduri EU, finanțări, Salonta',
    },
    hu: {
      title: 'Európai Projektek - Nagyszalonta',
      description: 'EU-s pályázatokból finanszírozott projektek Nagyszalontán.',
      keywords: 'európai projektek, EU-s pályázatok, finanszírozás',
    },
    en: {
      title: 'European Projects - Salonta City Hall',
      description: 'Projects funded from European funds implemented by Salonta City Hall.',
      keywords: 'European projects, EU funds, financing, Salonta',
    },
  },

  // Proiecte Locale
  proiecteLocale: {
    ro: {
      title: 'Proiecte Locale - Primăria Salonta',
      description: 'Proiecte finanțate din bugetul local - cultură, sport, mediu, sociale.',
      keywords: 'proiecte locale, finanțări, cultură, sport, mediu',
    },
    hu: {
      title: 'Helyi Projektek - Nagyszalonta',
      description: 'Helyi költségvetésből finanszírozott projektek - kultúra, sport, környezetvédelem.',
      keywords: 'helyi projektek, finanszírozás, kultúra, sport',
    },
    en: {
      title: 'Local Projects - Salonta City Hall',
      description: 'Projects funded from local budget - culture, sports, environment, social.',
      keywords: 'local projects, funding, culture, sports, environment',
    },
  },

  // Program Regional Nord-Vest
  programRegionalNordVest: {
    ro: {
      title: 'Program Regional Nord-Vest - Primăria Salonta',
      description: 'Proiecte finanțate prin Programul Regional Nord-Vest în Municipiul Salonta.',
      keywords: 'program regional, Nord-Vest, proiecte, fonduri',
    },
    hu: {
      title: 'Észak-Nyugati Regionális Program - Nagyszalonta',
      description: 'Az Észak-Nyugati Regionális Program által finanszírozott projektek.',
      keywords: 'regionális program, Észak-Nyugat, projektek',
    },
    en: {
      title: 'North-West Regional Program - Salonta City Hall',
      description: 'Projects funded through the North-West Regional Program in Salonta.',
      keywords: 'regional program, North-West, projects, funds',
    },
  },

  // SNA - Strategia Națională Anticorupție
  sna: {
    ro: {
      title: 'Strategia Națională Anticorupție (SNA) - Primăria Salonta',
      description: 'Implementarea Strategiei Naționale Anticorupție la nivelul Primăriei Municipiului Salonta.',
      keywords: 'SNA, anticorupție, integritate, transparență',
    },
    hu: {
      title: 'Nemzeti Korrupcióellenes Stratégia (SNA) - Nagyszalonta',
      description: 'A Nemzeti Korrupcióellenes Stratégia végrehajtása a Polgármesteri Hivatalban.',
      keywords: 'SNA, korrupcióellenes, integritás, átláthatóság',
    },
    en: {
      title: 'National Anti-Corruption Strategy (NAS) - Salonta City Hall',
      description: 'Implementation of National Anti-Corruption Strategy at Salonta City Hall.',
      keywords: 'NAS, anti-corruption, integrity, transparency',
    },
  },

  // SVSU - Serviciul Voluntar pentru Situații de Urgență
  svsu: {
    ro: {
      title: 'SVSU - Serviciul Voluntar pentru Situații de Urgență - Salonta',
      description: 'Informații despre Serviciul Voluntar pentru Situații de Urgență al Municipiului Salonta.',
      keywords: 'SVSU, situații de urgență, voluntari, pompieri',
    },
    hu: {
      title: 'SVSU - Önkéntes Vészhelyzeti Szolgálat - Nagyszalonta',
      description: 'Információk Nagyszalonta Önkéntes Vészhelyzeti Szolgálatáról.',
      keywords: 'SVSU, vészhelyzet, önkéntesek, tűzoltók',
    },
    en: {
      title: 'SVSU - Volunteer Emergency Service - Salonta',
      description: 'Information about the Volunteer Emergency Service of Salonta Municipality.',
      keywords: 'SVSU, emergency, volunteers, firefighters',
    },
  },

  // Rapoarte Audit
  rapoarteAudit: {
    ro: {
      title: 'Rapoarte de Audit - Primăria Salonta',
      description: 'Rapoarte de audit intern și extern ale Primăriei Municipiului Salonta.',
      keywords: 'rapoarte audit, control intern, verificări, Salonta',
    },
    hu: {
      title: 'Audit Jelentések - Nagyszalonta',
      description: 'Belső és külső audit jelentések a Polgármesteri Hivatalban.',
      keywords: 'audit jelentések, belső ellenőrzés, vizsgálatok',
    },
    en: {
      title: 'Audit Reports - Salonta City Hall',
      description: 'Internal and external audit reports of Salonta City Hall.',
      keywords: 'audit reports, internal control, verifications',
    },
  },

  // Studii
  studii: {
    ro: {
      title: 'Studii și Cercetări - Primăria Salonta',
      description: 'Studii, analize și cercetări elaborate pentru dezvoltarea Municipiului Salonta.',
      keywords: 'studii, cercetări, analize, dezvoltare, Salonta',
    },
    hu: {
      title: 'Tanulmányok és Kutatások - Nagyszalonta',
      description: 'Tanulmányok, elemzések és kutatások Nagyszalonta fejlesztéséhez.',
      keywords: 'tanulmányok, kutatások, elemzések, fejlesztés',
    },
    en: {
      title: 'Studies and Research - Salonta City Hall',
      description: 'Studies, analyses and research for the development of Salonta Municipality.',
      keywords: 'studies, research, analyses, development',
    },
  },

  // Petiții Online
  petitiiOnline: {
    ro: {
      title: 'Petiții Online - Primăria Salonta',
      description: 'Depuneți petiții online către Primăria Municipiului Salonta - formular electronic.',
      keywords: 'petiții online, cereri, sesizări, formular electronic',
    },
    hu: {
      title: 'Online Petíciók - Nagyszalonta',
      description: 'Online petíciók benyújtása a Polgármesteri Hivatalhoz - elektronikus űrlap.',
      keywords: 'online petíciók, kérelmek, beadványok',
    },
    en: {
      title: 'Online Petitions - Salonta City Hall',
      description: 'Submit online petitions to Salonta City Hall - electronic form.',
      keywords: 'online petitions, requests, submissions, electronic form',
    },
  },

  // Hotărâri Republicate
  hotarariRepublicate: {
    ro: {
      title: 'Hotărâri Republicate - Consiliul Local Salonta',
      description: 'Hotărâri ale Consiliului Local Salonta republicate cu modificări și completări.',
      keywords: 'hotărâri republicate, consiliul local, modificări',
    },
    hu: {
      title: 'Újraközzétett Határozatok - Nagyszalonta Helyi Tanács',
      description: 'Módosításokkal és kiegészítésekkel újraközzétett helyi tanácsi határozatok.',
      keywords: 'újraközzétett határozatok, helyi tanács, módosítások',
    },
    en: {
      title: 'Republished Decisions - Salonta Local Council',
      description: 'Salonta Local Council decisions republished with amendments.',
      keywords: 'republished decisions, local council, amendments',
    },
  },

  // Ordine de Zi
  ordineDeZi: {
    ro: {
      title: 'Ordine de Zi - Consiliul Local Salonta',
      description: 'Ordinele de zi ale ședințelor Consiliului Local al Municipiului Salonta.',
      keywords: 'ordine de zi, ședințe, consiliul local, Salonta',
    },
    hu: {
      title: 'Napirend - Nagyszalonta Helyi Tanács',
      description: 'Nagyszalonta Helyi Tanácsának ülésnapirend​jei.',
      keywords: 'napirend, ülések, helyi tanács',
    },
    en: {
      title: 'Agenda - Salonta Local Council',
      description: 'Meeting agendas of Salonta Local Council.',
      keywords: 'agenda, meetings, local council, Salonta',
    },
  },

  // Rapoarte de Activitate Consiliul Local
  rapoarteActivitateConsiliu: {
    ro: {
      title: 'Rapoarte de Activitate - Consiliul Local Salonta',
      description: 'Rapoarte de activitate ale consilierilor locali din Municipiul Salonta.',
      keywords: 'rapoarte activitate, consilieri, consiliul local',
    },
    hu: {
      title: 'Tevékenységi Jelentések - Nagyszalonta Helyi Tanács',
      description: 'A nagyszalontai helyi tanácsosok tevékenységi jelentései.',
      keywords: 'tevékenységi jelentések, tanácsosok, helyi tanács',
    },
    en: {
      title: 'Activity Reports - Salonta Local Council',
      description: 'Activity reports of local councilors from Salonta Municipality.',
      keywords: 'activity reports, councilors, local council',
    },
  },

  // Declarații de Avere Consiliul Local
  declaratiiAvereConsiliu: {
    ro: {
      title: 'Declarații de Avere Consilieri - Consiliul Local Salonta',
      description: 'Declarațiile de avere și interese ale consilierilor locali din Salonta.',
      keywords: 'declarații avere, consilieri, interese, transparență',
    },
    hu: {
      title: 'Tanácsosi Vagyonnyilatkozatok - Nagyszalonta Helyi Tanács',
      description: 'A nagyszalontai helyi tanácsosok vagyon- és érdekeltségi nyilatkozatai.',
      keywords: 'vagyonnyilatkozatok, tanácsosok, érdekeltségek',
    },
    en: {
      title: 'Asset Declarations Councilors - Salonta Local Council',
      description: 'Asset and interest declarations of local councilors from Salonta.',
      keywords: 'asset declarations, councilors, interests, transparency',
    },
  },

  // Ședințe Consiliul Local
  sedinte: {
    ro: {
      title: 'Ședințe Consiliul Local - Primăria Salonta',
      description: 'Calendarul ședințelor Consiliului Local al Municipiului Salonta - ordine de zi, procese verbale, hotărâri și înregistrări video.',
      keywords: 'ședințe consiliu local, ordine de zi, procese verbale, hotărâri, Salonta',
    },
    hu: {
      title: 'Helyi Tanács Ülései - Nagyszalonta',
      description: 'Nagyszalonta Helyi Tanácsának ülésrendje - napirend, jegyzőkönyvek, határozatok és videófelvételek.',
      keywords: 'helyi tanács ülések, napirend, jegyzőkönyvek, határozatok',
    },
    en: {
      title: 'Local Council Sessions - Salonta City Hall',
      description: 'Calendar of Local Council sessions of Salonta Municipality - agendas, minutes, decisions and video recordings.',
      keywords: 'local council sessions, agendas, minutes, decisions, Salonta',
    },
  },

  } as const;

export type PageKey = keyof typeof PAGE_SEO;
export type Locale = typeof SEO_CONFIG.locales[number];

