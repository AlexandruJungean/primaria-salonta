'use client';

import { useTranslations } from 'next-intl';
import { Euro, Download, FileText, Building, Bike, GraduationCap, Cpu, Baby } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { type LucideIcon } from 'lucide-react';

// Types for PNRR projects
interface Attachment {
  label: string;
  url: string;
}

interface PnrrProject {
  id: string;
  code: string;
  title: string;
  category: 'C5' | 'C10' | 'C15';
  attachments?: Attachment[];
  url?: string;
}

// Category info
const CATEGORIES: Record<string, { label: string; color: string; icon: LucideIcon }> = {
  C5: { label: 'C5 - Eficiență energetică', color: 'bg-emerald-100 text-emerald-700', icon: Building },
  C10: { label: 'C10 - Transport și TIC', color: 'bg-blue-100 text-blue-700', icon: Bike },
  C15: { label: 'C15 - Educație', color: 'bg-purple-100 text-purple-700', icon: GraduationCap },
};

// Mock data - will be replaced with database content
const PNRR_PROJECTS: PnrrProject[] = [
  {
    id: '1',
    code: 'C5-A3.1-10',
    title: 'Renovarea energetică moderată a clădirilor rezidențiale multifamiliale din Mun. Salonta, prin reabilitarea termică a elementelor de anvelopă a clădirii – Proiect nr. 1 (str. Republicii, blocurile D1-D5)',
    category: 'C5',
    attachments: [{ label: 'Anunț începere implementare proiect', url: '#' }],
    url: '#',
  },
  {
    id: '2',
    code: 'C5-A3.1-77',
    title: 'Renovarea energetică moderată a clădirilor rezidențiale multifamiliale din Mun. Salonta, prin reabilitarea termică a elementelor de anvelopă a clădirii – Proiect nr. 2 (str. Republicii, blocurile AN1-AN5, R1)',
    category: 'C5',
    attachments: [{ label: 'Anunț începere implementare proiect', url: '#' }],
    url: '#',
  },
  {
    id: '3',
    code: 'C5-A3.1-93',
    title: 'Renovarea energetică moderată a clădirilor rezidențiale multifamiliale din Mun. Salonta, prin reabilitarea termică a elementelor de anvelopă a clădirii – Proiect nr. 3 (str. Republicii, blocurile D6-D13)',
    category: 'C5',
    attachments: [{ label: 'Anunț începere implementare proiect', url: '#' }],
    url: '#',
  },
  {
    id: '4',
    code: 'C5-A3.1-105',
    title: 'Renovarea energetică moderată a clădirilor rezidențiale multifamiliale din Mun. Salonta, prin reabilitarea termică a elementelor de anvelopă a clădirii – Proiect nr. 4 (str. Corneliu Coposu sc. A-D, str. Kossuth Lajos nr. 2)',
    category: 'C5',
    attachments: [{ label: 'Anunț începere implementare proiect', url: '#' }],
    url: '#',
  },
  {
    id: '5',
    code: 'C5-A3.1-112',
    title: 'Renovarea energetică moderată a clădirilor rezidențiale multifamiliale din Mun. Salonta, prin reabilitarea termică a elementelor de anvelopă a clădirii – Proiect nr. 5 (Al. Petre Paulescu, blocul D60)',
    category: 'C5',
    attachments: [{ label: 'Anunț începere implementare proiect', url: '#' }],
    url: '#',
  },
  {
    id: '6',
    code: 'C5-B2.1.a-1766',
    title: 'Creșterea eficienței energetice și gestionarea inteligentă a energiei în unitatea de învățământ Liceul Tehnologic nr. 1 din Mun. Salonta',
    category: 'C5',
    attachments: [{ label: 'Anunț începere implementare proiect', url: '#' }],
    url: '#',
  },
  {
    id: '7',
    code: 'C5',
    title: 'Creșterea eficienței energetice și gestionarea inteligentă a energiei în Primăria Municipiului Salonta, județul Bihor',
    category: 'C5',
    attachments: [{ label: 'Anunț începere implementare proiect', url: '#' }],
    url: '#',
  },
  {
    id: '8',
    code: 'C5',
    title: 'Creșterea eficienței energetice și gestionarea inteligentă a energiei în unitatea de învățământ Colegiul Național Teodor Neș din Municipiul Salonta, județul Bihor',
    category: 'C5',
    attachments: [{ label: 'Anunț începere implementare proiect', url: '#' }],
    url: '#',
  },
  {
    id: '9',
    code: 'C10',
    title: 'Dezvoltarea infrastructurii TIC prin sisteme inteligente de management urban în Municipiul Salonta, județul Bihor',
    category: 'C10',
    attachments: [{ label: 'Anunț începere implementare proiect', url: '#' }],
    url: '#',
  },
  {
    id: '10',
    code: 'C10',
    title: 'Asigurarea infrastructurii pentru transportul verde prin amenajarea pistelor pentru biciclete în municipiul Salonta, Județul Bihor',
    category: 'C10',
    attachments: [{ label: 'Anunț începere implementare proiect', url: '#' }],
    url: '#',
  },
  {
    id: '11',
    code: 'C15',
    title: 'Dotarea cu mobilier, materiale didactice și echipamente a unităților de învățământ preuniversitar din Municipiul Salonta, Jud. Bihor',
    category: 'C15',
    attachments: [{ label: 'Anunț începere implementare proiect', url: '#' }],
    url: '#',
  },
  {
    id: '12',
    code: 'C15',
    title: 'Construire și dotare creșă mică, municipiul Salonta, județul Bihor',
    category: 'C15',
    attachments: [
      { label: 'Comunicat de presă', url: '#' },
      { label: 'Anunț informații AC creșă mică', url: '#' },
      { label: 'Plan de situație creșă mică', url: '#' },
      { label: 'Planșă fațade creșă mică', url: '#' },
    ],
    url: '#',
  },
];

