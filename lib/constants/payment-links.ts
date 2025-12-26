export interface PaymentLink {
  id: string;
  url: string;
  icon: 'CreditCard' | 'Receipt' | 'FileWarning';
  translations: {
    ro: { title: string; description: string };
    hu: { title: string; description: string };
    en: { title: string; description: string };
  };
}

export const PAYMENT_LINKS: PaymentLink[] = [
  {
    id: 'ghiseul',
    url: 'https://www.ghiseul.ro/ghiseul/public/',
    icon: 'CreditCard',
    translations: {
      ro: {
        title: 'Ghișeul.ro',
        description: 'Platforma națională pentru plăți online către instituțiile publice',
      },
      hu: {
        title: 'Ghișeul.ro',
        description: 'Nemzeti online fizetési platform közintézmények felé',
      },
      en: {
        title: 'Ghișeul.ro',
        description: 'National platform for online payments to public institutions',
      },
    },
  },
  {
    id: 'impozite-taxe',
    url: 'https://www.globalpay.ro/public/salonta/login/index/redirctrl/debite/rediract/debite/lang/ro',
    icon: 'Receipt',
    translations: {
      ro: {
        title: 'Impozite și taxe',
        description: 'Plătește impozite pe clădiri, terenuri și alte taxe locale',
      },
      hu: {
        title: 'Adók és illetékek',
        description: 'Fizessen épület-, telek- és egyéb helyi adókat',
      },
      en: {
        title: 'Taxes and fees',
        description: 'Pay building taxes, land taxes, and other local fees',
      },
    },
  },
  {
    id: 'amenzi',
    url: 'https://www.globalpay.ro/public/salonta/login/index/redirctrl/amenzi/rediract/index/lang/ro',
    icon: 'FileWarning',
    translations: {
      ro: {
        title: 'Amenzi contravenționale',
        description: 'Plătește amenzi de circulație și alte amenzi contravenționale',
      },
      hu: {
        title: 'Szabálysértési bírságok',
        description: 'Fizessen közlekedési és egyéb szabálysértési bírságokat',
      },
      en: {
        title: 'Contravention fines',
        description: 'Pay traffic fines and other contravention fines',
      },
    },
  },
];

