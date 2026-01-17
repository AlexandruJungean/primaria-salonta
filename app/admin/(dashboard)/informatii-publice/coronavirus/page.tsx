'use client';

import { DocumentList } from '@/components/admin';

export default function CoronavirusPage() {
  return (
    <DocumentList
      filterType="category"
      filterValue="coronavirus"
      pageTitle="Coronavirus"
      breadcrumbs={[
        { label: 'Informații Publice' },
        { label: 'Coronavirus' },
      ]}
      basePath="/admin/informatii-publice/coronavirus"
    />
  );
}
