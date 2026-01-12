'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Save, ArrowLeft, Eye, Trash2, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import {
  AdminPageHeader,
  AdminButton,
  AdminCard,
  AdminInput,
  AdminTextarea,
  AdminSelect,
  AdminConfirmDialog,
  toast,
} from '@/components/admin';

interface NewsFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  published: boolean;
  featured: boolean;
}

const initialFormData: NewsFormData = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  featured_image: '',
  published: false,
  featured: false,
};

export default function StiriEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === 'nou';

  const [formData, setFormData] = useState<NewsFormData>(initialFormData);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof NewsFormData, string>>>({});

  const loadNews = useCallback(async () => {
    if (isNew) return;

    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          title: data.title || '',
          slug: data.slug || '',
          excerpt: data.excerpt || '',
          content: data.content || '',
          featured_image: data.featured_image || '',
          published: data.published || false,
          featured: data.featured || false,
        });
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

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
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

    if (!formData.title.trim()) {
      newErrors.title = 'Titlul este obligatoriu';
    }
    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug-ul este obligatoriu';
    }

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
      const newsData = {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        excerpt: formData.excerpt.trim() || null,
        content: formData.content.trim() || null,
        featured_image: formData.featured_image.trim() || null,
        published: publish || formData.published,
        featured: formData.featured,
        published_at: (publish || formData.published) ? new Date().toISOString() : null,
      };

      if (isNew) {
        const { error } = await supabase.from('news').insert([newsData]);
        if (error) throw error;
        toast.success('Știre creată', 'Știrea a fost creată cu succes!');
      } else {
        const { error } = await supabase
          .from('news')
          .update(newsData)
          .eq('id', id);
        if (error) throw error;
        toast.success('Știre salvată', 'Modificările au fost salvate!');
      }

      router.push('/admin/stiri');
    } catch (error: unknown) {
      console.error('Error saving news:', error);
      const errorMessage = error && typeof error === 'object' && 'message' in error 
        ? String(error.message) 
        : 'A apărut o eroare.';
      toast.error('Eroare la salvare', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (isNew) return;

    setDeleting(true);
    try {
      const { error } = await supabase.from('news').delete().eq('id', id);
      if (error) throw error;

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
        description={isNew ? 'Completează formularul pentru a crea o știre nouă' : 'Modifică detaliile știrii'}
        breadcrumbs={[
          { label: 'Știri și Anunțuri', href: '/admin/stiri' },
          { label: isNew ? 'Știre Nouă' : 'Editare' },
        ]}
        actions={
          <div className="flex gap-3">
            <AdminButton
              variant="ghost"
              icon={ArrowLeft}
              onClick={() => router.push('/admin/stiri')}
            >
              Înapoi la listă
            </AdminButton>
            {!isNew && (
              <AdminButton
                variant="danger"
                icon={Trash2}
                onClick={() => setDeleteDialogOpen(true)}
              >
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
                hint="Acest text va apărea în URL-ul știrii"
              />

              <AdminTextarea
                label="Rezumat"
                value={formData.excerpt}
                onChange={(e) => handleChange('excerpt', e.target.value)}
                placeholder="Un scurt rezumat al știrii (opțional)"
                rows={3}
                hint="Afișat în listele de știri și în preview-uri"
              />

              <AdminTextarea
                label="Conținut complet"
                value={formData.content}
                onChange={(e) => handleChange('content', e.target.value)}
                placeholder="Conținutul complet al știrii..."
                rows={12}
                hint="Textul complet al știrii"
              />
            </div>
          </AdminCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Actions */}
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

          {/* Featured Image */}
          <AdminCard title="Imagine principală">
            <div className="space-y-4">
              <AdminInput
                label="URL Imagine"
                value={formData.featured_image}
                onChange={(e) => handleChange('featured_image', e.target.value)}
                placeholder="https://..."
                hint="URL-ul imaginii principale"
              />
              {formData.featured_image && (
                <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden">
                  <img
                    src={formData.featured_image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
              {!formData.featured_image && (
                <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-slate-400">
                    <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                    <p>Nicio imagine selectată</p>
                  </div>
                </div>
              )}
            </div>
          </AdminCard>
        </div>
      </div>

      {/* Delete Confirmation */}
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
