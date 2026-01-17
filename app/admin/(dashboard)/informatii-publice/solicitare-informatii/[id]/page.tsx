'use client';

import { DocumentEdit } from '@/components/admin';

export default function SolicitareInformatiiEditPage() {
  return (
    <DocumentEdit
      filterType="category"
      filterValue="solicitare_informatii"
      pageTitle="Solicitare Informații"
      breadcrumbs={[
        { label: 'Informații Publice' },
        { label: 'Solicitare Informații' },
      ]}
      basePath="/admin/informatii-publice/solicitare-informatii"
    />
  );
}
