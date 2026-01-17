'use client';

import { DocumentEdit } from '@/components/admin';

export default function AutorizatiiConstruireEditPage() {
  return (
    <DocumentEdit
      filterType="category"
      filterValue="autorizatii_construire"
      pageTitle="Autorizații de Construire"
      breadcrumbs={[
        { label: 'Informații Publice' },
        { label: 'Autorizații Construire' },
      ]}
      basePath="/admin/informatii-publice/autorizatii-construire"
    />
  );
}
