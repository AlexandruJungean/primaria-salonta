'use client';

import { DocumentEdit } from '@/components/admin';

export default function SomatiiEditPage() {
  return (
    <DocumentEdit
      filterType="category"
      filterValue="somatii"
      pageTitle="Somații"
      breadcrumbs={[
        { label: 'Informații Publice' },
        { label: 'Somații' },
      ]}
      basePath="/admin/informatii-publice/somatii"
    />
  );
}
