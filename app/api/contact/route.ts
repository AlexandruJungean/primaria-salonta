import { NextRequest, NextResponse } from 'next/server';
import { contactFormSchema } from '@/lib/validations/forms';
import { sendEmail, contactEmailTemplate } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the form data
    const validationResult = contactFormSchema.safeParse(body);
    
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
    
    // Send the email
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
