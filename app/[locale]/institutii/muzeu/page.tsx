import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Landmark, MapPin, Phone, Clock, Mail, User } from 'lucide-react';
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
    pageKey: 'muzeu',
    locale: locale as Locale,
    path: '/institutii/muzeu',
  });
}

export default function MuzeuPage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('institutii'), href: '/institutii' },
        { label: t('muzeu') }
      ]} />
      <PageHeader titleKey="muzeu" icon="landmark" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            {/* Muzeul Memorial Arany János */}
            <Card className="mb-8">
              <CardHeader className="bg-amber-50">
                <CardTitle className="text-xl text-amber-900">Muzeul Memorial „Arany János"</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="prose prose-sm">
                    <p>
                      Muzeul Memorial „Arany János" este găzduit în cea mai veche clădire din Salonta, Turnul Ciunt. Principele Transilvaniei, întemeietorul orașului, Bocskai István a adus în Salonta 300 de haidoni, ei au construit turnul.
                    </p>
                    <p>
                      Turnul, ridicat în anul 1636, a avut rol dublu: a întărit vechea cetate și a fost punct de veghe, pentru observarea ușoară a dușmanilor care se apropiau. Numele „Ciunt" i-a fost dat după un incendiu, în urma căruia pe timp de 250 de ani a rămas fără acoperiș. În 1899 a devenit „casa" lui Arany János.
                    </p>
                    <p>
                      Cu ocazia bicentenarului de la nașterea marelui poet, s-a început renovarea clădirii și a întregii colecții, cu sprijinul Muzeului Literar Petőfi din Budapesta. În 2018 s-a deschis noua expoziție în fața vizitatorilor.
                    </p>
                    <ul>
                      <li><strong>Parter:</strong> introducere în istoria orașului Salonta</li>
                      <li><strong>Etajul I:</strong> viața marelui poet, Arany János</li>
                      <li><strong>Etajul II:</strong> galerie de artă cu portrete și tablouri</li>
                      <li><strong>Etajul III:</strong> atmosfera din casa și biroul poetului</li>
                      <li><strong>Etajul IV:</strong> jucării și priveliște panoramică</li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <Card className="bg-amber-50">
                      <CardContent className="pt-4 space-y-3">
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-amber-600" />
                          <div className="text-sm">
                            <p><strong>1 oct – 31 mar:</strong> Marți – Duminică: 10:00 – 16:00</p>
                            <p><strong>1 apr – 30 sep:</strong> Marți – Duminică: 10:00 – 18:00</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-amber-600" />
                          <span className="text-sm">Piața Libertății nr. 4, 415500, Salonta</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-amber-600" />
                          <span className="text-sm">0259-371157</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-amber-600" />
                          <a href="mailto:aranymuzeumnagyszalonta@gmail.com" className="text-sm text-amber-700 hover:underline">aranymuzeumnagyszalonta@gmail.com</a>
                        </div>
                        <div className="flex items-center gap-3">
                          <User className="w-5 h-5 text-amber-600" />
                          <span className="text-sm"><strong>Manager:</strong> Gali Boglárka</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Casa memorială Arany János */}
            <Card className="mb-8">
              <CardHeader className="bg-blue-50">
                <CardTitle className="text-xl text-blue-900">Casa memorială „Arany János"</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="prose prose-sm">
                    <p>
                      Al zecelea copil din familie, cel mai mare poet epic maghiar, Arany János, s-a născut în data de 2 martie 1817, într-o casă cu pereții văruiți și acoperiș de stuf. La vârsta de 3-4 ani, a învățat de la tatăl său să scrie, să citească, dar de la el a auzit și poveștile despre vitejia lui Toldi Miklós.
                    </p>
                    <p>
                      Casa a suferit un incendiu în anul 1823. Atunci a fost reconstruită, dar din păcate nici acea clădire nu s-a păstrat până în prezent. Doar fântâna cu cumpănă a rămas aceeași. În urma ultimei renovări, casa a redobândit caracteristicile specifice epocii poetului.
                    </p>
                    <p>
                      Casa memorială reprezintă un muzeu etnografic, găzduind ustensile și obiecte folosite zi de zi, pe vremea aceea, de oamenii salontani. Atmosfera prezentată redă perfect modelul locuințelor din era poetului Arany János.
                    </p>
                    <p className="text-blue-700 font-medium">
                      Casa Memorială se poate vizita cu programare.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <Card className="bg-blue-50">
                      <CardContent className="pt-4 space-y-3">
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-blue-600" />
                          <span className="text-sm">Str. Arany János nr. 46, 415500, Salonta</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-blue-600" />
                          <span className="text-sm">0259-371157</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-blue-600" />
                          <a href="mailto:aranymuzeumnagyszalonta@gmail.com" className="text-sm text-blue-700 hover:underline">aranymuzeumnagyszalonta@gmail.com</a>
                        </div>
                        <div className="flex items-center gap-3">
                          <User className="w-5 h-5 text-blue-600" />
                          <span className="text-sm"><strong>Manager:</strong> Gali Boglárka</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Muzeul Țăranului Român */}
            <Card className="mb-8">
              <CardHeader className="bg-green-50">
                <CardTitle className="text-xl text-green-900">Muzeul Țăranului Român</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="prose prose-sm">
                    <p>
                      Muzeul etnografic din Parcul Maria și-a primit colecția de la comuna Roșia, locuită de români, în apropiere de Beiuș. Majoritatea celor care locuiesc în acest cartier al orașului, pe terenul așa numitelor colonii, au venit în Salonta din jurul Beiușului (Ferice, Saud, Budureasa) după reforma agrară din 1927. Astfel muzeul reprezintă o legătură a locuitorilor cartierului cu zona lor natală.
                    </p>
                    <p>
                      Colecția este prezentată într-o casă de 170 de ani, transpusă pe locația din Salonta de meșterul orădean Viorel Lascu. Cele două încăperi au fost decorate în stilul tradițional beiușean, cu mobilier vechi, obiecte de uz casnic, textile, perne și plăpumi tradiționale, făcute de meșteri populari români.
                    </p>
                    <p>
                      În anul 2011 a fost mutată și o șură lângă muzeu, tot din munții Beiușului, în anul 2014 urmată de o biserică tradițională de lemn.
                    </p>
                    <p className="text-green-700 font-medium">
                      Muzeul etnografic se poate vizita cu programare.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <Card className="bg-green-50">
                      <CardContent className="pt-4 space-y-3">
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-green-600" />
                          <span className="text-sm">Str. Avram Iancu nr. 26, 415500, Salonta</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-green-600" />
                          <span className="text-sm">0259-371157</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-green-600" />
                          <a href="mailto:aranymuzeumnagyszalonta@gmail.com" className="text-sm text-green-700 hover:underline">aranymuzeumnagyszalonta@gmail.com</a>
                        </div>
                        <div className="flex items-center gap-3">
                          <User className="w-5 h-5 text-green-600" />
                          <span className="text-sm"><strong>Manager:</strong> Gali Boglárka</span>
                        </div>
                      </CardContent>
                    </Card>
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
