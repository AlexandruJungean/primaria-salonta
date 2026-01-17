'use client';

import { DocumentList } from '@/components/admin';

export default function SolicitareInformatiiPage() {
  return (
    <DocumentList
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
