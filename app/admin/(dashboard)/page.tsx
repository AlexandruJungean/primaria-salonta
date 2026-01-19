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
  TrendingUp,
  Users,
  Info,
  FileText,
  AlertCircle,
  Shield,
  Lock,
  Database,
  Cloud,
  Key,
  FileCheck,
  UserCheck,
  Eye,
  Server,
  CheckCircle,
} from 'lucide-react';
import { AdminCard, AdminCardGrid, AdminPageHeader } from '@/components/admin';
import { adminFetch } from '@/lib/api-client';

interface Stats {
  news: number;
  events: number;
  decisions: number;
  sessions: number;
  documents: number;
  councilMembers: number;
  unreadPetitions: number;
  unreadContacts: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    news: 0,
    events: 0,
    decisions: 0,
    sessions: 0,
    documents: 0,
    councilMembers: 0,
    unreadPetitions: 0,
    unreadContacts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await adminFetch('/api/admin/stats?type=main');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();

      setStats({
        news: data.news || 0,
        events: data.events || 0,
        decisions: data.decisions || 0,
        sessions: data.sessions || 0,
        documents: data.documents || 0,
        councilMembers: data.councilMembers || 0,
        unreadPetitions: data.unreadPetitions || 0,
        unreadContacts: data.unreadContacts || 0,
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
    { label: 'Ordine de Zi', value: stats.sessions, icon: ListChecks, href: '/admin/consiliul-local/ordine-de-zi', color: 'bg-green-500' },
    { label: 'Documente', value: stats.documents, icon: Info, href: '/admin/informatii-publice/achizitii', color: 'bg-slate-500' },
    { label: 'Consilieri Locali', value: stats.councilMembers, icon: Users, href: '/admin/consiliul-local/consilieri', color: 'bg-teal-500' },
  ];

  const quickActions = [
    { label: 'Adaugă Știre Nouă', description: 'Publică o știre sau un anunț', icon: Plus, href: '/admin/stiri/nou', color: 'text-blue-600 bg-blue-50 hover:bg-blue-100' },
    { label: 'Adaugă Eveniment', description: 'Crează un eveniment nou', icon: Calendar, href: '/admin/evenimente/nou', color: 'text-purple-600 bg-purple-50 hover:bg-purple-100' },
    { label: 'Adaugă Hotărâre', description: 'Înregistrează o hotărâre CL', icon: Gavel, href: '/admin/consiliul-local/hotarari/nou', color: 'text-amber-600 bg-amber-50 hover:bg-amber-100' },
    { label: 'Adaugă Ordine de Zi', description: 'Crează o ședință nouă', icon: ListChecks, href: '/admin/consiliul-local/ordine-de-zi/nou', color: 'text-green-600 bg-green-50 hover:bg-green-100' },
  ];

  const totalUnreadMessages = stats.unreadPetitions + stats.unreadContacts;

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

      {/* Messages and Activity */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminCard title="Mesaje Necitite" description="Petiții și mesaje de contact noi">
          {loading ? (
            <div className="text-center py-8 text-slate-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-3">Se încarcă...</p>
            </div>
          ) : totalUnreadMessages === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Mail className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p>Nu există mesaje noi</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.unreadPetitions > 0 && (
                <Link 
                  href="/admin/mesaje/petitii"
                  className="flex items-center gap-4 p-4 rounded-xl bg-amber-50 hover:bg-amber-100 transition-colors border border-amber-200"
                >
                  <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">Petiții în așteptare</p>
                    <p className="text-sm text-slate-600">Petiții noi sau în curs de rezolvare</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-amber-600">{stats.unreadPetitions}</span>
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                  </div>
                </Link>
              )}
              {stats.unreadContacts > 0 && (
                <Link 
                  href="/admin/mesaje/contact"
                  className="flex items-center gap-4 p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-200"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">Mesaje de contact noi</p>
                    <p className="text-sm text-slate-600">Mesaje necitite prin formularul de contact</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-blue-600">{stats.unreadContacts}</span>
                    <AlertCircle className="w-5 h-5 text-blue-500" />
                  </div>
                </Link>
              )}
              <div className="pt-2">
                <Link 
                  href="/admin/mesaje/petitii"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Vezi toate mesajele →
                </Link>
              </div>
            </div>
          )}
        </AdminCard>

        <AdminCard title="Activitate Recentă" description="Ultimele modificări">
          <div className="space-y-3">
            <Link 
              href="/admin/logs"
              className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-200"
            >
              <div className="w-10 h-10 rounded-full bg-slate-500 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-900">Jurnal de Activitate</p>
                <p className="text-sm text-slate-600">Vezi toate modificările efectuate</p>
              </div>
            </Link>
            <Link 
              href="/admin/logs/erori"
              className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-200"
            >
              <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-900">Erori Raportate</p>
                <p className="text-sm text-slate-600">Monitorizează erorile din aplicație</p>
              </div>
            </Link>
          </div>
        </AdminCard>
      </div>

