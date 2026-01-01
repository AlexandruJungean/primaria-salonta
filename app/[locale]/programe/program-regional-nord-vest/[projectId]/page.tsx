'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { 
  Building2,
  Bike,
  Home,
  Landmark,
  ExternalLink,
  ArrowLeft,
  Download,
  FileText,
  Calendar,
  Euro,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon
} from 'lucide-react';
import { useState } from 'react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { Link } from '@/components/ui/link';
import Image from 'next/image';
import { type LucideIcon } from 'lucide-react';

// Types
interface ProjectDocument {
  label: string;
  url: string;
  date?: string;
}

interface StatusUpdate {
  period: string;
  date: string;
  title: string;
  content: string;
  images?: { src: string; alt: string; caption?: string }[];
}

interface StatusCategory {
  title: string;
  updates: StatusUpdate[];
}

interface ProjectDetail {
  id: string;
  title: string;
  shortTitle: string;
  smisCode: string;
  icon: LucideIcon;
  color: string;
  description?: string;
  totalValue?: string;
  eligibleValue?: string;
  fedrValue?: string;
  nationalValue?: string;
  documents: ProjectDocument[];
  statusCategories?: StatusCategory[];
}

// Projects data - these would come from database in production
const PROJECTS_DATA: Record<string, ProjectDetail> = {
  'coridor-mobilitate-301398': {
    id: 'coridor-mobilitate-301398',
    title: 'Coridor de mobilitate urbană prin crearea pistelor de biciclete și coridor prioritar pentru mijloc de transport în comun ecologic. Traseul I de la est la vest și traseul II de la sud la vest în Municipiul Salonta',
    shortTitle: 'Creare coridor de mobilitate urbană',
    smisCode: '301398',
    icon: Bike,
    color: 'emerald',
    totalValue: '73.741.896,01 lei',
    eligibleValue: '70.158.693,21 lei',
    fedrValue: '59.634.889,23 lei',
    nationalValue: '9.120.630,12 lei',
    documents: [
      { label: 'Comunicat de presă privind demararea proiectului', url: '#', date: '26.04.2024' },
    ],
    statusCategories: [
      {
        title: 'Stadiu la 4 luni',
        updates: [
          {
            period: 'August 2024',
            date: 'August 2024',
            title: 'Stadiu implementare - August 2024',
            content: 'Unitatea Administrativ Teritorială Municipiul Salonta și Agenția de Dezvoltare Regională Nord-Vest, au semnat în data de 26.04.2024, contractul de finanțare pentru obiectivul de investiții "CORIDOR DE MOBILITATE URBANĂ PRIN CREAREA PISTELOR DE BICICLETE ȘI CORIDOR PRIORITAR PENTRU MIJLOC DE TRANSPORT ÎN COMUN ECOLOGIC. TRASEUL I DE LA EST LA VEST ȘI TRASEUL II DE LA SUD LA VEST ÎN MUNICIPIUL SALONTA", cod SMIS: 301398.',
            images: [],
          },
          {
            period: 'Decembrie 2024',
            date: 'Decembrie 2024',
            title: 'Stadiu implementare - Decembrie 2024',
            content: 'Au fost continuate lucrările de implementare conform graficului stabilit.',
            images: [],
          },
          {
            period: 'Aprilie 2025',
            date: 'Aprilie 2025',
            title: 'Stadiu implementare - Aprilie 2025',
            content: 'Progres semnificativ în implementarea proiectului.',
            images: [],
          },
          {
            period: 'August 2025',
            date: 'August 2025',
            title: 'Stadiu implementare - August 2025',
            content: 'În perioada mai 2025 – octombrie 2025 au fost realizate următoarele activități pentru implementare a proiectului:\n\n• Au fost executate lucrări etapizat, începând cu străzile: Bartók Béla, Rákóczi Ferenc, Crișan, Piața Unirii.\n• A fost semnat contractul pentru furnizarea mijloacelor de transport și a stațiilor de reîncărcare;\n• A fost emis ordinul de livrare a mijloacelor de transport și a stațiilor de reîncărcare;\n• Au fost realizate măsuri de informare și publicitate și realizarea acestora în conformitate cu Manualul de identitate vizuală pentru Programul Regional Nord-Vest 2021-2027.',
            images: [
              { src: '/images/projects/nord-vest/coridor-mobilitate/piata-unirii.jpg', alt: 'Piața Unirii', caption: 'Piața Unirii' },
              { src: '/images/projects/nord-vest/coridor-mobilitate/bartok-bela.jpg', alt: 'Bartok Bela', caption: 'Bartok Bela' },
              { src: '/images/projects/nord-vest/coridor-mobilitate/rakoczi-ferencz.jpg', alt: 'Rakoczi Ferencz', caption: 'Rakoczi Ferencz' },
              { src: '/images/projects/nord-vest/coridor-mobilitate/crisan.jpg', alt: 'Crișan', caption: 'Crișan' },
            ],
          },
        ],
      },
      {
        title: 'Stadiu la 6 luni',
        updates: [
          {
            period: 'Octombrie 2024',
            date: 'Octombrie 2024',
            title: 'Stadiu implementare - Octombrie 2024',
            content: 'Actualizare stadiu la 6 luni.',
            images: [],
          },
          {
            period: 'Aprilie 2025',
            date: 'Aprilie 2025',
            title: 'Stadiu implementare - Aprilie 2025',
            content: 'Actualizare stadiu la 6 luni.',
            images: [],
          },
          {
            period: 'Octombrie 2025',
            date: 'Octombrie 2025',
            title: 'Stadiu implementare - Octombrie 2025',
            content: 'Actualizare stadiu la 6 luni.',
            images: [],
          },
        ],
      },
    ],
  },
  'casa-roth-armin-311797': {
    id: 'casa-roth-armin-311797',
    title: 'Reabilitare interioară și dotare Casa Roth Armin',
    shortTitle: 'Reabilitare interioară și dotare Casa Roth Armin',
    smisCode: '311797',
    icon: Home,
    color: 'amber',
    documents: [
      { label: 'Comunicat de presă privind demararea proiectului', url: '#' },
    ],
    statusCategories: [],
  },
  'parc-specializare-319239': {
    id: 'parc-specializare-319239',
    title: 'Realizare Parc de Specializare Inteligentă',
    shortTitle: 'Realizare Parc de Specializare Inteligentă',
    smisCode: '319239',
    icon: Landmark,
    color: 'violet',
    documents: [
      { label: 'Comunicat de presă privind demararea proiectului', url: '#' },
    ],
    statusCategories: [],
  },
};

