import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { 
  FileSearch, ShoppingCart, Wallet, Receipt, BadgeCheck, Hammer, Home, Map, Leaf, ShieldCheck, Siren,
  FileText, Dog, Megaphone, FileSignature, Gavel, Wheat, Heart, Tag, HardHat, ScrollText, Radio, Network,
  FileQuestion, AlertCircle
} from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { Link } from '@/components/ui/link';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('informatiiPublice') };
}

const SECTIONS = [
  { id: 'achizitiiPublice', href: '/informatii-publice/achizitii', icon: ShoppingCart },
  { id: 'acteNecesare', href: '/informatii-publice/acte-necesare', icon: FileText },
  { id: 'adapostCaini', href: '/informatii-publice/adapost-caini', icon: Dog },
  { id: 'anunturi', href: '/informatii-publice/anunturi', icon: Megaphone },
  { id: 'autorizatiiConstruire', href: '/informatii-publice/autorizatii-construire', icon: Hammer },
  { id: 'buget', href: '/informatii-publice/buget', icon: Wallet },
  { id: 'certificateUrbanism', href: '/informatii-publice/certificate-urbanism', icon: Home },
  { id: 'concursuri', href: '/informatii-publice/concursuri', icon: BadgeCheck },
  { id: 'dispozitii', href: '/informatii-publice/dispozitii', icon: FileSignature },
  { id: 'gdpr', href: '/informatii-publice/gdpr', icon: ShieldCheck },
  { id: 'taxeImpozite', href: '/informatii-publice/taxe-impozite', icon: Receipt },
  { id: 'licitatii', href: '/informatii-publice/licitatii', icon: Gavel },
  { id: 'mediu', href: '/informatii-publice/mediu', icon: Leaf },
  { id: 'oferteTerenuri', href: '/informatii-publice/oferte-terenuri', icon: Wheat },
  { id: 'planuriUrbanistice', href: '/informatii-publice/planuri-urbanistice', icon: Map },
  { id: 'publicatiiCasatorie', href: '/informatii-publice/publicatii-casatorie', icon: Heart },
  { id: 'publicatiiVanzare', href: '/informatii-publice/publicatii-vanzare', icon: Tag },
  { id: 'receptieLucrari', href: '/informatii-publice/receptie-lucrari', icon: HardHat },
  { id: 'regulamente', href: '/informatii-publice/regulamente', icon: ScrollText },
  { id: 'reteleTelecom', href: '/informatii-publice/retele-telecom', icon: Radio },
  { id: 'seip', href: '/informatii-publice/seip', icon: Network },
  { id: 'solicitareInformatii', href: '/informatii-publice/solicitare-informatii', icon: FileQuestion },
  { id: 'somatii', href: '/informatii-publice/somatii', icon: AlertCircle },
  { id: 'coronavirus', href: '/informatii-publice/coronavirus', icon: Siren },
];

export default function InformatiiPublicePage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[{ label: t('informatiiPublice') }]} />
      <PageHeader titleKey="informatiiPublice" icon="fileSearch" />

      <Section background="white">
        <Container>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SECTIONS.map((section) => {
              const Icon = section.icon;
              return (
                <Link key={section.id} href={section.href}>
                  <Card hover className="h-full">
                    <CardContent className="flex items-center gap-4 pt-6">
                      <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                        <Icon className="w-6 h-6 text-primary-700" />
                      </div>
                      <h3 className="font-semibold text-gray-900">{t(section.id)}</h3>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </Container>
      </Section>
    </>
  );
}

