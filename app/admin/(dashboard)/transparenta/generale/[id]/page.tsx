'use client';

import { DocumentEdit } from '@/components/admin';

export default function GeneraleEditPage() {
  return (
    <DocumentEdit
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
