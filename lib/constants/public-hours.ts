export interface OfficeHours {
  id: string;
  room: string | null;
  floor?: string;
  hours: { days: string; from: string; to: string }[];
  translations: {
    ro: { name: string };
    hu: { name: string };
    en: { name: string };
  };
}

export const PUBLIC_HOURS = {
  translations: {
    ro: {
      title: 'Program cu publicul',
      audienceTitle: 'Audiențe',
      registrationNote:
        'Înscrierea la audiențe se face la camera 11 (parter) a Primăriei Municipiului Salonta, pe baza actului de identitate.',
      room: 'Camera',
      floor: 'Parter',
    },
    hu: {
      title: 'Ügyfélfogadás',
      audienceTitle: 'Fogadóórák',
      registrationNote:
        'A fogadóórákra való feliratkozás a Nagyszalontai Polgármesteri Hivatal 11-es szobájában (földszint) történik, személyi igazolvány alapján.',
      room: 'Szoba',
      floor: 'Földszint',
    },
    en: {
      title: 'Public Hours',
      audienceTitle: 'Audiences',
      registrationNote:
        'Registration for audiences is done at room 11 (ground floor) of Salonta City Hall, based on ID card.',
      room: 'Room',
      floor: 'Ground Floor',
    },
  },
  offices: [
    {
      id: 'general',
      room: null,
      hours: [
        { days: 'Luni - Vineri', from: '8:00', to: '11:00' },
        { days: 'Luni - Vineri', from: '13:00', to: '16:00' },
      ],
      translations: {
        ro: { name: 'Toate birourile de la parter' },
        hu: { name: 'Minden földszinti iroda' },
        en: { name: 'All ground floor offices' },
      },
    },
    {
      id: 'casierie',
      room: '10',
      floor: 'parter',
      hours: [{ days: 'Luni - Vineri', from: '8:00', to: '16:00' }],
      translations: {
        ro: { name: 'Casierie' },
        hu: { name: 'Pénztár' },
        en: { name: 'Cashier' },
      },
    },
    {
      id: 'relatii-public',
      room: '11',
      floor: 'parter',
      hours: [{ days: 'Luni - Vineri', from: '8:00', to: '16:00' }],
      translations: {
        ro: { name: 'Biroul de relații cu publicul' },
        hu: { name: 'Ügyfélszolgálat' },
        en: { name: 'Public Relations Office' },
      },
    },
  ] as OfficeHours[],
};

