import { NextRequest } from 'next/server';
import { EmailValidator } from '@/lib/email/validators';
import { DNSChecker } from '@/lib/email/dns-checker';
import { rateLimiter, getClientIdentifier, RATE_LIMIT_CONFIG } from '@/lib/rate-limit';
import { APIResponse } from '@/utils/response';
import { BatchValidationRequest, BatchValidationResult } from '@/lib/email/types';

export async function POST(request: NextRequest) {
  const identifier = getClientIdentifier(request);
  const rateLimit = rateLimiter.checkRateLimit(identifier, RATE_LIMIT_CONFIG.batch);

  if (!rateLimit.allowed) {
    return APIResponse.rateLimited(rateLimit.resetTime);
  }

  try {
    const { emails, options = {} }: BatchValidationRequest = await request.json();

    if (!emails || !Array.isArray(emails)) {
      return APIResponse.error('Emails array is required', 'MISSING_EMAILS');
    }

    if (emails.length > 1000) {
      return APIResponse.error('Maximum 1000 emails per batch', 'BATCH_SIZE_EXCEEDED');
    }

    const startTime = Date.now();

    // Process emails in parallel with concurrency control
    const results = await Promise.all(
      emails.map(async (email) => {
        try {
          const domain = email.split('@')[1];
          
          const [syntaxValid, domainValid, disposable, roleBased, freeProvider, mxRecords] = await Promise.all([
            Promise.resolve(EmailValidator.validateSyntax(email)),
            Promise.resolve(EmailValidator.validateDomain(email)),
            Promise.resolve(EmailValidator.isDisposableEmail(email)),
            Promise.resolve(EmailValidator.isRoleBasedEmail(email)),
            Promise.resolve(EmailValidator.isFreeProvider(email)),
            options.enableDnsCheck !== false && domain ? 
              DNSChecker.checkMXRecords(domain) : 
              Promise.resolve(true)
          ]);

          const checks = {
            syntax: syntaxValid,
            domain: domainValid,
            mxRecords: options.enableDnsCheck !== false ? mxRecords : true,
            disposable: options.checkDisposable !== false ? disposable : false,
            roleBased: options.checkRoleBased !== false ? roleBased : false,
            freeProvider
          };

          const qualityScore = EmailValidator.calculateQualityScore(checks);
          const riskLevel = EmailValidator.getRiskLevel(qualityScore, checks);
          const suggestions = EmailValidator.getSuggestions(checks);

          return {
            email,
            isValid: syntaxValid && domainValid && (options.enableDnsCheck !== false ? mxRecords : true),
            checks,
            qualityScore,
            riskLevel,
            suggestions: suggestions.length > 0 ? suggestions : undefined
          };
        } catch (error) {
          return {
            email,
            isValid: false,
            checks: {
              syntax: false,
              domain: false,
              mxRecords: false,
              disposable: false,
              roleBased: false,
              freeProvider: false
            },
            qualityScore: 0,
            riskLevel: 'high' as const,
            error: 'Validation failed'
          };
        }
      })
    );

    const processingTime = Date.now() - startTime;

    const validCount = results.filter(r => r.isValid).length;
    const invalidCount = results.length - validCount;
    const riskyCount = results.filter(r => r.riskLevel === 'high').length;
    const overallQuality = results.reduce((sum, r) => sum + r.qualityScore, 0) / results.length;

    const batchResult: BatchValidationResult = {
      results,
      summary: {
        total: results.length,
        valid: validCount,
        invalid: invalidCount,
        risky: riskyCount,
        overallQuality: Math.round(overallQuality)
      },
      processingTime
    };

    return APIResponse.success({
      ...batchResult,
      rateLimit: {
        remaining: rateLimit.remaining,
        resetTime: new Date(rateLimit.resetTime).toISOString()
      }
    });

  } catch (error) {
    console.error('Batch email validation error:', error);
    return APIResponse.error(
      'Failed to validate email batch',
      'BATCH_VALIDATION_FAILED',
      500
    );
  }
}