      {/* Security Information Section */}
      <div className="mt-8">
        <AdminCard 
          title="Securitate și Protecția Datelor" 
          description="Măsuri de securitate implementate pentru protejarea datelor și a aplicației"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Authentication & Authorization */}
            <div className="p-5 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Autentificare și Autorizare</h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Supabase Auth</strong> - Sistem de autentificare securizat cu JWT tokens</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Bearer Token</strong> - Autentificare API prin token în header Authorization</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Sesiuni securizate</strong> - Managementul automat al sesiunilor cu refresh tokens</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Verificare admin per acțiune</strong> - Fiecare request API verifică permisiunile</span>
                </li>
              </ul>
            </div>

            {/* Data Storage */}
            <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center">
                  <Database className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Stocare Date</h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Supabase PostgreSQL</strong> - Bază de date cu Row Level Security (RLS)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Supabase Storage</strong> - Stocare imagini cu politici de acces</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Cloudflare R2</strong> - Stocare documente cu CDN global și protecție DDoS</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Presigned URLs</strong> - URL-uri temporare pentru upload securizat</span>
                </li>
              </ul>
            </div>

            {/* Anti-Spam Protection */}
            <div className="p-5 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Protecție Anti-Spam și Boți</h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Google reCAPTCHA v3</strong> - Verificare invizibilă anti-bot pe formulare</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Scor de încredere</strong> - Analiza comportamentului cu prag minim 0.5</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Blocarea email-urilor temporare</strong> - Lista neagră de domenii spam</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Verificare DNS/MX</strong> - Validarea domeniului email prin DNS lookup</span>
                </li>
              </ul>
            </div>

            {/* Input Validation */}
            <div className="p-5 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
                  <FileCheck className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Validare Date și Fișiere</h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Zod Schemas</strong> - Validare strictă a datelor de intrare</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Compresie automată imagini</strong> - Conversie WebP, eliminare EXIF</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Limite dimensiune</strong> - Max 50MB documente, 10MB imagini</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Sanitizare input</strong> - Curățare slug-uri, nume fișiere, text</span>
                </li>
              </ul>
            </div>

            {/* Audit & Monitoring */}
            <div className="p-5 rounded-xl bg-gradient-to-br from-slate-50 to-gray-100 border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-slate-600 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Audit și Monitorizare</h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Jurnal de audit</strong> - Logarea tuturor acțiunilor admin (creare, modificare, ștergere)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Logare erori</strong> - Înregistrare automată cu nivel de severitate</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Tracking IP și User-Agent</strong> - Identificarea dispozitivelor și locațiilor</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Sanitizare log-uri</strong> - Excluderea automată a datelor sensibile</span>
                </li>
              </ul>
            </div>

            {/* Rate Limiting */}
            <div className="p-5 rounded-xl bg-gradient-to-br from-cyan-50 to-sky-50 border border-cyan-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-cyan-500 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Rate Limiting</h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Upstash Redis</strong> - Rate limiting distribuit în cloud</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Login</strong> - 5 încercări / 15 minute per IP</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Upload</strong> - 30 fișiere / minut per utilizator</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Formulare publice</strong> - 3 trimiteri / oră per IP</span>
                </li>
              </ul>
            </div>

            {/* Infrastructure Security */}
            <div className="p-5 rounded-xl bg-gradient-to-br from-red-50 to-rose-50 border border-red-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center">
                  <Server className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Securitate Infrastructură</h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>HTTPS obligatoriu</strong> - Criptare SSL/TLS pentru toate conexiunile</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Variabile de mediu</strong> - Secretele stocate securizat, nu în cod</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Cloudflare CDN</strong> - Protecție DDoS, WAF și cache global</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Prepared Statements</strong> - Protecție SQL Injection prin Supabase</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Summary Box */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-1">Infrastructură de Securitate Enterprise</h4>
                <p className="text-blue-100 text-sm leading-relaxed">
                  Aplicația utilizează servicii cloud de nivel enterprise (Supabase, Cloudflare) care asigură 
                  disponibilitate ridicată, criptare în tranzit și în repaus, conformitate GDPR 
                  și monitorizare 24/7. Toate datele sunt procesate și stocate în conformitate cu regulamentele 
                  europene de protecție a datelor.
                </p>
              </div>
            </div>
          </div>

          {/* Technology Stack */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <h4 className="font-medium text-slate-900 mb-3">Tehnologii Utilizate pentru Securitate:</h4>
            <div className="flex flex-wrap gap-2">
              {[
                { name: 'Supabase Auth', color: 'bg-emerald-100 text-emerald-700' },
                { name: 'PostgreSQL RLS', color: 'bg-blue-100 text-blue-700' },
                { name: 'Cloudflare R2', color: 'bg-orange-100 text-orange-700' },
                { name: 'reCAPTCHA v3', color: 'bg-yellow-100 text-yellow-700' },
                { name: 'JWT Tokens', color: 'bg-purple-100 text-purple-700' },
                { name: 'Zod Validation', color: 'bg-pink-100 text-pink-700' },
                { name: 'Upstash Redis', color: 'bg-red-100 text-red-700' },
                { name: 'DNS Verification', color: 'bg-cyan-100 text-cyan-700' },
                { name: 'WebP Compression', color: 'bg-teal-100 text-teal-700' },
              ].map((tech) => (
                <span
                  key={tech.name}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium ${tech.color}`}
                >
                  {tech.name}
                </span>
              ))}
            </div>
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
