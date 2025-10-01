// services/campaignService.ts
import { api } from '@/lib/api';

export const CampaignService = {
  async getUserCampaigns() {
    const response = await api.get('/campaigns');
    return response.data;
  },

  async createCampaign(campaignData: any) {
    const response = await api.post('/campaigns', campaignData);
    return response.data;
  },

  async updateCampaign(campaignId: string, updates: any) {
    const response = await api.put(`/campaigns/${campaignId}`, updates);
    return response.data;
  },

  async deleteCampaign(campaignId: string) {
    const response = await api.delete(`/campaigns/${campaignId}`);
    return response.data;
  },

  async sendCampaign(campaignId: string) {
    const response = await api.post(`/campaigns/${campaignId}/send`);
    return response.data;
  },

  async getCampaignDetails(campaignId: string) {
    const response = await api.get(`/campaigns/${campaignId}`);
    return response.data;
  },

  async getCampaignStats(campaignId: string) {
    const response = await api.get(`/campaigns/${campaignId}/stats`);
    return response.data;
  },

  async getOverallCampaignStats() {
    const response = await api.get('/campaigns/stats');
    return response.data;
  },

  async retryFailedEmails(campaignId: string) {
    const response = await api.post(`/campaigns/${campaignId}/retry`);
    return response.data;
  },

  async getFilteredCampaigns(filters: any) {
    const response = await api.get('/campaigns', { params: filters });
    return response.data;
  }
};