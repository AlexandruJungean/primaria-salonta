'use client';

import { DocumentList } from '@/components/admin';

export default function RegulamenteMolPage() {
  return (
    <DocumentList
      filterType="source_folder"
      filterValue="regulamentele-privind-procedurile-administrative"
      pageTitle="Regulamente (Monitorul Oficial)"
      breadcrumbs={[
        { label: 'Monitorul Oficial' },
        { label: 'Regulamente' },
      ]}
      basePath="/admin/monitorul-oficial/regulamente"
      hideYearColumn
      hideYearFilter
    />
  );
}
