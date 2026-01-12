/**
 * Server-side reCAPTCHA v3 verification
 */

interface RecaptchaVerifyResponse {
  success: boolean;
  score?: number;
  action?: string;
  challenge_ts?: string;
  hostname?: string;
  'error-codes'?: string[];
}

interface VerifyResult {
  success: boolean;
  score?: number;
  error?: string;
}

/**
 * Verify a reCAPTCHA token on the server side
 * @param token - The reCAPTCHA token from the client
 * @param expectedAction - Optional: verify the action matches (e.g., 'contact_form')
 * @param minScore - Minimum score to consider valid (default: 0.5)
 */
export async function verifyRecaptcha(
  token: string,
  expectedAction?: string,
  minScore: number = 0.5
): Promise<VerifyResult> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  // If no secret key, skip verification (development mode)
  if (!secretKey) {
    console.warn('reCAPTCHA secret key not configured. Skipping verification.');
    return { success: true, score: 1.0 };
  }

  // If no token provided, fail
  if (!token) {
    return { success: false, error: 'No reCAPTCHA token provided' };
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
      }),
    });

    const data: RecaptchaVerifyResponse = await response.json();

    // Check if verification was successful
    if (!data.success) {
      const errorCodes = data['error-codes']?.join(', ') || 'Unknown error';
      console.error('reCAPTCHA verification failed:', errorCodes);
      return { success: false, error: `reCAPTCHA verification failed: ${errorCodes}` };
    }

    // Check action if specified
    if (expectedAction && data.action !== expectedAction) {
      console.error(`reCAPTCHA action mismatch: expected ${expectedAction}, got ${data.action}`);
      return { success: false, error: 'reCAPTCHA action mismatch' };
    }

    // Check score
    const score = data.score ?? 0;
    if (score < minScore) {
      console.warn(`reCAPTCHA score too low: ${score} < ${minScore}`);
      return { success: false, score, error: 'reCAPTCHA score too low - possible bot activity' };
    }

    return { success: true, score };
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return { success: false, error: 'Failed to verify reCAPTCHA' };
  }
}
