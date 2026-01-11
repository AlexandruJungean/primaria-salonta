'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/components/ui/link';
import { cn } from '@/lib/utils/cn';
import { QUICK_LINKS } from '@/lib/constants/navigation';
import { Container } from '@/components/ui/container';

export function QuickLinksSection() {
  const t = useTranslations('homepage');
  const tNav = useTranslations('navigation');

  return (
    <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 py-12 md:py-16 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      <Container className="relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            {t('quickLinks')}
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {QUICK_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.id}
                href={link.href}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 text-center hover:bg-white/20 transition-colors group flex flex-col items-center gap-3"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
                <span className="text-sm font-medium text-white text-center">
                  {tNav(link.id)}
                </span>
              </Link>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
