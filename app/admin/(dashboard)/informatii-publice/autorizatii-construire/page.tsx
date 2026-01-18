'use client';

import { DocumentList } from '@/components/admin';

export default function AutorizatiiConstruirePage() {
  return (
    <DocumentList
      filterType="category"
      filterValue="autorizatii_construire"
      pageTitle="Autorizații de Construire"
      breadcrumbs={[
        { label: 'Informații Publice' },
        { label: 'Autorizații Construire' },
      ]}
      basePath="/admin/informatii-publice/autorizatii-construire"
      hideCreatedAtColumn
    />
  );
}
