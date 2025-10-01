// store/automationStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AutomationService } from '@/services/automationService';

interface Automation {
  id: string;
  name: string;
  description?: string;
  trigger: string;
  conditions: any;
  actions: any[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AutomationExecution {
  id: string;
  automationId: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  startedAt?: string;
  completedAt?: string;
  result?: any;
  createdAt: string;
}

interface AutomationState {
  automations: Automation[];
  currentAutomation: Automation | null;
  executions: AutomationExecution[];
  isLoading: boolean;
  error: string | null;
  
  fetchAutomations: () => Promise<void>;
  createAutomation: (automation: Omit<Automation, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateAutomation: (automationId: string, updates: Partial<Automation>) => Promise<void>;
  deleteAutomation: (automationId: string) => Promise<void>;
  getAutomation: (automationId: string) => Promise<void>;
  toggleAutomation: (automationId: string) => Promise<void>;
  scheduleAutomation: (automationId: string) => Promise<void>;
  setCurrentAutomation: (automation: Automation | null) => void;
  clearError: () => void;
}

export const useAutomationStore = create<AutomationState>()(
  persist(
    (set, get) => ({
      automations: [],
      currentAutomation: null,
      executions: [],
      isLoading: false,
      error: null,

      fetchAutomations: async () => {
        set({ isLoading: true, error: null });
        try {
          const automations = await AutomationService.getUserAutomations();
          set({ automations, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      createAutomation: async (automationData) => {
        set({ isLoading: true, error: null });
        try {
          const automation = await AutomationService.createAutomation(automationData);
          set((state) => ({
            automations: [automation, ...state.automations],
            isLoading: false,
          }));
          return automation;
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      updateAutomation: async (automationId: string, updates) => {
        set({ isLoading: true, error: null });
        try {
          const updatedAutomation = await AutomationService.updateAutomation(automationId, updates);
          set((state) => ({
            automations: state.automations.map(a => a.id === automationId ? updatedAutomation : a),
            currentAutomation: state.currentAutomation?.id === automationId ? updatedAutomation : state.currentAutomation,
            isLoading: false,
          }));
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      deleteAutomation: async (automationId: string) => {
        set({ isLoading: true, error: null });
        try {
          await AutomationService.deleteAutomation(automationId);
          set((state) => ({
            automations: state.automations.filter(a => a.id !== automationId),
            currentAutomation: state.currentAutomation?.id === automationId ? null : state.currentAutomation,
            isLoading: false,
          }));
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      getAutomation: async (automationId: string) => {
        set({ isLoading: true, error: null });
        try {
          const automation = await AutomationService.getAutomation(automationId);
          set({ currentAutomation: automation, isLoading: false });
          return automation;
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      toggleAutomation: async (automationId: string) => {
        set({ isLoading: true, error: null });
        try {
          const result = await AutomationService.toggleAutomation(automationId);
          set((state) => ({
            automations: state.automations.map(a => 
              a.id === automationId ? { ...a, isActive: !a.isActive } : a
            ),
            currentAutomation: state.currentAutomation?.id === automationId 
              ? { ...state.currentAutomation, isActive: !state.currentAutomation.isActive }
              : state.currentAutomation,
            isLoading: false,
          }));
          return result;
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      scheduleAutomation: async (automationId: string) => {
        set({ isLoading: true, error: null });
        try {
          await AutomationService.scheduleAutomation(automationId);
          set({ isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      setCurrentAutomation: (automation: Automation | null) => {
        set({ currentAutomation: automation });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'automation-storage',
      partialize: (state) => ({
        automations: state.automations,
        currentAutomation: state.currentAutomation,
      }),
    }
  )
);