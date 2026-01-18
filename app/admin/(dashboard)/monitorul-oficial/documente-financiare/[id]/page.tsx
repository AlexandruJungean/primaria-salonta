'use client';

import { useSearchParams } from 'next/navigation';
import { DocumentEdit } from '@/components/admin';

export default function DocumenteFinanciareEditPage() {
  const searchParams = useSearchParams();
  const defaultSubcategory = searchParams.get('subcategory') || undefined;

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
      defaultSubcategory={defaultSubcategory}
    />
  );
}
