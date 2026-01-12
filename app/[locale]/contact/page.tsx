import { getTranslations } from 'next-intl/server';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section, SectionHeader } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { CONTACT_INFO } from '@/lib/constants/contact';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { ContactPageJsonLd } from '@/lib/seo/json-ld';
import { type Locale } from '@/i18n/routing';
import { ContactForm } from './contact-form';
import { getOfficeHours } from '@/lib/supabase/services/office-hours';
import { translateContentArray } from '@/lib/google-translate/cache';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'contact',
    locale: locale as Locale,
    path: '/contact',
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });
  
  // Fetch office hours from Supabase
  const officeHoursData = await getOfficeHours();
  const officeHours = await translateContentArray(
    officeHoursData,
    ['name'],
    locale as 'ro' | 'hu' | 'en'
  );

  const formLabels = {
    formTitle: t('formTitle'),
    name: t('name'),
    email: t('email'),
    phone: t('phone'),
    subject: t('subject'),
    message: t('message'),
    send: t('send'),
    sending: t('sending'),
    successTitle: t('successTitle'),
    successMessage: t('successMessage'),
    errorTitle: t('errorTitle'),
    errorMessage: t('errorMessage'),
    sendAnother: t('sendAnother'),
  };

  return (
    <>
      <ContactPageJsonLd />
      <Breadcrumbs items={[{ label: t('title') }]} />

      <Section background="white">
        <Container>
          <SectionHeader title={t('title')} subtitle={t('subtitle')} />

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {t('findUs')}
              </h3>

              <div className="space-y-4">
                {/* Address */}
                <Card>
                  <CardContent className="flex items-start gap-4 pt-6">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-primary-700" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Adresă</h4>
                      <p className="text-gray-600">{CONTACT_INFO.address.full}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Phone */}
                <Card>
                  <CardContent className="flex items-start gap-4 pt-6">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-primary-700" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Telefon</h4>
                      <p className="text-gray-600">{CONTACT_INFO.phone.display}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        FAX: {CONTACT_INFO.phone.fax}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Email */}
                <Card>
                  <CardContent className="flex items-start gap-4 pt-6">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-primary-700" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Email</h4>
                      <div className="space-y-1">
                        <a
                          href={`mailto:${CONTACT_INFO.email.primary}`}
                          className="block text-primary-700 hover:text-primary-900"
                        >
                          {CONTACT_INFO.email.primary}
                        </a>
                        <a
                          href={`mailto:${CONTACT_INFO.email.secondary}`}
                          className="block text-primary-700 hover:text-primary-900"
                        >
                          {CONTACT_INFO.email.secondary}
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Schedule */}
                <Card>
                  <CardContent className="flex items-start gap-4 pt-6">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-primary-700" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{t('officeHours')}</h4>
                      <div className="text-gray-600 space-y-1 mt-2">
                        {officeHours.map((office) => (
                          <div key={office.id} className="text-sm">
                            <span className="font-medium">
                              {office.name}
                              {office.room && ` (cam. ${office.room})`}:
                            </span>{' '}
                            {office.hours.map((h) => `${h.from} - ${h.to}`).join(', ')}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                {t('formTitle')}
              </h3>
              <ContactForm labels={formLabels} />
            </div>
          </div>
        </Container>
      </Section>

      {/* Google Map */}
      <Section background="gray" className="py-0">
        <div className="h-[400px] bg-gray-300">
          <iframe
            src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d21841.45!2d21.65!3d46.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4747f4e8b2f14f87%3A0x8c8c8c8c8c8c8c8c!2sSalonta!5e0!3m2!1sen!2sro!4v1234567890`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Locație Primăria Salonta"
          />
        </div>
      </Section>
    </>
  );
}
