import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyJWT, getTokenFromRequest } from './jwt';

export interface AdminUser {
  id: string;
  email: string;
  role: 'super_admin' | 'admin' | 'editor';
  fullName: string;
  department: string | null;
  isActive: boolean;
}

export interface VerifyAdminResult {
  success: boolean;
  user?: AdminUser;
  error?: string;
}

export async function verifyAdmin(request: NextRequest): Promise<VerifyAdminResult> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return { success: false, error: 'Server configuration error' };
    }

    const token = getTokenFromRequest(request);

    if (!token) {
      return { success: false, error: 'Nu ești autentificat' };
    }

    const payload = verifyJWT(token);
    if (!payload) {
      return { success: false, error: 'Sesiune invalidă sau expirată' };
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { data: profile, error: profileError } = await supabase
      .from('admin_profiles')
      .select('full_name, role, department, is_active')
      .eq('id', payload.sub)
      .single();

    if (profileError || !profile) {
      return { success: false, error: 'Nu ai permisiuni de administrator' };
    }

    if (!profile.is_active) {
      return { success: false, error: 'Contul a fost dezactivat' };
    }

    return {
      success: true,
      user: {
        id: payload.sub,
        email: payload.email,
        role: profile.role as AdminUser['role'],
        fullName: profile.full_name,
        department: profile.department,
        isActive: profile.is_active,
      },
    };
  } catch (error) {
    console.error('Error verifying admin:', error);
    return { success: false, error: 'Eroare la verificarea autentificării' };
  }
}

export async function requireAdmin(request: NextRequest): Promise<NextResponse | AdminUser> {
  const result = await verifyAdmin(request);

  if (!result.success || !result.user) {
    return NextResponse.json(
      { error: result.error || 'Neautorizat' },
      { status: 401 }
    );
  }

  return result.user;
}

export function hasRole(user: AdminUser, allowedRoles: Array<'super_admin' | 'admin' | 'editor'>): boolean {
  if (user.role === 'super_admin') return true;
  return allowedRoles.includes(user.role);
}

export async function requireRole(
  request: NextRequest,
  allowedRoles: Array<'super_admin' | 'admin' | 'editor'>
): Promise<NextResponse | AdminUser> {
  const result = await requireAdmin(request);

  if (result instanceof NextResponse) {
    return result;
  }

  if (!hasRole(result, allowedRoles)) {
    return NextResponse.json(
      { error: 'Nu ai permisiunile necesare pentru această acțiune' },
      { status: 403 }
    );
  }

  return result;
}
