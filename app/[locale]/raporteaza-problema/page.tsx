import { getTranslations } from 'next-intl/server';
import { AlertTriangle, MapPin, Phone, Mail, Info, Camera } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { Link } from '@/components/ui/link';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'raporteazaProblema',
    locale: locale as Locale,
    path: '/raporteaza-problema',
  });
}

export default async function RaporteazaProblemaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tp = await getTranslations({ locale, namespace: 'raporteazaProblemaPage' });

  const pageLabels = {
    ro: {
      infoTitle: 'Ce probleme puteți raporta?',
      problemTypes: [
        'Gropi în asfalt și probleme rutiere',
        'Iluminat public defect',
        'Probleme cu spațiile verzi',
        'Gunoaie și salubrizare',
        'Mobilier urban deteriorat',
        'Semne de circulație lipsă sau deteriorate',
        'Alte probleme de interes public',
      ],
      howToTitle: 'Cum raportați o problemă?',
      howToSteps: [
        'Descrieți problema cât mai detaliat',
        'Indicați locația exactă',
        'Adăugați fotografii dacă este posibil',
        'Lăsați datele de contact pentru feedback',
      ],
      contactTitle: 'Raportați acum',
      contactText: 'Contactați-ne pentru a raporta o problemă:',
      phone: 'Telefon',
      email: 'Email',
      orUse: 'sau utilizați',
      contactForm: 'formularul de contact',
    },
    hu: {
      infoTitle: 'Milyen problémákat jelenthet?',
      problemTypes: [
        'Úthibák és közlekedési problémák',
        'Meghibásodott közvilágítás',
        'Zöldterületi problémák',
        'Szemét és köztisztaság',
        'Megrongált utcabútorok',
        'Hiányzó vagy sérült közlekedési táblák',
        'Egyéb közérdekű problémák',
      ],
      howToTitle: 'Hogyan jelenthet problémát?',
      howToSteps: [
        'Írja le a problémát minél részletesebben',
        'Adja meg a pontos helyszínt',
        'Csatoljon fényképeket, ha lehetséges',
        'Hagyja meg elérhetőségét a visszajelzéshez',
      ],
      contactTitle: 'Jelentse most',
      contactText: 'Lépjen kapcsolatba velünk a probléma bejelentéséhez:',
      phone: 'Telefon',
      email: 'E-mail',
      orUse: 'vagy használja a',
      contactForm: 'kapcsolatfelvételi űrlapot',
    },
    en: {
      infoTitle: 'What problems can you report?',
      problemTypes: [
        'Potholes and road issues',
        'Broken street lighting',
        'Green space problems',
        'Garbage and sanitation',
        'Damaged street furniture',
        'Missing or damaged traffic signs',
        'Other public interest issues',
      ],
      howToTitle: 'How to report a problem?',
      howToSteps: [
        'Describe the problem in detail',
        'Indicate the exact location',
        'Add photos if possible',
        'Leave contact details for feedback',
      ],
      contactTitle: 'Report now',
      contactText: 'Contact us to report a problem:',
      phone: 'Phone',
      email: 'Email',
      orUse: 'or use the',
      contactForm: 'contact form',
    },
  };

  const labels = pageLabels[locale as keyof typeof pageLabels] || pageLabels.en;

  return (
    <>
      <Breadcrumbs items={[{ label: t('raporteazaProblema') }]} />
      <PageHeader titleKey="raporteazaProblema" icon="alertTriangle" />

      <Section background="white">
        <Container>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-gray-600 mb-8 text-center">
              {tp('description')}
            </p>

            {/* Problem Types Card */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  {labels.infoTitle}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid sm:grid-cols-2 gap-2">
                  {labels.problemTypes.map((type, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-700">
                      <span className="w-2 h-2 bg-amber-500 rounded-full shrink-0" />
                      {type}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* How To Card */}
            <Card className="mb-6 bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-900">{labels.howToTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {labels.howToSteps.map((step, index) => (
                    <li key={index} className="flex items-start gap-3 text-blue-800">
                      <span className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium shrink-0">
                        {index + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Contact Card */}
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="p-6">
                <h3 className="font-bold text-amber-900 mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  {labels.contactTitle}
                </h3>
                <p className="text-amber-800 mb-4">{labels.contactText}</p>
                
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <a
                    href="tel:0259373862"
                    className="flex items-center gap-2 p-3 bg-white rounded-lg border border-amber-200 text-gray-900 hover:bg-amber-100 transition-colors"
                  >
                    <Phone className="w-5 h-5 text-amber-600" />
                    <div>
                      <p className="text-xs text-gray-500">{labels.phone}</p>
                      <p className="font-medium">0259 373 862</p>
                    </div>
                  </a>
                  <a
                    href="mailto:registratura@salonta.ro"
                    className="flex items-center gap-2 p-3 bg-white rounded-lg border border-amber-200 text-gray-900 hover:bg-amber-100 transition-colors"
                  >
                    <Mail className="w-5 h-5 text-amber-600" />
                    <div>
                      <p className="text-xs text-gray-500">{labels.email}</p>
                      <p className="font-medium">registratura@salonta.ro</p>
                    </div>
                  </a>
                </div>

                <p className="text-center text-amber-800">
                  {labels.orUse}{' '}
                  <Link href="/contact" className="text-amber-900 font-medium hover:underline">
                    {labels.contactForm}
                  </Link>
                </p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>
    </>
  );
}
