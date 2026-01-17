'use client';

import { DocumentEdit } from '@/components/admin';

export default function ReceptieLucrariEditPage() {
  return (
    <DocumentEdit
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
