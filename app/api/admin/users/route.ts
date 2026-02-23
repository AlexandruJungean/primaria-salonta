import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireRole } from '@/lib/auth/verify-admin';
import { logAuditAction, getRequestInfo } from '@/lib/audit/logger';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function createAdminClient() {
  return createClient(supabaseUrl, supabaseServiceKey);
}

const ROLE_HIERARCHY: Record<string, number> = {
  super_admin: 4,
  admin: 3,
  editor: 2,
  viewer: 1,
};

function canManageRole(actorRole: string, targetRole: string): boolean {
  return (ROLE_HIERARCHY[actorRole] || 0) > (ROLE_HIERARCHY[targetRole] || 0);
}

// GET - List all admin users (excluding password_hash)
export async function GET(request: NextRequest) {
  const authResult = await requireRole(request, ['admin']);
  if (authResult instanceof NextResponse) return authResult;

  const supabase = createAdminClient();

  try {
    const { data, error } = await supabase
      .from('admin_profiles')
      .select('id, email, full_name, role, department, phone, avatar_url, is_active, last_login, created_at, updated_at')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Eroare la încărcarea utilizatorilor' }, { status: 500 });
  }
}

// POST - Create new admin user
export async function POST(request: NextRequest) {
  const authResult = await requireRole(request, ['admin']);
  if (authResult instanceof NextResponse) return authResult;
  const actor = authResult;

  const supabase = createAdminClient();
  const { ipAddress, userAgent } = getRequestInfo(request);

  try {
    const body = await request.json();
    const { email, password, full_name, role, department, phone } = body;

    if (!email || !password || !full_name || !role) {
      return NextResponse.json(
        { error: 'Email, parolă, nume complet și rol sunt obligatorii' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Parola trebuie să aibă minim 8 caractere' },
        { status: 400 }
      );
    }

    if (!canManageRole(actor.role, role) && actor.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Nu ai permisiunea de a crea un utilizator cu acest rol' },
        { status: 403 }
      );
    }

    const { data: existing } = await supabase
      .from('admin_profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Există deja un utilizator cu acest email' },
        { status: 409 }
      );
    }

    // Hash password with bcrypt (will be replaced with bcryptjs in cPanel migration)
    const bcrypt = await import('bcryptjs');
    const password_hash = await bcrypt.hash(password, 12);

    const { data, error } = await supabase
      .from('admin_profiles')
      .insert([{
        email,
        password_hash,
        must_change_password: true,
        full_name,
        role,
        department: department || null,
        phone: phone || null,
        is_active: true,
      }])
      .select('id, email, full_name, role, department, phone, is_active, created_at')
      .single();

    if (error) throw error;

    await logAuditAction({
      action: 'create',
      resourceType: 'user',
      resourceId: data.id,
      resourceTitle: data.full_name,
      details: { email: data.email, role: data.role },
      userId: actor.id,
      userEmail: actor.email,
      userName: actor.fullName,
      ipAddress,
      userAgent,
    });

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Eroare la crearea utilizatorului' }, { status: 500 });
  }
}

// PATCH - Update admin user
export async function PATCH(request: NextRequest) {
  const authResult = await requireRole(request, ['admin']);
  if (authResult instanceof NextResponse) return authResult;
  const actor = authResult;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID-ul utilizatorului este obligatoriu' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { ipAddress, userAgent } = getRequestInfo(request);

  try {
    const body = await request.json();

    const { data: targetUser } = await supabase
      .from('admin_profiles')
      .select('id, role, full_name, email')
      .eq('id', id)
      .single();

    if (!targetUser) {
      return NextResponse.json({ error: 'Utilizatorul nu a fost găsit' }, { status: 404 });
    }

    if (!canManageRole(actor.role, targetUser.role) && actor.role !== 'super_admin' && actor.id !== id) {
      return NextResponse.json(
        { error: 'Nu ai permisiunea de a modifica acest utilizator' },
        { status: 403 }
      );
    }

    if (body.role && !canManageRole(actor.role, body.role) && actor.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Nu ai permisiunea de a seta acest rol' },
        { status: 403 }
      );
    }

    if (body.is_active === false && actor.id === id) {
      return NextResponse.json(
        { error: 'Nu te poți dezactiva pe tine însuți' },
        { status: 400 }
      );
    }

    const { password_hash: _ph, must_change_password: _mcp, ...safeBody } = body;

    const { data, error } = await supabase
      .from('admin_profiles')
      .update(safeBody)
      .eq('id', id)
      .select('id, email, full_name, role, department, phone, is_active, updated_at')
      .single();

    if (error) throw error;

    await logAuditAction({
      action: 'update',
      resourceType: 'user',
      resourceId: data.id,
      resourceTitle: data.full_name,
      details: { updatedFields: Object.keys(safeBody) },
      userId: actor.id,
      userEmail: actor.email,
      userName: actor.fullName,
      ipAddress,
      userAgent,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Eroare la actualizarea utilizatorului' }, { status: 500 });
  }
}
