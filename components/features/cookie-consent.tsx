'use client';

import { useState, useEffect } from 'react';
import { Cookie, X, Settings, Shield } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useLocale } from 'next-intl';

const COOKIE_CONSENT_KEY = 'cookie_consent';
const COOKIE_CONSENT_VERSION = '1.0';

type ConsentType = 'all' | 'essential' | null;

interface CookieConsent {
  version: string;
  consent: ConsentType;
  timestamp: string;
}

const translations = {
  ro: {
    title: 'Utilizăm cookie-uri',
    description: 'Acest site folosește cookie-uri pentru a vă oferi cea mai bună experiență. Cookie-urile esențiale sunt necesare pentru funcționarea site-ului, iar cele funcționale îmbunătățesc experiența dumneavoastră.',
    acceptAll: 'Acceptă toate',
    acceptEssential: 'Doar esențiale',
    customize: 'Setări',
    learnMore: 'Află mai multe',
    essential: 'Cookie-uri esențiale',
    essentialDesc: 'Necesare pentru funcționarea site-ului (limbă, accesibilitate)',
    functional: 'Cookie-uri funcționale',
    functionalDesc: 'Personalizare și funcții îmbunătățite',
    security: 'Cookie-uri de securitate',
    securityDesc: 'Protecție formulare (reCAPTCHA)',
    thirdParty: 'Servicii terță parte',
    thirdPartyDesc: 'Google Maps, YouTube, camere web',
    save: 'Salvează preferințele',
    close: 'Închide',
  },
  hu: {
    title: 'Cookie-kat használunk',
    description: 'Ez az oldal cookie-kat használ a legjobb élmény biztosításához. Az alapvető cookie-k szükségesek a webhely működéséhez, míg a funkcionális cookie-k javítják az élményt.',
    acceptAll: 'Összes elfogadása',
    acceptEssential: 'Csak alapvetők',
    customize: 'Beállítások',
    learnMore: 'További információ',
    essential: 'Alapvető cookie-k',
    essentialDesc: 'A webhely működéséhez szükséges (nyelv, akadálymentesség)',
    functional: 'Funkcionális cookie-k',
    functionalDesc: 'Személyre szabás és továbbfejlesztett funkciók',
    security: 'Biztonsági cookie-k',
    securityDesc: 'Űrlapvédelem (reCAPTCHA)',
    thirdParty: 'Harmadik fél szolgáltatások',
    thirdPartyDesc: 'Google Maps, YouTube, webkamerák',
    save: 'Beállítások mentése',
    close: 'Bezárás',
  },
  en: {
    title: 'We use cookies',
    description: 'This site uses cookies to provide you with the best experience. Essential cookies are necessary for the site to function, while functional cookies enhance your experience.',
    acceptAll: 'Accept all',
    acceptEssential: 'Essential only',
    customize: 'Settings',
    learnMore: 'Learn more',
    essential: 'Essential cookies',
    essentialDesc: 'Required for site functionality (language, accessibility)',
    functional: 'Functional cookies',
    functionalDesc: 'Personalization and enhanced features',
    security: 'Security cookies',
    securityDesc: 'Form protection (reCAPTCHA)',
    thirdParty: 'Third-party services',
    thirdPartyDesc: 'Google Maps, YouTube, webcams',
    save: 'Save preferences',
    close: 'Close',
  },
};

