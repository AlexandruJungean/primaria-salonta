'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Save, ArrowLeft, Trash2 } from 'lucide-react';
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

interface FAQFormData {
  question: string;
  answer: string;
  category: string;
  published: boolean;
  sort_order: number;
}

const initialFormData: FAQFormData = {
  question: '',
  answer: '',
  category: '',
  published: true,
  sort_order: 0,
};

export default function FAQEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === 'nou';

  const [formData, setFormData] = useState<FAQFormData>(initialFormData);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FAQFormData, string>>>({});

  const loadFAQ = useCallback(async () => {
    if (isNew) return;

    try {
      const response = await adminFetch(`/api/admin/faq?id=${id}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();

      if (data) {
        setFormData({
          question: data.question || '',
          answer: data.answer || '',
          category: data.category || '',
          published: data.published ?? true,
          sort_order: data.sort_order || 0,
        });
      }
    } catch (error) {
      console.error('Error loading FAQ:', error);
      toast.error('Eroare', 'Nu s-au putut încărca datele.');
      router.push('/admin/faq');
    } finally {
      setLoading(false);
    }
  }, [id, isNew, router]);

  useEffect(() => {
    loadFAQ();
  }, [loadFAQ]);

  const handleChange = (field: keyof FAQFormData, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FAQFormData, string>> = {};
    if (!formData.question.trim()) newErrors.question = 'Întrebarea este obligatorie';
    if (!formData.answer.trim()) newErrors.answer = 'Răspunsul este obligatoriu';
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
      const faqData = {
        question: formData.question.trim(),
        answer: formData.answer.trim(),
        category: formData.category.trim() || null,
        published: formData.published,
        sort_order: formData.sort_order,
      };

      if (isNew) {
        const response = await adminFetch('/api/admin/faq', {
          method: 'POST',
          body: JSON.stringify(faqData),
        });
        if (!response.ok) throw new Error('Failed to create');
        toast.success('Întrebare adăugată', 'Întrebarea a fost adăugată cu succes!');
      } else {
        const response = await adminFetch(`/api/admin/faq?id=${id}`, {
          method: 'PATCH',
          body: JSON.stringify(faqData),
        });
        if (!response.ok) throw new Error('Failed to update');
        toast.success('Întrebare salvată', 'Modificările au fost salvate!');
      }

      router.push('/admin/faq');
    } catch (error: unknown) {
      console.error('Error saving FAQ:', error);
      toast.error('Eroare la salvare', 'Nu s-au putut salva datele.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (isNew) return;

    setDeleting(true);
    try {
      const response = await adminFetch(`/api/admin/faq?id=${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete');

      toast.success('Șters', 'Întrebarea a fost ștearsă.');
      router.push('/admin/faq');
    } catch (error) {
      console.error('Error deleting FAQ:', error);
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
        title={isNew ? 'Adaugă Întrebare Nouă' : 'Editează Întrebarea'}
        breadcrumbs={[
          { label: 'Altele' },
          { label: 'Întrebări Frecvente', href: '/admin/faq' },
          { label: isNew ? 'Întrebare Nouă' : 'Editare' },
        ]}
        actions={
          <div className="flex gap-3">
            <AdminButton variant="ghost" icon={ArrowLeft} onClick={() => router.push('/admin/faq')}>
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
          <AdminCard title="Conținut FAQ">
            <div className="space-y-4">
              <AdminInput
                label="Întrebare"
                value={formData.question}
                onChange={(e) => handleChange('question', e.target.value)}
                placeholder="Ex: Cum pot achita taxele și impozitele online?"
                required
                error={errors.question}
              />
              <AdminTextarea
                label="Răspuns"
                value={formData.answer}
                onChange={(e) => handleChange('answer', e.target.value)}
                placeholder="Răspunsul la întrebare..."
                rows={8}
                required
                error={errors.answer}
                hint="Poate conține HTML simplu pentru formatare (bold, liste, link-uri)"
              />
            </div>
          </AdminCard>
        </div>

        <div className="space-y-6">
          <AdminCard title="Setări">
            <div className="space-y-4">
              <AdminInput
                label="Categorie (opțional)"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                placeholder="Ex: Taxe, Documente, General"
              />
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">Publicat</p>
                  <p className="text-sm text-slate-500">Afișează pe website</p>
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
              <AdminInput
                label="Ordine afișare"
                type="number"
                value={formData.sort_order.toString()}
                onChange={(e) => handleChange('sort_order', parseInt(e.target.value) || 0)}
                hint="Întrebările sunt afișate în ordinea crescătoare a acestei valori"
              />
              <AdminButton size="lg" icon={Save} onClick={handleSave} loading={saving} className="w-full">
                {isNew ? 'Salvează' : 'Salvează Modificările'}
              </AdminButton>
            </div>
          </AdminCard>
        </div>
      </div>

      <AdminConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Șterge Întrebarea?"
        message={`Ești sigur că vrei să ștergi această întrebare?`}
        confirmLabel="Da, șterge"
        cancelLabel="Nu, anulează"
        loading={deleting}
      />
    </div>
  );
}
