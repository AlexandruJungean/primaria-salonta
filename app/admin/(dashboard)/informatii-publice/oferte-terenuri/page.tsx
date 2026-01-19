'use client';

import { DocumentList } from '@/components/admin';

export default function OferteTerenPage() {
  return (
    <DocumentList
      filterType="category"
      filterValue="oferte_terenuri"
      pageTitle="Oferte Terenuri"
      breadcrumbs={[
        { label: 'Informații Publice' },
        { label: 'Oferte Terenuri' },
      ]}
      basePath="/admin/informatii-publice/oferte-terenuri"
      hideCreatedAtColumn
    />
  );
}
