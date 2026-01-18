'use client';

import { useSearchParams } from 'next/navigation';
import { DocumentEdit } from '@/components/admin';

export default function HotarariMolEditPage() {
  const searchParams = useSearchParams();
  const defaultSubcategory = searchParams.get('subcategory') || undefined;

  return (
    <DocumentEdit
      filterType="source_folder"
      filterValue="hotararile-autoritatii-deliberative"
      pageTitle="Registre Hotărâri (Monitorul Oficial)"
      breadcrumbs={[
        { label: 'Monitorul Oficial' },
        { label: 'Hotărâri (Registre)' },
      ]}
      basePath="/admin/monitorul-oficial/hotarari"
      defaultSubcategory={defaultSubcategory}
    />
  );
}
