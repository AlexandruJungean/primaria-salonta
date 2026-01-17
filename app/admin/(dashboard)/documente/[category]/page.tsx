'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

const CATEGORY_LABELS: Record<string, string> = {
  buget: 'Buget',
  dispozitii: 'Dispoziții',
  regulamente: 'Regulamente',
  licitatii: 'Licitații',
  achizitii: 'Achiziții Publice',
  formulare: 'Formulare',
  autorizatii: 'Autorizații Construire',
  altele: 'Alte Documente',
};

/**
 * This page redirects to the new document management structure.
 * Kept for backward compatibility with existing bookmarks/links.
 */
export default function DocumenteCategoryRedirectPage() {
  const router = useRouter();
  const params = useParams();
  const category = params.category as string;

  useEffect(() => {
    const label = CATEGORY_LABELS[category] || category;
    const url = `/admin/documente/gestiune?type=category&value=${encodeURIComponent(category)}&label=${encodeURIComponent(label)}`;
    router.replace(url);
  }, [category, router]);

  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-slate-600">Se redirecționează...</p>
      </div>
    </div>
  );
}
