'use client';

import { DocumentEdit } from '@/components/admin';

export default function DezbateriPubliceEditPage() {
  return (
    <DocumentEdit
      filterType="source_folder"
      filterValue="dezbateri-publice"
      pageTitle="Transparență - Dezbateri Publice"
      breadcrumbs={[
        { label: 'Transparență' },
        { label: 'Dezbateri Publice' },
      ]}
      basePath="/admin/transparenta/dezbateri-publice"
    />
  );
}
