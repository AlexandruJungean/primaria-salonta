'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Save, ArrowLeft, Eye, Trash2, Image as ImageIcon, Upload, FileText, X, Plus } from 'lucide-react';
import {
  AdminPageHeader,
  AdminButton,
  AdminCard,
  AdminInput,
  AdminTextarea,
  AdminConfirmDialog,
  toast,
} from '@/components/admin';
import { adminFetch } from '@/lib/api-client';

interface NewsImage {
  id: string;
  news_id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
}

interface NewsDocument {
  id: string;
  news_id: string;
  file_url: string;
  file_name: string;
  file_size: number | null;
  title: string;
}

interface NewsFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  published: boolean;
  featured: boolean;
  published_at: string | null;
}

const initialFormData: NewsFormData = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  featured_image: '',
  published: false,
  featured: false,
  published_at: null,
};

export default function StiriEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === 'nou';

  const featuredImageRef = useRef<HTMLInputElement>(null);
  const galleryImageRef = useRef<HTMLInputElement>(null);
  const documentRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<NewsFormData>(initialFormData);
  const [images, setImages] = useState<NewsImage[]>([]);
  const [documents, setDocuments] = useState<NewsDocument[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploadingFeatured, setUploadingFeatured] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof NewsFormData, string>>>({});
  const [docTitle, setDocTitle] = useState('');

  const loadNews = useCallback(async () => {
    if (isNew) return;

    try {
      const response = await adminFetch(`/api/admin/news?id=${id}`);
      if (!response.ok) throw new Error('Failed to fetch');
      
      const data = await response.json();

      if (data) {
        setFormData({
          title: data.title || '',
          slug: data.slug || '',
          excerpt: data.excerpt || '',
          content: data.content || '',
          featured_image: data.featured_image || '',
          published: data.published || false,
          featured: data.featured || false,
          published_at: data.published_at || null,
        });
        setImages(data.images || []);
        setDocuments(data.documents || []);
      }
    } catch (error) {
      console.error('Error loading news:', error);
      toast.error('Eroare', 'Nu s-a putut încărca știrea.');
      router.push('/admin/stiri');
    } finally {
      setLoading(false);
    }
  }, [id, isNew, router]);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 100);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      slug: isNew ? generateSlug(title) : prev.slug,
    }));
  };

  const handleChange = (field: keyof NewsFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof NewsFormData, string>> = {};
    if (!formData.title.trim()) newErrors.title = 'Titlul este obligatoriu';
    if (!formData.slug.trim()) newErrors.slug = 'Slug-ul este obligatoriu';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (publish = false) => {
    if (!validate()) {
      toast.error('Verifică formularul', 'Completează toate câmpurile obligatorii.');
      return;
    }

    setSaving(true);
    try {
      const isPublishing = publish || formData.published;
      
      let publishedAt = formData.published_at;
      if (isPublishing && !formData.published_at) {
        publishedAt = new Date().toISOString();
      } else if (!isPublishing) {
        publishedAt = null;
      }
      
      const newsData = {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        excerpt: formData.excerpt.trim() || null,
        content: formData.content.trim() || null,
        featured_image: formData.featured_image || null,
        published: isPublishing,
        featured: formData.featured,
        published_at: publishedAt,
      };

      if (isNew) {
        const response = await adminFetch('/api/admin/news', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newsData),
        });
        if (!response.ok) throw new Error('Failed to create');
        await response.json();
        toast.success('Știre creată', 'Știrea a fost creată cu succes!');
        router.push('/admin/stiri');
      } else {
        const response = await adminFetch(`/api/admin/news?id=${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newsData),
        });
        if (!response.ok) throw new Error('Failed to update');
        toast.success('Știre salvată', 'Modificările au fost salvate!');
        router.push('/admin/stiri');
      }
    } catch (error) {
      console.error('Error saving news:', error);
      toast.error('Eroare la salvare', 'A apărut o eroare.');
    } finally {
      setSaving(false);
    }
  };

  const handleUploadFeaturedImage = async (file: File) => {
    setUploadingFeatured(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('news_id', id);
      uploadFormData.append('is_featured', 'true');

      const response = await adminFetch('/api/admin/news/images', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!response.ok) throw new Error('Upload failed');
      
      const result = await response.json();
      setFormData(prev => ({ ...prev, featured_image: result.url }));
      toast.success('Imagine încărcată', 'Imaginea principală a fost actualizată.');
    } catch (error) {
      console.error('Error uploading featured image:', error);
      toast.error('Eroare', 'Nu s-a putut încărca imaginea.');
    } finally {
      setUploadingFeatured(false);
    }
  };

  const handleDeleteFeaturedImage = async () => {
    try {
      const response = await fetch(
        `/api/admin/news/images?isFeatured=true&newsId=${id}&imageUrl=${encodeURIComponent(formData.featured_image)}`,
        { method: 'DELETE' }
      );
      if (!response.ok) throw new Error('Delete failed');
      
      setFormData(prev => ({ ...prev, featured_image: '' }));
      toast.success('Șters', 'Imaginea principală a fost ștearsă.');
    } catch (error) {
      console.error('Error deleting featured image:', error);
      toast.error('Eroare', 'Nu s-a putut șterge imaginea.');
    }
  };

  const handleUploadGalleryImage = async (file: File) => {
    setUploadingGallery(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('news_id', id);

      const response = await adminFetch('/api/admin/news/images', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!response.ok) throw new Error('Upload failed');
      
      const newImage = await response.json();
      setImages(prev => [...prev, newImage]);
      toast.success('Imagine adăugată', 'Imaginea a fost adăugată în galerie.');
    } catch (error) {
      console.error('Error uploading gallery image:', error);
      toast.error('Eroare', 'Nu s-a putut încărca imaginea.');
    } finally {
      setUploadingGallery(false);
      if (galleryImageRef.current) galleryImageRef.current.value = '';
    }
  };

  const handleDeleteGalleryImage = async (imageId: string) => {
    try {
      const response = await adminFetch(`/api/admin/news/images?id=${imageId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Delete failed');
      
      setImages(prev => prev.filter(img => img.id !== imageId));
      toast.success('Șters', 'Imaginea a fost ștearsă din galerie.');
    } catch (error) {
      console.error('Error deleting gallery image:', error);
      toast.error('Eroare', 'Nu s-a putut șterge imaginea.');
    }
  };

  const handleUploadDocument = async (file: File) => {
    setUploadingDocument(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('news_id', id);
      uploadFormData.append('title', docTitle || file.name.replace(/\.[^/.]+$/, ''));

      const response = await adminFetch('/api/admin/news/documents', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!response.ok) throw new Error('Upload failed');
      
      const newDoc = await response.json();
      setDocuments(prev => [...prev, newDoc]);
      setDocTitle('');
      toast.success('Document încărcat', 'Documentul a fost adăugat.');
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Eroare', 'Nu s-a putut încărca documentul.');
    } finally {
      setUploadingDocument(false);
      if (documentRef.current) documentRef.current.value = '';
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    try {
      const response = await adminFetch(`/api/admin/news/documents?id=${docId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Delete failed');
      
      setDocuments(prev => prev.filter(d => d.id !== docId));
      toast.success('Șters', 'Documentul a fost șters.');
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Eroare', 'Nu s-a putut șterge documentul.');
    }
  };

  const handleDelete = async () => {
    if (isNew) return;
    setDeleting(true);
    try {
      const response = await adminFetch(`/api/admin/news?id=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Delete failed');
      toast.success('Știre ștearsă', 'Știrea a fost ștearsă cu succes!');
      router.push('/admin/stiri');
    } catch (error) {
      console.error('Error deleting news:', error);
      toast.error('Eroare la ștergere', 'Nu s-a putut șterge știrea.');
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
        title={isNew ? 'Adaugă Știre Nouă' : 'Editează Știrea'}
        breadcrumbs={[
          { label: 'Știri și Anunțuri', href: '/admin/stiri' },
          { label: isNew ? 'Știre Nouă' : 'Editare' },
        ]}
        actions={
          <div className="flex gap-3">
            <AdminButton variant="ghost" icon={ArrowLeft} onClick={() => router.push('/admin/stiri')}>
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
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <AdminCard title="Informații Principale">
            <div className="space-y-6">
              <AdminInput
                label="Titlu"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="Titlul știrii"
                required
                error={errors.title}
              />

              <AdminInput
                label="Slug (URL)"
                value={formData.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                placeholder="titlul-stirii"
                required
                error={errors.slug}
              />

              <AdminTextarea
                label="Rezumat"
                value={formData.excerpt}
                onChange={(e) => handleChange('excerpt', e.target.value)}
                placeholder="Un scurt rezumat al știrii (opțional)"
                rows={3}
              />

              <AdminTextarea
                label="Conținut complet"
                value={formData.content}
                onChange={(e) => handleChange('content', e.target.value)}
                placeholder="Conținutul complet al știrii..."
                rows={12}
              />
            </div>
          </AdminCard>

          {/* Featured Image */}
          <AdminCard title="Imagine Principală">
            {formData.featured_image ? (
              <div className="space-y-4">
                <div className="relative aspect-video bg-slate-100 rounded-lg overflow-hidden">
                  <img
                    src={formData.featured_image}
                    alt="Featured"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={handleDeleteFeaturedImage}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : isNew ? (
              <div className="p-6 bg-amber-50 border border-amber-200 rounded-lg text-center">
                <p className="text-amber-800">Salvează știrea pentru a putea încărca imagini.</p>
              </div>
            ) : (
              <div className="p-6 border-2 border-dashed border-slate-300 rounded-lg text-center">
                <input
                  ref={featuredImageRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUploadFeaturedImage(file);
                  }}
                  className="hidden"
                />
                <ImageIcon className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600 mb-3">Încarcă imaginea principală</p>
                <AdminButton
                  icon={Upload}
                  onClick={() => featuredImageRef.current?.click()}
                  loading={uploadingFeatured}
                >
                  Selectează Imagine
                </AdminButton>
              </div>
            )}
          </AdminCard>

          {/* Gallery Images */}
          {!isNew && (
            <AdminCard title="Galerie Foto">
              <div className="space-y-4">
                {/* Upload button */}
                <div className="flex items-center gap-4">
                  <input
                    ref={galleryImageRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUploadGalleryImage(file);
                    }}
                    className="hidden"
                  />
                  <AdminButton
                    icon={Plus}
                    onClick={() => galleryImageRef.current?.click()}
                    loading={uploadingGallery}
                    variant="secondary"
                  >
                    Adaugă Imagine în Galerie
                  </AdminButton>
                </div>

                {/* Images grid */}
                {images.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((img) => (
                      <div key={img.id} className="relative group aspect-square bg-slate-100 rounded-lg overflow-hidden">
                        <img
                          src={img.image_url}
                          alt={img.caption || 'Gallery image'}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => handleDeleteGalleryImage(img.id)}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <ImageIcon className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p>Nu există imagini în galerie.</p>
                  </div>
                )}
              </div>
            </AdminCard>
          )}

          {/* Documents */}
          {!isNew && (
            <AdminCard title="Documente Atașate">
              <div className="space-y-4">
                {/* Upload form */}
                <div className="p-4 bg-slate-50 rounded-lg space-y-3">
                  <AdminInput
                    label="Titlu Document"
                    value={docTitle}
                    onChange={(e) => setDocTitle(e.target.value)}
                    placeholder="Ex: Anexa 1, Regulament, etc."
                  />
                  <div className="flex items-center gap-3">
                    <input
                      ref={documentRef}
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUploadDocument(file);
                      }}
                      className="hidden"
                    />
                    <AdminButton
                      icon={Upload}
                      onClick={() => documentRef.current?.click()}
                      loading={uploadingDocument}
                      variant="secondary"
                    >
                      Încarcă Document
                    </AdminButton>
                  </div>
                </div>

                {/* Documents list */}
                {documents.length > 0 ? (
                  <div className="space-y-2">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-red-600" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{doc.title}</p>
                            <p className="text-sm text-slate-500">
                              {doc.file_name} {doc.file_size && `• ${formatFileSize(doc.file_size)}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <a
                            href={doc.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <FileText className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => handleDeleteDocument(doc.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p>Nu există documente atașate.</p>
                  </div>
                )}
              </div>
            </AdminCard>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <AdminCard title="Publicare">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">Status</p>
                  <p className="text-sm text-slate-500">
                    {formData.published ? 'Publicat' : 'Ciornă'}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => handleChange('published', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-slate-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">Știre importantă</p>
                  <p className="text-sm text-slate-500">Afișează pe prima pagină</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => handleChange('featured', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-slate-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <AdminButton
                  size="lg"
                  icon={Save}
                  onClick={() => handleSave(false)}
                  loading={saving}
                  className="w-full"
                >
                  {isNew ? 'Salvează Ciornă' : 'Salvează Modificările'}
                </AdminButton>
                {!formData.published && (
                  <AdminButton
                    size="lg"
                    variant="success"
                    icon={Eye}
                    onClick={() => handleSave(true)}
                    loading={saving}
                    className="w-full"
                  >
                    Salvează și Publică
                  </AdminButton>
                )}
              </div>
            </div>
          </AdminCard>

          {isNew && (
            <AdminCard className="bg-blue-50 border-blue-200">
              <p className="text-blue-800 text-sm">
                <strong>Notă:</strong> După ce salvezi știrea, vei putea adăuga imagini și documente.
              </p>
            </AdminCard>
          )}
        </div>
      </div>

      <AdminConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Șterge Știrea?"
        message={`Ești sigur că vrei să ștergi știrea "${formData.title}"? Această acțiune nu poate fi anulată.`}
        confirmLabel="Da, șterge"
        cancelLabel="Nu, anulează"
        loading={deleting}
      />
    </div>
  );
}
