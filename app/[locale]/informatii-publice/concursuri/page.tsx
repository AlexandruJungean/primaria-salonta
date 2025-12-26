import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { BadgeCheck, Calendar, MapPin, Download } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('concursuri') };
}

const JOBS = [
  { 
    id: 1, 
    title: 'Consilier juridic', 
    department: 'Serviciul Juridic', 
    deadline: '2026-01-15',
    status: 'activ'
  },
  { 
    id: 2, 
    title: 'Inspector urbanism', 
    department: 'Serviciul Urbanism', 
    deadline: '2025-12-30',
    status: 'activ'
  },
];

export default function ConcursuriPage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('informatiiPublice'), href: '/informatii-publice' },
        { label: t('concursuri') }
      ]} />
      <PageHeader titleKey="concursuri" icon="badgeCheck" />

      <Section background="white">
        <Container>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-gray-600 mb-8 text-center">
              Concursuri pentru ocuparea posturilor vacante în cadrul 
              Primăriei Municipiului Salonta.
            </p>

            {JOBS.length > 0 ? (
              <div className="space-y-4">
                {JOBS.map((job) => (
                  <Card key={job.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="success">Activ</Badge>
                          </div>
                          <h3 className="font-semibold text-lg text-gray-900">{job.title}</h3>
                          <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                            <MapPin className="w-4 h-4" />
                            {job.department}
                          </p>
                          <p className="text-sm text-primary-600 flex items-center gap-1 mt-1">
                            <Calendar className="w-4 h-4" />
                            Termen depunere: {new Date(job.deadline).toLocaleDateString('ro-RO')}
                          </p>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-primary-900 text-white rounded-lg hover:bg-primary-800 shrink-0">
                          <Download className="w-4 h-4" />
                          Detalii
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-gray-50">
                <CardContent className="text-center pt-8 pb-8">
                  <BadgeCheck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Momentan nu există concursuri active.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}

