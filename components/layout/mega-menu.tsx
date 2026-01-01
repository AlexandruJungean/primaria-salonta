'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/components/ui/link';
import { ChevronDown, ChevronRight, Newspaper, Video, Phone } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { MAIN_NAVIGATION, SECONDARY_NAVIGATION, type NavSection } from '@/lib/constants/navigation';

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

  // Calculate total items count for layout decisions
  const getTotalItems = (section: NavSection) => {
    const groupItems = section.groups?.reduce((acc, group) => acc + group.items.length, 0) || 0;
    const standaloneItems = section.standaloneItems?.length || 0;
    return groupItems + standaloneItems;
  };

  // Get number of columns based on section size
  const getColumnCount = (section: NavSection) => {
    const groupCount = section.groups?.length || 0;
    const totalItems = getTotalItems(section);
    
    // 4 columns for very large menus (City Hall section has 7 groups)
    if (groupCount >= 6 || totalItems > 25) return 4;
    // 3 columns for large menus
    if (groupCount >= 4 || totalItems > 12) return 3;
    // 2 columns for medium menus
    return 2;
  };

  return (
    <nav className="flex items-center">
      {/* Main Navigation - 4 user-centric categories */}
      {MAIN_NAVIGATION.map((section) => {
        const hasContent =
          (section.groups && section.groups.length > 0) ||
          (section.standaloneItems && section.standaloneItems.length > 0);
        const columnCount = getColumnCount(section);

        return (
          <div
            key={section.id}
            className="relative"
            onMouseEnter={() => hasContent && handleMouseEnter(section.id)}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap',
                activeMenu === section.id
                  ? 'bg-primary-50 text-primary-900'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              {t(section.id)}
              <ChevronDown
                className={cn(
                  'w-4 h-4 transition-transform duration-200',
                  activeMenu === section.id && 'rotate-180'
                )}
              />
            </button>

            {/* Mega Menu Dropdown */}
            {hasContent && activeMenu === section.id && (
              <div
                className="absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50"
                onMouseEnter={() => handleMouseEnter(section.id)}
                onMouseLeave={handleMouseLeave}
              >
                <div
                  className={cn(
                    'bg-white rounded-xl shadow-2xl border border-gray-200 p-5 animate-in fade-in slide-in-from-top-2 duration-200',
                    columnCount === 4 && 'min-w-[900px] max-w-[1100px]',
                    columnCount === 3 && 'min-w-[720px] max-w-[900px]',
                    columnCount === 2 && 'min-w-[520px] max-w-[640px]'
                  )}
                >
                  {/* Groups */}
                  {section.groups && section.groups.length > 0 && (
                    <div
                      className={cn(
                        'grid gap-6',
                        columnCount === 4 && 'grid-cols-4',
                        columnCount === 3 && 'grid-cols-3',
                        columnCount === 2 && 'grid-cols-2'
                      )}
                    >
                      {section.groups.map((group) => {
                        const GroupIcon = group.groupIcon;
                        const groupTitle = t(group.groupId);
                        const hasTitle = groupTitle && groupTitle.trim() !== '';
                        return (
                          <div key={group.groupId} className="space-y-2">
                            {/* Group Header - only show if title exists */}
                            {hasTitle && (
                              group.groupHref ? (
                                <Link
                                  href={group.groupHref}
                                  className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-primary-50 transition-colors group"
                                >
                                  {GroupIcon && (
                                    <GroupIcon className="w-4 h-4 text-primary-600" />
                                  )}
                                  <span className="text-sm font-semibold text-gray-900 group-hover:text-primary-700">
                                    {groupTitle}
                                  </span>
                                  <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-primary-600 ml-auto" />
                                </Link>
                              ) : (
                                <div className="flex items-center gap-2 px-2 py-1.5">
                                  {GroupIcon && (
                                    <GroupIcon className="w-4 h-4 text-primary-600" />
                                  )}
                                  <span className="text-sm font-semibold text-gray-900">
                                    {groupTitle}
                                  </span>
                                </div>
                              )
                            )}

                            {/* Group Items */}
                            <div className={cn(
                              "space-y-0.5",
                              hasTitle ? "pl-1 border-l-2 border-gray-100 ml-2" : "pl-0 ml-0"
                            )}>
                              {group.items.map((item) => {
                                const ItemIcon = item.icon;
                                return (
                                  <Link
                                    key={item.id + item.href}
                                    href={item.href}
                                    className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-gray-50 transition-colors group"
                                  >
                                    {ItemIcon && (
                                      <ItemIcon className="w-4 h-4 text-gray-400 group-hover:text-primary-600 shrink-0" />
                                    )}
                                    <span className="text-sm text-gray-600 group-hover:text-gray-900">
                                      {t(item.id)}
                                    </span>
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Standalone Items */}
                  {section.standaloneItems && section.standaloneItems.length > 0 && (
                    <>
                      {/* Divider if there are groups above */}
                      {section.groups && section.groups.length > 0 && (
                        <div className="border-t border-gray-100 my-4" />
                      )}

                      <div
                        className={cn(
                          'grid gap-x-6 gap-y-1',
                          section.standaloneItems.length > 6 ? 'grid-cols-3' : 
                          section.standaloneItems.length > 3 ? 'grid-cols-2' : 'grid-cols-1'
                        )}
                      >
                        {section.standaloneItems.map((item) => {
                          const ItemIcon = item.icon;
                          return (
                            <Link
                              key={item.id + item.href}
                              href={item.href}
                              className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors group"
                            >
                              {ItemIcon && (
                                <ItemIcon className="w-4 h-4 text-primary-600 group-hover:text-primary-700 shrink-0" />
                              )}
                              <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium">
                                {t(item.id)}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </>
                  )}
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
