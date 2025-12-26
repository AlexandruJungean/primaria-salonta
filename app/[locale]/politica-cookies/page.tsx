import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'footer' });
  return { 
    title: t('cookiePolicy'),
    description: 'Politica de cookies a site-ului Primăriei Municipiului Salonta'
  };
}

export default function PoliticaCookiesPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Politica de cookies' }]} />
      <PageHeader titleKey="cookiePolicy" namespace="footer" icon="fileText" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto prose prose-lg">
            <p className="lead">
              Ultima actualizare: Decembrie 2024
            </p>

            <h2>1. Ce sunt cookie-urile?</h2>
            <p>
              Cookie-urile sunt fișiere text de mici dimensiuni care sunt stocate pe dispozitivul 
              dumneavoastră atunci când vizitați un site web. Acestea permit site-ului să vă 
              recunoască și să rețină informații despre vizita dumneavoastră.
            </p>

            <h2>2. Tipuri de cookie-uri utilizate</h2>
            
            <h3>Cookie-uri esențiale</h3>
            <p>
              Aceste cookie-uri sunt necesare pentru funcționarea corectă a site-ului. 
              Fără acestea, site-ul nu ar putea funcționa corespunzător.
            </p>
            <ul>
              <li>Cookie-uri de sesiune</li>
              <li>Cookie-uri de preferință limbă</li>
              <li>Cookie-uri de accesibilitate</li>
            </ul>

            <h3>Cookie-uri de performanță</h3>
            <p>
              Acestea ne ajută să înțelegem cum folosesc vizitatorii site-ul, 
              permițându-ne să îmbunătățim experiența utilizatorilor.
            </p>

            <h3>Cookie-uri funcționale</h3>
            <p>
              Permit site-ului să rețină alegerile pe care le faceți 
              (cum ar fi limba sau regiunea) pentru a oferi funcții îmbunătățite.
            </p>

            <h2>3. Cookie-uri terță parte</h2>
            <p>
              Site-ul nostru poate include conținut de la terțe părți care pot seta 
              propriile cookie-uri, cum ar fi:
            </p>
            <ul>
              <li>Google Maps - pentru hărți interactive</li>
              <li>YouTube - pentru videoclipuri încorporate</li>
            </ul>

            <h2>4. Gestionarea cookie-urilor</h2>
            <p>
              Puteți controla și/sau șterge cookie-urile după preferință. Puteți șterge 
              toate cookie-urile care sunt deja pe dispozitivul dumneavoastră și puteți seta 
              majoritatea browserelor să împiedice plasarea acestora.
            </p>
            <p>
              Pentru mai multe informații despre gestionarea cookie-urilor în browserul dumneavoastră:
            </p>
            <ul>
              <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
              <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
              <li><a href="https://support.microsoft.com/en-us/help/17442" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
              <li><a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a></li>
            </ul>

            <h2>5. Consimțământ</h2>
            <p>
              Prin continuarea utilizării acestui site web, sunteți de acord cu utilizarea 
              cookie-urilor în conformitate cu această politică.
            </p>

            <h2>6. Contact</h2>
            <p>
              Pentru întrebări despre politica noastră de cookies, contactați-ne la: 
              primsal3@gmail.com
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}

