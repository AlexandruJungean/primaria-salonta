import * as React from 'react';
import { cn } from '@/lib/utils/cn';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  background?: 'white' | 'gray' | 'primary' | 'gradient';
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, background = 'white', ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn(
          'py-12 md:py-16 lg:py-20',
          background === 'white' && 'bg-white',
          background === 'gray' && 'bg-gray-50',
          background === 'primary' && 'bg-primary-900 text-white',
          background === 'gradient' && 'bg-gradient-to-br from-primary-900 to-primary-700 text-white',
          className
        )}
        {...props}
      />
    );
  }
);
Section.displayName = 'Section';

interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

const SectionHeader = React.forwardRef<HTMLDivElement, SectionHeaderProps>(
  ({ className, title, subtitle, centered = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'mb-10 md:mb-12',
          centered && 'text-center',
          className
        )}
        {...props}
      >
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
    );
  }
);
SectionHeader.displayName = 'SectionHeader';

export { Section, SectionHeader };

