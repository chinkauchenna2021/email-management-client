// services/domainService.ts
import { api } from '@/lib/api';

export const DomainService = {
  async getUserDomains() {
    const response = await api.get('/domains');
    return response.data;
  },

  async addDomain(domain: string, smtpSettings: any) {
    const response = await api.post('/domains', { domain, smtpSettings });
    return response.data;
  },

  async updateDomainSettings(domainId: string, smtpSettings: any) {
    const response = await api.put(`/domains/${domainId}/settings`, { smtpSettings });
    return response.data;
  },

  async deleteDomain(domainId: string) {
    const response = await api.delete(`/domains/${domainId}`);
    return response.data;
  },

  async verifyDomain(domainId: string) {
    const response = await api.post(`/domains/${domainId}/verify`);
    return response.data;
  },

  async testSmtpSettings(domainId: string) {
    const response = await api.post(`/domains/${domainId}/test-smtp`);
    return response.data;
  },

  async getDomainStats(domainId: string) {
    const response = await api.get(`/domains/${domainId}/stats`);
    return response.data;
  },

  async getAllDomainsWithStats() {
    const response = await api.get('/domains/stats');
    return response.data;
  }
};