'use client';

import { DocumentEdit } from '@/components/admin';

export default function TaxeImpoziteEditPage() {
  return (
    <DocumentEdit
      filterType="category"
      filterValue="taxe_impozite"
      pageTitle="Taxe și Impozite"
      breadcrumbs={[
        { label: 'Informații Publice' },
        { label: 'Taxe și Impozite' },
      ]}
      basePath="/admin/informatii-publice/taxe-impozite"
    />
  );
}
