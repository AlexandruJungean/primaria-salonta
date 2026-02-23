import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { WebPageJsonLd } from '@/lib/seo/json-ld';
import { type Locale } from '@/i18n/routing';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cookie, Shield, Settings, Globe, Map, Video, ShieldCheck } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'politicaCookies',
    locale: locale as Locale,
    path: '/politica-cookies',
  });
}

export default function PoliticaCookiesPage() {
  return (
    <>
      <WebPageJsonLd
        title="Politica de Cookies"
        description="Politica de cookies a site-ului Primăriei Municipiului Salonta"
        url="/politica-cookies"
      />
      <Breadcrumbs items={[{ label: 'Politica de cookies' }]} />
      <PageHeader titleKey="cookiePolicy" namespace="footer" icon="fileText" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            <p className="text-lg text-muted-foreground mb-8">
              Ultima actualizare: Ianuarie 2026
            </p>

            <div className="prose prose-lg prose-gray max-w-none mb-12">
              <h2 className="flex items-center gap-2">
                <Cookie className="h-6 w-6 text-primary" />
                1. Ce sunt cookie-urile?
              </h2>
              <p>
                Cookie-urile sunt fișiere text de mici dimensiuni care sunt stocate pe dispozitivul 
                dumneavoastră (computer, tabletă, telefon mobil) atunci când vizitați un site web. 
                Acestea permit site-ului să vă recunoască și să rețină informații despre vizita 
                dumneavoastră, precum preferințele de limbă sau setările de accesibilitate.
              </p>
            </div>

            <h2 className="text-2xl font-bold mb-6">2. Cookie-uri utilizate pe salonta.net</h2>
            
            <div className="grid gap-6 md:grid-cols-2 mb-12">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    Cookie-uri Esențiale
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Necesare pentru funcționarea corectă a site-ului. Nu pot fi dezactivate.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="font-medium">NEXT_LOCALE</span>
                      <span className="text-muted-foreground">Preferință limbă (ro/hu/en)</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="font-medium">accessibility_settings</span>
                      <span className="text-muted-foreground">Setări accesibilitate</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="font-medium">cookie_consent</span>
                      <span className="text-muted-foreground">Consimțământ cookies</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="font-medium">__session</span>
                      <span className="text-muted-foreground">Sesiune utilizator</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-amber-600" />
                    Cookie-uri Funcționale
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Permit funcții îmbunătățite și personalizare.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="font-medium">theme</span>
                      <span className="text-muted-foreground">Temă vizuală</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="font-medium">font_size</span>
                      <span className="text-muted-foreground">Dimensiune text</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="font-medium">high_contrast</span>
                      <span className="text-muted-foreground">Mod contrast</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-purple-600" />
                    Cookie-uri de Securitate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Protejează formularele împotriva atacurilor automate.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="font-medium">_grecaptcha</span>
                      <span className="text-muted-foreground">Google reCAPTCHA v3</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="font-medium">rc::*</span>
                      <span className="text-muted-foreground">reCAPTCHA tokens</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="prose prose-lg prose-gray max-w-none mb-12">
              <h2 className="flex items-center gap-2">
                <Globe className="h-6 w-6 text-primary" />
                3. Cookie-uri terță parte
              </h2>
              <p>
                Site-ul nostru integrează servicii de la terțe părți care pot seta propriile cookie-uri:
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3 mb-12">
              <Card className="border-blue-200 bg-blue-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Map className="h-5 w-5 text-blue-600" />
                    Google Maps
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p className="mb-2">Utilizat pentru:</p>
                  <ul className="list-disc list-inside text-muted-foreground">
                    <li>Harta digitală interactivă</li>
                    <li>Localizarea instituțiilor</li>
                    <li>Direcții către Primărie</li>
                  </ul>
                  <a 
                    href="https://policies.google.com/privacy" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline mt-2 inline-block"
                  >
                    Politica Google →
                  </a>
                </CardContent>
              </Card>

              <Card className="border-red-200 bg-red-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Video className="h-5 w-5 text-red-600" />
                    YouTube / ipcamlive
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p className="mb-2">Utilizat pentru:</p>
                  <ul className="list-disc list-inside text-muted-foreground">
                    <li>Videoclipuri încorporate</li>
                    <li>Camere web live</li>
                    <li>Excursie virtuală</li>
                  </ul>
                  <a 
                    href="https://policies.google.com/privacy" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-red-600 hover:underline mt-2 inline-block"
                  >
                    Politica YouTube →
                  </a>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-green-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <ShieldCheck className="h-5 w-5 text-green-600" />
                    Google reCAPTCHA
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p className="mb-2">Utilizat pentru:</p>
                  <ul className="list-disc list-inside text-muted-foreground">
                    <li>Protecție formulare contact</li>
                    <li>Protecție petiții online</li>
                    <li>Prevenire spam</li>
                  </ul>
                  <a 
                    href="https://policies.google.com/privacy" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-green-600 hover:underline mt-2 inline-block"
                  >
                    Politica reCAPTCHA →
                  </a>
                </CardContent>
              </Card>
            </div>

            <div className="prose prose-lg prose-gray max-w-none">
              <h2>4. Gestionarea cookie-urilor</h2>
              <p>
                Puteți controla și/sau șterge cookie-urile după preferință. La prima vizită pe site, 
                vi se va afișa un banner de consimțământ unde puteți alege ce tipuri de cookie-uri acceptați.
              </p>
              <p>
                De asemenea, puteți gestiona cookie-urile din setările browserului dumneavoastră:
              </p>
              <ul>
                <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
                <li><a href="https://support.mozilla.org/ro/kb/activarea-si-dezactivarea-cookie-urilor" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
                <li><a href="https://support.microsoft.com/ro-ro/microsoft-edge/ștergerea-modulelor-cookie-în-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
                <li><a href="https://support.apple.com/ro-ro/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a></li>
              </ul>
              <p>
                <strong>Atenție:</strong> Dezactivarea cookie-urilor esențiale poate afecta funcționarea 
                site-ului, inclusiv preferințele de limbă și setările de accesibilitate.
              </p>

              <h2>5. Durata de stocare</h2>
              <table>
                <thead>
                  <tr>
                    <th>Tip cookie</th>
                    <th>Durată</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Cookie-uri de sesiune</td>
                    <td>Până la închiderea browserului</td>
                  </tr>
                  <tr>
                    <td>Preferință limbă</td>
                    <td>1 an</td>
                  </tr>
                  <tr>
                    <td>Setări accesibilitate</td>
                    <td>1 an</td>
                  </tr>
                  <tr>
                    <td>Consimțământ cookies</td>
                    <td>1 an</td>
                  </tr>
                  <tr>
                    <td>Google reCAPTCHA</td>
                    <td>6 luni</td>
                  </tr>
                </tbody>
              </table>

              <h2>6. Actualizări ale politicii</h2>
              <p>
                Ne rezervăm dreptul de a actualiza această politică de cookies. Orice modificări 
                vor fi publicate pe această pagină cu data actualizării revizuită.
              </p>

              <h2>7. Contact</h2>
              <p>
                Pentru întrebări despre politica noastră de cookies sau pentru a vă exercita 
                drepturile privind datele personale, contactați-ne:
              </p>
              <ul>
                <li><strong>Email:</strong> primsal@rdslink.ro, primsal3@gmail.com</li>
                <li><strong>Telefon:</strong> 0359-409730, 0359-409731, 0259-373243</li>
                <li><strong>Adresă:</strong> Str. Republicii nr. 1, Salonta, 415500, Jud. Bihor</li>
              </ul>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
