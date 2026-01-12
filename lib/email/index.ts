import nodemailer from 'nodemailer';

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

// Default recipient for all form submissions
const DEFAULT_RECIPIENT = 'alex.jungean@gmail.com';

export interface EmailOptions {
  to?: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
  try {
    await transporter.sendMail({
      from: `"Primăria Salonta" <${process.env.SMTP_USER}>`,
      to: options.to || DEFAULT_RECIPIENT,
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
          Acest mesaj a fost trimis automat de pe website-ul primariasalonta.ro
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
          Această petiție a fost trimisă automat de pe website-ul primariasalonta.ro
        </div>
      </div>
    </body>
    </html>
  `;
}
