// app/api/email/verification-services/route.ts
import { NextRequest } from 'next/server';
import { rateLimiter, getClientIdentifier, RATE_LIMIT_CONFIG } from '@/lib/rate-limit';
import { APIResponse } from '@/utils/response';
import { FREE_VERIFICATION_SERVICES, serviceManager, VerificationServiceRequest, VerificationServiceResponse } from '@/lib/verificationServiceManager';




export async function POST(request: NextRequest) {
  const identifier = getClientIdentifier(request);
  const rateLimit = rateLimiter.checkRateLimit(identifier, RATE_LIMIT_CONFIG.single);

  if (!rateLimit.allowed) {
    return APIResponse.rateLimited(rateLimit.resetTime);
  }

  try {
    const { email, service, enableAdvancedChecks = true }: VerificationServiceRequest = await request.json();

    if (!email || typeof email !== 'string') {
      return APIResponse.error('Email is required', 'MISSING_EMAIL');
    }

    const startTime = Date.now();

    let result: VerificationServiceResponse;

    if (service) {
      result = await serviceManager.validateWithService(email, service);
    } else {
      // Use best available service (advanced by default)
      result = await serviceManager.validateWithBestService(email);
    }

    const processingTime = Date.now() - startTime;

    return APIResponse.success({
      ...result,
      processingTime,
      rateLimit: {
        remaining: rateLimit.remaining,
        resetTime: new Date(rateLimit.resetTime).toISOString()
      }
    });

  } catch (error: any) {
    console.error('Free verification service error:', error);
    
    return APIResponse.error(
      error.message || 'Failed to validate email',
      'VALIDATION_FAILED',
      500
    );
  }
}

export async function GET(request: NextRequest) {
  const identifier = getClientIdentifier(request);
  const rateLimit = rateLimiter.checkRateLimit(identifier, RATE_LIMIT_CONFIG.single);

  if (!rateLimit.allowed) {
    return APIResponse.rateLimited(rateLimit.resetTime);
  }

  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const service = searchParams.get('service') as keyof typeof FREE_VERIFICATION_SERVICES;

    if (!email) {
      return APIResponse.error('Email query parameter is required', 'MISSING_EMAIL');
    }

    const startTime = Date.now();

    let result: VerificationServiceResponse;

    if (service) {
      result = await serviceManager.validateWithService(email, service);
    } else {
      result = await serviceManager.validateWithBestService(email);
    }

    const processingTime = Date.now() - startTime;

    return APIResponse.success({
      ...result,
      processingTime,
      rateLimit: {
        remaining: rateLimit.remaining,
        resetTime: new Date(rateLimit.resetTime).toISOString()
      }
    });

  } catch (error: any) {
    console.error('Free verification service error:', error);
    return APIResponse.error(
      error.message || 'Failed to validate email',
      'VALIDATION_FAILED',
      500
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const services = serviceManager.getAvailableServices();
    const status = serviceManager.getServiceStatus();

    return APIResponse.success({
      availableServices: services,
      serviceStatus: status,
      features: {
        dnsValidation: 'Comprehensive DNS-based email verification',
        syntaxChecking: 'RFC-compliant email syntax validation',
        domainVerification: 'Domain existence and configuration checks',
        mxRecordChecking: 'Mail exchange server validation',
        securityAnalysis: 'SPF and DMARC record analysis',
        riskAssessment: 'Disposable and role-based email detection',
        typoDetection: 'Common email typo identification',
        qualityScoring: '0-100 quality score with risk levels'
      },
      limitations: {
        note: 'This is a free service using DNS lookups and pattern analysis',
        smtpVerification: 'Basic simulation (full SMTP verification requires email sending)',
        catchAllDetection: 'Heuristic-based (not 100% accurate)',
        realTimeValidation: 'Limited to DNS-based checks for privacy and performance'
      }
    });
  } catch (error: any) {
    return APIResponse.error(
      'Failed to get service information',
      'SERVICE_INFO_FAILED',
      500
    );
  }
}