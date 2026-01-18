'use client';

import { useSearchParams } from 'next/navigation';
import { DocumentEdit } from '@/components/admin';

export default function AchizitiiEditPage() {
  const searchParams = useSearchParams();
  const defaultSubcategory = searchParams.get('subcategory') || undefined;

  return (
    <DocumentEdit
      filterType="category"
      filterValue="achizitii"
      pageTitle="Achiziții Publice"
      breadcrumbs={[
        { label: 'Informații Publice' },
        { label: 'Achiziții Publice' },
      ]}
      basePath="/admin/informatii-publice/achizitii"
      defaultSubcategory={defaultSubcategory}
    />
  );
}