// Color utilities
const getColorClasses = (color: string) => {
  const colors: Record<string, { bg: string; text: string; border: string; badge: string }> = {
    emerald: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200', badge: 'bg-emerald-600' },
    amber: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200', badge: 'bg-amber-600' },
    violet: { bg: 'bg-violet-100', text: 'text-violet-700', border: 'border-violet-200', badge: 'bg-violet-600' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', badge: 'bg-blue-600' },
  };
  return colors[color] || colors.blue;
};

// Status update component
function StatusUpdateCard({ update, isExpanded, onToggle }: { 
  update: StatusUpdate; 
  isExpanded: boolean; 
  onToggle: () => void;
}) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-gray-500" />
          <span className="font-medium text-gray-900">{update.period}</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>
      
      {isExpanded && (
        <div className="p-4 space-y-4">
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 whitespace-pre-line">{update.content}</p>
          </div>
          
          {update.images && update.images.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {update.images.map((image, idx) => (
                <div key={idx} className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                  />
                  {image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-sm py-2 px-3 text-center">
                      {image.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Status category component
function StatusCategorySection({ category, tp }: { category: StatusCategory; tp: (key: string) => string }) {
  const [expandedUpdates, setExpandedUpdates] = useState<Set<number>>(new Set());

  const toggleUpdate = (index: number) => {
    setExpandedUpdates(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-3">
      <h4 className="font-semibold text-gray-800">{category.title}</h4>
      <div className="space-y-2">
        {category.updates.map((update, idx) => (
          <StatusUpdateCard
            key={idx}
            update={update}
            isExpanded={expandedUpdates.has(idx)}
            onToggle={() => toggleUpdate(idx)}
          />
        ))}
      </div>
    </div>
  );
}

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const t = useTranslations('navigation');
  const tp = useTranslations('programRegionalNordVestPage');

  const project = PROJECTS_DATA[projectId];

  if (!project) {
    return (
      <>
        <Breadcrumbs items={[
          { label: t('programe'), href: '/programe' },
          { label: t('programRegionalNordVest'), href: '/programe/program-regional-nord-vest' },
          { label: 'Proiect' }
        ]} />
        <Section background="white">
          <Container>
            <div className="text-center py-12">
              <p className="text-gray-500">Proiectul nu a fost găsit.</p>
              <Link href="/programe/program-regional-nord-vest" className="text-primary-600 hover:underline mt-4 inline-block">
                {tp('backToProjects')}
              </Link>
            </div>
          </Container>
        </Section>
      </>
    );
  }

  const colorClasses = getColorClasses(project.color);
  const Icon = project.icon;

  return (
    <>
      <Breadcrumbs items={[
        { label: t('programe'), href: '/programe' },
        { label: t('programRegionalNordVest'), href: '/programe/program-regional-nord-vest' },
        { label: project.shortTitle }
      ]} />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Back link */}
            <Link 
              href="/programe/program-regional-nord-vest"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              {tp('backToProjects')}
            </Link>

            {/* Project Header */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl ${colorClasses.bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-7 h-7 ${colorClasses.text}`} />
                  </div>
                  <div>
                    <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded ${colorClasses.badge} text-white mb-2`}>
                      {tp('smisCode')}: {project.smisCode}
                    </span>
                    <CardTitle className="text-xl font-bold text-gray-900 leading-snug">
                      {project.title}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Project Values */}
            {(project.totalValue || project.eligibleValue) && (
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Euro className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-gray-900">{tp('projectValue')}</h3>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {project.totalValue && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">{tp('projectValue')}</p>
                        <p className="text-lg font-semibold text-gray-900">{project.totalValue}</p>
                      </div>
                    )}
                    {project.eligibleValue && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">{tp('eligibleValue')}</p>
                        <p className="text-lg font-semibold text-gray-900">{project.eligibleValue}</p>
                      </div>
                    )}
                    {project.fedrValue && (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs text-blue-600 uppercase tracking-wide">{tp('fedrValue')}</p>
                        <p className="text-lg font-semibold text-blue-900">{project.fedrValue}</p>
                      </div>
                    )}
                    {project.nationalValue && (
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-xs text-green-600 uppercase tracking-wide">{tp('nationalValue')}</p>
                        <p className="text-lg font-semibold text-green-900">{project.nationalValue}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Documents */}
            {project.documents && project.documents.length > 0 && (
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">{tp('documents')}</h3>
                  </div>
                  <div className="space-y-2">
                    {project.documents.map((doc, idx) => (
                      <a
                        key={idx}
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Download className="w-5 h-5 text-gray-500" />
                        <span className="flex-1 text-gray-700">{doc.label}</span>
                        {doc.date && (
                          <span className="text-sm text-gray-400">{doc.date}</span>
                        )}
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Project Status */}
            {project.statusCategories && project.statusCategories.length > 0 && (
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">{tp('statusDescription')}</h3>
                  </div>
                  <div className="space-y-6">
                    {project.statusCategories.map((category, idx) => (
                      <StatusCategorySection key={idx} category={category} tp={tp} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Funding Notice */}
            <div className="p-6 bg-blue-50 border border-blue-100 rounded-xl">
              <p className="text-sm text-blue-800 mb-4">
                {tp('fundedBy')}
              </p>
              
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

