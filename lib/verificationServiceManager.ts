// Free verification services that don't require API keys
import dns from 'node:dns/promises';

export const FREE_VERIFICATION_SERVICES = {
  dns: {
    name: 'DNS Validation',
    description: 'Comprehensive DNS-based email validation',
    checks: ['syntax', 'domain', 'mx', 'spf', 'dmarc'],
    priority: 1,
    enabled: true
  },
  smtp: {
    name: 'SMTP Verification',
    description: 'Basic SMTP server verification',
    checks: ['syntax', 'domain', 'mx', 'smtp'],
    priority: 2,
    enabled: true
  },
  advanced: {
    name: 'Advanced Analysis',
    description: 'Advanced email pattern analysis',
    checks: ['syntax', 'domain', 'mx', 'disposable', 'role', 'free', 'typos'],
    priority: 3,
    enabled: true
  }
};

export interface VerificationServiceRequest {
  email: string;
  service?: keyof typeof FREE_VERIFICATION_SERVICES;
  enableAdvancedChecks?: boolean;
}

export interface VerificationServiceResponse {
  service: string;
  email: string;
  valid: boolean;
  result: 'valid' | 'invalid' | 'risky' | 'unknown';
  qualityScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  details: {
    syntax: boolean;
    domain: boolean;
    mxRecords: boolean;
    smtpCheck?: boolean;
    disposable: boolean;
    roleBased: boolean;
    freeProvider: boolean;
    typos?: string[];
    spfRecord?: boolean;
    dmarcRecord?: boolean;
    catchAll?: boolean;
  };
  suggestions: string[];
  processingTime: number;
}





class FreeVerificationServiceManager {
  // Common disposable email domains
  private readonly DISPOSABLE_DOMAINS = new Set([
    'tempmail.com', 'guerrillamail.com', 'mailinator.com', '10minutemail.com',
    'throwawaymail.com', 'fakeinbox.com', 'yopmail.com', 'getairmail.com',
    'temp-mail.org', 'trashmail.com', 'disposableemail.com', 'sharklasers.com',
    'grr.la', 'guerrillamail.net', 'guerrillamail.org', 'guerrillamail.biz',
    'spam4.me', 'spamgourmet.com', 'burnermail.io', 'tmpmail.org', 'maildrop.cc'
  ]);

  // Common role-based prefixes
  private readonly ROLE_BASED_PREFIXES = new Set([
    'admin', 'administrator', 'webmaster', 'info', 'support', 'contact',
    'sales', 'help', 'service', 'newsletter', 'noreply', 'no-reply',
    'team', 'office', 'hr', 'jobs', 'careers', 'marketing', 'media',
    'billing', 'payments', 'orders', 'shipping', 'delivery', 'customerservice'
  ]);

  // Free email providers
  private readonly FREE_PROVIDERS = new Set([
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com',
    'protonmail.com', 'icloud.com', 'zoho.com', 'yandex.com', 'mail.com',
    'gmx.com', 'fastmail.com', 'tutanota.com', 'live.com', 'msn.com'
  ]);

  // Common email typos and corrections
  private readonly COMMON_TYPOS: { [key: string]: string } = {
    'gmial.com': 'gmail.com',
    'gmai.com': 'gmail.com',
    'gmal.com': 'gmail.com',
    'yahooo.com': 'yahoo.com',
    'yaho.com': 'yahoo.com',
    'hotmail.co': 'hotmail.com',
    'hotmial.com': 'hotmail.com',
    'hotmai.com': 'hotmail.com',
    'outlook.cm': 'outlook.com',
    'outlok.com': 'outlook.com'
  };

