'use client';

import { DocumentList } from '@/components/admin';

export default function TaxeImpozitePage() {
  return (
    <DocumentList
      filterType="category"
      filterValue="taxe_impozite"
      pageTitle="Taxe și Impozite"
      breadcrumbs={[
        { label: 'Informații Publice' },
        { label: 'Taxe și Impozite' },
      ]}
      basePath="/admin/informatii-publice/taxe-impozite"
      hideCreatedAtColumn
    />
  );
}
