'use client';

import { DocumentEdit } from '@/components/admin';

export default function OferteTerenEditPage() {
  return (
    <DocumentEdit
      filterType="category"
      filterValue="oferte_terenuri"
      pageTitle="Oferte Terenuri"
      breadcrumbs={[
        { label: 'Informații Publice' },
        { label: 'Oferte Terenuri' },
      ]}
      basePath="/admin/informatii-publice/oferte-terenuri"
    />
  );
}
