'use client';

import { useTranslations } from 'next-intl';
import { Construction } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';

interface ComingSoonProps {
  pageName?: string;
}

export function ComingSoon({ pageName }: ComingSoonProps) {
  return (
    <Section background="gray">
      <Container>
        <div className="max-w-md mx-auto text-center py-12">
          <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-6">
            <Construction className="w-10 h-10 text-primary-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Pagină în construcție
          </h2>
          <p className="text-gray-600">
            {pageName 
              ? `Secțiunea "${pageName}" este în curs de dezvoltare.`
              : 'Această secțiune este în curs de dezvoltare.'
            }
            {' '}Conținutul va fi disponibil în curând.
          </p>
        </div>
      </Container>
    </Section>
  );
}

