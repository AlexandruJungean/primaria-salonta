'use client';

import { useState } from 'react';
import { KeyRound, Save, Eye, EyeOff } from 'lucide-react';
import {
  AdminPageHeader,
  AdminButton,
  AdminCard,
  AdminInput,
  toast,
} from '@/components/admin';
import { adminFetch } from '@/lib/api-client';

export default function ChangePasswordPage() {
  const [form, setForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.current_password) newErrors.current_password = 'Parola curentă este obligatorie';
    if (!form.new_password) {
      newErrors.new_password = 'Parola nouă este obligatorie';
    } else if (form.new_password.length < 8) {
      newErrors.new_password = 'Minim 8 caractere';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.new_password)) {
      newErrors.new_password = 'Trebuie să conțină literă mare, literă mică și cifră';
    }

    if (form.new_password !== form.confirm_password) {
      newErrors.confirm_password = 'Parolele nu coincid';
    }

    if (form.current_password && form.new_password === form.current_password) {
      newErrors.new_password = 'Parola nouă trebuie să fie diferită de cea curentă';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);

    try {
      const response = await adminFetch('/api/admin/users/change-password', {
        method: 'POST',
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error);
      }

      toast.success('Succes', 'Parola a fost schimbată cu succes');
      setForm({ current_password: '', new_password: '', confirm_password: '' });
      setErrors({});
    } catch (error) {
      toast.error('Eroare', error instanceof Error ? error.message : 'Schimbarea parolei a eșuat');
    } finally {
      setSaving(false);
    }
  };

  const toggleVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div>
      <AdminPageHeader
        title="Schimbă Parola"
        description="Actualizează parola contului tău de administrare"
        breadcrumbs={[
          { label: 'Setări', href: '/admin/setari' },
          { label: 'Schimbă Parola' },
        ]}
      />

      <div className="max-w-lg">
        <AdminCard>
          <div className="flex items-center gap-3 mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <KeyRound className="w-6 h-6 text-blue-600 flex-shrink-0" />
            <p className="text-sm text-blue-800">
              Parola trebuie să aibă minim 8 caractere și să conțină cel puțin o literă mare, o literă mică și o cifră.
            </p>
          </div>

          <div className="space-y-5">
            <div className="relative">
              <AdminInput
                label="Parola curentă"
                type={showPasswords.current ? 'text' : 'password'}
                value={form.current_password}
                onChange={(e) => setForm(prev => ({ ...prev, current_password: e.target.value }))}
                error={errors.current_password}
                required
              />
              <button
                type="button"
                onClick={() => toggleVisibility('current')}
                className="absolute right-3 top-[42px] p-1 text-slate-400 hover:text-slate-600"
              >
                {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <hr className="border-slate-200" />

            <div className="relative">
              <AdminInput
                label="Parola nouă"
                type={showPasswords.new ? 'text' : 'password'}
                value={form.new_password}
                onChange={(e) => setForm(prev => ({ ...prev, new_password: e.target.value }))}
                error={errors.new_password}
                required
                hint="Minim 8 caractere, o literă mare, o literă mică, o cifră"
              />
              <button
                type="button"
                onClick={() => toggleVisibility('new')}
                className="absolute right-3 top-[42px] p-1 text-slate-400 hover:text-slate-600"
              >
                {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="relative">
              <AdminInput
                label="Confirmă parola nouă"
                type={showPasswords.confirm ? 'text' : 'password'}
                value={form.confirm_password}
                onChange={(e) => setForm(prev => ({ ...prev, confirm_password: e.target.value }))}
                error={errors.confirm_password}
                required
              />
              <button
                type="button"
                onClick={() => toggleVisibility('confirm')}
                className="absolute right-3 top-[42px] p-1 text-slate-400 hover:text-slate-600"
              >
                {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {form.new_password && (
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm font-medium text-slate-700 mb-2">Cerințe parolă:</p>
                <ul className="space-y-1 text-sm">
                  <li className={form.new_password.length >= 8 ? 'text-green-600' : 'text-slate-400'}>
                    {form.new_password.length >= 8 ? '✓' : '○'} Minim 8 caractere
                  </li>
                  <li className={/[A-Z]/.test(form.new_password) ? 'text-green-600' : 'text-slate-400'}>
                    {/[A-Z]/.test(form.new_password) ? '✓' : '○'} O literă mare
                  </li>
                  <li className={/[a-z]/.test(form.new_password) ? 'text-green-600' : 'text-slate-400'}>
                    {/[a-z]/.test(form.new_password) ? '✓' : '○'} O literă mică
                  </li>
                  <li className={/\d/.test(form.new_password) ? 'text-green-600' : 'text-slate-400'}>
                    {/\d/.test(form.new_password) ? '✓' : '○'} O cifră
                  </li>
                </ul>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <AdminButton icon={Save} onClick={handleSubmit} loading={saving}>
              Schimbă Parola
            </AdminButton>
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
