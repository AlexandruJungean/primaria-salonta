'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/components/ui/link';
import { ChevronRight, Home } from 'lucide-react';
import { Container } from '@/components/ui/container';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const t = useTranslations('common');

  return (
    <div className="bg-gray-50 border-b border-gray-200">
      <Container>
        <nav className="py-3" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link
                href="/"
                className="flex items-center gap-1 text-gray-500 hover:text-primary-700 transition-colors"
              >
                <Home className="w-4 h-4" />
                <span className="sr-only sm:not-sr-only">{t('home')}</span>
              </Link>
            </li>
            {items.map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-gray-400" />
                {item.href ? (
                  <Link
                    href={item.href}
                    className="text-gray-500 hover:text-primary-700 transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-gray-900 font-medium">{item.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </Container>
    </div>
  );
}

