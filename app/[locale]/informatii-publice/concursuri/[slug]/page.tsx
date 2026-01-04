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
  Briefcase,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  Building2
} from 'lucide-react';

// ============================================
// MOCK DATA - Will be replaced with Supabase
// ============================================

type JobType = 'functionar_public' | 'contractual';
type JobStatus = 'open' | 'in_progress' | 'closed' | 'cancelled';

interface JobDocument {
  id: string;
  type: 'anunt' | 'fisa_post' | 'bibliografie' | 'formular' | 'rezultate_dosare' | 'rezultate_proba' | 'rezultate_finale' | 'other';
  title: { ro: string; hu: string; en: string };
  url: string;
  date?: string;
}

interface JobVacancy {
  id: string;
  slug: string;
  type: JobType;
  status: JobStatus;
  publishedAt: string;
  deadline: string;
  title: { ro: string; hu: string; en: string };
  department: { ro: string; hu: string; en: string };
  description: { ro: string; hu: string; en: string };
  requirements: {
    education: { ro: string; hu: string; en: string };
    experience: { ro: string; hu: string; en: string };
    skills: { ro: string[]; hu: string[]; en: string[] };
    other: { ro: string[]; hu: string[]; en: string[] };
  };
  benefits?: { ro: string[]; hu: string[]; en: string[] };
  salary?: string;
  schedule?: string;
  location: string;
  contactEmail: string;
  contactPhone: string;
  documents: JobDocument[];
}

const JOB_TYPE_LABELS: Record<JobType, { ro: string; hu: string; en: string; color: string }> = {
  functionar_public: { 
    ro: 'Funcționar Public', 
    hu: 'Köztisztviselő', 
    en: 'Public Official',
    color: 'bg-blue-100 text-blue-800',
  },
  contractual: { 
    ro: 'Personal Contractual', 
    hu: 'Szerződéses személyzet', 
    en: 'Contractual Staff',
    color: 'bg-purple-100 text-purple-800',
  },
};

const JOB_STATUS_LABELS: Record<JobStatus, { ro: string; hu: string; en: string; color: string }> = {
  open: { 
    ro: 'Înscrieri deschise', 
    hu: 'Nyitott jelentkezés', 
    en: 'Open for applications',
    color: 'bg-green-100 text-green-800',
  },
  in_progress: { 
    ro: 'În desfășurare', 
    hu: 'Folyamatban', 
    en: 'In progress',
    color: 'bg-amber-100 text-amber-800',
  },
  closed: { 
    ro: 'Finalizat', 
    hu: 'Lezárva', 
    en: 'Closed',
    color: 'bg-gray-100 text-gray-800',
  },
  cancelled: { 
    ro: 'Anulat', 
    hu: 'Törölve', 
    en: 'Cancelled',
    color: 'bg-red-100 text-red-800',
  },
};

const DOCUMENT_TYPE_LABELS: Record<string, { ro: string; hu: string; en: string }> = {
  anunt: { ro: 'Anunț concurs', hu: 'Pályázati hirdetmény', en: 'Competition announcement' },
  fisa_post: { ro: 'Fișa postului', hu: 'Munkaköri leírás', en: 'Job description' },
  bibliografie: { ro: 'Bibliografie', hu: 'Bibliográfia', en: 'Bibliography' },
  formular: { ro: 'Formular înscriere', hu: 'Jelentkezési lap', en: 'Application form' },
  rezultate_dosare: { ro: 'Rezultate selecție dosare', hu: 'Iratválogatás eredményei', en: 'Application selection results' },
  rezultate_proba: { ro: 'Rezultate probă', hu: 'Próba eredményei', en: 'Test results' },
  rezultate_finale: { ro: 'Rezultate finale', hu: 'Végeredmények', en: 'Final results' },
  other: { ro: 'Alte documente', hu: 'Egyéb dokumentumok', en: 'Other documents' },
};

