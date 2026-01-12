import { NextRequest, NextResponse } from 'next/server';
import { petitionFormSchema } from '@/lib/validations/forms';
import { sendEmail, petitionEmailTemplate } from '@/lib/email';
import { verifyRecaptcha } from '@/lib/recaptcha';

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
    
    // For now, we don't handle file uploads - just note if there was supposed to be one
    const hasAttachment = false;
    
    // Send the email
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
