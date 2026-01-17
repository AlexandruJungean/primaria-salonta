'use client';

import { DocumentEdit } from '@/components/admin';

export default function OrganigramaEditPage() {
  return (
    <DocumentEdit
      filterType="source_folder"
      filterValue="organigrama"
      pageTitle="Organigrama"
      breadcrumbs={[
        { label: 'Primăria', href: '/admin/primaria' },
        { label: 'Organigrama' },
      ]}
      basePath="/admin/primaria/organigrama"
    />
  );
}
