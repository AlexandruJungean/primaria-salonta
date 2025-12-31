import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { ShieldCheck, Mail, User } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('gdpr') };
}

export default function GdprPage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('informatiiPublice'), href: '/informatii-publice' },
        { label: t('gdpr') }
      ]} />
      <PageHeader titleKey="gdpr" icon="shieldCheck" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto prose prose-lg">
            <h2>Protecția datelor cu caracter personal</h2>
            <p>
              Primăria Municipiului Salonta prelucrează date cu caracter personal 
              în conformitate cu Regulamentul (UE) 2016/679 (GDPR) și legislația 
              națională în vigoare.
            </p>

            <h2>Drepturile persoanelor vizate</h2>
            <p>Aveți următoarele drepturi:</p>
            <ul>
              <li>Dreptul de acces la date</li>
              <li>Dreptul la rectificarea datelor</li>
              <li>Dreptul la ștergerea datelor (&quot;dreptul de a fi uitat&quot;)</li>
              <li>Dreptul la restricționarea prelucrării</li>
              <li>Dreptul la portabilitatea datelor</li>
              <li>Dreptul la opoziție</li>
            </ul>

            <h2>Responsabil cu protecția datelor (DPO)</h2>
            <div className="not-prose">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                      <User className="w-6 h-6 text-primary-700" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Responsabil DPO</h4>
                      <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                        <Mail className="w-4 h-4" />
                        dpo@primaria-salonta.ro
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <h2 className="mt-8">Exercitarea drepturilor</h2>
            <p>
              Pentru exercitarea drepturilor prevăzute de GDPR, puteți depune 
              o cerere la sediul Primăriei sau prin email la adresa DPO.
            </p>

            <h2>Autoritatea de supraveghere</h2>
            <p>
              Aveți dreptul să depuneți plângere la Autoritatea Națională de 
              Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP).
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}

