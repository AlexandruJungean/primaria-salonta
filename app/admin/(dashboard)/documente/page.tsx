'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  FileText,
  Wallet,
  FileSignature,
  ScrollText,
  Gavel,
  ShoppingCart,
  ClipboardList,
  Hammer,
  FolderOpen,
  Building2,
  Scale,
  MessageSquare,
  BookOpen,
  Users,
  Leaf,
  Receipt,
  AlertCircle,
  MapPin,
  Home,
  HeartHandshake,
  Megaphone,
  Network,
  ShieldCheck,
  FileCheck,
  Landmark,
  ChevronRight,
  File,
  Newspaper,
  Truck,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { AdminPageHeader, AdminCard, AdminCardGrid } from '@/components/admin';

interface CategoryStats {
  [key: string]: number;
}

// Document groups organized by website sections
const DOCUMENT_SECTIONS = [
  {
    id: 'informatii-publice',
    title: 'Informații Publice',
    description: 'Documente pentru secțiunea Informații Publice',
    icon: FileText,
    color: 'bg-blue-500',
    categories: [
      { id: 'buget', label: 'Buget', icon: Wallet, color: 'bg-emerald-500', filterType: 'category', filterValue: 'buget' },
      { id: 'dispozitii', label: 'Dispoziții', icon: FileSignature, color: 'bg-violet-500', filterType: 'category', filterValue: 'dispozitii' },
      { id: 'formulare', label: 'Formulare', icon: ClipboardList, color: 'bg-teal-500', filterType: 'category', filterValue: 'formulare' },
      { id: 'anunturi', label: 'Anunțuri', icon: Megaphone, color: 'bg-orange-500', filterType: 'category', filterValue: 'anunturi' },
      { id: 'regulamente', label: 'Regulamente', icon: ScrollText, color: 'bg-purple-500', filterType: 'category', filterValue: 'regulamente' },
      { id: 'licitatii', label: 'Licitații', icon: Gavel, color: 'bg-amber-500', filterType: 'category', filterValue: 'licitatii' },
      { id: 'achizitii', label: 'Achiziții Publice', icon: ShoppingCart, color: 'bg-red-500', filterType: 'category', filterValue: 'achizitii' },
      { id: 'mediu', label: 'Mediu', icon: Leaf, color: 'bg-green-500', filterType: 'category', filterValue: 'mediu' },
      { id: 'taxe-impozite', label: 'Taxe și Impozite', icon: Receipt, color: 'bg-cyan-500', filterType: 'category', filterValue: 'taxe_impozite' },
      { id: 'somatii', label: 'Somații', icon: AlertCircle, color: 'bg-rose-500', filterType: 'category', filterValue: 'somatii' },
      { id: 'planuri-urbanistice', label: 'Planuri Urbanistice', icon: MapPin, color: 'bg-indigo-500', filterType: 'category', filterValue: 'planuri_urbanistice' },
      { id: 'oferte-terenuri', label: 'Oferte Terenuri', icon: Home, color: 'bg-lime-600', filterType: 'category', filterValue: 'oferte_terenuri' },
      { id: 'publicatii-casatorie', label: 'Publicații Căsătorie', icon: HeartHandshake, color: 'bg-pink-500', filterType: 'category', filterValue: 'publicatii_casatorie' },
      { id: 'publicatii-vanzare', label: 'Publicații Vânzare', icon: Truck, color: 'bg-slate-600', filterType: 'category', filterValue: 'publicatii_vanzare' },
      { id: 'retele-telecom', label: 'Rețele Telecom', icon: Network, color: 'bg-sky-500', filterType: 'category', filterValue: 'retele_telecom' },
      { id: 'gdpr', label: 'GDPR', icon: ShieldCheck, color: 'bg-gray-600', filterType: 'category', filterValue: 'gdpr' },
      { id: 'solicitare-informatii', label: 'Solicitare Informații', icon: FileCheck, color: 'bg-blue-600', filterType: 'category', filterValue: 'solicitare_informatii' },
      { id: 'adapost-caini', label: 'Adăpost Câini', icon: HeartHandshake, color: 'bg-yellow-600', filterType: 'category', filterValue: 'adapost_caini' },
    ],
  },
  {
    id: 'monitorul-oficial',
    title: 'Monitorul Oficial Local',
    description: 'Documente pentru secțiunea Monitorul Oficial',
    icon: Landmark,
    color: 'bg-amber-600',
    categories: [
      { id: 'registre-dispozitii', label: 'Registre Dispoziții', icon: BookOpen, color: 'bg-green-600', filterType: 'source_folder', filterValue: 'dispozitiile-autoritatii-executive' },
      { id: 'regulamente-mol', label: 'Regulamente', icon: ScrollText, color: 'bg-purple-600', filterType: 'source_folder', filterValue: 'regulamentele-privind-procedurile-administrative' },
      { id: 'hotarari-republicate', label: 'Hotărâri Republicate', icon: Gavel, color: 'bg-amber-600', filterType: 'source_folder', filterValue: 'hotarari-republicate' },
      { id: 'documente-financiare', label: 'Documente Financiare', icon: Wallet, color: 'bg-emerald-600', filterType: 'source_folder', filterValue: 'documente-si-informatii-financiare' },
      { id: 'statut', label: 'Statut UAT', icon: File, color: 'bg-blue-600', filterType: 'source_folder', filterValue: 'statutul-unitatii-administrativ-teritoriale' },
      { id: 'alte-documente-mol', label: 'Alte Documente', icon: FolderOpen, color: 'bg-slate-500', filterType: 'source_folder', filterValue: 'alte-documente' },
      { id: 'hotarari-deliberative', label: 'Hotărâri Autoritate Deliberativă', icon: Gavel, color: 'bg-red-600', filterType: 'source_folder', filterValue: 'hotararile-autoritatii-deliberative' },
    ],
  },
  {
    id: 'transparenta',
    title: 'Transparență Decizională',
    description: 'Documente pentru secțiunea Transparență',
    icon: Scale,
    color: 'bg-purple-600',
    categories: [
      { id: 'dezbateri-publice', label: 'Dezbateri Publice', icon: MessageSquare, color: 'bg-purple-500', filterType: 'source_folder', filterValue: 'dezbateri-publice' },
      { id: 'generale', label: 'Generale (Legea 52)', icon: FileText, color: 'bg-blue-500', filterType: 'source_folder', filterValue: 'generale' },
      { id: 'buletin-informativ', label: 'Buletin Informativ', icon: Newspaper, color: 'bg-orange-500', filterType: 'source_folder', filterValue: 'buletin-informativ' },
      { id: 'anunturi-transparenta', label: 'Anunțuri Transparență', icon: Megaphone, color: 'bg-teal-500', filterType: 'source_folder', filterValue: 'anunturi' },
    ],
  },
  {
    id: 'primaria',
    title: 'Primăria',
    description: 'Documente pentru secțiunea Primăria',
    icon: Building2,
    color: 'bg-teal-600',
    categories: [
      { id: 'organigrama', label: 'Organigrama', icon: Network, color: 'bg-blue-500', filterType: 'source_folder', filterValue: 'organigrama' },
      { id: 'regulament-functionare', label: 'Regulament de Organizare', icon: ScrollText, color: 'bg-purple-500', filterType: 'source_folder', filterValue: 'regulament-de-organizare-si-functionare' },
      { id: 'rapoarte-anuale', label: 'Rapoarte Anuale Primar', icon: FileCheck, color: 'bg-green-500', filterType: 'source_folder', filterValue: 'rapoarte-anuale-ale-primarului' },
    ],
  },
  {
    id: 'altele',
    title: 'Alte Secțiuni',
    description: 'Documente pentru alte pagini',
    icon: FolderOpen,
    color: 'bg-slate-600',
    categories: [
      { id: 'consilieri-locali', label: 'Consilieri Locali', icon: Users, color: 'bg-blue-500', filterType: 'category', filterValue: 'consilieri_locali' },
      { id: 'agenti-economici', label: 'Agenți Economici', icon: Building2, color: 'bg-amber-500', filterType: 'category', filterValue: 'agenti_economici' },
      { id: 'voluntariat', label: 'Voluntariat', icon: HeartHandshake, color: 'bg-pink-500', filterType: 'source_folder', filterValue: 'activitate-de-voluntariat' },
      { id: 'autorizatii', label: 'Autorizații Construire', icon: Hammer, color: 'bg-orange-500', filterType: 'category', filterValue: 'autorizatii' },
      { id: 'altele', label: 'Alte Documente', icon: FolderOpen, color: 'bg-slate-500', filterType: 'category', filterValue: 'altele' },
    ],
  },
];

