'use client';

import { DocumentList } from '@/components/admin';

export default function LicitatiiPage() {
  return (
    <DocumentList
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
