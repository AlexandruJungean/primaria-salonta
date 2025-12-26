'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/components/ui/link';
import { cn } from '@/lib/utils/cn';
import { QUICK_LINKS } from '@/lib/constants/navigation';
import { Container } from '@/components/ui/container';
import { Section, SectionHeader } from '@/components/ui/section';

export function QuickLinksSection() {
  const t = useTranslations('homepage');
  const tNav = useTranslations('navigation');

  return (
    <Section background="white" className="py-8 md:py-12 -mt-16 relative z-20">
      <Container>
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            {t('quickLinks')}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {QUICK_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.id}
                  href={link.href}
                  className={cn(
                    'flex flex-col items-center gap-3 p-4 rounded-xl',
                    'bg-gray-50 hover:bg-primary-50 border border-transparent hover:border-primary-200',
                    'transition-all group hover:shadow-md hover:-translate-y-1'
                  )}
                >
                  <div className="w-12 h-12 rounded-full bg-primary-100 group-hover:bg-primary-200 flex items-center justify-center transition-colors">
                    <Icon className="w-6 h-6 text-primary-700" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-primary-900 text-center">
                    {tNav(link.id)}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </Container>
    </Section>
  );
}

