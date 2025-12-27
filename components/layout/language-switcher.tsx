'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { cn } from '@/lib/utils/cn';
import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

// SVG Flag components for proper rendering on Windows
function RomaniaFlag({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
      <g fillRule="evenodd" strokeWidth="1pt">
        <path fill="#00319c" d="M0 0h213.3v480H0z" />
        <path fill="#ffde00" d="M213.3 0h213.4v480H213.3z" />
        <path fill="#de2110" d="M426.7 0H640v480H426.7z" />
      </g>
    </svg>
  );
}

function HungaryFlag({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
      <g fillRule="evenodd">
        <path fill="#fff" d="M640 480H0V0h640z" />
        <path fill="#388d00" d="M640 480H0V320h640z" />
        <path fill="#d43516" d="M640 160.1H0V.1h640z" />
      </g>
    </svg>
  );
}

function UKFlag({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
      <path fill="#012169" d="M0 0h640v480H0z" />
      <path fill="#FFF" d="m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0h75z" />
      <path fill="#C8102E" d="m424 281 216 159v40L369 281h55zm-184 20 6 35L54 480H0l240-179zM640 0v3L391 191l2-44L590 0h50zM0 0l239 176h-60L0 42V0z" />
      <path fill="#FFF" d="M241 0v480h160V0H241zM0 160v160h640V160H0z" />
      <path fill="#C8102E" d="M0 193v96h640v-96H0zM273 0v480h96V0h-96z" />
    </svg>
  );
}

const LANGUAGES = [
  { code: 'ro', name: 'Română', Flag: RomaniaFlag },
  { code: 'hu', name: 'Magyar', Flag: HungaryFlag },
  { code: 'en', name: 'English', Flag: UKFlag },
] as const;

interface LanguageSwitcherProps {
  variant?: 'default' | 'topbar';
}

export function LanguageSwitcher({ variant = 'default' }: LanguageSwitcherProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = LANGUAGES.find((lang) => lang.code === locale) || LANGUAGES[0];

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale as 'ro' | 'hu' | 'en' });
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const CurrentFlag = currentLanguage.Flag;

  if (variant === 'topbar') {
    return (
      <div ref={dropdownRef} className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'flex items-center gap-2 text-sm font-medium transition-colors',
            'text-white hover:text-secondary-300 focus:outline-none'
          )}
          aria-label="Select language"
          aria-expanded={isOpen}
        >
          <CurrentFlag className="w-5 h-4 rounded-sm shadow-sm" />
          <span>{currentLanguage.name}</span>
          <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', isOpen && 'rotate-180')} />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-[9999] animate-in fade-in slide-in-from-top-2 duration-200">
            {LANGUAGES.map((language) => {
              const LangFlag = language.Flag;
              return (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                    language.code === locale
                      ? 'bg-primary-50 text-primary-900 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  )}
                >
                  <LangFlag className="w-5 h-4 rounded-sm shadow-sm" />
                  <span>{language.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
          'hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500'
        )}
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <CurrentFlag className="w-5 h-4 rounded-sm" />
        <span className="hidden md:inline">{currentLanguage.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-[9999] animate-in fade-in slide-in-from-top-2 duration-200">
          {LANGUAGES.map((language) => {
            const LangFlag = language.Flag;
            return (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                  language.code === locale
                    ? 'bg-primary-50 text-primary-900 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                <LangFlag className="w-5 h-4 rounded-sm shadow-sm" />
                <span>{language.name}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

