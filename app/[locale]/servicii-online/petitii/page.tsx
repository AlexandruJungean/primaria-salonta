'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useLocale } from 'next-intl';
import { Info, Phone, Mail, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { Button } from '@/components/ui/button';
import { CONTACT_INFO } from '@/lib/constants/contact';
import { petitionFormSchema, type PetitionFormData } from '@/lib/validations/forms';

const pageLabels = {
  ro: {
    breadcrumb1: 'Servicii Online',
    breadcrumb2: 'Petiții Online',
    definition: 'Prin PETIȚIE se înțelege cererea, reclamația, sesizarea sau propunerea formulată în scris ori prin poștă electronică, pe care un cetățean sau o organizație legal constituită o poate adresa autorităților și instituțiilor publice centrale și locale, serviciilor publice descentralizate ale ministerelor și ale celorlalte organe centrale, companiilor și societăților naționale, societăților comerciale de interes județean sau local, precum și regiilor autonome.',
    legalRef: '(art. 2 din Ordonanța Guvernului nr. 27/2002 privind reglementarea activității de soluționare a petițiilor, cu modificările ulterioare)',
    formTitle: 'Pentru depunerea unei petiții completați formularul următor:',
    tipPersoana: 'Tip persoană',
    persoanaFizica: 'Persoană fizică',
    persoanaJuridica: 'Persoană juridică',
    nume: 'Nume',
    prenume: 'Prenume',
    denumire: 'Denumire',
    reprezentant: 'Reprezentant legal',
    cui: 'CUI',
    email: 'E-mail',
    telefon: 'Telefon',
    adresaTitle: 'Adresă',
    tara: 'Țara',
    judet: 'Județ',
    localitate: 'Localitate',
    adresa: 'Adresă',
    mesaj: 'Mesaj',
    trimite: 'Trimite petiția',
    sending: 'Se trimite...',
    successTitle: 'Petiția a fost trimisă!',
    successMessage: 'Vă mulțumim pentru mesaj. Veți primi un răspuns în cel mai scurt timp posibil.',
    errorTitle: 'Eroare la trimitere',
    errorMessage: 'A apărut o eroare. Vă rugăm să încercați din nou.',
    sendAnother: 'Trimite altă petiție',
  },
  hu: {
    breadcrumb1: 'Online Szolgáltatások',
    breadcrumb2: 'Online Beadványok',
    definition: 'A BEADVÁNY alatt írásban vagy elektronikus levélben megfogalmazott kérelmet, panaszt, bejelentést vagy javaslatot értünk, amelyet egy állampolgár vagy törvényesen létrehozott szervezet intézhet a központi és helyi közhatóságokhoz és közintézményekhez, a minisztériumok és más központi szervek decentralizált közszolgálataihoz, nemzeti társaságokhoz, megyei vagy helyi érdekű kereskedelmi társaságokhoz, valamint autonóm közigazgatási vállalatokhoz.',
    legalRef: '(a 27/2002. sz. Kormányrendelet 2. cikke a beadványok megoldásának szabályozásáról, a későbbi módosításokkal)',
    formTitle: 'Beadvány benyújtásához töltse ki az alábbi űrlapot:',
    tipPersoana: 'Személy típusa',
    persoanaFizica: 'Magánszemély',
    persoanaJuridica: 'Jogi személy',
    nume: 'Családnév',
    prenume: 'Keresztnév',
    denumire: 'Megnevezés',
    reprezentant: 'Jogi képviselő',
    cui: 'CUI',
    email: 'E-mail',
    telefon: 'Telefon',
    adresaTitle: 'Cím',
    tara: 'Ország',
    judet: 'Megye',
    localitate: 'Helység',
    adresa: 'Cím',
    mesaj: 'Üzenet',
    trimite: 'Beadvány küldése',
    sending: 'Küldés...',
    successTitle: 'A beadvány elküldve!',
    successMessage: 'Köszönjük üzenetét. A lehető legrövidebb időn belül választ kap.',
    errorTitle: 'Küldési hiba',
    errorMessage: 'Hiba történt. Kérjük, próbálja újra.',
    sendAnother: 'Új beadvány küldése',
  },
  en: {
    breadcrumb1: 'Online Services',
    breadcrumb2: 'Online Petitions',
    definition: 'A PETITION means a request, complaint, report or proposal formulated in writing or by email, which a citizen or legally constituted organization may address to central and local public authorities and institutions, decentralized public services of ministries and other central bodies, national companies and societies, commercial companies of county or local interest, as well as autonomous administrations.',
    legalRef: '(art. 2 of Government Ordinance no. 27/2002 regarding the regulation of petition resolution activity, with subsequent amendments)',
    formTitle: 'To submit a petition, fill out the following form:',
    tipPersoana: 'Person type',
    persoanaFizica: 'Individual',
    persoanaJuridica: 'Legal entity',
    nume: 'Last name',
    prenume: 'First name',
    denumire: 'Company name',
    reprezentant: 'Legal representative',
    cui: 'CUI',
    email: 'E-mail',
    telefon: 'Phone',
    adresaTitle: 'Address',
    tara: 'Country',
    judet: 'County',
    localitate: 'City',
    adresa: 'Address',
    mesaj: 'Message',
    trimite: 'Submit petition',
    sending: 'Sending...',
    successTitle: 'Petition sent!',
    successMessage: 'Thank you for your message. You will receive a response as soon as possible.',
    errorTitle: 'Sending error',
    errorMessage: 'An error occurred. Please try again.',
    sendAnother: 'Send another petition',
  },
};

export default function PetitiiPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const { executeRecaptcha } = useGoogleReCaptcha();
  const locale = useLocale() as 'ro' | 'hu' | 'en';
  const labels = pageLabels[locale] || pageLabels.ro;

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors";
  const inputErrorClass = "w-full px-3 py-2 border border-red-500 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<PetitionFormData>({
    resolver: zodResolver(petitionFormSchema),
    defaultValues: {
      tipPersoana: 'fizica',
      tara: 'România',
    },
  });

  const tipPersoana = watch('tipPersoana');

  const onSubmit = async (data: PetitionFormData) => {
    setStatus('loading');
    setErrorMessage('');

    try {
      // Get reCAPTCHA token
      let recaptchaToken = '';
      if (executeRecaptcha) {
        recaptchaToken = await executeRecaptcha('petition_form');
      }

      const response = await fetch('/api/petitii', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, recaptchaToken, locale }),
      });

      const result = await response.json();

      if (result.success) {
        setStatus('success');
        reset();
      } else {
        setStatus('error');
        setErrorMessage(result.error || labels.errorMessage);
      }
    } catch {
      setStatus('error');
      setErrorMessage(labels.errorMessage);
    }
  };

  if (status === 'success') {
    return (
      <>
        <Breadcrumbs items={[
          { label: labels.breadcrumb1, href: '/servicii-online' },
          { label: labels.breadcrumb2 }
        ]} />
        <PageHeader titleKey="petitii" icon="fileText" />

        <Section background="white">
          <Container>
            <div className="max-w-3xl mx-auto">
              <Card>
                <CardContent className="p-8">
                  <div className="text-center py-8">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                      {labels.successTitle}
                    </h2>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                      {labels.successMessage}
                    </p>
                    <Button onClick={() => setStatus('idle')}>
                      {labels.sendAnother}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Container>
        </Section>
      </>
    );
  }

  return (
    <>
      <Breadcrumbs items={[
        { label: labels.breadcrumb1, href: '/servicii-online' },
        { label: labels.breadcrumb2 }
      ]} />
      <PageHeader titleKey="petitii" icon="fileText" />

      <Section background="white">
        <Container>
          <div className="max-w-3xl mx-auto">
            {/* Definition */}
            <Card className="mb-8 bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex gap-3">
                  <Info className="w-5 h-5 text-blue-600 shrink-0 mt-1" />
                  <div>
                    <p className="text-blue-800">{labels.definition}</p>
                    <p className="text-blue-600 text-sm italic mt-2">{labels.legalRef}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Form */}
            <h2 className="text-xl font-semibold text-gray-900 mb-6">{labels.formTitle}</h2>
            
            {status === 'error' && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-red-800">{labels.errorTitle}</p>
                  <p className="text-sm text-red-600">{errorMessage}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Tip persoană */}
              <div>
                <label className={labelClass}>{labels.tipPersoana}</label>
                <select 
                  {...register('tipPersoana')}
                  className={inputClass}
                >
                  <option value="fizica">{labels.persoanaFizica}</option>
                  <option value="juridica">{labels.persoanaJuridica}</option>
                </select>
              </div>

              {/* Persoană fizică fields */}
              {tipPersoana === 'fizica' && (
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>{labels.nume} *</label>
                    <input 
                      type="text" 
                      {...register('nume')}
                      className={errors.nume ? inputErrorClass : inputClass} 
                    />
                    {errors.nume && (
                      <p className="mt-1 text-sm text-red-600">{errors.nume.message}</p>
                    )}
                  </div>
                  <div>
                    <label className={labelClass}>{labels.prenume} *</label>
                    <input 
                      type="text" 
                      {...register('prenume')}
                      className={errors.prenume ? inputErrorClass : inputClass} 
                    />
                    {errors.prenume && (
                      <p className="mt-1 text-sm text-red-600">{errors.prenume.message}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Persoană juridică fields */}
              {tipPersoana === 'juridica' && (
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>{labels.denumire} *</label>
                    <input 
                      type="text" 
                      {...register('denumire')}
                      className={errors.denumire ? inputErrorClass : inputClass} 
                    />
                    {errors.denumire && (
                      <p className="mt-1 text-sm text-red-600">{errors.denumire.message}</p>
                    )}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>{labels.reprezentant} *</label>
                      <input 
                        type="text" 
                        {...register('reprezentant')}
                        className={errors.reprezentant ? inputErrorClass : inputClass} 
                      />
                      {errors.reprezentant && (
                        <p className="mt-1 text-sm text-red-600">{errors.reprezentant.message}</p>
                      )}
                    </div>
                    <div>
                      <label className={labelClass}>{labels.cui}</label>
                      <input 
                        type="text" 
                        {...register('cui')}
                        className={inputClass} 
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Email & Telefon */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>{labels.email} *</label>
                  <input 
                    type="email" 
                    {...register('email')}
                    className={errors.email ? inputErrorClass : inputClass} 
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>{labels.telefon}</label>
                  <input 
                    type="tel" 
                    {...register('telefon')}
                    className={inputClass} 
                  />
                </div>
              </div>

              {/* Adresă */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">{labels.adresaTitle}</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>{labels.tara} *</label>
                    <input 
                      type="text" 
                      {...register('tara')}
                      className={errors.tara ? inputErrorClass : inputClass} 
                    />
                    {errors.tara && (
                      <p className="mt-1 text-sm text-red-600">{errors.tara.message}</p>
                    )}
                  </div>
                  <div>
                    <label className={labelClass}>{labels.judet} *</label>
                    <input 
                      type="text" 
                      {...register('judet')}
                      className={errors.judet ? inputErrorClass : inputClass} 
                    />
                    {errors.judet && (
                      <p className="mt-1 text-sm text-red-600">{errors.judet.message}</p>
                    )}
                  </div>
                  <div>
                    <label className={labelClass}>{labels.localitate} *</label>
                    <input 
                      type="text" 
                      {...register('localitate')}
                      className={errors.localitate ? inputErrorClass : inputClass} 
                    />
                    {errors.localitate && (
                      <p className="mt-1 text-sm text-red-600">{errors.localitate.message}</p>
                    )}
                  </div>
                  <div>
                    <label className={labelClass}>{labels.adresa} *</label>
                    <input 
                      type="text" 
                      {...register('adresa')}
                      className={errors.adresa ? inputErrorClass : inputClass} 
                    />
                    {errors.adresa && (
                      <p className="mt-1 text-sm text-red-600">{errors.adresa.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Mesaj */}
              <div>
                <label className={labelClass}>{labels.mesaj} *</label>
                <textarea 
                  rows={6} 
                  {...register('mesaj')}
                  className={errors.mesaj ? inputErrorClass : inputClass}
                />
                {errors.mesaj && (
                  <p className="mt-1 text-sm text-red-600">{errors.mesaj.message}</p>
                )}
              </div>

              {/* Submit */}
              <div>
                <Button
                  type="submit"
                  disabled={status === 'loading'}
                  size="lg"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {labels.sending}
                    </>
                  ) : (
                    labels.trimite
                  )}
                </Button>
              </div>
            </form>

            {/* Contact Card */}
            <Card className="mt-8 bg-gray-50">
              <CardContent className="p-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <a
                    href={`tel:${CONTACT_INFO.phone.main.replace(/-/g, '')}`}
                    className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    <Phone className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="text-xs text-gray-500">Telefon</p>
                      <p className="font-medium text-gray-900">{CONTACT_INFO.phone.main}</p>
                    </div>
                  </a>
                  <a
                    href={`mailto:${CONTACT_INFO.email.primary}`}
                    className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    <Mail className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="text-xs text-gray-500">E-mail</p>
                      <p className="font-medium text-gray-900">{CONTACT_INFO.email.primary}</p>
                    </div>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>
    </>
  );
}
