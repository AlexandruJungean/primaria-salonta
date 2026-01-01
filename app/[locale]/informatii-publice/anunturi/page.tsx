import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Megaphone, Calendar, Download, ExternalLink } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('anunturi') };
}

// Mock data - will be replaced with database
const ANNOUNCEMENTS = [
  {
    id: 1,
    date: '2025-12-15',
    title: 'Anunț privind programul de sărbători',
    category: 'general',
    hasDocument: true,
  },
  {
    id: 2,
    date: '2025-12-10',
    title: 'Anunț privind colectarea selectivă a deșeurilor',
    category: 'mediu',
    hasDocument: true,
  },
  {
    id: 3,
    date: '2025-12-05',
    title: 'Anunț privind lucrările de modernizare a străzilor',
    category: 'infrastructura',
    hasDocument: false,
  },
  {
    id: 4,
    date: '2025-11-28',
    title: 'Anunț privind acordarea ajutoarelor de încălzire',
    category: 'social',
    hasDocument: true,
  },
];

const CATEGORY_LABELS: Record<string, string> = {
  general: 'General',
  mediu: 'Mediu',
  infrastructura: 'Infrastructură',
  social: 'Social',
};

export default function AnunturiPage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('informatiiPublice'), href: '/informatii-publice' },
        { label: t('anunturi') }
      ]} />
      <PageHeader titleKey="anunturi" icon="megaphone" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {ANNOUNCEMENTS.map((announcement) => (
                <Card key={announcement.id} hover>
                  <CardContent className="flex items-center justify-between pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                        <Megaphone className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline">
                            {CATEGORY_LABELS[announcement.category]}
                          </Badge>
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(announcement.date).toLocaleDateString('ro-RO')}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900">{announcement.title}</h3>
                      </div>
                    </div>
                    {announcement.hasDocument ? (
                      <button className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                        <Download className="w-4 h-4" />
                        PDF
                      </button>
                    ) : (
                      <button className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                        <ExternalLink className="w-4 h-4" />
                        Detalii
                      </button>
                    )}
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

