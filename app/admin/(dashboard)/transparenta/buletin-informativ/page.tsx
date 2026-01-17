'use client';

import { DocumentList } from '@/components/admin';

export default function BuletinInformativPage() {
  return (
    <DocumentList
      filterType="source_folder"
      filterValue="buletin-informativ"
      pageTitle="Buletin Informativ"
      breadcrumbs={[
        { label: 'Transparență' },
        { label: 'Buletin Informativ' },
      ]}
      basePath="/admin/transparenta/buletin-informativ"
    />
  );
}
