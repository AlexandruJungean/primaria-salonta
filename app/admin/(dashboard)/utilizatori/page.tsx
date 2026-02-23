'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Plus, Shield, ShieldCheck, Pencil, UserCheck, UserX, KeyRound, Copy, Check } from 'lucide-react';
import {
  AdminPageHeader,
  AdminButton,
  AdminCard,
  AdminTable,
  AdminStatusBadge,
  AdminConfirmDialog,
  toast,
} from '@/components/admin';
import { useAdminAuth } from '@/components/admin/hooks/use-admin-auth';
import { adminFetch } from '@/lib/api-client';

interface AdminUserProfile {
  id: string;
  email: string;
  full_name: string;
  role: string;
  department: string | null;
  phone: string | null;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
}

const ROLE_LABELS: Record<string, string> = {
  super_admin: 'Super Admin',
  admin: 'Administrator',
  editor: 'Editor',
  viewer: 'Vizitator',
};

const ROLE_COLORS: Record<string, string> = {
  super_admin: 'bg-purple-100 text-purple-800',
  admin: 'bg-blue-100 text-blue-800',
  editor: 'bg-green-100 text-green-800',
  viewer: 'bg-slate-100 text-slate-600',
};

export default function UtilizatoriPage() {
  const router = useRouter();
  const { user } = useAdminAuth();
  const [users, setUsers] = useState<AdminUserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggleDialog, setToggleDialog] = useState<{ open: boolean; user: AdminUserProfile | null; saving: boolean }>({
    open: false, user: null, saving: false,
  });
  const [resetDialog, setResetDialog] = useState<{ open: boolean; user: AdminUserProfile | null; saving: boolean; tempPassword: string | null; copied: boolean }>({
    open: false, user: null, saving: false, tempPassword: null, copied: false,
  });

  const canAccess = user?.role === 'admin' || user?.role === 'super_admin';

  const loadUsers = useCallback(async () => {
    try {
      const response = await adminFetch('/api/admin/users');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Eroare', 'Nu s-au putut încărca utilizatorii');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (canAccess) loadUsers();
  }, [canAccess, loadUsers]);

  if (!canAccess) {
    return (
      <div>
        <AdminPageHeader title="Acces Restricționat" />
        <AdminCard>
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-lg text-slate-600">Nu ai permisiunile necesare pentru a accesa această pagină.</p>
          </div>
        </AdminCard>
      </div>
    );
  }

  const handleToggleActive = async () => {
    if (!toggleDialog.user) return;
    setToggleDialog(prev => ({ ...prev, saving: true }));

    try {
      const response = await adminFetch(`/api/admin/users?id=${toggleDialog.user.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ is_active: !toggleDialog.user.is_active }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error);
      }

      toast.success('Succes', `Utilizatorul a fost ${toggleDialog.user.is_active ? 'dezactivat' : 'activat'}`);
      loadUsers();
    } catch (error) {
      toast.error('Eroare', error instanceof Error ? error.message : 'Operația a eșuat');
    } finally {
      setToggleDialog({ open: false, user: null, saving: false });
    }
  };

  const handleResetPassword = async () => {
    if (!resetDialog.user || resetDialog.tempPassword) return;
    setResetDialog(prev => ({ ...prev, saving: true }));

    try {
      const response = await adminFetch('/api/admin/users/reset-password', {
        method: 'POST',
        body: JSON.stringify({ user_id: resetDialog.user.id }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error);
      }

      const data = await response.json();
      setResetDialog(prev => ({ ...prev, saving: false, tempPassword: data.temporary_password }));
    } catch (error) {
      toast.error('Eroare', error instanceof Error ? error.message : 'Resetarea a eșuat');
      setResetDialog(prev => ({ ...prev, saving: false }));
    }
  };

  const copyPassword = async () => {
    if (!resetDialog.tempPassword) return;
    try {
      await navigator.clipboard.writeText(resetDialog.tempPassword);
      setResetDialog(prev => ({ ...prev, copied: true }));
      setTimeout(() => setResetDialog(prev => ({ ...prev, copied: false })), 2000);
    } catch {
      toast.error('Eroare', 'Nu s-a putut copia parola');
    }
  };

  const columns = [
    {
      key: 'full_name' as const,
      label: 'Nume',
      render: (u: AdminUserProfile) => (
        <div>
          <p className="font-semibold text-slate-900">{u.full_name}</p>
          <p className="text-sm text-slate-500">{u.email}</p>
        </div>
      ),
    },
    {
      key: 'role' as const,
      label: 'Rol',
      render: (u: AdminUserProfile) => (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${ROLE_COLORS[u.role] || ROLE_COLORS.viewer}`}>
          {u.role === 'super_admin' ? <ShieldCheck className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
          {ROLE_LABELS[u.role] || u.role}
        </span>
      ),
    },
    {
      key: 'department' as const,
      label: 'Departament',
      render: (u: AdminUserProfile) => u.department || '-',
    },
    {
      key: 'is_active' as const,
      label: 'Status',
      render: (u: AdminUserProfile) => (
        <AdminStatusBadge status={u.is_active ? 'active' : 'inactive'} />
      ),
    },
    {
      key: 'last_login' as const,
      label: 'Ultima autentificare',
      render: (u: AdminUserProfile) => u.last_login
        ? new Date(u.last_login).toLocaleString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
        : 'Niciodată',
      className: 'hidden lg:table-cell',
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Utilizatori Admin"
        description="Gestionează conturile de administrare ale website-ului"
        breadcrumbs={[{ label: 'Utilizatori' }]}
        actions={
          <AdminButton icon={Plus} onClick={() => router.push('/admin/utilizatori/nou')}>
            Adaugă Utilizator
          </AdminButton>
        }
      />

      <AdminTable
        data={users}
        columns={columns}
        loading={loading}
        emptyMessage="Nu există utilizatori."
        onEdit={(u) => router.push(`/admin/utilizatori/${u.id}`)}
        onDelete={(u) => {
          if (u.id === user?.id) {
            toast.warning('Atenție', 'Nu te poți dezactiva pe tine însuți');
            return;
          }
          setToggleDialog({ open: true, user: u, saving: false });
        }}
        canDelete={(u) => u.id !== user?.id}
        deleteTooltip={(u) => u.id === user?.id ? 'Nu te poți dezactiva pe tine' : (u.is_active ? 'Dezactivează' : 'Activează')}
      />

      {/* Custom actions row per user */}
      {users.length > 0 && (
        <div className="mt-4">
          <AdminCard title="Acțiuni Rapide">
            <div className="space-y-2">
              {users.filter(u => u.id !== user?.id).map(u => (
                <div key={u.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="font-medium text-slate-900">{u.full_name}</span>
                    <span className="text-sm text-slate-500">{u.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AdminButton
                      variant="ghost"
                      size="sm"
                      icon={Pencil}
                      onClick={() => router.push(`/admin/utilizatori/${u.id}`)}
                    >
                      Editează
                    </AdminButton>
                    <AdminButton
                      variant="ghost"
                      size="sm"
                      icon={KeyRound}
                      onClick={() => setResetDialog({ open: true, user: u, saving: false, tempPassword: null, copied: false })}
                    >
                      Resetează Parola
                    </AdminButton>
                    <AdminButton
                      variant="ghost"
                      size="sm"
                      icon={u.is_active ? UserX : UserCheck}
                      onClick={() => setToggleDialog({ open: true, user: u, saving: false })}
                    >
                      {u.is_active ? 'Dezactivează' : 'Activează'}
                    </AdminButton>
                  </div>
                </div>
              ))}
            </div>
          </AdminCard>
        </div>
      )}

      {/* Toggle active dialog */}
      <AdminConfirmDialog
        isOpen={toggleDialog.open}
        onClose={() => setToggleDialog({ open: false, user: null, saving: false })}
        onConfirm={handleToggleActive}
        title={toggleDialog.user?.is_active ? 'Dezactivare Utilizator' : 'Activare Utilizator'}
        message={toggleDialog.user?.is_active
          ? `Sigur vrei să dezactivezi contul lui ${toggleDialog.user?.full_name}? Nu va mai putea accesa panoul de administrare.`
          : `Sigur vrei să activezi contul lui ${toggleDialog.user?.full_name}?`
        }
        confirmLabel={toggleDialog.user?.is_active ? 'Da, dezactivează' : 'Da, activează'}
        variant={toggleDialog.user?.is_active ? 'danger' : 'warning'}
        loading={toggleDialog.saving}
      />

      {/* Reset password dialog */}
      {resetDialog.open && (
        <dialog
          open
          className="fixed inset-0 z-50 bg-transparent p-0 m-0 max-w-none max-h-none w-full h-full"
        >
          <div className="fixed inset-0 bg-black/50" onClick={() => !resetDialog.tempPassword && setResetDialog({ open: false, user: null, saving: false, tempPassword: null, copied: false })} />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
              {!resetDialog.tempPassword ? (
                <>
                  <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
                    <KeyRound className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 text-center mb-2">
                    Resetare Parolă
                  </h3>
                  <p className="text-base text-slate-600 text-center mb-6">
                    Se va genera o parolă temporară pentru <strong>{resetDialog.user?.full_name}</strong>. Utilizatorul va fi obligat să și-o schimbe la prima autentificare.
                  </p>
                  <div className="flex gap-3">
                    <AdminButton
                      variant="secondary"
                      size="lg"
                      className="flex-1"
                      onClick={() => setResetDialog({ open: false, user: null, saving: false, tempPassword: null, copied: false })}
                      disabled={resetDialog.saving}
                    >
                      Anulează
                    </AdminButton>
                    <AdminButton
                      variant="primary"
                      size="lg"
                      className="flex-1"
                      onClick={handleResetPassword}
                      loading={resetDialog.saving}
                    >
                      Generează Parolă
                    </AdminButton>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 text-center mb-2">
                    Parolă Generată
                  </h3>
                  <p className="text-sm text-slate-600 text-center mb-4">
                    Parola temporară pentru <strong>{resetDialog.user?.full_name}</strong>. Copiați-o și comunicați-o utilizatorului. Nu va mai fi afișată!
                  </p>
                  <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-4 mb-6">
                    <code className="flex-1 text-lg font-mono font-bold text-slate-900 text-center tracking-wider">
                      {resetDialog.tempPassword}
                    </code>
                    <button
                      onClick={copyPassword}
                      className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Copiază parola"
                    >
                      {resetDialog.copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                  <AdminButton
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={() => {
                      setResetDialog({ open: false, user: null, saving: false, tempPassword: null, copied: false });
                      toast.success('Succes', 'Parola a fost resetată');
                    }}
                  >
                    Am copiat parola, închide
                  </AdminButton>
                </>
              )}
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}
