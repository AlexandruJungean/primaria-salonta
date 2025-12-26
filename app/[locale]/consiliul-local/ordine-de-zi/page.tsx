import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { ClipboardList, Calendar, Download } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('ordineZi') };
}

const AGENDAS = [
  { date: '2025-12-15', title: 'Ședință ordinară - Decembrie 2025', items: 12 },
  { date: '2025-11-20', title: 'Ședință ordinară - Noiembrie 2025', items: 8 },
  { date: '2025-10-18', title: 'Ședință ordinară - Octombrie 2025', items: 15 },
  { date: '2025-09-22', title: 'Ședință ordinară - Septembrie 2025', items: 10 },
];

export default function OrdineZiPage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('consiliulLocal'), href: '/consiliul-local' },
        { label: t('ordineZi') }
      ]} />
      <PageHeader titleKey="ordineZi" icon="clipboardList" />

      <Section background="white">
        <Container>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-gray-600 mb-8 text-center">
              Ordinele de zi ale ședințelor Consiliului Local, publicate 
              conform Legii transparenței decizionale.
            </p>

            <div className="space-y-3">
              {AGENDAS.map((agenda, idx) => (
                <Card key={idx}>
                  <CardContent className="flex items-center justify-between pt-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-primary-700" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{agenda.title}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(agenda.date).toLocaleDateString('ro-RO')} • {agenda.items} puncte
                        </p>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Download className="w-4 h-4" />
                      PDF
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

