'use client';

import { DocumentList } from '@/components/admin';

export default function DispozitiiIPPage() {
  return (
    <DocumentList
      filterType="category"
      filterValue="dispozitii"
      pageTitle="Dispoziții"
      breadcrumbs={[
        { label: 'Informații Publice' },
        { label: 'Dispoziții' },
      ]}
      basePath="/admin/informatii-publice/dispozitii"
      hideCreatedAtColumn
    />
  );
}
