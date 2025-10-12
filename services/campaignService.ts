import { api } from '@/lib/api';

export interface Campaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  status: 'DRAFT' | 'READY' | 'SCHEDULED' | 'SENDING' | 'SENT' | 'FAILED' | 'PAUSED';
  scheduledAt?: string;
  sentAt?: string;
  domainId: string;
  listId: string;
  templateId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignStats {
  totalEmails: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  complained: number;
  openRate: number;
  clickRate: number;
}

export interface CreateCampaignData {
  name: string;
  subject: string;
  content: string;
  domainId: string;
  listId: string;
  templateId?: string;
  scheduledAt?: string;
  status: 'DRAFT' | 'READY' | 'SCHEDULED';
  saveAsDraft?: boolean;
}

export const CampaignService = {
  async getUserCampaigns() {
    const response = await api.get('/campaigns');
    return response.data.campaigns || [];
  },

  async createCampaign(campaignData: CreateCampaignData) {
    const response = await api.post('/campaigns', campaignData);
    return response.data.campaign;
  },

  async updateCampaign(campaignId: string, updates: any) {
    const response = await api.put(`/campaigns/${campaignId}`, updates);
    return response.data.campaign;
  },

  async deleteCampaign(campaignId: string) {
    await api.delete(`/campaigns/${campaignId}`);
  },

  async sendCampaign(campaignId: string) {
    const response = await api.post(`/campaigns/${campaignId}/send`);
    return response.data;
  },

  async getCampaignDetails(campaignId: string) {
    const response = await api.get(`/campaigns/${campaignId}`);
    return response.data.campaign;
  },

  async getCampaignStats(campaignId: string) {
    const response = await api.get(`/campaigns/${campaignId}/stats`);
    return response.data.stats;
  },

  async getOverallCampaignStats() {
    const response = await api.get('/campaigns/stats');
    return response.data;
  },

  async retryFailedEmails(campaignId: string) {
    const response = await api.post(`/campaigns/${campaignId}/retry`);
    return response.data;
  },

  async getRecentCampaigns(limit: number = 4) {
    const response = await api.get(`/campaigns/recent?limit=${limit}`);
    return response.data;
  }
};