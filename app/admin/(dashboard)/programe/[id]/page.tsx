'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { Save, ArrowLeft, Trash2, FileText, Image as ImageIcon, Plus, X, Upload, ExternalLink, Users, Award } from 'lucide-react';
import {
  AdminPageHeader,
  AdminButton,
  AdminCard,
  AdminInput,
  AdminTextarea,
  AdminSelect,
  AdminConfirmDialog,
  AdminTable,
  toast,
} from '@/components/admin';
import { adminFetch } from '@/lib/api-client';

// ============================================
// TYPES
// ============================================

interface ProgramFormData {
  title: string;
  slug: string;
  program_type: string;
  parent_id: string;
  short_description: string;
  full_description: string;
  smis_code: string;
  project_code: string;
  website_url: string;
  program_url: string;
  status: string;
  document_grouping: string;
  funding_notice: string;
  published: boolean;
}

interface ExternalLink {
  url: string;
  label: string;
}

interface ProgramDocument {
  id: string;
  title: string;
  file_url: string;
  file_name: string;
  year: number | null;
  category: string | null;
  group_name: string | null;
  sort_order: number;
}

interface ProgramImage {
  id: string;
  image_url: string;
  caption: string | null;
  alt_text: string | null;
  image_type: 'gallery' | 'logo' | 'sponsor' | 'featured';
  sort_order: number;
}

interface ChildProgram {
  id: string;
  title: string;
  slug: string;
  status: string;
  published: boolean;
}

interface ParentOption {
  id: string;
  title: string;
  slug: string;
}

// ============================================
// CONSTANTS
// ============================================

const initialFormData: ProgramFormData = {
  title: '',
  slug: '',
  program_type: 'altele',
  parent_id: '',
  short_description: '',
  full_description: '',
  smis_code: '',
  project_code: '',
  website_url: '',
  program_url: '',
  status: 'in_desfasurare',
  document_grouping: 'none',
  funding_notice: '',
  published: true,
};

const PROGRAM_TYPES = [
  { value: 'pnrr', label: 'PNRR' },
  { value: 'pmud', label: 'PMUD' },
  { value: 'strategie', label: 'Strategie' },
  { value: 'sna', label: 'SNA' },
  { value: 'svsu', label: 'SVSU' },
  { value: 'proiecte_europene', label: 'Proiecte Europene' },
  { value: 'proiecte_locale', label: 'Proiecte Locale' },
  { value: 'regional_nord_vest', label: 'Program Regional Nord-Vest' },
  { value: 'altele', label: 'Altele' },
];

const STATUSES = [
  { value: 'planificat', label: 'Planificat' },
  { value: 'in_desfasurare', label: 'În desfășurare' },
  { value: 'finalizat', label: 'Finalizat' },
  { value: 'anulat', label: 'Anulat' },
];

const DOCUMENT_GROUPINGS = [
  { value: 'none', label: 'Fără grupare' },
  { value: 'year', label: 'Pe an' },
  { value: 'category', label: 'Pe categorie' },
  { value: 'year_category', label: 'An + Categorie' },
  { value: 'project', label: 'Pe proiect/grup' },
  { value: 'period', label: 'Pe perioadă' },
  { value: 'custom', label: 'Personalizat' },
];

const DOCUMENT_CATEGORIES = [
  { value: '', label: 'Fără categorie' },
  { value: 'rezultate', label: 'Rezultate' },
  { value: 'cultura', label: 'Cultură' },
  { value: 'sport', label: 'Sport' },
  { value: 'mediu', label: 'Mediu' },
  { value: 'social', label: 'Social' },
  { value: 'educatie', label: 'Educație' },
  { value: 'sanatate', label: 'Sănătate' },
  { value: 'tineret', label: 'Tineret' },
];

// ============================================
// COMPONENT
// ============================================

