import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('istoric') };
}

export default function IstoricPage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('localitatea'), href: '/localitatea' },
        { label: t('istoric') }
      ]} />
      <PageHeader titleKey="istoric" icon="clock" />

      <Section background="white">
        <Container>
          <div className="prose prose-lg prose-gray max-w-5xl mx-auto">
              <p className="lead text-xl text-gray-600 mb-8">
                Municipiul Salonta, al doilea ca număr de locuitori din județul Bihor după municipiul Oradea, 
                este așezat în extremitatea vestică a țării, lângă granița cu Ungaria. Condițiile naturale 
                specifice zonei de câmpie au favorizat existența așezărilor omenești din cele mai vechi timpuri.
              </p>

              <p>
                Prima atestare documentară a localității Salonta datează din anul 1332 când, într-un act papal, 
                așezarea este numită „Socerdas de Ville Zalantha". Ulterior, numele localității a suferit mai 
                multe modificări, pentru ca, în anul 1587 să ajungă la forma „Szalonta".
              </p>

              <p>
                Până în secolul XVI Salonta aparține familiei nobiliare Toldi și nu are mare importanță în zonă, 
                mai ales datorită situării în vecinătatea Cetății Culișer, puternic centru politico-economic și 
                care în secolul XII a fost ridicată la rangul de oraș. În această perioadă satul Salonta cuprindea 
                aproximativ 50 de case așezate între mlaștini și stuf având circa 250-300 locuitori.
              </p>

              {/* First image - Bocskai István */}
              <figure className="my-8 float-right ml-8 mb-4 w-64">
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src="/images/istoric-1.jpg"
                    alt="Principele Ardealului, Stephanus Bocskai"
                    fill
                    className="object-cover"
                    sizes="256px"
                  />
                </div>
                <figcaption className="text-sm text-gray-600 mt-2 text-center italic">
                  Principele Ardealului, Stephanus Bocskai
                </figcaption>
              </figure>

              <p>
                Turcii distrug în 1598 atât Cetatea Culișer cât și vatra veche a Salontei. Cetatea nu va fi 
                repopulată dar, după o scurtă perioadă de timp, Salonta se reface. Faptul se datorează întoarcerii 
                unei părți din populația refugiată și așezării aici din ordinul principelui Ardealului, Bocskai István, 
                a trei sute de oșteni liberi ce aveau ca sarcină apărarea ținuturilor de margine împotriva turcilor.
              </p>

              <p>
                În aceeași perioadă, se ridică turnul de pază din centrul așezării, cunoscut azi ca „Turnul Ciunt", 
                ce servea ca post de observare. Oștenii Salontei au primit importante suprafețe de pământ și se 
                bucurau de privilegii care mai târziu au fost sporite prin acordarea titlurilor nobiliare.
              </p>

              <p>
                Privilegiile și libertățile acordate locuitorilor au determinat creșterea numerică a populației 
                orașului și transformarea lui într-un puternic centru economic, mai ales în urma dreptului de a 
                organiza târguri.
              </p>

              <div className="clear-both"></div>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Dezvoltarea economică</h2>

              <p>
                Deoarece orașul se află la extremitatea principatului Transilvaniei și în vecinătatea teritoriilor 
                stăpânite de turci, în Târgul Salontei se întâlneau negustorii veniți din Transilvania cu cei din 
                zona de ocupație otomană. Schimbul intens de mărfuri determină dezvoltarea rapidă a așezării și 
                apariția micii industrii: argăsitul pieilor, opincăritul, cizmăritul, blănăritul, țesătoria, fierăritul.
              </p>

              <p>
                Bunurile produse satisfac necesitățile locale și se desfac și în târgurile estice și sudice din 
                Tinca, Beiuș, Ineu, Chișineu Criș și în târgurile din zona de ocupație otomană, la Gyula și Orosháza.
              </p>

              <p>
                În 1659, principele Ardealului, Rákóczi György al II-lea, dispune incendierea orașului, care va 
                începe să fie populat din nou abia la sfârșitul secolului XVII. Ca urmare a succeselor purtate 
                împotriva turcilor, Austria obține din 1686 stăpânirea Ungariei, iar din 1688 și pe cea a Transilvaniei.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Sub stăpânire austriacă</h2>

              <p>
                Împăratul Leopold întărește privilegiile locuitorilor Salontei, dar în 1700 Curtea Imperială renunță 
                la serviciile militare ale oștenilor liberi și anulează privilegiile acestora. Acest fapt duce la 
                disensiuni între locuitorii Salontei și familia nobiliară Eszterházy, proces ce se va încheia în 
                anul revoluționar 1848.
              </p>

              <p>
                În timpul Revoluției de la 1848 poetul Arany János se distinge prin activitatea sa. Versurile sale 
                oglindesc participarea poetului la evenimente.
              </p>

              <p>
                După o scurtă perioadă de libertate, teritoriul Salontei este reintegrat în Imperiul Habsburgic sub 
                un regim absolutist. La începutul secolului XIX meșteșugarii se organizează în bresle. Prima breaslă, 
                cea a cizmarilor, se înființează în anul 1820, iar cea a tăbăcarilor în 1836. În 1872, meseriașii, 
                cu excepția cizmarilor, constituie Uniunea Mixtă a Meseriașilor. La sfârșitul secolului XIX în evidența 
                meseriașilor figurează aproape 500 de meșteri cu brevete de funcționare.
              </p>

              {/* Second image - Historical Salonta */}
              <figure className="my-10">
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src="/images/istoric-2.jpg"
                    alt="Salonta la cumpăna dintre secolele XIX și XX"
                    fill
                    className="object-cover"
                    sizes="(max-width: 896px) 100vw, 896px"
                  />
                </div>
                <figcaption className="text-sm text-gray-600 mt-3 text-center italic">
                  Salonta la cumpăna dintre secolele XIX și XX
                </figcaption>
              </figure>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Modernizarea orașului</h2>

              <p>
                La cumpăna dintre secolele XIX și XX ținutul se dezvoltă intens. În această perioadă încep lucrările 
                de desecare a mlaștinilor, construirea liniei ferate și apar primele instituții cu caracter capitalist 
                în industrie și comerț. De asemenea, se înregistrează un puternic aflux al populației rurale spre oraș.
              </p>

              <p>
                Mișcarea popoarelor europene pentru autodeterminare ce urmează Primului Război Mondial duce la 
                destrămarea Imperiului Habsburgic și constituirea statelor naționale. În noile condiții, Salonta 
                marchează unul din punctele de graniță dintre România și Ungaria.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Dezvoltarea industrială</h2>

              <p>
                Dezvoltarea industriei orașului se accentuează după 1948 prin înființarea unor noi unități economice. 
                Salonta devine astfel un oraș cu o economie industrial-agrară în continuă dezvoltare.
              </p>

              <p>
                Industria alimentară, industria textilelor, a confecțiilor, a pielăriei, blănăriei și încălțămintei 
                precum și prelucrarea lemnului sunt ramuri industriale cu vechi tradiții în zonă și în prezent 65% 
                din producția globală a orașului, dominantă fiind industria alimentară. Alături de acestea a apărut 
                și s-a dezvoltat industria constructoare de mașini.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Atracții turistice</h2>

              <p>
                Călătorul aflat în Salonta se poate opri în casele ce au aparținut poeților Arany János, Sinka István 
                și Zilahy Lajos, poate depune o floare la statuile acestora sau a revoluționarului pașoptist Kossuth Lajos 
                sau poate admira Turnul Ciunt ori Palatul „Arany" care adăpostește Biblioteca orășenească „Teodor Neș" 
                și o galerie de artă. Demne de interes sunt și bisericile orașului și clădirea Primăriei.
              </p>

              <p>
                Lăsând în urmă obiectivele turistice ale orașului, Salonta poate fi punct de plecare pentru cei 
                pasionați de vânătoare și pescuit. În același timp, Salonta oferă multiple oportunități investitorilor 
                și oamenilor de afaceri interesați, fiind un oraș al tuturor posibilităților.
              </p>
            </div>
        </Container>
      </Section>
    </>
  );
}

