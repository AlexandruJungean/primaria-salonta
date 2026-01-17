'use client';

import { DocumentEdit } from '@/components/admin';

export default function VoluntariatEditPage() {
  return (
    <DocumentEdit
      filterType="source_folder"
      filterValue="activitate-de-voluntariat"
      pageTitle="Activitate de Voluntariat"
      breadcrumbs={[
        { label: 'Altele' },
        { label: 'Voluntariat' },
      ]}
      basePath="/admin/voluntariat"
    />
  );
}
