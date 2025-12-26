import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { BookOpen, MapPin, Phone, Clock, Book, Users } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('biblioteca') };
}

export default function BibliotecaPage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('institutii'), href: '/institutii' },
        { label: t('biblioteca') }
      ]} />
      <PageHeader titleKey="biblioteca" icon="bookOpen" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardContent className="flex items-center gap-4 pt-6">
                  <MapPin className="w-5 h-5 text-primary-600 shrink-0" />
                  <span className="text-sm">Str. Republicii, Salonta</span>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center gap-4 pt-6">
                  <Phone className="w-5 h-5 text-primary-600 shrink-0" />
                  <span className="text-sm">0259 373 XXX</span>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center gap-4 pt-6">
                  <Clock className="w-5 h-5 text-primary-600 shrink-0" />
                  <span className="text-sm">Luni - Vineri: 8:00 - 18:00</span>
                </CardContent>
              </Card>
            </div>

            <div className="prose prose-lg">
              <h2>Despre Bibliotecă</h2>
              <p>
                Biblioteca Municipală &quot;Teodor Neș&quot; din Salonta oferă acces la 
                o colecție vastă de cărți, periodice și resurse digitale pentru 
                toate categoriile de vârstă.
              </p>

              <h2>Servicii</h2>
              <div className="grid md:grid-cols-2 gap-4 not-prose mb-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <Book className="w-5 h-5 text-primary-600 mt-1" />
                      <div>
                        <h4 className="font-semibold">Împrumut de cărți</h4>
                        <p className="text-sm text-gray-600">Acces la mii de volume pentru împrumut la domiciliu.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-primary-600 mt-1" />
                      <div>
                        <h4 className="font-semibold">Sală de lectură</h4>
                        <p className="text-sm text-gray-600">Spațiu dedicat studiului și cercetării.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <h2>Colecții</h2>
              <ul>
                <li>Literatură română și universală</li>
                <li>Literatură maghiară</li>
                <li>Carte pentru copii</li>
                <li>Periodice și reviste</li>
                <li>Fond documentar local</li>
              </ul>

              <h2>Înscriere</h2>
              <p>
                Înscrierea la bibliotecă se face pe baza actului de identitate. 
                Membrii beneficiază de acces gratuit la toate serviciile bibliotecii.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

