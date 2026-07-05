import type { NextRequest } from 'next/server';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, RateLimitEntry>();

export interface RateLimitResult {
  allowed: boolean;
  retryAfter: number;
}

export function getClientIp(request: NextRequest): string {
  if (process.env.TRUST_PROXY_HEADERS !== 'true') {
    return 'direct';
  }

  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0].trim();

  return request.headers.get('x-real-ip') || 'unknown';
}

export function normalizeRateLimitPart(value: unknown): string {
  return String(value || 'unknown').trim().toLowerCase().slice(0, 200);
}

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
  now = Date.now()
): RateLimitResult {
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }

  if (current.count >= limit) {
    return {
      allowed: false,
      retryAfter: Math.ceil((current.resetAt - now) / 1000),
    };
  }

  current.count += 1;
  return { allowed: true, retryAfter: 0 };
}

export function clearRateLimitBuckets() {
  buckets.clear();
}
