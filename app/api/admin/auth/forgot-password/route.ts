import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import { sendEmail } from '@/lib/email';
import { checkRateLimit } from '@/lib/rate-limit';

function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function generateResetCode(): string {
  return crypto.randomInt(100000, 999999).toString();
}

function resetCodeEmailTemplate(code: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: #1e40af; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
        .code-box { background: white; padding: 20px; border-radius: 8px; border: 2px solid #1e40af; text-align: center; margin: 20px 0; }
        .code { font-size: 32px; font-weight: bold; color: #1e40af; letter-spacing: 8px; font-family: monospace; }
        .warning { background: #fef3c7; padding: 12px; border-radius: 8px; margin-top: 20px; font-size: 13px; color: #92400e; }
        .footer { text-align: center; padding: 15px; color: #6b7280; font-size: 12px; background: #f3f4f6; border-radius: 0 0 8px 8px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2 style="margin: 0;">Resetare parolă</h2>
          <p style="margin: 5px 0 0 0; opacity: 0.9;">Primăria Salonta - Panou de Administrare</p>
        </div>
        <div class="content">
          <p>Ați solicitat resetarea parolei pentru contul dumneavoastră de administrator.</p>
          <p>Folosiți codul de mai jos pentru a vă reseta parola:</p>
          
          <div class="code-box">
            <div class="code">${code}</div>
          </div>
          
          <p>Codul este valabil <strong>15 minute</strong>.</p>
          
          <div class="warning">
            Dacă nu ați solicitat resetarea parolei, ignorați acest email. Nimeni nu vă poate schimba parola fără acest cod.
          </div>
        </div>
        <div class="footer">
          Acest email a fost trimis automat de sistemul de administrare al Primăriei Salonta.
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function POST(request: NextRequest) {
  const rateLimitResponse = await checkRateLimit(request, 'forms');
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Adresa de email este obligatorie' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data: profile } = await supabase
      .from('admin_profiles')
      .select('id, email, full_name, is_active')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (!profile || !profile.is_active) {
      // Always return success to prevent email enumeration
      return NextResponse.json({
        message: 'Dacă adresa de email există în sistem, veți primi un cod de resetare.',
      });
    }

    const code = generateResetCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    const { error: updateError } = await supabase
      .from('admin_profiles')
      .update({
        reset_code: code,
        reset_code_expires_at: expiresAt,
      })
      .eq('id', profile.id);

    if (updateError) {
      console.error('Failed to store reset code:', updateError);
      return NextResponse.json(
        { error: 'Eroare la procesarea cererii' },
        { status: 500 }
      );
    }

    const emailResult = await sendEmail({
      to: profile.email,
      subject: 'Resetare parolă - Primăria Salonta Admin',
      html: resetCodeEmailTemplate(code),
    });

    if (!emailResult.success) {
      console.error('Failed to send reset email:', emailResult.error);
      await supabase
        .from('admin_profiles')
        .update({ reset_code: null, reset_code_expires_at: null })
        .eq('id', profile.id);

      return NextResponse.json(
        { error: 'Nu s-a putut trimite email-ul. Încercați din nou.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Dacă adresa de email există în sistem, veți primi un cod de resetare.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Eroare la procesarea cererii' },
      { status: 500 }
    );
  }
}
