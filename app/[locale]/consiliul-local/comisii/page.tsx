import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Briefcase, User } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { generatePageMetadata, BreadcrumbJsonLd } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'comisii',
    locale: locale as Locale,
    path: '/consiliul-local/comisii',
  });
}

// Mock data - will be replaced with database content
// Database tables: council_commissions, councilors, commission_members
// Admin can: create/edit/delete commissions, assign/remove members
const COMMISSIONS = [
  {
    name: 'Comisia pentru agricultură şi activităţi economico-financiare',
    color: 'bg-green-600',
    members: [
      'Bondár Zsolt',
      'Galea Marcel-Ioan',
      'Nan-Sajti Dániel',
      'Sala Răzvan-Sergiu',
      'Tornai Melinda',
    ],
  },
  {
    name: 'Comisia pentru amenajarea teritoriului şi urbanism, protecţia mediului şi turism',
    color: 'bg-blue-600',
    members: [
      'Blaj Cristian',
      'Cseke Sándor',
      'Horváth János',
      'Neaga Florica-Maria',
      'Szatmari Adrian',
      'Szőke-Sorean Éva',
      'Vigh József',
    ],
  },
  {
    name: 'Comisia juridică şi de disciplină',
    color: 'bg-purple-600',
    members: [
      'Galea Marcel-Ioan',
      'Szabó Sándor',
      'Szász Dénes-Albert',
    ],
  },
  {
    name: 'Comisia pentru activităţi social-culturale, culte, învăţământ, sănătate, familie, muncă, protecţie socială şi protecţia copilului',
    color: 'bg-orange-600',
    members: [
      'Gáll Éva',
      'Kiri Evelin',
      'Manciu Valentin-Iulian',
    ],
  },
];

export default function ComisiiPage() {
  const t = useTranslations('navigation');
  const tc = useTranslations('comisiiPage');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('consiliulLocal'), href: '/consiliul-local' },
        { label: t('comisii') }
      ]} />
      <PageHeader titleKey="comisii" icon="briefcase" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-600 mb-8 text-center">
              {tc('description')}
            </p>

            <div className="space-y-6">
              {COMMISSIONS.map((commission, idx) => (
                <Card key={idx} className="overflow-hidden">
                  <div className={`h-1.5 ${commission.color}`} />
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-lg ${commission.color} bg-opacity-10 flex items-center justify-center shrink-0`}>
                        <Briefcase className={`w-5 h-5 ${commission.color.replace('bg-', 'text-')}`} />
                      </div>
                      <h3 className="font-semibold text-gray-900 leading-snug">
                        {commission.name}
                      </h3>
                    </div>
                    
                    <div className="ml-13 grid sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {commission.members.map((member, mIdx) => (
                        <div
                          key={mIdx}
                          className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg"
                        >
                          <User className="w-4 h-4 text-gray-400 shrink-0" />
                          {member}
                        </div>
                      ))}
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
