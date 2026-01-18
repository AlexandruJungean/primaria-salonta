'use client';

import { useSearchParams } from 'next/navigation';
import { DocumentEdit } from '@/components/admin';

export default function AlteDocumenteEditPage() {
  const searchParams = useSearchParams();
  const sourceFolder = searchParams.get('source_folder') || 'alte-documente';
  const defaultSubcategory = searchParams.get('subcategory') || undefined;

  // Determine page title based on source folder
  const getPageTitle = () => {
    if (sourceFolder === 'minute-sedinte-consiliu') return 'Minute Ședințe Consiliu';
    if (sourceFolder === 'arhiva-validare-mandate-2020-2024') return 'Arhivă Validare Mandate 2020-2024';
    return 'Alte Documente';
  };

  return (
    <DocumentEdit
      filterType="source_folder"
      filterValue={sourceFolder}
      pageTitle={getPageTitle()}
      breadcrumbs={[
        { label: 'Monitorul Oficial' },
        { label: 'Alte Documente' },
      ]}
      basePath="/admin/monitorul-oficial/alte-documente"
      defaultSubcategory={defaultSubcategory}
    />
  );
}
