import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { BookOpen, MapPin, Phone, Clock, Mail, Newspaper } from 'lucide-react';
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
    pageKey: 'biblioteca',
    locale: locale as Locale,
    path: '/institutii/biblioteca',
  });
}

export default function BibliotecaPage() {
  const t = useTranslations('navigation');

  const newspapers = [
    'Jurnalul Salontan',
    'Adevărul',
    'Crișana',
    'România Literară',
    'Formula AS',
    'Lumea Magazin',
    'Steaua (Cluj-Napoca)',
    'Familia (Oradea)',
    'Magazin Istoric',
    'Monitorul Oficial – partea I-a',
    'Revista Biblioteca'
  ];

  return (
    <>
      <Breadcrumbs items={[
        { label: t('institutii'), href: '/institutii' },
        { label: t('biblioteca') }
      ]} />
      <PageHeader titleKey="biblioteca" icon="bookOpen" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            {/* Contact Info */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="flex items-center gap-4 pt-6">
                  <MapPin className="w-5 h-5 text-amber-600 shrink-0" />
                  <span className="text-sm">P-ța Libertății nr. 4, 415500 Salonta</span>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center gap-4 pt-6">
                  <Phone className="w-5 h-5 text-amber-600 shrink-0" />
                  <span className="text-sm">0359-190900</span>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center gap-4 pt-6">
                  <Mail className="w-5 h-5 text-amber-600 shrink-0" />
                  <a href="mailto:biblsalonta@yahoo.com" className="text-sm text-amber-600 hover:underline">biblsalonta@yahoo.com</a>
                </CardContent>
              </Card>
              <Card className="bg-amber-50">
                <CardContent className="flex items-center gap-4 pt-6">
                  <Clock className="w-5 h-5 text-amber-600 shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium">L-V: 8:00 - 16:00</p>
                    <p>Sâmbătă: 8:00 - 12:00</p>
                    <p className="text-gray-500">Duminică închis</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* About */}
            <div className="prose prose-lg max-w-none mb-8">
              <h2>Despre Biblioteca Municipală Salonta</h2>
              <p>
                Biblioteca Municipală din Salonta oferă acces la o colecție vastă de cărți, 
                periodice și resurse pentru toate categoriile de vârstă.
              </p>

              <h2>Servicii</h2>
              <ul>
                <li>Împrumut de cărți la domiciliu</li>
                <li>Sală de lectură</li>
                <li>Acces la periodice și reviste</li>
                <li>Consultare fond documentar</li>
              </ul>

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

            {/* Newspapers and Magazines */}
            <Card>
              <CardHeader className="bg-amber-50">
                <CardTitle className="flex items-center gap-2">
                  <Newspaper className="w-5 h-5 text-amber-600" />
                  Ziare și reviste disponibile
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {newspapers.map((newspaper, index) => (
                    <div key={index} className="p-2 bg-gray-50 rounded text-sm text-gray-700">
                      {newspaper}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>
    </>
  );
}
