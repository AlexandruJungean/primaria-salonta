import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Clock } from 'lucide-react';
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
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg">
              <p className="lead text-xl text-gray-600 mb-8">
                Salonta (în maghiară Nagyszalonta) este un oraș cu o istorie bogată, 
                cunoscut în special ca loc de naștere al poetului Arany János.
              </p>

              <h2>Origini și evoluție</h2>
              <p>
                Prima atestare documentară a localității datează din anul 1214, sub denumirea de &quot;Zolonta&quot;. 
                De-a lungul secolelor, așezarea a cunoscut diverse denumiri și a făcut parte din diferite 
                formațiuni statale.
              </p>

              <h2>Perioada medievală</h2>
              <p>
                În perioada medievală, Salonta a fost un important centru agricol și comercial. 
                Așezarea a beneficiat de privilegii regale care au contribuit la dezvoltarea sa.
              </p>

              <div className="my-8 relative aspect-video rounded-xl overflow-hidden">
                <Image
                  src="/images/muzeu-salonta.jpg"
                  alt="Complexul Muzeal Arany János"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>

              <h2>Arany János și renașterea culturală</h2>
              <p>
                Secolul al XIX-lea a marcat o perioadă de înflorire culturală, în special datorită 
                poetului Arany János (1817-1882), născut în Salonta. Acesta este considerat unul 
                dintre cei mai mari poeți ai literaturii maghiare și a contribuit semnificativ 
                la identitatea culturală a orașului.
              </p>

              <h2>Secolul XX</h2>
              <p>
                După Primul Război Mondial și Tratatul de la Trianon (1920), Salonta a devenit 
                parte a României. Orașul a continuat să se dezvolte, devenind un important centru 
                administrativ și economic în regiunea de vest a țării.
              </p>

              <h2>Perioada contemporană</h2>
              <p>
                Astăzi, Salonta este un municipiu modern, care își păstrează moștenirea culturală 
                și istorică, promovând turismul cultural și dezvoltarea economică durabilă. 
                Complexul Muzeal &quot;Arany János&quot; și Casa Memorială atrag vizitatori din toată lumea.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

