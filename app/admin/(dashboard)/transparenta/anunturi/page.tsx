'use client';

import { DocumentList } from '@/components/admin';

export default function AnunturiPage() {
  return (
    <DocumentList
      filterType="source_folder"
      filterValue="anunturi"
      pageTitle="Transparență - Anunțuri"
      breadcrumbs={[
        { label: 'Transparență' },
        { label: 'Anunțuri' },
      ]}
      basePath="/admin/transparenta/anunturi"
      hideCreatedAtColumn
    />
  );
}
