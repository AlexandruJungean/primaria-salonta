import { cookies } from 'next/headers';
import Link from 'next/link';
import { verifyJWT } from '@/lib/auth/jwt';

interface AdminEditButtonProps {
  href: string;
  label?: string;
}

export async function AdminEditButton({ href, label = 'Editează' }: AdminEditButtonProps) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin-session')?.value;

  if (!token) return null;

  const payload = verifyJWT(token);
  if (!payload) return null;

  const role = payload.role;
  if (role !== 'super_admin' && role !== 'admin') return null;

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
