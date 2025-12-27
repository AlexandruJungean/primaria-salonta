export interface HeroSlide {
  id: string;
  image: string;
  translations: {
    ro: { alt: string; title?: string };
    hu: { alt: string; title?: string };
    en: { alt: string; title?: string };
  };
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'primaria',
    image: '/images/primaria-salonta-1.jpg',
    translations: {
      ro: { alt: 'Primăria Municipiului Salonta', title: 'Primăria Municipiului Salonta' },
      hu: { alt: 'Nagyszalonta Város Polgármesteri Hivatala', title: 'Nagyszalonta Város Polgármesteri Hivatala' },
      en: { alt: 'Salonta City Hall', title: 'Salonta City Hall' },
    },
  },
  {
    id: 'muzeu',
    image: '/images/muzeu-salonta.jpg',
    translations: {
      ro: { alt: 'Complexul Muzeal Arany János' },
      hu: { alt: 'Arany János Emlékmúzeum' },
      en: { alt: 'Arany János Museum Complex' },
    },
  },
  {
    id: 'parc',
    image: '/images/parc-salonta-3.jpg',
    translations: {
      ro: { alt: 'Parcul Central Salonta' },
      hu: { alt: 'Nagyszalonta Központi Parkja' },
      en: { alt: 'Salonta Central Park' },
    },
  },
  {
    id: 'casa-cultura',
    image: '/images/casa-de-cultura-salonta-1.jpg',
    translations: {
      ro: { alt: 'Casa de Cultură Zilahy Lajos' },
      hu: { alt: 'Zilahy Lajos Művelődési Ház' },
      en: { alt: 'Zilahy Lajos Cultural House' },
    },
  },
  {
    id: 'bazin',
    image: '/images/bazin-de-inot-salonta-1.jpeg',
    translations: {
      ro: { alt: 'Bazinul de Înot Salonta' },
      hu: { alt: 'Nagyszalontai Uszoda' },
      en: { alt: 'Salonta Swimming Pool' },
    },
  },
  {
    id: 'biserica',
    image: '/images/biserica-salonta-3.jpg',
    translations: {
      ro: { alt: 'Biserica Ortodoxă Salonta' },
      hu: { alt: 'Nagyszalontai Ortodox Templom' },
      en: { alt: 'Salonta Orthodox Church' },
    },
  },
];

