// lib/email/types.ts
export interface EmailValidationResult {
  email: string;
  isValid: boolean;
  checks: {
    syntax: boolean;
    domain: boolean;
    mxRecords: boolean;
    disposable: boolean;
    roleBased: boolean;
    freeProvider: boolean;
  };
  qualityScore: number; // 0-100
  riskLevel: 'low' | 'medium' | 'high';
  suggestions?: string[];
  error?: string;
}

export interface BatchValidationRequest {
  emails: string[];
  options?: {
    enableDnsCheck?: boolean;
    checkDisposable?: boolean;
    checkRoleBased?: boolean;
    timeout?: number;
  };
}

export interface BatchValidationResult {
  results: EmailValidationResult[];
  summary: {
    total: number;
    valid: number;
    invalid: number;
    risky: number;
    overallQuality: number;
  };
  processingTime: number;
}

export interface VerificationServiceConfig {
  name: string;
  apiKey: string;
  baseUrl: string;
  priority: number;
  enabled: boolean;
}

export interface DNSRecord {
  type: string;
  value: string;
  priority?: number;
}