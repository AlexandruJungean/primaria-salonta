'use client';

import { DocumentList } from '@/components/admin';

export default function DezbateriPublicePage() {
  return (
    <DocumentList
      filterType="source_folder"
      filterValue="dezbateri-publice"
      pageTitle="Transparență - Dezbateri Publice"
      breadcrumbs={[
        { label: 'Transparență' },
        { label: 'Dezbateri Publice' },
      ]}
      basePath="/admin/transparenta/dezbateri-publice"
      hideCreatedAtColumn
    />
  );
}
