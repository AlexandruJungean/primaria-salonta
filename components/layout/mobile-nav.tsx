'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/components/ui/link';
import { Menu, X, ChevronDown, ChevronRight, Newspaper, Video, Phone } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { MAIN_NAVIGATION, SECONDARY_NAVIGATION, getNavigationWithInstitutions, type NavSection, type NavGroup, type NavItem } from '@/lib/constants/navigation';
import { useNavigationContext } from './navigation-context';
import Image from 'next/image';

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const t = useTranslations('navigation');
  const { dynamicInstitutions, dynamicPrograms } = useNavigationContext();
  
  // Merge dynamic institutions and programs into navigation
  const navigation = useMemo(() => 
    getNavigationWithInstitutions(dynamicInstitutions, dynamicPrograms),
    [dynamicInstitutions, dynamicPrograms]
  );

  // Icon mapping for secondary items
  const secondaryIcons: Record<string, typeof Newspaper> = {
    stiri: Newspaper,
    camereWeb: Video,
    contact: Phone,
  };

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const toggleSection = (id: string) => {
    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleGroup = (id: string) => {
    setExpandedGroups((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Render a single nav item (leaf item)
  const renderNavItem = (item: NavItem) => {
    const Icon = item.icon;
    // Use direct label for dynamic items, translation for static items
    const itemLabel = item.label || t(item.id);
    return (
      <Link
        key={item.id + item.href}
        href={item.href}
        onClick={() => setIsOpen(false)}
        className="flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:bg-gray-50 transition-colors"
      >
        {Icon && <Icon className="w-4 h-4 text-gray-400" />}
        <span className="text-sm">{itemLabel}</span>
      </Link>
    );
  };

  // Render a group with its items
  const renderGroup = (group: NavGroup, sectionId: string) => {
    const groupKey = `${sectionId}-${group.groupId}`;
    const isExpanded = expandedGroups.includes(groupKey);
    const GroupIcon = group.groupIcon;

    return (
      <div key={groupKey} className="border-b border-gray-100 last:border-b-0">
        {/* Group Header */}
        <button
          onClick={() => toggleGroup(groupKey)}
          className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
        >
          <span className="flex items-center gap-3">
            {GroupIcon && <GroupIcon className="w-5 h-5 text-primary-600" />}
            <span className="text-sm font-medium text-gray-800">{t(group.groupId)}</span>
          </span>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )}
        </button>

        {/* Group Items */}
        {isExpanded && (
          <div className="bg-gray-50 border-l-2 border-primary-200 ml-4 py-1">
            {/* Link to group page if available */}
            {group.groupHref && (
              <Link
                href={group.groupHref}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-primary-700 hover:bg-primary-50 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
                <span className="text-sm font-medium">Vezi toate</span>
              </Link>
            )}
            {group.items.map((item) => renderNavItem(item))}
          </div>
        )}
      </div>
    );
  };

  // Render a main section
  const renderSection = (section: NavSection) => {
    const isExpanded = expandedSections.includes(section.id);
    const SectionIcon = section.icon;
    const hasContent =
      (section.groups && section.groups.length > 0) ||
      (section.standaloneItems && section.standaloneItems.length > 0);

    return (
      <div key={section.id} className="border-b border-gray-200">
        {/* Section Header */}
        <button
          onClick={() => toggleSection(section.id)}
          className={cn(
            'w-full flex items-center justify-between px-4 py-4 text-left transition-colors',
            isExpanded ? 'bg-primary-50' : 'hover:bg-gray-50'
          )}
        >
          <span className="flex items-center gap-3">
            {SectionIcon && (
              <SectionIcon className={cn('w-5 h-5', isExpanded ? 'text-primary-700' : 'text-primary-600')} />
            )}
            <span className={cn('font-semibold', isExpanded ? 'text-primary-900' : 'text-gray-900')}>
              {t(section.id)}
            </span>
          </span>
          {hasContent && (
            isExpanded ? (
              <ChevronDown className="w-5 h-5 text-primary-600" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-400" />
            )
          )}
        </button>

        {/* Section Content */}
        {isExpanded && hasContent && (
          <div className="bg-white">
            {/* Groups */}
            {section.groups && section.groups.length > 0 && (
              <div className="divide-y divide-gray-100">
                {section.groups.map((group) => renderGroup(group, section.id))}
              </div>
            )}

            {/* Standalone Items */}
            {section.standaloneItems && section.standaloneItems.length > 0 && (
              <div className={cn(
                'py-2',
                section.groups && section.groups.length > 0 && 'border-t border-gray-200 mt-2'
              )}>
                <p className="px-4 py-2 text-xs uppercase tracking-wide text-gray-500 font-medium">
                  Alte linkuri
                </p>
                {section.standaloneItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.id + item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      {Icon && <Icon className="w-4 h-4 text-primary-600" />}
                      <span className="text-sm">{t(item.id)}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="lg:hidden">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Menu Overlay */}
      <div 
        className={cn(
          'fixed inset-0 z-50 bg-black/50 transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )} 
        onClick={() => setIsOpen(false)} 
      />

      {/* Mobile Menu Panel */}
      <div
        className={cn(
          'fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-white shadow-xl transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <Image
              src="/logo/logo-transparent.webp"
              alt="Primăria Salonta"
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <span className="font-semibold text-gray-900">Primăria Salonta</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="overflow-y-auto h-[calc(100%-80px)] pb-20">
          {/* Main Navigation Sections */}
          {navigation.map((section) => renderSection(section))}

          {/* Divider */}
          <div className="h-2 bg-gray-100" />

          {/* Secondary Navigation */}
          <div className="py-2">
            {SECONDARY_NAVIGATION.map((item) => {
              const Icon = secondaryIcons[item.id] || item.icon;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-900 font-medium hover:bg-gray-50 transition-colors"
                >
                  {Icon && <Icon className="w-5 h-5 text-primary-600" />}
                  {t(item.id)}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
