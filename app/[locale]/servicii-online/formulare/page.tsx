import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Download, FileText } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('formulare') };
}

const FORMS = [
  { id: 1, title: 'Cerere tip pentru eliberare certificat de urbanism', category: 'Urbanism' },
  { id: 2, title: 'Cerere tip pentru autorizație de construire', category: 'Urbanism' },
  { id: 3, title: 'Declarație fiscală pentru clădiri persoane fizice', category: 'Taxe și impozite' },
  { id: 4, title: 'Declarație fiscală pentru terenuri persoane fizice', category: 'Taxe și impozite' },
  { id: 5, title: 'Cerere pentru ajutor de încălzire', category: 'Asistență socială' },
  { id: 6, title: 'Cerere pentru alocație de stat', category: 'Asistență socială' },
  { id: 7, title: 'Cerere înregistrare căsătorie', category: 'Stare civilă' },
  { id: 8, title: 'Cerere transcriere act stare civilă', category: 'Stare civilă' },
];

const CATEGORIES = [...new Set(FORMS.map(f => f.category))];

export default function FormularePage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('serviciiOnline'), href: '/servicii-online' },
        { label: t('formulare') }
      ]} />
      <PageHeader titleKey="formulare" icon="clipboardList" />

      <Section background="white">
        <Container>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-gray-600 mb-8 text-center">
              Descărcați formularele tipizate necesare pentru diverse solicitări 
              către Primăria Municipiului Salonta.
            </p>

            {CATEGORIES.map((category) => (
              <div key={category} className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">{category}</h2>
                <div className="space-y-3">
                  {FORMS.filter(f => f.category === category).map((form) => (
                    <Card key={form.id}>
                      <CardContent className="flex items-center justify-between pt-6">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-primary-600" />
                          <span className="text-gray-900">{form.title}</span>
                        </div>
                        <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary-900 text-white rounded-lg hover:bg-primary-800">
                          <Download className="w-4 h-4" />
                          PDF
                        </button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}

