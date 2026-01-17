import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';

// Verifică dacă Upstash e configurat
const isConfigured = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

// Creează client Redis doar dacă e configurat
const redis = isConfigured
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

/**
 * Rate limiters pentru diferite endpoint-uri
 */
export const rateLimiters = {
  // Login: 5 încercări / 15 minute
  login: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, '15 m'),
        prefix: 'ratelimit:login',
      })
    : null,

  // API general: 100 requests / minut
  api: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(100, '1 m'),
        prefix: 'ratelimit:api',
      })
    : null,

  // Upload: 30 fișiere / minut
  upload: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(30, '1 m'),
        prefix: 'ratelimit:upload',
      })
    : null,

  // Contact/Petiții: 3 / oră per IP
  forms: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(3, '1 h'),
        prefix: 'ratelimit:forms',
      })
    : null,

  // Strict: 10 requests / minut (pentru endpoint-uri sensibile)
  strict: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, '1 m'),
        prefix: 'ratelimit:strict',
      })
    : null,
};

export type RateLimitType = keyof typeof rateLimiters;

/**
 * Extrage IP-ul din request
 */
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  return 'anonymous';
}

/**
 * Verifică rate limit
 * Returnează null dacă e OK, sau Response dacă e depășit
 */
export async function checkRateLimit(
  request: NextRequest,
  type: RateLimitType = 'api'
): Promise<NextResponse | null> {
  const limiter = rateLimiters[type];
  
  // Dacă nu e configurat Upstash, permite toate request-urile
  if (!limiter) {
    return null;
  }

  const ip = getClientIP(request);
  const { success, limit, remaining, reset } = await limiter.limit(ip);

  if (!success) {
    const retryAfter = Math.ceil((reset - Date.now()) / 1000);
    
    return NextResponse.json(
      {
        error: 'Prea multe cereri. Vă rugăm să așteptați.',
        retryAfter,
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': reset.toString(),
          'Retry-After': retryAfter.toString(),
        },
      }
    );
  }

  return null;
}

/**
 * Middleware helper pentru rate limiting
 * Folosește în API routes:
 * 
 * const rateLimitResponse = await checkRateLimit(request, 'upload');
 * if (rateLimitResponse) return rateLimitResponse;
 */
export async function withRateLimit(
  request: NextRequest,
  type: RateLimitType,
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  const rateLimitResponse = await checkRateLimit(request, type);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }
  
  return handler();
}

/**
 * Verifică dacă rate limiting e configurat
 */
export function isRateLimitingEnabled(): boolean {
  return !!isConfigured;
}
