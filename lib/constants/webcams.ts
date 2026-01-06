export interface Webcam {
  id: string;
  slug: string;
  streamUrl: string;
  embedUrl: string;
  thumbnailUrl: string;
  translations: {
    ro: { title: string; description: string };
    hu: { title: string; description: string };
    en: { title: string; description: string };
  };
}

export const WEBCAMS: Webcam[] = [
  {
    id: 'arany-janos',
    slug: 'casa-memoriala-arany-janos',
    streamUrl: 'https://www.ipcamlive.com/casaaranyjanos',
    embedUrl: 'https://www.ipcamlive.com/player/player.php?alias=casaaranyjanos',
    thumbnailUrl: '/images/casa-memoriala-salonta-1.webp',
    translations: {
      ro: {
        title: 'Casa Memorială "Arany János"',
        description: 'Vizualizare live a Complexului Muzeal Arany János',
      },
      hu: {
        title: 'Arany János Emlékmúzeum',
        description: 'Élő közvetítés az Arany János Emlékmúzeumból',
      },
      en: {
        title: 'Arany János Memorial House',
        description: 'Live view of the Arany János Museum Complex',
      },
    },
  },
  {
    id: 'nuca-de-aur',
    slug: 'parcul-nuca-de-aur',
    streamUrl: 'https://www.ipcamlive.com/aranydio1',
    embedUrl: 'https://www.ipcamlive.com/player/player.php?alias=aranydio1',
    thumbnailUrl: '/images/parc-salonta-1.webp',
    translations: {
      ro: {
        title: 'Parcul "Nuca de Aur"',
        description: 'Vizualizare live a parcului Nuca de Aur',
      },
      hu: {
        title: '"Arany Dió" Park',
        description: 'Élő közvetítés az Arany Dió parkból',
      },
      en: {
        title: '"Golden Walnut" Park',
        description: 'Live view of the Golden Walnut Park',
      },
    },
  },
];

