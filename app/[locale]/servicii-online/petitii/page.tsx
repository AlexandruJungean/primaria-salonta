import { getTranslations } from 'next-intl/server';
import { FileText, Mail, Info, ExternalLink } from 'lucide-react';
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
    pageKey: 'petitii',
    locale: locale as Locale,
    path: '/servicii-online/petitii',
  });
}

export default async function PetitiiPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tp = await getTranslations({ locale, namespace: 'petitiiPage' });

  const pageLabels = {
    ro: {
      infoTitle: 'Ce este o petiție?',
      infoText: 'Petiția reprezintă cererea, reclamația, sesizarea sau propunerea formulată în scris ori prin poștă electronică, pe care un cetățean o adresează autorităților și instituțiilor publice.',
      howToTitle: 'Cum depuneți o petiție?',
      howToOptions: [
        'Online prin formularul de mai jos',
        'Prin email la adresa registratura@salonta.ro',
        'Depunere fizică la Registratura Primăriei',
        'Prin poștă la adresa: Primăria Municipiului Salonta, str. Republicii nr. 1, cod 415500',
      ],
      formTitle: 'Formular petiție online',
      responseTime: 'Termen de răspuns: 30 de zile calendaristice',
      submitPetition: 'Trimite petiția',
      name: 'Nume complet',
      email: 'Adresa de email',
      phone: 'Telefon (opțional)',
      subject: 'Subiect',
      content: 'Conținutul petiției',
      submit: 'Trimite',
      contactTitle: 'Contact Registratură',
    },
    hu: {
      infoTitle: 'Mi a beadvány?',
      infoText: 'A beadvány írásban vagy elektronikus levélben megfogalmazott kérelem, panasz, bejelentés vagy javaslat, amelyet egy állampolgár a hatóságokhoz és közintézményekhez intéz.',
      howToTitle: 'Hogyan nyújthat be beadványt?',
      howToOptions: [
        'Online az alábbi űrlapon keresztül',
        'E-mailben a registratura@salonta.ro címre',
        'Személyesen a Polgármesteri Hivatal iktató irodájában',
        'Postai úton: Nagyszalonta Polgármesteri Hivatala, str. Republicii nr. 1, 415500',
      ],
      formTitle: 'Online beadvány űrlap',
      responseTime: 'Válaszadási határidő: 30 naptári nap',
      submitPetition: 'Beadvány küldése',
      name: 'Teljes név',
      email: 'E-mail cím',
      phone: 'Telefon (opcionális)',
      subject: 'Tárgy',
      content: 'A beadvány tartalma',
      submit: 'Küldés',
      contactTitle: 'Iktató elérhetősége',
    },
    en: {
      infoTitle: 'What is a petition?',
      infoText: 'A petition is a request, complaint, report or proposal formulated in writing or by email, which a citizen addresses to public authorities and institutions.',
      howToTitle: 'How to submit a petition?',
      howToOptions: [
        'Online through the form below',
        'By email to registratura@salonta.ro',
        'Physical submission at the City Hall Registry',
        'By mail to: Salonta City Hall, str. Republicii nr. 1, 415500',
      ],
      formTitle: 'Online petition form',
      responseTime: 'Response time: 30 calendar days',
      submitPetition: 'Submit petition',
      name: 'Full name',
      email: 'Email address',
      phone: 'Phone (optional)',
      subject: 'Subject',
      content: 'Petition content',
      submit: 'Submit',
      contactTitle: 'Registry Contact',
    },
  };

  const labels = pageLabels[locale as keyof typeof pageLabels] || pageLabels.en;

  return (
    <>
      <Breadcrumbs items={[
        { label: t('serviciiOnline'), href: '/servicii-online' },
        { label: t('petitii') }
      ]} />
      <PageHeader titleKey="petitii" icon="fileText" />

      <Section background="white">
        <Container>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-gray-600 mb-8 text-center">
              {tp('description')}
            </p>

            {/* Info Card */}
            <Card className="mb-6 bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  {labels.infoTitle}
                </h3>
                <p className="text-blue-800 text-sm">{labels.infoText}</p>
              </CardContent>
            </Card>

            {/* How To Card */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">{labels.howToTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {labels.howToOptions.map((option, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <span className="w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-medium shrink-0">
                        {index + 1}
                      </span>
                      {option}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Response Time Notice */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-6 text-center">
              <p className="text-amber-800 font-medium">{labels.responseTime}</p>
            </div>

            {/* Contact Link */}
            <Card className="bg-gray-50">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold text-gray-900 mb-4">{labels.contactTitle}</h3>
                <div className="flex flex-wrap justify-center gap-4">
                  <a
                    href="mailto:registratura@salonta.ro"
                    className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-800"
                  >
                    <Mail className="w-4 h-4" />
                    registratura@salonta.ro
                  </a>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    {t('contact')}
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>
    </>
  );
}
