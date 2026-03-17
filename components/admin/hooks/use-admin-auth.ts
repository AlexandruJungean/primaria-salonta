'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: 'super_admin' | 'admin' | 'editor';
  department: string | null;
  isActive: boolean;
}

interface UseAdminAuthResult {
  user: AdminUser | null;
  loading: boolean;
  error: string | null;
  logout: () => Promise<void>;
  isAdmin: boolean;
  isEditor: boolean;
  canEdit: boolean;
}

export function useAdminAuth(): UseAdminAuthResult {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/admin/auth/session', {
        credentials: 'include',
      });

      if (!response.ok) {
        router.push('/admin/login');
        return;
      }

      const data = await response.json();

      if (!data.user) {
        router.push('/admin/login');
        return;
      }

      setUser(data.user);
    } catch (err) {
      console.error('Auth error:', err);
      setError('Eroare la verificarea autentificării.');
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/admin/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // logout failure is non-critical, we redirect anyway
    }
    setUser(null);
    router.push('/admin/login');
  }, [router]);

  return {
    user,
    loading,
    error,
    logout,
    isAdmin: user?.role === 'super_admin' || user?.role === 'admin',
    isEditor: user?.role === 'editor',
    canEdit: user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'editor',
  };
}
