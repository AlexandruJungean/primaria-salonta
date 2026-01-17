'use client';

import { DocumentList } from '@/components/admin';

export default function VoluntariatPage() {
  return (
    <DocumentList
      filterType="source_folder"
      filterValue="activitate-de-voluntariat"
      pageTitle="Activitate de Voluntariat"
      breadcrumbs={[
        { label: 'Altele' },
        { label: 'Voluntariat' },
      ]}
      basePath="/admin/voluntariat"
      hideYearColumn
      hideYearFilter
    />
  );
}