function ProjectCard({ project }: { project: PnrrProject }) {
  const categoryInfo = CATEGORIES[project.category];
  const CategoryIcon = categoryInfo.icon;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex flex-col gap-3">
          {/* Header with category and code */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${categoryInfo.color.replace('text-', 'bg-').replace('700', '100')}`}>
                <CategoryIcon className={`w-5 h-5 ${categoryInfo.color.split(' ')[1]}`} />
              </div>
              <div className="min-w-0">
                <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded ${categoryInfo.color}`}>
                  {project.code}
                </span>
                <h3 className="font-medium text-gray-900 text-sm mt-1.5 leading-snug">
                  {project.title}
                </h3>
              </div>
            </div>
          </div>

          {/* Attachments */}
          {project.attachments && project.attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
              {project.attachments.map((attachment, idx) => (
                <a
                  key={idx}
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
                >
                  <Download className="w-3 h-3" />
                  {attachment.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function PnrrPage() {
  const t = useTranslations('navigation');
  const tp = useTranslations('pnrrPage');

  // Group projects by category
  const c5Projects = PNRR_PROJECTS.filter((p) => p.category === 'C5');
  const c10Projects = PNRR_PROJECTS.filter((p) => p.category === 'C10');
  const c15Projects = PNRR_PROJECTS.filter((p) => p.category === 'C15');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('programe'), href: '/programe' },
        { label: t('pnrr') }
      ]} />
      <PageHeader titleKey="pnrr" icon="euro" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            <p className="text-lg text-gray-600 mb-8 text-center">
              {tp('description')}
            </p>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-8 p-4 bg-gray-50 rounded-xl">
              {Object.entries(CATEGORIES).map(([key, cat]) => {
                const Icon = cat.icon;
                return (
                  <div key={key} className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded flex items-center justify-center ${cat.color.replace('text-', 'bg-').replace('700', '100')}`}>
                      <Icon className={`w-3.5 h-3.5 ${cat.color.split(' ')[1]}`} />
                    </div>
                    <span className="text-sm text-gray-600">{cat.label}</span>
                  </div>
                );
              })}
            </div>

            {/* C5 Projects */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Building className="w-5 h-5 text-emerald-600" />
                {tp('c5Title')}
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {c5Projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>

            {/* C10 Projects */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Bike className="w-5 h-5 text-blue-600" />
                {tp('c10Title')}
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {c10Projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>

            {/* C15 Projects */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-purple-600" />
                {tp('c15Title')}
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {c15Projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>

            {/* Info box */}
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
              <p className="text-sm text-amber-800">
                {tp('infoText')}
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