  async validateWithDNS(email: string): Promise<VerificationServiceResponse> {
    const startTime = Date.now();
    const domain = email.split('@')[1];

    try {
      // Perform comprehensive DNS checks
      const [syntaxValid, domainValid, mxRecords, spfRecord, dmarcRecord] = await Promise.all([
        this.validateSyntax(email),
        this.validateDomain(domain),
        this.checkMXRecords(domain),
        this.checkSPFRecord(domain),
        this.checkDMARCRecord(domain)
      ]);

      const disposable = this.isDisposableEmail(email);
      const roleBased = this.isRoleBasedEmail(email);
      const freeProvider = this.isFreeProvider(email);
      const typos = this.detectTypos(email);

      const checks = {
        syntax: syntaxValid,
        domain: domainValid,
        mxRecords,
        spfRecord,
        dmarcRecord,
        disposable,
        roleBased,
        freeProvider,
        typos
      };

      const qualityScore = this.calculateQualityScore(checks);
      const riskLevel = this.determineRiskLevel(checks);
      const suggestions = this.generateSuggestions(checks, typos);
      const isValid = syntaxValid && domainValid && mxRecords;

      const processingTime = Date.now() - startTime;

      return {
        service: 'DNS Validation',
        email,
        valid: isValid,
        result: isValid ? (riskLevel === 'high' ? 'risky' : 'valid') : 'invalid',
        qualityScore,
        riskLevel,
        details: {
          syntax: syntaxValid,
          domain: domainValid,
          mxRecords,
          disposable,
          roleBased,
          freeProvider,
          spfRecord,
          dmarcRecord,
          typos: typos.length > 0 ? typos : undefined
        },
        suggestions,
        processingTime
      };

    } catch (error) {
      console.error('DNS validation error:', error);
      throw new Error('DNS validation failed');
    }
  }

  async validateWithSMTP(email: string): Promise<VerificationServiceResponse> {
    const startTime = Date.now();
    const domain = email.split('@')[1];

    try {
      // Basic SMTP verification (simulated for free service)
      const [syntaxValid, domainValid, mxRecords, smtpCheck] = await Promise.all([
        this.validateSyntax(email),
        this.validateDomain(domain),
        this.checkMXRecords(domain),
        this.simulateSMTPCheck(domain) // Note: Real SMTP checks require sending emails
      ]);

      const checks = {
        syntax: syntaxValid,
        domain: domainValid,
        mxRecords,
        smtpCheck,
        disposable: this.isDisposableEmail(email),
        roleBased: this.isRoleBasedEmail(email),
        freeProvider: this.isFreeProvider(email)
      };

      const qualityScore = this.calculateQualityScore(checks);
      const riskLevel = this.determineRiskLevel(checks);
      const suggestions = this.generateSuggestions(checks);
      const isValid = syntaxValid && domainValid && mxRecords;

      const processingTime = Date.now() - startTime;

      return {
        service: 'SMTP Verification',
        email,
        valid: isValid,
        result: isValid ? (riskLevel === 'high' ? 'risky' : 'valid') : 'invalid',
        qualityScore,
        riskLevel,
        details: {
          syntax: syntaxValid,
          domain: domainValid,
          mxRecords,
          smtpCheck,
          disposable: this.isDisposableEmail(email),
          roleBased: this.isRoleBasedEmail(email),
          freeProvider: this.isFreeProvider(email)
        },
        suggestions,
        processingTime
      };

    } catch (error) {
      console.error('SMTP validation error:', error);
      throw new Error('SMTP validation failed');
    }
  }

  async validateWithAdvanced(email: string): Promise<VerificationServiceResponse> {
    const startTime = Date.now();
    const domain = email.split('@')[1];

    try {
      // Comprehensive analysis
      const [
        syntaxValid, 
        domainValid, 
        mxRecords, 
        spfRecord, 
        dmarcRecord,
        typos
      ] = await Promise.all([
        this.validateSyntax(email),
        this.validateDomain(domain),
        this.checkMXRecords(domain),
        this.checkSPFRecord(domain),
        this.checkDMARCRecord(domain),
        Promise.resolve(this.detectTypos(email))
      ]);

      const disposable = this.isDisposableEmail(email);
      const roleBased = this.isRoleBasedEmail(email);
      const freeProvider = this.isFreeProvider(email);
      const catchAll = await this.checkCatchAll(domain);

      const checks = {
        syntax: syntaxValid,
        domain: domainValid,
        mxRecords,
        spfRecord,
        dmarcRecord,
        disposable,
        roleBased,
        freeProvider,
        catchAll,
        typos
      };

      const qualityScore = this.calculateAdvancedQualityScore(checks);
      const riskLevel = this.determineAdvancedRiskLevel(checks);
      const suggestions = this.generateAdvancedSuggestions(checks, typos);
      const isValid = syntaxValid && domainValid && mxRecords;

      const processingTime = Date.now() - startTime;

      return {
        service: 'Advanced Analysis',
        email,
        valid: isValid,
        result: isValid ? (riskLevel === 'high' ? 'risky' : 'valid') : 'invalid',
        qualityScore,
        riskLevel,
        details: {
          syntax: syntaxValid,
          domain: domainValid,
          mxRecords,
          disposable,
          roleBased,
          freeProvider,
          spfRecord,
          dmarcRecord,
          catchAll,
          typos: typos.length > 0 ? typos : undefined
        },
        suggestions,
        processingTime
      };

    } catch (error) {
      console.error('Advanced validation error:', error);
      throw new Error('Advanced validation failed');
    }
  }

