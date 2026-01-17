import { getTranslations } from 'next-intl/server';
import { 
  Target, 
  Map, 
  Euro, 
  Globe, 
  Building, 
  Building2, 
  Siren, 
  ShieldCheck,
  FileText,
  Briefcase,
  type LucideIcon,
} from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { Link } from '@/components/ui/link';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { WebPageJsonLd } from '@/lib/seo/json-ld';
import { type Locale } from '@/i18n/routing';
import * as programs from '@/lib/supabase/services/programs';
import { translateContentArray } from '@/lib/google-translate/cache';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'programe',
    locale: locale as Locale,
    path: '/programe',
  });
}

// Icon mapping based on program_type or icon field
const ICON_MAP: Record<string, LucideIcon> = {
  'target': Target,
  'map': Map,
  'euro': Euro,
  'globe': Globe,
  'building': Building,
  'building2': Building2,
  'siren': Siren,
  'shield': ShieldCheck,
  'file': FileText,
  'briefcase': Briefcase,
  // Program type defaults
  'pnrr': Euro,
  'pmud': Map,
  'strategie': Target,
  'sna': ShieldCheck,
  'svsu': Siren,
  'proiecte-europene': Globe,
  'proiecte-locale': Building,
  'program-regional': Building2,
  'altele': FileText,
};

export default async function ProgramePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });

  // Fetch top-level programs from database
  const programsData = await programs.getTopLevelPrograms();

  // Translate program titles
  const translatedPrograms = await translateContentArray(
    programsData,
    ['title', 'short_description'],
    locale as 'ro' | 'hu' | 'en'
  );

  return (
    <>
      <WebPageJsonLd
        title="Programe și Proiecte"
        description="Programe și proiecte ale Primăriei Municipiului Salonta"
        url="/programe"
      />
      <Breadcrumbs items={[{ label: t('programe') }]} />
      <PageHeader titleKey="programe" icon="target" />

      <Section background="white">
        <Container>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {translatedPrograms.map((program) => {
              // Get icon based on icon field or program_type
              const iconKey = program.icon || program.program_type || 'file';
              const Icon = ICON_MAP[iconKey] || FileText;
              
              return (
                <Link key={program.id} href={`/programe/${program.slug}`}>
                  <Card hover className="h-full">
                    <CardContent className="flex items-center gap-4 pt-6">
                      <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                        <Icon className="w-6 h-6 text-primary-700" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{program.title}</h3>
                        {program.short_description && (
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {program.short_description}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
          
          {translatedPrograms.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Nu există programe disponibile.
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
