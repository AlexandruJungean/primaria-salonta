'use client';

import { DocumentEdit } from '@/components/admin';

export default function StatutEditPage() {
  return (
    <DocumentEdit
      filterType="source_folder"
      filterValue="statutul-unitatii-administrativ-teritoriale"
      pageTitle="Statut UAT"
      breadcrumbs={[
        { label: 'Monitorul Oficial' },
        { label: 'Statut UAT' },
      ]}
      basePath="/admin/monitorul-oficial/statut"
    />
  );
}
