'use client';

import { DocumentEdit } from '@/components/admin';

export default function ActeNecesareEditPage() {
  return (
    <DocumentEdit
      filterType="category"
      filterValue="acte_necesare"
      pageTitle="Acte Necesare"
      breadcrumbs={[
        { label: 'Informații Publice' },
        { label: 'Acte Necesare' },
      ]}
      basePath="/admin/informatii-publice/acte-necesare"
    />
  );
}
