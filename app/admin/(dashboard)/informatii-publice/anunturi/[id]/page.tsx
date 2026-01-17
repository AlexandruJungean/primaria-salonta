'use client';

import { DocumentEdit } from '@/components/admin';

export default function AnunturiIPEditPage() {
  return (
    <DocumentEdit
      filterType="category"
      filterValue="anunturi"
      pageTitle="Anunțuri"
      breadcrumbs={[
        { label: 'Informații Publice' },
        { label: 'Anunțuri' },
      ]}
      basePath="/admin/informatii-publice/anunturi"
    />
  );
}
