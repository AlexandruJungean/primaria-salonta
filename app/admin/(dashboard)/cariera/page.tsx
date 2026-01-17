'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Clock, FileText, FolderDown, ChevronDown, ChevronUp, Trash2, Upload, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { adminFetch } from '@/lib/api-client';
import {
  AdminPageHeader,
  AdminButton,
  AdminCard,
  AdminInput,
  AdminTable,
  AdminConfirmDialog,
  AdminStatusBadge,
  toast,
} from '@/components/admin';

interface JobDocument {
  id: string;
  vacancy_id: string;
  document_type: string;
  file_url: string;
  file_name: string;
  title: string | null;
  sort_order: number;
  created_at: string;
}

interface JobVacancy {
  id: string;
  slug: string;
  position: string;
  department: string | null;
  application_deadline: string | null;
  exam_date: string | null;
  status: string;
  published_at: string | null;
  created_at: string;
  job_vacancy_documents: JobDocument[];
}

const STATUS_LABELS: Record<string, string> = {
  activ: 'Activ',
  in_desfasurare: 'În desfășurare',
  finalizat: 'Finalizat',
  anulat: 'Anulat',
};

const GENERAL_FORMS_SLUG = 'formulare-generale';

export default function CarieraPage() {
  const router = useRouter();
  const [allJobs, setAllJobs] = useState<JobVacancy[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<JobVacancy | null>(null);
  const [deleting, setDeleting] = useState(false);

  // General forms state
  const [formsExpanded, setFormsExpanded] = useState(false);
  const [formDocuments, setFormDocuments] = useState<JobDocument[]>([]);
  const [uploadingForm, setUploadingForm] = useState(false);
  const [deletingFormId, setDeletingFormId] = useState<string | null>(null);
  const [newFormTitle, setNewFormTitle] = useState('');
  const formFileInputRef = useRef<HTMLInputElement>(null);

  // Separate general forms from regular jobs
  const generalFormsEntry = allJobs.find(job => job.slug === GENERAL_FORMS_SLUG);
  const jobs = allJobs.filter(job => job.slug !== GENERAL_FORMS_SLUG);

  const loadJobs = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('job_vacancies')
        .select(`
          *,
          job_vacancy_documents (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAllJobs(data || []);
      
      // Extract form documents from general forms entry
      const formsEntry = data?.find(job => job.slug === GENERAL_FORMS_SLUG);
      if (formsEntry) {
        setFormDocuments(formsEntry.job_vacancy_documents || []);
      }
    } catch (error) {
      console.error('Error loading jobs:', error);
      toast.error('Eroare', 'Nu s-au putut încărca datele.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create general forms entry if it doesn't exist
  const createGeneralFormsEntry = async () => {
    try {
      const { data, error } = await supabase
        .from('job_vacancies')
        .insert({
          slug: GENERAL_FORMS_SLUG,
          position: 'Formulare generale pentru concursuri',
          status: 'activ',
          published_at: new Date().toISOString(),
          description: 'Formulare tipizate necesare pentru înscrierea la concursurile organizate de Primăria Municipiului Salonta.',
        })
        .select()
        .single();

      if (error) throw error;
      toast.success('Succes', 'Secțiunea de formulare a fost creată.');
      loadJobs();
      setFormsExpanded(true);
      return data;
    } catch (error) {
      console.error('Error creating general forms entry:', error);
      toast.error('Eroare', 'Nu s-a putut crea secțiunea de formulare.');
      return null;
    }
  };

  // Handle form file upload
  const handleFormUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    let vacancyId = generalFormsEntry?.id;
    
    // Create general forms entry if it doesn't exist
    if (!vacancyId) {
      const newEntry = await createGeneralFormsEntry();
      if (!newEntry) return;
      vacancyId = newEntry.id;
    }

    setUploadingForm(true);
    
    try {
      for (const file of Array.from(files)) {
        // Upload to R2 via API
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', 'cariera');
        formData.append('year', new Date().getFullYear().toString());

        const uploadRes = await adminFetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadRes.ok) {
          throw new Error('Upload failed');
        }

        const { url } = await uploadRes.json();

        // Insert into database
        const maxSortOrder = formDocuments.length > 0 
          ? Math.max(...formDocuments.map(d => d.sort_order)) 
          : 0;

        const { error: dbError } = await supabase
          .from('job_vacancy_documents')
          .insert({
            vacancy_id: vacancyId,
            document_type: 'formular',
            file_url: url,
            file_name: file.name,
            title: newFormTitle || file.name.replace(/\.[^/.]+$/, ''),
            sort_order: maxSortOrder + 1,
          });

        if (dbError) throw dbError;
      }

      toast.success('Succes', 'Formularul a fost adăugat.');
      setNewFormTitle('');
      loadJobs();
    } catch (error) {
      console.error('Error uploading form:', error);
      toast.error('Eroare', 'Nu s-a putut încărca formularul.');
    } finally {
      setUploadingForm(false);
      if (formFileInputRef.current) {
        formFileInputRef.current.value = '';
      }
    }
  };

  // Delete a form document
  const handleDeleteForm = async (doc: JobDocument) => {
    setDeletingFormId(doc.id);
    try {
      const { error } = await supabase
        .from('job_vacancy_documents')
        .delete()
        .eq('id', doc.id);

      if (error) throw error;

      toast.success('Șters', 'Formularul a fost șters.');
      loadJobs();
    } catch (error) {
      console.error('Error deleting form:', error);
      toast.error('Eroare', 'Nu s-a putut șterge formularul.');
    } finally {
      setDeletingFormId(null);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const handleEdit = (item: JobVacancy) => {
    router.push(`/admin/cariera/${item.id}`);
  };

  const confirmDelete = (item: JobVacancy) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    
    setDeleting(true);
    try {
      const { error } = await supabase
        .from('job_vacancies')
        .delete()
        .eq('id', itemToDelete.id);
      
      if (error) throw error;

      toast.success('Șters', 'Concursul a fost șters.');
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      loadJobs();
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Eroare', 'Nu s-a putut șterge.');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ro-RO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const columns = [
    {
      key: 'position',
      label: 'Poziție',
      render: (item: JobVacancy) => (
        <div>
          <p className="font-semibold text-slate-900">{item.position}</p>
          {item.department && <p className="text-sm text-slate-500">{item.department}</p>}
        </div>
      ),
    },
    {
      key: 'documents',
      label: 'Documente',
      className: 'w-28',
      render: (item: JobVacancy) => (
        <div className="flex items-center gap-2 text-slate-600">
          <FileText className="w-4 h-4" />
          <span>{item.job_vacancy_documents?.length || 0}</span>
        </div>
      ),
    },
    {
      key: 'deadline',
      label: 'Termen limită',
      className: 'w-36',
      render: (item: JobVacancy) => (
        item.application_deadline ? (
          <div className="flex items-center gap-2 text-slate-600">
            <Clock className="w-4 h-4" />
            {formatDate(item.application_deadline)}
          </div>
        ) : <span className="text-slate-400">-</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      className: 'w-32',
      render: (item: JobVacancy) => {
        const statusMap: Record<string, 'active' | 'pending' | 'completed' | 'cancelled'> = {
          activ: 'active',
          in_desfasurare: 'pending',
          finalizat: 'completed',
          anulat: 'cancelled',
        };
        return (
          <div>
            <AdminStatusBadge status={statusMap[item.status] || 'active'} />
            <p className="text-xs text-slate-500 mt-1">{STATUS_LABELS[item.status]}</p>
          </div>
        );
      },
    },
    {
      key: 'published_at',
      label: 'Publicat',
      className: 'w-24',
      render: (item: JobVacancy) => (
        <span className={`text-sm ${item.published_at ? 'text-green-600' : 'text-slate-400'}`}>
          {item.published_at ? '✓ Da' : '✗ Nu'}
        </span>
      ),
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Carieră / Concursuri"
        description={`${jobs.length} concursuri în baza de date`}
        breadcrumbs={[{ label: 'Carieră / Concursuri' }]}
        actions={
          <AdminButton icon={Plus} onClick={() => router.push('/admin/cariera/nou')}>
            Adaugă Concurs Nou
          </AdminButton>
        }
      />

      {/* General Forms Section - Expandable */}
      <AdminCard className="mb-6 border-blue-200 bg-blue-50/30 overflow-hidden">
        {/* Header - Clickable to expand */}
        <button
          onClick={() => setFormsExpanded(!formsExpanded)}
          className="w-full p-4 flex items-center justify-between hover:bg-blue-50/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <FolderDown className="w-5 h-5 text-blue-700" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-blue-900">Formulare Generale</h3>
              <p className="text-sm text-blue-700">
                {formDocuments.length} formulare tipizate pentru concursuri
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/ro/informatii-publice/concursuri"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-blue-600 hover:text-blue-800 p-2"
              title="Vizualizează pe site"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            {formsExpanded ? (
              <ChevronUp className="w-5 h-5 text-blue-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-blue-600" />
            )}
          </div>
        </button>

        {/* Expandable Content */}
        {formsExpanded && (
          <div className="border-t border-blue-200 p-4 bg-white">
            {/* Upload New Form */}
            <div className="flex items-end gap-3 mb-4 pb-4 border-b border-slate-200">
              <div className="flex-1">
                <AdminInput
                  label="Titlu formular (opțional)"
                  value={newFormTitle}
                  onChange={(e) => setNewFormTitle(e.target.value)}
                  placeholder="Ex: Formular de înscriere funcționari publici"
                />
              </div>
              <div>
                <input
                  ref={formFileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  onChange={handleFormUpload}
                  className="hidden"
                  id="form-upload"
                />
                <AdminButton
                  variant="primary"
                  icon={Upload}
                  loading={uploadingForm}
                  onClick={() => formFileInputRef.current?.click()}
                >
                  Încarcă Formular
                </AdminButton>
              </div>
            </div>

            {/* List of Forms */}
            {formDocuments.length === 0 ? (
              <p className="text-slate-500 text-center py-4">
                Nu există formulare. Adaugă primul formular folosind butonul de mai sus.
              </p>
            ) : (
              <div className="space-y-2">
                {formDocuments
                  .sort((a, b) => a.sort_order - b.sort_order)
                  .map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <div>
                          <a
                            href={doc.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-slate-800 hover:text-blue-600"
                          >
                            {doc.title || doc.file_name}
                          </a>
                          <p className="text-xs text-slate-500">{doc.file_name}</p>
                        </div>
                      </div>
                      <AdminButton
                        variant="danger"
                        size="sm"
                        icon={Trash2}
                        loading={deletingFormId === doc.id}
                        onClick={() => handleDeleteForm(doc)}
                      >
                        Șterge
                      </AdminButton>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </AdminCard>

      {/* Regular Jobs Section */}
      <div className="flex items-center gap-3 mb-4">
        <h3 className="font-semibold text-slate-800">Concursuri și Posturi Vacante</h3>
        <span className="text-sm text-slate-500">({jobs.length})</span>
      </div>

      <AdminTable
        data={jobs}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={confirmDelete}
        emptyMessage="Nu există concursuri. Adaugă primul concurs!"
      />

      <AdminConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Șterge Concursul?"
        message={`Ești sigur că vrei să ștergi "${itemToDelete?.position}"? Toate documentele atașate vor fi șterse.`}
        confirmLabel="Da, șterge"
        cancelLabel="Nu, anulează"
        loading={deleting}
      />
    </div>
  );
}
