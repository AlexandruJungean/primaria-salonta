import { getTranslations } from 'next-intl/server';
import { Wallet, Building2, Scale, GraduationCap, User, type LucideIcon } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { getCouncilCommissionsWithMembers } from '@/lib/supabase/services';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';

// Configurație pentru fiecare comisie - icon, culoare border și fundal
const COMMISSION_CONFIG: { icon: LucideIcon; borderColor: string; bgColor: string; iconColor: string }[] = [
  { icon: Wallet, borderColor: 'border-emerald-500', bgColor: 'bg-emerald-50', iconColor: 'text-emerald-600' },
  { icon: Building2, borderColor: 'border-blue-500', bgColor: 'bg-blue-50', iconColor: 'text-blue-600' },
  { icon: Scale, borderColor: 'border-violet-500', bgColor: 'bg-violet-50', iconColor: 'text-violet-600' },
  { icon: GraduationCap, borderColor: 'border-amber-500', bgColor: 'bg-amber-50', iconColor: 'text-amber-600' },
];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'comisii',
    locale: locale as Locale,
    path: '/consiliul-local/comisii',
  });
}

export default async function ComisiiPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('navigation');
  const tc = await getTranslations('comisiiPage');

  // Fetch commissions with members from database
  const commissions = await getCouncilCommissionsWithMembers();

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

            {commissions.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>Nu există comisii de specialitate momentan.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {commissions.map((commission, idx) => {
                  const config = COMMISSION_CONFIG[idx % COMMISSION_CONFIG.length];
                  const Icon = config.icon;
                  
                  return (
                    <Card key={commission.id} className={`overflow-hidden border-l-4 ${config.borderColor}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <div className={`w-12 h-12 rounded-full ${config.bgColor} flex items-center justify-center shrink-0`}>
                            <Icon className={`w-6 h-6 ${config.iconColor}`} />
                          </div>
                          <div className="pt-1">
                            <h3 className="font-semibold text-gray-900 leading-snug text-lg">
                              {commission.name}
                            </h3>
                            {commission.description && (
                              <p className="text-sm text-gray-500 mt-1">
                                {commission.description}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {commission.members && commission.members.length > 0 && (
                          <div className="ml-16 grid sm:grid-cols-2 md:grid-cols-3 gap-2">
                            {commission.members.map((member) => (
                              <div
                                key={member.id}
                                className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg"
                              >
                                <User className="w-4 h-4 text-gray-400 shrink-0" />
                                {member.name}
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
