'use client';

import { DocumentList } from '@/components/admin';

export default function HotarariRepublicatePage() {
  return (
    <DocumentList
      filterType="source_folder"
      filterValue="hotarari-republicate"
      pageTitle="Hotărâri Republicate"
      breadcrumbs={[
        { label: 'Consiliul Local', href: '/admin/consiliul-local' },
        { label: 'Hotărâri Republicate' },
      ]}
      basePath="/admin/consiliul-local/hotarari-republicate"
    />
  );
}
