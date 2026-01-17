'use client';

import { DocumentList } from '@/components/admin';

export default function HotarariMolPage() {
  return (
    <DocumentList
      filterType="source_folder"
      filterValue="hotararile-autoritatii-deliberative"
      pageTitle="Registre Hotărâri (Monitorul Oficial)"
      breadcrumbs={[
        { label: 'Monitorul Oficial' },
        { label: 'Hotărâri (Registre)' },
      ]}
      basePath="/admin/monitorul-oficial/hotarari"
    />
  );
}
