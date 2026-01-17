'use client';

import { DocumentList } from '@/components/admin';

export default function RegulamentPage() {
  return (
    <DocumentList
      filterType="source_folder"
      filterValue="regulament-de-organizare-si-functionare"
      pageTitle="Regulament de Organizare și Funcționare"
      breadcrumbs={[
        { label: 'Primăria', href: '/admin/primaria' },
        { label: 'Regulament ROF' },
      ]}
      basePath="/admin/primaria/regulament"
      hideYearColumn
      hideYearFilter
    />
  );
}
