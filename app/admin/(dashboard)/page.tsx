'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Newspaper,
  Calendar,
  Gavel,
  ListChecks,
  Mail,
  MessageSquare,
  Plus,
  FileUp,
  Settings,
  TrendingUp,
  Users,
  FileText,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { AdminCard, AdminCardGrid, AdminButton, AdminPageHeader } from '@/components/admin';

interface Stats {
  news: number;
  events: number;
  decisions: number;
  sessions: number;
  petitions: number;
  contacts: number;
  documents: number;
  councilMembers: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    news: 0,
    events: 0,
    decisions: 0,
    sessions: 0,
    petitions: 0,
    contacts: 0,
    documents: 0,
    councilMembers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [
        newsCount,
        eventsCount,
        decisionsCount,
        sessionsCount,
        documentsCount,
        councilMembersCount,
      ] = await Promise.all([
        supabase.from('news').select('*', { count: 'exact', head: true }),
        supabase.from('events').select('*', { count: 'exact', head: true }),
        supabase.from('council_decisions').select('*', { count: 'exact', head: true }),
        supabase.from('council_sessions').select('*', { count: 'exact', head: true }),
        supabase.from('documents').select('*', { count: 'exact', head: true }),
        supabase.from('council_members').select('*', { count: 'exact', head: true }),
      ]);

      setStats({
        news: newsCount.count || 0,
        events: eventsCount.count || 0,
        decisions: decisionsCount.count || 0,
        sessions: sessionsCount.count || 0,
        documents: documentsCount.count || 0,
        councilMembers: councilMembersCount.count || 0,
        petitions: 0,
        contacts: 0,
      });
    } catch (error) {
      console.error('Stats error:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Știri și Anunțuri', value: stats.news, icon: Newspaper, href: '/admin/stiri', color: 'bg-blue-500' },
    { label: 'Evenimente', value: stats.events, icon: Calendar, href: '/admin/evenimente', color: 'bg-purple-500' },
    { label: 'Hotărâri CL', value: stats.decisions, icon: Gavel, href: '/admin/consiliul-local/hotarari', color: 'bg-amber-500' },
    { label: 'Ședințe CL', value: stats.sessions, icon: ListChecks, href: '/admin/consiliul-local/sedinte', color: 'bg-green-500' },
    { label: 'Documente', value: stats.documents, icon: FileText, href: '/admin/documente', color: 'bg-slate-500' },
    { label: 'Consilieri Locali', value: stats.councilMembers, icon: Users, href: '/admin/consiliul-local/consilieri', color: 'bg-teal-500' },
  ];

  const quickActions = [
    { label: 'Adaugă Știre Nouă', description: 'Publică o știre sau un anunț', icon: Plus, href: '/admin/stiri/nou', color: 'text-blue-600 bg-blue-50 hover:bg-blue-100' },
    { label: 'Adaugă Eveniment', description: 'Crează un eveniment nou', icon: Calendar, href: '/admin/evenimente/nou', color: 'text-purple-600 bg-purple-50 hover:bg-purple-100' },
    { label: 'Încarcă Document', description: 'Adaugă un document nou', icon: FileUp, href: '/admin/documente/upload', color: 'text-green-600 bg-green-50 hover:bg-green-100' },
    { label: 'Adaugă Hotărâre', description: 'Înregistrează o hotărâre CL', icon: Gavel, href: '/admin/consiliul-local/hotarari/nou', color: 'text-amber-600 bg-amber-50 hover:bg-amber-100' },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Bun venit în Panoul de Administrare"
        description="Gestionează conținutul website-ului Primăriei Salonta"
      />

      {/* Stats Grid */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Statistici Rapide
        </h2>
        <AdminCardGrid columns={3}>
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link key={stat.label} href={stat.href}>
                <AdminCard className="hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 ${stat.color} rounded-xl flex items-center justify-center`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className="text-base text-slate-500">{stat.label}</p>
                      <p className="text-3xl font-bold text-slate-900">
                        {loading ? '...' : stat.value}
                      </p>
                    </div>
                  </div>
                </AdminCard>
              </Link>
            );
          })}
        </AdminCardGrid>
      </div>

      {/* Quick Actions */}
      <AdminCard title="Acțiuni Rapide" description="Creează conținut nou rapid">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                href={action.href}
                className={`flex items-center gap-4 p-5 rounded-xl border border-slate-200 ${action.color} transition-all`}
              >
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-base font-semibold text-slate-900">{action.label}</p>
                  <p className="text-sm text-slate-500">{action.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </AdminCard>

      {/* Recent Activity - Placeholder */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminCard title="Mesaje Necitite" description="Petiții și mesaje de contact noi">
          <div className="text-center py-8 text-slate-500">
            <Mail className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>Nu există mesaje noi</p>
          </div>
        </AdminCard>

        <AdminCard title="Activitate Recentă" description="Ultimele modificări">
          <div className="text-center py-8 text-slate-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>Activitatea recentă va apărea aici</p>
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
