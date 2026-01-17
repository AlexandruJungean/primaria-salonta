'use client';

import { DocumentEdit } from '@/components/admin';

export default function DispozitiiMolEditPage() {
  return (
    <DocumentEdit
      filterType="source_folder"
      filterValue="dispozitiile-autoritatii-executive"
      pageTitle="Registre Dispoziții (Monitorul Oficial)"
      breadcrumbs={[
        { label: 'Monitorul Oficial' },
        { label: 'Dispoziții (Registre)' },
      ]}
      basePath="/admin/monitorul-oficial/dispozitii"
    />
  );
}
