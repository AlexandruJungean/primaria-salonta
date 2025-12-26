import { getTranslations } from 'next-intl/server';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { Phone, Mail, Calendar, User } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section, SectionHeader } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { LEADERSHIP } from '@/lib/constants/leadership';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'leadership' });
  return {
    title: t('title'),
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

      <Section background="white">
        <Container>
          <SectionHeader title={t('title')} />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {LEADERSHIP.map((leader) => {
              const translation = leader.translations[locale];

              return (
                <Card key={leader.id} className="overflow-hidden">
                  {/* Photo */}
                  <div className="aspect-[4/3] relative bg-gray-100">
                    {leader.photo ? (
                      <Image
                        src={leader.photo}
                        alt={translation.name}
                        fill
                        className="object-cover object-top"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-20 h-20 text-gray-300" />
                      </div>
                    )}
                  </div>

                  <CardContent className="pt-4">
                    {/* Name & Position */}
                    <h3 className="text-xl font-bold text-gray-900">
                      {translation.name}
                    </h3>
                    <p className="text-primary-700 font-medium mb-4">
                      {translation.position}
                    </p>

                    {/* Contact Info */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{leader.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <a
                          href={`mailto:${leader.email}`}
                          className="text-primary-700 hover:underline"
                        >
                          {leader.email}
                        </a>
                      </div>
                    </div>

                    {/* Audience Schedule */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-start gap-2">
                        <Calendar className="w-4 h-4 text-primary-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {t('audienceSchedule')}
                          </p>
                          <p className="text-sm text-gray-600">
                            {translation.audienceSchedule}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </Container>
      </Section>
    </>
  );
}

