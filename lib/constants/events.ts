// Events data - will be replaced with real data from a CMS or API

export interface EventTranslation {
  title: string;
  description: string;
}

export interface Event {
  id: string;
  slug: string;
  date: string;
  time: string;
  location: string;
  category: 'administrativ' | 'cultural' | 'comunitar' | 'festival' | 'sport';
  image?: string;
  translations: {
    ro: EventTranslation;
    hu: EventTranslation;
    en: EventTranslation;
  };
}

export const EVENTS: Event[] = [
  {
    id: '1',
    slug: 'sedinta-consiliu-local-ianuarie-2025',
    date: '2025-01-10',
    time: '10:00',
    location: 'Primăria Salonta',
    category: 'administrativ',
    image: '/images/sedinta-consiliu-salonta-1.jpg',
    translations: {
      ro: { 
        title: 'Ședință Consiliu Local', 
        description: 'Ședință ordinară a Consiliului Local Salonta. Ordinea de zi include discutarea bugetului pe anul 2025 și aprobarea planurilor de investiții pentru infrastructura urbană.' 
      },
      hu: { 
        title: 'Helyi Tanács Ülése', 
        description: 'A Nagyszalontai Helyi Tanács rendes ülése. A napirenden a 2025-ös költségvetés megvitatása és a városi infrastruktúra beruházási terveinek jóváhagyása szerepel.' 
      },
      en: { 
        title: 'Local Council Meeting', 
        description: 'Regular meeting of Salonta Local Council. The agenda includes discussing the 2025 budget and approving investment plans for urban infrastructure.' 
      },
    },
  },
  {
    id: '2',
    slug: 'lansare-carte-salonta-ieri-azi',
    date: '2025-01-18',
    time: '17:00',
    location: 'Biblioteca Municipală "Teodor Neș"',
    category: 'cultural',
    image: '/images/casa-memoriala-salonta-1.jpg',
    translations: {
      ro: { 
        title: 'Lansare de carte: "Salonta de ieri și de azi"', 
        description: 'Eveniment dedicat istoriei și prezentului orașului. Autorul va prezenta cercetările sale despre evoluția Salontei de-a lungul secolelor, cu imagini de arhivă și mărturii ale localnicilor.' 
      },
      hu: { 
        title: 'Könyvbemutató: "Szalonta tegnap és ma"', 
        description: 'Rendezvény a város múltjának és jelenének szentelve. A szerző bemutatja Szalonta évszázadokon átívelő fejlődéséről szóló kutatásait, archív képekkel és helyiek vallomásaival.' 
      },
      en: { 
        title: 'Book Launch: "Salonta Yesterday and Today"', 
        description: 'Event dedicated to the history and present of the city. The author will present their research on the evolution of Salonta through the centuries, with archive images and testimonies from locals.' 
      },
    },
  },
  {
    id: '3',
    slug: 'ziua-unirii-spectacol-festiv',
    date: '2025-01-24',
    time: '16:00',
    location: 'Casa de Cultură "Zilahy Lajos"',
    category: 'cultural',
    image: '/images/casa-de-cultura-salonta-1.jpg',
    translations: {
      ro: { 
        title: 'Ziua Unirii Principatelor Române - Spectacol festiv', 
        description: 'Spectacol artistic dedicat Zilei Unirii Principatelor Române. Programul include recitaluri de poezie patriotică, momente artistice susținute de elevii școlilor din oraș și un concert de muzică populară.' 
      },
      hu: { 
        title: 'Román Fejedelemségek Egyesülésének Napja - Ünnepi előadás', 
        description: 'Művészeti előadás a Román Fejedelemségek Egyesülésének Napja alkalmából. A program hazafias költemények szavalását, a városi iskolák diákjainak művészeti előadásait és népzenei koncertet tartalmaz.' 
      },
      en: { 
        title: 'Union of Romanian Principalities Day - Festive Show', 
        description: 'Artistic show dedicated to the Union Day of Romanian Principalities. The program includes patriotic poetry recitals, artistic moments by students from city schools, and a folk music concert.' 
      },
    },
  },
  {
    id: '4',
    slug: 'concert-dragobete-2025',
    date: '2025-02-14',
    time: '18:00',
    location: 'Casa de Cultură "Zilahy Lajos"',
    category: 'cultural',
    image: '/images/casa-de-cultura-salonta-1.jpg',
    translations: {
      ro: { 
        title: 'Concert de Dragobete', 
        description: 'Concert festiv dedicat sărbătorii iubirii la români. Artiști locali și invitați speciali vor interpreta melodii romantice. Intrarea este liberă pentru cupluri.' 
      },
      hu: { 
        title: 'Valentin-napi Koncert', 
        description: 'Ünnepi koncert a szerelem ünnepén. Helyi művészek és különleges vendégek romantikus dalokat adnak elő. A párok ingyenesen vehetnek részt.' 
      },
      en: { 
        title: 'Dragobete Concert', 
        description: 'Festive concert celebrating the Romanian day of love. Local artists and special guests will perform romantic songs. Free entry for couples.' 
      },
    },
  },
  {
    id: '5',
    slug: 'targ-primavara-martisor-2025',
    date: '2025-03-01',
    time: '09:00',
    location: 'Piața Centrală',
    category: 'comunitar',
    image: '/images/parc-salonta-1.jpg',
    translations: {
      ro: { 
        title: 'Mărțișor - Târg de primăvară', 
        description: 'Târg tradițional cu ocazia venirii primăverii. Meșteri populari vor expune mărțișoare lucrate manual, produse tradiționale și artizanat local. Programul include ateliere creative pentru copii.' 
      },
      hu: { 
        title: 'Tavaszi Vásár', 
        description: 'Hagyományos vásár a tavasz érkezése alkalmából. Népi mesterek kézzel készített márciuskákat, hagyományos termékeket és helyi kézműves termékeket mutatnak be. A program gyerekeknek szóló kreatív műhelyeket is tartalmaz.' 
      },
      en: { 
        title: 'Mărțișor - Spring Fair', 
        description: 'Traditional fair celebrating the arrival of spring. Folk craftsmen will display handmade spring tokens, traditional products, and local handicrafts. The program includes creative workshops for children.' 
      },
    },
  },
  {
    id: '6',
    slug: 'concert-ziua-femeii-2025',
    date: '2025-03-08',
    time: '17:00',
    location: 'Casa de Cultură "Zilahy Lajos"',
    category: 'cultural',
    image: '/images/casa-de-cultura-salonta-1.jpg',
    translations: {
      ro: { 
        title: 'Concert dedicat Zilei Femeii', 
        description: 'Spectacol muzical în onoarea femeilor. Orchestra de cameră a Casei de Cultură va interpreta piese clasice și contemporane. Toate doamnele prezente vor primi flori.' 
      },
      hu: { 
        title: 'Nőnapi Koncert', 
        description: 'Zenei előadás a nők tiszteletére. A Művelődési Ház kamarazenekara klasszikus és kortárs műveket ad elő. Minden jelenlévő hölgy virágot kap.' 
      },
      en: { 
        title: 'Women\'s Day Concert', 
        description: 'Musical show in honor of women. The Chamber Orchestra of the Cultural House will perform classical and contemporary pieces. All ladies present will receive flowers.' 
      },
    },
  },
  {
    id: '7',
    slug: 'sarbatori-pascale-2025',
    date: '2025-04-20',
    time: '12:00',
    location: 'Bisericile din Salonta',
    category: 'comunitar',
    image: '/images/biserica-salonta-3.jpg',
    translations: {
      ro: { 
        title: 'Sărbătorile Pascale - Slujbe și evenimente', 
        description: 'Program special de Paște la bisericile din oraș. Slujbe de Înviere, concerte de muzică sacră și activități pentru copii în Parcul Central.' 
      },
      hu: { 
        title: 'Húsvéti Ünnepek - Istentiszteletek és események', 
        description: 'Különleges húsvéti program a város templomaiban. Feltámadási istentiszteletek, egyházi zenei koncertek és gyermekprogramok a Központi Parkban.' 
      },
      en: { 
        title: 'Easter Celebrations - Services and Events', 
        description: 'Special Easter program at the city\'s churches. Resurrection services, sacred music concerts, and activities for children in Central Park.' 
      },
    },
  },
  {
    id: '8',
    slug: 'ziua-muncii-picnic-2025',
    date: '2025-05-01',
    time: '10:00',
    location: 'Parcul Central',
    category: 'comunitar',
    image: '/images/parc-salonta-2.jpg',
    translations: {
      ro: { 
        title: 'Ziua Muncii - Picnic în parc', 
        description: 'Activități recreative și picnic pentru familii. Muzică live, jocuri pentru copii, demonstrații culinare și zone de relaxare în natură.' 
      },
      hu: { 
        title: 'Munka Ünnepe - Piknik a parkban', 
        description: 'Szabadidős tevékenységek és piknik családoknak. Élő zene, gyerekjátékok, főzőbemutatók és pihenőzónák a természetben.' 
      },
      en: { 
        title: 'Labor Day - Picnic in the Park', 
        description: 'Recreational activities and picnic for families. Live music, games for children, cooking demonstrations, and relaxation areas in nature.' 
      },
    },
  },
  {
    id: '9',
    slug: 'ziua-copilului-2025',
    date: '2025-06-01',
    time: '10:00',
    location: 'Parcul Central',
    category: 'comunitar',
    image: '/images/parc-salonta-1.jpg',
    translations: {
      ro: { 
        title: 'Ziua Copilului - Jocuri și ateliere creative', 
        description: 'Evenimente dedicate copiilor cu jocuri interactive, ateliere de pictură, sculptură și meșteșuguri tradiționale. Spectacole de teatru pentru copii și animatori.' 
      },
      hu: { 
        title: 'Gyermeknap - Játékok és kreatív műhelyek', 
        description: 'Gyermekeknek szóló rendezvények interaktív játékokkal, festő-, szobrász- és hagyományos kézműves műhelyekkel. Gyermekszínházi előadások és animátorok.' 
      },
      en: { 
        title: 'Children\'s Day - Games and Creative Workshops', 
        description: 'Events dedicated to children with interactive games, painting, sculpting, and traditional crafts workshops. Children\'s theater shows and entertainers.' 
      },
    },
  },
  {
    id: '10',
    slug: 'zilele-salontane-2025',
    date: '2025-06-14',
    time: '10:00',
    location: 'Centrul Orașului',
    category: 'festival',
    image: '/images/primaria-salonta-1.jpg',
    translations: {
      ro: { 
        title: 'Zilele Salontane 2025', 
        description: 'Festivalul anual al orașului cu concerte, târguri de artizanat, expoziții, competiții sportive și spectacole folclorice. Trei zile de sărbătoare pentru întreaga comunitate.' 
      },
      hu: { 
        title: 'Nagyszalontai Napok 2025', 
        description: 'A város éves fesztiválja koncertekkel, kézműves vásárokkal, kiállításokkal, sportversenyekkel és népi előadásokkal. Három napos ünnepség az egész közösségnek.' 
      },
      en: { 
        title: 'Salonta Days 2025', 
        description: 'Annual city festival with concerts, craft fairs, exhibitions, sports competitions, and folk shows. Three days of celebration for the entire community.' 
      },
    },
  },
  {
    id: '11',
    slug: 'festival-arany-janos-2025',
    date: '2025-08-15',
    time: '16:00',
    location: 'Complexul Muzeal Arany János',
    category: 'cultural',
    image: '/images/muzeu-salonta.jpg',
    translations: {
      ro: { 
        title: 'Festivalul Arany János', 
        description: 'Comemorarea poetului Arany János cu evenimente culturale, recitaluri de poezie în limba maghiară, expoziții tematice și concerte de muzică clasică.' 
      },
      hu: { 
        title: 'Arany János Fesztivál', 
        description: 'Arany János költő emlékére rendezett kulturális események, magyar nyelvű költeményszavalások, tematikus kiállítások és klasszikus zenei koncertek.' 
      },
      en: { 
        title: 'Arany János Festival', 
        description: 'Commemoration of poet Arany János with cultural events, poetry recitals in Hungarian, thematic exhibitions, and classical music concerts.' 
      },
    },
  },
  {
    id: '12',
    slug: 'cupa-salonta-fotbal-2025',
    date: '2025-09-20',
    time: '09:00',
    location: 'Stadionul Municipal',
    category: 'sport',
    image: '/images/sport/campionat-freeflight-salonta-1.jpg',
    translations: {
      ro: { 
        title: 'Cupa Salonta - Turneu de fotbal', 
        description: 'Turneu de fotbal amator cu echipe din Salonta și localitățile învecinate. Premiere pentru cele mai bune echipe și jucători.' 
      },
      hu: { 
        title: 'Szalonta Kupa - Labdarúgó torna', 
        description: 'Amatőr labdarúgó torna Szalonta és a környező települések csapataival. Díjak a legjobb csapatoknak és játékosoknak.' 
      },
      en: { 
        title: 'Salonta Cup - Football Tournament', 
        description: 'Amateur football tournament with teams from Salonta and neighboring localities. Awards for the best teams and players.' 
      },
    },
  },
  {
    id: '13',
    slug: 'ziua-nationala-romania-2025',
    date: '2025-12-01',
    time: '11:00',
    location: 'Piața Centrală',
    category: 'administrativ',
    image: '/images/primaria-salonta-1.jpg',
    translations: {
      ro: { 
        title: 'Ziua Națională a României - Ceremonie și paradă', 
        description: 'Sărbătorirea Zilei Naționale cu ceremonie oficială, depuneri de coroane, paradă militară și program artistic dedicat eroilor neamului.' 
      },
      hu: { 
        title: 'Románia Nemzeti Ünnepe - Ünnepség és felvonulás', 
        description: 'A Nemzeti Ünnep megünneplése hivatalos ceremóniával, koszorúzással, katonai felvonulással és a nemzet hőseinek szentelt művészeti programmal.' 
      },
      en: { 
        title: 'National Day of Romania - Ceremony and Parade', 
        description: 'Celebration of the National Day with official ceremony, wreath laying, military parade, and artistic program dedicated to national heroes.' 
      },
    },
  },
  {
    id: '14',
    slug: 'targ-craciun-2025',
    date: '2025-12-20',
    time: '16:00',
    location: 'Piața Centrală',
    category: 'festival',
    image: '/images/parc-salonta-1.jpg',
    translations: {
      ro: { 
        title: 'Târgul de Crăciun Salonta', 
        description: 'Târg festiv cu produse tradiționale, artizanat, decorațiuni de Crăciun și dulciuri. Căsuțe cu vin fiert, concerte de colinde și vizita lui Moș Crăciun pentru copii.' 
      },
      hu: { 
        title: 'Nagyszalontai Karácsonyi Vásár', 
        description: 'Ünnepi vásár hagyományos termékekkel, kézműves árukkal, karácsonyi díszekkel és édességekkel. Forralt boros standok, karácsonyi dalok koncertje és a Mikulás látogatása a gyerekeknek.' 
      },
      en: { 
        title: 'Salonta Christmas Fair', 
        description: 'Festive fair with traditional products, handicrafts, Christmas decorations, and sweets. Mulled wine stalls, carol concerts, and Santa Claus visit for children.' 
      },
    },
  },
];

