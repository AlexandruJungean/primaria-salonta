'use client';

import { useTranslations } from 'next-intl';
import { 
  Users, 
  MapPin, 
  Mountain, 
  Calendar,
  Building2,
  TreePine,
  Globe,
  Award
} from 'lucide-react';
import { Container } from '@/components/ui/container';
import { cn } from '@/lib/utils/cn';

const CITY_STATS = [
  {
    id: 'population',
    value: '17.527',
    icon: Users,
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'area',
    value: '148,8',
    unit: 'km²',
    icon: MapPin,
    color: 'from-green-500 to-green-600',
  },
  {
    id: 'altitude',
    value: '96',
    unit: 'm',
    icon: Mountain,
    color: 'from-purple-500 to-purple-600',
  },
  {
    id: 'founded',
    value: '1214',
    icon: Calendar,
    color: 'from-amber-500 to-amber-600',
  },
  {
    id: 'twinCities',
    value: '6',
    icon: Globe,
    color: 'from-cyan-500 to-cyan-600',
  },
  {
    id: 'honoraryCitizens',
    value: '10',
    icon: Award,
    color: 'from-rose-500 to-rose-600',
  },
];

export function CityStatsSection() {
  const t = useTranslations('cityStats');

  return (
    <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 pt-12 pb-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      <Container className="relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {t('title')}
          </h2>
          <p className="text-primary-200">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 mb-6">
          {CITY_STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 text-center hover:bg-white/20 transition-colors group"
              >
                <div className={cn(
                  'w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br mx-auto mb-3 flex items-center justify-center',
                  'group-hover:scale-110 transition-transform',
                  stat.color
                )}>
                  <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                  {stat.value}
                  {stat.unit && <span className="text-lg ml-1">{stat.unit}</span>}
                </div>
                <div className="text-sm text-primary-200">
                  {t(stat.id)}
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </div>
  );
}

