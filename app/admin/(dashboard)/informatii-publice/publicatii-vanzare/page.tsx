'use client';

import { DocumentList } from '@/components/admin';

export default function PublicatiiVanzarePage() {
  return (
    <DocumentList
      filterType="category"
      filterValue="publicatii_vanzare"
      pageTitle="Publicații de Vânzare"
      breadcrumbs={[
        { label: 'Informații Publice' },
        { label: 'Publicații Vânzare' },
      ]}
      basePath="/admin/informatii-publice/publicatii-vanzare"
      hideCreatedAtColumn
    />
  );
}
