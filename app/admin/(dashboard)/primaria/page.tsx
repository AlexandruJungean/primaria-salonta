'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { UserCircle, Clock, FileCheck, Building2 } from 'lucide-react';
import { AdminPageHeader, AdminCard, AdminCardGrid } from '@/components/admin';
import { adminFetch } from '@/lib/api-client';

interface Stats {
  staff: number;
  officeHours: number;
}

export default function PrimariaPage() {
  const [stats, setStats] = useState<Stats>({ staff: 0, officeHours: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await adminFetch('/api/admin/stats?type=primaria');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();

      setStats({
        staff: data.staff || 0,
        officeHours: data.officeHours || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    {
      title: 'Conducere',
      description: 'Gestionează conducerea primăriei (Primar, Viceprimar, Secretar, etc.)',
      count: stats.staff,
      icon: UserCircle,
      href: '/admin/primaria/conducere',
      color: 'bg-blue-500',
    },
    {
      title: 'Program cu Publicul',
      description: 'Gestionează orele de program pentru fiecare birou',
      count: stats.officeHours,
      icon: Clock,
      href: '/admin/primaria/program',
      color: 'bg-green-500',
    },
    {
      title: 'Declarații de Avere',
      description: 'Declarații avere și interese conducere primărie',
      count: null,
      icon: FileCheck,
      href: '/admin/primaria/declaratii',
      color: 'bg-amber-500',
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Primăria"
        description="Gestionează informațiile despre Primăria Municipiului Salonta"
        breadcrumbs={[{ label: 'Primăria' }]}
      />

      <AdminCardGrid columns={2}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.title} href={item.href}>
              <AdminCard className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 ${item.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                      {item.count !== null && (
                        <span className="text-2xl font-bold text-slate-600">
                          {loading ? '...' : item.count}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-500 mt-1">{item.description}</p>
                  </div>
                </div>
              </AdminCard>
            </Link>
          );
        })}
      </AdminCardGrid>

      {/* Info about these pages */}
      <AdminCard className="mt-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Building2 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-900">Despre această secțiune</h3>
            <p className="text-blue-800 mt-1">
              Această secțiune conține informațiile despre conducerea primăriei și programul cu publicul.
              Aceste date pot fi modificate oricând, fără restricții.
            </p>
          </div>
        </div>
      </AdminCard>
    </div>
  );
}
