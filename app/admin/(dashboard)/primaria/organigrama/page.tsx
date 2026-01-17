'use client';

import { DocumentList } from '@/components/admin';

export default function OrganigramaPage() {
  return (
    <DocumentList
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
