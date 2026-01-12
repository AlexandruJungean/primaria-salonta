'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, type AdminProfile } from '@/lib/supabase/client';

interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'editor' | 'viewer';
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

      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        router.push('/admin/login');
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('id', authUser.id)
        .single<AdminProfile>();

      if (profileError || !profile) {
        await supabase.auth.signOut();
        router.push('/admin/login');
        return;
      }

      if (!profile.is_active) {
        await supabase.auth.signOut();
        setError('Contul dumneavoastră a fost dezactivat.');
        router.push('/admin/login');
        return;
      }

      setUser({
        id: authUser.id,
        email: authUser.email || '',
        fullName: profile.full_name,
        role: profile.role as 'admin' | 'editor' | 'viewer',
        department: profile.department || null,
        isActive: profile.is_active,
      });
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

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        router.push('/admin/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [checkAuth, router]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/admin/login');
  }, [router]);

  return {
    user,
    loading,
    error,
    logout,
    isAdmin: user?.role === 'admin',
    isEditor: user?.role === 'editor',
    canEdit: user?.role === 'admin' || user?.role === 'editor',
  };
}
