'use client';

import { DocumentEdit } from '@/components/admin';

export default function PublicatiiVanzareEditPage() {
  return (
    <DocumentEdit
      filterType="category"
      filterValue="publicatii_vanzare"
      pageTitle="Publicații de Vânzare"
      breadcrumbs={[
        { label: 'Informații Publice' },
        { label: 'Publicații Vânzare' },
      ]}
      basePath="/admin/informatii-publice/publicatii-vanzare"
    />
  );
}
