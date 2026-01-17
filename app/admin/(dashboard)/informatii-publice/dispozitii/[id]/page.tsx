'use client';

import { DocumentEdit } from '@/components/admin';

export default function DispozitiiIPEditPage() {
  return (
    <DocumentEdit
      filterType="category"
      filterValue="dispozitii"
      pageTitle="Dispoziții"
      breadcrumbs={[
        { label: 'Informații Publice' },
        { label: 'Dispoziții' },
      ]}
      basePath="/admin/informatii-publice/dispozitii"
    />
  );
}
