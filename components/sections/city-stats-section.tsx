'use client';

import { useTranslations } from 'next-intl';
import { 
  Users, 
  MapPin, 
  Mountain, 
  Calendar,
  Globe,
  Award
} from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';

const CITY_STATS = [
  {
    id: 'population',
    value: '17.527',
    icon: Users,
  },
  {
    id: 'area',
    value: '148,8',
    unit: 'km²',
    icon: MapPin,
  },
  {
    id: 'altitude',
    value: '96',
    unit: 'm',
    icon: Mountain,
  },
  {
    id: 'founded',
    value: '1214',
    icon: Calendar,
  },
  {
    id: 'twinCities',
    value: '6',
    icon: Globe,
  },
  {
    id: 'honoraryCitizens',
    value: '10',
    icon: Award,
  },
];

export function CityStatsSection() {
  const t = useTranslations('cityStats');

  return (
    <Section background="gray">
      <Container>
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            {t('title')}
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CITY_STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.id}
                  className="flex flex-col items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-primary-50 border border-transparent hover:border-primary-200 transition-all group hover:shadow-md hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-full bg-primary-100 group-hover:bg-primary-200 flex items-center justify-center transition-colors">
                    <Icon className="w-6 h-6 text-primary-700" />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {stat.value}
                      {stat.unit && <span className="text-sm ml-1 text-gray-500">{stat.unit}</span>}
                    </div>
                    <div className="text-sm text-gray-600">
                      {t(stat.id)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </Section>
  );
}
