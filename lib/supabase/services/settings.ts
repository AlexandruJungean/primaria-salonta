import { createAnonServerClient } from '@/lib/supabase/server';
import { unstable_noStore as noStore } from 'next/cache';

export interface SiteSettings {
  // Contact
  phones: string[];
  fax: string;
  emails: string[];
  working_hours: string;

  // Social Media
  facebook_url: string;
  instagram_url: string;
  tiktok_url: string;
  youtube_url: string;
  twitter_url: string;
  linkedin_url: string;

  // Notifications
  notification_emails: string[];
}

// Default settings (fallback values matching CONTACT_INFO)
export const defaultSettings: SiteSettings = {
  phones: ['0359-409730', '0359-409731', '0259-373243'],
  fax: '0359-409733',
  emails: ['primsal@rdslink.ro', 'primsal3@gmail.com'],
  working_hours: 'Luni - Vineri: 8:00 - 16:00',
  facebook_url: 'https://www.facebook.com/PrimariaSalontaNagyszalontaPolgarmesteriHivatala',
  instagram_url: 'https://www.instagram.com/primaria.municipiuluisalonta/',
  tiktok_url: 'https://www.tiktok.com/@primariasalonta_',
  youtube_url: '',
  twitter_url: '',
  linkedin_url: '',
  notification_emails: ['alex.jungean@gmail.com'],
};

/**
 * Get site settings from database
 * Uses noStore to ensure changes are visible immediately
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  noStore();
  
  try {
    const supabase = createAnonServerClient();

    const { data, error } = await supabase
      .from('site_settings')
      .select('key, value');

    if (error) {
      console.error('Error fetching site settings:', error);
      return defaultSettings;
    }

    const settings: SiteSettings = { ...defaultSettings };
    for (const row of data || []) {
      if (row.key in settings) {
        (settings as unknown as Record<string, unknown>)[row.key] = row.value;
      }
    }

    return settings;
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return defaultSettings;
  }
}

/**
 * Get notification emails for form submissions
 */
export async function getNotificationEmails(): Promise<string[]> {
  const settings = await getSiteSettings();
  return settings.notification_emails.length > 0 
    ? settings.notification_emails 
    : defaultSettings.notification_emails;
}

// Contact info return type
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

/**
 * Get contact info formatted for display
 */
export async function getContactInfo(): Promise<ContactInfo> {
  const settings = await getSiteSettings();
  
  return {
    phone: {
      main: settings.phones[0] || '',
      landline: settings.phones,
      fax: settings.fax,
      display: settings.phones.join(', '),
    },
    email: {
      primary: settings.emails[0] || '',
      secondary: settings.emails[1] || '',
      display: settings.emails.join(', '),
      all: settings.emails,
    },
    workingHours: settings.working_hours,
    socialMedia: {
      facebook: settings.facebook_url,
      instagram: settings.instagram_url,
      tiktok: settings.tiktok_url,
      youtube: settings.youtube_url,
      twitter: settings.twitter_url,
      linkedin: settings.linkedin_url,
    },
  };
}

/**
 * Invalidate the settings cache - no-op since we use noStore
 */
export function invalidateSettingsCache() {
  // No caching, so nothing to invalidate
}
