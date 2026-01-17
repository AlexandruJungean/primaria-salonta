'use client';

import { DocumentList } from '@/components/admin';

export default function ConcursuriPage() {
  return (
    <DocumentList
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
