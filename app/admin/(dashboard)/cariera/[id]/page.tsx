'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Save, ArrowLeft, Trash2, Plus, FileText, Upload } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import {
  AdminPageHeader,
  AdminButton,
  AdminCard,
  AdminInput,
  AdminDateInput,
  AdminTextarea,
  AdminSelect,
  AdminConfirmDialog,
  toast,
} from '@/components/admin';
import { adminFetch } from '@/lib/api-client';

interface JobFormData {
  position: string;
  slug: string;
  department: string;
  description: string;
  requirements: string;
  application_deadline: string;
  exam_date: string;
  status: string;
  contact_person: string;
  contact_email: string;
  contact_phone: string;
}

interface JobDocument {
  id: string;
  document_type: string;
  file_url: string;
  file_name: string;
  title: string | null;
  sort_order: number;
}

const initialFormData: JobFormData = {
  position: '',
  slug: '',
  department: '',
  description: '',
  requirements: '',
  application_deadline: '',
  exam_date: '',
  status: 'activ',
  contact_person: '',
  contact_email: '',
  contact_phone: '',
};

const STATUSES = [
  { value: 'activ', label: 'Activ' },
  { value: 'in_desfasurare', label: 'În desfășurare' },
  { value: 'finalizat', label: 'Finalizat' },
  { value: 'anulat', label: 'Anulat' },
];

const DOCUMENT_TYPES = [
  { value: 'anunt', label: 'Anunț' },
  { value: 'bibliografie', label: 'Bibliografie' },
  { value: 'formular', label: 'Formular înscriere' },
  { value: 'calendar', label: 'Calendar concurs' },
  { value: 'rezultate_selectie', label: 'Rezultate selecție dosare' },
  { value: 'rezultate_proba', label: 'Rezultate probă (scrisă/practică/interviu)' },
  { value: 'rezultate_finale', label: 'Rezultate finale' },
  { value: 'contestatii', label: 'Contestații' },
  { value: 'altele', label: 'Alte documente' },
];


