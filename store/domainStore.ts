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

// Helper function to ensure domain data is properly formatted
const normalizeDomain = (domain: any): Domain => {
  if (!domain) {
    throw new Error('Domain data is null or undefined');
  }

  return {
    id: String(domain.id || ''),
    domain: String(domain.domain || ''),
    verified: Boolean(domain.verified),
    dkimKey: domain.dkimKey ? String(domain.dkimKey) : undefined,
    spfRecord: domain.spfRecord ? String(domain.spfRecord) : undefined,
    dmarcRecord: domain.dmarcRecord ? String(domain.dmarcRecord) : undefined,
    reputation: Number(domain.reputation || 0),
    smtpProvider: domain.smtpProvider ? String(domain.smtpProvider) : undefined,
    smtpHost: domain.smtpHost ? String(domain.smtpHost) : undefined,
    smtpPort: domain.smtpPort ? Number(domain.smtpPort) : undefined,
    smtpSecurity: domain.smtpSecurity ? String(domain.smtpSecurity) : undefined,
    smtpUsername: domain.smtpUsername ? String(domain.smtpUsername) : undefined,
    smtpPassword: domain.smtpPassword ? String(domain.smtpPassword) : undefined,
    dailyLimit: domain.dailyLimit ? Number(domain.dailyLimit) : undefined,
    enableDomainWarmup: Boolean(domain.enableDomainWarmup),
    testEmail: domain.testEmail ? String(domain.testEmail) : undefined,
    textMessage: domain.textMessage ? String(domain.textMessage) : undefined,
    createdAt: String(domain.createdAt || ''),
    updatedAt: String(domain.updatedAt || ''),
  };
};

const normalizeDomains = (domains: any[]): Domain[] => {
  if (!Array.isArray(domains)) {
    return [];
  }
  
  return domains.map(domain => {
    try {
      return normalizeDomain(domain);
    } catch (error) {
      console.error('Error normalizing domain:', error);
      return null;
    }
  }).filter(Boolean) as Domain[];
};

export const useDomainStore = create<DomainState>()(
  persist(
    (set, get) => ({
      domains: [],
      currentDomain: null,
      isLoading: false,
      error: null,

      fetchDomains: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await DomainService.getUserDomains();
          
          // Handle different response structures
          let domainsArray: any[] = [];
          
          if (Array.isArray(response)) {
            domainsArray = response;
          } else if (response && Array.isArray(response.domains)) {
            domainsArray = response.domains;
          } else if (response && response.data && Array.isArray(response.data)) {
            domainsArray = response.data;
          }
          
          const normalizedDomains = normalizeDomains(domainsArray);
          set({ domains: normalizedDomains, isLoading: false });
        } catch (error: any) {
          console.error('Error fetching domains:', error);
          set({ 
            error: error.message || 'Failed to fetch domains', 
            isLoading: false, 
            domains: [] 
          });
        }
      },

      // addDomain: async (domain: string, smtpSettings = {}) => {
      //   set({ isLoading: true, error: null });
      //   try {
      //     const result = await DomainService.addDomain(domain, smtpSettings);
          
      //     // Extract domain from response
      //     let newDomainData = result;
      //     if (result && result.domain) {
      //       newDomainData = result.domain;
      //     } else if (result && result.data) {
      //       newDomainData = result.data;
      //     }
          
      //     const normalizedDomain = normalizeDomain(newDomainData);
          
      //     set((state: { domains: any; }) => ({
      //       domains: [...state.domains, normalizedDomain],
      //       isLoading: false,
      //     }));
          
      //     return normalizedDomain;
      //   } catch (error: any) {
      //     set({ error: error.message, isLoading: false });
      //     throw error;
      //   }
      // },


        addDomain: async (domain: string, smtpSettings = {}) => {
          set({ isLoading: true, error: null });
          try {
            const result = await DomainService.addDomain(domain, smtpSettings);
            
            // Extract domain from response
            let newDomainData = result;
            if (result && result.domain) {
              newDomainData = result.domain;
            } else if (result && result.data) {
              newDomainData = result.data;
            }
            
            const normalizedDomain = normalizeDomain(newDomainData);
            
            // Force update the domains list
            set((state: { domains: any; }) => ({
              domains: [normalizedDomain, ...state.domains], // Add to beginning for immediate visibility
              isLoading: false,
            }));
            
            return normalizedDomain;
          } catch (error: any) {
            set({ error: error.message, isLoading: false });
            throw error;
          }
        },


      updateDomain: async (domainId: string, updates: Partial<Domain>) => {
        set({ isLoading: true, error: null });
        try {
          const result = await DomainService.updateDomainSettings(domainId, updates);
          
          let updatedDomainData = result;
          if (result && result.domain) {
            updatedDomainData = result.domain;
          } else if (result && result.data) {
            updatedDomainData = result.data;
          }
          
          const normalizedDomain = normalizeDomain(updatedDomainData);
          
          set((state: { domains: any[]; currentDomain: { id: string; }; }) => ({
            domains: state.domains.map(d => d.id === domainId ? normalizedDomain : d),
            currentDomain: state.currentDomain?.id === domainId ? normalizedDomain : state.currentDomain,
            isLoading: false,
          }));
          
          return normalizedDomain;
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

deleteDomain: async (domainId: string) => {
  console.log('Deleting domain:', domainId);
  console.log('Current domains before delete:', get().domains.map((d: { id: any; domain: any; }) => ({ id: d.id, domain: d.domain })));
  set({ isLoading: true, error: null });
  try {
    await DomainService.deleteDomain(domainId);
    set((state: { domains: any[]; currentDomain: { id: string; }; }) => ({
      domains: state.domains.filter(d => d.id !== domainId),
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
          
          let verifiedDomainData = result;
          if (result && result.domain) {
            verifiedDomainData = result.domain;
          } else if (result && result.data) {
            verifiedDomainData = result.data;
          }
          
          const normalizedDomain = normalizeDomain(verifiedDomainData);
          
          set((state: { domains: any[]; currentDomain: { id: string; }; }) => ({
            domains: state.domains.map(d => d.id === domainId ? normalizedDomain : d),
            currentDomain: state.currentDomain?.id === domainId ? normalizedDomain : state.currentDomain,
            isLoading: false,
          }));
          
          return normalizedDomain;
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
      merge: (persistedState: any, currentState: any) => {
        const persistedDomains = Array.isArray(persistedState?.domains) 
          ? normalizeDomains(persistedState.domains)
          : [];
          
        const persistedCurrentDomain = persistedState?.currentDomain 
          ? normalizeDomain(persistedState.currentDomain)
          : null;

        return {
          ...currentState,
          domains: persistedDomains,
          currentDomain: persistedCurrentDomain,
        };
      },
    }
  )
);