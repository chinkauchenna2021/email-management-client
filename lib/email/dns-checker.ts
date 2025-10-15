// lib/email/dns-checker.ts
import dns from 'node:dns/promises';
import { DNSRecord } from './types';

export class DNSChecker {
  static async checkMXRecords(domain: string): Promise<boolean> {
    try {
      const records = await dns.resolveMx(domain);
      return Array.isArray(records) && records.length > 0;
    } catch (error) {
      return false;
    }
  }

  static async checkARecords(domain: string): Promise<boolean> {
    try {
      const records = await dns.resolve4(domain);
      return Array.isArray(records) && records.length > 0;
    } catch (error) {
      return false;
    }
  }

  static async getAllDNSRecords(domain: string): Promise<DNSRecord[]> {
    const records: DNSRecord[] = [];

    try {
      // Check MX records
      try {
        const mxRecords = await dns.resolveMx(domain);
        records.push(...mxRecords.map(record => ({
          type: 'MX',
          value: record.exchange,
          priority: record.priority
        })));
      } catch (error) {
        // MX records not found
      }

      // Check A records
      try {
        const aRecords = await dns.resolve4(domain);
        records.push(...aRecords.map(value => ({
          type: 'A',
          value
        })));
      } catch (error) {
        // A records not found
      }

      // Check TXT records (for SPF, DMARC)
      try {
        const txtRecords = await dns.resolveTxt(domain);
        records.push(...txtRecords.flat().map(value => ({
          type: 'TXT',
          value
        })));
      } catch (error) {
        // TXT records not found
      }

    } catch (error) {
      console.error(`DNS lookup failed for domain: ${domain}`, error);
    }

    return records;
  }

  static async validateDomain(domain: string): Promise<{
    hasMX: boolean;
    hasA: boolean;
    records: DNSRecord[];
  }> {
    const [hasMX, hasA, records] = await Promise.all([
      this.checkMXRecords(domain),
      this.checkARecords(domain),
      this.getAllDNSRecords(domain)
    ]);

    return { hasMX, hasA, records };
  }
}