'use client';

import { DocumentEdit } from '@/components/admin';

export default function CoronavirusEditPage() {
  return (
    <DocumentEdit
      filterType="category"
      filterValue="coronavirus"
      pageTitle="Coronavirus"
      breadcrumbs={[
        { label: 'Informații Publice' },
        { label: 'Coronavirus' },
      ]}
      basePath="/admin/informatii-publice/coronavirus"
    />
  );
}
