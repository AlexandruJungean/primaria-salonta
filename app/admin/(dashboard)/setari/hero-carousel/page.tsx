'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import {
  Save,
  Plus,
  Trash2,
  Loader2,
  GripVertical,
  Upload,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  ImageIcon,
  X,
} from 'lucide-react';
import {
  AdminPageHeader,
  AdminButton,
  AdminCard,
  AdminInput,
  AdminConfirmDialog,
  toast,
} from '@/components/admin';
import { adminFetch } from '@/lib/api-client';
import { cn } from '@/lib/utils/cn';

interface HeroSlide {
  id: string;
  slug: string;
  image_url: string;
  alt: string;
  title: string | null;
  sort_order: number;
  is_active: boolean;
}

export default function HeroCarouselPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteSlide, setDeleteSlide] = useState<HeroSlide | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New slide form state
  const [newSlide, setNewSlide] = useState({
    slug: '',
    image_url: '',
    alt: '',
    title: '',
  });

  // Fetch slides
  const fetchSlides = useCallback(async () => {
    try {
      const response = await adminFetch('/api/admin/hero-slides');
      if (response.ok) {
        const data = await response.json();
        setSlides(data);
      } else {
        toast.error('Eroare', 'Nu s-au putut încărca slide-urile');
      }
    } catch (error) {
      console.error('Error fetching slides:', error);
      toast.error('Eroare', 'Nu s-au putut încărca slide-urile');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSlides();
  }, [fetchSlides]);

  // Upload image
  const handleImageUpload = async (file: File, forNew: boolean = false) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'hero');

      const response = await adminFetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
        headers: {}, // Let browser set content-type for FormData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const result = await response.json();
      
      if (forNew) {
        setNewSlide(prev => ({ ...prev, image_url: result.url }));
      } else if (editingSlide) {
        setEditingSlide(prev => prev ? { ...prev, image_url: result.url } : null);
      }

      toast.success('Succes', 'Imaginea a fost încărcată');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Eroare', error instanceof Error ? error.message : 'Nu s-a putut încărca imaginea');
    } finally {
      setUploading(false);
    }
  };

  // Save new slide
  const handleAddSlide = async () => {
    if (!newSlide.slug || !newSlide.image_url || !newSlide.alt) {
      toast.error('Eroare', 'Slug, imagine și textul alternativ sunt obligatorii');
      return;
    }

    setSaving(true);
    try {
      const response = await adminFetch('/api/admin/hero-slides', {
        method: 'POST',
        body: JSON.stringify({
          ...newSlide,
          sort_order: slides.length,
          is_active: true,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create slide');
      }

      toast.success('Succes', 'Slide-ul a fost adăugat');
      setShowAddForm(false);
      setNewSlide({
        slug: '',
        image_url: '',
        alt: '',
        title: '',
      });
      fetchSlides();
    } catch (error) {
      console.error('Error adding slide:', error);
      toast.error('Eroare', error instanceof Error ? error.message : 'Nu s-a putut adăuga slide-ul');
    } finally {
      setSaving(false);
    }
  };

  // Update slide
  const handleUpdateSlide = async () => {
    if (!editingSlide) return;

    setSaving(true);
    try {
      const response = await adminFetch('/api/admin/hero-slides', {
        method: 'PUT',
        body: JSON.stringify(editingSlide),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update slide');
      }

      toast.success('Succes', 'Slide-ul a fost actualizat');
      setEditingSlide(null);
      fetchSlides();
    } catch (error) {
      console.error('Error updating slide:', error);
      toast.error('Eroare', error instanceof Error ? error.message : 'Nu s-a putut actualiza slide-ul');
    } finally {
      setSaving(false);
    }
  };

  // Delete slide
  const handleDeleteSlide = async () => {
    if (!deleteSlide) return;

    try {
      const response = await adminFetch(`/api/admin/hero-slides?id=${deleteSlide.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete slide');
      }

      toast.success('Succes', 'Slide-ul a fost șters');
      setDeleteSlide(null);
      fetchSlides();
    } catch (error) {
      console.error('Error deleting slide:', error);
      toast.error('Eroare', 'Nu s-a putut șterge slide-ul');
    }
  };

  // Toggle active state
  const handleToggleActive = async (slide: HeroSlide) => {
    try {
      const response = await adminFetch('/api/admin/hero-slides', {
        method: 'PUT',
        body: JSON.stringify({
          id: slide.id,
          is_active: !slide.is_active,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update slide');
      }

      fetchSlides();
    } catch (error) {
      console.error('Error toggling slide:', error);
      toast.error('Eroare', 'Nu s-a putut actualiza slide-ul');
    }
  };

  // Move slide up/down
  const handleMoveSlide = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= slides.length) return;

    const newSlides = [...slides];
    [newSlides[index], newSlides[newIndex]] = [newSlides[newIndex], newSlides[index]];

    // Update sort_order for all slides
    const updatedSlides = newSlides.map((slide, i) => ({
      id: slide.id,
      sort_order: i,
    }));

    setSlides(newSlides.map((slide, i) => ({ ...slide, sort_order: i })));

    try {
      const response = await adminFetch('/api/admin/hero-slides', {
        method: 'PATCH',
        body: JSON.stringify({ slides: updatedSlides }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Eroare', 'Nu s-a putut actualiza ordinea');
      fetchSlides(); // Refresh to get correct order
    }
  };

  if (loading) {
    return (
      <div>
        <AdminPageHeader
          title="Hero Carousel"
          description="Gestionează imaginile din caruselul paginii principale"
          breadcrumbs={[
            { label: 'Setări', href: '/admin/setari' },
            { label: 'Hero Carousel' },
          ]}
        />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="Hero Carousel"
        description="Gestionează imaginile din caruselul paginii principale"
        breadcrumbs={[
          { label: 'Setări', href: '/admin/setari' },
          { label: 'Hero Carousel' },
        ]}
        actions={
          <AdminButton
            icon={Plus}
            onClick={() => setShowAddForm(true)}
          >
            Adaugă Imagine
          </AdminButton>
        }
      />

      {/* Add Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Adaugă Imagine Nouă</h2>
                <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Imagine *</label>
                  {newSlide.image_url ? (
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={newSlide.image_url}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                      <button
                        onClick={() => setNewSlide(prev => ({ ...prev, image_url: '' }))}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className={cn(
                        'border-2 border-dashed border-gray-300 rounded-lg p-8',
                        'flex flex-col items-center justify-center cursor-pointer',
                        'hover:border-primary-500 hover:bg-primary-50 transition-colors'
                      )}
                    >
                      {uploading ? (
                        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">Click pentru a încărca o imagine</p>
                          <p className="text-xs text-gray-400 mt-1">Recomandat: 1920x1080px, WebP/JPG</p>
                        </>
                      )}
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, true);
                    }}
                  />
                </div>

                <AdminInput
                  label="Slug (ID unic) *"
                  value={newSlide.slug}
                  onChange={(e) => setNewSlide(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') }))}
                  placeholder="ex: primaria-salonta"
                />

                <AdminInput
                  label="Text alternativ *"
                  value={newSlide.alt}
                  onChange={(e) => setNewSlide(prev => ({ ...prev, alt: e.target.value }))}
                  placeholder="Descriere imagine pentru accesibilitate"
                />

                <AdminInput
                  label="Titlu (opțional)"
                  value={newSlide.title}
                  onChange={(e) => setNewSlide(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Titlu afișat pe imagine"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <AdminButton variant="secondary" onClick={() => setShowAddForm(false)}>
                  Anulează
                </AdminButton>
                <AdminButton icon={Save} onClick={handleAddSlide} loading={saving}>
                  Salvează
                </AdminButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Form Modal */}
      {editingSlide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Editează Imagine</h2>
                <button onClick={() => setEditingSlide(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Image Preview/Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Imagine</label>
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={editingSlide.image_url}
                      alt={editingSlide.alt}
                      fill
                      className="object-cover"
                    />
                    <label className="absolute bottom-2 right-2">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file, false);
                        }}
                      />
                      <span className={cn(
                        'flex items-center gap-2 px-3 py-1.5 bg-white/90 rounded-lg',
                        'text-sm font-medium cursor-pointer hover:bg-white transition-colors'
                      )}>
                        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                        Schimbă
                      </span>
                    </label>
                  </div>
                </div>

                <AdminInput
                  label="Slug (ID unic)"
                  value={editingSlide.slug}
                  onChange={(e) => setEditingSlide(prev => prev ? { ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') } : null)}
                />

                <AdminInput
                  label="Text alternativ *"
                  value={editingSlide.alt}
                  onChange={(e) => setEditingSlide(prev => prev ? { ...prev, alt: e.target.value } : null)}
                />

                <AdminInput
                  label="Titlu (opțional)"
                  value={editingSlide.title || ''}
                  onChange={(e) => setEditingSlide(prev => prev ? { ...prev, title: e.target.value } : null)}
                />
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <AdminButton variant="secondary" onClick={() => setEditingSlide(null)}>
                  Anulează
                </AdminButton>
                <AdminButton icon={Save} onClick={handleUpdateSlide} loading={saving}>
                  Salvează
                </AdminButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Slides List */}
      <AdminCard>
        {slides.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Nu există imagini în carousel</p>
            <AdminButton icon={Plus} onClick={() => setShowAddForm(true)}>
              Adaugă Prima Imagine
            </AdminButton>
          </div>
        ) : (
          <div className="space-y-3">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={cn(
                  'flex items-center gap-4 p-4 rounded-lg border',
                  slide.is_active ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-200 opacity-60'
                )}
              >
                {/* Drag Handle & Order Controls */}
                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => handleMoveSlide(index, 'up')}
                    disabled={index === 0}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <GripVertical className="w-4 h-4 text-gray-300" />
                  <button
                    onClick={() => handleMoveSlide(index, 'down')}
                    disabled={index === slides.length - 1}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>

                {/* Image Preview */}
                <div className="relative w-32 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image
                    src={slide.image_url}
                    alt={slide.alt}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{slide.alt}</p>
                  <p className="text-sm text-gray-500">Slug: {slide.slug}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(slide)}
                    className={cn(
                      'p-2 rounded-lg transition-colors',
                      slide.is_active
                        ? 'text-green-600 hover:bg-green-50'
                        : 'text-gray-400 hover:bg-gray-100'
                    )}
                    title={slide.is_active ? 'Dezactivează' : 'Activează'}
                  >
                    {slide.is_active ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                  <AdminButton
                    variant="secondary"
                    size="sm"
                    onClick={() => setEditingSlide(slide)}
                  >
                    Editează
                  </AdminButton>
                  <button
                    onClick={() => setDeleteSlide(slide)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminCard>

      {/* Delete Confirmation */}
      <AdminConfirmDialog
        isOpen={!!deleteSlide}
        onClose={() => setDeleteSlide(null)}
        onConfirm={handleDeleteSlide}
        title="Șterge Imagine"
        message={`Ești sigur că vrei să ștergi imaginea "${deleteSlide?.alt}"? Această acțiune nu poate fi anulată.`}
        confirmLabel="Șterge"
        variant="danger"
      />
    </div>
  );
}
