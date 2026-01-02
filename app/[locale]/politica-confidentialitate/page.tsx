import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { WebPageJsonLd } from '@/lib/seo/json-ld';
import { type Locale } from '@/i18n/routing';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Shield, 
  FileText, 
  Users, 
  Clock, 
  Scale, 
  Eye, 
  Pencil, 
  Trash2, 
  Lock, 
  Download, 
  AlertTriangle,
  Building,
  Mail,
  Phone,
  ExternalLink
} from 'lucide-react';
import { Link } from '@/i18n/navigation';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'politicaConfidentialitate',
    locale: locale as Locale,
    path: '/politica-confidentialitate',
  });
}

export default function PoliticaConfidentialitatePage() {
  return (
    <>
      <WebPageJsonLd
        title="Politica de Confidențialitate"
        description="Politica de confidențialitate a Primăriei Municipiului Salonta"
        url="/politica-confidentialitate"
      />
      <Breadcrumbs items={[{ label: 'Politica de confidențialitate' }]} />
      <PageHeader titleKey="privacyPolicy" namespace="footer" icon="shieldCheck" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            <p className="text-lg text-muted-foreground mb-8">
              Ultima actualizare: Ianuarie 2026
            </p>

            {/* Introduction */}
            <div className="prose prose-lg prose-gray max-w-none mb-12">
              <h2 className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                1. Introducere
              </h2>
              <p>
                Primăria Municipiului Salonta, cu sediul în Str. Republicii nr. 1, Salonta, 
                Jud. Bihor, cod poștal 415500, în calitate de operator de date cu caracter personal, 
                respectă și protejează confidențialitatea datelor dumneavoastră în conformitate cu 
                Regulamentul (UE) 2016/679 (GDPR) și Legea nr. 190/2018.
              </p>
              <p>
                Această politică de confidențialitate descrie modul în care colectăm, utilizăm, 
                stocăm și protejăm informațiile dumneavoastră personale atunci când utilizați 
                site-ul nostru web <strong>salonta.ro</strong> și serviciile online oferite.
              </p>
            </div>

            {/* Data Categories */}
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              2. Date colectate prin intermediul site-ului
            </h2>

            <p className="text-muted-foreground mb-6">
              Prin intermediul site-ului <strong>salonta.ro</strong> colectăm exclusiv următoarele categorii de date:
            </p>
            
            <div className="grid gap-4 md:grid-cols-2 mb-12">
              <Card className="border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Mail className="h-4 w-4 text-blue-600" />
                    Formular de contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <ul className="space-y-1">
                    <li>• Nume și prenume</li>
                    <li>• Adresa de email</li>
                    <li>• Număr de telefon (opțional)</li>
                    <li>• Subiectul și conținutul mesajului</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="h-4 w-4 text-green-600" />
                    Petiții online
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <ul className="space-y-1">
                    <li>• Nume și prenume</li>
                    <li>• Adresa de email</li>
                    <li>• Număr de telefon (opțional)</li>
                    <li>• Adresa de corespondență</li>
                    <li>• Conținutul petiției</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-amber-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    Raportare probleme
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <ul className="space-y-1">
                    <li>• Nume și prenume</li>
                    <li>• Adresa de email</li>
                    <li>• Descrierea problemei</li>
                    <li>• Locația problemei</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-purple-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Eye className="h-4 w-4 text-purple-600" />
                    Date tehnice (automat)
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <ul className="space-y-1">
                    <li>• Preferințe de limbă (cookie)</li>
                    <li>• Setări de accesibilitate (localStorage)</li>
                    <li>• Date anonimizate de utilizare (Analytics)</li>
                  </ul>
                  <p className="mt-2 text-xs">
                    Datele tehnice sunt stocate local pe dispozitivul dvs. sau sunt anonimizate.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-12">
              <p className="text-sm text-blue-800">
                <strong>Notă:</strong> Date precum CNP, serie/număr act de identitate sau alte documente 
                oficiale sunt colectate exclusiv la ghișeele Primăriei pentru serviciile care necesită 
                prezența fizică. Site-ul <strong>nu</strong> colectează astfel de date sensibile.
              </p>
            </div>

            {/* Processing Purposes */}
            <div className="prose prose-lg prose-gray max-w-none mb-12">
              <h2 className="flex items-center gap-2">
                <Scale className="h-6 w-6 text-primary" />
                3. Scopurile și temeiul legal al prelucrării
              </h2>
              
              <table>
                <thead>
                  <tr>
                    <th>Scop</th>
                    <th>Temei legal (GDPR)</th>
                    <th>Date prelucrate</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Răspuns la mesaje din formularul de contact</td>
                    <td>Art. 6(1)(e) - Interes public</td>
                    <td>Nume, email, telefon, mesaj</td>
                  </tr>
                  <tr>
                    <td>Soluționarea petițiilor online (OG 27/2002)</td>
                    <td>Art. 6(1)(c) - Obligație legală</td>
                    <td>Nume, email, adresă, conținut</td>
                  </tr>
                  <tr>
                    <td>Raportări probleme infrastructură</td>
                    <td>Art. 6(1)(e) - Interes public</td>
                    <td>Nume, email, locație, descriere</td>
                  </tr>
                  <tr>
                    <td>Statistici și îmbunătățire site</td>
                    <td>Art. 6(1)(a) - Consimțământ</td>
                    <td>Date tehnice (anonimizate)</td>
                  </tr>
                  <tr>
                    <td>Salvare preferințe utilizator</td>
                    <td>Art. 6(1)(a) - Consimțământ</td>
                    <td>Limbă, setări accesibilitate</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Storage Duration */}
            <div className="prose prose-lg prose-gray max-w-none mb-12">
              <h2 className="flex items-center gap-2">
                <Clock className="h-6 w-6 text-primary" />
                4. Durata stocării datelor
              </h2>
              <p>
                Datele colectate prin intermediul site-ului sunt stocate pentru perioade limitate:
              </p>
              <ul>
                <li><strong>Mesaje contact:</strong> 1 an de la soluționare</li>
                <li><strong>Petiții online:</strong> 5 ani de la soluționare (conform OG 27/2002)</li>
                <li><strong>Raportări probleme:</strong> 1 an de la soluționare</li>
                <li><strong>Preferințe limbă (cookie):</strong> 1 an</li>
                <li><strong>Setări accesibilitate (localStorage):</strong> Până la ștergerea manuală</li>
                <li><strong>Date Analytics:</strong> Maximum 2 ani (anonimizate)</li>
              </ul>
              <p>
                După expirarea termenelor, datele sunt șterse automat din sistemele noastre.
              </p>
            </div>

            {/* Your Rights */}
            <h2 className="text-2xl font-bold mb-6">5. Drepturile dumneavoastră</h2>
            
            <div className="grid gap-4 md:grid-cols-3 mb-12">
              <Card className="border-blue-200">
                <CardContent className="pt-6">
                  <Eye className="h-8 w-8 text-blue-600 mb-3" />
                  <h3 className="font-semibold mb-2">Dreptul de acces</h3>
                  <p className="text-sm text-muted-foreground">
                    Puteți solicita confirmarea și o copie a datelor personale pe care le prelucrăm.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardContent className="pt-6">
                  <Pencil className="h-8 w-8 text-green-600 mb-3" />
                  <h3 className="font-semibold mb-2">Dreptul la rectificare</h3>
                  <p className="text-sm text-muted-foreground">
                    Puteți cere corectarea datelor inexacte sau completarea celor incomplete.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardContent className="pt-6">
                  <Trash2 className="h-8 w-8 text-red-600 mb-3" />
                  <h3 className="font-semibold mb-2">Dreptul la ștergere</h3>
                  <p className="text-sm text-muted-foreground">
                    Puteți cere ștergerea datelor când nu mai sunt necesare scopului inițial.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-amber-200">
                <CardContent className="pt-6">
                  <Lock className="h-8 w-8 text-amber-600 mb-3" />
                  <h3 className="font-semibold mb-2">Dreptul la restricționare</h3>
                  <p className="text-sm text-muted-foreground">
                    Puteți cere limitarea prelucrării în anumite circumstanțe.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-purple-200">
                <CardContent className="pt-6">
                  <Download className="h-8 w-8 text-purple-600 mb-3" />
                  <h3 className="font-semibold mb-2">Dreptul la portabilitate</h3>
                  <p className="text-sm text-muted-foreground">
                    Puteți primi datele într-un format structurat, utilizat uzual.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-orange-200">
                <CardContent className="pt-6">
                  <AlertTriangle className="h-8 w-8 text-orange-600 mb-3" />
                  <h3 className="font-semibold mb-2">Dreptul de opoziție</h3>
                  <p className="text-sm text-muted-foreground">
                    Vă puteți opune prelucrării bazate pe interese legitime.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-12">
              <h3 className="font-semibold text-blue-900 mb-2">
                Cum vă exercitați drepturile?
              </h3>
              <p className="text-blue-800 text-sm mb-4">
                Pentru a vă exercita oricare dintre aceste drepturi, puteți utiliza formularele 
                disponibile pe site-ul nostru sau contactați-ne direct:
              </p>
              <Link 
                href="/informatii-publice/gdpr" 
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                Accesați formularele GDPR
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>

            {/* Security */}
            <div className="prose prose-lg prose-gray max-w-none mb-12">
              <h2 className="flex items-center gap-2">
                <Lock className="h-6 w-6 text-primary" />
                6. Securitatea datelor
              </h2>
              <p>
                Implementăm măsuri tehnice și organizatorice adecvate pentru protejarea datelor:
              </p>
              <ul>
                <li><strong>Criptare SSL/TLS:</strong> Toate comunicațiile sunt criptate</li>
                <li><strong>Acces restricționat:</strong> Doar personalul autorizat are acces</li>
                <li><strong>Monitorizare:</strong> Sistemele sunt monitorizate pentru activități suspecte</li>
                <li><strong>Backup:</strong> Copii de siguranță regulate</li>
                <li><strong>Formare personal:</strong> Instruire periodică privind protecția datelor</li>
              </ul>
            </div>

            {/* Transfers */}
            <div className="prose prose-lg prose-gray max-w-none mb-12">
              <h2>7. Transferuri de date</h2>
              <p>
                Datele dumneavoastră pot fi partajate cu:
              </p>
              <ul>
                <li>Alte instituții publice (când legea o impune)</li>
                <li>Prestatori de servicii IT (cu acorduri de confidențialitate)</li>
                <li>Autorități de control (la solicitare legală)</li>
              </ul>
              <p>
                Nu transferăm date în afara Spațiului Economic European fără garanții adecvate.
              </p>
            </div>

            {/* Contact Section */}
            <div className="grid gap-6 md:grid-cols-2 mb-12">
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-primary" />
                    Contact Operator
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p className="font-medium">Primăria Municipiului Salonta</p>
                  <div className="flex items-start gap-2">
                    <Building className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <span>Str. Republicii nr. 1, Salonta, 415500, Jud. Bihor</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>0359-409730, 0359-409731, 0259-373243</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>primsal@rdslink.ro, primsal3@gmail.com</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-amber-200 bg-amber-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-amber-600" />
                    Responsabil Protecția Datelor (DPO)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p className="text-muted-foreground">
                    Pentru întrebări specifice privind protecția datelor, contactați DPO:
                  </p>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>primsal@rdslink.ro</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    (Dispoziția nr. 208/2018 privind desemnarea DPO)
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Supervisory Authority */}
            <div className="prose prose-lg prose-gray max-w-none">
              <h2>8. Autoritatea de Supraveghere</h2>
              <p>
                Dacă considerați că drepturile dumneavoastră au fost încălcate, puteți depune 
                o plângere la:
              </p>
              <div className="bg-gray-100 p-4 rounded-lg not-prose">
                <p className="font-semibold">
                  Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP)
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  B-dul G-ral. Gheorghe Magheru 28-30, Sector 1, București, cod poștal 010336
                </p>
                <p className="text-sm mt-1">
                  Website: <a href="https://www.dataprotection.ro" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.dataprotection.ro</a>
                </p>
                <p className="text-sm">
                  Email: <a href="mailto:anspdcp@dataprotection.ro" className="text-primary hover:underline">anspdcp@dataprotection.ro</a>
                </p>
              </div>

              <h2 className="mt-8">9. Actualizări ale politicii</h2>
              <p>
                Această politică poate fi actualizată periodic. Modificările semnificative vor fi 
                comunicate prin intermediul site-ului. Vă recomandăm să verificați periodic această pagină.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

