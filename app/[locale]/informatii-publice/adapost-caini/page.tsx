import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Dog, Phone, MapPin, Clock, Heart } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('adapostCaini') };
}

export default function AdapostCainiPage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('informatiiPublice'), href: '/informatii-publice' },
        { label: t('adapostCaini') }
      ]} />
      <PageHeader titleKey="adapostCaini" icon="dog" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary-600" />
                    Locație
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Adăpostul pentru câini comunitari este situat în Salonta.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary-600" />
                    Program
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Luni - Vineri: 8:00 - 16:00<br />
                    Sâmbătă - Duminică: Închis
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-primary-600" />
                    Contact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Telefon: 0359-409730<br />
                    Email: primsal3@gmail.com
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    Adopție
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Pentru adopție, vă rugăm să ne contactați la numerele de telefon de mai sus.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Dog className="w-8 h-8 text-amber-600 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-amber-800 mb-2">Raportează un câine fără stăpân</h3>
                    <p className="text-amber-700 text-sm">
                      Dacă observați câini comunitari care reprezintă un pericol sau care au nevoie de ajutor,
                      vă rugăm să ne contactați la numărul de telefon 0359-409730.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>
    </>
  );
}

