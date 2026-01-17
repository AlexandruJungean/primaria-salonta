'use client';

import { DocumentList } from '@/components/admin';

export default function DocumenteFinanciarePage() {
  return (
    <DocumentList
      filterType="source_folder"
      filterValue="documente-si-informatii-financiare"
      pageTitle="Documente și Informații Financiare"
      breadcrumbs={[
        { label: 'Monitorul Oficial' },
        { label: 'Documente Financiare' },
      ]}
      basePath="/admin/monitorul-oficial/documente-financiare"
    />
  );
}
