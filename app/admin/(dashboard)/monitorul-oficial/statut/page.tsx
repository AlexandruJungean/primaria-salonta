'use client';

import { DocumentList } from '@/components/admin';

export default function StatutPage() {
  return (
    <DocumentList
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
