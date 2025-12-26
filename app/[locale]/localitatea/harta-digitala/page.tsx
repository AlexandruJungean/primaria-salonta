import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Map } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('hartaDigitala') };
}

export default function HartaDigitalaPage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('localitatea'), href: '/localitatea' },
        { label: t('hartaDigitala') }
      ]} />
      <PageHeader titleKey="hartaDigitala" icon="map" />

      <Section background="white" className="py-0">
        <div className="h-[calc(100vh-300px)] min-h-[500px]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d43682.91!2d21.6!3d46.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4747f4e8b2f14f87%3A0x400d4d3e1f4c4e0!2sSalonta!5e0!3m2!1sen!2sro!4v1"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            title="Hartă digitală Salonta"
          />
        </div>
      </Section>

      <Section background="gray">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Explorează Salonta
            </h2>
            <p className="text-gray-600">
              Folosiți harta interactivă pentru a explora municipiul Salonta. 
              Puteți vizualiza străzile, instituțiile publice, zonele de interes 
              și punctele turistice ale orașului.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}