export default function ProgramEditPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const isNew = id === 'nou';
  const presetParentId = searchParams.get('parent_id') || '';

  // State
  const [activeTab, setActiveTab] = useState<'info' | 'documents' | 'images' | 'sponsors' | 'children'>('info');
  const [formData, setFormData] = useState<ProgramFormData>({
    ...initialFormData,
    parent_id: presetParentId,
  });
  const [documents, setDocuments] = useState<ProgramDocument[]>([]);
  const [images, setImages] = useState<ProgramImage[]>([]);
  const [sponsors, setSponsors] = useState<ProgramImage[]>([]);
  const [childPrograms, setChildPrograms] = useState<ChildProgram[]>([]);
  const [parentOptions, setParentOptions] = useState<ParentOption[]>([]);
  
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ProgramFormData, string>>>({});

  // Document/Image dialogs
  const [docDialogOpen, setDocDialogOpen] = useState(false);
  const [imgDialogOpen, setImgDialogOpen] = useState(false);
  const [sponsorDialogOpen, setSponsorDialogOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<ProgramDocument | null>(null);
  const [editingImg, setEditingImg] = useState<ProgramImage | null>(null);
  const [editingSponsor, setEditingSponsor] = useState<ProgramImage | null>(null);
  const [docForm, setDocForm] = useState({ title: '', file_url: '', file_name: '', year: '', category: '', group_name: '' });
  const [imgForm, setImgForm] = useState<{ image_url: string; caption: string; alt_text: string; image_type: 'gallery' | 'featured' }>({ image_url: '', caption: '', alt_text: '', image_type: 'gallery' });
  const [sponsorForm, setSponsorForm] = useState({ image_url: '', alt_text: '' });
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [uploadingSponsor, setUploadingSponsor] = useState(false);
  const [externalLinks, setExternalLinks] = useState<ExternalLink[]>([]);

  // ============================================
  // LOAD DATA
  // ============================================

  const loadProgram = useCallback(async () => {
    if (isNew) {
      setLoading(false);
      return;
    }

    try {
      const response = await adminFetch(`/api/admin/programs?id=${id}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();

      if (data) {
        // Parse external links from website_url if it's JSON, otherwise treat as legacy single URL
        let links: ExternalLink[] = [];
        if (data.website_url) {
          try {
            const parsed = JSON.parse(data.website_url);
            if (Array.isArray(parsed)) {
              links = parsed;
            }
          } catch {
            // Legacy: single URL without label
            if (data.website_url.startsWith('http')) {
              links = [{ url: data.website_url, label: 'Website' }];
            }
          }
        }
        setExternalLinks(links);

        setFormData({
          title: data.title || '',
          slug: data.slug || '',
          program_type: data.program_type || 'altele',
          parent_id: data.parent_id || '',
          short_description: data.short_description || '',
          full_description: data.full_description || '',
          smis_code: data.smis_code || '',
          project_code: data.project_code || '',
          website_url: '', // Managed via externalLinks state now
          program_url: data.program_url || '',
          status: data.status || 'in_desfasurare',
          document_grouping: data.document_grouping || 'none',
          funding_notice: data.funding_notice || '',
          published: data.published ?? true,
        });
      }
    } catch (error) {
      console.error('Error loading program:', error);
      toast.error('Eroare', 'Nu s-au putut încărca datele.');
      router.push('/admin/programe');
    } finally {
      setLoading(false);
    }
  }, [id, isNew, router]);

  const loadDocuments = useCallback(async () => {
    if (isNew) return;
    try {
      const response = await adminFetch(`/api/admin/program-documents?program_id=${id}`);
      if (response.ok) {
        const data = await response.json();
        setDocuments(data || []);
      }
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  }, [id, isNew]);

  const loadImages = useCallback(async () => {
    if (isNew) return;
    try {
      const response = await adminFetch(`/api/admin/program-images?program_id=${id}`);
      if (response.ok) {
        const data = await response.json();
        const allImages = data || [];
        setImages(allImages.filter((img: ProgramImage) => img.image_type !== 'sponsor'));
        setSponsors(allImages.filter((img: ProgramImage) => img.image_type === 'sponsor'));
      }
    } catch (error) {
      console.error('Error loading images:', error);
    }
  }, [id, isNew]);

  const loadChildPrograms = useCallback(async () => {
    if (isNew) return;
    try {
      const response = await adminFetch(`/api/admin/programs?parent_id=${id}`);
      if (response.ok) {
        const data = await response.json();
        setChildPrograms(data || []);
      }
    } catch (error) {
      console.error('Error loading child programs:', error);
    }
  }, [id, isNew]);

  const loadParentOptions = useCallback(async () => {
    try {
      const response = await adminFetch('/api/admin/programs?top_level=true');
      if (response.ok) {
        const data = await response.json();
        const options = (data || [])
          .filter((p: ParentOption) => p.id !== id)
          .map((p: ParentOption) => ({ id: p.id, title: p.title, slug: p.slug }));
        setParentOptions(options);
      }
    } catch (error) {
      console.error('Error loading parent options:', error);
    }
  }, [id]);

  useEffect(() => {
    loadProgram();
    loadDocuments();
    loadImages();
    loadChildPrograms();
    loadParentOptions();
  }, [loadProgram, loadDocuments, loadImages, loadChildPrograms, loadParentOptions]);

  // ============================================
  // HANDLERS
  // ============================================

  const generateSlug = (title: string) => {
    return title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').substring(0, 100);
  };

  const handleTitleChange = (value: string) => {
    setFormData(prev => ({ ...prev, title: value, slug: isNew ? generateSlug(value) : prev.slug }));
  };

  const handleChange = (field: keyof ProgramFormData, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ProgramFormData, string>> = {};
    if (!formData.title.trim()) newErrors.title = 'Titlul este obligatoriu';
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
      // Serialize external links to JSON for storage in website_url
      const validLinks = externalLinks.filter(link => link.url.trim());
      const websiteUrlValue = validLinks.length > 0 ? JSON.stringify(validLinks) : null;

      const programData = {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        program_type: formData.program_type,
        parent_id: formData.parent_id || null,
        short_description: formData.short_description.trim() || null,
        full_description: formData.full_description.trim() || null,
        smis_code: formData.smis_code.trim() || null,
        project_code: formData.project_code.trim() || null,
        website_url: websiteUrlValue,
        program_url: formData.program_url.trim() || null,
        status: formData.status,
        document_grouping: formData.document_grouping,
        funding_notice: formData.funding_notice.trim() || null,
        published: formData.published,
      };

      if (isNew) {
        const response = await adminFetch('/api/admin/programs', {
          method: 'POST',
          body: JSON.stringify(programData),
        });
        if (!response.ok) throw new Error('Failed to create');
        await response.json();
        toast.success('Program adăugat', 'Datele au fost salvate!');
        router.push('/admin/programe');
      } else {
        const response = await adminFetch(`/api/admin/programs?id=${id}`, {
          method: 'PATCH',
          body: JSON.stringify(programData),
        });
        if (!response.ok) throw new Error('Failed to update');
        toast.success('Date salvate', 'Modificările au fost salvate!');
        router.push('/admin/programe');
      }
    } catch (error) {
      console.error('Error saving program:', error);
      toast.error('Eroare la salvare', 'Nu s-au putut salva datele.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (isNew) return;
    setDeleting(true);
    try {
      const response = await adminFetch(`/api/admin/programs?id=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete');
      toast.success('Șters', 'Programul a fost șters.');
      router.push('/admin/programe');
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Eroare', 'Nu s-a putut șterge.');
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  // ============================================
  // DOCUMENT HANDLERS
  // ============================================

  const handleDocFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDoc(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('folder', `programe/${formData.slug || 'documents'}`);

      const response = await adminFetch('/api/admin/upload', {
        method: 'POST',
        body: formDataUpload,
        headers: {},
      });

      if (!response.ok) throw new Error('Upload failed');
      const result = await response.json();
      
      setDocForm(prev => ({
        ...prev,
        file_url: result.url,
        file_name: file.name,
        title: prev.title || file.name.replace(/\.[^/.]+$/, ''),
      }));
      toast.success('Fișier încărcat', 'Documentul a fost încărcat.');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Eroare', 'Nu s-a putut încărca fișierul.');
    } finally {
      setUploadingDoc(false);
    }
  };

  const openDocDialog = (doc?: ProgramDocument) => {
    if (doc) {
      setEditingDoc(doc);
      setDocForm({
        title: doc.title,
        file_url: doc.file_url,
        file_name: doc.file_name,
        year: doc.year?.toString() || '',
        category: doc.category || '',
        group_name: doc.group_name || '',
      });
    } else {
      setEditingDoc(null);
      setDocForm({ title: '', file_url: '', file_name: '', year: '', category: '', group_name: '' });
    }
    setDocDialogOpen(true);
  };

  const saveDocument = async () => {
    if (!docForm.title || !docForm.file_url) {
      toast.error('Eroare', 'Titlul și fișierul sunt obligatorii.');
      return;
    }

    try {
      const docData = {
        program_id: id,
        title: docForm.title,
        file_url: docForm.file_url,
        file_name: docForm.file_name || docForm.title,
        year: docForm.year ? parseInt(docForm.year) : null,
        category: docForm.category || null,
        group_name: docForm.group_name || null,
      };

      if (editingDoc) {
        await adminFetch(`/api/admin/program-documents?id=${editingDoc.id}`, {
          method: 'PATCH',
          body: JSON.stringify(docData),
        });
        toast.success('Salvat', 'Documentul a fost actualizat.');
      } else {
        await adminFetch('/api/admin/program-documents', {
          method: 'POST',
          body: JSON.stringify(docData),
        });
        toast.success('Adăugat', 'Documentul a fost adăugat.');
      }
      
      setDocDialogOpen(false);
      loadDocuments();
    } catch (error) {
      console.error('Error saving document:', error);
      toast.error('Eroare', 'Nu s-a putut salva documentul.');
    }
  };

  const deleteDocument = async (docId: string) => {
    if (!confirm('Ștergi acest document?')) return;
    try {
      await adminFetch(`/api/admin/program-documents?id=${docId}`, { method: 'DELETE' });
      toast.success('Șters', 'Documentul a fost șters.');
      loadDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Eroare', 'Nu s-a putut șterge.');
    }
  };

  // ============================================
  // IMAGE HANDLERS
  // ============================================

  const handleImgFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImg(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('folder', `programe/${formData.slug || 'images'}`);

      const response = await adminFetch('/api/admin/upload', {
        method: 'POST',
        body: formDataUpload,
        headers: {},
      });

      if (!response.ok) throw new Error('Upload failed');
      const result = await response.json();
      
      setImgForm(prev => ({
        ...prev,
        image_url: result.url,
        alt_text: prev.alt_text || file.name.replace(/\.[^/.]+$/, ''),
      }));
      toast.success('Imagine încărcată', 'Imaginea a fost încărcată.');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Eroare', 'Nu s-a putut încărca imaginea.');
    } finally {
      setUploadingImg(false);
    }
  };

  const openImgDialog = (img?: ProgramImage) => {
    if (img) {
      setEditingImg(img);
      setImgForm({
        image_url: img.image_url,
        caption: img.caption || '',
        alt_text: img.alt_text || '',
        image_type: img.image_type === 'sponsor' ? 'gallery' : img.image_type as 'gallery' | 'featured',
      });
    } else {
      setEditingImg(null);
      setImgForm({ image_url: '', caption: '', alt_text: '', image_type: 'gallery' });
    }
    setImgDialogOpen(true);
  };

  const saveImage = async () => {
    if (!imgForm.image_url) {
      toast.error('Eroare', 'Imaginea este obligatorie.');
      return;
    }

    try {
      const imgData = {
        program_id: id,
        image_url: imgForm.image_url,
        caption: imgForm.caption || null,
        alt_text: imgForm.alt_text || null,
        image_type: imgForm.image_type,
      };

      if (editingImg) {
        await adminFetch(`/api/admin/program-images?id=${editingImg.id}`, {
          method: 'PATCH',
          body: JSON.stringify(imgData),
        });
        toast.success('Salvat', 'Imaginea a fost actualizată.');
      } else {
        await adminFetch('/api/admin/program-images', {
          method: 'POST',
          body: JSON.stringify(imgData),
        });
        toast.success('Adăugat', 'Imaginea a fost adăugată.');
      }
      
      setImgDialogOpen(false);
      loadImages();
    } catch (error) {
      console.error('Error saving image:', error);
      toast.error('Eroare', 'Nu s-a putut salva imaginea.');
    }
  };

  const deleteImage = async (imgId: string) => {
    if (!confirm('Ștergi această imagine?')) return;
    try {
      await adminFetch(`/api/admin/program-images?id=${imgId}`, { method: 'DELETE' });
      toast.success('Șters', 'Imaginea a fost ștearsă.');
      loadImages();
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Eroare', 'Nu s-a putut șterge.');
    }
  };

  // ============================================
  // SPONSOR HANDLERS
  // ============================================

  const handleSponsorFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingSponsor(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('folder', `programe/${formData.slug || 'sponsors'}`);

      const response = await adminFetch('/api/admin/upload', {
        method: 'POST',
        body: formDataUpload,
        headers: {},
      });

      if (!response.ok) throw new Error('Upload failed');
      const result = await response.json();
      
      setSponsorForm(prev => ({
        ...prev,
        image_url: result.url,
        alt_text: prev.alt_text || file.name.replace(/\.[^/.]+$/, ''),
      }));
      toast.success('Logo încărcat', 'Logo-ul sponsorului a fost încărcat.');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Eroare', 'Nu s-a putut încărca logo-ul.');
    } finally {
      setUploadingSponsor(false);
    }
  };

  const openSponsorDialog = (sponsor?: ProgramImage) => {
    if (sponsor) {
      setEditingSponsor(sponsor);
      setSponsorForm({
        image_url: sponsor.image_url,
        alt_text: sponsor.alt_text || '',
      });
    } else {
      setEditingSponsor(null);
      setSponsorForm({ image_url: '', alt_text: '' });
    }
    setSponsorDialogOpen(true);
  };

  const saveSponsor = async () => {
    if (!sponsorForm.image_url) {
      toast.error('Eroare', 'Logo-ul este obligatoriu.');
      return;
    }

    try {
      const sponsorData = {
        program_id: id,
        image_url: sponsorForm.image_url,
        alt_text: sponsorForm.alt_text || null,
        image_type: 'sponsor',
      };

      if (editingSponsor) {
        await adminFetch(`/api/admin/program-images?id=${editingSponsor.id}`, {
          method: 'PATCH',
          body: JSON.stringify(sponsorData),
        });
        toast.success('Salvat', 'Logo-ul a fost actualizat.');
      } else {
        await adminFetch('/api/admin/program-images', {
          method: 'POST',
          body: JSON.stringify(sponsorData),
        });
        toast.success('Adăugat', 'Logo-ul a fost adăugat.');
      }
      
      setSponsorDialogOpen(false);
      loadImages();
    } catch (error) {
      console.error('Error saving sponsor:', error);
      toast.error('Eroare', 'Nu s-a putut salva logo-ul.');
    }
  };

  const deleteSponsor = async (sponsorId: string) => {
    if (!confirm('Ștergi acest logo sponsor?')) return;
    try {
      await adminFetch(`/api/admin/program-images?id=${sponsorId}`, { method: 'DELETE' });
      toast.success('Șters', 'Logo-ul a fost șters.');
      loadImages();
    } catch (error) {
      console.error('Error deleting sponsor:', error);
      toast.error('Eroare', 'Nu s-a putut șterge.');
    }
  };

  // ============================================
  // CHILD PROGRAMS HANDLERS
  // ============================================

  const handleEditChild = (child: ChildProgram) => {
    router.push(`/admin/programe/${child.id}`);
  };

  const handleDeleteChild = async (child: ChildProgram) => {
    if (!confirm(`Ștergi proiectul "${child.title}"?`)) return;
    try {
      await adminFetch(`/api/admin/programs?id=${child.id}`, { method: 'DELETE' });
      toast.success('Șters', 'Proiectul a fost șters.');
      loadChildPrograms();
    } catch (error) {
      console.error('Error deleting child:', error);
      toast.error('Eroare', 'Nu s-a putut șterge.');
    }
  };

  const handleAddChild = () => {
    router.push(`/admin/programe/nou?parent_id=${id}`);
  };

  // ============================================
  // RENDER
  // ============================================

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const childColumns = [
    {
      key: 'title',
      label: 'Proiect',
      render: (item: ChildProgram) => (
        <div>
          <p className="font-medium text-slate-900">{item.title}</p>
          <p className="text-xs text-slate-500">{item.slug}</p>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      className: 'w-32',
      render: (item: ChildProgram) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          item.status === 'finalizat' ? 'bg-green-100 text-green-700' :
          item.status === 'in_desfasurare' ? 'bg-blue-100 text-blue-700' :
          item.status === 'anulat' ? 'bg-red-100 text-red-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {STATUSES.find(s => s.value === item.status)?.label || item.status}
        </span>
      ),
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title={isNew ? 'Adaugă Program Nou' : 'Editează Programul'}
        breadcrumbs={[
          { label: 'Programe și Proiecte', href: '/admin/programe' },
          { label: isNew ? 'Program Nou' : formData.title || 'Editare' },
        ]}
        actions={
          <div className="flex gap-3">
            <AdminButton variant="ghost" icon={ArrowLeft} onClick={() => router.push('/admin/programe')}>
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

      {/* Tabs */}
      {!isNew && (
        <div className="flex gap-1 mb-6 border-b overflow-x-auto">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'info' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Informații
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'documents' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <FileText className="w-4 h-4" />
            Documente ({documents.length})
          </button>
          <button
            onClick={() => setActiveTab('images')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'images' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            Imagini ({images.length})
          </button>
          <button
            onClick={() => setActiveTab('sponsors')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'sponsors' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Award className="w-4 h-4" />
            Sponsori ({sponsors.length})
          </button>
          <button
            onClick={() => setActiveTab('children')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'children' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Users className="w-4 h-4" />
            Proiecte ({childPrograms.length})
          </button>
        </div>
      )}

      {/* Info Tab */}
      {activeTab === 'info' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <AdminCard title="Informații Generale">
              <div className="space-y-4">
                <AdminInput label="Titlu" value={formData.title} onChange={(e) => handleTitleChange(e.target.value)} required error={errors.title} />
                <AdminInput label="Slug (URL)" value={formData.slug} onChange={(e) => handleChange('slug', e.target.value)} required error={errors.slug} />
                <div className="grid grid-cols-2 gap-4">
                  <AdminSelect
                    label="Program părinte"
                    value={formData.parent_id}
                    onChange={(e) => handleChange('parent_id', e.target.value)}
                    options={[{ value: '', label: 'Fără (program principal)' }, ...parentOptions.map(p => ({ value: p.id, label: p.title }))]}
                  />
                  <AdminInput label="Cod SMIS" value={formData.smis_code} onChange={(e) => handleChange('smis_code', e.target.value)} />
                </div>
                <AdminInput label="Cod proiect" value={formData.project_code} onChange={(e) => handleChange('project_code', e.target.value)} />
                <AdminTextarea label="Descriere scurtă" value={formData.short_description} onChange={(e) => handleChange('short_description', e.target.value)} rows={2} />
                <AdminTextarea label="Descriere completă" value={formData.full_description} onChange={(e) => handleChange('full_description', e.target.value)} rows={6} />
                <AdminTextarea label="Obiective / Notă finanțare" value={formData.funding_notice} onChange={(e) => handleChange('funding_notice', e.target.value)} rows={3} placeholder="Ex: Obiectiv: Mobilitate urbană durabilă..." />
              </div>
            </AdminCard>

            <AdminCard title="Link-uri externe">
              <div className="space-y-3">
                {externalLinks.map((link, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <div className="flex-1">
                      <input 
                        type="text"
                        value={link.url} 
                        onChange={(e) => {
                          const newLinks = [...externalLinks];
                          newLinks[index].url = e.target.value;
                          setExternalLinks(newLinks);
                        }} 
                        placeholder="https://..."
                        className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newLinks = externalLinks.filter((_, i) => i !== index);
                        setExternalLinks(newLinks);
                      }}
                      className="p-2 text-slate-400 hover:text-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setExternalLinks([...externalLinks, { url: '', label: '' }])}
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg"
                >
                  <Plus className="w-4 h-4" />
                  Adaugă link
                </button>
                <p className="text-xs text-slate-500">Link-urile vor fi afișate pe pagina proiectului, separate cu "|"</p>
              </div>
            </AdminCard>
          </div>

          <div className="space-y-6">
            <AdminCard title="Setări">
              <div className="space-y-4">
                <AdminSelect label="Status" value={formData.status} onChange={(e) => handleChange('status', e.target.value)} options={STATUSES} />
                <AdminSelect label="Grupare documente" value={formData.document_grouping} onChange={(e) => handleChange('document_grouping', e.target.value)} options={DOCUMENT_GROUPINGS} />
                
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">Publicat</p>
                    <p className="text-sm text-slate-500">Vizibil pe website</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={formData.published} onChange={(e) => handleChange('published', e.target.checked)} className="sr-only peer" />
                    <div className="w-14 h-7 bg-slate-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600" />
                  </label>
                </div>
              </div>
            </AdminCard>

            <AdminButton size="lg" icon={Save} onClick={handleSave} loading={saving} className="w-full">
              {isNew ? 'Salvează Program' : 'Salvează Modificările'}
            </AdminButton>
          </div>
        </div>
      )}

      {/* Documents Tab */}
      {activeTab === 'documents' && !isNew && (
        <AdminCard
          title="Documente"
          actions={<AdminButton icon={Plus} onClick={() => openDocDialog()}>Adaugă Document</AdminButton>}
        >
          {documents.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Nu există documente.</p>
            </div>
          ) : (
            <div className="divide-y">
              {documents.map(doc => (
                <div key={doc.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{doc.title}</p>
                      <div className="flex gap-2 text-xs text-slate-500">
                        {doc.year && <span>An: {doc.year}</span>}
                        {doc.category && <span>Categorie: {doc.category}</span>}
                        {doc.group_name && <span>Grup: {doc.group_name}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-blue-600">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button onClick={() => openDocDialog(doc)} className="p-2 text-slate-400 hover:text-blue-600">
                      <FileText className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteDocument(doc.id)} className="p-2 text-slate-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AdminCard>
      )}

      {/* Images Tab */}
      {activeTab === 'images' && !isNew && (
        <AdminCard
          title="Imagini (Galerie și Featured)"
          actions={<AdminButton icon={Plus} onClick={() => openImgDialog()}>Adaugă Imagine</AdminButton>}
        >
          {images.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Nu există imagini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map(img => (
                <div key={img.id} className="relative group">
                  <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden">
                    <img src={img.image_url} alt={img.alt_text || ''} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                    <button onClick={() => openImgDialog(img)} className="p-2 bg-white rounded-lg text-slate-600 hover:text-blue-600">
                      <ImageIcon className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteImage(img.id)} className="p-2 bg-white rounded-lg text-slate-600 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-slate-500 truncate">
                    {img.image_type === 'featured' ? 'Imagine principală' : 'Galerie'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </AdminCard>
      )}

      {/* Sponsors Tab */}
      {activeTab === 'sponsors' && !isNew && (
        <AdminCard
          title="Logo-uri Sponsori / Finanțatori"
          description="Logo-urile vor fi afișate în partea de sus a paginii programului"
          actions={<AdminButton icon={Plus} onClick={() => openSponsorDialog()}>Adaugă Logo</AdminButton>}
        >
          {sponsors.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Award className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Nu există logo-uri de sponsori.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {sponsors.map(sponsor => (
                <div key={sponsor.id} className="relative group">
                  <div className="aspect-video bg-white border rounded-lg overflow-hidden flex items-center justify-center p-4">
                    <img src={sponsor.image_url} alt={sponsor.alt_text || ''} className="max-w-full max-h-full object-contain" />
                  </div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                    <button onClick={() => openSponsorDialog(sponsor)} className="p-2 bg-white rounded-lg text-slate-600 hover:text-blue-600">
                      <ImageIcon className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteSponsor(sponsor.id)} className="p-2 bg-white rounded-lg text-slate-600 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {sponsor.alt_text && <p className="mt-1 text-xs text-slate-500 truncate">{sponsor.alt_text}</p>}
                </div>
              ))}
            </div>
          )}
        </AdminCard>
      )}

      {/* Child Programs Tab */}
      {activeTab === 'children' && !isNew && (
        <AdminCard
          title="Proiecte în acest Program"
          description="Proiectele secundare care fac parte din acest program"
          actions={<AdminButton icon={Plus} onClick={handleAddChild}>Adaugă Proiect</AdminButton>}
        >
          {childPrograms.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Nu există proiecte în acest program.</p>
            </div>
          ) : (
            <AdminTable
              data={childPrograms}
              columns={childColumns}
              onEdit={handleEditChild}
              onDelete={handleDeleteChild}
            />
          )}
        </AdminCard>
      )}

      {/* Document Dialog */}
      {docDialogOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{editingDoc ? 'Editează Document' : 'Adaugă Document'}</h3>
              <button onClick={() => setDocDialogOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <AdminInput label="Titlu document" value={docForm.title} onChange={(e) => setDocForm(prev => ({ ...prev, title: e.target.value }))} required />
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Fișier</label>
                <div className="flex gap-2">
                  <input type="file" onChange={handleDocFileUpload} className="hidden" id="doc-upload" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx" />
                  <label htmlFor="doc-upload" className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer text-sm">
                    <Upload className="w-4 h-4" />
                    {uploadingDoc ? 'Se încarcă...' : 'Încarcă fișier'}
                  </label>
                </div>
                {docForm.file_url && <p className="mt-2 text-sm text-green-600">✓ {docForm.file_name}</p>}
              </div>
              <AdminInput label="URL fișier (sau încarcă mai sus)" value={docForm.file_url} onChange={(e) => setDocForm(prev => ({ ...prev, file_url: e.target.value }))} />
              <div className="grid grid-cols-2 gap-4">
                <AdminInput label="An" type="number" value={docForm.year} onChange={(e) => setDocForm(prev => ({ ...prev, year: e.target.value }))} placeholder="2024" />
                <AdminSelect label="Categorie" value={docForm.category} onChange={(e) => setDocForm(prev => ({ ...prev, category: e.target.value }))} options={DOCUMENT_CATEGORIES} />
              </div>
              <AdminInput label="Nume grup (pentru grupare personalizată)" value={docForm.group_name} onChange={(e) => setDocForm(prev => ({ ...prev, group_name: e.target.value }))} />
              <div className="flex gap-3 pt-4">
                <AdminButton variant="ghost" onClick={() => setDocDialogOpen(false)} className="flex-1">Anulează</AdminButton>
                <AdminButton icon={Save} onClick={saveDocument} className="flex-1">Salvează</AdminButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Dialog */}
      {imgDialogOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{editingImg ? 'Editează Imagine' : 'Adaugă Imagine'}</h3>
              <button onClick={() => setImgDialogOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Imagine</label>
                <div className="flex gap-2">
                  <input type="file" onChange={handleImgFileUpload} className="hidden" id="img-upload" accept="image/*" />
                  <label htmlFor="img-upload" className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer text-sm">
                    <Upload className="w-4 h-4" />
                    {uploadingImg ? 'Se încarcă...' : 'Încarcă imagine'}
                  </label>
                </div>
                {imgForm.image_url && <div className="mt-2"><img src={imgForm.image_url} alt="Preview" className="h-32 object-cover rounded-lg" /></div>}
              </div>
              <AdminSelect
                label="Tip imagine"
                value={imgForm.image_type}
                onChange={(e) => setImgForm(prev => ({ ...prev, image_type: e.target.value as 'gallery' | 'featured' }))}
                options={[{ value: 'gallery', label: 'Galerie' }, { value: 'featured', label: 'Imagine principală' }]}
              />
              <AdminInput label="Text alternativ (alt)" value={imgForm.alt_text} onChange={(e) => setImgForm(prev => ({ ...prev, alt_text: e.target.value }))} />
              <AdminInput label="Legendă" value={imgForm.caption} onChange={(e) => setImgForm(prev => ({ ...prev, caption: e.target.value }))} />
              <div className="flex gap-3 pt-4">
                <AdminButton variant="ghost" onClick={() => setImgDialogOpen(false)} className="flex-1">Anulează</AdminButton>
                <AdminButton icon={Save} onClick={saveImage} className="flex-1">Salvează</AdminButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sponsor Dialog */}
      {sponsorDialogOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{editingSponsor ? 'Editează Logo Sponsor' : 'Adaugă Logo Sponsor'}</h3>
              <button onClick={() => setSponsorDialogOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Logo</label>
                <div className="flex gap-2">
                  <input type="file" onChange={handleSponsorFileUpload} className="hidden" id="sponsor-upload" accept="image/*" />
                  <label htmlFor="sponsor-upload" className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer text-sm">
                    <Upload className="w-4 h-4" />
                    {uploadingSponsor ? 'Se încarcă...' : 'Încarcă logo'}
                  </label>
                </div>
                {sponsorForm.image_url && <div className="mt-2 p-4 bg-white border rounded-lg"><img src={sponsorForm.image_url} alt="Preview" className="h-20 object-contain" /></div>}
              </div>
              <AdminInput label="Nume sponsor (text alternativ)" value={sponsorForm.alt_text} onChange={(e) => setSponsorForm(prev => ({ ...prev, alt_text: e.target.value }))} placeholder="Ex: Uniunea Europeană" />
              <div className="flex gap-3 pt-4">
                <AdminButton variant="ghost" onClick={() => setSponsorDialogOpen(false)} className="flex-1">Anulează</AdminButton>
                <AdminButton icon={Save} onClick={saveSponsor} className="flex-1">Salvează</AdminButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <AdminConfirmDialog 
        isOpen={deleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)} 
        onConfirm={handleDelete} 
        title="Șterge Programul?" 
        message={`Ștergi "${formData.title}"? Toate documentele, imaginile și proiectele asociate vor fi șterse.`} 
        confirmLabel="Da, șterge" 
        cancelLabel="Anulează" 
        loading={deleting} 
      />
    </div>
  );
}
