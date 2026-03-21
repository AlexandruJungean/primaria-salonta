import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { checkRateLimit } from '@/lib/rate-limit';

function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: NextRequest) {
  const rateLimitResponse = await checkRateLimit(request, 'strict');
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { email, code, newPassword } = await request.json();

    if (!email || !code || !newPassword) {
      return NextResponse.json(
        { error: 'Toate câmpurile sunt obligatorii' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Parola trebuie să aibă minim 8 caractere' },
        { status: 400 }
      );
    }

    if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      return NextResponse.json(
        { error: 'Parola trebuie să conțină cel puțin o literă mare, o literă mică și o cifră' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data: profile } = await supabase
      .from('admin_profiles')
      .select('id, reset_code, reset_code_expires_at, is_active')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (!profile || !profile.is_active) {
      return NextResponse.json(
        { error: 'Cod invalid sau expirat' },
        { status: 400 }
      );
    }

    if (!profile.reset_code || !profile.reset_code_expires_at) {
      return NextResponse.json(
        { error: 'Cod invalid sau expirat' },
        { status: 400 }
      );
    }

    if (new Date(profile.reset_code_expires_at) < new Date()) {
      await supabase
        .from('admin_profiles')
        .update({ reset_code: null, reset_code_expires_at: null })
        .eq('id', profile.id);

      return NextResponse.json(
        { error: 'Codul a expirat. Solicitați un cod nou.' },
        { status: 400 }
      );
    }

    if (profile.reset_code !== code.trim()) {
      return NextResponse.json(
        { error: 'Cod invalid sau expirat' },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    const { error: updateError } = await supabase
      .from('admin_profiles')
      .update({
        password_hash: passwordHash,
        reset_code: null,
        reset_code_expires_at: null,
        must_change_password: false,
      })
      .eq('id', profile.id);

    if (updateError) {
      console.error('Failed to update password:', updateError);
      return NextResponse.json(
        { error: 'Eroare la resetarea parolei' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Parola a fost resetată cu succes. Vă puteți autentifica cu noua parolă.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Eroare la procesarea cererii' },
      { status: 500 }
    );
  }
}
