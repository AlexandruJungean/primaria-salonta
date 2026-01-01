import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'footer' });
  return { 
    title: t('privacyPolicy'),
    description: 'Politica de confidențialitate a Primăriei Municipiului Salonta'
  };
}

export default function PoliticaConfidentialitatePage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Politica de confidențialitate' }]} />
      <PageHeader titleKey="privacyPolicy" namespace="footer" icon="shieldCheck" />

      <Section background="white">
        <Container>
          <div className="prose prose-lg prose-gray max-w-5xl mx-auto">
            <p className="lead">
              Ultima actualizare: Decembrie 2024
            </p>

            <h2>1. Introducere</h2>
            <p>
              Primăria Municipiului Salonta respectă confidențialitatea datelor dumneavoastră personale. 
              Această politică de confidențialitate descrie modul în care colectăm, utilizăm și protejăm 
              informațiile dumneavoastră personale.
            </p>

            <h2>2. Date colectate</h2>
            <p>Putem colecta următoarele tipuri de informații:</p>
            <ul>
              <li>Informații de identificare: nume, prenume, CNP (când este necesar)</li>
              <li>Informații de contact: adresă, telefon, email</li>
              <li>Informații despre solicitări și petiții</li>
              <li>Informații tehnice: adresa IP, tipul de browser (pentru îmbunătățirea site-ului)</li>
            </ul>

            <h2>3. Scopul prelucrării</h2>
            <p>Datele dumneavoastră sunt prelucrate pentru:</p>
            <ul>
              <li>Soluționarea cererilor și petițiilor</li>
              <li>Furnizarea serviciilor publice</li>
              <li>Comunicarea oficială</li>
              <li>Îmbunătățirea serviciilor noastre</li>
              <li>Respectarea obligațiilor legale</li>
            </ul>

            <h2>4. Temeiul legal</h2>
            <p>
              Prelucrarea datelor se realizează în conformitate cu Regulamentul (UE) 2016/679 (GDPR) 
              și Legea nr. 190/2018, pe baza următoarelor temeiuri:
            </p>
            <ul>
              <li>Îndeplinirea unei obligații legale</li>
              <li>Executarea unei sarcini de interes public</li>
              <li>Consimțământul dumneavoastră (când este aplicabil)</li>
            </ul>

            <h2>5. Durata stocării</h2>
            <p>
              Datele personale sunt stocate pe durata necesară îndeplinirii scopurilor pentru care 
              au fost colectate, în conformitate cu legislația privind arhivarea documentelor.
            </p>

            <h2>6. Drepturile dumneavoastră</h2>
            <p>Aveți următoarele drepturi în legătură cu datele personale:</p>
            <ul>
              <li>Dreptul de acces la date</li>
              <li>Dreptul la rectificare</li>
              <li>Dreptul la ștergere (&quot;dreptul de a fi uitat&quot;)</li>
              <li>Dreptul la restricționarea prelucrării</li>
              <li>Dreptul la portabilitatea datelor</li>
              <li>Dreptul de a depune o plângere la ANSPDCP</li>
            </ul>

            <h2>7. Contact</h2>
            <p>
              Pentru orice întrebări sau solicitări privind datele personale, ne puteți contacta la:
            </p>
            <ul>
              <li>Email: primsal@rdslink.ro, primsal3@gmail.com</li>
              <li>Adresa: Str. Republicii nr.1, Salonta, Jud.Bihor</li>
              <li>Telefon: 0359-409730, 0359-409731, 0259-373243</li>
              <li>FAX: 0359-409733</li>
            </ul>

            <h2>8. Autoritatea de Supraveghere</h2>
            <p>
              Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP)<br />
              Website: <a href="https://www.dataprotection.ro" target="_blank" rel="noopener noreferrer">www.dataprotection.ro</a>
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}

