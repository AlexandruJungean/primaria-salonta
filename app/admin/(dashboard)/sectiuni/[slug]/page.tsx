'use client';

import { useParams } from 'next/navigation';
import { NavSectionAdminPage } from '@/components/admin/nav-section-admin-page';

export default function CustomSectionAdminPage() {
  const params = useParams();
  const slug = params.slug as string;

  return <NavSectionAdminPage sectionSlug={slug} breadcrumbLabel={slug} />;
}
