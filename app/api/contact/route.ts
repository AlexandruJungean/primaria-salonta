import { NextRequest, NextResponse } from 'next/server';
import { contactFormSchema } from '@/lib/validations/forms';
import { sendEmail, contactEmailTemplate, contactConfirmationTemplate } from '@/lib/email';
import { verifyRecaptcha } from '@/lib/recaptcha';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Verify reCAPTCHA token
    const { recaptchaToken, ...formData } = body;
    const recaptchaResult = await verifyRecaptcha(recaptchaToken, 'contact_form');
    
    if (!recaptchaResult.success) {
      console.warn('reCAPTCHA verification failed:', recaptchaResult.error);
      return NextResponse.json(
        { success: false, error: 'Verificarea anti-spam a eșuat. Vă rugăm să încercați din nou.' },
        { status: 400 }
      );
    }
    
    // Validate the form data
    const validationResult = contactFormSchema.safeParse(formData);
    
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
    
    // Send the email to the municipality
    const emailResult = await sendEmail({
      subject: `[Contact Website] ${data.subject}`,
      html: contactEmailTemplate(data),
      replyTo: data.email,
    });
    
    if (!emailResult.success) {
      console.error('Failed to send contact email:', emailResult.error);
      return NextResponse.json(
        { success: false, error: 'Failed to send email. Please try again later.' },
        { status: 500 }
      );
    }
    
    // Confirmation email subjects per locale
    const confirmationSubjects = {
      ro: 'Confirmare primire mesaj - Primăria Salonta',
      hu: 'Üzenet visszaigazolása - Nagyszalonta Polgármesteri Hivatala',
      en: 'Message confirmation - Salonta City Hall',
    };
    
    // Send confirmation email to the sender
    await sendEmail({
      to: data.email,
      subject: confirmationSubjects[locale],
      html: contactConfirmationTemplate({
        name: data.name,
        subject: data.subject,
        locale,
      }),
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Mesajul a fost trimis cu succes!' 
    });
    
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
