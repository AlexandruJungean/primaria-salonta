import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { FileQuestion, Download, Clock, Mail, ExternalLink } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('solicitareInformatii') };
}

export default function SolicitareInformatiiPage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('informatiiPublice'), href: '/informatii-publice' },
        { label: t('solicitareInformatii') }
      ]} />
      <PageHeader titleKey="solicitareInformatii" icon="fileQuestion" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="bg-primary-50 border border-primary-200 rounded-xl p-6 mb-8">
              <h2 className="text-lg font-semibold text-primary-900 mb-2">
                Legea nr. 544/2001 privind liberul acces la informațiile de interes public
              </h2>
              <p className="text-primary-800 text-sm">
                Orice persoană are dreptul să solicite și să obțină de la autoritățile și instituțiile publice
                informații de interes public, în conformitate cu prevederile legale.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary-600" />
                    Termen de răspuns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    <strong>10 zile lucrătoare</strong> de la data înregistrării solicitării.
                    În cazul în care informația solicitată necesită o analiză complexă,
                    termenul poate fi prelungit cu 10 zile lucrătoare.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-primary-600" />
                    Contact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Email: <a href="mailto:primsal3@gmail.com" className="text-primary-600 hover:underline">primsal3@gmail.com</a><br />
                    Telefon: 0359-409730<br />
                    Program: Luni-Vineri, 8:00-16:00
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileQuestion className="w-5 h-5 text-primary-600" />
                  Modalități de depunere a solicitării
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-semibold shrink-0">1</span>
                    <span><strong>La sediul instituției:</strong> Str. Republicii nr. 1, Salonta, la Registratură</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-semibold shrink-0">2</span>
                    <span><strong>Prin email:</strong> primsal3@gmail.com</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-semibold shrink-0">3</span>
                    <span><strong>Online:</strong> Prin platforma SEIP</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-semibold shrink-0">4</span>
                    <span><strong>Prin poștă:</strong> Primăria Municipiului Salonta, Str. Republicii nr. 1, Salonta, jud. Bihor</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5 text-primary-600" />
                  Documente utile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="flex items-center gap-2 text-gray-700 hover:text-primary-700 transition-colors"
                    >
                      <Download className="w-4 h-4 text-red-500" />
                      Formular solicitare informații de interes public
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="flex items-center gap-2 text-gray-700 hover:text-primary-700 transition-colors"
                    >
                      <Download className="w-4 h-4 text-red-500" />
                      Formular reclamație administrativă
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://legislatie.just.ro/Public/DetaliiDocument/31413"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-700 hover:text-primary-700 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-blue-500" />
                      Legea nr. 544/2001 - text integral
                    </a>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>
    </>
  );
}

