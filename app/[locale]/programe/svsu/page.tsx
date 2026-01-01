'use client';

import { useTranslations } from 'next-intl';
import { 
  Siren, 
  Download, 
  FileText, 
  Shield, 
  Flame, 
  Droplets, 
  AlertTriangle,
  Baby,
  Home,
  Users,
  ClipboardList,
  BookOpen,
  Calendar
} from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { type LucideIcon } from 'lucide-react';

// Types for SVSU documents
interface SVSUDocument {
  id: string;
  title: string;
  icon: LucideIcon;
  color: string;
  url: string;
  category: 'info' | 'plans' | 'prevention' | 'materials' | 'recruitment';
}

// SVSU Documents organized by category
const SVSU_DOCUMENTS: SVSUDocument[] = [
  // Info & Plans
  {
    id: 'fisa',
    title: 'Fișa SVSU',
    icon: FileText,
    color: 'blue',
    url: '#',
    category: 'info',
  },
  {
    id: 'controale',
    title: 'Planificarea controalelor preventive',
    icon: Calendar,
    color: 'violet',
    url: '#',
    category: 'plans',
  },
  {
    id: 'pregatire',
    title: 'Planul de pregătire',
    icon: BookOpen,
    color: 'green',
    url: '#',
    category: 'plans',
  },
  // Prevention
  {
    id: 'masuri',
    title: 'Măsuri preventive',
    icon: Shield,
    color: 'amber',
    url: '#',
    category: 'prevention',
  },
  {
    id: 'copii',
    title: 'Siguranța copiilor',
    icon: Baby,
    color: 'pink',
    url: '#',
    category: 'prevention',
  },
  {
    id: 'evacuare',
    title: 'Evacuare în siguranță',
    icon: AlertTriangle,
    color: 'orange',
    url: '#',
    category: 'prevention',
  },
  // Materials - Fire
  {
    id: 'vegetatie',
    title: 'Broșură – arderea vegetației uscate',
    icon: Flame,
    color: 'red',
    url: '#',
    category: 'materials',
  },
  {
    id: 'foc-deschis',
    title: 'Broșură – măs. gen foc deschis',
    icon: Flame,
    color: 'red',
    url: '#',
    category: 'materials',
  },
  // Materials - Disasters
  {
    id: 'cutremur',
    title: 'Afiș – cutremur fr. 2011',
    icon: AlertTriangle,
    color: 'yellow',
    url: '#',
    category: 'materials',
  },
  {
    id: 'industrial',
    title: 'Afiș – accident industrial fr. 2011',
    icon: AlertTriangle,
    color: 'gray',
    url: '#',
    category: 'materials',
  },
  {
    id: 'transport',
    title: 'Afiș – transport materiale periculoase fr. 2011',
    icon: AlertTriangle,
    color: 'purple',
    url: '#',
    category: 'materials',
  },
  // Materials - Floods
  {
    id: 'inundatii-acc',
    title: 'Afiș – inundații accidentale',
    icon: Droplets,
    color: 'cyan',
    url: '#',
    category: 'materials',
  },
  {
    id: 'inundatii',
    title: 'Afiș – inundații',
    icon: Droplets,
    color: 'blue',
    url: '#',
    category: 'materials',
  },
  // Materials - Households
  {
    id: 'gospodarii-1',
    title: 'Pliant – gospodării 1',
    icon: Home,
    color: 'teal',
    url: '#',
    category: 'materials',
  },
  {
    id: 'gospodarii-2',
    title: 'Pliant – gospodării 2',
    icon: Home,
    color: 'teal',
    url: '#',
    category: 'materials',
  },
  // Recruitment
  {
    id: 'registru',
    title: 'Registru Istoric',
    icon: ClipboardList,
    color: 'slate',
    url: '#',
    category: 'recruitment',
  },
  {
    id: 'recrutare',
    title: 'Recrutare personal',
    icon: Users,
    color: 'emerald',
    url: '#',
    category: 'recruitment',
  },
];