export const EVENT_CATEGORIES = {
  administrativ: {
    color: 'bg-blue-100 text-blue-800',
    translations: {
      ro: 'Administrativ',
      hu: 'Adminisztratív',
      en: 'Administrative',
    },
  },
  cultural: {
    color: 'bg-purple-100 text-purple-800',
    translations: {
      ro: 'Cultural',
      hu: 'Kulturális',
      en: 'Cultural',
    },
  },
  comunitar: {
    color: 'bg-green-100 text-green-800',
    translations: {
      ro: 'Comunitar',
      hu: 'Közösségi',
      en: 'Community',
    },
  },
  festival: {
    color: 'bg-orange-100 text-orange-800',
    translations: {
      ro: 'Festival',
      hu: 'Fesztivál',
      en: 'Festival',
    },
  },
  sport: {
    color: 'bg-red-100 text-red-800',
    translations: {
      ro: 'Sport',
      hu: 'Sport',
      en: 'Sports',
    },
  },
} as const;

export type EventCategory = keyof typeof EVENT_CATEGORIES;

export function getEventBySlug(slug: string): Event | undefined {
  return EVENTS.find(event => event.slug === slug);
}

export function getUpcomingEvents(count: number = 4): Event[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return EVENTS
    .filter(event => new Date(event.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, count);
}

export function getAllEventsSorted(): Event[] {
  return [...EVENTS].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

