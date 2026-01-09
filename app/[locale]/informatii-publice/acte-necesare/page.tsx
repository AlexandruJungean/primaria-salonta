import { getTranslations } from 'next-intl/server';
import { 
  FileText, 
  Building2, 
  Landmark, 
  Wheat, 
  FileCheck,
  ClipboardList,
  ListChecks,
  Briefcase,
  Users,
  Scale,
  Home,
  Car,
  Leaf,
  type LucideIcon
} from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { Collapsible, CollapsibleGroup } from '@/components/ui/collapsible';
import { generatePageMetadata } from '@/lib/seo';
import { getOfficesWithDocuments, type OfficeWithDocuments, type RequiredDocument } from '@/lib/supabase/services/required-documents';
import type { Locale } from '@/lib/seo/config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'acteNecesare',
    locale: locale as Locale,
    path: '/informatii-publice/acte-necesare',
  });
}

// Icon mapping
const ICON_MAP: Record<string, LucideIcon> = {
  fileText: FileText,
  building2: Building2,
  landmark: Landmark,
  wheat: Wheat,
  briefcase: Briefcase,
  users: Users,
  scale: Scale,
  home: Home,
  car: Car,
  leaf: Leaf,
  fileCheck: FileCheck,
  clipboardList: ClipboardList,
  listChecks: ListChecks,
};

// Color mapping for backgrounds
const COLOR_MAP: Record<string, { bg: string; bgLight: string; text: string; border: string }> = {
  primary: { bg: 'bg-primary-600', bgLight: 'bg-primary-100', text: 'text-primary-700', border: 'border-primary-200' },
  emerald: { bg: 'bg-emerald-600', bgLight: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
  amber: { bg: 'bg-amber-600', bgLight: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
  blue: { bg: 'bg-blue-600', bgLight: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
  purple: { bg: 'bg-purple-600', bgLight: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
  rose: { bg: 'bg-rose-600', bgLight: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-200' },
  slate: { bg: 'bg-slate-600', bgLight: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' },
};

// Component for a single document requirement
function DocumentCard({ doc, color }: { doc: RequiredDocument; color: string }) {
  const colors = COLOR_MAP[color] || COLOR_MAP.primary;
  const items = Array.isArray(doc.items) ? doc.items : [];

  return (
    <Collapsible
      title={doc.title}
      icon={<FileCheck className={`w-5 h-5 ${colors.text}`} />}
      defaultOpen={false}
    >
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-3 text-sm text-gray-700">
            <span className={`w-1.5 h-1.5 rounded-full ${colors.bg} shrink-0 mt-2`} />
            <span className="whitespace-pre-line">{item}</span>
          </li>
        ))}
      </ul>
      {doc.note && (
        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800 whitespace-pre-line">
            <strong>Notă:</strong> {doc.note}
          </p>
        </div>
      )}
    </Collapsible>
  );
}

// Component for an office section
function OfficeSection({ office }: { office: OfficeWithDocuments }) {
  const IconComponent = ICON_MAP[office.icon] || FileText;
  const colors = COLOR_MAP[office.color] || COLOR_MAP.primary;

  return (
    <section id={office.slug} className="mb-16 scroll-mt-24">
      <div className={`flex items-center gap-4 mb-6 pb-4 border-b-2 ${colors.border}`}>
        <div className={`w-12 h-12 rounded-xl ${colors.bgLight} flex items-center justify-center`}>
          <IconComponent className={`w-6 h-6 ${colors.text}`} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{office.name}</h2>
          {office.description && (
            <p className="text-sm text-gray-600 mt-1">{office.description}</p>
          )}
        </div>
      </div>
      
      {office.documents.length > 0 ? (
        <CollapsibleGroup>
          {office.documents.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} color={office.color} />
          ))}
        </CollapsibleGroup>
      ) : (
        <Card>
          <CardContent className="py-8 text-center text-gray-500">
            Nu există documente pentru acest birou.
          </CardContent>
        </Card>
      )}
    </section>
  );
}

// Quick navigation component
function QuickNavigation({ offices }: { offices: OfficeWithDocuments[] }) {
  return (
    <div className="grid md:grid-cols-3 gap-4 mb-12">
      {offices.map((office) => {
        const IconComponent = ICON_MAP[office.icon] || FileText;
        const colors = COLOR_MAP[office.color] || COLOR_MAP.primary;
        
        return (
          <a 
            key={office.id}
            href={`#${office.slug}`}
            className={`flex items-center gap-3 p-4 ${colors.bgLight} rounded-xl hover:opacity-80 transition-opacity`}
          >
            <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center`}>
              <IconComponent className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-semibold text-gray-900 block">{office.name}</span>
              <span className="text-xs text-gray-600">{office.documents.length} documente</span>
            </div>
          </a>
        );
      })}
    </div>
  );
}

export default async function ActeNecesarePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tPage = await getTranslations({ locale, namespace: 'acteNecesarePage' });

  // Fetch data from database
  const offices = await getOfficesWithDocuments();

  return (
    <>
      <Breadcrumbs items={[
        { label: t('informatiiPublice'), href: '/informatii-publice' },
        { label: t('acteNecesare') }
      ]} />
      <PageHeader titleKey="acteNecesare" icon="fileText" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            <p className="text-gray-600 mb-8 text-center">
              {tPage('description')}
            </p>

            {offices.length > 0 ? (
              <>
                {/* Quick Navigation */}
                <QuickNavigation offices={offices} />

                {/* Office Sections */}
                {offices.map((office) => (
                  <OfficeSection key={office.id} office={office} />
                ))}
              </>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">{tPage('noDocuments') || 'Nu există documente.'}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
