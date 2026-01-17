'use client';

import { DocumentList } from '@/components/admin';

export default function AlteDocumenteMolPage() {
  return (
    <DocumentList
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
