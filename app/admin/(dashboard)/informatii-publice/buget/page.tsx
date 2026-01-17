'use client';

import { DocumentList } from '@/components/admin';

export default function BugetPage() {
  return (
    <DocumentList
      filterType="category"
      filterValue="buget"
      pageTitle="Buget"
      breadcrumbs={[
        { label: 'Informații Publice' },
        { label: 'Buget' },
      ]}
      basePath="/admin/informatii-publice/buget"
    />
  );
}
