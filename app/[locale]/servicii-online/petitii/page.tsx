'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Info, Send, User, Building2 } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

type PersonType = 'fizica' | 'juridica';

export default function PetitiiPage() {
  const t = useTranslations('petitions');
  const tNav = useTranslations('navigation');
  const [personType, setPersonType] = useState<PersonType>('fizica');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add reCAPTCHA verification here
    // Handle form submission
    alert(t('submitSuccess'));
  };

  return (
    <>
      <Breadcrumbs items={[
        { label: tNav('serviciiOnline'), href: '/servicii-online' },
        { label: tNav('petitiiOnline') }
      ]} />
      <PageHeader titleKey="petitiiOnline" namespace="navigation" icon="send" />

      <Section background="white">
        <Container>
          <div className="max-w-3xl mx-auto">
            {/* Definition */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">{t('title')}</h2>
              <p className="text-gray-700 text-sm leading-relaxed">
                {t('definition')}
              </p>
              <p className="text-xs text-gray-500 mt-2 italic">
                {t('legalReference')}
              </p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('formTitle')}</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Person Type Selector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('personType')}:
                    </label>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setPersonType('fizica')}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                          personType === 'fizica'
                            ? 'border-primary-600 bg-primary-50 text-primary-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}
                      >
                        <User className="w-5 h-5" />
                        {t('personFizica')}
                      </button>
                      <button
                        type="button"
                        onClick={() => setPersonType('juridica')}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                          personType === 'juridica'
                            ? 'border-primary-600 bg-primary-50 text-primary-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}
                      >
                        <Building2 className="w-5 h-5" />
                        {t('personJuridica')}
                      </button>
                    </div>
                  </div>

                  {/* Fields for Persoana Fizica */}
                  {personType === 'fizica' && (
                    <div className="grid sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('nume')} *
                        </label>
                        <Input required placeholder={t('numePlaceholder')} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('prenume')} *
                        </label>
                        <Input required placeholder={t('prenumePlaceholder')} />
                      </div>
                    </div>
                  )}

                  {/* Fields for Persoana Juridica */}
                  {personType === 'juridica' && (
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('denumire')} *
                        </label>
                        <Input required placeholder={t('denumirePlaceholder')} />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('reprezentantLegal')} *
                          </label>
                          <Input required placeholder={t('reprezentantPlaceholder')} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('cui')} *
                          </label>
                          <Input required placeholder={t('cuiPlaceholder')} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Contact Fields */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('email')} *
                      </label>
                      <Input type="email" required placeholder="email@exemplu.ro" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('telefon')}
                      </label>
                      <Input type="tel" placeholder="07XX XXX XXX" />
                    </div>
                  </div>

                  {/* Address Section */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">{t('adresaTitle')}</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('tara')} *
                        </label>
                        <Input required defaultValue="România" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('judet')} *
                        </label>
                        <Input required placeholder={t('judetPlaceholder')} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('localitate')} *
                        </label>
                        <Input required placeholder={t('localitatePlaceholder')} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('adresa')} *
                        </label>
                        <Input required placeholder={t('adresaPlaceholder')} />
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('mesaj')} *
                    </label>
                    <Textarea 
                      rows={8} 
                      required 
                      placeholder={t('mesajPlaceholder')}
                      className="resize-y"
                    />
                  </div>

                  {/* File Attachment */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('atasareFisier')}
                    </label>
                    <input
                      type="file"
                      multiple
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 cursor-pointer"
                    />
                    <p className="text-xs text-gray-500 mt-1">{t('fileHint')}</p>
                  </div>

                  {/* TODO: Add Google reCAPTCHA v3 here */}
                  {/* <ReCAPTCHA sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY} /> */}

                  <Button type="submit" className="w-full" size="lg">
                    <Send className="w-4 h-4" />
                    {t('submit')}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="mt-6 bg-amber-50 border-amber-200">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800">
                    {t('disclaimer')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>
    </>
  );
}
