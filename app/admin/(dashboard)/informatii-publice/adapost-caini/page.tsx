'use client';

import { DocumentList } from '@/components/admin';

export default function AdapostCainiPage() {
  return (
    <DocumentList
      filterType="category"
      filterValue="adapost_caini"
      pageTitle="Adăpost Câini"
      breadcrumbs={[
        { label: 'Informații Publice' },
        { label: 'Adăpost Câini' },
      ]}
      basePath="/admin/informatii-publice/adapost-caini"
      hideCreatedAtColumn
    />
  );
}
