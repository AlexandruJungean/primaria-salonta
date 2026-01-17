'use client';

import { DocumentList } from '@/components/admin';

export default function PlanuriUrbanisticePage() {
  return (
    <DocumentList
      filterType="category"
      filterValue="planuri_urbanistice"
      pageTitle="Planuri Urbanistice"
      breadcrumbs={[
        { label: 'Informații Publice' },
        { label: 'Planuri Urbanistice' },
      ]}
      basePath="/admin/informatii-publice/planuri-urbanistice"
    />
  );
}
