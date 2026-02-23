import nodemailer from 'nodemailer';
import { getNotificationEmails } from '@/lib/supabase/services/settings';

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Fallback recipient if database is unavailable
const FALLBACK_RECIPIENT = 'alex.jungean@gmail.com';

export interface EmailOptions {
  to?: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
  try {
    // If no recipient specified, get notification emails from database
    let recipients = options.to;
    if (!recipients) {
      try {
        const notificationEmails = await getNotificationEmails();
        recipients = notificationEmails.length > 0 ? notificationEmails : FALLBACK_RECIPIENT;
      } catch {
        recipients = FALLBACK_RECIPIENT;
      }
    }

    await transporter.sendMail({
      from: `"Primăria Salonta" <${process.env.SMTP_USER}>`,
      to: recipients,
      subject: options.subject,
      html: options.html,
      replyTo: options.replyTo,
    });
    
    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email' 
    };
  }
}

// Email templates
export function contactEmailTemplate(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: #1e40af; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #374151; }
        .value { margin-top: 5px; }
        .message-box { background: white; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb; }
        .footer { text-align: center; padding: 15px; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2 style="margin: 0;">📧 Mesaj nou de contact</h2>
          <p style="margin: 5px 0 0 0; opacity: 0.9;">Primit de pe website-ul Primăriei Salonta</p>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">👤 Nume:</div>
            <div class="value">${data.name}</div>
          </div>
          <div class="field">
            <div class="label">📧 Email:</div>
            <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
          </div>
          ${data.phone ? `
          <div class="field">
            <div class="label">📞 Telefon:</div>
            <div class="value"><a href="tel:${data.phone}">${data.phone}</a></div>
          </div>
          ` : ''}
          <div class="field">
            <div class="label">📋 Subiect:</div>
            <div class="value">${data.subject}</div>
          </div>
          <div class="field">
            <div class="label">💬 Mesaj:</div>
            <div class="message-box">${data.message.replace(/\n/g, '<br>')}</div>
          </div>
        </div>
        <div class="footer">
          Acest mesaj a fost trimis automat de pe website-ul salonta.net
        </div>
      </div>
    </body>
    </html>
  `;
}

// Multilingual translations for contact confirmation email
const contactConfirmationTranslations = {
  ro: {
    headerTitle: '✅ Mesajul dumneavoastră a fost primit',
    greeting: 'Stimate/Stimată',
    messageConfirm: 'Vă confirmăm că am primit mesajul dumneavoastră cu subiectul:',
    processingNote: 'Mesajul a fost înregistrat și va fi procesat de către echipa noastră. Vom reveni cu un răspuns în cel mai scurt timp posibil.',
    thankYou: 'Vă mulțumim pentru că ne-ați contactat!',
    footer: 'Acesta este un mesaj automat. Vă rugăm să nu răspundeți la acest email.',
  },
  hu: {
    headerTitle: '✅ Üzenetét megkaptuk',
    greeting: 'Tisztelt',
    messageConfirm: 'Megerősítjük, hogy megkaptuk üzenetét a következő tárggyal:',
    processingNote: 'Az üzenetet rögzítettük, és csapatunk feldolgozza. A lehető legrövidebb időn belül válaszolunk.',
    thankYou: 'Köszönjük, hogy kapcsolatba lépett velünk!',
    footer: 'Ez egy automatikus üzenet. Kérjük, ne válaszoljon erre az e-mailre.',
  },
  en: {
    headerTitle: '✅ Your message has been received',
    greeting: 'Dear',
    messageConfirm: 'We confirm that we have received your message with the subject:',
    processingNote: 'Your message has been registered and will be processed by our team. We will respond as soon as possible.',
    thankYou: 'Thank you for contacting us!',
    footer: 'This is an automated message. Please do not reply to this email.',
  },
};

// Confirmation email template for contact form
export function contactConfirmationTemplate(data: {
  name: string;
  subject: string;
  locale?: 'ro' | 'hu' | 'en';
}): string {
  const t = contactConfirmationTranslations[data.locale || 'ro'];
  
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
        .message { background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; margin: 20px 0; }
        .footer { text-align: center; padding: 15px; color: #6b7280; font-size: 12px; background: #f3f4f6; border-radius: 0 0 8px 8px; }
        .contact-info { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2 style="margin: 0;">${t.headerTitle}</h2>
        </div>
        <div class="content">
          <p>${t.greeting} <strong>${data.name}</strong>,</p>
          
          <div class="message">
            <p>${t.messageConfirm}</p>
            <p style="font-weight: bold; color: #1e40af;">"${data.subject}"</p>
          </div>
          
          <p>${t.processingNote}</p>
          
          <p>${t.thankYou}</p>
          
          <div class="contact-info">
            <p style="margin: 0; font-weight: bold;">Primăria Municipiului Salonta</p>
            <p style="margin: 5px 0; color: #6b7280;">Str. Republicii nr. 1, Salonta, 415500, Jud. Bihor</p>
            <p style="margin: 5px 0; color: #6b7280;">Tel: 0359-409730 | Email: primsal3@gmail.com</p>
          </div>
        </div>
        <div class="footer">
          ${t.footer}
        </div>
      </div>
    </body>
    </html>
  `;
}

// Multilingual translations for petition confirmation email
const petitionConfirmationTranslations = {
  ro: {
    headerTitle: '✅ Petiția dumneavoastră a fost înregistrată',
    greeting: 'Stimate/Stimată',
    messageConfirm: 'Vă confirmăm că petiția dumneavoastră a fost primită și înregistrată în sistemul nostru.',
    legalTermTitle: '📋 Termen legal de răspuns:',
    legalTermText: 'Conform legislației în vigoare (OG nr. 27/2002), veți primi un răspuns în termen de maxim 30 de zile de la data înregistrării.',
    questionsNote: 'Dacă aveți întrebări suplimentare, nu ezitați să ne contactați.',
    thankYou: 'Vă mulțumim!',
    publicRelations: 'Biroul de Relații cu Publicul',
    footer: 'Acesta este un mesaj automat. Vă rugăm să nu răspundeți la acest email.',
  },
  hu: {
    headerTitle: '✅ Beadványát nyilvántartásba vettük',
    greeting: 'Tisztelt',
    messageConfirm: 'Megerősítjük, hogy beadványát megkaptuk és nyilvántartásba vettük rendszerünkben.',
    legalTermTitle: '📋 Törvényes válaszadási határidő:',
    legalTermText: 'A hatályos jogszabályok értelmében (27/2002. sz. Kormányrendelet) legfeljebb 30 napon belül választ kap a bejegyzés napjától számítva.',
    questionsNote: 'Ha további kérdései vannak, ne habozzon kapcsolatba lépni velünk.',
    thankYou: 'Köszönjük!',
    publicRelations: 'Ügyfélszolgálat',
    footer: 'Ez egy automatikus üzenet. Kérjük, ne válaszoljon erre az e-mailre.',
  },
  en: {
    headerTitle: '✅ Your petition has been registered',
    greeting: 'Dear',
    messageConfirm: 'We confirm that your petition has been received and registered in our system.',
    legalTermTitle: '📋 Legal response deadline:',
    legalTermText: 'According to the legislation in force (Government Ordinance no. 27/2002), you will receive a response within a maximum of 30 days from the registration date.',
    questionsNote: 'If you have any additional questions, please do not hesitate to contact us.',
    thankYou: 'Thank you!',
    publicRelations: 'Public Relations Office',
    footer: 'This is an automated message. Please do not reply to this email.',
  },
};

// Confirmation email template for petition form
export function petitionConfirmationTemplate(data: {
  tipPersoana: 'fizica' | 'juridica';
  nume?: string;
  prenume?: string;
  denumire?: string;
  locale?: 'ro' | 'hu' | 'en';
}): string {
  const t = petitionConfirmationTranslations[data.locale || 'ro'];
  const name = data.tipPersoana === 'fizica' 
    ? `${data.nume} ${data.prenume}` 
    : data.denumire;
    
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
        .message { background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; margin: 20px 0; }
        .info-box { background: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; padding: 15px; color: #6b7280; font-size: 12px; background: #f3f4f6; border-radius: 0 0 8px 8px; }
        .contact-info { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2 style="margin: 0;">${t.headerTitle}</h2>
        </div>
        <div class="content">
          <p>${t.greeting} <strong>${name}</strong>,</p>
          
          <div class="message">
            <p>${t.messageConfirm}</p>
          </div>
          
          <div class="info-box">
            <p style="margin: 0;"><strong>${t.legalTermTitle}</strong></p>
            <p style="margin: 10px 0 0 0;">${t.legalTermText}</p>
          </div>
          
          <p>${t.questionsNote}</p>
          
          <p>${t.thankYou}</p>
          
          <div class="contact-info">
            <p style="margin: 0; font-weight: bold;">Primăria Municipiului Salonta</p>
            <p style="margin: 5px 0; color: #6b7280;">${t.publicRelations}</p>
            <p style="margin: 5px 0; color: #6b7280;">Str. Republicii nr. 1, Salonta, 415500, Jud. Bihor</p>
            <p style="margin: 5px 0; color: #6b7280;">Tel: 0359-409730 | Email: primsal3@gmail.com</p>
          </div>
        </div>
        <div class="footer">
          ${t.footer}
        </div>
      </div>
    </body>
    </html>
  `;
}

export function petitionEmailTemplate(data: {
  tipPersoana: 'fizica' | 'juridica';
  nume?: string;
  prenume?: string;
  denumire?: string;
  reprezentant?: string;
  cui?: string;
  email: string;
  telefon?: string;
  tara: string;
  judet: string;
  localitate: string;
  adresa: string;
  mesaj: string;
  hasAttachment: boolean;
}): string {
  const isCompany = data.tipPersoana === 'juridica';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: #1e40af; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
        .section { margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #e5e7eb; }
        .section:last-child { border-bottom: none; margin-bottom: 0; }
        .section-title { font-weight: bold; color: #1e40af; margin-bottom: 10px; }
        .field { margin-bottom: 10px; }
        .label { font-weight: bold; color: #374151; display: inline; }
        .value { display: inline; }
        .message-box { background: white; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb; margin-top: 10px; }
        .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
        .badge-fizica { background: #dbeafe; color: #1e40af; }
        .badge-juridica { background: #fef3c7; color: #92400e; }
        .attachment-notice { background: #fef3c7; padding: 10px; border-radius: 8px; margin-top: 15px; }
        .footer { text-align: center; padding: 15px; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2 style="margin: 0;">📝 Petiție nouă</h2>
          <p style="margin: 5px 0 0 0; opacity: 0.9;">Primită de pe website-ul Primăriei Salonta</p>
        </div>
        <div class="content">
          <div class="section">
            <div class="section-title">Tip solicitant</div>
            <span class="badge ${isCompany ? 'badge-juridica' : 'badge-fizica'}">
              ${isCompany ? '🏢 Persoană juridică' : '👤 Persoană fizică'}
            </span>
          </div>
          
          <div class="section">
            <div class="section-title">${isCompany ? 'Date companie' : 'Date personale'}</div>
            ${isCompany ? `
              <div class="field"><span class="label">Denumire:</span> <span class="value">${data.denumire}</span></div>
              <div class="field"><span class="label">Reprezentant:</span> <span class="value">${data.reprezentant}</span></div>
              <div class="field"><span class="label">CUI:</span> <span class="value">${data.cui}</span></div>
            ` : `
              <div class="field"><span class="label">Nume:</span> <span class="value">${data.nume} ${data.prenume}</span></div>
            `}
            <div class="field"><span class="label">Email:</span> <span class="value"><a href="mailto:${data.email}">${data.email}</a></span></div>
            ${data.telefon ? `<div class="field"><span class="label">Telefon:</span> <span class="value"><a href="tel:${data.telefon}">${data.telefon}</a></span></div>` : ''}
          </div>
          
          <div class="section">
            <div class="section-title">📍 Adresă</div>
            <div class="field">${data.adresa}</div>
            <div class="field">${data.localitate}, ${data.judet}, ${data.tara}</div>
          </div>
          
          <div class="section">
            <div class="section-title">💬 Conținut petiție</div>
            <div class="message-box">${data.mesaj.replace(/\n/g, '<br>')}</div>
          </div>
          
          ${data.hasAttachment ? `
          <div class="attachment-notice">
            📎 <strong>Notă:</strong> Această petiție conține un fișier atașat. 
            Vă rugăm să verificați sistemul pentru descărcare.
          </div>
          ` : ''}
        </div>
        <div class="footer">
          Această petiție a fost trimisă automat de pe website-ul salonta.net
        </div>
      </div>
    </body>
    </html>
  `;
}
