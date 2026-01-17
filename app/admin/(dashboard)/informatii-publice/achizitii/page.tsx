'use client';

import { DocumentList } from '@/components/admin';

export default function AchizitiiPage() {
  return (
    <DocumentList
      filterType="category"
      filterValue="achizitii"
      pageTitle="Achiziții Publice"
      breadcrumbs={[
        { label: 'Informații Publice' },
        { label: 'Achiziții Publice' },
      ]}
      basePath="/admin/informatii-publice/achizitii"
    />
  );
}
