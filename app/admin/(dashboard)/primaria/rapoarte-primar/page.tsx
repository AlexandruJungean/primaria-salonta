'use client';

import { DocumentList } from '@/components/admin';

export default function RapoartePrimarPage() {
  return (
    <DocumentList
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
