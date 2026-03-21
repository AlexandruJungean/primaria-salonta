'use client';

import { StructuredPageEditor } from '@/components/admin/structured-page-editor';

export default function AdminPlatiPage() {
  return (
    <StructuredPageEditor
      pageSlug="servicii-online-plati"
      title="Plăți Online"
      description="Gestionează link-urile de plată online (ghiseul.ro, impozite, amenzi)"
      breadcrumbs={[
        { label: 'Servicii Online', href: '/admin/servicii-online' },
        { label: 'Plăți Online' },
      ]}
      dataKey="paymentLinks"
      fields={[
        { key: 'id', label: 'ID unic', type: 'text', required: true, placeholder: 'ex: ghiseul' },
        { key: 'url', label: 'URL platforma', type: 'url', required: true, placeholder: 'https://...' },
        { key: 'icon', label: 'Icon', type: 'text', placeholder: 'creditCard / receipt / fileWarning' },
      ]}
      itemLabel="link de plată"
    />
  );
}