const MOCK_JOBS: Record<string, JobVacancy> = {
  'ingrijitor-compartiment-administrativ': {
    id: '1',
    slug: 'ingrijitor-compartiment-administrativ',
    type: 'contractual',
    status: 'closed',
    publishedAt: '2025-11-14',
    deadline: '2025-11-28',
    title: {
      ro: 'Îngrijitor – Compartiment Administrativ',
      hu: 'Gondnok – Adminisztratív Osztály',
      en: 'Caretaker – Administrative Department',
    },
    department: {
      ro: 'Compartiment Administrativ',
      hu: 'Adminisztratív Osztály',
      en: 'Administrative Department',
    },
    description: {
      ro: 'Primăria Municipiului Salonta organizează concurs pentru ocuparea pe perioadă nedeterminată a unui post vacant de îngrijitor în cadrul Compartimentului Administrativ. Postul presupune activități de curățenie și întreținere a spațiilor administrative ale primăriei.',
      hu: 'Nagyszalonta Polgármesteri Hivatala pályázatot hirdet egy határozatlan idejű gondnoki állás betöltésére az Adminisztratív Osztályon belül. Az állás a polgármesteri hivatal adminisztratív tereinek takarítását és karbantartását foglalja magában.',
      en: 'Salonta City Hall organizes a competition for filling a permanent caretaker position within the Administrative Department. The position involves cleaning and maintenance activities of the city hall administrative spaces.',
    },
    requirements: {
      education: {
        ro: 'Studii generale (minim 8 clase)',
        hu: 'Általános iskolai végzettség (minimum 8 osztály)',
        en: 'General education (minimum 8 grades)',
      },
      experience: {
        ro: 'Nu este necesară experiență anterioară',
        hu: 'Nem szükséges előzetes tapasztalat',
        en: 'No previous experience required',
      },
      skills: {
        ro: ['Abilități de comunicare', 'Spirit de echipă', 'Seriozitate și punctualitate'],
        hu: ['Kommunikációs készség', 'Csapatmunka', 'Komolyság és pontosság'],
        en: ['Communication skills', 'Teamwork', 'Seriousness and punctuality'],
      },
      other: {
        ro: ['Apt din punct de vedere medical', 'Cazier judiciar curat'],
        hu: ['Egészségügyileg alkalmas', 'Büntetlen előélet'],
        en: ['Medically fit', 'Clean criminal record'],
      },
    },
    salary: '3.300 - 3.800 RON brut',
    schedule: 'Luni-Vineri, 06:00-14:00',
    location: 'Primăria Municipiului Salonta, str. Republicii nr. 1',
    contactEmail: 'resurse.umane@salonta.ro',
    contactPhone: '0259-418.600',
    documents: [
      {
        id: 'd1',
        type: 'anunt',
        title: { ro: 'Anunț concurs', hu: 'Pályázati hirdetmény', en: 'Competition announcement' },
        url: '#',
        date: '2025-11-14',
      },
      {
        id: 'd2',
        type: 'fisa_post',
        title: { ro: 'Fișa postului', hu: 'Munkaköri leírás', en: 'Job description' },
        url: '#',
      },
      {
        id: 'd3',
        type: 'formular',
        title: { ro: 'Formular de înscriere', hu: 'Jelentkezési lap', en: 'Application form' },
        url: '#',
      },
      {
        id: 'd4',
        type: 'rezultate_dosare',
        title: { ro: 'PV selecție dosare', hu: 'Iratválogatás jegyzőkönyve', en: 'Application selection minutes' },
        url: '#',
        date: '2025-11-28',
      },
      {
        id: 'd5',
        type: 'rezultate_proba',
        title: { ro: 'PV probă practică', hu: 'Gyakorlati próba jegyzőkönyve', en: 'Practical test minutes' },
        url: '#',
        date: '2025-12-08',
      },
      {
        id: 'd6',
        type: 'rezultate_proba',
        title: { ro: 'PV interviu', hu: 'Interjú jegyzőkönyve', en: 'Interview minutes' },
        url: '#',
        date: '2025-12-08',
      },
      {
        id: 'd7',
        type: 'rezultate_finale',
        title: { ro: 'PV final', hu: 'Végső jegyzőkönyv', en: 'Final minutes' },
        url: '#',
        date: '2025-12-10',
      },
    ],
  },
  'consilier-juridic-serviciul-juridic': {
    id: '2',
    slug: 'consilier-juridic-serviciul-juridic',
    type: 'functionar_public',
    status: 'open',
    publishedAt: '2025-12-01',
    deadline: '2026-01-15',
    title: {
      ro: 'Consilier Juridic – Serviciul Juridic',
      hu: 'Jogtanácsos – Jogi Szolgálat',
      en: 'Legal Advisor – Legal Service',
    },
    department: {
      ro: 'Serviciul Juridic',
      hu: 'Jogi Szolgálat',
      en: 'Legal Service',
    },
    description: {
      ro: 'Primăria Municipiului Salonta organizează concurs pentru ocuparea pe perioadă nedeterminată a funcției publice de execuție de consilier juridic, clasa I, gradul profesional superior. Candidații trebuie să îndeplinească condițiile generale prevăzute de lege pentru ocuparea unei funcții publice.',
      hu: 'Nagyszalonta Polgármesteri Hivatala pályázatot hirdet jogtanácsosi végrehajtói közszolgálati állás határozatlan idejű betöltésére, I. osztály, felsőfokú szakmai besorolás. A jelölteknek teljesíteniük kell a közszolgálati állás betöltéséhez szükséges törvényi feltételeket.',
      en: 'Salonta City Hall organizes a competition for filling a permanent public function of legal advisor, class I, superior professional grade. Candidates must meet the general legal conditions for occupying a public function.',
    },
    requirements: {
      education: {
        ro: 'Studii universitare de licență absolvite cu diplomă de licență în domeniul științelor juridice',
        hu: 'Jogi egyetemi diploma',
        en: 'University degree in legal sciences',
      },
      experience: {
        ro: 'Minimum 7 ani vechime în specialitatea studiilor necesare exercitării funcției publice',
        hu: 'Minimum 7 év szakmai tapasztalat a közszolgálati álláshoz szükséges tanulmányok szakterületén',
        en: 'Minimum 7 years of experience in the specialty of studies required for the public function',
      },
      skills: {
        ro: [
          'Cunoștințe aprofundate de drept administrativ și civil',
          'Capacitate de analiză și sinteză',
          'Abilități de redactare acte juridice',
          'Cunoștințe operare PC (MS Office)',
        ],
        hu: [
          'Alapos közigazgatási és polgári jogi ismeretek',
          'Elemzési és szintetizálási képesség',
          'Jogi dokumentumok szerkesztési készsége',
          'PC-kezelési ismeretek (MS Office)',
        ],
        en: [
          'In-depth knowledge of administrative and civil law',
          'Analytical and synthesis skills',
          'Legal document drafting skills',
          'PC operating skills (MS Office)',
        ],
      },
      other: {
        ro: [
          'Cetățenie română',
          'Cunoașterea limbii române, scris și vorbit',
          'Capacitate deplină de exercițiu',
          'Stare de sănătate corespunzătoare',
        ],
        hu: [
          'Román állampolgárság',
          'Román nyelv ismerete, írásban és szóban',
          'Teljes cselekvőképesség',
          'Megfelelő egészségi állapot',
        ],
        en: [
          'Romanian citizenship',
          'Knowledge of Romanian language, written and spoken',
          'Full exercise capacity',
          'Appropriate health condition',
        ],
      },
    },
    benefits: {
      ro: [
        'Salariu motivant conform grilei de salarizare',
        'Tichete de masă',
        'Program flexibil',
        'Posibilități de formare profesională',
      ],
      hu: [
        'Motiváló fizetés a bértáblázat szerint',
        'Étkezési jegyek',
        'Rugalmas munkaidő',
        'Szakmai képzési lehetőségek',
      ],
      en: [
        'Competitive salary according to pay scale',
        'Meal vouchers',
        'Flexible schedule',
        'Professional training opportunities',
      ],
    },
    salary: '6.500 - 8.000 RON brut',
    schedule: 'Luni-Vineri, 08:00-16:00',
    location: 'Primăria Municipiului Salonta, str. Republicii nr. 1',
    contactEmail: 'juridic@salonta.ro',
    contactPhone: '0259-418.600',
    documents: [
      {
        id: 'd1',
        type: 'anunt',
        title: { ro: 'Anunț concurs', hu: 'Pályázati hirdetmény', en: 'Competition announcement' },
        url: '#',
        date: '2025-12-01',
      },
      {
        id: 'd2',
        type: 'fisa_post',
        title: { ro: 'Fișa postului', hu: 'Munkaköri leírás', en: 'Job description' },
        url: '#',
      },
      {
        id: 'd3',
        type: 'bibliografie',
        title: { ro: 'Bibliografie și tematică', hu: 'Bibliográfia és tematika', en: 'Bibliography and topics' },
        url: '#',
      },
      {
        id: 'd4',
        type: 'formular',
        title: { ro: 'Formular de înscriere funcționari publici', hu: 'Köztisztviselői jelentkezési lap', en: 'Public official application form' },
        url: '#',
      },
    ],
  },
  'inspector-compartiment-urbanism': {
    id: '3',
    slug: 'inspector-compartiment-urbanism',
    type: 'functionar_public',
    status: 'in_progress',
    publishedAt: '2025-11-20',
    deadline: '2025-12-10',
    title: {
      ro: 'Inspector – Compartiment Urbanism și Amenajarea Teritoriului',
      hu: 'Felügyelő – Városrendezési és Területfejlesztési Osztály',
      en: 'Inspector – Urbanism and Spatial Planning Department',
    },
    department: {
      ro: 'Compartiment Urbanism și Amenajarea Teritoriului',
      hu: 'Városrendezési és Területfejlesztési Osztály',
      en: 'Urbanism and Spatial Planning Department',
    },
    description: {
      ro: 'Primăria Municipiului Salonta organizează concurs pentru ocuparea funcției publice de execuție de inspector, clasa I, gradul profesional asistent în cadrul Compartimentului Urbanism și Amenajarea Teritoriului.',
      hu: 'Nagyszalonta Polgármesteri Hivatala pályázatot hirdet felügyelői végrehajtói közszolgálati állás betöltésére, I. osztály, asszisztens szakmai besorolás, a Városrendezési és Területfejlesztési Osztályon belül.',
      en: 'Salonta City Hall organizes a competition for filling the public function of inspector, class I, assistant professional grade within the Urbanism and Spatial Planning Department.',
    },
    requirements: {
      education: {
        ro: 'Studii universitare de licență în domeniul arhitectură, urbanism sau construcții',
        hu: 'Egyetemi diploma építészet, urbanisztika vagy építőipar területén',
        en: 'University degree in architecture, urbanism or construction',
      },
      experience: {
        ro: 'Minimum 1 an vechime în specialitatea studiilor',
        hu: 'Minimum 1 év szakmai tapasztalat a tanulmányok szakterületén',
        en: 'Minimum 1 year of experience in the specialty of studies',
      },
      skills: {
        ro: [
          'Cunoștințe legislație urbanism',
          'Operare AutoCAD',
          'Cunoștințe operare PC (MS Office)',
        ],
        hu: [
          'Urbanisztikai jogszabályismeret',
          'AutoCAD kezelés',
          'PC-kezelési ismeretek (MS Office)',
        ],
        en: [
          'Urban planning legislation knowledge',
          'AutoCAD operation',
          'PC operating skills (MS Office)',
        ],
      },
      other: {
        ro: ['Permis de conducere categoria B'],
        hu: ['B kategóriás jogosítvány'],
        en: ['Category B driving license'],
      },
    },
    salary: '4.500 - 5.500 RON brut',
    schedule: 'Luni-Vineri, 08:00-16:00',
    location: 'Primăria Municipiului Salonta, str. Republicii nr. 1',
    contactEmail: 'urbanism@salonta.ro',
    contactPhone: '0259-418.600',
    documents: [
      {
        id: 'd1',
        type: 'anunt',
        title: { ro: 'Anunț concurs', hu: 'Pályázati hirdetmény', en: 'Competition announcement' },
        url: '#',
        date: '2025-11-20',
      },
      {
        id: 'd2',
        type: 'fisa_post',
        title: { ro: 'Fișa postului', hu: 'Munkaköri leírás', en: 'Job description' },
        url: '#',
      },
      {
        id: 'd3',
        type: 'bibliografie',
        title: { ro: 'Bibliografie', hu: 'Bibliográfia', en: 'Bibliography' },
        url: '#',
      },
      {
        id: 'd4',
        type: 'formular',
        title: { ro: 'Formular de înscriere', hu: 'Jelentkezési lap', en: 'Application form' },
        url: '#',
      },
      {
        id: 'd5',
        type: 'rezultate_dosare',
        title: { ro: 'Rezultate selecție dosare', hu: 'Iratválogatás eredményei', en: 'Application selection results' },
        url: '#',
        date: '2025-12-12',
      },
    ],
  },
};

