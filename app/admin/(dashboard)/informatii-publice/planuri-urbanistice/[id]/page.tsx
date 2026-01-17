'use client';

import { DocumentEdit } from '@/components/admin';

export default function PlanuriUrbanisticeEditPage() {
  return (
    <DocumentEdit
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
