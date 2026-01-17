'use client';

import { DocumentEdit } from '@/components/admin';

export default function GdprEditPage() {
  return (
    <DocumentEdit
      filterType="category"
      filterValue="gdpr"
      pageTitle="GDPR"
      breadcrumbs={[
        { label: 'Informații Publice' },
        { label: 'GDPR' },
      ]}
      basePath="/admin/informatii-publice/gdpr"
    />
  );
}
