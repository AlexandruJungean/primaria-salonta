'use client';

import { useLocale } from 'next-intl';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { EXTERNAL_LINKS } from '@/lib/constants/contact';

export function ExternalLinksSection() {
  const locale = useLocale() as 'ro' | 'hu' | 'en';

  return (
    <Section background="gray" className="py-8">
      <Container>
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
          {EXTERNAL_LINKS.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
              title={link.translations[locale].description}
            >
              <Image
                src={link.image}
                alt={link.translations[locale].title}
                width={120}
                height={60}
                className="h-12 w-auto object-contain"
              />
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors" />
            </a>
          ))}
        </div>
      </Container>
    </Section>
  );
}

