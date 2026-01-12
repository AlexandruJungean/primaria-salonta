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
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { AdminPageHeader, AdminCard, AdminCardGrid } from '@/components/admin';

interface CategoryStats {
  [key: string]: number;
}

const DOCUMENT_CATEGORIES = [
  { id: 'buget', label: 'Buget', icon: Wallet, color: 'bg-green-500' },
  { id: 'dispozitii', label: 'Dispoziții', icon: FileSignature, color: 'bg-blue-500' },
  { id: 'regulamente', label: 'Regulamente', icon: ScrollText, color: 'bg-purple-500' },
  { id: 'licitatii', label: 'Licitații', icon: Gavel, color: 'bg-amber-500' },
  { id: 'achizitii', label: 'Achiziții Publice', icon: ShoppingCart, color: 'bg-red-500' },
  { id: 'formulare', label: 'Formulare', icon: ClipboardList, color: 'bg-teal-500' },
  { id: 'autorizatii', label: 'Autorizații Construire', icon: Hammer, color: 'bg-orange-500' },
  { id: 'altele', label: 'Alte Documente', icon: FolderOpen, color: 'bg-slate-500' },
];

export default function DocumentePage() {
  const [stats, setStats] = useState<CategoryStats>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { data } = await supabase
        .from('documents')
        .select('category');

      if (data) {
        const counts: CategoryStats = {};
        data.forEach(doc => {
          counts[doc.category] = (counts[doc.category] || 0) + 1;
        });
        setStats(counts);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalDocs = Object.values(stats).reduce((a, b) => a + b, 0);

  return (
    <div>
      <AdminPageHeader
        title="Documente"
        description={`Gestionează documentele publicate pe website (${loading ? '...' : totalDocs} documente)`}
        breadcrumbs={[{ label: 'Documente' }]}
      />

      <AdminCardGrid columns={2}>
        {DOCUMENT_CATEGORIES.map((category) => {
          const Icon = category.icon;
          const count = stats[category.id] || 0;
          return (
            <Link key={category.id} href={`/admin/documente/${category.id}`}>
              <AdminCard className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 ${category.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-slate-900">{category.label}</h3>
                      <span className="text-2xl font-bold text-slate-600">
                        {loading ? '...' : count}
                      </span>
                    </div>
                    <p className="text-slate-500 mt-1">
                      {count === 0 ? 'Niciun document' : count === 1 ? '1 document' : `${count} documente`}
                    </p>
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
              <strong>Atenție:</strong> Documentele din categoriile <strong>Buget</strong>, <strong>Dispoziții</strong> și <strong>Regulamente</strong> 
              pot fi șterse doar în primele <strong>24 de ore</strong> de la încărcare.
              Restul documentelor pot fi șterse oricând.
            </p>
          </div>
        </div>
      </AdminCard>
    </div>
  );
}
