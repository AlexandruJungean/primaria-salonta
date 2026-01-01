import { getTranslations } from 'next-intl/server';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { Phone, Mail, Calendar, User, GraduationCap, Building2, ClipboardList } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { LEADERSHIP, LEADERSHIP_INTRO } from '@/lib/constants/leadership';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'leadership' });
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default function LeadershipPage() {
  const t = useTranslations('leadership');
  const tNav = useTranslations('navigation');
  const locale = useLocale() as 'ro' | 'hu' | 'en';

  return (
    <>
      <Breadcrumbs
        items={[
          { label: tNav('primaria'), href: '/primaria' },
          { label: tNav('conducere') },
        ]}
      />
      <PageHeader titleKey="conducere" icon="users" />

      <Section background="white">
        <Container>
          {/* Introduction */}
          <div className="max-w-4xl mx-auto mb-12">
            <p className="text-lg text-gray-600 text-center leading-relaxed">
              {LEADERSHIP_INTRO[locale]}
            </p>
          </div>

          {/* Leadership Cards */}
          <div className="space-y-12 max-w-5xl mx-auto">
            {LEADERSHIP.map((leader, index) => {
              const translation = leader.translations[locale];
              const education = leader.education[locale];
              const departments = leader.subordinateDepartments[locale];
              const responsibilities = leader.mainResponsibilities[locale];

              return (
                <Card key={leader.id} className="overflow-hidden">
                  <div className="md:flex md:items-start">
                    {/* Photo Section */}
                    <div className="md:w-64 lg:w-72 shrink-0">
                      <div className="aspect-[3/4] relative bg-gradient-to-br from-primary-100 to-primary-50">
                        {leader.photo ? (
                          <Image
                            src={leader.photo}
                            alt={translation.name}
                            fill
                            className="object-cover object-top"
                            sizes="(max-width: 768px) 100vw, 280px"
                            priority={index === 0}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="w-24 h-24 text-primary-200" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Info Section */}
                    <CardContent className="flex-1 p-6 md:p-8">
                      {/* Header */}
                      <div className="mb-6">
                        <span className="inline-block px-3 py-1 bg-primary-100 text-primary-800 text-sm font-medium rounded-full mb-3">
                          {translation.position}
                        </span>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                          {translation.name}
                        </h2>
                      </div>

                      {/* Contact Info */}
                      <div className="flex flex-wrap gap-4 mb-6 pb-6 border-b border-gray-100">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-4 h-4 text-primary-600" />
                          <span className="text-sm">{leader.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="w-4 h-4 text-primary-600" />
                          <a
                            href={`mailto:${leader.email}`}
                            className="text-sm text-primary-700 hover:underline"
                          >
                            {leader.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4 text-primary-600" />
                          <span className="text-sm">{translation.audienceSchedule}</span>
                        </div>
                      </div>

                      {/* Education */}
                      {education.length > 0 && (
                        <div className="mb-6">
                          <div className="flex items-center gap-2 mb-3">
                            <GraduationCap className="w-5 h-5 text-primary-600" />
                            <h3 className="font-semibold text-gray-900">{t('education')}</h3>
                          </div>
                          <ul className="space-y-2">
                            {education.map((edu, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-2 shrink-0" />
                                {edu}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Subordinate Departments */}
                      {departments.length > 0 && (
                        <div className="mb-6">
                          <div className="flex items-center gap-2 mb-3">
                            <Building2 className="w-5 h-5 text-primary-600" />
                            <h3 className="font-semibold text-gray-900">{t('subordinateDepartments')}</h3>
                          </div>
                          <div className="grid sm:grid-cols-2 gap-2">
                            {departments.map((dept, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-primary-400 shrink-0" />
                                {dept}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Main Responsibilities */}
                      {responsibilities && (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <ClipboardList className="w-5 h-5 text-primary-600" />
                            <h3 className="font-semibold text-gray-900">{t('mainResponsibilities')}</h3>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {responsibilities}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </div>
                </Card>
              );
            })}
          </div>
        </Container>
      </Section>
    </>
  );
}
