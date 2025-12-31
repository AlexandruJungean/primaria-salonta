import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'footer' });
  return { 
    title: t('accessibility'),
    description: 'Declarație de accesibilitate a site-ului Primăriei Municipiului Salonta'
  };
}

export default function AccesibilitatePage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Accesibilitate' }]} />
      <PageHeader titleKey="accessibility" namespace="footer" icon="eye" />

      <Section background="white">
        <Container>
          <div className="prose prose-lg prose-gray max-w-5xl mx-auto">
            <p className="lead">
              Primăria Municipiului Salonta se angajează să asigure accesibilitatea digitală 
              pentru persoanele cu dizabilități.
            </p>

            <h2>Angajamentul nostru</h2>
            <p>
              Ne străduim să ne conformăm cu standardele WCAG 2.1 nivel AA pentru a face 
              site-ul nostru accesibil tuturor utilizatorilor, indiferent de abilități.
            </p>

            <h2>Funcții de accesibilitate</h2>
            <p>Site-ul nostru include următoarele funcții de accesibilitate:</p>
            <ul>
              <li><strong>Ajustarea dimensiunii textului</strong> - Puteți mări sau micșora textul</li>
              <li><strong>Mod contrast ridicat</strong> - Pentru o vizibilitate mai bună</li>
              <li><strong>Mod tonuri de gri</strong> - Pentru persoanele cu daltonism</li>
              <li><strong>Sublinierea linkurilor</strong> - Pentru identificarea ușoară a link-urilor</li>
              <li><strong>Font lizibil</strong> - Opțiune pentru font mai ușor de citit</li>
              <li><strong>Navigare cu tastatura</strong> - Site-ul poate fi navigat complet cu tastatura</li>
            </ul>

            <h2>Bara de accesibilitate</h2>
            <p>
              Utilizați bara de instrumente de accesibilitate din partea stângă a ecranului 
              (pictograma cu rotițe) pentru a personaliza experiența de vizualizare.
            </p>

            <h2>Compatibilitate cu tehnologiile asistive</h2>
            <p>Site-ul este conceput pentru a fi compatibil cu:</p>
            <ul>
              <li>Cititoare de ecran (screen readers)</li>
              <li>Software de mărire a ecranului</li>
              <li>Software de recunoaștere a vocii</li>
              <li>Dispozitive de intrare alternative</li>
            </ul>

            <h2>Limitări cunoscute</h2>
            <p>
              Deși ne străduim să asigurăm accesibilitatea completă, unele secțiuni ale 
              site-ului pot avea limitări:
            </p>
            <ul>
              <li>Documentele PDF mai vechi pot să nu fie complet accesibile</li>
              <li>Conținutul terț (hărți, videoclipuri) poate avea limitări de accesibilitate</li>
            </ul>

            <h2>Feedback și contact</h2>
            <p>
              Dacă întâmpinați probleme de accesibilitate sau aveți sugestii de îmbunătățire, 
              vă rugăm să ne contactați:
            </p>
            <ul>
              <li>Email: primsal3@gmail.com</li>
              <li>Telefon: +40 728 105 762</li>
              <li>Adresa: Str. Republicii nr. 1, Salonta, Bihor</li>
            </ul>
            <p>
              Vom încerca să răspundem la solicitări în termen de 5 zile lucrătoare.
            </p>

            <h2>Actualizări</h2>
            <p>
              Această declarație de accesibilitate a fost actualizată în Decembrie 2024. 
              Revizuim periodic accesibilitatea site-ului și actualizăm această pagină 
              în consecință.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}

