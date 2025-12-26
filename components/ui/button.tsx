'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary:
          'bg-primary-900 text-white hover:bg-primary-800 focus-visible:ring-primary-500 shadow-sm',
        secondary:
          'bg-secondary-500 text-white hover:bg-secondary-600 focus-visible:ring-secondary-400 shadow-sm',
        outline:
          'border-2 border-primary-900 text-primary-900 hover:bg-primary-50 focus-visible:ring-primary-500',
        ghost:
          'text-primary-900 hover:bg-primary-50 focus-visible:ring-primary-500',
        link:
          'text-primary-700 underline-offset-4 hover:underline focus-visible:ring-primary-500',
        destructive:
          'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 shadow-sm',
        success:
          'bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-500 shadow-sm',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-11 px-5 text-base',
        lg: 'h-13 px-7 text-lg',
        xl: 'h-14 px-8 text-lg',
        icon: 'h-10 w-10',
        iconSm: 'h-8 w-8',
        iconLg: 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, disabled, children, asChild, ...props }, ref) => {
    // Note: asChild is kept for API compatibility but not currently implemented
    // For Link usage, wrap the Button content in a Link component directly
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };

