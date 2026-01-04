'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useParams } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { Link } from '@/components/ui/link';
import { notFound } from 'next/navigation';
import { 
  Calendar, 
  Clock,
  MapPin,
  ArrowLeft, 
  FileText, 
  Download,
  Users,
  ListOrdered,
  CheckCircle2,
  XCircle,
  MinusCircle
} from 'lucide-react';

// ============================================
// MOCK DATA - Will be replaced with Supabase
// ============================================

type SessionType = 'ordinara' | 'extraordinara' | 'de_indata';
type AgendaItemStatus = 'approved' | 'rejected' | 'postponed' | 'withdrawn' | 'pending';

interface AgendaItem {
  id: string;
  number: number;
  title: { ro: string; hu: string; en: string };
  status: AgendaItemStatus;
  decisionNumber?: number;
  decisionUrl?: string;
  votes?: {
    for: number;
    against: number;
    abstain: number;
  };
}

interface SessionDocument {
  id: string;
  type: 'dispozitie_convocare' | 'proiect_ordine_zi' | 'proces_verbal' | 'materiale' | 'other';
  title: { ro: string; hu: string; en: string };
  url: string;
}

interface CouncilSession {
  id: string;
  slug: string;
  type: SessionType;
  date: string;
  time: string;
  location: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  attendees?: {
    present: number;
    absent: number;
    total: number;
  };
  agenda: AgendaItem[];
  documents: SessionDocument[];
}

const SESSION_TYPE_LABELS: Record<SessionType, { ro: string; hu: string; en: string; color: string }> = {
  ordinara: { 
    ro: 'Ședință Ordinară', 
    hu: 'Rendes ülés', 
    en: 'Regular Session',
    color: 'bg-blue-100 text-blue-800',
  },
  extraordinara: { 
    ro: 'Ședință Extraordinară', 
    hu: 'Rendkívüli ülés', 
    en: 'Extraordinary Session',
    color: 'bg-amber-100 text-amber-800',
  },
  de_indata: { 
    ro: 'Ședință de Îndată', 
    hu: 'Sürgősségi ülés', 
    en: 'Emergency Session',
    color: 'bg-red-100 text-red-800',
  },
};

const STATUS_LABELS: Record<string, { ro: string; hu: string; en: string }> = {
  scheduled: { ro: 'Programată', hu: 'Ütemezett', en: 'Scheduled' },
  completed: { ro: 'Finalizată', hu: 'Befejezett', en: 'Completed' },
  cancelled: { ro: 'Anulată', hu: 'Törölve', en: 'Cancelled' },
};

const AGENDA_STATUS_LABELS: Record<AgendaItemStatus, { ro: string; hu: string; en: string; icon: typeof CheckCircle2; color: string }> = {
  approved: { 
    ro: 'Aprobat', 
    hu: 'Elfogadva', 
    en: 'Approved',
    icon: CheckCircle2,
    color: 'text-green-600',
  },
  rejected: { 
    ro: 'Respins', 
    hu: 'Elutasítva', 
    en: 'Rejected',
    icon: XCircle,
    color: 'text-red-600',
  },
  postponed: { 
    ro: 'Amânat', 
    hu: 'Elhalasztva', 
    en: 'Postponed',
    icon: MinusCircle,
    color: 'text-amber-600',
  },
  withdrawn: { 
    ro: 'Retras', 
    hu: 'Visszavonva', 
    en: 'Withdrawn',
    icon: MinusCircle,
    color: 'text-gray-600',
  },
  pending: { 
    ro: 'În așteptare', 
    hu: 'Függőben', 
    en: 'Pending',
    icon: MinusCircle,
    color: 'text-gray-400',
  },
};

const DOCUMENT_TYPE_LABELS: Record<string, { ro: string; hu: string; en: string }> = {
  dispozitie_convocare: { ro: 'Dispoziție de convocare', hu: 'Összehívási rendelkezés', en: 'Convocation Order' },
  proiect_ordine_zi: { ro: 'Proiect ordine de zi', hu: 'Napirend tervezet', en: 'Draft Agenda' },
  proces_verbal: { ro: 'Proces verbal', hu: 'Jegyzőkönyv', en: 'Minutes' },
  materiale: { ro: 'Materiale de ședință', hu: 'Ülési anyagok', en: 'Session Materials' },
  other: { ro: 'Alte documente', hu: 'Egyéb dokumentumok', en: 'Other Documents' },
};

