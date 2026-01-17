'use client';

import { DocumentEdit } from '@/components/admin';

export default function HotarariRepublicateEditPage() {
  return (
    <DocumentEdit
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
