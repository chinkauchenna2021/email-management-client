// services/templateService.ts
import { api } from '@/lib/api';

export const TemplateService = {
  async getUserTemplates() {
    const response = await api.get('/templates');
    return response.data;
  },

  async createTemplate(templateData: any) {
    const response = await api.post('/templates', templateData);
    return response.data;
  },

  async updateTemplate(templateId: string, updates: any) {
    const response = await api.put(`/templates/${templateId}`, updates);
    return response.data;
  },

  async deleteTemplate(templateId: string) {
    const response = await api.delete(`/templates/${templateId}`);
    return response.data;
  },

  async getTemplate(templateId: string) {
    const response = await api.get(`/templates/${templateId}`);
    return response.data;
  },

  async getTemplateCategories() {
    const response = await api.get('/templates/categories');
    return response.data;
  },

  async useTemplate(templateId: string) {
    const response = await api.post(`/templates/${templateId}/use`);
    return response.data;
  }
};