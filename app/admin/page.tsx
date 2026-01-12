'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
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
  Building2,
} from 'lucide-react';
import { supabase, type AdminProfile } from '@/lib/supabase/client';

interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

interface Stats {
  news: number;
  events: number;
  decisions: number;
  sessions: number;
  documents: number;
  councilMembers: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    news: 0,
    events: 0,
    decisions: 0,
    sessions: 0,
    documents: 0,
    councilMembers: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        router.push('/admin/login');
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('id', authUser.id)
        .single<AdminProfile>();

      if (profileError || !profile || !profile.is_active) {
        await supabase.auth.signOut();
        router.push('/admin/login');
        return;
      }

      setUser({
        id: authUser.id,
        email: authUser.email || '',
        fullName: profile.full_name,
        role: profile.role,
      });

      loadStats();
    } catch (err) {
      console.error('Auth error:', err);
      router.push('/admin/login');
    } finally {
      setAuthLoading(false);
    }
  };

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
      });
    } catch (error) {
      console.error('Stats error:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto" />
          <p className="text-slate-600 mt-4 text-lg">Se încarcă...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

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
    { label: 'Încarcă Document', description: 'Adaugă un document nou', icon: FileUp, href: '/admin/documente', color: 'text-green-600 bg-green-50 hover:bg-green-100' },
    { label: 'Adaugă Hotărâre', description: 'Înregistrează o hotărâre CL', icon: Gavel, href: '/admin/consiliul-local/hotarari/nou', color: 'text-amber-600 bg-amber-50 hover:bg-amber-100' },
  ];

  const navItems = [
    { label: 'Știri', href: '/admin/stiri', icon: Newspaper },
    { label: 'Evenimente', href: '/admin/evenimente', icon: Calendar },
    { label: 'Consiliul Local', href: '/admin/consiliul-local/hotarari', icon: Users },
    { label: 'Primăria', href: '/admin/primaria/conducere', icon: Building2 },
    { label: 'Documente', href: '/admin/documente', icon: FileText },
    { label: 'Setări', href: '/admin/setari', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center border border-slate-200 p-1">
              <Image
                src="/logo/logo-transparent.webp"
                alt="Primăria Salonta"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Primăria Salonta</h1>
              <p className="text-sm text-slate-500">Panou de Administrare</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium text-slate-900">{user.fullName}</p>
              <p className="text-sm text-slate-500 capitalize">{user.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Deconectare
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 px-4 py-3 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-t-lg transition-colors"
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Bun venit, {user.fullName.split(' ')[0]}!</h2>
          <p className="text-lg text-slate-600 mt-1">Gestionează conținutul website-ului Primăriei Salonta</p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Statistici Rapide
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <Link key={stat.label} href={stat.href}>
                  <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 ${stat.color} rounded-xl flex items-center justify-center`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <p className="text-base text-slate-500">{stat.label}</p>
                        <p className="text-3xl font-bold text-slate-900">
                          {statsLoading ? '...' : stat.value}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border mb-8">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Acțiuni Rapide</h3>
          <p className="text-slate-600 mb-6">Creează conținut nou rapid</p>
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
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Mesaje Necitite</h3>
            <p className="text-slate-600 mb-4">Petiții și mesaje de contact noi</p>
            <div className="text-center py-8 text-slate-500">
              <Mail className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p>Nu există mesaje noi</p>
              <Link href="/admin/mesaje/petitii" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
                Vezi toate petițiile →
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Navigare Rapidă</h3>
            <p className="text-slate-600 mb-4">Secțiuni disponibile</p>
            <div className="space-y-2">
              <Link href="/admin/stiri" className="block p-3 rounded-lg hover:bg-slate-50 text-slate-700">📰 Știri și Anunțuri</Link>
              <Link href="/admin/evenimente" className="block p-3 rounded-lg hover:bg-slate-50 text-slate-700">📅 Evenimente</Link>
              <Link href="/admin/consiliul-local/hotarari" className="block p-3 rounded-lg hover:bg-slate-50 text-slate-700">⚖️ Hotărâri Consiliu Local</Link>
              <Link href="/admin/primaria/conducere" className="block p-3 rounded-lg hover:bg-slate-50 text-slate-700">🏛️ Conducere Primărie</Link>
              <Link href="/admin/galerie" className="block p-3 rounded-lg hover:bg-slate-50 text-slate-700">🖼️ Galerie Foto</Link>
              <Link href="/admin/webcams" className="block p-3 rounded-lg hover:bg-slate-50 text-slate-700">📹 Camere Web</Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-8">
        <div className="max-w-7xl mx-auto px-6 py-4 text-center text-slate-500 text-sm">
          <Link href="/ro" className="hover:text-blue-600">← Înapoi la website</Link>
          <span className="mx-4">|</span>
          © {new Date().getFullYear()} Primăria Municipiului Salonta
        </div>
      </footer>
    </div>
  );
}
