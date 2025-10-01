// services/automationService.ts
import { api } from '@/lib/api';

export const AutomationService = {
  async getUserAutomations() {
    const response = await api.get('/automation');
    return response.data;
  },

  async createAutomation(automationData: any) {
    const response = await api.post('/automation', automationData);
    return response.data;
  },

  async updateAutomation(automationId: string, updates: any) {
    const response = await api.put(`/automation/${automationId}`, updates);
    return response.data;
  },

  async deleteAutomation(automationId: string) {
    const response = await api.delete(`/automation/${automationId}`);
    return response.data;
  },

  async getAutomation(automationId: string) {
    const response = await api.get(`/automation/${automationId}`);
    return response.data;
  },

  async toggleAutomation(automationId: string) {
    const response = await api.post(`/automation/${automationId}/toggle`);
    return response.data;
  },

  async scheduleAutomation(automationId: string) {
    const response = await api.post(`/automation/${automationId}/schedule`);
    return response.data;
  }
};