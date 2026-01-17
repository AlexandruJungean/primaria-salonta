'use client';

import { DocumentList } from '@/components/admin';

export default function AnunturiIPPage() {
  return (
    <DocumentList
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
