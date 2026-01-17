'use client';

import { DocumentEdit } from '@/components/admin';

export default function RegulamentEditPage() {
  return (
    <DocumentEdit
      filterType="source_folder"
      filterValue="regulament-de-organizare-si-functionare"
      pageTitle="Regulament de Organizare și Funcționare"
      breadcrumbs={[
        { label: 'Primăria', href: '/admin/primaria' },
        { label: 'Regulament ROF' },
      ]}
      basePath="/admin/primaria/regulament"
    />
  );
}
