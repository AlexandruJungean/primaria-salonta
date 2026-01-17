'use client';

import { DocumentList } from '@/components/admin';

export default function RegulamenteIPPage() {
  return (
    <DocumentList
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
