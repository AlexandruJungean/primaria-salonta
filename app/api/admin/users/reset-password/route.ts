import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireRole } from '@/lib/auth/verify-admin';
import { logAuditAction, getRequestInfo } from '@/lib/audit/logger';
import crypto from 'crypto';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function createAdminClient() {
  return createClient(supabaseUrl, supabaseServiceKey);
}

function generateTemporaryPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  const bytes = crypto.randomBytes(12);
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars[bytes[i] % chars.length];
  }
  return password;
}

const ROLE_HIERARCHY: Record<string, number> = {
  super_admin: 4,
  admin: 3,
  editor: 2,
  viewer: 1,
};

// POST - Reset another user's password (admin only)
export async function POST(request: NextRequest) {
  const authResult = await requireRole(request, ['admin']);
  if (authResult instanceof NextResponse) return authResult;
  const actor = authResult;

  const { ipAddress, userAgent } = getRequestInfo(request);

  try {
    const { user_id } = await request.json();

    if (!user_id) {
      return NextResponse.json({ error: 'ID-ul utilizatorului este obligatoriu' }, { status: 400 });
    }

    if (user_id === actor.id) {
      return NextResponse.json(
        { error: 'Folosește funcția de schimbare parolă pentru propriul cont' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data: targetUser } = await supabase
      .from('admin_profiles')
      .select('id, role, full_name, email')
      .eq('id', user_id)
      .single();

    if (!targetUser) {
      return NextResponse.json({ error: 'Utilizatorul nu a fost găsit' }, { status: 404 });
    }

    const actorLevel = ROLE_HIERARCHY[actor.role] || 0;
    const targetLevel = ROLE_HIERARCHY[targetUser.role] || 0;

    if (actorLevel <= targetLevel && actor.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Nu ai permisiunea de a reseta parola acestui utilizator' },
        { status: 403 }
      );
    }

    const temporaryPassword = generateTemporaryPassword();

    const bcrypt = await import('bcryptjs');
    const password_hash = await bcrypt.hash(temporaryPassword, 12);

    const { error: updateError } = await supabase
      .from('admin_profiles')
      .update({ password_hash, must_change_password: true })
      .eq('id', user_id);

    if (updateError) throw updateError;

    await logAuditAction({
      action: 'update',
      resourceType: 'user',
      resourceId: targetUser.id,
      resourceTitle: targetUser.full_name,
      details: { action: 'reset_password', target_email: targetUser.email },
      userId: actor.id,
      userEmail: actor.email,
      userName: actor.fullName,
      ipAddress,
      userAgent,
    });

    return NextResponse.json({
      success: true,
      temporary_password: temporaryPassword,
      message: `Parola temporară pentru ${targetUser.full_name} a fost generată. Comunicați-o utilizatorului.`,
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json({ error: 'Eroare la resetarea parolei' }, { status: 500 });
  }
}
