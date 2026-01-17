import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { logAuditAction, getRequestInfo } from '@/lib/audit/logger';
import { requireAdmin } from '@/lib/auth/verify-admin';
import { invalidateSettingsCache } from '@/lib/supabase/services/settings';

// Create admin client with service role key to bypass RLS
function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export interface SiteSettings {
  // Contact
  phones: string[];
  fax: string;
  emails: string[];
  working_hours: string;

  // Social Media
  facebook_url: string;
  instagram_url: string;
  tiktok_url: string;
  youtube_url: string;
  twitter_url: string;
  linkedin_url: string;

  // Notifications
  notification_emails: string[];
}

// Default settings (fallback values)
const defaultSettings: SiteSettings = {
  phones: ['0359-409730', '0359-409731', '0259-373243'],
  fax: '0359-409733',
  emails: ['primsal@rdslink.ro', 'primsal3@gmail.com'],
  working_hours: 'Luni - Vineri: 8:00 - 16:00',
  facebook_url: 'https://www.facebook.com/PrimariaSalontaNagyszalontaPolgarmesteriHivatala',
  instagram_url: 'https://www.instagram.com/primaria.municipiuluisalonta/',
  tiktok_url: 'https://www.tiktok.com/@primariasalonta_',
  youtube_url: '',
  twitter_url: '',
  linkedin_url: '',
  notification_emails: ['alex.jungean@gmail.com'],
};

// GET - Fetch all settings
export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const supabaseAdmin = createAdminClient();

    const { data, error } = await supabaseAdmin
      .from('site_settings')
      .select('key, value')
      .order('key');

    if (error) {
      // If table doesn't exist, return defaults
      if (error.code === '42P01') {
        return NextResponse.json(defaultSettings);
      }
      throw error;
    }

    // Convert array of key-value pairs to object
    const settings: Record<string, unknown> = { ...defaultSettings };
    for (const row of data || []) {
      settings[row.key] = row.value;
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    // Return defaults on error
    return NextResponse.json(defaultSettings);
  }
}

// Helper function to upsert settings
async function upsertSettings(
  supabaseAdmin: ReturnType<typeof createAdminClient>,
  body: Record<string, unknown>
): Promise<{ success: boolean; error?: string }> {
  try {
    const results = await Promise.all(
      Object.entries(body).map(async ([key, value]) => {
        const { error } = await supabaseAdmin
          .from('site_settings')
          .upsert(
            { key, value, updated_at: new Date().toISOString() },
            { onConflict: 'key' }
          );
        
        if (error) {
          console.error(`Error upserting setting ${key}:`, error);
          return { key, error, hasError: true };
        }
        return { key, hasError: false };
      })
    );

    // Check if any upsert failed
    const errors = results.filter(r => r.hasError);
    if (errors.length > 0) {
      const firstError = errors[0] as { key: string; error: { message?: string; code?: string }; hasError: true };
      // Check if table doesn't exist
      if (firstError.error?.code === '42P01') {
        return { success: false, error: 'Tabelul site_settings nu există în baza de date. Creați-l folosind SQL-ul furnizat.' };
      }
      return { success: false, error: firstError.error?.message || 'Failed to save settings' };
    }

    return { success: true };
  } catch (err) {
    console.error('Exception in upsertSettings:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

// PUT - Update all settings
export async function PUT(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;
  const adminUser = authResult;

  try {
    const supabaseAdmin = createAdminClient();
    const body = await request.json();
    const { ipAddress, userAgent } = getRequestInfo(request);

    console.log('PUT /api/admin/settings - Saving settings:', Object.keys(body));

    // Upsert all settings
    const result = await upsertSettings(supabaseAdmin, body);
    if (!result.success) {
      console.error('PUT /api/admin/settings - Failed:', result.error);
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    console.log('PUT /api/admin/settings - Success');

    // Invalidate the settings cache so changes take effect immediately
    invalidateSettingsCache();

    // Log the action
    await logAuditAction({
      action: 'update',
      resourceType: 'settings',
      resourceId: 'site_settings',
      resourceTitle: 'Setări Website',
      details: { updatedKeys: Object.keys(body) },
      userId: adminUser.id,
      userEmail: adminUser.email,
      userName: adminUser.fullName,
      ipAddress,
      userAgent,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update settings' },
      { status: 500 }
    );
  }
}

// PATCH - Update specific settings
export async function PATCH(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;
  const adminUser = authResult;

  try {
    const supabaseAdmin = createAdminClient();
    const body = await request.json();
    const { ipAddress, userAgent } = getRequestInfo(request);

    // Upsert settings
    const result = await upsertSettings(supabaseAdmin, body);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    // Invalidate the settings cache so changes take effect immediately
    invalidateSettingsCache();

    // Log the action
    await logAuditAction({
      action: 'update',
      resourceType: 'settings',
      resourceId: 'site_settings',
      resourceTitle: 'Setări Website',
      details: { updatedKeys: Object.keys(body) },
      userId: adminUser.id,
      userEmail: adminUser.email,
      userName: adminUser.fullName,
      ipAddress,
      userAgent,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update settings' },
      { status: 500 }
    );
  }
}
