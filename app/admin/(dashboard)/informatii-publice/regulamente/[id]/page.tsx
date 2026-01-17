'use client';

import { DocumentEdit } from '@/components/admin';

export default function RegulamenteIPEditPage() {
  return (
    <DocumentEdit
      filterType="category"
      filterValue="regulamente"
      pageTitle="Regulamente"
      breadcrumbs={[
        { label: 'Informații Publice' },
        { label: 'Regulamente' },
      ]}
      basePath="/admin/informatii-publice/regulamente"
    />
  );
}
