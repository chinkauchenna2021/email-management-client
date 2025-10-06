// store/domainStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DomainService } from '@/services/domainService';

interface Domain {
  id: string;
  domain: string;
  verified: boolean;
  dkimKey?: string;
  spfRecord?: string;
  dmarcRecord?: string;
  reputation: number;
  smtpProvider?: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpSecurity?: string;
  smtpUsername?: string;
  smtpPassword?: string;
  dailyLimit?: number;
  enableDomainWarmup: boolean;
  testEmail?: string;
  textMessage?: string;
  createdAt: string;
  updatedAt: string;
}

interface DomainState {
  domains: Domain[];
  currentDomain: Domain | null;
  isLoading: boolean;
  error: string | null;
  
  fetchDomains: () => Promise<void>;
  addDomain: (domain: string, smtpSettings?: any) => Promise<void>;
  updateDomain: (domainId: string, updates: Partial<Domain>) => Promise<void>;
  deleteDomain: (domainId: string) => Promise<void>;
  verifyDomain: (domainId: string) => Promise<void>;
  testSmtpSettings: (domainId: string) => Promise<void>;
  getDomainStats: (domainId: string) => Promise<any>;
  setCurrentDomain: (domain: Domain | null) => void;
  clearError: () => void;
}

export const useDomainStore = create<DomainState>()(
  persist(
    (set, get) => ({
      domains: [], // This should already be an array
      currentDomain: null,
      isLoading: false,
      error: null,

      fetchDomains: async () => {
        set({ isLoading: true, error: null });
        try {
          const domains = await DomainService.getUserDomains();
          // Double ensure it's an array
          set({ domains: Array.isArray(domains) ? domains : [], isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false, domains: [] });
        }
      },

      addDomain: async (domain: string, smtpSettings = {}) => {
        set({ isLoading: true, error: null });
        try {
          const result = await DomainService.addDomain(domain, smtpSettings);
          set((state) => ({
            // Ensure state.domains is always an array
            domains: [...(state.domains || []), result.domain],
            isLoading: false,
          }));
          return result;
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      updateDomain: async (domainId: string, updates: Partial<Domain>) => {
        set({ isLoading: true, error: null });
        try {
          const updatedDomain = await DomainService.updateDomainSettings(domainId, updates);
          set((state) => ({
            // Ensure state.domains is always an array
            domains: (state.domains || []).map(d => d.id === domainId ? updatedDomain : d),
            currentDomain: state.currentDomain?.id === domainId ? updatedDomain : state.currentDomain,
            isLoading: false,
          }));
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      deleteDomain: async (domainId: string) => {
        set({ isLoading: true, error: null });
        try {
          await DomainService.deleteDomain(domainId);
          set((state) => ({
            // Ensure state.domains is always an array
            domains: (state.domains || []).filter(d => d.id !== domainId),
            currentDomain: state.currentDomain?.id === domainId ? null : state.currentDomain,
            isLoading: false,
          }));
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      verifyDomain: async (domainId: string) => {
        set({ isLoading: true, error: null });
        try {
          const result = await DomainService.verifyDomain(domainId);
          set((state) => ({
            // Ensure state.domains is always an array
            domains: (state.domains || []).map(d => d.id === domainId ? result.domain : d),
            currentDomain: state.currentDomain?.id === domainId ? result.domain : state.currentDomain,
            isLoading: false,
          }));
          return result;
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      testSmtpSettings: async (domainId: string) => {
        set({ isLoading: true, error: null });
        try {
          const result = await DomainService.testSmtpSettings(domainId);
          set({ isLoading: false });
          return result;
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      getDomainStats: async (domainId: string) => {
        set({ isLoading: true, error: null });
        try {
          const stats = await DomainService.getDomainStats(domainId);
          set({ isLoading: false });
          return stats;
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      setCurrentDomain: (domain: Domain | null) => {
        set({ currentDomain: domain });
      },

      clearError: () => set({ error: null }),
    }),
 {
      name: 'domain-storage',
      partialize: (state) => ({
        domains: state.domains,
        currentDomain: state.currentDomain,
      }),
      merge: (persistedState: any, currentState) => {
        // Ensure domains is always an array during merge
        const domains = Array.isArray(persistedState?.domains) 
          ? persistedState.domains 
          : [];
        
        return {
          ...currentState,
          ...persistedState,
          domains,
        };
      },
    }
  )
);