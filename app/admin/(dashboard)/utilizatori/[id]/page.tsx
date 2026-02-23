'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Save, ArrowLeft, Loader2, Shield } from 'lucide-react';
import {
  AdminPageHeader,
  AdminButton,
  AdminCard,
  AdminInput,
  AdminSelect,
  toast,
} from '@/components/admin';
import { useAdminAuth } from '@/components/admin/hooks/use-admin-auth';
import { adminFetch } from '@/lib/api-client';

interface UserForm {
  email: string;
  full_name: string;
  role: string;
  department: string;
  phone: string;
  password: string;
  confirm_password: string;
}

const ROLE_OPTIONS = [
  { value: 'super_admin', label: 'Super Admin - Acces complet' },
  { value: 'admin', label: 'Administrator - Gestionare conținut și utilizatori' },
  { value: 'editor', label: 'Editor - Creare și editare conținut' },
  { value: 'viewer', label: 'Vizitator - Doar vizualizare' },
];

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const { user: currentUser } = useAdminAuth();
  const isNew = params.id === 'nou';
  const userId = isNew ? null : params.id as string;

  const [form, setForm] = useState<UserForm>({
    email: '',
    full_name: '',
    role: 'editor',
    department: '',
    phone: '',
    password: '',
    confirm_password: '',
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof UserForm, string>>>({});

  const canAccess = currentUser?.role === 'admin' || currentUser?.role === 'super_admin';

  useEffect(() => {
    if (!isNew && userId) {
      loadUser();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNew, userId]);

  const loadUser = async () => {
    try {
      const response = await adminFetch('/api/admin/users');
      if (!response.ok) throw new Error('Failed to fetch');
      const users = await response.json();
      const targetUser = users.find((u: { id: string }) => u.id === userId);

      if (!targetUser) {
        toast.error('Eroare', 'Utilizatorul nu a fost găsit');
        router.push('/admin/utilizatori');
        return;
      }

      setForm({
        email: targetUser.email,
        full_name: targetUser.full_name,
        role: targetUser.role,
        department: targetUser.department || '',
        phone: targetUser.phone || '',
        password: '',
        confirm_password: '',
      });
    } catch (error) {
      console.error('Error loading user:', error);
      toast.error('Eroare', 'Nu s-a putut încărca utilizatorul');
    } finally {
      setLoading(false);
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof UserForm, string>> = {};

    if (!form.email.trim()) newErrors.email = 'Email-ul este obligatoriu';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Email invalid';

    if (!form.full_name.trim()) newErrors.full_name = 'Numele este obligatoriu';
    if (!form.role) newErrors.role = 'Rolul este obligatoriu';

    if (isNew) {
      if (!form.password) newErrors.password = 'Parola este obligatorie';
      else if (form.password.length < 8) newErrors.password = 'Minim 8 caractere';
      else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
        newErrors.password = 'Trebuie să conțină literă mare, literă mică și cifră';
      }

      if (form.password !== form.confirm_password) {
        newErrors.confirm_password = 'Parolele nu coincid';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);

    try {
      if (isNew) {
        const response = await adminFetch('/api/admin/users', {
          method: 'POST',
          body: JSON.stringify({
            email: form.email.trim(),
            password: form.password,
            full_name: form.full_name.trim(),
            role: form.role,
            department: form.department.trim() || null,
            phone: form.phone.trim() || null,
          }),
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error);
        }

        toast.success('Succes', 'Utilizatorul a fost creat');
      } else {
        const response = await adminFetch(`/api/admin/users?id=${userId}`, {
          method: 'PATCH',
          body: JSON.stringify({
            email: form.email.trim(),
            full_name: form.full_name.trim(),
            role: form.role,
            department: form.department.trim() || null,
            phone: form.phone.trim() || null,
          }),
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error);
        }

        toast.success('Succes', 'Utilizatorul a fost actualizat');
      }

      router.push('/admin/utilizatori');
    } catch (error) {
      toast.error('Eroare', error instanceof Error ? error.message : 'Operația a eșuat');
    } finally {
      setSaving(false);
    }
  };

  if (!canAccess) {
    return (
      <div>
        <AdminPageHeader title="Acces Restricționat" />
        <AdminCard>
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-lg text-slate-600">Nu ai permisiunile necesare.</p>
          </div>
        </AdminCard>
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <AdminPageHeader
          title={isNew ? 'Utilizator Nou' : 'Editare Utilizator'}
          breadcrumbs={[
            { label: 'Utilizatori', href: '/admin/utilizatori' },
            { label: isNew ? 'Nou' : 'Editare' },
          ]}
        />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  const availableRoles = currentUser?.role === 'super_admin'
    ? ROLE_OPTIONS
    : ROLE_OPTIONS.filter(r => r.value === 'editor' || r.value === 'viewer');

  return (
    <div>
      <AdminPageHeader
        title={isNew ? 'Utilizator Nou' : `Editare: ${form.full_name}`}
        description={isNew ? 'Creează un cont nou de administrare' : 'Modifică datele utilizatorului'}
        breadcrumbs={[
          { label: 'Utilizatori', href: '/admin/utilizatori' },
          { label: isNew ? 'Utilizator Nou' : form.full_name },
        ]}
        actions={
          <AdminButton variant="secondary" icon={ArrowLeft} onClick={() => router.push('/admin/utilizatori')}>
            Înapoi
          </AdminButton>
        }
      />

      <div className="max-w-2xl">
        <AdminCard title="Informații Utilizator">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AdminInput
                label="Nume complet"
                value={form.full_name}
                onChange={(e) => setForm(prev => ({ ...prev, full_name: e.target.value }))}
                error={errors.full_name}
                required
                placeholder="Ion Popescu"
              />
              <AdminInput
                label="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                error={errors.email}
                required
                placeholder="ion.popescu@salonta.net"
                disabled={!isNew && userId === currentUser?.id}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AdminSelect
                label="Rol"
                value={form.role}
                onChange={(e) => setForm(prev => ({ ...prev, role: e.target.value }))}
                options={availableRoles}
                error={errors.role}
                required
              />
              <AdminInput
                label="Departament"
                value={form.department}
                onChange={(e) => setForm(prev => ({ ...prev, department: e.target.value }))}
                placeholder="Ex: Serviciul IT"
              />
            </div>

            <AdminInput
              label="Telefon"
              value={form.phone}
              onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="0712 345 678"
            />
          </div>
        </AdminCard>

        {isNew && (
          <AdminCard title="Setare Parolă" className="mt-6">
            <div className="space-y-4">
              <p className="text-sm text-slate-600">
                Utilizatorul va fi obligat să își schimbe parola la prima autentificare.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AdminInput
                  label="Parolă"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))}
                  error={errors.password}
                  required
                  hint="Minim 8 caractere, literă mare, literă mică, cifră"
                />
                <AdminInput
                  label="Confirmare parolă"
                  type="password"
                  value={form.confirm_password}
                  onChange={(e) => setForm(prev => ({ ...prev, confirm_password: e.target.value }))}
                  error={errors.confirm_password}
                  required
                />
              </div>
            </div>
          </AdminCard>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <AdminButton variant="secondary" onClick={() => router.push('/admin/utilizatori')}>
            Anulează
          </AdminButton>
          <AdminButton icon={Save} onClick={handleSave} loading={saving}>
            {isNew ? 'Creează Utilizator' : 'Salvează Modificările'}
          </AdminButton>
        </div>
      </div>
    </div>
  );
}
