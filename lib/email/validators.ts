// lib/email/validators.ts
import { EmailValidationResult } from './types';

export class EmailValidator {
  // Common disposable email domains
  private static readonly DISPOSABLE_DOMAINS = new Set([
    'tempmail.com', 'guerrillamail.com', 'mailinator.com', '10minutemail.com',
    'throwawaymail.com', 'fakeinbox.com', 'yopmail.com', 'getairmail.com',
    'temp-mail.org', 'trashmail.com', 'disposableemail.com'
  ]);

  // Common role-based prefixes
  private static readonly ROLE_BASED_PREFIXES = new Set([
    'admin', 'administrator', 'webmaster', 'info', 'support', 'contact',
    'sales', 'help', 'service', 'newsletter', 'noreply', 'no-reply',
    'team', 'office', 'hr', 'jobs', 'careers', 'marketing', 'media'
  ]);

  // Free email providers
  private static readonly FREE_PROVIDERS = new Set([
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com',
    'protonmail.com', 'icloud.com', 'zoho.com', 'yandex.com'
  ]);

  static validateSyntax(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
  }

  static validateDomain(email: string): boolean {
    const domain = email.split('@')[1];
    if (!domain) return false;
    
    // Basic domain validation
    const domainRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return domainRegex.test(domain);
  }

  static isDisposableEmail(email: string): boolean {
    const domain = email.split('@')[1]?.toLowerCase();
    return domain ? this.DISPOSABLE_DOMAINS.has(domain) : false;
  }

  static isRoleBasedEmail(email: string): boolean {
    const localPart = email.split('@')[0]?.toLowerCase();
    return localPart ? this.ROLE_BASED_PREFIXES.has(localPart) : false;
  }

  static isFreeProvider(email: string): boolean {
    const domain = email.split('@')[1]?.toLowerCase();
    return domain ? this.FREE_PROVIDERS.has(domain) : false;
  }

  static calculateQualityScore(checks: EmailValidationResult['checks']): number {
    let score = 100;

    // Deduct points for various risk factors
    if (!checks.syntax) score -= 40;
    if (!checks.domain) score -= 30;
    if (!checks.mxRecords) score -= 20;
    if (checks.disposable) score -= 25;
    if (checks.roleBased) score -= 10;
    if (checks.freeProvider) score -= 5;

    return Math.max(0, score);
  }

  static getRiskLevel(qualityScore: number, checks: EmailValidationResult['checks']): 'low' | 'medium' | 'high' {
    if (qualityScore >= 80 && checks.syntax && checks.domain && checks.mxRecords) {
      return 'low';
    } else if (qualityScore >= 50 && checks.syntax && checks.domain) {
      return 'medium';
    } else {
      return 'high';
    }
  }

  static getSuggestions(checks: EmailValidationResult['checks']): string[] {
    const suggestions: string[] = [];

    if (!checks.syntax) {
      suggestions.push('Email has invalid syntax');
    }
    if (!checks.domain) {
      suggestions.push('Domain name is invalid');
    }
    if (!checks.mxRecords) {
      suggestions.push('Domain does not accept emails (no MX records)');
    }
    if (checks.disposable) {
      suggestions.push('Email uses disposable/temporary service');
    }
    if (checks.roleBased) {
      suggestions.push('Email appears to be role-based (may have lower engagement)');
    }

    return suggestions;
  }
}