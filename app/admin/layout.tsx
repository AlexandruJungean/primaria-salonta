import type { Metadata } from 'next';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'Panou Admin - Primăria Salonta',
  description: 'Panou de administrare pentru website-ul Primăriei Municipiului Salonta',
  robots: 'noindex, nofollow',
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro">
      <body className="bg-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
