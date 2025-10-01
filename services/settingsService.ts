// services/settingsService.ts
import { api } from '@/lib/api';
export const SettingsService = {
  async getUserSettings() {
    const response = await api.get('/settings');
    return response.data;
  },

  async updateUserSettings(settings: any) {
    const response = await api.put('/settings', { settings });
    return response.data;
  },

  async getAppSettings() {
    const response = await api.get('/settings/app');
    return response.data;
  }
};