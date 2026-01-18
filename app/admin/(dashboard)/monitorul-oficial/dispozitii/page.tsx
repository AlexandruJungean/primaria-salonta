'use client';

import { DocumentList } from '@/components/admin';

export default function DispozitiiMolPage() {
  return (
    <DocumentList
      filterType="source_folder"
      filterValue="dispozitiile-autoritatii-executive"
      pageTitle="Registre Dispoziții (Monitorul Oficial)"
      breadcrumbs={[
        { label: 'Monitorul Oficial' },
        { label: 'Dispoziții (Registre)' },
      ]}
      basePath="/admin/monitorul-oficial/dispozitii"
      hideCreatedAtColumn
    />
  );
}
