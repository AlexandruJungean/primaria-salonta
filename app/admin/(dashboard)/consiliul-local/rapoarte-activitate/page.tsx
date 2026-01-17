'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  ChevronRight,
  Calendar,
  ExternalLink,
  Trash2,
  User,
  Users,
  Building,
  Edit,
} from 'lucide-react';
import {
  AdminPageHeader,
  AdminButton,
  AdminCard,
  AdminConfirmDialog,
  toast,
} from '@/components/admin';
import { adminFetch } from '@/lib/api-client';

interface Report {
  id: string;
  slug: string;
  report_type: string;
  title: string;
  summary: string | null;
  file_url: string | null;
  file_name: string | null;
  report_year: number | null;
  report_date: string | null;
  author: string | null;
  category: string | null;
  published: boolean;
  created_at: string;
}

interface YearGroup {
  year: number;
  committees: Report[];
  councilors: Report[];
}

interface MandateGroup {
  mandate: string;
  years: YearGroup[];
}

// Mandate periods
const MANDATES = [
  '2024-2028',
  '2020-2024',
  '2016-2020',
  '2012-2016',
];

function getMandatePeriod(year: number): string {
  if (year >= 2024) return '2024-2028';
  if (year >= 2020) return '2020-2024';
  if (year >= 2016) return '2016-2020';
  if (year >= 2012) return '2012-2016';
  return '2008-2012';
}

function getYearsForMandate(mandate: string): number[] {
  const [start, end] = mandate.split('-').map(Number);
  const years: number[] = [];
  for (let y = start; y < end; y++) {
    years.push(y);
  }
  return years.sort((a, b) => b - a);
}

