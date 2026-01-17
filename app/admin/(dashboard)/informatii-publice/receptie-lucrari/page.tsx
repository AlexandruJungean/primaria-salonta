'use client';

import { DocumentList } from '@/components/admin';

export default function ReceptieLucrariPage() {
  return (
    <DocumentList
      filterType="category"
      filterValue="receptie_lucrari"
      pageTitle="Recepție Lucrări"
      breadcrumbs={[
        { label: 'Informații Publice' },
        { label: 'Recepție Lucrări' },
      ]}
      basePath="/admin/informatii-publice/receptie-lucrari"
    />
  );
}