export function CookieConsent() {
  const locale = useLocale() as keyof typeof translations;
  const t = translations[locale] || translations.ro;
  
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true, // Always true, cannot be disabled
    functional: true,
    security: true,
    thirdParty: true,
  });

  useEffect(() => {
    // Check if consent was already given
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (stored) {
      try {
        const parsed: CookieConsent = JSON.parse(stored);
        // If version changed, show banner again
        if (parsed.version !== COOKIE_CONSENT_VERSION) {
          setIsVisible(true);
        }
      } catch {
        setIsVisible(true);
      }
    } else {
      // No consent stored, show banner
      setIsVisible(true);
    }
  }, []);

  const saveConsent = (consent: ConsentType) => {
    const data: CookieConsent = {
      version: COOKIE_CONSENT_VERSION,
      consent,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(data));
    setIsVisible(false);
    setShowSettings(false);
  };

  const handleAcceptAll = () => {
    saveConsent('all');
  };

  const handleAcceptEssential = () => {
    saveConsent('essential');
  };

  const handleSavePreferences = () => {
    // If all are selected, save as 'all', otherwise 'essential'
    const allSelected = preferences.functional && preferences.security && preferences.thirdParty;
    saveConsent(allSelected ? 'all' : 'essential');
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay for settings modal */}
      {showSettings && (
        <div 
          className="fixed inset-0 bg-black/50 z-[9998]"
          onClick={() => setShowSettings(false)}
        />
      )}

      {/* Main Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          {!showSettings ? (
            // Simple Banner
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              <div className="p-5 md:p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
                    <Cookie className="w-6 h-6 text-primary-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">
                      {t.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {t.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={handleAcceptAll}
                        className="px-5 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        {t.acceptAll}
                      </button>
                      <button
                        onClick={handleAcceptEssential}
                        className="px-5 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        {t.acceptEssential}
                      </button>
                      <button
                        onClick={() => setShowSettings(true)}
                        className="px-5 py-2.5 text-gray-600 text-sm font-medium hover:text-gray-900 transition-colors flex items-center gap-2"
                      >
                        <Settings className="w-4 h-4" />
                        {t.customize}
                      </button>
                      <Link
                        href="/politica-cookies"
                        className="text-sm text-primary-600 hover:text-primary-800 underline"
                      >
                        {t.learnMore}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Settings Panel
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden max-h-[80vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-primary-600" />
                  <h3 className="font-semibold text-gray-900">{t.customize}</h3>
                </div>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={t.close}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-5 space-y-4">
                {/* Essential - Always on */}
                <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{t.essential}</h4>
                      <span className="text-xs text-green-600 font-medium px-2 py-1 bg-green-100 rounded-full">
                        {locale === 'ro' ? 'Obligatorii' : locale === 'hu' ? 'Kötelező' : 'Required'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{t.essentialDesc}</p>
                  </div>
                </div>

                {/* Functional */}
                <label className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={preferences.functional}
                    onChange={(e) => setPreferences(prev => ({ ...prev, functional: e.target.checked }))}
                    className="mt-1 w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{t.functional}</h4>
                    <p className="text-sm text-gray-600 mt-1">{t.functionalDesc}</p>
                  </div>
                </label>

                {/* Security */}
                <label className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={preferences.security}
                    onChange={(e) => setPreferences(prev => ({ ...prev, security: e.target.checked }))}
                    className="mt-1 w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{t.security}</h4>
                    <p className="text-sm text-gray-600 mt-1">{t.securityDesc}</p>
                  </div>
                </label>

                {/* Third Party */}
                <label className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={preferences.thirdParty}
                    onChange={(e) => setPreferences(prev => ({ ...prev, thirdParty: e.target.checked }))}
                    className="mt-1 w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{t.thirdParty}</h4>
                    <p className="text-sm text-gray-600 mt-1">{t.thirdPartyDesc}</p>
                  </div>
                </label>
              </div>

              <div className="sticky bottom-0 bg-white border-t border-gray-100 px-5 py-4 flex flex-wrap items-center justify-between gap-3">
                <Link
                  href="/politica-cookies"
                  className="text-sm text-primary-600 hover:text-primary-800 underline"
                >
                  {t.learnMore}
                </Link>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleAcceptEssential}
                    className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    {t.acceptEssential}
                  </button>
                  <button
                    onClick={handleSavePreferences}
                    className="px-5 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    {t.save}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
