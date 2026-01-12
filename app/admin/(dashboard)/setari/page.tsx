'use client';

import { useState } from 'react';
import { Save, Globe, Mail, MapPin, Phone, Building2, Shield, Bell } from 'lucide-react';
import {
  AdminPageHeader,
  AdminButton,
  AdminCard,
  AdminInput,
  AdminTextarea,
  toast,
} from '@/components/admin';

export default function SetariPage() {
  const [saving, setSaving] = useState(false);

  // These would normally come from a settings table in the database
  const [settings, setSettings] = useState({
    siteName: 'Primăria Municipiului Salonta',
    siteDescription: 'Website-ul oficial al Primăriei Municipiului Salonta, județul Bihor',
    contactEmail: 'contact@salonta.ro',
    contactPhone: '0259-373-002',
    address: 'Piața Libertății nr. 1, Salonta, 415500, Bihor',
    workingHours: 'Luni - Vineri: 08:00 - 16:00',
    facebookUrl: 'https://facebook.com/primariasalonta',
    notificationEmail: 'petitii@salonta.ro',
  });

  const handleChange = (field: string, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    // In a real implementation, this would save to a settings table
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Setări salvate', 'Configurările au fost actualizate cu succes!');
    setSaving(false);
  };

  return (
    <div>
      <AdminPageHeader
        title="Setări"
        description="Configurări generale pentru website"
        breadcrumbs={[{ label: 'Setări' }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminCard title="Informații Website" className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AdminInput
              label="Nume Website"
              value={settings.siteName}
              onChange={(e) => handleChange('siteName', e.target.value)}
            />
            <AdminInput
              label="Email Contact Principal"
              type="email"
              value={settings.contactEmail}
              onChange={(e) => handleChange('contactEmail', e.target.value)}
            />
          </div>
          <div className="mt-4">
            <AdminTextarea
              label="Descriere Website"
              value={settings.siteDescription}
              onChange={(e) => handleChange('siteDescription', e.target.value)}
              rows={2}
              hint="Această descriere apare în rezultatele motoarelor de căutare"
            />
          </div>
        </AdminCard>

        <AdminCard title="Contact">
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
              <Phone className="w-5 h-5 text-slate-600" />
              <div className="flex-1">
                <AdminInput
                  label="Telefon Principal"
                  value={settings.contactPhone}
                  onChange={(e) => handleChange('contactPhone', e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
              <MapPin className="w-5 h-5 text-slate-600" />
              <div className="flex-1">
                <AdminInput
                  label="Adresă"
                  value={settings.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
              <Building2 className="w-5 h-5 text-slate-600" />
              <div className="flex-1">
                <AdminInput
                  label="Program de Lucru"
                  value={settings.workingHours}
                  onChange={(e) => handleChange('workingHours', e.target.value)}
                />
              </div>
            </div>
          </div>
        </AdminCard>

        <AdminCard title="Social Media">
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
              <Globe className="w-5 h-5 text-slate-600" />
              <div className="flex-1">
                <AdminInput
                  label="Facebook URL"
                  value={settings.facebookUrl}
                  onChange={(e) => handleChange('facebookUrl', e.target.value)}
                  placeholder="https://facebook.com/..."
                />
              </div>
            </div>
          </div>
        </AdminCard>

        <AdminCard title="Notificări" className="lg:col-span-2">
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
              <Bell className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <AdminInput
                  label="Email pentru Notificări (Petiții și Contact)"
                  type="email"
                  value={settings.notificationEmail}
                  onChange={(e) => handleChange('notificationEmail', e.target.value)}
                  hint="Petițiile și mesajele de contact vor fi trimise la această adresă"
                />
              </div>
            </div>
          </div>
        </AdminCard>

        <AdminCard title="Securitate" className="lg:col-span-2 bg-slate-50">
          <div className="flex items-start gap-4">
            <Shield className="w-8 h-8 text-slate-600" />
            <div>
              <h4 className="font-semibold text-slate-900">Informații de Securitate</h4>
              <ul className="mt-2 space-y-1 text-sm text-slate-600">
                <li>✓ Autentificarea este protejată prin Supabase Auth</li>
                <li>✓ Toate fișierele sunt stocate în Cloudflare R2 (documente) și Supabase Storage (imagini)</li>
                <li>✓ Panoul de admin nu este indexat de motoarele de căutare</li>
                <li>✓ Hotărârile și documentele oficiale nu pot fi șterse după 24 de ore</li>
              </ul>
            </div>
          </div>
        </AdminCard>
      </div>

      <div className="mt-6 flex justify-end">
        <AdminButton size="lg" icon={Save} onClick={handleSave} loading={saving}>
          Salvează Setările
        </AdminButton>
      </div>
    </div>
  );
}
