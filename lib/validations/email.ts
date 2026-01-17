import { z } from 'zod';

// Liste de domenii blocate (email-uri temporare/spam)
const BLOCKED_DOMAINS = [
  'tempmail.com',
  'throwaway.email',
  'guerrillamail.com',
  'mailinator.com',
  '10minutemail.com',
  'temp-mail.org',
  'fakeinbox.com',
  'trashmail.com',
  'yopmail.com',
  'dispostable.com',
  'maildrop.cc',
  'getnada.com',
  'emailondeck.com',
  'sharklasers.com',
  'spam4.me',
];

// Regex îmbunătățit pentru validare email
// Mai strict decât regex-ul default din Zod
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

/**
 * Validează formatul email-ului
 */
export function isValidEmailFormat(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  if (email.length > 254) return false; // RFC 5321
  
  return EMAIL_REGEX.test(email);
}

/**
 * Verifică dacă domeniul email-ului este blocat (email temporar/spam)
 */
export function isBlockedDomain(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return true;
  
  return BLOCKED_DOMAINS.some(blocked => 
    domain === blocked || domain.endsWith(`.${blocked}`)
  );
}

/**
 * Verifică dacă domeniul email-ului are MX records (poate primi email-uri)
 * Folosește API extern - doar pentru server-side
 */
export async function hasMXRecords(email: string): Promise<boolean> {
  const domain = email.split('@')[1];
  if (!domain) return false;

  try {
    // Folosim Google DNS-over-HTTPS pentru a verifica MX records
    const response = await fetch(
      `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=MX`,
      { 
        signal: AbortSignal.timeout(3000), // 3 secunde timeout
        headers: { 'Accept': 'application/dns-json' }
      }
    );

    if (!response.ok) return true; // În caz de eroare, presupunem că e valid

    const data = await response.json();
    
    // Status 0 = NOERROR, Answer există = are MX records
    if (data.Status === 0 && data.Answer && data.Answer.length > 0) {
      return true;
    }
    
    // Dacă nu are MX records, verifică dacă are A record (poate primi email direct)
    const aResponse = await fetch(
      `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=A`,
      { 
        signal: AbortSignal.timeout(2000),
        headers: { 'Accept': 'application/dns-json' }
      }
    );
    
    if (aResponse.ok) {
      const aData = await aResponse.json();
      return aData.Status === 0 && aData.Answer && aData.Answer.length > 0;
    }

    return false;
  } catch (error) {
    // În caz de eroare de rețea, presupunem că e valid
    console.warn('DNS lookup failed for email domain:', domain, error);
    return true;
  }
}

/**
 * Validare completă email (format + domeniu blocat)
 * Nu face verificare DNS - e sincronă
 */
export function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Adresa de email este obligatorie' };
  }

  const trimmedEmail = email.trim().toLowerCase();

  if (!isValidEmailFormat(trimmedEmail)) {
    return { valid: false, error: 'Formatul adresei de email nu este valid' };
  }

  if (isBlockedDomain(trimmedEmail)) {
    return { valid: false, error: 'Nu sunt acceptate adrese de email temporare' };
  }

  return { valid: true };
}

/**
 * Validare completă email cu verificare DNS (async)
 * Folosește doar pe server-side
 */
export async function validateEmailWithDNS(email: string): Promise<{ valid: boolean; error?: string }> {
  // Mai întâi validare de bază
  const basicValidation = validateEmail(email);
  if (!basicValidation.valid) {
    return basicValidation;
  }

  // Apoi verificare DNS
  const hasMX = await hasMXRecords(email);
  if (!hasMX) {
    return { valid: false, error: 'Domeniul email-ului nu pare să fie valid' };
  }

  return { valid: true };
}

/**
 * Zod schema pentru email cu validare îmbunătățită
 */
export const emailSchema = z.string()
  .trim()
  .toLowerCase()
  .min(5, 'Adresa de email este prea scurtă')
  .max(254, 'Adresa de email este prea lungă')
  .email('Formatul adresei de email nu este valid')
  .refine((email) => !isBlockedDomain(email), {
    message: 'Nu sunt acceptate adrese de email temporare',
  });

/**
 * Zod schema pentru email cu validare DNS (async)
 * Folosește cu .parseAsync()
 */
export const emailSchemaWithDNS = emailSchema.refine(
  async (email) => {
    const result = await hasMXRecords(email);
    return result;
  },
  { message: 'Domeniul email-ului nu pare să fie valid' }
);
