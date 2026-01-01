import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('receptieLucrari') };
}

// Mock data - will be replaced with database fetch
const PAGE_TITLE = 'Documentaţie necesară pentru realizarea recepţiei la terminarea lucrărilor';

const PAGE_CONTENT = `– convocator comisie de recepţie (formular cam. 11 Parter – se depune la registratura primăriei cu cel puţin 15 zile înainte de data stabilită de beneficiarul autorizaţiei pentru realizarea recepţiei);

– dovada achitării cotelor către Inspectoratul de Stat în Construcţii – Bihor;

La data stabilită pentru recepţie, prin grija beneficiarului, se vor preda reprezentantului primăriei următoarele documente (ele NU se depun împreună cu convocatorul, ci se prezintă pe teren):

– referatele proiectanţilor (arhitect, structurist, instalaţii etc);

– referatul dirigintelui de şantier;

– copii ale tuturor dispoziţiilor de şantier;

– certificat de performanţă energetică actualizat;

– plan de situaţie/ Plan de amplasament actualizat, întocmit de topograf autorizat ANCPI;

– formularul-tip "PROCES-VERBAL DE RECEPŢIE la terminarea lucrărilor" (cam. 11 Parter) 2 exemplare originale`;

export default async function ReceptieLucrariPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });

  return (
    <>
      <Breadcrumbs items={[
        { label: t('informatiiPublice'), href: '/informatii-publice' },
        { label: t('receptieLucrari') }
      ]} />
      <PageHeader titleKey="receptieLucrari" icon="hardHat" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-6">{PAGE_TITLE}</h2>
            <div className="prose prose-lg max-w-none">
              {PAGE_CONTENT.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-gray-700 mb-4 whitespace-pre-line">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
