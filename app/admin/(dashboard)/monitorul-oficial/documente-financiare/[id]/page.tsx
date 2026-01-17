'use client';

import { DocumentEdit } from '@/components/admin';

export default function DocumenteFinanciareEditPage() {
  return (
    <DocumentEdit
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
