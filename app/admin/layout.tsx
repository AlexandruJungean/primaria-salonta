import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin - Primăria Salonta',
  description: 'Panou de administrare pentru website-ul Primăriei Municipiului Salonta',
  robots: 'noindex, nofollow',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro">
      <body>{children}</body>
    </html>
  );
}

