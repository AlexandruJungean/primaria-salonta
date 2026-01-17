'use client';

import { DocumentList } from '@/components/admin';

export default function ReteleTelecomPage() {
  return (
    <DocumentList
      filterType="category"
      filterValue="retele_telecom"
      pageTitle="Rețele Telecom"
      breadcrumbs={[
        { label: 'Informații Publice' },
        { label: 'Rețele Telecom' },
      ]}
      basePath="/admin/informatii-publice/retele-telecom"
    />
  );
}