const MOCK_SESSIONS: Record<string, CouncilSession> = {
  '19-decembrie-2025': {
    id: '1',
    slug: '19-decembrie-2025',
    type: 'ordinara',
    date: '2025-12-19',
    time: '14:00',
    location: 'Sala de ședințe a Primăriei Municipiului Salonta',
    status: 'scheduled',
    agenda: [
      {
        id: 'a1',
        number: 1,
        title: {
          ro: 'Aprobarea procesului-verbal al ședinței anterioare din data de 27.11.2025',
          hu: 'A 2025.11.27-i előző ülés jegyzőkönyvének jóváhagyása',
          en: 'Approval of the minutes of the previous session from 27.11.2025',
        },
        status: 'pending',
      },
      {
        id: 'a2',
        number: 2,
        title: {
          ro: 'Proiect de hotărâre privind rectificarea bugetului local pe anul 2025',
          hu: 'Határozattervezet a 2025-ös helyi költségvetés módosításáról',
          en: 'Draft decision on rectification of the 2025 local budget',
        },
        status: 'pending',
      },
      {
        id: 'a3',
        number: 3,
        title: {
          ro: 'Proiect de hotărâre privind stabilirea taxelor și impozitelor locale pentru anul 2026',
          hu: 'Határozattervezet a 2026-os helyi adók és illetékek megállapításáról',
          en: 'Draft decision on local taxes and fees for 2026',
        },
        status: 'pending',
      },
      {
        id: 'a4',
        number: 4,
        title: {
          ro: 'Proiect de hotărâre privind organizarea evenimentelor de Revelion 2025-2026',
          hu: 'Határozattervezet a 2025-2026-os szilveszteri rendezvények szervezéséről',
          en: 'Draft decision on organizing New Year\'s Eve events 2025-2026',
        },
        status: 'pending',
      },
      {
        id: 'a5',
        number: 5,
        title: {
          ro: 'Diverse',
          hu: 'Egyebek',
          en: 'Miscellaneous',
        },
        status: 'pending',
      },
    ],
    documents: [
      {
        id: 'd1',
        type: 'dispozitie_convocare',
        title: { ro: 'Dispoziție convocare nr. 456/2025', hu: '456/2025 sz. összehívási rendelkezés', en: 'Convocation Order no. 456/2025' },
        url: '#',
      },
      {
        id: 'd2',
        type: 'proiect_ordine_zi',
        title: { ro: 'Proiect ordine de zi', hu: 'Napirend tervezet', en: 'Draft Agenda' },
        url: '#',
      },
      {
        id: 'd3',
        type: 'materiale',
        title: { ro: 'Materiale de ședință', hu: 'Ülési anyagok', en: 'Session Materials' },
        url: '#',
      },
    ],
  },
  '27-noiembrie-2025': {
    id: '2',
    slug: '27-noiembrie-2025',
    type: 'ordinara',
    date: '2025-11-27',
    time: '14:00',
    location: 'Sala de ședințe a Primăriei Municipiului Salonta',
    status: 'completed',
    attendees: {
      present: 17,
      absent: 2,
      total: 19,
    },
    agenda: [
      {
        id: 'a1',
        number: 1,
        title: {
          ro: 'Aprobarea procesului-verbal al ședinței anterioare',
          hu: 'Az előző ülés jegyzőkönyvének jóváhagyása',
          en: 'Approval of the minutes of the previous session',
        },
        status: 'approved',
        votes: { for: 17, against: 0, abstain: 0 },
      },
      {
        id: 'a2',
        number: 2,
        title: {
          ro: 'Proiect de hotărâre privind aprobarea execuției bugetare pe trimestrul III 2025',
          hu: 'Határozattervezet a 2025. III. negyedévi költségvetés végrehajtásának jóváhagyásáról',
          en: 'Draft decision on approval of budget execution for Q3 2025',
        },
        status: 'approved',
        decisionNumber: 233,
        decisionUrl: '#',
        votes: { for: 15, against: 0, abstain: 2 },
      },
      {
        id: 'a3',
        number: 3,
        title: {
          ro: 'Proiect de hotărâre privind aprobarea Planului de acțiune pentru energie durabilă',
          hu: 'Határozattervezet a fenntartható energiagazdálkodási cselekvési terv jóváhagyásáról',
          en: 'Draft decision on approval of Sustainable Energy Action Plan',
        },
        status: 'approved',
        decisionNumber: 232,
        decisionUrl: '#',
        votes: { for: 16, against: 0, abstain: 1 },
      },
      {
        id: 'a4',
        number: 4,
        title: {
          ro: 'Proiect de hotărâre privind modificarea organigramei instituției',
          hu: 'Határozattervezet az intézmény szervezeti felépítésének módosításáról',
          en: 'Draft decision on modification of institution\'s organizational structure',
        },
        status: 'postponed',
      },
      {
        id: 'a5',
        number: 5,
        title: {
          ro: 'Proiect de hotărâre privind concesionarea unui teren',
          hu: 'Határozattervezet egy telek koncesszióba adásáról',
          en: 'Draft decision on land concession',
        },
        status: 'approved',
        decisionNumber: 231,
        decisionUrl: '#',
        votes: { for: 14, against: 2, abstain: 1 },
      },
      {
        id: 'a6',
        number: 6,
        title: {
          ro: 'Diverse',
          hu: 'Egyebek',
          en: 'Miscellaneous',
        },
        status: 'approved',
      },
    ],
    documents: [
      {
        id: 'd1',
        type: 'dispozitie_convocare',
        title: { ro: 'Dispoziție convocare nr. 412/2025', hu: '412/2025 sz. összehívási rendelkezés', en: 'Convocation Order no. 412/2025' },
        url: '#',
      },
      {
        id: 'd2',
        type: 'proiect_ordine_zi',
        title: { ro: 'Proiect ordine de zi', hu: 'Napirend tervezet', en: 'Draft Agenda' },
        url: '#',
      },
      {
        id: 'd3',
        type: 'proces_verbal',
        title: { ro: 'Proces verbal al ședinței', hu: 'Az ülés jegyzőkönyve', en: 'Session Minutes' },
        url: '#',
      },
      {
        id: 'd4',
        type: 'materiale',
        title: { ro: 'Materiale de ședință', hu: 'Ülési anyagok', en: 'Session Materials' },
        url: '#',
      },
    ],
  },
  '10-noiembrie-2025': {
    id: '3',
    slug: '10-noiembrie-2025',
    type: 'extraordinara',
    date: '2025-11-10',
    time: '10:00',
    location: 'Sala de ședințe a Primăriei Municipiului Salonta',
    status: 'completed',
    attendees: {
      present: 18,
      absent: 1,
      total: 19,
    },
    agenda: [
      {
        id: 'a1',
        number: 1,
        title: {
          ro: 'Proiect de hotărâre privind aprobarea de urgență a achiziției de utilaje pentru deszăpezire',
          hu: 'Határozattervezet a hóeltakarító gépek sürgős beszerzésének jóváhagyásáról',
          en: 'Draft decision on urgent approval of snow removal equipment acquisition',
        },
        status: 'approved',
        decisionNumber: 225,
        decisionUrl: '#',
        votes: { for: 18, against: 0, abstain: 0 },
      },
      {
        id: 'a2',
        number: 2,
        title: {
          ro: 'Proiect de hotărâre privind alocarea fondurilor pentru situații de urgență',
          hu: 'Határozattervezet a vészhelyzeti alapok elosztásáról',
          en: 'Draft decision on allocation of emergency funds',
        },
        status: 'approved',
        decisionNumber: 226,
        decisionUrl: '#',
        votes: { for: 17, against: 0, abstain: 1 },
      },
    ],
    documents: [
      {
        id: 'd1',
        type: 'dispozitie_convocare',
        title: { ro: 'Dispoziție convocare', hu: 'Összehívási rendelkezés', en: 'Convocation Order' },
        url: '#',
      },
      {
        id: 'd2',
        type: 'proces_verbal',
        title: { ro: 'Proces verbal al ședinței', hu: 'Az ülés jegyzőkönyve', en: 'Session Minutes' },
        url: '#',
      },
    ],
  },
};

