import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Megaphone, Calendar, ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { Link } from '@/components/ui/link';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('anunturi') };
}

const ANNOUNCEMENTS = [
  { id: 1, date: '2025-12-20', title: 'Anunț privind programul în perioada sărbătorilor', category: 'general' },
  { id: 2, date: '2025-12-15', title: 'Proiect de hotărâre - Buget local 2026', category: 'proiect' },
  { id: 3, date: '2025-12-10', title: 'Invitație ședință Consiliu Local', category: 'sedinta' },
  { id: 4, date: '2025-12-05', title: 'Anunț licitație publică - închiriere spații', category: 'licitatie' },
  { id: 5, date: '2025-11-28', title: 'Proiect de hotărâre - taxe și impozite locale 2026', category: 'proiect' },
];

const CATEGORY_LABELS: Record<string, { label: string; variant: 'default' | 'secondary' | 'success' | 'warning' }> = {
  general: { label: 'General', variant: 'default' },
  proiect: { label: 'Proiect HCL', variant: 'secondary' },
  sedinta: { label: 'Ședință', variant: 'success' },
  licitatie: { label: 'Licitație', variant: 'warning' },
};

export default function AnunturiPage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('transparenta'), href: '/transparenta' },
        { label: t('anunturi') }
      ]} />
      <PageHeader titleKey="anunturi" icon="megaphone" />

      <Section background="white">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-3">
              {ANNOUNCEMENTS.map((ann) => (
                <Card key={ann.id} hover>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={CATEGORY_LABELS[ann.category].variant}>
                            {CATEGORY_LABELS[ann.category].label}
                          </Badge>
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(ann.date).toLocaleDateString('ro-RO')}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900">{ann.title}</h3>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 shrink-0" />
                    </div>
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

