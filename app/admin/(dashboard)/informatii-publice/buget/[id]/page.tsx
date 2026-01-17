'use client';

import { DocumentEdit } from '@/components/admin';

export default function BugetEditPage() {
  return (
    <DocumentEdit
      filterType="category"
      filterValue="buget"
      pageTitle="Buget"
      breadcrumbs={[
        { label: 'Informații Publice' },
        { label: 'Buget' },
      ]}
      basePath="/admin/informatii-publice/buget"
    />
  );
}
