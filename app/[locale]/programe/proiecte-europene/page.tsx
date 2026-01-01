'use client';

import { useTranslations } from 'next-intl';
import { 
  Globe, 
  Download, 
  ExternalLink, 
  Leaf, 
  Sun, 
  Building2, 
  Bike, 
  Heart, 
  Users,
  Droplets,
  TreePine,
  Theater,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { type LucideIcon } from 'lucide-react';

// Types for projects
interface ProjectDocument {
  label: string;
  url: string;
  date?: string;
}

interface ExternalLink {
  label: string;
  url: string;
  type: 'website' | 'facebook' | 'instagram' | 'program';
}

interface Project {
  id: string;
  title: string;
  code?: string;
  description?: string;
  icon: LucideIcon;
  color: string;
  documents?: ProjectDocument[];
  externalLinks?: ExternalLink[];
  status?: 'active' | 'completed';
  gallery?: string[];
}

// Active projects data
const ACTIVE_PROJECTS: Project[] = [
  {
    id: 'solar-energy',
    title: 'Sprijinirea investițiilor în noi capacități de producere a energiei electrice produsă din surse regenerabile pentru autoconsumul Municipiului Salonta, Județul Bihor',
    code: 'SMIS 315113',
    icon: Sun,
    color: 'amber',
    status: 'active',
    documents: [
      { label: 'Comunicat de presă demarare proiect', url: '#' },
    ],
  },
  {
    id: 'geothermal-2',
    title: 'Creșterea producției de energie din resurse regenerabile mai puțin exploatate obținute în perimetrul geotermal Salonta – Etapa II',
    code: 'SMIS 326814',
    icon: Droplets,
    color: 'cyan',
    status: 'active',
    documents: [
      { label: 'Anunț lansare proiect', url: '#' },
    ],
  },
  {
    id: 'urban-regeneration',
    title: 'Regenerare urbană, zona Piața Libertății prin revitalizarea urbană, reconversie și refuncționalizare terenuri, suprafețe și clădiri degradate, vacante sau neutilizate în Mun. Salonta',
    code: 'SMIS 143479',
    icon: Building2,
    color: 'violet',
    status: 'active',
    documents: [
      { label: 'Anunț demarare proiect', url: '#' },
      { label: 'Studiu de regenerare urbană – Salonta', url: '#' },
      { label: 'Comunicat de presă: finalizare proiect', url: '#' },
    ],
  },
  {
    id: 'mobility-corridor',
    title: 'Coridor de mobilitate urbană prin crearea pistelor de biciclete și coridor prioritar pentru mijloc de transport în comun ecologic. Traseul I. de la est la vest și traseul II. de la sud la vest, în Mun. Salonta',
    icon: Bike,
    color: 'green',
    status: 'active',
    documents: [
      { label: 'Anunț demarare proiect', url: '#' },
      { label: 'Comunicat de presă: finalizare proiect', url: '#' },
    ],
  },
  {
    id: 'geothermal-1',
    title: 'Creșterea producției de energie din resurse regenerabile mai puțin exploatate obținute în perimetrul geotermal Salonta',
    icon: Droplets,
    color: 'teal',
    status: 'active',
    documents: [
      { label: 'Comunicat de presă – lansarea proiectului', url: '#' },
    ],
  },
  {
    id: 'bunicii-comunitatii',
    title: 'BUNICII COMUNITĂȚII SALONTA',
    icon: Heart,
    color: 'rose',
    status: 'active',
    documents: [
      { label: 'Raport de activitate a Centrului de zi Bunicii Comunității Salonta pe anul 2021', url: '#', date: '04.01.2022' },
      { label: 'Comunicat proiect', url: '#', date: '06.05.2020' },
      { label: 'Raport de activitate a Centrului de zi Bunicii Comunității Salonta pe anul 2020', url: '#', date: '05.01.2020' },
      { label: 'Anunț de interes public', url: '#', date: '28.11.2019' },
      { label: 'Anunț privind selectarea unui partener pentru realizarea proiectului', url: '#', date: '04.10.2018' },
      { label: 'Anunț privind rezultatele procedurii de selecție a partenerilor privați', url: '#', date: '06.11.2018' },
      { label: 'Raport privind procedura de selecție', url: '#', date: '06.11.2018' },
    ],
  },
  {
    id: 'centru-zi-batrani',
    title: 'Reabilitare și schimbare destinație în centru de zi Bătrânii Comunității Salonta',
    code: 'SMIS 115240',
    icon: Users,
    color: 'orange',
    status: 'active',
    documents: [
      { label: 'Machetă rezultate proiect', url: '#' },
      { label: 'Lista contractorilor implicați în implementarea proiectului', url: '#' },
      { label: 'Anunț de interes public', url: '#' },
    ],
  },
  {
    id: 'iphealth',
    title: 'ROHU 275 – IPHEALTH',
    icon: Heart,
    color: 'red',
    status: 'active',
    documents: [
      { label: 'Fișa de proiect', url: '#' },
    ],
  },
];

// Completed projects data
const COMPLETED_PROJECTS: Project[] = [
  {
    id: 'nature-corner',
    title: 'ROHU-14 – Conservarea, protejarea și promovarea valorilor naturale din zona transfrontalieră Salonta-Békéscsaba – The Nature Corner',
    icon: TreePine,
    color: 'emerald',
    status: 'completed',
    description: 'Împreună cu cei trei parteneri (Asociația Milvus Transilvania Vest, Orașul Békés, Asociația Körösök Völgye Natúrpark), Municipiul Salonta a lucrat din greu și a făcut progrese semnificative pentru protejarea, conservarea și promovarea valorilor naturale locale din zona transfrontalieră Salonta-Békéscsaba. Rezultatele vorbesc de la sine: avem acum 1519,41 ha reprezentând patrimoniul natural comun al zonei transfrontaliere Salonta-Békés, cu o stare de conservare îmbunătățită.',
    externalLinks: [
      { label: 'Website-ul proiectului', url: 'https://www.dropia.eu/', type: 'website' },
      { label: 'Facebook', url: 'https://www.facebook.com/dropia.eu/', type: 'facebook' },
      { label: 'Instagram', url: 'https://www.instagram.com/nature_corner_rohu14/', type: 'instagram' },
      { label: 'Site-ul programului', url: 'http://interreg-rohu.eu/en/home-en/', type: 'program' },
    ],
    documents: [
      { label: 'Ordin de începere a lucrărilor', url: '#' },
      { label: 'Comunicat de presă privind începerea lucrărilor la Cuibul Dropiei', url: '#', date: '31.08.2020' },
      { label: 'Comunicat de presă – Lacul cu stuf de la Salonta: de la eutrofizare la ecosistem viu', url: '#' },
      { label: 'Comunicat de presă – Un pas „verde" pentru mediu și comunitate!', url: '#' },
    ],
  },
  {
    id: 'webike',
    title: 'ROHU-140 – WeBike – Dezvoltarea pistei de biciclete din zona transfrontalieră Salonta – Békéscsaba',
    icon: Bike,
    color: 'lime',
    status: 'completed',
    documents: [
      { label: 'Ghidul biciclistului responsabil (flyer)', url: '#' },
      { label: 'Invitație la conferința finală + prezentare', url: '#' },
      { label: 'ROHU140 Poster', url: '#' },
      { label: 'Rezumat WeBike', url: '#' },
      { label: 'Invitație la conferința de deschidere a proiectului', url: '#' },
    ],
  },
  {
    id: 'cultural-cooperation',
    title: 'ROHU-280 – Cooperare culturală între cetățenii din zona transfrontalieră Salonta-Gyula',
    icon: Theater,
    color: 'purple',
    status: 'completed',
    documents: [
      { label: 'ROHU-280 Project summary', url: '#' },
      { label: 'Invitație la conferința de deschidere', url: '#', date: '10.04.2019' },
      { label: 'Invitație Noaptea Muzeelor ROHU280', url: '#', date: '18.05.2019' },
      { label: 'Invitație șezătoare ROHU280', url: '#', date: '22.06.2019' },
      { label: 'Invitație Festival de teatru ROHU280', url: '#', date: '22.06.2019' },
      { label: 'Festivalul Filmului pe Frontieră Salonta', url: '#', date: '23-25 aug. 2019' },
      { label: 'Invitație la conferința de închidere', url: '#', date: '17.10.2019' },
      { label: 'ROHU-280 Infographic: rezultate proiect', url: '#' },
    ],
  },
  {
    id: 'waterman2',
    title: 'Proiectul Waterman 2',
    icon: Droplets,
    color: 'blue',
    status: 'completed',
    documents: [],
  },
  {
    id: 'cooltoura',
    title: 'Proiectul CoolTourA',
    icon: Globe,
    color: 'indigo',
    status: 'completed',
    documents: [],
  },
  {
    id: 'hurobike',
    title: 'Proiectul HuRoBike',
    icon: Bike,
    color: 'sky',
    status: 'completed',
    documents: [],
  },
];

// Color utilities
const getColorClasses = (color: string) => {
  const colors: Record<string, { bg: string; text: string; badge: string }> = {
    amber: { bg: 'bg-amber-100', text: 'text-amber-700', badge: 'bg-amber-600' },
    cyan: { bg: 'bg-cyan-100', text: 'text-cyan-700', badge: 'bg-cyan-600' },
    violet: { bg: 'bg-violet-100', text: 'text-violet-700', badge: 'bg-violet-600' },
    green: { bg: 'bg-green-100', text: 'text-green-700', badge: 'bg-green-600' },
    teal: { bg: 'bg-teal-100', text: 'text-teal-700', badge: 'bg-teal-600' },
    rose: { bg: 'bg-rose-100', text: 'text-rose-700', badge: 'bg-rose-600' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-700', badge: 'bg-orange-600' },
    red: { bg: 'bg-red-100', text: 'text-red-700', badge: 'bg-red-600' },
    emerald: { bg: 'bg-emerald-100', text: 'text-emerald-700', badge: 'bg-emerald-600' },
    lime: { bg: 'bg-lime-100', text: 'text-lime-700', badge: 'bg-lime-600' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-700', badge: 'bg-purple-600' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-700', badge: 'bg-blue-600' },
    indigo: { bg: 'bg-indigo-100', text: 'text-indigo-700', badge: 'bg-indigo-600' },
    sky: { bg: 'bg-sky-100', text: 'text-sky-700', badge: 'bg-sky-600' },
  };
  return colors[color] || colors.blue;
};

function ProjectCard({ project }: { project: Project }) {
  const colorClasses = getColorClasses(project.color);
  const Icon = project.icon;

  return (
    <Card className="hover:shadow-md transition-shadow overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl ${colorClasses.bg} flex items-center justify-center shrink-0`}>
            <Icon className={`w-6 h-6 ${colorClasses.text}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              {project.code && (
                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${colorClasses.badge} text-white`}>
                  {project.code}
                </span>
              )}
              {project.status === 'completed' && (
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-green-100 text-green-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Finalizat
                </span>
              )}
              {project.status === 'active' && (
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-blue-100 text-blue-700 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  În derulare
                </span>
              )}
            </div>
            <CardTitle className="text-base font-semibold text-gray-900 leading-snug">
              {project.title}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Description */}
        {project.description && (
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            {project.description}
          </p>
        )}

        {/* External Links */}
        {project.externalLinks && project.externalLinks.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.externalLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                {link.label}
              </a>
            ))}
          </div>
        )}

        {/* Documents */}
        {project.documents && project.documents.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Documente</p>
            <div className="flex flex-wrap gap-2">
              {project.documents.map((doc, idx) => (
                <a
                  key={idx}
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                >
                  <Download className="w-3 h-3" />
                  <span>{doc.label}</span>
                  {doc.date && <span className="text-gray-400">({doc.date})</span>}
                </a>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function NatureCornerHighlights() {
  const highlights = [
    'împământarea a 6 km de linii de medie tensiune ca măsură de conservare a dropiilor (măsură de pionierat pentru singura populație viabilă de dropii din țară)',
    'construirea unui centru de vizitare pentru educație ecologică',
    'amenajarea și decolmatarea lacului cu stuf',
    'construirea unei piste de biciclete până la turnul de observare a speciilor locale',
    'dezvoltarea a 4 trasee tematice',
    'sensibilizarea populației la tema protecției valorilor naturale',
  ];

  return (
    <div className="mt-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
      <p className="text-sm font-medium text-emerald-800 mb-3">
        Rezultatele cele mai importante obținute la nivelul Municipiului Salonta:
      </p>
      <ul className="space-y-2">
        {highlights.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm text-emerald-700">
            <Leaf className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <p className="text-sm text-emerald-700 mt-3 italic">
        Proiectul s-a finalizat în 30 iunie 2023, dar Municipiul Salonta va continua eforturile pentru un viitor durabil și mai verde.
      </p>
    </div>
  );
}

export default function ProiecteEuropenePage() {
  const t = useTranslations('navigation');
  const tp = useTranslations('proiecteEuropenePage');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('programe'), href: '/programe' },
        { label: t('proiecteEuropene') }
      ]} />
      <PageHeader titleKey="proiecteEuropene" icon="globe" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            <p className="text-lg text-gray-600 mb-8 text-center">
              {tp('description')}
            </p>

            {/* Active Projects */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{tp('activeProjects')}</h2>
              </div>
              <div className="grid gap-4">
                {ACTIVE_PROJECTS.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>

            {/* Completed Projects */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{tp('completedProjects')}</h2>
              </div>
              <div className="grid gap-4">
                {COMPLETED_PROJECTS.map((project) => (
                  <div key={project.id}>
                    <ProjectCard project={project} />
                    {project.id === 'nature-corner' && <NatureCornerHighlights />}
                  </div>
                ))}
              </div>
            </div>

            {/* EU Funding Notice */}
            <div className="mt-10 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
              <Globe className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800">
                {tp('fundingNotice')}
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