// ============================================
// COMPONENT
// ============================================

export default function SedintaDetailPage() {
  const t = useTranslations('navigation');
  const locale = useLocale() as 'ro' | 'hu' | 'en';
  const params = useParams();
  const slug = params.slug as string;

  const session = MOCK_SESSIONS[slug];

  if (!session) {
    notFound();
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(
      locale === 'ro' ? 'ro-RO' : locale === 'hu' ? 'hu-HU' : 'en-US',
      { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
    );
  };

  const formatShortDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(
      locale === 'ro' ? 'ro-RO' : locale === 'hu' ? 'hu-HU' : 'en-US',
      { day: 'numeric', month: 'long', year: 'numeric' }
    );
  };

  const pageLabels = {
    ro: {
      backToList: 'Înapoi la ședințe',
      date: 'Data',
      time: 'Ora',
      location: 'Locație',
      attendance: 'Prezență',
      present: 'Prezenți',
      absent: 'Absenți',
      agenda: 'Ordine de zi',
      documents: 'Documente',
      votes: 'Voturi',
      for: 'Pentru',
      against: 'Împotrivă',
      abstain: 'Abțineri',
      decision: 'Hotărârea nr.',
    },
    hu: {
      backToList: 'Vissza az ülésekhez',
      date: 'Dátum',
      time: 'Időpont',
      location: 'Helyszín',
      attendance: 'Jelenlét',
      present: 'Jelen',
      absent: 'Távol',
      agenda: 'Napirend',
      documents: 'Dokumentumok',
      votes: 'Szavazatok',
      for: 'Mellette',
      against: 'Ellene',
      abstain: 'Tartózkodás',
      decision: 'Határozat sz.',
    },
    en: {
      backToList: 'Back to sessions',
      date: 'Date',
      time: 'Time',
      location: 'Location',
      attendance: 'Attendance',
      present: 'Present',
      absent: 'Absent',
      agenda: 'Agenda',
      documents: 'Documents',
      votes: 'Votes',
      for: 'For',
      against: 'Against',
      abstain: 'Abstain',
      decision: 'Decision no.',
    },
  };

  const labels = pageLabels[locale];

  return (
    <>
      <Breadcrumbs items={[
        { label: t('consiliulLocal'), href: '/consiliul-local' },
        { label: t('sedinte') || 'Ședințe', href: '/consiliul-local/sedinte' },
        { label: formatShortDate(session.date) },
      ]} />

      <PageHeader 
        titleKey="sedinte" 
        icon="users"
        subtitle={formatDate(session.date)}
      />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Back Link */}
            <Link
              href="/consiliul-local"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-800 font-medium mb-6 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              {labels.backToList}
            </Link>

            {/* Header Card */}
            <Card className="mb-8 overflow-hidden">
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className={SESSION_TYPE_LABELS[session.type].color}>
                    {SESSION_TYPE_LABELS[session.type][locale]}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={`bg-white/20 border-white/30 ${
                      session.status === 'completed' ? 'text-green-200' : 
                      session.status === 'cancelled' ? 'text-red-200' : 'text-white'
                    }`}
                  >
                    {STATUS_LABELS[session.status][locale]}
                  </Badge>
                </div>
              </div>
              <CardContent className="pt-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {SESSION_TYPE_LABELS[session.type][locale]} - {formatDate(session.date)}
                </h1>

                {/* Session Info Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{labels.date}</p>
                      <p className="font-semibold text-gray-900">{formatShortDate(session.date)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{labels.time}</p>
                      <p className="font-semibold text-gray-900">{session.time}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{labels.location}</p>
                      <p className="font-semibold text-gray-900 text-sm">{session.location}</p>
                    </div>
                  </div>

                  {session.attendees && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                        <Users className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{labels.attendance}</p>
                        <p className="font-semibold text-gray-900">
                          {session.attendees.present}/{session.attendees.total}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Content - Agenda */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ListOrdered className="w-5 h-5 text-primary-600" />
                      {labels.agenda}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {session.agenda.map((item) => {
                        const StatusIcon = AGENDA_STATUS_LABELS[item.status].icon;
                        return (
                          <div 
                            key={item.id}
                            className="p-4 bg-gray-50 rounded-lg border border-gray-100"
                          >
                            <div className="flex items-start gap-4">
                              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0 font-bold text-primary-700">
                                {item.number}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 mb-2">
                                  {item.title[locale]}
                                </h4>
                                
                                <div className="flex flex-wrap items-center gap-3">
                                  {/* Status Badge */}
                                  <div className={`flex items-center gap-1 text-sm font-medium ${AGENDA_STATUS_LABELS[item.status].color}`}>
                                    <StatusIcon className="w-4 h-4" />
                                    {AGENDA_STATUS_LABELS[item.status][locale]}
                                  </div>

                                  {/* Decision Link */}
                                  {item.decisionNumber && item.decisionUrl && (
                                    <a
                                      href={item.decisionUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-800 font-medium"
                                    >
                                      <FileText className="w-4 h-4" />
                                      {labels.decision} {item.decisionNumber}
                                    </a>
                                  )}

                                  {/* Votes */}
                                  {item.votes && (
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                      <span className="text-green-600">{labels.for}: {item.votes.for}</span>
                                      <span className="text-red-600">{labels.against}: {item.votes.against}</span>
                                      <span className="text-amber-600">{labels.abstain}: {item.votes.abstain}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar - Documents */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary-600" />
                      {labels.documents}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {session.documents.map((doc) => (
                        <a
                          key={doc.id}
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                              <FileText className="w-4 h-4 text-red-600" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-gray-900 group-hover:text-primary-700 text-sm truncate">
                                {doc.title[locale]}
                              </p>
                              <p className="text-xs text-gray-500">
                                {DOCUMENT_TYPE_LABELS[doc.type][locale]}
                              </p>
                            </div>
                          </div>
                          <Download className="w-4 h-4 text-gray-400 group-hover:text-primary-600 shrink-0 ml-2" />
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Attendance Card */}
                {session.attendees && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Users className="w-5 h-5 text-primary-600" />
                        {labels.attendance}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">{labels.present}</span>
                          <span className="font-bold text-green-600">{session.attendees.present}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">{labels.absent}</span>
                          <span className="font-bold text-red-600">{session.attendees.absent}</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${(session.attendees.present / session.attendees.total) * 100}%` }}
                          />
                        </div>
                        <p className="text-center text-sm text-gray-500">
                          {Math.round((session.attendees.present / session.attendees.total) * 100)}% {labels.attendance.toLowerCase()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

