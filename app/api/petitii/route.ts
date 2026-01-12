import { NextRequest, NextResponse } from 'next/server';
import { petitionFormSchema } from '@/lib/validations/forms';
import { sendEmail, petitionEmailTemplate, petitionConfirmationTemplate } from '@/lib/email';
import { verifyRecaptcha } from '@/lib/recaptcha';
import { createAnonServerClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Verify reCAPTCHA token
    const { recaptchaToken, ...formData } = body;
    const recaptchaResult = await verifyRecaptcha(recaptchaToken, 'petition_form');
    
    if (!recaptchaResult.success) {
      console.warn('reCAPTCHA verification failed:', recaptchaResult.error);
      return NextResponse.json(
        { success: false, error: 'Verificarea anti-spam a eșuat. Vă rugăm să încercați din nou.' },
        { status: 400 }
      );
    }
    
    // Validate the form data
    const validationResult = petitionFormSchema.safeParse(formData);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed',
          errors: validationResult.error.flatten().fieldErrors 
        },
        { status: 400 }
      );
    }
    
    const data = validationResult.data;
    const locale = (body.locale as 'ro' | 'hu' | 'en') || 'ro';
    
    // For now, we don't handle file uploads - just note if there was supposed to be one
    const hasAttachment = false;
    
    // Get IP address
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ipAddress = forwardedFor ? forwardedFor.split(',')[0].trim() : null;
    
    // Build name from form data
    const petitionerName = data.tipPersoana === 'fizica' 
      ? `${data.nume || ''} ${data.prenume || ''}`.trim()
      : data.denumire || '';
    
    // Save to database
    const supabase = createAnonServerClient();
    const { error: dbError } = await supabase
      .from('petitions')
      .insert({
        name: petitionerName,
        email: data.email,
        phone: data.telefon || null,
        address: `${data.adresa}, ${data.localitate}, ${data.judet}, ${data.tara}`,
        subject: `Petiție ${data.tipPersoana === 'fizica' ? 'persoană fizică' : 'persoană juridică'}`,
        content: data.mesaj,
        status: 'inregistrata',
        ip_address: ipAddress,
      });
    
    if (dbError) {
      console.error('Failed to save petition:', dbError);
      // Continue anyway - email is more important
    }
    
    // Send the email to the municipality
    const emailResult = await sendEmail({
      subject: `[Petiție] ${data.tipPersoana === 'fizica' ? `${data.nume} ${data.prenume}` : data.denumire}`,
      html: petitionEmailTemplate({
        ...data,
        hasAttachment,
      }),
      replyTo: data.email,
    });
    
    if (!emailResult.success) {
      console.error('Failed to send petition email:', emailResult.error);
      return NextResponse.json(
        { success: false, error: 'Failed to send email. Please try again later.' },
        { status: 500 }
      );
    }
    
    // Confirmation email subjects per locale
    const confirmationSubjects = {
      ro: 'Confirmare primire petiție - Primăria Salonta',
      hu: 'Beadvány visszaigazolása - Nagyszalonta Polgármesteri Hivatala',
      en: 'Petition confirmation - Salonta City Hall',
    };
    
    // Send confirmation email to the sender
    await sendEmail({
      to: data.email,
      subject: confirmationSubjects[locale],
      html: petitionConfirmationTemplate({
        tipPersoana: data.tipPersoana,
        nume: data.nume,
        prenume: data.prenume,
        denumire: data.denumire,
        locale,
      }),
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Petiția a fost trimisă cu succes!' 
    });
    
  } catch (error) {
    console.error('Petition form error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