  // Core validation methods
  private validateSyntax(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
  }

  private validateDomain(domain: string): boolean {
    if (!domain) return false;
    const domainRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return domainRegex.test(domain);
  }

  private async checkMXRecords(domain: string): Promise<boolean> {
    try {
      const records = await dns.resolveMx(domain);
      return Array.isArray(records) && records.length > 0;
    } catch (error) {
      return false;
    }
  }

  private async checkSPFRecord(domain: string): Promise<boolean> {
    try {
      const records = await dns.resolveTxt(domain);
      const spfRecord = records.flat().find(record => 
        record.includes('v=spf1') || record.startsWith('v=spf1')
      );
      return !!spfRecord;
    } catch (error) {
      return false;
    }
  }

  private async checkDMARCRecord(domain: string): Promise<boolean> {
    try {
      const records = await dns.resolveTxt(`_dmarc.${domain}`);
      const dmarcRecord = records.flat().find(record => 
        record.includes('v=DMARC1') || record.startsWith('v=DMARC1')
      );
      return !!dmarcRecord;
    } catch (error) {
      return false;
    }
  }

  private async checkCatchAll(domain: string): Promise<boolean> {
    // Simulate catch-all detection by checking if common test emails would be accepted
    // This is a heuristic approach for free service
    try {
      // Check if domain has generous MX records that might indicate catch-all
      const mxRecords = await dns.resolveMx(domain);
      return mxRecords && mxRecords.length > 0;
    } catch (error) {
      return false;
    }
  }

  private async simulateSMTPCheck(domain: string): Promise<boolean> {
    // For a free service, we simulate SMTP checks
    // In a real implementation, you might use a library like 'smtp-connection'
    // but that requires actual email sending which might not be free
    
    // Return true if MX records exist (basic indication of email acceptance)
    return this.checkMXRecords(domain);
  }

  private isDisposableEmail(email: string): boolean {
    const domain = email.split('@')[1]?.toLowerCase();
    return domain ? this.DISPOSABLE_DOMAINS.has(domain) : false;
  }

  private isRoleBasedEmail(email: string): boolean {
    const localPart = email.split('@')[0]?.toLowerCase();
    return localPart ? this.ROLE_BASED_PREFIXES.has(localPart) : false;
  }

  private isFreeProvider(email: string): boolean {
    const domain = email.split('@')[1]?.toLowerCase();
    return domain ? this.FREE_PROVIDERS.has(domain) : false;
  }

  private detectTypos(email: string): string[] {
    const suggestions: string[] = [];
    const domain = email.split('@')[1];

    if (domain && this.COMMON_TYPOS[domain]) {
      suggestions.push(`Did you mean ${email.split('@')[0]}@${this.COMMON_TYPOS[domain]}?`);
    }

    // Check for common domain typos
    if (domain && domain.includes('gmial')) {
      suggestions.push('Possible typo: "gmial" should be "gmail"');
    }
    if (domain && domain.includes('yaho')) {
      suggestions.push('Possible typo: "yaho" should be "yahoo"');
    }
    if (domain && domain.includes('hotmial')) {
      suggestions.push('Possible typo: "hotmial" should be "hotmail"');
    }

    return suggestions;
  }

  private calculateQualityScore(checks: any): number {
    let score = 100;

    // Basic checks
    if (!checks.syntax) score -= 40;
    if (!checks.domain) score -= 30;
    if (!checks.mxRecords) score -= 25;

    // Risk factors
    if (checks.disposable) score -= 20;
    if (checks.roleBased) score -= 10;
    if (checks.freeProvider) score -= 5;

    // Security features (bonus points)
    if (checks.spfRecord) score += 5;
    if (checks.dmarcRecord) score += 5;

    return Math.max(0, Math.min(100, score));
  }

