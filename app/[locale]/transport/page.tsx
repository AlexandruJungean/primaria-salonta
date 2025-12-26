'use client';

import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { PageHeader } from '@/components/pages/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Bus, Clock } from 'lucide-react';

export default function TransportPage() {
  const t = useTranslations('navigation');

  return (
    <>
      <PageHeader titleKey="transport" icon="bus" />

      <Section background="white">
        <Container>
          <Card className="max-w-3xl mx-auto">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center py-12">
                <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center mb-6">
                  <Clock className="w-10 h-10 text-primary-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  În curând
                </h2>
                <p className="text-gray-600 max-w-md">
                  Această pagină este în curs de dezvoltare. În curând veți găsi informații despre transportul public, rute și orare.
                </p>
              </div>
            </CardContent>
          </Card>
        </Container>
      </Section>
    </>
  );
}

