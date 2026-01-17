'use client';

import { DocumentEdit } from '@/components/admin';

export default function RapoartePrimarEditPage() {
  return (
    <DocumentEdit
      filterType="source_folder"
      filterValue="rapoarte-anuale-ale-primarului"
      pageTitle="Rapoarte Anuale ale Primarului"
      breadcrumbs={[
        { label: 'Primăria', href: '/admin/primaria' },
        { label: 'Rapoarte Primar' },
      ]}
      basePath="/admin/primaria/rapoarte-primar"
    />
  );
}
