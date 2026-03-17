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
import { cn } from '@/lib/utils/cn';
import type { CityStatItem } from '@/lib/supabase/services/settings';

const STAT_CONFIG: Record<string, { icon: React.ComponentType<{ className?: string }>; iconBg: string }> = {
  population: { icon: Users, iconBg: 'bg-blue-500' },
  area: { icon: MapPin, iconBg: 'bg-green-500' },
  altitude: { icon: Mountain, iconBg: 'bg-purple-500' },
  founded: { icon: Calendar, iconBg: 'bg-amber-500' },
  twinCities: { icon: Globe, iconBg: 'bg-cyan-500' },
  honoraryCitizens: { icon: Award, iconBg: 'bg-rose-500' },
};

interface CityStatsSectionProps {
  stats?: CityStatItem[];
}

export function CityStatsSection({ stats }: CityStatsSectionProps) {
  const t = useTranslations('cityStats');

  const displayStats = stats || [];

  return (
    <Section background="gray">
      <Container>
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            {t('title')}
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {displayStats.map((stat) => {
              const config = STAT_CONFIG[stat.id] || { icon: Users, iconBg: 'bg-slate-500' };
              const Icon = config.icon;
              return (
                <div
                  key={stat.id}
                  className="flex flex-col items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 border border-transparent hover:border-gray-200 transition-all group hover:shadow-md hover:-translate-y-1"
                >
                  <div className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform',
                    config.iconBg
                  )}>
                    <Icon className="w-6 h-6 text-white" />
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