// Color utilities
const getColorClasses = (color: string) => {
  const colors: Record<string, { bg: string; text: string }> = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-700' },
    violet: { bg: 'bg-violet-100', text: 'text-violet-700' },
    green: { bg: 'bg-green-100', text: 'text-green-700' },
    amber: { bg: 'bg-amber-100', text: 'text-amber-700' },
    pink: { bg: 'bg-pink-100', text: 'text-pink-700' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-700' },
    red: { bg: 'bg-red-100', text: 'text-red-700' },
    yellow: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
    gray: { bg: 'bg-gray-100', text: 'text-gray-700' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-700' },
    cyan: { bg: 'bg-cyan-100', text: 'text-cyan-700' },
    teal: { bg: 'bg-teal-100', text: 'text-teal-700' },
    slate: { bg: 'bg-slate-100', text: 'text-slate-700' },
    emerald: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  };
  return colors[color] || colors.blue;
};

function DocumentButton({ doc }: { doc: SVSUDocument }) {
  const colorClasses = getColorClasses(doc.color);
  const Icon = doc.icon;

  return (
    <a
      href={doc.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-primary-200 hover:shadow-sm transition-all group"
    >
      <div className={`w-10 h-10 rounded-lg ${colorClasses.bg} flex items-center justify-center shrink-0`}>
        <Icon className={`w-5 h-5 ${colorClasses.text}`} />
      </div>
      <span className="flex-1 text-sm font-medium text-gray-700 group-hover:text-primary-600 transition-colors">
        {doc.title}
      </span>
      <Download className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors" />
    </a>
  );
}

export default function SvsuPage() {
  const t = useTranslations('navigation');
  const ts = useTranslations('svsuPage');

  const infoDocuments = SVSU_DOCUMENTS.filter(d => d.category === 'info');
  const planDocuments = SVSU_DOCUMENTS.filter(d => d.category === 'plans');
  const preventionDocuments = SVSU_DOCUMENTS.filter(d => d.category === 'prevention');
  const materialDocuments = SVSU_DOCUMENTS.filter(d => d.category === 'materials');
  const recruitmentDocuments = SVSU_DOCUMENTS.filter(d => d.category === 'recruitment');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('programe'), href: '/programe' },
        { label: t('svsu') }
      ]} />
      <PageHeader 
        titleKey="svsu" 
        icon="siren" 
        descriptionKey="description"
        namespace="svsuPage"
      />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            {/* Hero Banner */}
            <div className="mb-8 p-6 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border border-red-100">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                  <Siren className="w-7 h-7 text-red-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{ts('missionTitle')}</h2>
                  <p className="text-gray-600 leading-relaxed">
                    {ts('missionText')}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Information */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    {ts('infoSection')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {infoDocuments.map((doc) => (
                    <DocumentButton key={doc.id} doc={doc} />
                  ))}
                </CardContent>
              </Card>

              {/* Plans */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-violet-600" />
                    {ts('plansSection')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {planDocuments.map((doc) => (
                    <DocumentButton key={doc.id} doc={doc} />
                  ))}
                </CardContent>
              </Card>

              {/* Prevention */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Shield className="w-5 h-5 text-amber-600" />
                    {ts('preventionSection')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {preventionDocuments.map((doc) => (
                    <DocumentButton key={doc.id} doc={doc} />
                  ))}
                </CardContent>
              </Card>

              {/* Recruitment */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="w-5 h-5 text-emerald-600" />
                    {ts('recruitmentSection')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {recruitmentDocuments.map((doc) => (
                    <DocumentButton key={doc.id} doc={doc} />
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Materials - Full Width */}
            <Card className="mt-6">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-red-600" />
                  {ts('materialsSection')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {materialDocuments.map((doc) => (
                    <DocumentButton key={doc.id} doc={doc} />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <Siren className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="font-bold text-red-800">{ts('emergencyTitle')}</p>
                <p className="text-sm text-red-700">{ts('emergencyText')}</p>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
