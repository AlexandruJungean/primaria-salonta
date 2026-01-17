'use client';

import { DocumentEdit } from '@/components/admin';

export default function ReteleTelecomEditPage() {
  return (
    <DocumentEdit
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
