import { NextRequest } from 'next/server';
import { EmailValidator } from '@/lib/email/validators';
import { DNSChecker } from '@/lib/email/dns-checker';
import { rateLimiter, getClientIdentifier, RATE_LIMIT_CONFIG } from '@/lib/rate-limit';
import { APIResponse } from '@/utils/response';
import { VerificationServiceManager } from '@/lib/email/verification-services';

const serviceManager = new VerificationServiceManager();

// Initialize services from environment variables
if (process.env.NEVERBOUNCE_API_KEY) {
  // serviceManager.registerService(new NeverBounceService({ ... }));
}

export async function POST(request: NextRequest) {
  const identifier = getClientIdentifier(request);
  const rateLimit = rateLimiter.checkRateLimit(identifier, RATE_LIMIT_CONFIG.single);

  if (!rateLimit.allowed) {
    return APIResponse.rateLimited(rateLimit.resetTime);
  }

  try {
    const { email, useExternalService = false, enableDnsCheck = true } = await request.json();

    if (!email || typeof email !== 'string') {
      return APIResponse.error('Email is required', 'MISSING_EMAIL');
    }

    const startTime = Date.now();

    let validationResult;

    if (useExternalService && serviceManager) {
      // Use external verification service
      validationResult = await serviceManager.validateWithBestService(email);
    } else {
      // Use internal validation
      const domain = email.split('@')[1];
      
      const [syntaxValid, domainValid, disposable, roleBased, freeProvider, mxRecords] = await Promise.all([
        Promise.resolve(EmailValidator.validateSyntax(email)),
        Promise.resolve(EmailValidator.validateDomain(email)),
        Promise.resolve(EmailValidator.isDisposableEmail(email)),
        Promise.resolve(EmailValidator.isRoleBasedEmail(email)),
        Promise.resolve(EmailValidator.isFreeProvider(email)),
        enableDnsCheck && domain ? DNSChecker.checkMXRecords(domain) : Promise.resolve(true)
      ]);

      const checks = {
        syntax: syntaxValid,
        domain: domainValid,
        mxRecords: enableDnsCheck ? mxRecords : true,
        disposable,
        roleBased,
        freeProvider
      };

      const qualityScore = EmailValidator.calculateQualityScore(checks);
      const riskLevel = EmailValidator.getRiskLevel(qualityScore, checks);
      const suggestions = EmailValidator.getSuggestions(checks);

      validationResult = {
        email,
        isValid: syntaxValid && domainValid && (enableDnsCheck ? mxRecords : true),
        checks,
        qualityScore,
        riskLevel,
        suggestions: suggestions.length > 0 ? suggestions : undefined
      };
    }

    const processingTime = Date.now() - startTime;

    return APIResponse.success({
      ...validationResult,
      processingTime,
      rateLimit: {
        remaining: rateLimit.remaining,
        resetTime: new Date(rateLimit.resetTime).toISOString()
      }
    });

  } catch (error) {
    console.error('Email validation error:', error);
    return APIResponse.error(
      'Failed to validate email',
      'VALIDATION_FAILED',
      500
    );
  }
}

export async function GET(request: NextRequest) {
  // For testing/demo purposes - validate email from query parameter
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return APIResponse.error('Email query parameter is required', 'MISSING_EMAIL');
  }

  return POST(request);
}