export default function DocumentePage() {
  const [stats, setStats] = useState<CategoryStats>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Get stats by category
      const { data: categoryData } = await supabase
        .from('documents')
        .select('category');

      // Get stats by source_folder
      const { data: sourceFolderData } = await supabase
        .from('documents')
        .select('source_folder');

      const counts: CategoryStats = {};
      
      // Count by category
      categoryData?.forEach(doc => {
        if (doc.category) {
          counts[`category:${doc.category}`] = (counts[`category:${doc.category}`] || 0) + 1;
        }
      });

      // Count by source_folder
      sourceFolderData?.forEach(doc => {
        if (doc.source_folder) {
          counts[`source_folder:${doc.source_folder}`] = (counts[`source_folder:${doc.source_folder}`] || 0) + 1;
        }
      });

      setStats(counts);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCount = (filterType: string, filterValue: string) => {
    return stats[`${filterType}:${filterValue}`] || 0;
  };

  const getTotalCount = () => {
    const categoryTotal = Object.entries(stats)
      .filter(([key]) => key.startsWith('category:'))
      .reduce((sum, [, count]) => sum + count, 0);
    return categoryTotal;
  };

  return (
    <div>
      <AdminPageHeader
        title="Gestionare Documente"
        description={`Gestionează toate documentele publicate pe website (${loading ? '...' : getTotalCount()} documente totale)`}
        breadcrumbs={[{ label: 'Documente' }]}
      />

      {/* Document Sections */}
      <div className="space-y-8">
        {DOCUMENT_SECTIONS.map((section) => {
          const SectionIcon = section.icon;
          const sectionTotal = section.categories.reduce((sum, cat) => 
            sum + getCount(cat.filterType, cat.filterValue), 0
          );

          return (
            <AdminCard key={section.id} className="overflow-hidden">
              {/* Section Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 ${section.color} rounded-xl flex items-center justify-center`}>
                  <SectionIcon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-slate-900">{section.title}</h2>
                  <p className="text-slate-500">{section.description} • {loading ? '...' : sectionTotal} documente</p>
                </div>
              </div>

              {/* Categories Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {section.categories.map((category) => {
                  const Icon = category.icon;
                  const count = getCount(category.filterType, category.filterValue);
                  // Create URL with filter params
                  const url = `/admin/documente/gestiune?type=${category.filterType}&value=${encodeURIComponent(category.filterValue)}&label=${encodeURIComponent(category.label)}`;
                  
                  return (
                    <Link
                      key={category.id}
                      href={url}
                      className="group flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all border border-transparent hover:border-slate-200"
                    >
                      <div className={`w-10 h-10 ${category.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 text-sm truncate">{category.label}</p>
                        <p className="text-xs text-slate-500">{loading ? '...' : count} doc.</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  );
                })}
              </div>
            </AdminCard>
          );
        })}
      </div>

      {/* Info Box */}
      <AdminCard className="mt-6 bg-amber-50 border-amber-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-amber-900">Informații Importante</h3>
            <p className="text-amber-800 mt-1">
              <strong>Atenție:</strong> Documentele din categoriile <strong>Buget</strong>, <strong>Dispoziții</strong> și <strong>Regulamente</strong> 
              {' '}pot fi șterse doar în primele <strong>24 de ore</strong> de la încărcare pentru a respecta cerințele legale.
            </p>
            <p className="text-amber-700 mt-2 text-sm">
              Fiecare categorie de documente are setări și funcționalități specifice. Selectează o categorie pentru a gestiona documentele asociate.
            </p>
          </div>
        </div>
      </AdminCard>

      {/* Quick Links for old structure */}
      <AdminCard className="mt-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-900">Rapoarte și Studii</h3>
            <p className="text-blue-800 mt-1">
              Rapoartele și studiile sunt gestionate separat în baza de date.
            </p>
            <Link 
              href="/admin/documente/rapoarte" 
              className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <ShieldCheck className="w-4 h-4" />
              Gestionează Rapoarte și Studii
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </AdminCard>
    </div>
  );
}
