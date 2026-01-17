'use client';

import { DocumentEdit } from '@/components/admin';

export default function LicitatiiEditPage() {
  return (
    <DocumentEdit
      filterType="category"
      filterValue="licitatii"
      pageTitle="Licitații"
      breadcrumbs={[
        { label: 'Informații Publice' },
        { label: 'Licitații' },
      ]}
      basePath="/admin/informatii-publice/licitatii"
    />
  );
}
