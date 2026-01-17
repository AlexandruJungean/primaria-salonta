'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Save, ArrowLeft, Trash2, Upload, FileText, Plus } from 'lucide-react';
import {
  AdminPageHeader,
  AdminButton,
  AdminCard,
  AdminInput,
  AdminDateInput,
  AdminTextarea,
  AdminConfirmDialog,
  toast,
  canDeleteItem,
} from '@/components/admin';
import { adminFetch } from '@/lib/api-client';

interface SessionFormData {
  slug: string;
  title: string;
  session_date: string;
  description: string;
  published: boolean;
}

interface DecisionDocument {
  id: string;
  decision_id: string;
  document_type: string;
  file_url: string;
  file_name: string;
  file_size: number | null;
  title: string;
  sort_order: number;
}

interface Decision {
  id: string;
  session_id: string;
  decision_number: number;
  decision_date: string;
  title: string;
  published: boolean;
  council_decision_documents: DecisionDocument[];
}

const initialFormData: SessionFormData = {
  slug: '',
  title: '',
  session_date: new Date().toISOString().split('T')[0],
  description: '',
  published: true,
};


const DELETE_LIMIT_HOURS = 24;

export default function HotarariEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === 'nou';

  const [formData, setFormData] = useState<SessionFormData>(initialFormData);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof SessionFormData, string>>>({});

  // New decision form state
  const [showNewDecisionForm, setShowNewDecisionForm] = useState(false);
  const [newDecisionTitle, setNewDecisionTitle] = useState('');
  const [newDecisionFile, setNewDecisionFile] = useState<File | null>(null);
  const [creatingDecision, setCreatingDecision] = useState(false);
  const newDecisionFileRef = useRef<HTMLInputElement>(null);

  const loadSession = useCallback(async () => {
    if (isNew) return;

    try {
      const response = await adminFetch(`/api/admin/council-sessions?id=${id}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();

      if (data) {
        setFormData({
          slug: data.slug || '',
          title: data.title || '',
          session_date: data.session_date || '',
          description: data.description || '',
          published: data.published ?? true,
        });
        setCreatedAt(data.created_at);
        setDecisions(data.decisions || []);
      }
    } catch (error) {
      console.error('Error loading session:', error);
      toast.error('Eroare', 'Nu s-au putut încărca datele.');
      router.push('/admin/consiliul-local/hotarari');
    } finally {
      setLoading(false);
    }
  }, [id, isNew, router]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const generateSlug = (date: string) => {
    if (!date) return '';
    const dateObj = new Date(date);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = dateObj.toLocaleDateString('ro-RO', { month: 'long' });
    const year = dateObj.getFullYear();
    return `${day}-${month}-${year}`.toLowerCase().replace(/\s+/g, '-');
  };

  const generateTitle = (date: string) => {
    if (!date) return '';
    const dateObj = new Date(date);
    return `Ședința din ${dateObj.toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' })}`;
  };

  const handleDateChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      session_date: value,
      slug: generateSlug(value), // Always auto-generate slug
      title: isNew ? generateTitle(value) : prev.title,
    }));
    setErrors(prev => ({ ...prev, session_date: undefined }));
  };

  const handleChange = (field: keyof SessionFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof SessionFormData, string>> = {};
    if (!formData.title.trim()) newErrors.title = 'Titlul este obligatoriu';
    if (!formData.slug.trim()) newErrors.slug = 'Slug-ul este obligatoriu';
    if (!formData.session_date) newErrors.session_date = 'Data este obligatorie';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      toast.error('Verifică formularul', 'Completează câmpurile obligatorii.');
      return;
    }

    setSaving(true);
    try {
      const sessionData = {
        slug: formData.slug.trim(),
        title: formData.title.trim(),
        session_date: formData.session_date,
        description: formData.description.trim() || null,
        published: formData.published,
        source: 'hotarari',
      };

      if (isNew) {
        const response = await adminFetch('/api/admin/council-sessions', {
          method: 'POST',
          body: JSON.stringify(sessionData),
        });
        if (!response.ok) throw new Error('Failed to create');
        toast.success('Ședință creată', 'Datele au fost salvate!');
        router.push('/admin/consiliul-local/hotarari');
      } else {
        const response = await adminFetch(`/api/admin/council-sessions?id=${id}`, {
          method: 'PATCH',
          body: JSON.stringify(sessionData),
        });
        if (!response.ok) throw new Error('Failed to update');
        toast.success('Date salvate', 'Modificările au fost salvate!');
        router.push('/admin/consiliul-local/hotarari');
      }
    } catch (error) {
      console.error('Error saving session:', error);
      toast.error('Eroare la salvare', 'Nu s-au putut salva datele.');
    } finally {
      setSaving(false);
    }
  };

  // Decision management
  const handleCreateDecision = async () => {
    if (!newDecisionTitle || !newDecisionFile) {
      toast.error('Completează câmpurile', 'Titlul și documentul sunt obligatorii.');
      return;
    }

    setCreatingDecision(true);
    try {
      // Step 1: Create the decision
      const decisionData = {
        session_id: id,
        decision_number: decisions.length + 1, // Auto-increment
        decision_date: formData.session_date,
        title: newDecisionTitle.trim(),
        published: true,
      };

      const response = await adminFetch('/api/admin/council-decisions', {
        method: 'POST',
        body: JSON.stringify(decisionData),
      });

      if (!response.ok) throw new Error('Failed to create decision');
      const newDecision = await response.json();

      // Step 2: Upload the document
      const year = new Date(formData.session_date).getFullYear();
      const uploadFormData = new FormData();
      uploadFormData.append('file', newDecisionFile);
      uploadFormData.append('decision_id', newDecision.id);
      uploadFormData.append('document_type', 'hotarare');
      uploadFormData.append('title', newDecisionTitle.trim());
      uploadFormData.append('year', year.toString());

      const uploadResponse = await adminFetch('/api/admin/council-decisions/documents', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!uploadResponse.ok) throw new Error('Failed to upload document');

      toast.success('Hotărâre adăugată', 'Hotărârea și documentul au fost salvate!');
      setNewDecisionTitle('');
      setNewDecisionFile(null);
      if (newDecisionFileRef.current) newDecisionFileRef.current.value = '';
      setShowNewDecisionForm(false);
      loadSession();
    } catch (error) {
      console.error('Error creating decision:', error);
      toast.error('Eroare', 'Nu s-a putut crea hotărârea.');
    } finally {
      setCreatingDecision(false);
    }
  };

  const handleDeleteDecision = async (decision: Decision) => {
    try {
      const response = await adminFetch(`/api/admin/council-decisions?id=${decision.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete');
      toast.success('Șters', 'Hotărârea a fost ștearsă.');
      loadSession();
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Eroare', 'Nu s-a putut șterge.');
    }
  };


  const canDelete = (): boolean => canDeleteItem(createdAt, DELETE_LIMIT_HOURS);

  const handleDelete = async () => {
    if (isNew) return;
    setDeleting(true);
    try {
      const response = await adminFetch(`/api/admin/council-sessions?id=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete');
      toast.success('Șters', 'Ședința a fost ștearsă.');
      router.push('/admin/consiliul-local/hotarari');
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Eroare', 'Nu s-a putut șterge.');
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ro-RO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (loading) {
    return <div className="flex items-center justify-center py-12"><div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" /></div>;
  }

  return (
    <div>
      <AdminPageHeader
        title={isNew ? 'Adaugă Ședință Nouă' : `Hotărâri - ${formatDate(formData.session_date)}`}
        breadcrumbs={[
          { label: 'Consiliul Local', href: '/admin/consiliul-local' },
          { label: 'Hotărâri', href: '/admin/consiliul-local/hotarari' },
          { label: isNew ? 'Ședință Nouă' : formatDate(formData.session_date) },
        ]}
        actions={
          <div className="flex gap-3">
            <AdminButton variant="ghost" icon={ArrowLeft} onClick={() => router.push('/admin/consiliul-local/hotarari')}>Înapoi</AdminButton>
            {!isNew && canDelete() && <AdminButton variant="danger" icon={Trash2} onClick={() => setDeleteDialogOpen(true)}>Șterge</AdminButton>}
          </div>
        }
      />

      <div className="space-y-6">
        {/* Session Info */}
        <AdminCard title="Informații Ședință">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AdminDateInput label="Data Ședință" value={formData.session_date} onChange={handleDateChange} required error={errors.session_date} />
              <AdminInput label="Titlu" value={formData.title} onChange={(e) => handleChange('title', e.target.value)} required error={errors.title} />
            </div>
            <p className="text-sm text-slate-500">Slug generat automat: <code className="bg-slate-100 px-2 py-1 rounded">{formData.slug}</code></p>
            <AdminTextarea label="Descriere (opțional)" value={formData.description} onChange={(e) => handleChange('description', e.target.value)} rows={3} placeholder="Descriere opțională a ședinței..." />
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600">Publicată:</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={formData.published} onChange={(e) => handleChange('published', e.target.checked)} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <AdminButton icon={Save} onClick={handleSave} loading={saving}>Salvează</AdminButton>
          </div>
        </AdminCard>

        {/* Decisions List */}
        {!isNew && (
          <AdminCard title={`Hotărâri Adoptate (${decisions.length})`}>
            <div className="space-y-4">
              {/* Add new decision button */}
              {!showNewDecisionForm ? (
                <AdminButton icon={Plus} variant="secondary" onClick={() => setShowNewDecisionForm(true)}>
                  Adaugă Hotărâre Nouă
                </AdminButton>
              ) : (
                <div className="p-4 bg-blue-50 rounded-lg space-y-3 border border-blue-200">
                  <p className="font-medium text-blue-900">Adaugă Hotărâre Nouă</p>
                  <AdminInput 
                    label="Titlu Hotărâre" 
                    value={newDecisionTitle} 
                    onChange={(e) => setNewDecisionTitle(e.target.value)} 
                    placeholder="Ex: Privind aprobarea bugetului local" 
                  />
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Document (PDF)</label>
                    <input 
                      ref={newDecisionFileRef}
                      type="file" 
                      accept=".pdf,.doc,.docx" 
                      onChange={(e) => setNewDecisionFile(e.target.files?.[0] || null)}
                      className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-white file:text-blue-700 hover:file:bg-blue-50"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <AdminButton icon={Plus} onClick={handleCreateDecision} loading={creatingDecision} disabled={!newDecisionTitle || !newDecisionFile}>
                      Adaugă Hotărârea
                    </AdminButton>
                    <AdminButton variant="ghost" onClick={() => { 
                      setShowNewDecisionForm(false); 
                      setNewDecisionTitle(''); 
                      setNewDecisionFile(null);
                      if (newDecisionFileRef.current) newDecisionFileRef.current.value = '';
                    }}>
                      Anulează
                    </AdminButton>
                  </div>
                </div>
              )}

              {/* Decisions list */}
              {decisions.length === 0 ? (
                <p className="text-center py-8 text-slate-500">Nu există hotărâri pentru această ședință.</p>
              ) : (
                <div className="space-y-2">
                  {decisions.map((decision) => {
                    const doc = decision.council_decision_documents?.[0];
                    return (
                      <div key={decision.id} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <span className="font-medium">{decision.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {doc && (
                            <a 
                              href={doc.file_url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg flex items-center gap-1"
                            >
                              <FileText className="w-4 h-4" />
                              Descarcă
                            </a>
                          )}
                          <button
                            onClick={() => handleDeleteDecision(decision)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                            title="Șterge"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </AdminCard>
        )}

        {isNew && (
          <AdminCard className="bg-blue-50 border-blue-200">
            <p className="text-blue-800">
              <strong>Notă:</strong> Salvează ședința pentru a putea adăuga documente și hotărâri.
            </p>
          </AdminCard>
        )}
      </div>

      <AdminConfirmDialog isOpen={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} onConfirm={handleDelete} title="Șterge Ședința?" message={`Ștergi ședința din ${formatDate(formData.session_date)} cu toate hotărârile?`} confirmLabel="Da, șterge" cancelLabel="Anulează" loading={deleting} />
    </div>
  );
}
