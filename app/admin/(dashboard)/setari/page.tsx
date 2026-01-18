'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Phone, Mail, Clock, Plus, X, Loader2, ImageIcon, ChevronRight } from 'lucide-react';
import {
  AdminPageHeader,
  AdminButton,
  AdminCard,
  AdminInput,
  toast,
} from '@/components/admin';
import { adminFetch } from '@/lib/api-client';

// TikTok icon (not in Lucide)
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

// Instagram icon
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

// Facebook icon
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

// YouTube icon
function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

// LinkedIn icon
function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

interface SiteSettings {
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

const defaultSettings: SiteSettings = {
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

export default function SetariPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);

  // Fetch settings on mount
  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await adminFetch('/api/admin/settings');
        if (response.ok) {
          const data = await response.json();
          // Merge API data with defaults, ensuring arrays have at least one item for inputs
          setSettings({
            ...defaultSettings,
            ...data,
            phones: Array.isArray(data.phones) && data.phones.length > 0 ? data.phones : defaultSettings.phones,
            emails: Array.isArray(data.emails) && data.emails.length > 0 ? data.emails : defaultSettings.emails,
            notification_emails: Array.isArray(data.notification_emails) && data.notification_emails.length > 0 
              ? data.notification_emails 
              : defaultSettings.notification_emails,
          });
        } else {
          // Use defaults if API fails (including 401)
          console.warn('Failed to fetch settings, using defaults. Status:', response.status);
          setSettings(defaultSettings);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        // Use defaults on error
        setSettings(defaultSettings);
        toast.error('Eroare', 'Nu s-au putut încărca setările din baza de date. Se folosesc valorile implicite.');
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleChange = (field: keyof SiteSettings, value: string | string[] | number) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: 'phones' | 'emails' | 'notification_emails', index: number, value: string) => {
    setSettings(prev => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const addArrayItem = (field: 'phones' | 'emails' | 'notification_emails') => {
    setSettings(prev => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const removeArrayItem = (field: 'phones' | 'emails' | 'notification_emails', index: number) => {
    setSettings(prev => {
      const newArray = prev[field].filter((_, i) => i !== index);
      // Keep at least one empty item
      return { ...prev, [field]: newArray.length ? newArray : [''] };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Filter out empty values from arrays before saving
      const cleanedSettings = {
        ...settings,
        phones: settings.phones.filter(p => p.trim()),
        emails: settings.emails.filter(e => e.trim()),
        notification_emails: settings.notification_emails.filter(e => e.trim()),
      };

      // Validate notification emails
      if (cleanedSettings.notification_emails.length === 0) {
        toast.error('Eroare', 'Trebuie să adăugați cel puțin un email pentru notificări');
        setSaving(false);
        return;
      }

      const response = await adminFetch('/api/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(cleanedSettings),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) {
          throw new Error('Sesiune expirată. Vă rugăm să reîmprospătați pagina și să vă autentificați din nou.');
        }
        throw new Error(errorData.error || 'Nu s-au putut salva setările');
      }

      toast.success('Setări salvate', 'Configurările au fost actualizate cu succes!');
    } catch (error) {
      console.error('Error saving settings:', error);
      const errorMessage = error instanceof Error ? error.message : 'Nu s-au putut salva setările';
      toast.error('Eroare', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <AdminPageHeader
          title="Setări"
          description="Configurări generale pentru website"
          breadcrumbs={[{ label: 'Setări' }]}
        />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="Setări"
        description="Configurări generale pentru website"
        breadcrumbs={[{ label: 'Setări' }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hero Carousel Link */}
        <AdminCard className="lg:col-span-2">
          <button
            onClick={() => router.push('/admin/setari/hero-carousel')}
            className="w-full flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-primary-50 to-blue-50 hover:from-primary-100 hover:to-blue-100 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-100 rounded-lg">
                <ImageIcon className="w-6 h-6 text-primary-600" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Hero Carousel</h3>
                <p className="text-sm text-gray-600">Gestionează imaginile din caruselul paginii principale</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </AdminCard>

        {/* Contact Section */}
        <AdminCard title="Contact" className="lg:col-span-2">
          <div className="space-y-6">
            {/* Phones and Emails in two columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Phones */}
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-slate-600" />
                    <h4 className="font-medium text-slate-900">Numere de telefon</h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => addArrayItem('phones')}
                    className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                  >
                    <Plus className="w-4 h-4" />
                    Adaugă
                  </button>
                </div>
                <div className="space-y-3">
                  {settings.phones.map((phone, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <AdminInput
                        value={phone}
                        onChange={(e) => handleArrayChange('phones', index, e.target.value)}
                        placeholder="0359-409730"
                        className="flex-1"
                      />
                      {settings.phones.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('phones', index)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <AdminInput
                    label="FAX"
                    value={settings.fax}
                    onChange={(e) => handleChange('fax', e.target.value)}
                    placeholder="0359-409733"
                  />
                </div>
              </div>

              {/* Emails */}
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-slate-600" />
                    <h4 className="font-medium text-slate-900">Adrese email</h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => addArrayItem('emails')}
                    className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                  >
                    <Plus className="w-4 h-4" />
                    Adaugă
                  </button>
                </div>
                <div className="space-y-3">
                  {settings.emails.map((email, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <AdminInput
                        type="email"
                        value={email}
                        onChange={(e) => handleArrayChange('emails', index, e.target.value)}
                        placeholder="contact@primaria.ro"
                        className="flex-1"
                      />
                      {settings.emails.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('emails', index)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Working Hours */}
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-slate-600" />
                <h4 className="font-medium text-slate-900">Program de lucru</h4>
              </div>
              <AdminInput
                label="Program"
                value={settings.working_hours}
                onChange={(e) => handleChange('working_hours', e.target.value)}
                placeholder="Luni - Vineri: 8:00 - 16:00"
              />
            </div>
          </div>
        </AdminCard>

        {/* Social Media Section */}
        <AdminCard title="Social Media">
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
              <FacebookIcon className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <AdminInput
                  label="Facebook"
                  value={settings.facebook_url}
                  onChange={(e) => handleChange('facebook_url', e.target.value)}
                  placeholder="https://facebook.com/pagina"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
              <InstagramIcon className="w-5 h-5 text-pink-600" />
              <div className="flex-1">
                <AdminInput
                  label="Instagram"
                  value={settings.instagram_url}
                  onChange={(e) => handleChange('instagram_url', e.target.value)}
                  placeholder="https://instagram.com/cont"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-slate-100 rounded-lg">
              <TikTokIcon className="w-5 h-5 text-slate-900" />
              <div className="flex-1">
                <AdminInput
                  label="TikTok"
                  value={settings.tiktok_url}
                  onChange={(e) => handleChange('tiktok_url', e.target.value)}
                  placeholder="https://tiktok.com/@cont"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
              <YouTubeIcon className="w-5 h-5 text-red-600" />
              <div className="flex-1">
                <AdminInput
                  label="YouTube"
                  value={settings.youtube_url}
                  onChange={(e) => handleChange('youtube_url', e.target.value)}
                  placeholder="https://youtube.com/@canal"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-blue-100 rounded-lg">
              <LinkedInIcon className="w-5 h-5 text-blue-700" />
              <div className="flex-1">
                <AdminInput
                  label="LinkedIn"
                  value={settings.linkedin_url}
                  onChange={(e) => handleChange('linkedin_url', e.target.value)}
                  placeholder="https://linkedin.com/company/..."
                />
              </div>
            </div>
          </div>
        </AdminCard>

        {/* Notifications Section */}
        <AdminCard title="Notificări">
          <div className="space-y-4">
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-amber-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-amber-800 font-medium mb-1">
                    Email-uri pentru notificări
                  </p>
                  <p className="text-xs text-amber-700 mb-4">
                    Aceste adrese de email vor primi notificări când cineva trimite o petiție 
                    sau completează formularul de contact de pe website.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">
                  Adrese email pentru notificări
                </label>
                <button
                  type="button"
                  onClick={() => addArrayItem('notification_emails')}
                  className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                >
                  <Plus className="w-4 h-4" />
                  Adaugă email
                </button>
              </div>
              
              {settings.notification_emails.map((email, index) => (
                <div key={index} className="flex items-center gap-2">
                  <AdminInput
                    type="email"
                    value={email}
                    onChange={(e) => handleArrayChange('notification_emails', index, e.target.value)}
                    placeholder="email@primaria.ro"
                    className="flex-1"
                  />
                  {settings.notification_emails.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('notification_emails', index)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </AdminCard>
      </div>

      <div className="mt-6 flex justify-end">
        <AdminButton size="lg" icon={Save} onClick={handleSave} loading={saving}>
          Salvează Setările
        </AdminButton>
      </div>
    </div>
  );
}
