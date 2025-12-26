import * as React from 'react';
import { cn } from '@/lib/utils/cn';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = 'lg', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'mx-auto w-full px-4 sm:px-6 lg:px-8',
          size === 'sm' && 'max-w-3xl',
          size === 'md' && 'max-w-5xl',
          size === 'lg' && 'max-w-7xl',
          size === 'xl' && 'max-w-[1400px]',
          size === 'full' && 'max-w-full',
          className
        )}
        {...props}
      />
    );
  }
);
Container.displayName = 'Container';

export { Container };

