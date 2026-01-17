import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  fullName: string;
  department: string | null;
  isActive: boolean;
}

export interface VerifyAdminResult {
  success: boolean;
  user?: AdminUser;
  error?: string;
}

/**
 * Verifică dacă request-ul vine de la un admin autentificat
 * Folosește cookie-urile Supabase pentru a verifica sesiunea
 */
export async function verifyAdmin(request: NextRequest): Promise<VerifyAdminResult> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey) {
      return { success: false, error: 'Server configuration error' };
    }

    // Extrage token-ul din cookie-uri
    const cookies = request.cookies;
    const accessToken = cookies.get('sb-access-token')?.value || 
                        cookies.get(`sb-${supabaseUrl.split('//')[1].split('.')[0]}-auth-token`)?.value;

    // Încearcă să obțină token-ul din header Authorization
    const authHeader = request.headers.get('Authorization');
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    // Caută în toate cookie-urile pentru token Supabase
    let authToken: string | null = null;
    
    // Supabase stochează sesiunea într-un cookie cu format specific
    const allCookies = cookies.getAll();
    for (const cookie of allCookies) {
      if (cookie.name.includes('auth-token') && cookie.value) {
        try {
          // Cookie-ul poate fi JSON encoded
          const parsed = JSON.parse(cookie.value);
          if (parsed.access_token) {
            authToken = parsed.access_token;
            break;
          }
        } catch {
          // Nu e JSON, poate e direct token-ul
          if (cookie.value.length > 50) {
            authToken = cookie.value;
            break;
          }
        }
      }
    }

    const token = bearerToken || accessToken || authToken;

    if (!token) {
      return { success: false, error: 'Nu ești autentificat' };
    }

    // Creează client cu token-ul utilizatorului pentru a verifica sesiunea
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    // Verifică utilizatorul
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return { success: false, error: 'Sesiune invalidă sau expirată' };
    }

    // Verifică dacă e admin în admin_profiles (folosește service role pentru acces complet)
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
    
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('admin_profiles')
      .select('full_name, role, department, is_active')
      .eq('id', user.id)
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
        id: user.id,
        email: user.email || '',
        role: profile.role as 'admin' | 'editor' | 'viewer',
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

/**
 * Middleware helper pentru API routes
 * Returnează response de eroare dacă nu e autentificat
 */
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

/**
 * Verifică dacă utilizatorul are un anumit rol
 */
export function hasRole(user: AdminUser, allowedRoles: Array<'admin' | 'editor' | 'viewer'>): boolean {
  return allowedRoles.includes(user.role);
}

/**
 * Middleware helper cu verificare de rol
 */
export async function requireRole(
  request: NextRequest,
  allowedRoles: Array<'admin' | 'editor' | 'viewer'>
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
