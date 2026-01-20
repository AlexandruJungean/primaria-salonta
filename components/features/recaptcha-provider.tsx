'use client';

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface RecaptchaContextValue {
  isLoaded: boolean;
  loadRecaptcha: () => void;
}

const RecaptchaContext = createContext<RecaptchaContextValue>({
  isLoaded: false,
  loadRecaptcha: () => {},
});

export function useRecaptchaLoader() {
  return useContext(RecaptchaContext);
}

interface RecaptchaProviderProps {
  children: React.ReactNode;
}

/**
 * Lazy-loading reCAPTCHA Provider
 * Only loads reCAPTCHA scripts when explicitly requested by a form component
 * This saves ~730KB of JavaScript on pages without forms
 */
export function RecaptchaProvider({ children }: RecaptchaProviderProps) {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const [isLoaded, setIsLoaded] = useState(false);

  const loadRecaptcha = useCallback(() => {
    if (!siteKey) {
      console.warn('reCAPTCHA site key not configured. Forms will work without bot protection.');
      return;
    }
    setIsLoaded(true);
  }, [siteKey]);

  // If no site key, just render children
  if (!siteKey) {
    return (
      <RecaptchaContext.Provider value={{ isLoaded: false, loadRecaptcha }}>
        {children}
      </RecaptchaContext.Provider>
    );
  }

  // If reCAPTCHA is requested, wrap with the provider
  if (isLoaded) {
    return (
      <RecaptchaContext.Provider value={{ isLoaded: true, loadRecaptcha }}>
        <GoogleReCaptchaProvider
          reCaptchaKey={siteKey}
          scriptProps={{
            async: true,
            defer: true,
            appendTo: 'head',
          }}
        >
          {children}
        </GoogleReCaptchaProvider>
      </RecaptchaContext.Provider>
    );
  }

  // Default: render without reCAPTCHA loaded
  return (
    <RecaptchaContext.Provider value={{ isLoaded: false, loadRecaptcha }}>
      {children}
    </RecaptchaContext.Provider>
  );
}

/**
 * Hook to ensure reCAPTCHA is loaded before using it
 * Call this in form components that need reCAPTCHA
 */
export function useEnsureRecaptcha() {
  const { isLoaded, loadRecaptcha } = useRecaptchaLoader();

  useEffect(() => {
    if (!isLoaded) {
      loadRecaptcha();
    }
  }, [isLoaded, loadRecaptcha]);

  return isLoaded;
}
