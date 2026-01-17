'use client';

import { DocumentEdit } from '@/components/admin';

export default function CertificateUrbanismEditPage() {
  return (
    <DocumentEdit
      filterType="category"
      filterValue="certificate_urbanism"
      pageTitle="Certificate de Urbanism"
      breadcrumbs={[
        { label: 'Informații Publice' },
        { label: 'Certificate Urbanism' },
      ]}
      basePath="/admin/informatii-publice/certificate-urbanism"
    />
  );
}
