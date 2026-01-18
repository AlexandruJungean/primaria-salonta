'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface CollapsibleProps {
  title: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
  icon?: React.ReactNode;
}

export function Collapsible({
  title,
  children,
  defaultOpen = false,
  className,
  titleClassName,
  contentClassName,
  icon,
}: CollapsibleProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className={cn('border border-gray-200 rounded-lg overflow-hidden', className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left',
          titleClassName
        )}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className="font-semibold">{title}</span>
        </div>
        <ChevronDown
          className={cn(
            'w-5 h-5 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      <div
        className={cn(
          'grid transition-all duration-200 ease-in-out',
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        )}
      >
        <div className="overflow-hidden">
          <div className={cn('p-4 bg-white', contentClassName)}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

interface CollapsibleGroupProps {
  children: React.ReactNode;
  className?: string;
}

export function CollapsibleGroup({ children, className }: CollapsibleGroupProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {children}
    </div>
  );
}
