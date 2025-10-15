import { NextRequest } from 'next/server';
import { DNSChecker } from '@/lib/email/dns-checker';
import { rateLimiter, getClientIdentifier, RATE_LIMIT_CONFIG } from '@/lib/rate-limit';
import { APIResponse } from '../../../../utils/response';

export async function POST(request: NextRequest) {
  const identifier = getClientIdentifier(request);
  const rateLimit = rateLimiter.checkRateLimit(identifier, RATE_LIMIT_CONFIG.dns);

  if (!rateLimit.allowed) {
    return APIResponse.rateLimited(rateLimit.resetTime);
  }

  try {
    const { domain } = await request.json();

    if (!domain || typeof domain !== 'string') {
      return APIResponse.error('Domain is required', 'MISSING_DOMAIN');
    }

    const dnsInfo = await DNSChecker.validateDomain(domain);

    return APIResponse.success({
      domain,
      ...dnsInfo,
      rateLimit: {
        remaining: rateLimit.remaining,
        resetTime: new Date(rateLimit.resetTime).toISOString()
      }
    });

  } catch (error) {
    console.error('DNS check error:', error);
    return APIResponse.error(
      'Failed to check DNS records',
      'DNS_CHECK_FAILED',
      500
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get('domain');

  if (!domain) {
    return APIResponse.error('Domain query parameter is required', 'MISSING_DOMAIN');
  }

  const body = JSON.stringify({ domain });
  const mockRequest = new NextRequest(request, { body });
  return POST(mockRequest);
}