// ============================================
// COMPONENT
// ============================================

export default function JobDetailPage() {
  const t = useTranslations('navigation');
  const locale = useLocale() as 'ro' | 'hu' | 'en';
  const params = useParams();
  const slug = params.slug as string;

  const job = MOCK_JOBS[slug];

  if (!job) {
    notFound();
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(
      locale === 'ro' ? 'ro-RO' : locale === 'hu' ? 'hu-HU' : 'en-US',
      { day: 'numeric', month: 'long', year: 'numeric' }
    );
  };

  const pageLabels = {
    ro: {
      backToList: 'Înapoi la concursuri',
      publishedAt: 'Publicat',
      deadline: 'Termen limită înscriere',
      department: 'Departament',
      location: 'Locație',
      salary: 'Salariu',
      schedule: 'Program',
      description: 'Descrierea postului',
      requirements: 'Cerințe',
      education: 'Studii',
      experience: 'Experiență',
      skills: 'Competențe',
      otherRequirements: 'Alte cerințe',
      benefits: 'Beneficii',
      documents: 'Documente concurs',
      contact: 'Contact',
      applyNow: 'Aplică acum',
      deadlinePassed: 'Termenul de înscriere a expirat',
    },
    hu: {
      backToList: 'Vissza a pályázatokhoz',
      publishedAt: 'Közzétéve',
      deadline: 'Jelentkezési határidő',
      department: 'Osztály',
      location: 'Helyszín',
      salary: 'Fizetés',
      schedule: 'Munkaidő',
      description: 'Állásleírás',
      requirements: 'Követelmények',
      education: 'Végzettség',
      experience: 'Tapasztalat',
      skills: 'Készségek',
      otherRequirements: 'Egyéb követelmények',
      benefits: 'Juttatások',
      documents: 'Pályázati dokumentumok',
      contact: 'Kapcsolat',
      applyNow: 'Jelentkezés',
      deadlinePassed: 'A jelentkezési határidő lejárt',
    },
    en: {
      backToList: 'Back to competitions',
      publishedAt: 'Published',
      deadline: 'Application deadline',
      department: 'Department',
      location: 'Location',
      salary: 'Salary',
      schedule: 'Schedule',
      description: 'Job description',
      requirements: 'Requirements',
      education: 'Education',
      experience: 'Experience',
      skills: 'Skills',
      otherRequirements: 'Other requirements',
      benefits: 'Benefits',
      documents: 'Competition documents',
      contact: 'Contact',
      applyNow: 'Apply now',
      deadlinePassed: 'Application deadline has passed',
    },
  };

  const labels = pageLabels[locale];
  const isDeadlinePassed = new Date(job.deadline) < new Date();

  return (
    <>
      <Breadcrumbs items={[
        { label: t('informatiiPublice'), href: '/informatii-publice' },
        { label: t('carieraConcursuri'), href: '/informatii-publice/concursuri' },
        { label: job.title[locale] },
      ]} />

      <PageHeader 
        titleKey="carieraConcursuri" 
        icon="badgeCheck"
        subtitle={job.title[locale]}
      />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Back Link */}
            <Link
              href="/informatii-publice/concursuri"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-800 font-medium mb-6 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              {labels.backToList}
            </Link>

            {/* Header Card */}
            <Card className="mb-8 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className={JOB_TYPE_LABELS[job.type].color}>
                    {JOB_TYPE_LABELS[job.type][locale]}
                  </Badge>
                  <Badge className={JOB_STATUS_LABELS[job.status].color}>
                    {JOB_STATUS_LABELS[job.status][locale]}
                  </Badge>
                </div>
              </div>
              <CardContent className="pt-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {job.title[locale]}
                </h1>
                <p className="text-gray-600 mb-4">{job.department[locale]}</p>

                {/* Job Info Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{labels.publishedAt}</p>
                      <p className="font-semibold text-gray-900">{formatDate(job.publishedAt)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{labels.deadline}</p>
                      <p className={`font-semibold ${isDeadlinePassed ? 'text-red-600' : 'text-gray-900'}`}>
                        {formatDate(job.deadline)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{labels.location}</p>
                      <p className="font-semibold text-gray-900 text-sm">{job.location}</p>
                    </div>
                  </div>

                  {job.salary && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                        <Briefcase className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{labels.salary}</p>
                        <p className="font-semibold text-gray-900">{job.salary}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Description */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary-600" />
                      {labels.description}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">
                      {job.description[locale]}
                    </p>
                  </CardContent>
                </Card>

                {/* Requirements */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-primary-600" />
                      {labels.requirements}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{labels.education}</h4>
                      <p className="text-gray-700">{job.requirements.education[locale]}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{labels.experience}</h4>
                      <p className="text-gray-700">{job.requirements.experience[locale]}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{labels.skills}</h4>
                      <ul className="space-y-1">
                        {job.requirements.skills[locale].map((skill, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-gray-700">
                            <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                            {skill}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {job.requirements.other[locale].length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">{labels.otherRequirements}</h4>
                        <ul className="space-y-1">
                          {job.requirements.other[locale].map((req, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-gray-700">
                              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Benefits */}
                {job.benefits && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary-600" />
                        {labels.benefits}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {job.benefits[locale].map((benefit, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-gray-700">
                            <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Documents */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <FileText className="w-5 h-5 text-primary-600" />
                      {labels.documents}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {job.documents.map((doc) => (
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
                              {doc.date && (
                                <p className="text-xs text-gray-500">{formatDate(doc.date)}</p>
                              )}
                            </div>
                          </div>
                          <Download className="w-4 h-4 text-gray-400 group-hover:text-primary-600 shrink-0 ml-2" />
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Contact */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Building2 className="w-5 h-5 text-primary-600" />
                      {labels.contact}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <a href={`mailto:${job.contactEmail}`} className="text-primary-600 hover:underline text-sm">
                        {job.contactEmail}
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <a href={`tel:${job.contactPhone.replace(/\./g, '')}`} className="text-primary-600 hover:underline text-sm">
                        {job.contactPhone}
                      </a>
                    </div>
                    {job.schedule && (
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-700 text-sm">{job.schedule}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Apply Button */}
                {job.status === 'open' && !isDeadlinePassed && (
                  <a
                    href={`mailto:${job.contactEmail}?subject=${encodeURIComponent(job.title.ro)}`}
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
                  >
                    <Mail className="w-5 h-5" />
                    {labels.applyNow}
                  </a>
                )}

                {isDeadlinePassed && (
                  <div className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gray-100 text-gray-500 rounded-lg font-medium">
                    <AlertCircle className="w-5 h-5" />
                    {labels.deadlinePassed}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

