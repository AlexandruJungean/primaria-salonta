'use client';

import { DocumentList } from '@/components/admin';

export default function MediuPage() {
  return (
    <DocumentList
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
