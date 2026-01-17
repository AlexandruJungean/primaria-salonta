'use client';

import { DocumentEdit } from '@/components/admin';

export default function AlteDocumenteMolEditPage() {
  return (
    <DocumentEdit
      filterType="source_folder"
      filterValue="alte-documente"
      pageTitle="Alte Documente (Monitorul Oficial)"
      breadcrumbs={[
        { label: 'Monitorul Oficial' },
        { label: 'Alte Documente' },
      ]}
      basePath="/admin/monitorul-oficial/alte-documente"
    />
  );
}
