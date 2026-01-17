'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Gavel, ListChecks, Users, Briefcase, FileCheck } from 'lucide-react';
import { AdminPageHeader, AdminCard, AdminCardGrid } from '@/components/admin';
import { adminFetch } from '@/lib/api-client';

interface Stats {
  decisions: number;
  sessions: number;
  members: number;
  commissions: number;
}

export default function ConsiliulLocalPage() {
  const [stats, setStats] = useState<Stats>({ decisions: 0, sessions: 0, members: 0, commissions: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await adminFetch('/api/admin/stats?type=consiliul-local');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();

      setStats({
        decisions: data.decisions || 0,
        sessions: data.sessions || 0,
        members: data.members || 0,
        commissions: data.commissions || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    {
      title: 'Ședințe Consiliu Local',
      description: 'Gestionează ședințele consiliului local',
      count: stats.sessions,
      icon: ListChecks,
      href: '/admin/consiliul-local/sedinte',
      color: 'bg-green-500',
    },
    {
      title: 'Hotărâri Consiliu Local',
      description: 'Gestionează hotărârile consiliului local',
      count: stats.decisions,
      icon: Gavel,
      href: '/admin/consiliul-local/hotarari',
      color: 'bg-amber-500',
    },
    {
      title: 'Consilieri Locali',
      description: 'Gestionează consilierii locali',
      count: stats.members,
      icon: Users,
      href: '/admin/consiliul-local/consilieri',
      color: 'bg-blue-500',
    },
    {
      title: 'Comisii de Specialitate',
      description: 'Gestionează comisiile consiliului',
      count: stats.commissions,
      icon: Briefcase,
      href: '/admin/consiliul-local/comisii',
      color: 'bg-purple-500',
    },
    {
      title: 'Declarații de Avere',
      description: 'Declarații avere și interese consilieri',
      count: null,
      icon: FileCheck,
      href: '/admin/consiliul-local/declaratii',
      color: 'bg-teal-500',
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Consiliul Local"
        description="Gestionează informațiile despre Consiliul Local Salonta"
        breadcrumbs={[{ label: 'Consiliul Local' }]}
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

      {/* Info Box about delete restrictions */}
      <AdminCard className="mt-6 bg-amber-50 border-amber-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">⚠️</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-amber-900">Informații Importante</h3>
            <p className="text-amber-800 mt-1">
              <strong>Atenție:</strong> Hotărârile și Ședințele Consiliului Local pot fi șterse doar în primele <strong>24 de ore</strong> de la creare. 
              După acest interval, documentele pot fi doar modificate, nu șterse.
            </p>
          </div>
        </div>
      </AdminCard>
    </div>
  );
}