export default function RapoarteActivitatePage() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMandate, setSelectedMandate] = useState<string | null>(null);
  const [mandateGroups, setMandateGroups] = useState<MandateGroup[]>([]);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Report | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadReports = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminFetch('/api/admin/reports?report_type=raport_activitate');
      if (!response.ok) throw new Error('Failed to fetch');
      const data: Report[] = await response.json();
      
      setReports(data || []);
      
      // Group by mandate and year
      const groups: Record<string, YearGroup[]> = {};
      
      (data || []).forEach(report => {
        const year = report.report_year || new Date().getFullYear();
        const mandate = getMandatePeriod(year);
        
        if (!groups[mandate]) {
          groups[mandate] = [];
        }
        
        let yearGroup = groups[mandate].find(y => y.year === year);
        if (!yearGroup) {
          yearGroup = { year, committees: [], councilors: [] };
          groups[mandate].push(yearGroup);
        }
        
        if (report.category === 'comisie') {
          yearGroup.committees.push(report);
        } else {
          yearGroup.councilors.push(report);
        }
      });
      
      // Convert to array
      const mandateGroups: MandateGroup[] = MANDATES.map(mandate => ({
        mandate,
        years: (groups[mandate] || []).sort((a, b) => b.year - a.year),
      }));
      
      setMandateGroups(mandateGroups);
    } catch (error) {
      console.error('Error loading reports:', error);
      toast.error('Eroare', 'Nu s-au putut încărca rapoartele.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const handleEdit = (report: Report) => {
    router.push(`/admin/consiliul-local/rapoarte-activitate/${report.id}`);
  };

  const handleAddNew = (mandate: string, type: 'comisie' | 'consilier') => {
    const years = getYearsForMandate(mandate);
    const defaultYear = years[0] || new Date().getFullYear();
    router.push(`/admin/consiliul-local/rapoarte-activitate/nou?mandate=${mandate}&type=${type}&year=${defaultYear}`);
  };

  const confirmDelete = (item: Report) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    
    setDeleting(true);
    try {
      const response = await adminFetch(`/api/admin/reports?id=${itemToDelete.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete');

      toast.success('Șters', 'Raportul a fost șters.');
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      loadReports();
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Eroare', 'Nu s-a putut șterge raportul.');
    } finally {
      setDeleting(false);
    }
  };

  const getReportCountForMandate = (mandate: string): number => {
    const group = mandateGroups.find(g => g.mandate === mandate);
    if (!group) return 0;
    return group.years.reduce((acc, y) => acc + y.committees.length + y.councilors.length, 0);
  };

  if (loading) {
    return (
      <div>
        <AdminPageHeader
          title="Rapoarte de Activitate"
          description="Gestionează rapoartele de activitate ale comisiilor și consilierilor"
          breadcrumbs={[
            { label: 'Consiliul Local' },
            { label: 'Rapoarte Activitate' },
          ]}
        />
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  // If no mandate is selected, show mandate list
  if (!selectedMandate) {
    return (
      <div>
        <AdminPageHeader
          title="Rapoarte de Activitate"
          description="Selectează un mandat pentru a gestiona rapoartele"
          breadcrumbs={[
            { label: 'Consiliul Local' },
            { label: 'Rapoarte Activitate' },
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MANDATES.map(mandate => {
            const count = getReportCountForMandate(mandate);
            return (
              <AdminCard 
                key={mandate} 
                className="cursor-pointer hover:border-purple-300 hover:shadow-md transition-all"
                onClick={() => setSelectedMandate(mandate)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Building className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">Mandatul {mandate}</h3>
                      <p className="text-sm text-slate-500">
                        {count === 0 ? 'Niciun raport' : `${count} rapoarte`}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </div>
              </AdminCard>
            );
          })}
        </div>
      </div>
    );
  }

  // Show reports for selected mandate
  const selectedGroup = mandateGroups.find(g => g.mandate === selectedMandate);
  const mandateYears = getYearsForMandate(selectedMandate);

  return (
    <div>
      <AdminPageHeader
        title={`Mandatul ${selectedMandate}`}
        description="Rapoartele de activitate ale comisiilor și consilierilor"
        breadcrumbs={[
          { label: 'Consiliul Local' },
          { label: 'Rapoarte Activitate' },
          { label: `Mandatul ${selectedMandate}` },
        ]}
        actions={
          <div className="flex gap-2">
            <AdminButton 
              variant="secondary"
              onClick={() => setSelectedMandate(null)}
            >
              Înapoi la mandate
            </AdminButton>
          </div>
        }
      />

      {/* Add buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <AdminButton 
          icon={Plus}
          onClick={() => handleAddNew(selectedMandate, 'comisie')}
          className="bg-purple-600 hover:bg-purple-700"
        >
          Adaugă Raport Comisie
        </AdminButton>
        <AdminButton 
          icon={Plus}
          onClick={() => handleAddNew(selectedMandate, 'consilier')}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          Adaugă Raport Consilier
        </AdminButton>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-6 mb-6 p-4 bg-slate-50 rounded-xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <span className="text-sm text-slate-600 font-medium">Rapoarte Comisii</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
            <User className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-sm text-slate-600 font-medium">Rapoarte Consilieri</span>
        </div>
      </div>

      {/* Years */}
      <div className="space-y-6">
        {mandateYears.map(year => {
          const yearData = selectedGroup?.years.find(y => y.year === year);
          const committees = yearData?.committees || [];
          const councilors = yearData?.councilors || [];
          const hasData = committees.length > 0 || councilors.length > 0;

          return (
            <AdminCard key={year}>
              <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Anul {year}</h3>
                  <p className="text-sm text-slate-500">
                    {committees.length} comisii • {councilors.length} consilieri
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Committees Section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-purple-700 uppercase tracking-wide flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Comisii ({committees.length})
                    </h4>
                  </div>
                  
                  {committees.length > 0 ? (
                    <div className="space-y-2">
                      {committees.map(report => (
                        <div 
                          key={report.id}
                          className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-100"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
                              <Users className="w-4 h-4 text-purple-600" />
                            </div>
                            <span className="font-medium text-slate-800 text-sm truncate">{report.title}</span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            {report.file_url && (
                              <a
                                href={report.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 text-purple-600 hover:bg-purple-100 rounded transition-colors"
                                title="Descarcă"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                            <button
                              onClick={() => handleEdit(report)}
                              className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                              title="Editează"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => confirmDelete(report)}
                              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                              title="Șterge"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 italic py-4 text-center bg-slate-50 rounded-lg">
                      Nu există rapoarte de comisii
                    </p>
                  )}
                </div>

                {/* Councilors Section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-emerald-700 uppercase tracking-wide flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Consilieri ({councilors.length})
                    </h4>
                  </div>
                  
                  {councilors.length > 0 ? (
                    <div className="space-y-2">
                      {councilors.map(report => (
                        <div 
                          key={report.id}
                          className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-100"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                              <User className="w-4 h-4 text-emerald-600" />
                            </div>
                            <div className="min-w-0">
                              <span className="font-medium text-slate-800 text-sm truncate block">
                                {report.author || report.title}
                              </span>
                              {report.author && report.title !== report.author && (
                                <span className="text-xs text-slate-500 truncate block">{report.title}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            {report.file_url && (
                              <a
                                href={report.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 text-emerald-600 hover:bg-emerald-100 rounded transition-colors"
                                title="Descarcă"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                            <button
                              onClick={() => handleEdit(report)}
                              className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                              title="Editează"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => confirmDelete(report)}
                              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                              title="Șterge"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 italic py-4 text-center bg-slate-50 rounded-lg">
                      Nu există rapoarte de consilieri
                    </p>
                  )}
                </div>
              </div>
            </AdminCard>
          );
        })}
      </div>

      <AdminConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Șterge Raportul?"
        message={`Ești sigur că vrei să ștergi raportul "${itemToDelete?.title}"?`}
        confirmLabel="Da, șterge"
        cancelLabel="Anulează"
        loading={deleting}
      />
    </div>
  );
}
