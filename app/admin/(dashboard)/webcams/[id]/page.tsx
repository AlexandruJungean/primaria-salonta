'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Save, ArrowLeft, Trash2, Image as ImageIcon, Video } from 'lucide-react';
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

interface WebcamFormData {
  name: string;
  location: string;
  description: string;
  stream_url: string;
  image_url: string;
  is_active: boolean;
  sort_order: number;
}

const initialFormData: WebcamFormData = {
  name: '',
  location: '',
  description: '',
  stream_url: '',
  image_url: '',
  is_active: true,
  sort_order: 0,
};

export default function WebcamEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === 'nou';

  const [formData, setFormData] = useState<WebcamFormData>(initialFormData);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof WebcamFormData, string>>>({});

  const loadWebcam = useCallback(async () => {
    if (isNew) return;

    try {
      const response = await adminFetch(`/api/admin/webcams?id=${id}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();

      if (data) {
        setFormData({
          name: data.name || '',
          location: data.location || '',
          description: data.description || '',
          stream_url: data.stream_url || '',
          image_url: data.image_url || '',
          is_active: data.is_active ?? true,
          sort_order: data.sort_order || 0,
        });
      }
    } catch (error) {
      console.error('Error loading webcam:', error);
      toast.error('Eroare', 'Nu s-au putut încărca datele.');
      router.push('/admin/webcams');
    } finally {
      setLoading(false);
    }
  }, [id, isNew, router]);

  useEffect(() => {
    loadWebcam();
  }, [loadWebcam]);

  const handleChange = (field: keyof WebcamFormData, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof WebcamFormData, string>> = {};
    if (!formData.name.trim()) newErrors.name = 'Numele este obligatoriu';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      toast.error('Verifică formularul', 'Completează toate câmpurile obligatorii.');
      return;
    }

    setSaving(true);
    try {
      const webcamData = {
        name: formData.name.trim(),
        location: formData.location.trim() || null,
        description: formData.description.trim() || null,
        stream_url: formData.stream_url.trim() || null,
        image_url: formData.image_url.trim() || null,
        is_active: formData.is_active,
        sort_order: formData.sort_order,
      };

      if (isNew) {
        const response = await adminFetch('/api/admin/webcams', {
          method: 'POST',
          body: JSON.stringify(webcamData),
        });
        if (!response.ok) throw new Error('Failed to create');
        toast.success('Cameră adăugată', 'Camera a fost adăugată cu succes!');
      } else {
        const response = await adminFetch(`/api/admin/webcams?id=${id}`, {
          method: 'PATCH',
          body: JSON.stringify(webcamData),
        });
        if (!response.ok) throw new Error('Failed to update');
        toast.success('Cameră salvată', 'Modificările au fost salvate!');
      }

      router.push('/admin/webcams');
    } catch (error: unknown) {
      console.error('Error saving webcam:', error);
      toast.error('Eroare la salvare', 'Nu s-au putut salva datele.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (isNew) return;

    setDeleting(true);
    try {
      const response = await adminFetch(`/api/admin/webcams?id=${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete');

      toast.success('Șters', 'Camera a fost ștearsă.');
      router.push('/admin/webcams');
    } catch (error) {
      console.error('Error deleting webcam:', error);
      toast.error('Eroare la ștergere', 'Nu s-a putut șterge.');
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
        title={isNew ? 'Adaugă Cameră Nouă' : 'Editează Camera'}
        breadcrumbs={[
          { label: 'Camere Web', href: '/admin/webcams' },
          { label: isNew ? 'Cameră Nouă' : 'Editare' },
        ]}
        actions={
          <div className="flex gap-3">
            <AdminButton variant="ghost" icon={ArrowLeft} onClick={() => router.push('/admin/webcams')}>
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
          <AdminCard title="Informații Cameră">
            <div className="space-y-4">
              <AdminInput
                label="Nume Cameră"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Ex: Camera Centru Civic"
                required
                error={errors.name}
              />
              <AdminInput
                label="Locație"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="Ex: Piața Libertății, Salonta"
              />
              <AdminTextarea
                label="Descriere (opțional)"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Descriere scurtă a locației camerei..."
                rows={3}
              />
            </div>
          </AdminCard>

          <AdminCard title="URL-uri Stream">
            <div className="space-y-4">
              <AdminInput
                label="URL Stream Video"
                value={formData.stream_url}
                onChange={(e) => handleChange('stream_url', e.target.value)}
                placeholder="https://stream.example.com/camera1"
                hint="URL-ul stream-ului video live (HLS, RTSP, etc.)"
              />
              <AdminInput
                label="URL Imagine Preview"
                value={formData.image_url}
                onChange={(e) => handleChange('image_url', e.target.value)}
                placeholder="https://..."
                hint="Imagine statică afișată ca preview"
              />
            </div>
          </AdminCard>
        </div>

        <div className="space-y-6">
          <AdminCard title="Setări">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">Activ</p>
                  <p className="text-sm text-slate-500">Afișează pe website</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => handleChange('is_active', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-slate-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <AdminInput
                label="Ordine afișare"
                type="number"
                value={formData.sort_order.toString()}
                onChange={(e) => handleChange('sort_order', parseInt(e.target.value) || 0)}
              />
              <AdminButton size="lg" icon={Save} onClick={handleSave} loading={saving} className="w-full">
                {isNew ? 'Salvează' : 'Salvează Modificările'}
              </AdminButton>
            </div>
          </AdminCard>

          <AdminCard title="Preview Imagine">
            {formData.image_url ? (
              <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden">
                <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-slate-400">
                  <Video className="w-12 h-12 mx-auto mb-2" />
                  <p>Nicio imagine</p>
                </div>
              </div>
            )}
          </AdminCard>
        </div>
      </div>

      <AdminConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Șterge Camera?"
        message={`Ești sigur că vrei să ștergi camera "${formData.name}"?`}
        confirmLabel="Da, șterge"
        cancelLabel="Nu, anulează"
        loading={deleting}
      />
    </div>
  );
}
