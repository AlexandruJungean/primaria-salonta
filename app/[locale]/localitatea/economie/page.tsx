import { getTranslations } from 'next-intl/server';
import { TrendingUp, CheckCircle, ExternalLink, Hotel, Utensils, Plane } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { generatePageMetadata } from '@/lib/seo';
import { AdminEditButton } from '@/components/admin-edit-button';
import { getPageWithData } from '@/lib/supabase/services/pages';
import { getIcon } from '@/lib/constants/icon-map';
import type { Locale } from '@/lib/seo/config';

interface EconomieData {
  sectors: { key: string; icon: string }[];
  developmentPotential: string[];
  restaurants: { name: string; url?: string; address?: string; featured?: boolean }[];
  hotels: { name: string; url?: string; descriptionKey?: string }[];
  tourismAgencies: { name: string; url?: string; descriptionKey?: string }[];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'economie',
    locale: locale as Locale,
    path: '/localitatea/economie',
  });
}

export default async function EconomiePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const te = await getTranslations({ locale, namespace: 'economiePage' });
  const page = await getPageWithData<EconomieData>('localitatea-economie');
  const data = page?.structured_data;

  const sectors = data?.sectors || [];
  const potential = data?.developmentPotential || [];
  const restaurants = data?.restaurants || [];
  const hotels = data?.hotels || [];
  const agencies = data?.tourismAgencies || [];

  return (
    <>
      <Breadcrumbs items={[
        { label: t('localitatea'), href: '/localitatea' },
        { label: t('economie') }
      ]} />
      <PageHeader titleKey="economie" icon="trendingUp" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            <p className="text-xl text-gray-600 mb-8 text-center">{te('intro')}</p>

            {/* Sectors */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {sectors.map((sector) => {
                const Icon = getIcon(sector.icon);
                return (
                  <Card key={sector.key}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                          <Icon className="w-6 h-6 text-primary-700" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{te(`sectors.${sector.key}.title`)}</h3>
                          <p className="text-gray-600 text-sm">{te(`sectors.${sector.key}.description`)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{te('geographicAdvantageTitle')}</h2>
              <p className="text-gray-700 mb-4">{te('borderCrossingText')}</p>
              <p className="text-gray-700 mb-6">{te('industrialZoneUtilities')}</p>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{te('industrialActivityTitle')}</h2>
              <p className="text-gray-700 mb-4">{te('industrialActivityText')}</p>
              <p className="text-gray-700 mb-6">{te('mainFunctionsText')}</p>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{te('industrialDevelopmentTitle')}</h2>
              <p className="text-gray-700 mb-4">{te('industrialDevelopmentText')}</p>
              <p className="text-gray-700 mb-6">{te('mainIndustriesText')}</p>
            </div>

            {/* Development Potential */}
            {potential.length > 0 && (
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <TrendingUp className="w-7 h-7 text-primary-600" />
                  {te('developmentPotentialTitle')}
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {potential.map((key) => (
                    <div key={key} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary-600 mt-0.5 shrink-0" />
                      <p className="text-gray-700">{te(`potential.${key}`)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Restaurants */}
            {restaurants.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Utensils className="w-6 h-6 text-primary-600" />
                  {te('restaurantsTitle')}
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {restaurants.map((r) => (
                    <Card key={r.name} className={r.featured ? 'ring-2 ring-primary-200' : ''}>
                      <CardContent className="pt-4 pb-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">{r.name}</h3>
                            {r.address && <p className="text-sm text-gray-500">{r.address}</p>}
                          </div>
                          {r.url && (
                            <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Hotels */}
            {hotels.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Hotel className="w-6 h-6 text-primary-600" />
                  {te('hotelsTitle')}
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {hotels.map((h) => (
                    <Card key={h.name}>
                      <CardContent className="pt-6">
                        <h3 className="font-semibold text-gray-900 mb-2">{h.name}</h3>
                        {h.descriptionKey && <p className="text-sm text-gray-600 mb-3">{te(h.descriptionKey)}</p>}
                        {h.url && (
                          <a href={h.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:text-primary-700 inline-flex items-center gap-1">
                            Website <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Tourism Agencies */}
            {agencies.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Plane className="w-6 h-6 text-primary-600" />
                  {te('agenciesTitle')}
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {agencies.map((a) => (
                    <Card key={a.name}>
                      <CardContent className="pt-6">
                        <h3 className="font-semibold text-gray-900 mb-2">{a.name}</h3>
                        {a.descriptionKey && <p className="text-sm text-gray-600 mb-3">{te(a.descriptionKey)}</p>}
                        {a.url && (
                          <a href={a.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:text-primary-700 inline-flex items-center gap-1">
                            Website <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Container>
      </Section>
      <AdminEditButton href="/admin/localitatea/economie" />
    </>
  );
}
