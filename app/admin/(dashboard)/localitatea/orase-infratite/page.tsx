'use client';

import { StructuredPageEditor } from '@/components/admin/structured-page-editor';

export default function AdminOraseInfratitePage() {
  return (
    <StructuredPageEditor
      pageSlug="localitatea-orase-infratite"
      title="Orașe Înfrățite"
      description="Gestionează orașele cu care Salonta are relații de înfrățire"
      breadcrumbs={[
        { label: 'Localitatea', href: '/admin/localitatea' },
        { label: 'Orașe Înfrățite' },
      ]}
      dataKey="twinCities"
      fields={[
        { key: 'id', label: 'ID (cheie traducere)', type: 'text', required: true, placeholder: 'ex: sarkad' },
        { key: 'image', label: 'Stemă/Logo', type: 'image' },
      ]}
      itemLabel="oraș înfrățit"
    />
  );
}
