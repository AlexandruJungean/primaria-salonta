'use client';

import { DocumentList } from '@/components/admin';

export default function SomatiiPage() {
  return (
    <DocumentList
      filterType="category"
      filterValue="somatii"
      pageTitle="Somații"
      breadcrumbs={[
        { label: 'Informații Publice' },
        { label: 'Somații' },
      ]}
      basePath="/admin/informatii-publice/somatii"
      hideCreatedAtColumn
    />
  );
}
