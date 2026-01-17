'use client';

import { DocumentEdit } from '@/components/admin';

export default function PublicatiiCasatorieEditPage() {
  return (
    <DocumentEdit
      filterType="category"
      filterValue="publicatii_casatorie"
      pageTitle="Publicații de Căsătorie"
      breadcrumbs={[
        { label: 'Informații Publice' },
        { label: 'Publicații Căsătorie' },
      ]}
      basePath="/admin/informatii-publice/publicatii-casatorie"
    />
  );
}
