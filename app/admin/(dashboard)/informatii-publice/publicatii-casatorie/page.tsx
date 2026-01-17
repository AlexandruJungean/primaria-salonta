'use client';

import { DocumentList } from '@/components/admin';

export default function PublicatiiCasatoriePage() {
  return (
    <DocumentList
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
