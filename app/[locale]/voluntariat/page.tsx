'use client';

import { useTranslations } from 'next-intl';
import { Heart, Download, FileText, Users, ClipboardList, Award, Calendar } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { type LucideIcon } from 'lucide-react';

// Types for volunteering documents
interface VolunteerDocument {
  id: string;
  title: string;
  description?: string;
  icon: LucideIcon;
  color: string;
  url: string;
}

// Volunteering documents
const VOLUNTEER_DOCUMENTS: VolunteerDocument[] = [
  {
    id: '1',
    title: 'Regulament voluntariat',
    description: 'Regulamentul de organizare a activității de voluntariat',
    icon: FileText,
    color: 'blue',
    url: '#',
  },
  {
    id: '2',
    title: 'Cerere tip voluntariat',
    description: 'Anexa 1, 1A - Formular de înscriere',
    icon: ClipboardList,
    color: 'green',
    url: '#',
  },
  {
    id: '3',
    title: 'Contract de voluntariat pt. adulți',
    description: 'Anexa 2 - Model contract pentru persoane majore',
    icon: FileText,
    color: 'violet',
    url: '#',
  },
  {
    id: '4',
    title: 'Fișa de voluntariat',
    description: 'Anexa A la contract',
    icon: Users,
    color: 'orange',
    url: '#',
  },
  {
    id: '5',
    title: 'Fișa de prezențe',
    description: 'Anexa 3 - Evidența participării',
    icon: Calendar,
    color: 'cyan',
    url: '#',
  },
  {
    id: '6',
    title: 'Fișa de evaluare a voluntarului',
    description: 'Anexa 4 - Formular de evaluare',
    icon: ClipboardList,
    color: 'amber',
    url: '#',
  },
  {
    id: '7',
    title: 'Certificat voluntariat',
    description: 'Anexa 5 - Model certificat de participare',
    icon: Award,
    color: 'rose',
    url: '#',
  },
];

// Color utilities
const getColorClasses = (color: string) => {
  const colors: Record<string, { bg: string; text: string; hover: string }> = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-700', hover: 'hover:bg-blue-200' },
    green: { bg: 'bg-green-100', text: 'text-green-700', hover: 'hover:bg-green-200' },
    violet: { bg: 'bg-violet-100', text: 'text-violet-700', hover: 'hover:bg-violet-200' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-700', hover: 'hover:bg-orange-200' },
    cyan: { bg: 'bg-cyan-100', text: 'text-cyan-700', hover: 'hover:bg-cyan-200' },
    amber: { bg: 'bg-amber-100', text: 'text-amber-700', hover: 'hover:bg-amber-200' },
    rose: { bg: 'bg-rose-100', text: 'text-rose-700', hover: 'hover:bg-rose-200' },
  };
  return colors[color] || colors.blue;
};

function DocumentCard({ doc }: { doc: VolunteerDocument }) {
  const colorClasses = getColorClasses(doc.color);
  const Icon = doc.icon;

  return (
    <a
      href={doc.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all group"
    >
      <div className={`w-12 h-12 rounded-xl ${colorClasses.bg} ${colorClasses.hover} flex items-center justify-center shrink-0 transition-colors`}>
        <Icon className={`w-6 h-6 ${colorClasses.text}`} />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
          {doc.title}
        </h3>
        {doc.description && (
          <p className="text-sm text-gray-500 mt-0.5">{doc.description}</p>
        )}
      </div>
      <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-600 text-white text-sm font-medium rounded-lg group-hover:bg-primary-700 transition-colors shrink-0">
        <Download className="w-4 h-4" />
        Descarcă
      </div>
    </a>
  );
}

export default function VoluntariatPage() {
  const t = useTranslations('navigation');
  const tv = useTranslations('voluntariatPage');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('voluntariat') }
      ]} />
      <PageHeader 
        titleKey="title" 
        icon="heart" 
        descriptionKey="description"
        namespace="voluntariatPage"
      />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <div className="mb-8 p-6 bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl border border-rose-100">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                  <Heart className="w-7 h-7 text-rose-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{tv('introTitle')}</h2>
                  <p className="text-gray-600 leading-relaxed">
                    {tv('introText')}
                  </p>
                </div>
              </div>
            </div>

            {/* Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary-600" />
                  {tv('documentsTitle')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {VOLUNTEER_DOCUMENTS.map((doc) => (
                    <DocumentCard key={doc.id} doc={doc} />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <p className="text-sm text-blue-800">
                {tv('contactInfo')}
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
