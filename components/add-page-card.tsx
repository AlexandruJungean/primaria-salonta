import { cookies } from 'next/headers';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { verifyJWT } from '@/lib/auth/jwt';
import { Card, CardContent } from '@/components/ui/card';

interface AddPageCardProps {
  adminHref: string;
  variant?: 'centered' | 'inline';
}

export async function AddPageCard({ adminHref, variant = 'inline' }: AddPageCardProps) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin-session')?.value;

  if (!token) return null;

  const payload = verifyJWT(token);
  if (!payload) return null;

  const role = payload.role;
  if (role !== 'super_admin' && role !== 'admin') return null;

  if (variant === 'centered') {
    return (
      <Link href={adminHref}>
        <Card hover className="h-full border-dashed border-2 border-gray-300 hover:border-primary-400 transition-colors">
          <CardContent className="flex flex-col items-center text-center gap-4 pt-6">
            <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
              <Plus className="w-7 h-7 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-400">Adaugă pagină</h3>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={adminHref}>
      <Card hover className="h-full border-dashed border-2 border-gray-300 hover:border-primary-400 transition-colors">
        <CardContent className="flex items-center gap-4 pt-6">
          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
            <Plus className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="font-semibold text-gray-400">Adaugă pagină</h3>
        </CardContent>
      </Card>
    </Link>
  );
}
