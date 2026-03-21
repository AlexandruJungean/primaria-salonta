'use client';

import { StructuredPageEditor } from '@/components/admin/structured-page-editor';

export default function AdminCetateniOnoarePage() {
  return (
    <StructuredPageEditor
      pageSlug="localitatea-cetateni-de-onoare"
      title="Cetățeni de Onoare"
      description="Gestionează lista cetățenilor de onoare ai Municipiului Salonta"
      breadcrumbs={[
        { label: 'Localitatea', href: '/admin/localitatea' },
        { label: 'Cetățeni de Onoare' },
      ]}
      dataKey="citizens"
      fields={[
        { key: 'name', label: 'Nume complet', type: 'text', required: true },
        { key: 'year', label: 'Anul acordării', type: 'text', placeholder: 'ex: 2020 (opțional)' },
        { key: 'description', label: 'Descriere', type: 'textarea', placeholder: 'Descriere scurtă...' },
      ]}
      itemLabel="cetățean de onoare"
    />
  );
}
