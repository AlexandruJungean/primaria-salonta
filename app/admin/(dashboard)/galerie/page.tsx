'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plus, Trash2, Image as ImageIcon, ChevronLeft, ChevronRight, GripVertical } from 'lucide-react';
import {
  AdminPageHeader,
  AdminCard,
  AdminConfirmDialog,
  toast,
} from '@/components/admin';
import { adminFetch } from '@/lib/api-client';

interface PageImage {
  id: string;
  page_slug: string;
  image_url: string;
  alt_text: string | null;
  caption: string | null;
  sort_order: number;
  published: boolean;
  created_at: string;
}

export default function GaleriePage() {
  const [images, setImages] = useState<PageImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<PageImage | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadImages = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminFetch('/api/admin/gallery');
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setImages(result.data || []);
    } catch (error) {
      console.error('Error loading images:', error);
      toast.error('Eroare', 'Nu s-au putut încărca imaginile.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadImages(); }, [loadImages]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    let uploaded = 0;

    try {
      const maxSortOrder = images.length > 0
        ? Math.max(...images.map(img => img.sort_order))
        : 0;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('sort_order', String(maxSortOrder + i + 1));

        const response = await adminFetch('/api/admin/gallery/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) uploaded++;
      }

      if (uploaded > 0) {
        toast.success('Încărcare finalizată', `${uploaded} imagine(i) încărcate cu succes!`);
        loadImages();
      } else {
        toast.error('Eroare', 'Nu s-a putut încărca nicio imagine.');
      }
    } catch (error) {
      console.error('Error uploading:', error);
      toast.error('Eroare la încărcare', 'Nu s-au putut încărca imaginile.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const moveImage = async (index: number, direction: 'left' | 'right') => {
    const swapIndex = direction === 'left' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= images.length) return;

    const newImages = [...images];
    [newImages[index], newImages[swapIndex]] = [newImages[swapIndex], newImages[index]];
    setImages(newImages);

    try {
      const response = await adminFetch('/api/admin/gallery', {
        method: 'PATCH',
        body: JSON.stringify({ orderedIds: newImages.map(img => img.id) }),
      });
      if (!response.ok) throw new Error('Failed to reorder');
    } catch {
      toast.error('Eroare la reordonare');
      await loadImages();
    }
  };

  const confirmDelete = (image: PageImage) => {
    setImageToDelete(image);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!imageToDelete) return;
    setDeleting(true);
    try {
      const params = new URLSearchParams({
        id: imageToDelete.id,
        image_url: imageToDelete.image_url,
      });
      const response = await adminFetch(`/api/admin/gallery?${params}`, { method: 'DELETE' });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error);
      }
      toast.success('Șters', 'Imaginea a fost ștearsă.');
      setDeleteDialogOpen(false);
      setImageToDelete(null);
      loadImages();
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Eroare', 'Nu s-a putut șterge imaginea.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Galerie Foto"
        description={`${images.length} imagini în galeria foto a orașului`}
        breadcrumbs={[
          { label: 'Localitatea', href: '/admin/localitatea' },
          { label: 'Galerie Foto' },
        ]}
        actions={
          <label className="cursor-pointer">
            <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" disabled={uploading} />
            <span className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer">
              <Plus className="w-5 h-5" />
              {uploading ? 'Se încarcă...' : 'Încarcă Imagini'}
            </span>
          </label>
        }
      />

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
        </div>
      ) : images.length === 0 ? (
        <AdminCard className="text-center py-12">
          <ImageIcon className="w-16 h-16 mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">Nicio imagine în galerie</h3>
          <p className="text-slate-500 mb-4">Încarcă primele imagini pentru a popula galeria.</p>
          <label className="cursor-pointer inline-block">
            <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" disabled={uploading} />
            <span className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer">
              <Plus className="w-5 h-5" />
              Încarcă Imagini
            </span>
          </label>
        </AdminCard>
      ) : (
        <>
          <p className="text-sm text-slate-500 mb-4">Folosește săgețile pentru a schimba ordinea imaginilor. Prima imagine apare prima în galerie.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {images.map((image, index) => (
              <div
                key={image.id}
                className="group relative aspect-square bg-slate-100 rounded-lg overflow-hidden"
              >
                <img
                  src={image.image_url}
                  alt={image.alt_text || 'Imagine galerie'}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />

                {/* Order badge */}
                <div className="absolute top-2 left-2 w-7 h-7 bg-black/60 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {index + 1}
                </div>

                {/* Hover overlay with actions */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  {/* Reorder buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => moveImage(index, 'left')}
                      disabled={index === 0}
                      className="p-2 bg-white/90 rounded-lg hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Mută la stânga"
                    >
                      <ChevronLeft className="w-4 h-4 text-slate-700" />
                    </button>
                    <span className="text-white text-sm font-medium">{index + 1}/{images.length}</span>
                    <button
                      onClick={() => moveImage(index, 'right')}
                      disabled={index === images.length - 1}
                      className="p-2 bg-white/90 rounded-lg hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Mută la dreapta"
                    >
                      <ChevronRight className="w-4 h-4 text-slate-700" />
                    </button>
                  </div>
                  {/* Delete button */}
                  <button
                    onClick={() => confirmDelete(image)}
                    className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors flex items-center gap-1.5"
                  >
                    <Trash2 className="w-4 h-4" />
                    Șterge
                  </button>
                </div>

                {/* Caption */}
                {image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent text-white text-xs">
                    <p className="truncate">{image.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      <AdminConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Șterge Imaginea?"
        message="Ești sigur că vrei să ștergi această imagine? Această acțiune nu poate fi anulată."
        confirmLabel="Da, șterge"
        cancelLabel="Nu, anulează"
        loading={deleting}
      />
    </div>
  );
}
