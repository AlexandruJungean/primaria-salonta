'use client';

import { DocumentEdit } from '@/components/admin';

export default function AdapostCainiEditPage() {
  return (
    <DocumentEdit
      filterType="category"
      filterValue="adapost_caini"
      pageTitle="Adăpost Câini"
      breadcrumbs={[
        { label: 'Informații Publice' },
        { label: 'Adăpost Câini' },
      ]}
      basePath="/admin/informatii-publice/adapost-caini"
    />
  );
}
