import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { WebPageJsonLd } from '@/lib/seo/json-ld';
import { type Locale } from '@/i18n/routing';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Eye, 
  Type, 
  Contrast, 
  Palette,
  Underline,
  BookOpen,
  Keyboard,
  Monitor,
  Mic,
  MousePointer2,
  Languages,
  FileText,
  Map,
  Video,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Settings,
  Mail,
  Phone,
  Building,
  ExternalLink,
  Accessibility
} from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'accesibilitate',
    locale: locale as Locale,
    path: '/accesibilitate',
  });
}

export default function AccesibilitatePage() {
  return (
    <>
      <WebPageJsonLd
        title="Accesibilitate"
        description="Declarație de accesibilitate a site-ului Primăriei Municipiului Salonta"
        url="/accesibilitate"
      />
      <Breadcrumbs items={[{ label: 'Accesibilitate' }]} />
      <PageHeader titleKey="accessibility" namespace="footer" icon="eye" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 mb-12">
              <div className="flex items-start gap-4">
                <div className="bg-primary rounded-xl p-3">
                  <Accessibility className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">Angajamentul nostru</h2>
                  <p className="text-lg text-muted-foreground">
                    Primăria Municipiului Salonta se angajează să asigure accesibilitatea digitală 
                    pentru toate persoanele, inclusiv cele cu dizabilități. Ne conformăm standardelor 
                    <strong> WCAG 2.1 nivel AA</strong> și respectăm <strong>HG 1259/2002</strong> privind 
                    accesibilitatea site-urilor web ale instituțiilor publice.
                  </p>
                </div>
              </div>
            </div>

            {/* Accessibility Features */}
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Settings className="h-6 w-6 text-primary" />
              Funcții de accesibilitate disponibile
            </h2>
            
            <p className="text-muted-foreground mb-6">
              Utilizați <strong>bara de accesibilitate</strong> din partea stângă a ecranului 
              (pictograma <Settings className="h-4 w-4 inline" />) pentru a activa aceste funcții:
            </p>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-12">
              <Card className="border-blue-200 hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Type className="h-5 w-5 text-blue-600" />
                    Mărire text
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Măriți sau micșorați dimensiunea textului până la 200% pentru o citire mai ușoară.
                </CardContent>
              </Card>

              <Card className="border-amber-200 hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Contrast className="h-5 w-5 text-amber-600" />
                    Contrast ridicat
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Activați modul contrast ridicat pentru o vizibilitate sporită a textului și elementelor.
                </CardContent>
              </Card>

              <Card className="border-gray-300 hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Palette className="h-5 w-5 text-gray-600" />
                    Tonuri de gri
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Transformați site-ul în tonuri de gri pentru persoanele cu daltonism sau sensibilitate la culori.
                </CardContent>
              </Card>

              <Card className="border-purple-200 hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Underline className="h-5 w-5 text-purple-600" />
                    Subliniere linkuri
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Subliniați toate linkurile pentru identificare rapidă și navigare mai ușoară.
                </CardContent>
              </Card>

              <Card className="border-green-200 hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-green-600" />
                    Font lizibil
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Activați un font special conceput pentru persoanele cu dislexie (OpenDyslexic).
                </CardContent>
              </Card>

              <Card className="border-orange-200 hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Keyboard className="h-5 w-5 text-orange-600" />
                    Navigare tastatură
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Navigați complet prin site folosind doar tastatura (Tab, Enter, săgeți).
                </CardContent>
              </Card>
            </div>

            {/* Multilingual Support */}
            <Card className="mb-12 border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Languages className="h-5 w-5 text-primary" />
                  Suport multilingv
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Site-ul este disponibil în <strong>3 limbi</strong> pentru a deservi comunitatea diversă din Salonta:
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    🇷🇴 Română (implicit)
                  </span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    🇭🇺 Magyar (Maghiară)
                  </span>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    🇬🇧 English (Engleză)
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Selectorul de limbă se află în partea dreaptă sus a paginii.
                </p>
              </CardContent>
            </Card>

            {/* Assistive Technologies */}
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Monitor className="h-6 w-6 text-primary" />
              Compatibilitate cu tehnologii asistive
            </h2>

            <div className="grid gap-4 md:grid-cols-2 mb-12">
              <Card>
                <CardContent className="pt-6 flex items-start gap-4">
                  <Eye className="h-8 w-8 text-blue-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Cititoare de ecran</h3>
                    <p className="text-sm text-muted-foreground">
                      Compatibil cu NVDA, JAWS, VoiceOver (macOS/iOS) și TalkBack (Android). 
                      Toate imaginile au text alternativ descriptiv.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 flex items-start gap-4">
                  <Monitor className="h-8 w-8 text-green-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Software de mărire</h3>
                    <p className="text-sm text-muted-foreground">
                      Site-ul funcționează corect cu ZoomText, MAGic și funcțiile 
                      de zoom ale sistemelor de operare (până la 400%).
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 flex items-start gap-4">
                  <Mic className="h-8 w-8 text-purple-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Recunoaștere vocală</h3>
                    <p className="text-sm text-muted-foreground">
                      Compatibil cu Dragon NaturallySpeaking și funcțiile de 
                      control vocal din Windows, macOS și mobile.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 flex items-start gap-4">
                  <MousePointer2 className="h-8 w-8 text-amber-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Dispozitive alternative</h3>
                    <p className="text-sm text-muted-foreground">
                      Suport pentru switch devices, eye trackers și alte 
                      dispozitive de intrare alternative.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Compliance Status */}
            <h2 className="text-2xl font-bold mb-6">Starea conformității</h2>

            <div className="space-y-4 mb-12">
              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-green-900">Conforme</h3>
                  <ul className="text-sm text-green-800 mt-1 space-y-1">
                    <li>• Structură semantică HTML5 corectă</li>
                    <li>• Ierarhie clară a titlurilor (H1-H6)</li>
                    <li>• Etichete ARIA pentru elemente interactive</li>
                    <li>• Navigare completă cu tastatura</li>
                    <li>• Contrast culori ≥ 4.5:1 pentru text normal</li>
                    <li>• Formulare cu etichete descriptive</li>
                    <li>• Focus vizibil pe elemente interactive</li>
                    <li>• Design responsive (mobil, tabletă, desktop)</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-amber-900">Limitări cunoscute</h3>
                  <ul className="text-sm text-amber-800 mt-1 space-y-1">
                    <li className="flex items-start gap-2">
                      <FileText className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <span><strong>Documente PDF:</strong> Unele documente mai vechi pot să nu fie complet accesibile. Contactați-ne pentru formate alternative.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Map className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <span><strong>Google Maps:</strong> Hărțile interactive pot avea limitări pentru cititorele de ecran.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Video className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <span><strong>Camere web live:</strong> Stream-urile video nu au subtitrări.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Keyboard Shortcuts */}
            <Card className="mb-12">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Keyboard className="h-5 w-5 text-primary" />
                  Scurtături de tastatură
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm">Salt la conținut principal</span>
                    <kbd className="px-2 py-1 bg-gray-200 rounded text-xs font-mono">Tab</kbd>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm">Navigare între secțiuni</span>
                    <kbd className="px-2 py-1 bg-gray-200 rounded text-xs font-mono">Tab / Shift+Tab</kbd>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm">Activare element focusat</span>
                    <kbd className="px-2 py-1 bg-gray-200 rounded text-xs font-mono">Enter</kbd>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm">Închidere meniuri/dialoguri</span>
                    <kbd className="px-2 py-1 bg-gray-200 rounded text-xs font-mono">Escape</kbd>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm">Navigare în meniuri</span>
                    <kbd className="px-2 py-1 bg-gray-200 rounded text-xs font-mono">↑ ↓ ← →</kbd>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm">Selectare opțiune</span>
                    <kbd className="px-2 py-1 bg-gray-200 rounded text-xs font-mono">Space</kbd>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feedback */}
            <h2 className="text-2xl font-bold mb-6">Feedback și suport</h2>
            
            <div className="grid gap-6 md:grid-cols-2 mb-12">
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-lg">Raportați o problemă de accesibilitate</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Dacă întâmpinați dificultăți în accesarea conținutului sau aveți sugestii 
                    de îmbunătățire, vă rugăm să ne contactați:
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>primsal@rdslink.ro, primsal3@gmail.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>0359-409730, 0359-409731, 0259-373243</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>Str. Republicii nr. 1, Salonta, 415500, Jud. Bihor</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Răspundem la solicitări în termen de <strong>5 zile lucrătoare</strong>.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Formate alternative</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Puteți solicita informații în formate alternative:
                  </p>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Documente în format text simplu
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Versiuni cu caractere mari
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Informații transmise telefonic
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Asistență la ghișeu (camera 11, parter)
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Update Info */}
            <div className="prose prose-lg prose-gray max-w-none">
              <h2>Legislație și standarde</h2>
              <ul>
                <li><strong>HG 1259/2002</strong> - Norme privind accesibilitatea site-urilor web ale instituțiilor publice</li>
                <li><strong>Directiva (UE) 2016/2102</strong> - Accesibilitatea site-urilor web și aplicațiilor mobile ale organismelor din sectorul public</li>
                <li><strong>WCAG 2.1</strong> - Web Content Accessibility Guidelines, nivel AA</li>
                <li><strong>Legea 448/2006</strong> - Protecția și promovarea drepturilor persoanelor cu handicap</li>
              </ul>

              <h2>Actualizări</h2>
              <p>
                Această declarație de accesibilitate a fost actualizată în <strong>Ianuarie 2026</strong>. 
                Revizuim periodic accesibilitatea site-ului și actualizăm această pagină în consecință.
              </p>
              <p>
                Ultima evaluare de accesibilitate: Ianuarie 2026
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

