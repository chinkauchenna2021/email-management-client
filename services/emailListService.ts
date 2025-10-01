// services/emailListService.ts
import { api } from '@/lib/api';

export const EmailListService = {
  async getUserEmailLists() {
    const response = await api.get('/emails/lists');
    return response.data;
  },

  async createEmailList(name: string, description?: string, emails: string[] = []) {
    const response = await api.post('/emails/lists', { name, description, emails });
    return response.data;
  },

  async updateEmailList(listId: string, updates: any) {
    const response = await api.put(`/emails/lists/${listId}`, updates);
    return response.data;
  },

  async deleteEmailList(listId: string) {
    const response = await api.delete(`/emails/lists/${listId}`);
    return response.data;
  },

  async getEmailListWithStats(listId: string) {
    const response = await api.get(`/emails/lists/${listId}`);
    return response.data;
  },

  async getAllEmailListsWithStats() {
    const response = await api.get('/emails/lists');
    return response.data;
  },

  async addEmailsToList(listId: string, emails: string[]) {
    const response = await api.post(`/emails/lists/${listId}/emails`, { emails });
    return response.data;
  },

  async getEmailsInList(listId: string, page = 1, limit = 20) {
    const response = await api.get(`/emails/lists/${listId}/emails`, {
      params: { page, limit }
    });
    return response.data;
  },

  async validateEmailBatch(emails: string[]) {
    const response = await api.post('/emails/validate', { emails });
    return response.data;
  }
};