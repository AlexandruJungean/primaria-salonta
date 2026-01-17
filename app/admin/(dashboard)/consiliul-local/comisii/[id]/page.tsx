'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Save, ArrowLeft, Trash2, Plus, X, Users } from 'lucide-react';
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

interface CouncilMember {
  id: string;
  name: string;
  party: string | null;
  is_active: boolean;
}

interface CommissionFormData {
  name: string;
  description: string;
  commission_number: number;
  is_active: boolean;
  sort_order: number;
  member_ids: string[];
}

const initialFormData: CommissionFormData = {
  name: '',
  description: '',
  commission_number: 0,
  is_active: true,
  sort_order: 0,
  member_ids: [],
};

export default function ComisieEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === 'nou';

  const [formData, setFormData] = useState<CommissionFormData>(initialFormData);
  const [availableMembers, setAvailableMembers] = useState<CouncilMember[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof CommissionFormData, string>>>({});

  // For adding new member
  const [selectedMemberId, setSelectedMemberId] = useState('');

  const loadAvailableMembers = useCallback(async () => {
    try {
      const response = await adminFetch('/api/admin/council-members');
      if (!response.ok) throw new Error('Failed to fetch members');
      const data = await response.json();
      setAvailableMembers(data.filter((m: CouncilMember) => m.is_active));
    } catch (error) {
      console.error('Error loading council members:', error);
    }
  }, []);

  const loadCommission = useCallback(async () => {
    if (isNew) return;

    try {
      const response = await adminFetch(`/api/admin/commissions?id=${id}`);
      if (!response.ok) throw new Error('Failed to fetch commission');
      const data = await response.json();

      setFormData({
        name: data.name || '',
        description: data.description || '',
        commission_number: data.commission_number || 0,
        is_active: data.is_active ?? true,
        sort_order: data.sort_order || 0,
        member_ids: data.members?.map((m: { member_id: string }) => m.member_id) || [],
      });
    } catch (error) {
      console.error('Error loading commission:', error);
      toast.error('Eroare', 'Nu s-au putut încărca datele.');
      router.push('/admin/consiliul-local/comisii');
    } finally {
      setLoading(false);
    }
  }, [id, isNew, router]);

  useEffect(() => {
    loadAvailableMembers();
    loadCommission();
  }, [loadAvailableMembers, loadCommission]);

  const handleChange = (field: keyof CommissionFormData, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleAddMember = () => {
    if (!selectedMemberId) {
      toast.error('Selectează', 'Selectează un consilier.');
      return;
    }

    // Check if member already added
    if (formData.member_ids.includes(selectedMemberId)) {
      toast.error('Existent', 'Acest consilier este deja în comisie.');
      return;
    }

    setFormData(prev => ({
      ...prev,
      member_ids: [...prev.member_ids, selectedMemberId],
    }));

    setSelectedMemberId('');
  };

  const handleRemoveMember = (memberId: string) => {
    setFormData(prev => ({
      ...prev,
      member_ids: prev.member_ids.filter(id => id !== memberId),
    }));
  };

  const getMemberName = (memberId: string): string => {
    const member = availableMembers.find(m => m.id === memberId);
    return member?.name || 'Consilier necunoscut';
  };

  const getMemberParty = (memberId: string): string | null => {
    const member = availableMembers.find(m => m.id === memberId);
    return member?.party || null;
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CommissionFormData, string>> = {};
    if (!formData.name.trim()) newErrors.name = 'Numele este obligatoriu';
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
      const commissionData = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        commission_number: formData.commission_number || null,
        is_active: formData.is_active,
        sort_order: formData.sort_order,
        member_ids: formData.member_ids,
      };

      if (isNew) {
        const response = await adminFetch('/api/admin/commissions', {
          method: 'POST',
          body: JSON.stringify(commissionData),
        });

        if (!response.ok) throw new Error('Failed to create');
        toast.success('Comisie adăugată', 'Datele au fost salvate!');
      } else {
        const response = await adminFetch(`/api/admin/commissions?id=${id}`, {
          method: 'PATCH',
          body: JSON.stringify(commissionData),
        });

        if (!response.ok) throw new Error('Failed to update');
        toast.success('Date salvate', 'Modificările au fost salvate!');
      }

      router.push('/admin/consiliul-local/comisii');
    } catch (error) {
      console.error('Error saving commission:', error);
      toast.error('Eroare la salvare', 'Nu s-au putut salva datele.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (isNew) return;
    setDeleting(true);
    try {
      const response = await adminFetch(`/api/admin/commissions?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete');
      toast.success('Șters', 'Comisia a fost ștearsă.');
      router.push('/admin/consiliul-local/comisii');
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Eroare', 'Nu s-a putut șterge.');
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  // Filter out already added members
  const availableMembersToAdd = availableMembers.filter(
    m => !formData.member_ids.includes(m.id)
  );

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
        title={isNew ? 'Adaugă Comisie' : 'Editează Comisia'}
        breadcrumbs={[
          { label: 'Consiliul Local', href: '/admin/consiliul-local' },
          { label: 'Comisii', href: '/admin/consiliul-local/comisii' },
          { label: isNew ? 'Comisie Nouă' : 'Editare' },
        ]}
        actions={
          <div className="flex gap-3">
            <AdminButton variant="ghost" icon={ArrowLeft} onClick={() => router.push('/admin/consiliul-local/comisii')}>
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
        {/* Left column - Commission info */}
        <div className="lg:col-span-2 space-y-6">
          <AdminCard title="Informații Comisie">
            <div className="space-y-4">
              <AdminInput
                label="Denumire Comisie"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
                error={errors.name}
                placeholder="Ex: Comisia pentru buget-finanțe"
              />
              <AdminInput
                label="Număr Comisie"
                type="number"
                value={formData.commission_number.toString()}
                onChange={(e) => handleChange('commission_number', parseInt(e.target.value) || 0)}
                placeholder="Ex: 1"
              />
              <AdminTextarea
                label="Descriere (opțional)"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
                placeholder="Descrierea domeniului de activitate al comisiei..."
              />
            </div>
          </AdminCard>

          {/* Members section */}
          <AdminCard title="Membri Comisie">
            <div className="space-y-4">
              {/* Add member form */}
              <div className="flex gap-3 items-end p-4 bg-slate-50 rounded-lg">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Adaugă Consilier
                  </label>
                  <select
                    value={selectedMemberId}
                    onChange={(e) => setSelectedMemberId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">-- Selectează consilier --</option>
                    {availableMembersToAdd.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name} {member.party ? `(${member.party})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <AdminButton icon={Plus} onClick={handleAddMember} disabled={!selectedMemberId}>
                  Adaugă
                </AdminButton>
              </div>

              {/* Members list */}
              {formData.member_ids.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <Users className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p>Nu există membri în această comisie.</p>
                  <p className="text-sm">Adaugă consilieri folosind formularul de mai sus.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {formData.member_ids.map((memberId) => (
                    <div
                      key={memberId}
                      className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-slate-600">
                            {getMemberName(memberId).split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{getMemberName(memberId)}</p>
                          {getMemberParty(memberId) && (
                            <p className="text-sm text-slate-500">{getMemberParty(memberId)}</p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveMember(memberId)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Elimină din comisie"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-sm text-slate-500">
                Total: {formData.member_ids.length} {formData.member_ids.length === 1 ? 'membru' : 'membri'}
              </p>
            </div>
          </AdminCard>
        </div>

        {/* Right column - Settings */}
        <div>
          <AdminCard title="Setări">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">Activă</p>
                  <p className="text-sm text-slate-500">Comisie în funcție</p>
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
              <AdminButton
                size="lg"
                icon={Save}
                onClick={handleSave}
                loading={saving}
                className="w-full"
              >
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
        title="Șterge Comisia?"
        message={`Ștergi "${formData.name}"? Toți membrii vor fi eliminați din această comisie.`}
        confirmLabel="Da, șterge"
        cancelLabel="Anulează"
        loading={deleting}
      />
    </div>
  );
}
