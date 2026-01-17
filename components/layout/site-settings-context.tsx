'use client';

import { createContext, useContext, type ReactNode } from 'react';

export interface ContactInfo {
  phone: {
    main: string;
    landline: string[];
    fax: string;
    display: string;
  };
  email: {
    primary: string;
    secondary: string;
    display: string;
    all: string[];
  };
  workingHours: string;
  socialMedia: {
    facebook: string;
    instagram: string;
    tiktok: string;
    youtube: string;
    twitter: string;
    linkedin: string;
  };
}

// Default values (fallback)
const defaultContactInfo: ContactInfo = {
  phone: {
    main: '0359-409730',
    landline: ['0359-409730', '0359-409731', '0259-373243'],
    fax: '0359-409733',
    display: '0359-409730, 0359-409731, 0259-373243',
  },
  email: {
    primary: 'primsal@rdslink.ro',
    secondary: 'primsal3@gmail.com',
    display: 'primsal@rdslink.ro, primsal3@gmail.com',
    all: ['primsal@rdslink.ro', 'primsal3@gmail.com'],
  },
  workingHours: 'Luni - Vineri: 8:00 - 16:00',
  socialMedia: {
    facebook: 'https://www.facebook.com/PrimariaSalontaNagyszalontaPolgarmesteriHivatala',
    instagram: 'https://www.instagram.com/primaria.municipiuluisalonta/',
    tiktok: 'https://www.tiktok.com/@primariasalonta_',
    youtube: '',
    twitter: '',
    linkedin: '',
  },
};

const SiteSettingsContext = createContext<ContactInfo>(defaultContactInfo);

export function SiteSettingsProvider({
  children,
  contactInfo,
}: {
  children: ReactNode;
  contactInfo: ContactInfo;
}) {
  return (
    <SiteSettingsContext.Provider value={contactInfo}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
