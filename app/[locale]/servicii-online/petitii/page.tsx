import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Info, Send } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'petitions' });
  return { title: t('title'), description: t('subtitle') };
}

export default function PetitiiPage() {
  const t = useTranslations('petitions');
  const tNav = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: tNav('serviciiOnline'), href: '/servicii-online' },
        { label: tNav('petitiiOnline') }
      ]} />
      <PageHeader titleKey="petitiiOnline" namespace="navigation" icon="send" />

      <Section background="white">
        <Container>
          <div className="max-w-2xl mx-auto">
            <p className="text-lg text-gray-600 mb-8 text-center">
              {t('subtitle')}
            </p>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('formTitle')}</h2>
                
                <form className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nume și prenume *
                      </label>
                      <Input required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CNP
                      </label>
                      <Input />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('address')} *
                    </label>
                    <Input required />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <Input type="email" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Telefon
                      </label>
                      <Input type="tel" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subiect *
                    </label>
                    <Input required />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('content')} *
                    </label>
                    <Textarea rows={6} required />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Atașamente
                    </label>
                    <input
                      type="file"
                      multiple
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                    />
                  </div>

                  <Button type="submit" className="w-full">
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

