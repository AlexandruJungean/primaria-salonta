'use client';

import { DocumentList } from '@/components/admin';

export default function GdprPage() {
  return (
    <DocumentList
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
