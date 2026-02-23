import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/auth/verify-admin';
import { logAuditAction, getRequestInfo } from '@/lib/audit/logger';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function createAdminClient() {
  return createClient(supabaseUrl, supabaseServiceKey);
}

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

// POST - Change own password
export async function POST(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;
  const user = authResult;

  const { ipAddress, userAgent } = getRequestInfo(request);

  try {
    const { current_password, new_password, confirm_password } = await request.json();

    if (!current_password || !new_password || !confirm_password) {
      return NextResponse.json(
        { error: 'Toate câmpurile sunt obligatorii' },
        { status: 400 }
      );
    }

    if (new_password !== confirm_password) {
      return NextResponse.json(
        { error: 'Parola nouă și confirmarea nu coincid' },
        { status: 400 }
      );
    }

    if (new_password.length < PASSWORD_MIN_LENGTH) {
      return NextResponse.json(
        { error: `Parola trebuie să aibă minim ${PASSWORD_MIN_LENGTH} caractere` },
        { status: 400 }
      );
    }

    if (!PASSWORD_REGEX.test(new_password)) {
      return NextResponse.json(
        { error: 'Parola trebuie să conțină cel puțin o literă mare, o literă mică și o cifră' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data: profile } = await supabase
      .from('admin_profiles')
      .select('password_hash')
      .eq('id', user.id)
      .single();

    if (!profile?.password_hash) {
      return NextResponse.json(
        { error: 'Profilul nu a fost găsit' },
        { status: 404 }
      );
    }

    const bcrypt = await import('bcryptjs');
    const isValidPassword = await bcrypt.compare(current_password, profile.password_hash);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Parola curentă este incorectă' },
        { status: 401 }
      );
    }

    const newHash = await bcrypt.hash(new_password, 12);

    const { error: updateError } = await supabase
      .from('admin_profiles')
      .update({ password_hash: newHash, must_change_password: false })
      .eq('id', user.id);

    if (updateError) throw updateError;

    await logAuditAction({
      action: 'update',
      resourceType: 'user',
      resourceId: user.id,
      resourceTitle: user.fullName,
      details: { action: 'change_password' },
      userId: user.id,
      userEmail: user.email,
      userName: user.fullName,
      ipAddress,
      userAgent,
    });

    return NextResponse.json({ success: true, message: 'Parola a fost schimbată cu succes' });
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json({ error: 'Eroare la schimbarea parolei' }, { status: 500 });
  }
}
