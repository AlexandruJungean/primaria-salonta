'use client';

import { DocumentList } from '@/components/admin';

export default function CertificateUrbanismPage() {
  return (
    <DocumentList
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
