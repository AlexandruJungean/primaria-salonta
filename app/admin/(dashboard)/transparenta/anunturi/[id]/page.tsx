'use client';

import { DocumentEdit } from '@/components/admin';

export default function AnunturiEditPage() {
  return (
    <DocumentEdit
      filterType="source_folder"
      filterValue="anunturi"
      pageTitle="Transparență - Anunțuri"
      breadcrumbs={[
        { label: 'Transparență' },
        { label: 'Anunțuri' },
      ]}
      basePath="/admin/transparenta/anunturi"
    />
  );
}
