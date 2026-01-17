'use client';

import { DocumentEdit } from '@/components/admin';

export default function RegulamenteMolEditPage() {
  return (
    <DocumentEdit
      filterType="source_folder"
      filterValue="regulamentele-privind-procedurile-administrative"
      pageTitle="Regulamente (Monitorul Oficial)"
      breadcrumbs={[
        { label: 'Monitorul Oficial' },
        { label: 'Regulamente' },
      ]}
      basePath="/admin/monitorul-oficial/regulamente"
    />
  );
}
