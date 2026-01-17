'use client';

import { DocumentList } from '@/components/admin';

export default function SeipPage() {
  return (
    <DocumentList
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
