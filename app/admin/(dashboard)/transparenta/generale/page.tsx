'use client';

import { DocumentList } from '@/components/admin';

export default function GeneralePage() {
  return (
    <DocumentList
      filterType="source_folder"
      filterValue="generale"
      pageTitle="Transparență - Generale"
      breadcrumbs={[
        { label: 'Transparență' },
        { label: 'Generale' },
      ]}
      basePath="/admin/transparenta/generale"
    />
  );
}
