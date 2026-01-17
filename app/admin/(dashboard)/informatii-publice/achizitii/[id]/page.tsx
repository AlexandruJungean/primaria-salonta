'use client';

import { DocumentEdit } from '@/components/admin';

export default function AchizitiiEditPage() {
  return (
    <DocumentEdit
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
