import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { signJWT, createSessionCookie } from '@/lib/auth/jwt';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email-ul și parola sunt obligatorii' },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { data: profile, error: profileError } = await supabase
      .from('admin_profiles')
      .select('id, email, password_hash, full_name, role, department, is_active, must_change_password')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'Email sau parolă incorectă' },
        { status: 401 }
      );
    }

    if (!profile.is_active) {
      return NextResponse.json(
        { error: 'Contul dumneavoastră a fost dezactivat' },
        { status: 403 }
      );
    }

    if (!profile.password_hash) {
      return NextResponse.json(
        { error: 'Contul nu are o parolă setată. Contactați un super admin pentru resetare.' },
        { status: 401 }
      );
    }

    const isValidPassword = await bcrypt.compare(password, profile.password_hash);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Email sau parolă incorectă' },
        { status: 401 }
      );
    }

    await supabase
      .from('admin_profiles')
      .update({ last_login: new Date().toISOString() })
      .eq('id', profile.id);

    const token = signJWT({
      sub: profile.id,
      email: profile.email,
      role: profile.role,
    });

    const response = NextResponse.json({
      user: {
        id: profile.id,
        email: profile.email,
        fullName: profile.full_name,
        role: profile.role,
        department: profile.department,
        isActive: profile.is_active,
        mustChangePassword: profile.must_change_password || false,
      },
    });

    response.headers.set('Set-Cookie', createSessionCookie(token));
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Eroare la autentificare' },
      { status: 500 }
    );
  }
}
