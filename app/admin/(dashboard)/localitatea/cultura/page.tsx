'use client';

import { StructuredPageEditor } from '@/components/admin/structured-page-editor';

export default function AdminCulturaPage() {
  return (
    <StructuredPageEditor
      pageSlug="localitatea-cultura"
      title="Cultură - Personalități"
      description="Gestionează personalitățile marcante din Salonta"
      breadcrumbs={[
        { label: 'Localitatea', href: '/admin/localitatea' },
        { label: 'Cultură' },
      ]}
      dataKey="personalities"
      fields={[
        { key: 'id', label: 'ID (cheie traducere)', type: 'text', required: true, placeholder: 'ex: aranyJanos' },
        { key: 'name', label: 'Nume complet', type: 'text', required: true },
        { key: 'image', label: 'Imagine', type: 'image' },
      ]}
      itemLabel="personalitate"
    />
  );
}
