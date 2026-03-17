import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyJWT, getTokenFromRequest } from '@/lib/auth/jwt';

export async function GET(request: NextRequest) {
  const token = getTokenFromRequest(request);

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const payload = verifyJWT(token);
  if (!payload) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const { data: profile, error } = await supabase
    .from('admin_profiles')
    .select('id, email, full_name, role, department, is_active, must_change_password')
    .eq('id', payload.sub)
    .single();

  if (error || !profile || !profile.is_active) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({
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
}
