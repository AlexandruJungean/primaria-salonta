'use client';

import { DocumentEdit } from '@/components/admin';

export default function SeipEditPage() {
  return (
    <DocumentEdit
      filterType="category"
      filterValue="seip"
      pageTitle="SEIP"
      breadcrumbs={[
        { label: 'Informații Publice' },
        { label: 'SEIP' },
      ]}
      basePath="/admin/informatii-publice/seip"
    />
  );
}
