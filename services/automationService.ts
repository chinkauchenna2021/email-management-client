// services/automationService.ts
import { api } from '@/lib/api';

export const AutomationService = {
  async getUserAutomations() {
    const response = await api.get('/automations');
    return response.data;
  },

  async createAutomation(automationData: any) {
    const response = await api.post('/automations', automationData);
    return response.data;
  },

  async updateAutomation(automationId: string, updates: any) {
    const response = await api.put(`/automationd/${automationId}`, updates);
    return response.data;
  },

  async deleteAutomation(automationId: string) {
    const response = await api.delete(`/automations/${automationId}`);
    return response.data;
  },

  async getAutomation(automationId: string) {
    const response = await api.get(`/automations/${automationId}`);
    return response.data;
  },

  async toggleAutomation(automationId: string) {
    const response = await api.post(`/automations/${automationId}/toggle`);
    return response.data;
  },

  async scheduleAutomation(automationId: string) {
    const response = await api.post(`/automations/${automationId}/schedule`);
    return response.data;
  }
};