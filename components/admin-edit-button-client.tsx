'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface AdminEditButtonClientProps {
  href: string;
  label?: string;
}

export function AdminEditButtonClient({ href, label = 'Editează' }: AdminEditButtonClientProps) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch('/api/admin/auth/session', { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.user && (data.user.role === 'super_admin' || data.user.role === 'admin')) {
          setIsAdmin(true);
        }
      })
      .catch(() => {});
  }, []);

  if (!isAdmin) return null;

  return (
    <Link
      href={href}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-105 group print:hidden"
      title={label}
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
      <span className="hidden sm:inline text-sm font-medium">{label}</span>
    </Link>
  );
}