export default function CarieraEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === 'nou';

  const [formData, setFormData] = useState<JobFormData>(initialFormData);
  const [documents, setDocuments] = useState<JobDocument[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof JobFormData, string>>>({});
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [newDocType, setNewDocType] = useState('anunt');
  const [newDocTitle, setNewDocTitle] = useState('');

  const loadJob = useCallback(async () => {
    if (isNew) return;

    try {
      const { data, error } = await supabase
        .from('job_vacancies')
        .select(`
          *,
          job_vacancy_documents (*)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;

      if (data) {
        setFormData({
          position: data.position || '',
          slug: data.slug || '',
          department: data.department || '',
          description: data.description || '',
          requirements: data.requirements || '',
          application_deadline: data.application_deadline || '',
          exam_date: data.exam_date || '',
          status: data.status || 'activ',
          contact_person: data.contact_person || '',
          contact_email: data.contact_email || '',
          contact_phone: data.contact_phone || '',
        });
        setDocuments(data.job_vacancy_documents || []);
      }
    } catch (error) {
      console.error('Error loading job:', error);
      toast.error('Eroare', 'Nu s-au putut încărca datele.');
      router.push('/admin/cariera');
    } finally {
      setLoading(false);
    }
  }, [id, isNew, router]);

  useEffect(() => {
    loadJob();
  }, [loadJob]);

  const generateSlug = (position: string) => {
    return position
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 100);
  };

  const handlePositionChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      position: value,
      slug: isNew ? generateSlug(value) : prev.slug,
    }));
  };

  const handleChange = (field: keyof JobFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof JobFormData, string>> = {};
    if (!formData.position.trim()) newErrors.position = 'Poziția este obligatorie';
    if (!formData.slug.trim()) newErrors.slug = 'Slug-ul este obligatoriu';
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
      const jobData = {
        position: formData.position.trim(),
        slug: formData.slug.trim(),
        department: formData.department.trim() || null,
        description: formData.description.trim() || null,
        requirements: formData.requirements.trim() || null,
        application_deadline: formData.application_deadline || null,
        exam_date: formData.exam_date || null,
        status: formData.status,
        contact_person: formData.contact_person.trim() || null,
        contact_email: formData.contact_email.trim() || null,
        contact_phone: formData.contact_phone.trim() || null,
        published_at: new Date().toISOString(),
      };

      if (isNew) {
        const { error } = await supabase
          .from('job_vacancies')
          .insert([jobData])
          .select()
          .single();
        
        if (error) throw error;
        toast.success('Concurs adăugat', 'Datele au fost salvate!');
      } else {
        const { error } = await supabase
          .from('job_vacancies')
          .update(jobData)
          .eq('id', id);
        
        if (error) throw error;
        toast.success('Date salvate', 'Modificările au fost salvate!');
      }
      
      // Redirect to list page after save
      router.push('/admin/cariera');
    } catch (error) {
      console.error('Error saving job:', error);
      toast.error('Eroare la salvare', 'Nu s-au putut salva datele.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (isNew) return;
    setDeleting(true);
    try {
      const { error } = await supabase
        .from('job_vacancies')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast.success('Șters', 'Concursul a fost șters.');
      router.push('/admin/cariera');
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Eroare', 'Nu s-a putut șterge.');
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || isNew) return;

    setUploadingDoc(true);
    try {
      // Upload via API to bypass RLS
      const formData = new FormData();
      formData.append('file', file);
      formData.append('vacancy_id', id);
      formData.append('document_type', newDocType);
      formData.append('title', newDocTitle || file.name.replace(/\.[^/.]+$/, ''));
      formData.append('sort_order', documents.length.toString());

      const response = await adminFetch('/api/admin/job-vacancies/documents', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      toast.success('Document adăugat', 'Fișierul a fost încărcat.');
      setNewDocTitle('');
      loadJob();
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Eroare', 'Nu s-a putut încărca documentul.');
    } finally {
      setUploadingDoc(false);
      e.target.value = '';
    }
  };

  const handleDeleteDocument = async (doc: JobDocument) => {
    try {
      const response = await adminFetch(
        `/api/admin/job-vacancies/documents?id=${doc.id}&file_url=${encodeURIComponent(doc.file_url)}`,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Delete failed');
      }

      toast.success('Șters', 'Documentul a fost șters.');
      setDocuments(prev => prev.filter(d => d.id !== doc.id));
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Eroare', 'Nu s-a putut șterge documentul.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title={isNew ? 'Adaugă Concurs Nou' : 'Editează Concursul'}
        breadcrumbs={[
          { label: 'Carieră / Concursuri', href: '/admin/cariera' },
          { label: isNew ? 'Concurs Nou' : formData.position || 'Editare' },
        ]}
        actions={
          <div className="flex gap-3">
            <AdminButton variant="ghost" icon={ArrowLeft} onClick={() => router.push('/admin/cariera')}>
              Înapoi
            </AdminButton>
            {!isNew && (
              <AdminButton variant="danger" icon={Trash2} onClick={() => setDeleteDialogOpen(true)}>
                Șterge
              </AdminButton>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <AdminCard title="Informații Concurs">
            <div className="space-y-4">
              <AdminInput
                label="Poziție / Titlu"
                value={formData.position}
                onChange={(e) => handlePositionChange(e.target.value)}
                required
                error={errors.position}
                placeholder="Ex: Inspector resurse umane"
              />
              <AdminInput
                label="Slug (URL)"
                value={formData.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                required
                error={errors.slug}
              />
              <AdminInput
                label="Departament"
                value={formData.department}
                onChange={(e) => handleChange('department', e.target.value)}
                placeholder="Ex: Biroul Resurse Umane"
              />
            </div>
          </AdminCard>

          <AdminCard title="Detalii">
            <div className="space-y-4">
              <AdminTextarea
                label="Descriere"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
                placeholder="Descrierea postului și responsabilități..."
              />
              <AdminTextarea
                label="Cerințe"
                value={formData.requirements}
                onChange={(e) => handleChange('requirements', e.target.value)}
                rows={4}
                placeholder="Cerințe de studii, experiență, competențe..."
              />
            </div>
          </AdminCard>

          <AdminCard title="Contact">
            <div className="space-y-4">
              <AdminInput
                label="Persoană de contact"
                value={formData.contact_person}
                onChange={(e) => handleChange('contact_person', e.target.value)}
                placeholder="Ex: Popescu Ion"
              />
              <div className="grid grid-cols-2 gap-4">
                <AdminInput
                  label="Email contact"
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => handleChange('contact_email', e.target.value)}
                  placeholder="email@primaria.ro"
                />
                <AdminInput
                  label="Telefon contact"
                  value={formData.contact_phone}
                  onChange={(e) => handleChange('contact_phone', e.target.value)}
                  placeholder="0259-..."
                />
              </div>
            </div>
          </AdminCard>

          {/* Documents Section - only for existing jobs */}
          {!isNew && (
            <AdminCard title="Documente Atașate">
              <div className="space-y-4">
                {/* Upload new document */}
                <div className="p-4 bg-slate-50 rounded-lg space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <AdminSelect
                      label="Tip document"
                      value={newDocType}
                      onChange={(e) => setNewDocType(e.target.value)}
                      options={DOCUMENT_TYPES}
                    />
                    <AdminInput
                      label="Titlu document (opțional)"
                      value={newDocTitle}
                      onChange={(e) => setNewDocTitle(e.target.value)}
                      placeholder="Ex: Anunț concurs, PV selecție..."
                    />
                  </div>
                  <div>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleDocumentUpload}
                        className="hidden"
                        disabled={uploadingDoc}
                      />
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer">
                        <Upload className="w-4 h-4" />
                        {uploadingDoc ? 'Se încarcă...' : 'Încarcă document'}
                      </span>
                    </label>
                    <span className="ml-3 text-sm text-slate-500">
                      Acceptă: PDF, DOC, DOCX
                    </span>
                  </div>
                </div>

                {/* Documents list */}
                {documents.length > 0 ? (
                  <div className="space-y-2">
                    {documents
                      .sort((a, b) => a.sort_order - b.sort_order)
                      .map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg"
                        >
                          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-slate-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-slate-900 truncate">
                              {doc.title || doc.file_name}
                            </p>
                            <p className="text-sm text-slate-500">
                              {DOCUMENT_TYPES.find(t => t.value === doc.document_type)?.label || doc.document_type}
                            </p>
                          </div>
                          <a
                            href={doc.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            Deschide
                          </a>
                          <button
                            onClick={() => handleDeleteDocument(doc)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p>Niciun document atașat</p>
                    <p className="text-sm">Încarcă documente folosind formularul de mai sus</p>
                  </div>
                )}
              </div>
            </AdminCard>
          )}
        </div>

        <div className="space-y-6">
          <AdminCard title="Date & Status">
            <div className="space-y-4">
              <AdminDateInput
                label="Termen limită înscriere"
                value={formData.application_deadline}
                onChange={(v) => handleChange('application_deadline', v)}
              />
              <AdminDateInput
                label="Data examen"
                value={formData.exam_date}
                onChange={(v) => handleChange('exam_date', v)}
              />
              <AdminSelect
                label="Status"
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                options={STATUSES}
              />
              
              <AdminButton
                size="lg"
                icon={Save}
                onClick={handleSave}
                loading={saving}
                className="w-full"
              >
                {isNew ? 'Salvează Concurs' : 'Salvează Modificările'}
              </AdminButton>
            </div>
          </AdminCard>
        </div>
      </div>

      <AdminConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Șterge Concursul?"
        message={`Ești sigur că vrei să ștergi "${formData.position}"? Toate documentele atașate vor fi șterse.`}
        confirmLabel="Da, șterge"
        cancelLabel="Anulează"
        loading={deleting}
      />
    </div>
  );
}
