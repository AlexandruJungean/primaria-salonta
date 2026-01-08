'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, AdminProfile } from '@/lib/supabase/client';

interface DashboardProfile {
  id: string;
  full_name: string;
  role: string;
  department: string | null;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<DashboardProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    news: 0,
    events: 0,
    decisions: 0,
    sessions: 0,
    petitions: 0,
    contacts: 0,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/admin/login');
        return;
      }

      const { data: adminProfile } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('id', user.id)
        .single<AdminProfile>();

      if (!adminProfile || !adminProfile.is_active) {
        await supabase.auth.signOut();
        router.push('/admin/login');
        return;
      }

      setProfile(adminProfile);
      await loadStats();
    } catch (error) {
      console.error('Auth error:', error);
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      // These will work after the database is populated
      const [newsCount, eventsCount, decisionsCount, sessionsCount] = await Promise.all([
        supabase.from('news').select('*', { count: 'exact', head: true }),
        supabase.from('events').select('*', { count: 'exact', head: true }),
        supabase.from('council_decisions').select('*', { count: 'exact', head: true }),
        supabase.from('council_sessions').select('*', { count: 'exact', head: true }),
      ]);

      setStats({
        news: newsCount.count || 0,
        events: eventsCount.count || 0,
        decisions: decisionsCount.count || 0,
        sessions: sessionsCount.count || 0,
        petitions: 0,
        contacts: 0,
      });
    } catch (error) {
      console.error('Stats error:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Primăria Salonta</h1>
              <p className="text-sm text-slate-500">Panou de Administrare</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">
              {profile?.full_name} ({profile?.role})
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Deconectare
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Dashboard</h2>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Știri & Anunțuri"
            value={stats.news}
            icon="📰"
            href="/admin/news"
          />
          <StatCard
            title="Evenimente"
            value={stats.events}
            icon="🎉"
            href="/admin/events"
          />
          <StatCard
            title="Hotărâri CL"
            value={stats.decisions}
            icon="📋"
            href="/admin/decisions"
          />
          <StatCard
            title="Ședințe CL"
            value={stats.sessions}
            icon="🏛️"
            href="/admin/sessions"
          />
          <StatCard
            title="Petiții"
            value={stats.petitions}
            icon="📬"
            href="/admin/petitions"
          />
          <StatCard
            title="Mesaje Contact"
            value={stats.contacts}
            icon="✉️"
            href="/admin/contacts"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Acțiuni Rapide</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickAction
              title="Adaugă Știre"
              description="Publică o știre nouă"
              href="/admin/news/new"
              icon="➕"
            />
            <QuickAction
              title="Adaugă Eveniment"
              description="Crează un eveniment"
              href="/admin/events/new"
              icon="📅"
            />
            <QuickAction
              title="Upload Document"
              description="Încarcă un document"
              href="/admin/documents/upload"
              icon="📄"
            />
            <QuickAction
              title="Setări"
              description="Configurări website"
              href="/admin/settings"
              icon="⚙️"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon, href }: { 
  title: string; 
  value: number; 
  icon: string;
  href: string;
}) {
  return (
    <a 
      href={href}
      className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-4">
        <span className="text-4xl">{icon}</span>
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
        </div>
      </div>
    </a>
  );
}

function QuickAction({ title, description, href, icon }: {
  title: string;
  description: string;
  href: string;
  icon: string;
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-colors"
    >
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="font-medium text-slate-900">{title}</p>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
    </a>
  );
}

