import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Bird, MapPin, Phone, Mail, Leaf, Users } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'cuibulDropiei',
    locale: locale as Locale,
    path: '/institutii/cuibul-dropiei',
  });
}

export default function CuibulDropieiPage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('institutii'), href: '/institutii' },
        { label: t('cuibulDropiei') }
      ]} />
      <PageHeader titleKey="cuibulDropiei" icon="bird" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            {/* Contact Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="flex items-center gap-4 pt-6">
                  <MapPin className="w-5 h-5 text-green-600 shrink-0" />
                  <span className="text-sm">Str. Aradului nr. 57, Salonta</span>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center gap-4 pt-6">
                  <Phone className="w-5 h-5 text-green-600 shrink-0" />
                  <span className="text-sm">0755 127 612</span>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center gap-4 pt-6">
                  <Leaf className="w-5 h-5 text-green-600 shrink-0" />
                  <span className="text-sm">Arie protejată</span>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center gap-4 pt-6">
                  <Bird className="w-5 h-5 text-green-600 shrink-0" />
                  <span className="text-sm">Conservarea dropiei</span>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="prose prose-lg max-w-none">
              <h2>Despre Centrul Cuibul Dropiei</h2>
              <p>
                Centrul Cuibul Dropia este situat pe strada Aradului, numărul 57, unde, pe lângă spațiile pentru relaxare și locul de joacă din cadrul centrului, vizitatorii pot pedala de-a lungul traseelor tematice și al lacului eutrof, până la turnul de observare, situat în mijlocul câmpului.
              </p>

              <h2>Misiune și Obiective</h2>
              <p>
                Principalul obiectiv al Cuibului Dropia este conservarea, protejarea și promovarea valorilor naturale, în special protejarea dropiei. Principalele activități vizează:
              </p>
              <ul>
                <li>Promovarea patrimoniului natural</li>
                <li>Conservarea naturii</li>
                <li>Turism</li>
                <li>Educație și conștientizare</li>
              </ul>

              <h2>Activități pentru Comunitate</h2>
              <p>
                Cuibul și-a depășit cu mult limitele obiectivelor de conservare. Prin activitățile desfășurate, prin proiecte educative îndrăznețe și bine puse la punct de personalul cuibului, toate îmbinate armonios cu bună dispoziție, activități recreative și practice, concursuri, spectacole, festivaluri, cursuri și serbări, Cuibul Dropia a devenit un al doilea cămin pentru sute de copii și tineri din cadrul comunității și din împrejurimi.
              </p>

              <h2>Educație Ecologică</h2>
              <p>
                Instruirea și educația ecologică este un proces de o complexitate deosebită. Acumularea cunoștințelor despre mediu, formarea deprinderilor și convingerilor necesității protejării mediului înconjurător în rândul copiilor și tinerilor sunt extrem de importante.
              </p>
              <p>
                La Cuibul Dropia, majoritatea activităților desfășurate în acest scop sunt îmbinate cu jocuri, vizionări de filme, ateliere de creație, concursuri, plimbări în natură, activități împreună cu familia, astfel încât asimilarea cunoștințelor privind protejarea mediului să fie una captivantă și eficientă.
              </p>
              <p>
                Astfel, Cuibul Dropiei a devenit un centru de atracție pentru comunitate, un loc unde copiii își pot exprima liber gândurile și emoțiile, un loc unde, pe lângă conștientizarea ecologică, pe prim plan sunt puse: familia, comunitatea, respectul, prietenia și, de ce nu, buna dispoziție.
              </p>
            </div>

            {/* Contact Section */}
            <Card className="mt-8 bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <Users className="w-5 h-5" />
                  Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-green-600 mt-1" />
                    <div>
                      <p className="font-medium">Stanca Gabriel – administrator</p>
                      <p className="text-sm text-gray-600">0755 127 612</p>
                      <a href="mailto:stancagabi79@yahoo.com" className="text-sm text-green-600 hover:underline">stancagabi79@yahoo.com</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-green-600 mt-1" />
                    <div>
                      <p className="font-medium">Bagi Maria</p>
                      <p className="text-sm text-gray-600">0770 640 985</p>
                      <a href="mailto:bagimaria44@gmail.com" className="text-sm text-green-600 hover:underline">bagimaria44@gmail.com</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-green-600 mt-1" />
                    <div>
                      <p className="font-medium">Cotuț Mădălina</p>
                      <p className="text-sm text-gray-600">0770 697 923</p>
                      <a href="mailto:puscaumadalina@gmail.com" className="text-sm text-green-600 hover:underline">puscaumadalina@gmail.com</a>
                    </div>
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
