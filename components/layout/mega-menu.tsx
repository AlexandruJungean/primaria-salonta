'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/components/ui/link';
import { ChevronDown, Newspaper, Video, Phone } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { MAIN_NAVIGATION, SECONDARY_NAVIGATION } from '@/lib/constants/navigation';

export function MegaMenu() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const t = useTranslations('navigation');

  const handleMouseEnter = (id: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveMenu(id);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Icon mapping for secondary items
  const secondaryIcons: Record<string, typeof Newspaper> = {
    stiri: Newspaper,
    camereWeb: Video,
    contact: Phone,
  };

  return (
    <nav className="flex items-center">
      {/* Main Navigation - 4 user-centric categories */}
      {MAIN_NAVIGATION.map((item) => {
        const hasChildren = item.children && item.children.length > 0;

        return (
          <div
            key={item.id}
            className="relative"
            onMouseEnter={() => hasChildren && handleMouseEnter(item.id)}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap',
                activeMenu === item.id
                  ? 'bg-primary-50 text-primary-900'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              {t(item.id)}
              <ChevronDown
                className={cn(
                  'w-4 h-4 transition-transform duration-200',
                  activeMenu === item.id && 'rotate-180'
                )}
              />
            </button>

            {/* Mega Menu Dropdown - Wide layout like Oradea */}
            {hasChildren && activeMenu === item.id && (
              <div
                className="absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50"
                onMouseEnter={() => handleMouseEnter(item.id)}
                onMouseLeave={handleMouseLeave}
              >
                <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-6 min-w-[500px] max-w-[600px] animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="grid grid-cols-2 gap-x-8 gap-y-1">
                    {item.children!.map((child) => {
                      const ChildIcon = child.icon;
                      return (
                        <Link
                          key={child.id + child.href}
                          href={child.href}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group"
                        >
                          {ChildIcon && (
                            <ChildIcon className="w-5 h-5 text-primary-600 group-hover:text-primary-700 shrink-0" />
                          )}
                          <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium">
                            {t(child.id)}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Divider */}
      <div className="h-5 w-px bg-gray-300 mx-3" />

      {/* Secondary Navigation - Quick access items with icons */}
      {SECONDARY_NAVIGATION.map((item) => {
        const Icon = secondaryIcons[item.id];
        return (
          <Link
            key={item.id}
            href={item.href}
            className="flex items-center gap-1.5 px-2.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors whitespace-nowrap"
          >
            {Icon && <Icon className="w-4 h-4" />}
            {t(item.id)}
          </Link>
        );
      })}
    </nav>
  );
}

