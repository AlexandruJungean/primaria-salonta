'use client';

import { DocumentEdit } from '@/components/admin';

export default function MediuEditPage() {
  return (
    <DocumentEdit
      filterType="category"
      filterValue="mediu"
      pageTitle="Mediu"
      breadcrumbs={[
        { label: 'Informații Publice' },
        { label: 'Mediu' },
      ]}
      basePath="/admin/informatii-publice/mediu"
    />
  );
}
