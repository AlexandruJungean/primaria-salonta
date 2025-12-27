'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/components/ui/link';
import { Menu, X, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { FULL_NAVIGATION, type NavItem } from '@/lib/constants/navigation';
import Image from 'next/image';

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const t = useTranslations('navigation');

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const renderNavItem = (item: NavItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const Icon = item.icon;

    return (
      <div key={item.id}>
        {hasChildren ? (
          <button
            onClick={() => toggleExpanded(item.id)}
            className={cn(
              'w-full flex items-center justify-between px-4 py-3 text-left transition-colors',
              level === 0
                ? 'text-gray-900 font-medium hover:bg-gray-50'
                : 'text-gray-600 hover:bg-gray-50 pl-8'
            )}
          >
            <span className="flex items-center gap-3">
              {Icon && <Icon className="w-5 h-5 text-primary-600" />}
              {t(item.id)}
            </span>
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-400" />
            )}
          </button>
        ) : (
          <Link
            href={item.href}
            onClick={() => setIsOpen(false)}
            className={cn(
              'flex items-center gap-3 px-4 py-3 transition-colors',
              level === 0
                ? 'text-gray-900 font-medium hover:bg-gray-50'
                : 'text-gray-600 hover:bg-gray-50 pl-8'
            )}
          >
            {Icon && <Icon className="w-5 h-5 text-primary-600" />}
            {t(item.id)}
          </Link>
        )}

        {hasChildren && isExpanded && (
          <div className="bg-gray-50 border-l-2 border-primary-200 ml-4">
            {item.children!.map((child) => renderNavItem(child, level + 1))}
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
              src="/logo/logo-transparent.png"
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
          {FULL_NAVIGATION.map((item) => renderNavItem(item))}
        </nav>
      </div>
    </div>
  );
}

