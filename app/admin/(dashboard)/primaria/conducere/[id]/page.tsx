'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Save, ArrowLeft, Trash2, Image as ImageIcon } from 'lucide-react';
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
import { adminFetch } from '@/lib/api-client';

interface StaffFormData {
  name: string;
  position_type: string;
  position_title: string;
  bio: string;
  email: string;
  phone: string;
  reception_hours: string;
  responsibilities: string;
  photo_url: string;
  is_active: boolean;
  sort_order: number;
}

const initialFormData: StaffFormData = {
  name: '',
  position_type: 'altele',
  position_title: '',
  bio: '',
  email: '',
  phone: '',
  reception_hours: '',
  responsibilities: '',
  photo_url: '',
  is_active: true,
  sort_order: 0,
};

// Conform CHECK constraint din DB: 'primar', 'viceprimar', 'secretar', 'administrator', 'sef_serviciu', 'altele'
const POSITION_TYPES = [
  { value: 'primar', label: 'Primar' },
  { value: 'viceprimar', label: 'Viceprimar' },
  { value: 'secretar', label: 'Secretar General' },
  { value: 'administrator', label: 'Administrator Public' },
  { value: 'sef_serviciu', label: 'Șef Serviciu' },
  { value: 'altele', label: 'Altele' },
];

export default function ConducereEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === 'nou';

  const [formData, setFormData] = useState<StaffFormData>(initialFormData);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof StaffFormData, string>>>({});

  const loadStaff = useCallback(async () => {
    if (isNew) return;

    try {
      const response = await adminFetch(`/api/admin/staff?id=${id}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();

      if (data) {
        setFormData({
          name: data.name || '',
          position_type: data.position_type || 'altele',
          position_title: data.position_title || '',
          bio: data.bio || '',
          email: data.email || '',
          phone: data.phone || '',
          reception_hours: data.reception_hours || '',
          responsibilities: data.responsibilities || '',
          photo_url: data.photo_url || '',
          is_active: data.is_active ?? true,
          sort_order: data.sort_order || 0,
        });
      }
    } catch (error) {
      console.error('Error loading staff:', error);
      toast.error('Eroare', 'Nu s-au putut încărca datele.');
      router.push('/admin/primaria/conducere');
    } finally {
      setLoading(false);
    }
  }, [id, isNew, router]);

  useEffect(() => {
    loadStaff();
  }, [loadStaff]);

  const handleChange = (field: keyof StaffFormData, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof StaffFormData, string>> = {};
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
      const staffData = {
        name: formData.name.trim(),
        position_type: formData.position_type,
        position_title: formData.position_title.trim() || null,
        bio: formData.bio.trim() || null,
        email: formData.email.trim() || null,
        phone: formData.phone.trim() || null,
        reception_hours: formData.reception_hours.trim() || null,
        responsibilities: formData.responsibilities.trim() || null,
        photo_url: formData.photo_url.trim() || null,
        is_active: formData.is_active,
        sort_order: formData.sort_order,
      };

      if (isNew) {
        const response = await adminFetch('/api/admin/staff', {
          method: 'POST',
          body: JSON.stringify(staffData),
        });
        if (!response.ok) throw new Error('Failed to create');
        toast.success('Persoană adăugată', 'Datele au fost salvate cu succes!');
      } else {
        const response = await adminFetch(`/api/admin/staff?id=${id}`, {
          method: 'PATCH',
          body: JSON.stringify(staffData),
        });
        if (!response.ok) throw new Error('Failed to update');
        toast.success('Date salvate', 'Modificările au fost salvate!');
      }

      router.push('/admin/primaria/conducere');
    } catch (error: unknown) {
      console.error('Error saving staff:', error);
      toast.error('Eroare la salvare', 'Nu s-au putut salva datele.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (isNew) return;

    setDeleting(true);
    try {
      const response = await adminFetch(`/api/admin/staff?id=${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete');

      toast.success('Șters', 'Persoana a fost ștearsă din conducere.');
      router.push('/admin/primaria/conducere');
    } catch (error) {
      console.error('Error deleting staff:', error);
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
        title={isNew ? 'Adaugă Persoană' : 'Editează Persoana'}
        breadcrumbs={[
          { label: 'Primăria', href: '/admin/primaria' },
          { label: 'Conducere', href: '/admin/primaria/conducere' },
          { label: isNew ? 'Persoană Nouă' : 'Editare' },
        ]}
        actions={
          <div className="flex gap-3">
            <AdminButton variant="ghost" icon={ArrowLeft} onClick={() => router.push('/admin/primaria/conducere')}>
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
          <AdminCard title="Date Personale">
            <div className="space-y-4">
              <AdminInput
                label="Nume complet"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Ex: Ion Popescu"
                required
                error={errors.name}
              />
              <div className="grid grid-cols-2 gap-4">
                <AdminSelect
                  label="Tip poziție"
                  value={formData.position_type}
                  onChange={(e) => handleChange('position_type', e.target.value)}
                  options={POSITION_TYPES}
                />
                <AdminInput
                  label="Titlu poziție (detaliat)"
                  value={formData.position_title}
                  onChange={(e) => handleChange('position_title', e.target.value)}
                  placeholder="Ex: Director Economic"
                />
              </div>
              <AdminTextarea
                label="Biografie (opțional)"
                value={formData.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                placeholder="Scurtă descriere..."
                rows={3}
              />
              <AdminInput
                label="Program audiențe"
                value={formData.reception_hours}
                onChange={(e) => handleChange('reception_hours', e.target.value)}
                placeholder="Ex: Luni, Miercuri 10:00-12:00"
              />
              <AdminTextarea
                label="Responsabilități (opțional)"
                value={formData.responsibilities}
                onChange={(e) => handleChange('responsibilities', e.target.value)}
                placeholder="Responsabilitățile principale..."
                rows={3}
              />
            </div>
          </AdminCard>

          <AdminCard title="Contact">
            <div className="grid grid-cols-2 gap-4">
              <AdminInput
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="email@salonta.ro"
              />
              <AdminInput
                label="Telefon"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="0259-xxx-xxx"
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
                hint="Persoanele sunt ordonate crescător după acest număr"
              />
              <AdminButton size="lg" icon={Save} onClick={handleSave} loading={saving} className="w-full">
                {isNew ? 'Salvează' : 'Salvează Modificările'}
              </AdminButton>
            </div>
          </AdminCard>

          <AdminCard title="Fotografie">
            <div className="space-y-4">
              <AdminInput
                label="URL Fotografie"
                value={formData.photo_url}
                onChange={(e) => handleChange('photo_url', e.target.value)}
                placeholder="https://..."
              />
              {formData.photo_url ? (
                <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden max-w-[200px] mx-auto">
                  <img src={formData.photo_url} alt="Preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center max-w-[200px] mx-auto">
                  <ImageIcon className="w-12 h-12 text-slate-400" />
                </div>
              )}
            </div>
          </AdminCard>
        </div>
      </div>

      <AdminConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Șterge Persoana?"
        message={`Ești sigur că vrei să ștergi "${formData.name}" din conducere?`}
        confirmLabel="Da, șterge"
        cancelLabel="Nu, anulează"
        loading={deleting}
      />
    </div>
  );
}
