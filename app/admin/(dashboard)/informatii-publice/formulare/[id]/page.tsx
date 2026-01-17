'use client';

import { DocumentEdit } from '@/components/admin';

export default function FormulareEditPage() {
  return (
    <DocumentEdit
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
