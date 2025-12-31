import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { TrendingUp, Factory, Wheat, ShoppingBag, Users, MapPin, CheckCircle, Building2, Hotel, Utensils, Plane, ExternalLink } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return { title: t('economie') };
}

const ECONOMIC_SECTORS = [
  { icon: Wheat, key: 'agriculture' },
  { icon: Factory, key: 'industry' },
  { icon: ShoppingBag, key: 'commerce' },
  { icon: Users, key: 'tourism' },
];

const DEVELOPMENT_POTENTIAL = [
  'borderCrossing',
  'freeZone',
  'crossBorderCooperation',
  'developmentCorridor',
  'majorRoutes',
  'transitTourism',
];

const RESTAURANTS = [
  {
    name: 'Restaurant Slavia',
    url: 'https://www.slavia.ro/restaurant-slavia',
    featured: true,
  },
  {
    name: 'Restaurant Discont',
    url: 'https://www.restaurantdiscont.ro/',
    featured: true,
  },
  { name: 'Restaurant Isola', address: 'Str. Republicii nr. 47' },
  { name: 'Restaurant Ancora', address: 'DN79 KM75' },
  { name: 'Han Madaras', address: 'E671 333A' },
  { name: 'Pizzeria Galaxy', address: 'Str. Republicii nr. 41' },
  { name: 'Melody Bar & Pizza', address: 'Str. Oradiei nr. 2' },
  { name: 'Kristály & Rózsa', address: 'Str. Batthyanyi nr. 12' },
  { name: 'Rob Roy Music', address: 'P-ța Democrației' },
  { name: 'Simonyi Impex SRL', address: 'Zona Gării' },
  { name: 'Cofetăria Kézműves', address: 'Str. Republicii' },
];

const HOTELS = [
  {
    name: 'Hotel Slavia ****',
    url: 'https://www.slavia.ro/',
    description: 'hotelSlaviaDesc',
  },
  {
    name: 'Motel Millenium',
    url: 'https://www.facebook.com/hotelmillenium.salonta/',
    description: 'motelMilleniumDesc',
  },
  {
    name: 'Hotel Ancora',
    url: 'https://hotelancorasalonta.ro/',
    description: 'hotelAncoraDesc',
  },
];

const TOURISM_AGENCIES = [
  {
    name: 'Turistsal SRL',
    url: 'https://turistsal.ro/',
    description: 'turistsalDesc',
  },
];

export default function EconomiePage() {
  const t = useTranslations('navigation');
  const te = useTranslations('economiePage');

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
            {/* Intro */}
            <p className="text-xl text-gray-600 mb-8 text-center">
              {te('intro')}
            </p>

            {/* Economic Sectors Cards */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {ECONOMIC_SECTORS.map((sector) => {
                const Icon = sector.icon;
                return (
                  <Card key={sector.key}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                          <Icon className="w-6 h-6 text-primary-700" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {te(`sectors.${sector.key}.title`)}
                          </h3>
                          <p className="text-gray-600 text-sm">{te(`sectors.${sector.key}.description`)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Main Content */}
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
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <TrendingUp className="w-7 h-7 text-primary-600" />
                {te('developmentPotentialTitle')}
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {DEVELOPMENT_POTENTIAL.map((key) => (
                  <div key={key} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary-600 mt-0.5 shrink-0" />
                    <span className="text-gray-700">{te(`potential.${key}`)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Investment Opportunities */}
            <div className="bg-gray-50 rounded-2xl p-8 mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{te('investmentTitle')}</h2>
              <p className="text-gray-700 mb-4">{te('investmentText1')}</p>
              <p className="text-gray-700 mb-4">{te('investmentText2')}</p>
              <p className="text-gray-700 font-medium">{te('investmentText3')}</p>
            </div>

            {/* Restaurants Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Utensils className="w-7 h-7 text-orange-500" />
                {te('restaurantsTitle')}
              </h2>
              
              {/* Featured Restaurants */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {RESTAURANTS.filter(r => r.featured).map((restaurant) => (
                  <a
                    key={restaurant.name}
                    href={restaurant.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100 p-4"
                  >
                    <span className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {restaurant.name}
                    </span>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors" />
                  </a>
                ))}
              </div>

              {/* Other Restaurants List */}
              <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
                {RESTAURANTS.filter(r => !r.featured).map((restaurant) => (
                  <div key={restaurant.name} className="p-4 flex items-center justify-between">
                    <div>
                      <span className="font-medium text-gray-900">{restaurant.name}</span>
                      {restaurant.address && (
                        <span className="text-gray-500 text-sm ml-2">• {restaurant.address}</span>
                      )}
                    </div>
                    <MapPin className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>

            {/* Hotels Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Hotel className="w-7 h-7 text-blue-500" />
                {te('hotelsTitle')}
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                {HOTELS.map((hotel) => 
                  hotel.url ? (
                    <a
                      key={hotel.name}
                      href={hotel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100 p-5"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-lg text-gray-900 group-hover:text-primary-600 transition-colors">
                          {hotel.name}
                        </span>
                        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors" />
                      </div>
                      <p className="text-gray-600 text-sm">{te(hotel.description)}</p>
                    </a>
                  ) : (
                    <div
                      key={hotel.name}
                      className="block bg-white rounded-xl shadow-md border border-gray-100 p-5"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-lg text-gray-900">
                          {hotel.name}
                        </span>
                        <Hotel className="w-4 h-4 text-gray-400" />
                      </div>
                      <p className="text-gray-600 text-sm">{te(hotel.description)}</p>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Tourism Agencies Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Plane className="w-7 h-7 text-green-500" />
                {te('tourismAgenciesTitle')}
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {TOURISM_AGENCIES.map((agency) => (
                  <a
                    key={agency.name}
                    href={agency.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100 p-5"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-lg text-gray-900 group-hover:text-primary-600 transition-colors">
                        {agency.name}
                      </span>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors" />
                    </div>
                    <p className="text-gray-600 text-sm">{te(agency.description)}</p>
                  </a>
                ))}
              </div>
            </div>

            {/* Contact CTA */}
            <div className="bg-primary-600 text-white rounded-2xl p-8 text-center">
              <Building2 className="w-12 h-12 mx-auto mb-4 opacity-80" />
              <h3 className="text-xl font-bold mb-2">{te('investorCTA')}</h3>
              <p className="text-primary-100 mb-4">{te('investorCTAText')}</p>
              <Link
                href="/contact"
                className="inline-block bg-white text-primary-600 font-semibold px-6 py-3 rounded-lg hover:bg-primary-50 transition-colors"
              >
                {te('contactUs')}
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
