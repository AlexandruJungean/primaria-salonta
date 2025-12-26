'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  Settings2,
  ZoomIn,
  ZoomOut,
  Contrast,
  Type,
  Link2,
  RotateCcw,
  X,
  Sun,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface AccessibilitySettings {
  fontSize: number;
  grayscale: boolean;
  highContrast: boolean;
  negativeContrast: boolean;
  lightBackground: boolean;
  underlineLinks: boolean;
  readableFont: boolean;
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 100,
  grayscale: false,
  highContrast: false,
  negativeContrast: false,
  lightBackground: false,
  underlineLinks: false,
  readableFont: false,
};

export function AccessibilityToolbar() {
  const t = useTranslations('accessibility');
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);

  useEffect(() => {
    // Load settings from localStorage
    const saved = localStorage.getItem('accessibility-settings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch {
        // Invalid JSON, use defaults
      }
    }
  }, []);

  useEffect(() => {
    // Apply settings to document
    const html = document.documentElement;

    html.style.fontSize = `${settings.fontSize}%`;
    html.classList.toggle('a11y-grayscale', settings.grayscale);
    html.classList.toggle('a11y-high-contrast', settings.highContrast);
    html.classList.toggle('a11y-negative-contrast', settings.negativeContrast);
    html.classList.toggle('a11y-light-background', settings.lightBackground);
    html.classList.toggle('a11y-underline-links', settings.underlineLinks);
    html.classList.toggle('a11y-readable-font', settings.readableFont);

    // Save to localStorage
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  const toggleOptions = [
    { key: 'grayscale' as const, label: t('grayscale'), icon: Contrast },
    { key: 'highContrast' as const, label: t('highContrast'), icon: Contrast },
    { key: 'negativeContrast' as const, label: t('negativeContrast'), icon: Contrast },
    { key: 'lightBackground' as const, label: t('lightBackground'), icon: Sun },
    { key: 'underlineLinks' as const, label: t('underlineLinks'), icon: Link2 },
    { key: 'readableFont' as const, label: t('readableFont'), icon: Type },
  ];

  return (
    <>
      {/* Toggle Button - Fixed Position */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed left-0 top-1/4 z-50 bg-primary-900 text-white p-3 rounded-r-xl shadow-lg',
          'hover:bg-primary-800 transition-all hover:pl-4',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
        )}
        aria-label={t('title')}
      >
        <Settings2 className="w-6 h-6" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Toolbar Panel */}
      <div
        className={cn(
          'fixed left-0 top-0 z-50 h-full w-80 bg-white shadow-2xl overflow-y-auto transition-transform duration-300',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-primary-900 text-white">
          <div className="flex items-center gap-2">
            <Settings2 className="w-5 h-5" />
            <h2 className="font-semibold">{t('title')}</h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Font Size */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Text: {settings.fontSize}%
            </label>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  updateSetting('fontSize', Math.max(80, settings.fontSize - 10))
                }
                disabled={settings.fontSize <= 80}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 p-3 border rounded-lg transition-colors',
                  'hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                <ZoomOut className="w-4 h-4" />
                <span className="text-sm">{t('decreaseText')}</span>
              </button>
              <button
                onClick={() =>
                  updateSetting('fontSize', Math.min(150, settings.fontSize + 10))
                }
                disabled={settings.fontSize >= 150}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 p-3 border rounded-lg transition-colors',
                  'hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                <ZoomIn className="w-4 h-4" />
                <span className="text-sm">{t('increaseText')}</span>
              </button>
            </div>
          </div>

          {/* Toggle Options */}
          <div className="space-y-2">
            {toggleOptions.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => updateSetting(key, !settings[key])}
                className={cn(
                  'w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left',
                  settings[key]
                    ? 'bg-primary-100 border-primary-500 text-primary-900'
                    : 'hover:bg-gray-50 border-gray-200'
                )}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="text-sm">{label}</span>
              </button>
            ))}
          </div>

          {/* Reset Button */}
          <button
            onClick={resetSettings}
            className="w-full flex items-center justify-center gap-2 p-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t('reset')}</span>
          </button>
        </div>
      </div>
    </>
  );
}

