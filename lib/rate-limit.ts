// lib/rate-limit.ts
import { NextRequest } from 'next/server';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

class RateLimiter {
  private requests = new Map<string, { count: number; resetTime: number }>();

  checkRateLimit(identifier: string, config: RateLimitConfig): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const windowStart = now - config.windowMs;

    // Clean up old entries
    this.cleanup(windowStart);

    const userRequests = this.requests.get(identifier) || { count: 0, resetTime: now + config.windowMs };

    if (now > userRequests.resetTime) {
      // Reset counter for new window
      userRequests.count = 0;
      userRequests.resetTime = now + config.windowMs;
    }

    userRequests.count++;
    this.requests.set(identifier, userRequests);

    const remaining = Math.max(0, config.maxRequests - userRequests.count);
    const allowed = userRequests.count <= config.maxRequests;

    return {
      allowed,
      remaining,
      resetTime: userRequests.resetTime
    };
  }

  private cleanup(windowStart: number): void {
    for (const [key, value] of this.requests.entries()) {
      if (value.resetTime < windowStart) {
        this.requests.delete(key);
      }
    }
  }
}

export const rateLimiter = new RateLimiter();

export function getClientIdentifier(req: NextRequest): string {
  // Use IP address or API key for identification
  const ip = req.ip || req.headers.get('x-forwarded-for') || 'anonymous';
  const apiKey = req.headers.get('x-api-key');
  
  return apiKey ? `api-key:${apiKey}` : `ip:${ip}`;
}

export const RATE_LIMIT_CONFIG = {
  single: { maxRequests: 100, windowMs: 60000 }, // 100 requests per minute
  batch: { maxRequests: 10, windowMs: 60000 },   // 10 batch requests per minute
  dns: { maxRequests: 50, windowMs: 60000 }      // 50 DNS checks per minute
};