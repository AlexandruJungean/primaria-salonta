'use client';

import { useTranslations } from 'next-intl';
import { 
  Building2,
  Bike,
  Home,
  Landmark,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { Link } from '@/components/ui/link';
import { type LucideIcon } from 'lucide-react';
import Image from 'next/image';

// Types
interface Project {
  id: string;
  title: string;
  shortTitle: string;
  smisCode: string;
  icon: LucideIcon;
  color: string;
}

// Projects data - these would come from database in production
const PROJECTS: Project[] = [
  {
    id: 'coridor-mobilitate-301398',
    title: 'Coridor de mobilitate urbană prin crearea pistelor de biciclete și coridor prioritar pentru mijloc de transport în comun ecologic. Traseul I de la est la vest și traseul II de la sud la vest în Municipiul Salonta',
    shortTitle: 'Creare coridor de mobilitate urbană',
    smisCode: '301398',
    icon: Bike,
    color: 'emerald',
  },
  {
    id: 'casa-roth-armin-311797',
    title: 'Reabilitare interioară și dotare Casa Roth Armin',
    shortTitle: 'Reabilitare interioară și dotare Casa Roth Armin',
    smisCode: '311797',
    icon: Home,
    color: 'amber',
  },
  {
    id: 'parc-specializare-319239',
    title: 'Realizare Parc de Specializare Inteligentă',
    shortTitle: 'Realizare Parc de Specializare Inteligentă',
    smisCode: '319239',
    icon: Landmark,
    color: 'violet',
  },
];

// Color utilities
const getColorClasses = (color: string) => {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    emerald: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
    amber: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
    violet: { bg: 'bg-violet-100', text: 'text-violet-700', border: 'border-violet-200' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
  };
  return colors[color] || colors.blue;
};

function ProjectCard({ project }: { project: Project }) {
  const colorClasses = getColorClasses(project.color);
  const Icon = project.icon;

  return (
    <Link href={`/programe/program-regional-nord-vest/${project.id}`}>
      <Card className="hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl ${colorClasses.bg} flex items-center justify-center shrink-0`}>
              <Icon className={`w-6 h-6 ${colorClasses.text}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${colorClasses.bg} ${colorClasses.text}`}>
                  SMIS {project.smisCode}
                </span>
              </div>
              <CardTitle className="text-base font-semibold text-gray-900 leading-snug">
                {project.shortTitle}
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-end text-primary-600 text-sm font-medium">
            <span>Vezi detalii</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function ProgramRegionalNordVestPage() {
  const t = useTranslations('navigation');
  const tp = useTranslations('programRegionalNordVestPage');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('programe'), href: '/programe' },
        { label: t('programRegionalNordVest') }
      ]} />
      <PageHeader titleKey="programRegionalNordVest" icon="building2" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            {/* Description */}
            <div className="text-center mb-8">
              <p className="text-lg text-gray-600">
                {tp('description')}
              </p>
            </div>

            {/* EU Program Logos */}
            <div className="flex flex-wrap items-center justify-center gap-8 mb-10 p-6 bg-gray-50 rounded-xl">
              <Image 
                src="/images/finantatori-proiecte/UE.webp" 
                alt="Uniunea Europeană" 
                width={240} 
                height={160}
                className="h-16 w-auto object-contain"
              />
              <Image 
                src="/images/finantatori-proiecte/gov-ro.webp" 
                alt="Guvernul României" 
                width={120} 
                height={80}
                className="h-16 w-auto object-contain"
              />
              <Image 
                src="/images/finantatori-proiecte/ADR-nord-vest.webp" 
                alt="ADR Nord-Vest" 
                width={120} 
                height={80}
                className="h-16 w-auto object-contain"
              />
              <Image 
                src="/images/finantatori-proiecte/Regio-nord-vest.webp" 
                alt="Regio Nord-Vest" 
                width={120} 
                height={80}
                className="h-16 w-auto object-contain"
              />
            </div>

            {/* Projects in Implementation */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{tp('projectsInImplementation')}</h2>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {PROJECTS.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>

            {/* Info Section */}
            <div className="p-6 bg-blue-50 border border-blue-100 rounded-xl">
              <p className="text-sm text-blue-800 mb-4">
                {tp('moreInfo')}{' '}
                <a 
                  href="https://www.oportunitati-ue.gov.ro" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  www.oportunitati-ue.gov.ro
                  <ExternalLink className="w-3 h-3" />
                </a>
              </p>
              
              <p className="text-lg font-semibold text-blue-900 mb-4">
                {tp('investInFuture')}
              </p>

              <div className="flex flex-wrap gap-4">
                <a 
                  href="https://www.regionordvest.ro" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  www.regionordvest.ro
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a 
                  href="https://www.nord-vest.ro" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  www.nord-vest.ro
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

