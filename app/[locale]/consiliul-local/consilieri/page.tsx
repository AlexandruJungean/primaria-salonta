import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Users, User, Mail, Phone } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('consilieriLocali') };
}

// Mock data - will be replaced with Supabase
const COUNCILORS = [
  { name: 'Consilier 1', party: 'UDMR', email: 'consilier1@primaria-salonta.ro' },
  { name: 'Consilier 2', party: 'UDMR', email: 'consilier2@primaria-salonta.ro' },
  { name: 'Consilier 3', party: 'PNL', email: 'consilier3@primaria-salonta.ro' },
  { name: 'Consilier 4', party: 'PNL', email: 'consilier4@primaria-salonta.ro' },
  { name: 'Consilier 5', party: 'PSD', email: 'consilier5@primaria-salonta.ro' },
  { name: 'Consilier 6', party: 'PSD', email: 'consilier6@primaria-salonta.ro' },
  { name: 'Consilier 7', party: 'UDMR', email: 'consilier7@primaria-salonta.ro' },
  { name: 'Consilier 8', party: 'UDMR', email: 'consilier8@primaria-salonta.ro' },
  { name: 'Consilier 9', party: 'PNL', email: 'consilier9@primaria-salonta.ro' },
];

const PARTY_COLORS: Record<string, 'default' | 'success' | 'warning' | 'secondary'> = {
  'UDMR': 'success',
  'PNL': 'warning',
  'PSD': 'default',
};

export default function ConsilieriPage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('consiliulLocal'), href: '/consiliul-local' },
        { label: t('consilieriLocali') }
      ]} />
      <PageHeader titleKey="consilieriLocali" icon="users" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            <p className="text-lg text-gray-600 mb-8 text-center">
              Consiliul Local al Municipiului Salonta este format din 
              {COUNCILORS.length} consilieri locali aleși pentru mandatul 2020-2024.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {COUNCILORS.map((councilor, idx) => (
                <Card key={idx}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                        <User className="w-6 h-6 text-gray-400" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{councilor.name}</h3>
                        <Badge variant={PARTY_COLORS[councilor.party] || 'default'} className="mt-1">
                          {councilor.party}
                        </Badge>
                        <a 
                          href={`mailto:${councilor.email}`}
                          className="flex items-center gap-1 text-xs text-gray-500 mt-2 hover:text-primary-600"
                        >
                          <Mail className="w-3 h-3" />
                          <span className="truncate">{councilor.email}</span>
                        </a>
                      </div>
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

