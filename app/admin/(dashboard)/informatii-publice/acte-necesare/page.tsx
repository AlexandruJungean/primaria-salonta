'use client';

import { DocumentList } from '@/components/admin';

export default function ActeNecesarePage() {
  return (
    <DocumentList
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
