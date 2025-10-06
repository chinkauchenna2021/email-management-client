// store/campaignStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CampaignService } from '@/services/campaignService';

interface Campaign {
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

interface CampaignStats {
  totalEmails: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  complained: number;
  openRate: number;
  clickRate: number;
}

interface CampaignState {
  campaigns: Campaign[];
  currentCampaign: Campaign | null;
  campaignStats: CampaignStats | null;
  isLoading: boolean;
  error: string | null;
  
  fetchCampaigns: () => Promise<void>;
  createCampaign: (campaign: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateCampaign: (campaignId: string, updates: Partial<Campaign>) => Promise<void>;
  deleteCampaign: (campaignId: string) => Promise<void>;
  sendCampaign: (campaignId: string) => Promise<void>;
  getCampaignDetails: (campaignId: string) => Promise<void>;
  getCampaignStats: (campaignId: string) => Promise<void>;
  getOverallCampaignStats: () => Promise<void>;
  retryFailedEmails: (campaignId: string) => Promise<void>;
  setCurrentCampaign: (campaign: Campaign | null) => void;
  clearError: () => void;
}

export const useCampaignStore = create<CampaignState>()(
  persist(
    (set, get) => ({
      campaigns: [], // Ensure this is always an array
      currentCampaign: null,
      campaignStats: null,
      isLoading: false,
      error: null,

      fetchCampaigns: async () => {
        set({ isLoading: true, error: null });
        try {
          const campaigns = await CampaignService.getUserCampaigns();
          // Ensure campaigns is always an array
          set({ campaigns: campaigns || [], isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      createCampaign: async (campaignData) => {
        set({ isLoading: true, error: null });
        try {
          const campaign = await CampaignService.createCampaign(campaignData);
          set((state) => ({
            // Ensure state.campaigns is always an array
            campaigns: [campaign, ...(state.campaigns || [])],
            isLoading: false,
          }));
          return campaign;
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      updateCampaign: async (campaignId: string, updates) => {
        set({ isLoading: true, error: null });
        try {
          const updatedCampaign = await CampaignService.updateCampaign(campaignId, updates);
          set((state) => ({
            // Ensure state.campaigns is always an array
            campaigns: (state.campaigns || []).map(c => c.id === campaignId ? updatedCampaign : c),
            currentCampaign: state.currentCampaign?.id === campaignId ? updatedCampaign : state.currentCampaign,
            isLoading: false,
          }));
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      deleteCampaign: async (campaignId: string) => {
        set({ isLoading: true, error: null });
        try {
          await CampaignService.deleteCampaign(campaignId);
          set((state) => ({
            // Ensure state.campaigns is always an array
            campaigns: (state.campaigns || []).filter(c => c.id !== campaignId),
            currentCampaign: state.currentCampaign?.id === campaignId ? null : state.currentCampaign,
            isLoading: false,
          }));
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      sendCampaign: async (campaignId: string) => {
        set({ isLoading: true, error: null });
        try {
          const result = await CampaignService.sendCampaign(campaignId);
          set((state) => ({
            // Ensure state.campaigns is always an array
            campaigns: (state.campaigns || []).map(c => c.id === campaignId ? { ...c, status: 'SENDING' } : c),
            currentCampaign: state.currentCampaign?.id === campaignId ? { ...state.currentCampaign, status: 'SENDING' } : state.currentCampaign,
            isLoading: false,
          }));
          return result;
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      getCampaignDetails: async (campaignId: string) => {
        set({ isLoading: true, error: null });
        try {
          const campaign = await CampaignService.getCampaignDetails(campaignId);
          set({ currentCampaign: campaign, isLoading: false });
          return campaign;
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      getCampaignStats: async (campaignId: string) => {
        set({ isLoading: true, error: null });
        try {
          const stats = await CampaignService.getCampaignStats(campaignId);
          set({ campaignStats: stats, isLoading: false });
          return stats;
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      getOverallCampaignStats: async () => {
        set({ isLoading: true, error: null });
        try {
          const stats = await CampaignService.getOverallCampaignStats();
          set({ campaignStats: stats, isLoading: false });
          return stats;
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      retryFailedEmails: async (campaignId: string) => {
        set({ isLoading: true, error: null });
        try {
          const result = await CampaignService.retryFailedEmails(campaignId);
          set({ isLoading: false });
          return result;
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      setCurrentCampaign: (campaign: Campaign | null) => {
        set({ currentCampaign: campaign });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'campaign-storage',
      partialize: (state) => ({
        campaigns: state.campaigns,
        currentCampaign: state.currentCampaign,
      }),
      // Add a merge function to ensure campaigns is always an array
      merge: (persistedState:any, currentState) => {
        // Ensure campaigns is always an array
        const campaigns = Array.isArray(persistedState?.campaigns as any) 
          ? persistedState.campaigns as any
          : currentState.campaigns;
        
        return {
          ...currentState,
          ...persistedState as any,
          campaigns,
        };
      },
    }
  )
);