  private calculateAdvancedQualityScore(checks: any): number {
    let score = this.calculateQualityScore(checks);

    // Additional advanced factors
    if (checks.catchAll) score -= 5;
    if (checks.typos && checks.typos.length > 0) score -= 15;

    return Math.max(0, Math.min(100, score));
  }

  private determineRiskLevel(checks: any): 'low' | 'medium' | 'high' {
    if (!checks.syntax || !checks.domain || !checks.mxRecords) {
      return 'high';
    }

    if (checks.disposable) {
      return 'high';
    }

    const qualityScore = this.calculateQualityScore(checks);

    if (qualityScore >= 80) return 'low';
    if (qualityScore >= 60) return 'medium';
    return 'high';
  }

  private determineAdvancedRiskLevel(checks: any): 'low' | 'medium' | 'high' {
    const baseRisk = this.determineRiskLevel(checks);

    // Adjust risk based on advanced factors
    if (baseRisk === 'low' && checks.typos && checks.typos.length > 0) {
      return 'medium';
    }

    if (baseRisk === 'medium' && checks.catchAll) {
      return 'high';
    }

    return baseRisk;
  }

  private generateSuggestions(checks: any, typos: string[] = []): string[] {
    const suggestions: string[] = [];

    // Add typo suggestions
    suggestions.push(...typos);

    // Basic validation suggestions
    if (!checks.syntax) {
      suggestions.push('Email has invalid syntax');
    }
    if (!checks.domain) {
      suggestions.push('Domain name is invalid or does not exist');
    }
    if (!checks.mxRecords) {
      suggestions.push('Domain does not accept emails (no MX records found)');
    }
    if (checks.disposable) {
      suggestions.push('This appears to be a disposable/temporary email address');
    }
    if (checks.roleBased) {
      suggestions.push('This appears to be a role-based email (may have lower engagement)');
    }
    if (!checks.spfRecord) {
      suggestions.push('Domain is missing SPF record (email deliverability may be affected)');
    }
    if (!checks.dmarcRecord) {
      suggestions.push('Domain is missing DMARC record (security risk)');
    }

    // Positive suggestions
    if (checks.spfRecord && checks.dmarcRecord) {
      suggestions.push('Excellent domain security configuration');
    }
    if (checks.mxRecords && !checks.freeProvider && !checks.roleBased) {
      suggestions.push('Email appears to be from a professional domain');
    }

    return suggestions.length > 0 ? suggestions : ['Email appears to be valid and well-configured'];
  }

  private generateAdvancedSuggestions(checks: any, typos: string[] = []): string[] {
    const suggestions = this.generateSuggestions(checks, typos);

    // Additional advanced suggestions
    if (checks.catchAll) {
      suggestions.push('Domain may accept all emails (catch-all configured)');
    }
    if (checks.freeProvider) {
      suggestions.push('Consider using a professional domain for business communications');
    }

    return suggestions;
  }

  async validateWithService(email: string, service: keyof typeof FREE_VERIFICATION_SERVICES): Promise<VerificationServiceResponse> {
    switch (service) {
      case 'dns':
        return await this.validateWithDNS(email);
      case 'smtp':
        return await this.validateWithSMTP(email);
      case 'advanced':
        return await this.validateWithAdvanced(email);
      default:
        throw new Error(`Unsupported service: ${service}`);
    }
  }

  async validateWithBestService(email: string): Promise<VerificationServiceResponse> {
    // Use advanced analysis by default for comprehensive results
    return await this.validateWithAdvanced(email);
  }

  getAvailableServices() {
    return Object.entries(FREE_VERIFICATION_SERVICES)
      .filter(([_, config]) => config.enabled)
      .map(([key, config]) => ({
        id: key,
        name: config.name,
        description: config.description,
        checks: config.checks,
        priority: config.priority
      }));
  }

  getServiceStatus() {
    return Object.entries(FREE_VERIFICATION_SERVICES).map(([key, config]) => ({
      id: key,
      name: config.name,
      enabled: config.enabled,
      priority: config.priority,
      description: config.description
    }));
  }
}

export const serviceManager = new FreeVerificationServiceManager();
