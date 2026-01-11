import { Calendar, Info, User } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section, SectionHeader } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';
import * as staffService from '@/lib/supabase/services/staff';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'audiente',
    locale: locale as Locale,
    path: '/primaria/audiente',
  });
}

// Position titles
const POSITION_TITLES = {
  primar: { ro: 'Primar', hu: 'Polgármester', en: 'Mayor' },
  viceprimar: { ro: 'Viceprimar', hu: 'Alpolgármester', en: 'Deputy Mayor' },
  secretar: { ro: 'Secretar General', hu: 'Főjegyző', en: 'General Secretary' },
  administrator: { ro: 'Administrator Public', hu: 'Közigazgató', en: 'Public Administrator' },
};

// Page texts - based on original content from salonta.net/ro/contact
const PAGE_TEXTS = {
  ro: {
    title: 'Audiențe',
    registrationTitle: 'Înscriere la audiențe',
    registrationNote: 'Înscrierea la audiențe se face la cam. 11 parter a Primăriei Municipiului Salonta, pe baza actului de identitate.',
    procedureTitle: 'Informații suplimentare',
    procedureWorksheet: 'Pentru organizarea și finalitatea audientelor se folosește ca element de lucru – foaia de audiențe.',
    procedureResolution: 'Problemele ridicate vor putea fi soluționate conform procedurilor legale și în limitele de competență, așa cum sunt stabilite de Legea 215/2001 republicată, după analizarea problemei cu șefii compartimentelor de resort.',
    noData: 'Nu există informații despre programul de audiențe momentan.',
    noSchedule: 'Program de audiențe nedefinit',
  },
  hu: {
    title: 'Fogadóórák',
    registrationTitle: 'Jelentkezés fogadóórára',
    registrationNote: 'A fogadóórákra való feliratkozás a Nagyszalontai Polgármesteri Hivatal 11-es szobájában (földszint) történik, személyi igazolvány alapján.',
    procedureTitle: 'További információk',
    procedureWorksheet: 'A fogadóórák szervezéséhez és lebonyolításához a fogadóóra-lapot használják munkaeszközként.',
    procedureResolution: 'A felvetett problémák a jogi eljárásoknak megfelelően és a hatáskörök keretein belül oldhatók meg, a 215/2001-es törvénynek megfelelően, az illetékes osztályvezetőkkel való egyeztetést követően.',
    noData: 'Jelenleg nincsenek információk a fogadóórákról.',
    noSchedule: 'Fogadóóra nincs meghatározva',
  },
  en: {
    title: 'Audiences',
    registrationTitle: 'Audience Registration',
    registrationNote: 'Registration for audiences is done at room 11 (ground floor) of Salonta City Hall, based on ID card.',
    procedureTitle: 'Additional Information',
    procedureWorksheet: 'For organizing and completing audiences, the audience worksheet is used as a working element.',
    procedureResolution: 'The issues raised can be resolved according to legal procedures and within the limits of competence, as established by Law 215/2001 republished, after analyzing the problem with the heads of the relevant departments.',
    noData: 'No audience schedule information available at the moment.',
    noSchedule: 'Audience schedule not defined',
  },
};

// Breadcrumb translations
const NAV_TRANSLATIONS = {
  ro: { primaria: 'Primăria', audiente: 'Audiențe' },
  hu: { primaria: 'Polgármesteri Hivatal', audiente: 'Fogadóórák' },
  en: { primaria: 'City Hall', audiente: 'Audiences' },
};

export default async function AudientePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const currentLocale = (locale as 'ro' | 'hu' | 'en') || 'ro';
  
  // Fetch leadership from database
  const leadership = await staffService.getLeadership();
  
  const t = PAGE_TEXTS[currentLocale];
  const nav = NAV_TRANSLATIONS[currentLocale];

  return (
    <>
      <Breadcrumbs items={[
        { label: nav.primaria, href: '/primaria' },
        { label: nav.audiente }
      ]} />

      <Section background="white">
        <Container>
          <SectionHeader title={t.title} />
          
          <div className="max-w-3xl mx-auto">
            {leadership.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>{t.noData}</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-8">
                  {leadership.map((leader) => {
                    const positionKey = leader.position_type as keyof typeof POSITION_TITLES;
                    const positionTitle = POSITION_TITLES[positionKey]?.[currentLocale] || leader.position_type;
                    
                    return (
                      <Card key={leader.id} className="overflow-hidden">
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                              <Calendar className="w-6 h-6 text-primary-700" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg text-gray-900">
                                {positionTitle}
                              </h3>
                              <p className="text-gray-600">{leader.name}</p>
                              <p className="text-primary-700 font-medium mt-2">
                                {leader.reception_hours || t.noSchedule}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Registration info */}
                <Card className="bg-amber-50 border-amber-200">
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <Info className="w-6 h-6 text-amber-600 shrink-0" />
                      <div>
                        <h4 className="font-semibold text-amber-900 mb-2">{t.registrationTitle}</h4>
                        <p className="text-amber-800 text-sm">
                          {t.registrationNote}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Additional information */}
                <Card className="mt-4 bg-gray-50">
                  <CardContent className="pt-6">
                    <h4 className="font-semibold text-gray-900 mb-3">{t.procedureTitle}</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-2 shrink-0" />
                        {t.procedureWorksheet}
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-2 shrink-0" />
                        {t.procedureResolution}
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
