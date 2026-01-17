'use client';

import { DocumentEdit } from '@/components/admin';

export default function BuletinInformativEditPage() {
  return (
    <DocumentEdit
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
