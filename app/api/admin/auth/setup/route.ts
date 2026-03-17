import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

/**
 * One-time setup endpoint: sets password for an existing admin account.
 * Only works when the target account has no password_hash yet.
 * Handles migration from Supabase Auth where email may not be in admin_profiles.
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email-ul și parola sunt obligatorii' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Parola trebuie să aibă minim 8 caractere' },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const normalizedEmail = email.toLowerCase().trim();

    // Try finding by email in admin_profiles first
    let profile = null;
    const { data: directMatch } = await supabase
      .from('admin_profiles')
      .select('id, email, password_hash, full_name, role')
      .eq('email', normalizedEmail)
      .single();

    if (directMatch) {
      profile = directMatch;
    } else {
      // Fallback: look up in Supabase auth.users to find the user ID,
      // then match to admin_profiles (for accounts created before email was stored in admin_profiles)
      const { data: authUsers } = await supabase.auth.admin.listUsers();
      const authUser = authUsers?.users?.find(
        u => u.email?.toLowerCase() === normalizedEmail
      );

      if (authUser) {
        const { data: profileById } = await supabase
          .from('admin_profiles')
          .select('id, email, password_hash, full_name, role')
          .eq('id', authUser.id)
          .single();

        if (profileById) {
          profile = profileById;

          // Also set the email in admin_profiles for future use
          await supabase
            .from('admin_profiles')
            .update({ email: normalizedEmail })
            .eq('id', profileById.id);
        }
      }
    }

    if (!profile) {
      return NextResponse.json(
        { error: 'Contul nu a fost găsit. Verificați adresa de email.' },
        { status: 404 }
      );
    }

    if (profile.password_hash) {
      return NextResponse.json(
        { error: 'Contul are deja o parolă setată. Folosiți funcția de schimbare parolă.' },
        { status: 400 }
      );
    }

    const password_hash = await bcrypt.hash(password, 12);

    const { error: updateError } = await supabase
      .from('admin_profiles')
      .update({ password_hash, must_change_password: false })
      .eq('id', profile.id);

    if (updateError) throw updateError;

    return NextResponse.json({
      success: true,
      message: `Parola a fost setată pentru ${profile.full_name} (${normalizedEmail}). Puteți acum face login.`,
    });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json(
      { error: 'Eroare la configurare' },
      { status: 500 }
    );
  }
}
