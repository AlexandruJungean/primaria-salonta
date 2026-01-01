export interface LeadershipMember {
  id: string;
  position: string;
  photo: string | null;
  email: string;
  phone: string;
  education: {
    ro: string[];
    hu: string[];
    en: string[];
  };
  subordinateDepartments: {
    ro: string[];
    hu: string[];
    en: string[];
  };
  mainResponsibilities: {
    ro: string;
    hu: string;
    en: string;
  };
  translations: {
    ro: { name: string; position: string; audienceSchedule: string };
    hu: { name: string; position: string; audienceSchedule: string };
    en: { name: string; position: string; audienceSchedule: string };
  };
}

export const LEADERSHIP: LeadershipMember[] = [
  {
    id: 'primar',
    position: 'primar',
    photo: '/images/consilul local/primar-torok-laszlo.jpg',
    email: 'primsal3@gmail.com',
    phone: '',
    education: {
      ro: [
        'Facultatea Electromecanică din Oradea, promoția 1992',
        'Facultatea de Științe Juridice „Vasile Goldiș" din Arad, promoția 2005',
      ],
      hu: [
        'Nagyváradi Elektromechanikai Kar, 1992-es évfolyam',
        'Aradi „Vasile Goldiș" Jogtudományi Kar, 2005-ös évfolyam',
      ],
      en: [
        'Faculty of Electromechanics, Oradea, Class of 1992',
        'Faculty of Legal Sciences "Vasile Goldiș", Arad, Class of 2005',
      ],
    },
    subordinateDepartments: {
      ro: [
        'Direcția Asistență Socială',
        'Direcția Economică',
        'Compartiment Audit',
        'Compartiment Programe și Dezvoltare Informatică',
        'Compartiment Protecție Civilă',
        'Cabinet Primar',
        'Compartiment Proiecte-Fonduri Nerambursabile',
      ],
      hu: [
        'Szociális Igazgatóság',
        'Gazdasági Igazgatóság',
        'Audit Osztály',
        'Programok és Informatikai Fejlesztés Osztály',
        'Polgári Védelem Osztály',
        'Polgármesteri Kabinet',
        'Projektek-Vissza Nem Térítendő Alapok Osztály',
      ],
      en: [
        'Social Assistance Directorate',
        'Economic Directorate',
        'Audit Department',
        'Programs and IT Development Department',
        'Civil Protection Department',
        'Mayor\'s Cabinet',
        'Projects-Non-Refundable Funds Department',
      ],
    },
    mainResponsibilities: {
      ro: 'Primarul asigură respectarea drepturilor și libertăților fundamentale ale cetățenilor, a prevederilor Constituției, precum și punerea în aplicare a legilor, a decretelor Președintelui României, a ordonanțelor și hotărârilor Guvernului, a hotărârilor consiliului local. Primarul dispune măsurile necesare și acordă sprijin pentru aplicarea ordinelor și instrucțiunilor cu caracter normativ ale miniștrilor, ale celorlalți conducători ai autorităților administrației publice centrale, ale prefectului, a dispozițiilor președintelui consiliului județean, precum și a hotărârilor consiliului județean, în condițiile legii.',
      hu: 'A polgármester biztosítja az állampolgárok alapvető jogainak és szabadságainak, az Alkotmány rendelkezéseinek tiszteletben tartását, valamint a törvények, Románia Elnökének rendeletei, a kormány rendeletei és határozatai, a helyi tanács határozatainak végrehajtását. A polgármester meghozza a szükséges intézkedéseket és támogatást nyújt a miniszterek, a közigazgatási hatóságok más vezetői, a prefektus normatív jellegű utasításainak és rendeleteinek, a megyei tanács elnökének rendelkezéseinek, valamint a megyei tanács határozatainak alkalmazásához, a törvénynek megfelelően.',
      en: 'The Mayor ensures respect for the fundamental rights and freedoms of citizens, the provisions of the Constitution, as well as the implementation of laws, decrees of the President of Romania, Government ordinances and decisions, and local council decisions. The Mayor takes necessary measures and provides support for the application of normative orders and instructions of ministers, other leaders of central public administration authorities, the prefect, dispositions of the county council president, as well as county council decisions, under the law.',
    },
    translations: {
      ro: {
        name: 'Török László',
        position: 'Primar',
        audienceSchedule: 'Săptămâni impare, Miercuri: 9:00 - 11:00',
      },
      hu: {
        name: 'Török László',
        position: 'Polgármester',
        audienceSchedule: 'Páratlan hetek, Szerda: 9:00 - 11:00',
      },
      en: {
        name: 'Török László',
        position: 'Mayor',
        audienceSchedule: 'Odd weeks, Wednesday: 9:00 - 11:00',
      },
    },
  },
  {
    id: 'viceprimar',
    position: 'viceprimar',
    photo: '/images/consilul local/viceprimar-horvath-janos.jpg',
    email: 'primsal3@gmail.com',
    phone: '',
    education: {
      ro: [],
      hu: [],
      en: [],
    },
    subordinateDepartments: {
      ro: [
        'Cabinet Viceprimar',
        'Direcție Arhitect Șef',
      ],
      hu: [
        'Alpolgármesteri Kabinet',
        'Főépítészi Igazgatóság',
      ],
      en: [
        'Deputy Mayor\'s Cabinet',
        'Chief Architect Directorate',
      ],
    },
    mainResponsibilities: {
      ro: 'Viceprimarul este subordonat primarului și, în situațiile prevăzute de lege, înlocuitorul de drept al acestuia, situație în care exercită, în numele primarului, atribuțiile ce îi revin acestuia.',
      hu: 'Az alpolgármester a polgármester alárendeltje, és a törvény által előírt helyzetekben a polgármester törvényes helyettese, amely esetben a polgármester nevében gyakorolja annak hatásköreit.',
      en: 'The Deputy Mayor is subordinate to the Mayor and, in situations provided by law, is the rightful substitute, in which case they exercise, on behalf of the Mayor, the responsibilities that belong to them.',
    },
    translations: {
      ro: {
        name: 'Horváth János',
        position: 'Viceprimar',
        audienceSchedule: 'Săptămâni pare, Miercuri: 9:00 - 11:00',
      },
      hu: {
        name: 'Horváth János',
        position: 'Alpolgármester',
        audienceSchedule: 'Páros hetek, Szerda: 9:00 - 11:00',
      },
      en: {
        name: 'Horváth János',
        position: 'Deputy Mayor',
        audienceSchedule: 'Even weeks, Wednesday: 9:00 - 11:00',
      },
    },
  },
  {
    id: 'secretar',
    position: 'secretar',
    photo: null,
    email: 'primsal3@gmail.com',
    phone: '',
    education: {
      ro: [
        'Universitatea din Oradea, Facultatea de Științe Juridice și Administrative - Licențiat în Științe Juridice, specializare Drept, promoția 1996',
        'Universitatea „Babeș-Bolyai" din Cluj-Napoca, Facultatea de Științe Politice și Administrative - Masterat: Științe Administrative, promoția 2005',
      ],
      hu: [
        'Nagyváradi Egyetem, Jog- és Közigazgatástudományi Kar - Jogtudományi oklevél, Jog szakirány, 1996-os évfolyam',
        'Babeș-Bolyai Tudományegyetem, Kolozsvár, Politika- és Közigazgatástudományi Kar - Közigazgatástudományi mesterképzés, 2005-ös évfolyam',
      ],
      en: [
        'University of Oradea, Faculty of Legal and Administrative Sciences - Law Degree, specialization in Law, Class of 1996',
        'Babeș-Bolyai University, Cluj-Napoca, Faculty of Political and Administrative Sciences - Master\'s in Administrative Sciences, Class of 2005',
      ],
    },
    subordinateDepartments: {
      ro: [
        'Serviciul Administrație Publică Locală',
        'Serviciul Gestiunea Resurselor Umane, Salarizare – Administrativ',
        'Serviciul Public Comunitar Local de Evidență a Persoanei',
        'Compartiment Arhivă',
        'Compartiment Evidență Registrul Agricol și Administrarea Patrimoniului Agricol',
        'Compartiment Monitor Oficial Local și Relația cu Consiliul Local',
        'Compartiment Relații Externe, Inovare și Investitori',
        'Compartiment Protocol și Relația cu Societatea Civilă',
      ],
      hu: [
        'Helyi Közigazgatási Szolgálat',
        'Humánerőforrás-gazdálkodási és Bérszámfejtési Szolgálat – Adminisztratív',
        'Helyi Személynyilvántartó Közszolgálat',
        'Levéltári Osztály',
        'Mezőgazdasági Nyilvántartás és Agrárpatrimónium Kezelése Osztály',
        'Helyi Hivatalos Közlöny és a Helyi Tanáccsal Való Kapcsolat Osztály',
        'Külkapcsolatok, Innováció és Befektetők Osztály',
        'Protokoll és Civil Társadalommal Való Kapcsolat Osztály',
      ],
      en: [
        'Local Public Administration Service',
        'Human Resources Management, Payroll Service – Administrative',
        'Local Community Public Service for Personal Records',
        'Archive Department',
        'Agricultural Registry and Agricultural Heritage Administration Department',
        'Local Official Monitor and Local Council Relations Department',
        'External Relations, Innovation and Investors Department',
        'Protocol and Civil Society Relations Department',
      ],
    },
    mainResponsibilities: {
      ro: 'Asigură respectarea principiului legalității în activitatea de emitere și adoptare a actelor administrative, stabilitatea funcționării aparatului de specialitate al primarului sau, după caz, al consiliului județean, continuitatea conducerii și realizarea legăturilor funcționale între compartimentele din cadrul acestora.',
      hu: 'Biztosítja a jogszerűség elvének tiszteletben tartását a közigazgatási aktusok kibocsátása és elfogadása során, a polgármester vagy adott esetben a megyei tanács szakapparátusának működési stabilitását, a vezetés folytonosságát és a funkcionális kapcsolatok megvalósítását az ezeken belüli osztályok között.',
      en: 'Ensures respect for the principle of legality in the activity of issuing and adopting administrative acts, the stability of the operation of the mayor\'s specialized apparatus or, as the case may be, of the county council, the continuity of leadership and the establishment of functional links between the departments within them.',
    },
    translations: {
      ro: {
        name: 'Ivanciuc Patricia Edith',
        position: 'Secretar General al UAT Salonta',
        audienceSchedule: 'În fiecare săptămână, Joi: 9:00 - 11:00',
      },
      hu: {
        name: 'Ivanciuc Patricia Edith',
        position: 'Nagyszalonta ATI Főjegyzője',
        audienceSchedule: 'Minden héten, Csütörtök: 9:00 - 11:00',
      },
      en: {
        name: 'Ivanciuc Patricia Edith',
        position: 'General Secretary of Salonta TAU',
        audienceSchedule: 'Every week, Thursday: 9:00 - 11:00',
      },
    },
  },
];

// Introduction text for the leadership page
export const LEADERSHIP_INTRO = {
  ro: 'Primarul, viceprimarul, secretarul municipiului, împreună cu aparatul propriu de specialitate al consiliului local, constituie structura funcțională cu activitate permanentă, denumită Primăria, care aduce la îndeplinire hotărârile consiliului local și dispozițiile primarului, soluționând problemele curente ale colectivității locale.',
  hu: 'A polgármester, az alpolgármester, a város titkára, a helyi tanács saját szakapparátusával együtt alkotják az állandó tevékenységet végző funkcionális struktúrát, amelyet Polgármesteri Hivatalnak neveznek, és amely végrehajtja a helyi tanács határozatait és a polgármester rendelkezéseit, megoldva a helyi közösség aktuális problémáit.',
  en: 'The Mayor, Deputy Mayor, and Secretary of the municipality, together with the specialized apparatus of the local council, constitute the permanent functional structure called the City Hall, which implements the decisions of the local council and the mayor\'s dispositions, solving the current problems of the local community.',
};
