export interface LeadershipMember {
  id: string;
  position: string;
  photo: string | null;
  email: string;
  phone: string;
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
    phone: '+40 728 105 762',
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
    phone: '+40 728 105 762',
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
    phone: '+40 728 105 762',
    translations: {
      ro: {
        name: 'Nume Secretar',
        position: 'Secretar General',
        audienceSchedule: 'În fiecare săptămână, Joi: 9:00 - 11:00',
      },
      hu: {
        name: 'Titkár Neve',
        position: 'Főjegyző',
        audienceSchedule: 'Minden héten, Csütörtök: 9:00 - 11:00',
      },
      en: {
        name: 'Secretary Name',
        position: 'General Secretary',
        audienceSchedule: 'Every week, Thursday: 9:00 - 11:00',
      },
    },
  },
];

