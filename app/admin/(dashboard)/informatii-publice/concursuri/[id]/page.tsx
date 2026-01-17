'use client';

import { DocumentEdit } from '@/components/admin';

export default function ConcursuriEditPage() {
  return (
    <DocumentEdit
      filterType="category"
      filterValue="concursuri"
      pageTitle="Concursuri"
      breadcrumbs={[
        { label: 'Informații Publice' },
        { label: 'Concursuri' },
      ]}
      basePath="/admin/informatii-publice/concursuri"
    />
  );
}
