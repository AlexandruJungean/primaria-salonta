'use client';

import { DocumentList } from '@/components/admin';

export default function FormularePage() {
  return (
    <DocumentList
      filterType="category"
      filterValue="formulare"
      pageTitle="Formulare"
      breadcrumbs={[
        { label: 'Informații Publice' },
        { label: 'Formulare' },
      ]}
      basePath="/admin/informatii-publice/formulare"
    />
  );
}
