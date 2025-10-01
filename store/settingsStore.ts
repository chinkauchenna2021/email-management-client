// store/settingsStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SettingsService } from '@/services/settingsService';

interface UserSettings {
  notifications: {
    email: boolean;
    browser: boolean;
  };
  emailDefaults: {
    fromName: string;
    replyTo: string;
  };
  security: {
    twoFactorAuth: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    language: string;
  };
}

interface AppSettings {
  app: {
    name: string;
    version: string;
    description: string;
  };
  features: {
    maxEmailLists: number;
    maxDomains: number;
    maxTemplates: number;
    maxAutomations: number;
    maxRecipientsPerCampaign: number;
    maxDailyEmails: number;
  };
  smtp: {
    providers: string[];
    defaultSecurity: string;
  };
  security: {
    passwordMinLength: number;
    requireSpecialChars: boolean;
    sessionTimeout: number;
  };
}

interface SettingsState {
  userSettings: UserSettings | null;
  appSettings: AppSettings | null;
  isLoading: boolean;
  error: string | null;
  
  fetchUserSettings: () => Promise<void>;
  fetchAppSettings: () => Promise<void>;
  updateUserSettings: (settings: Partial<UserSettings>) => Promise<void>;
  clearError: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      userSettings: null,
      appSettings: null,
      isLoading: false,
      error: null,

      fetchUserSettings: async () => {
        set({ isLoading: true, error: null });
        try {
          const settings = await SettingsService.getUserSettings();
          set({ userSettings: settings, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      fetchAppSettings: async () => {
        set({ isLoading: true, error: null });
        try {
          const settings = await SettingsService.getAppSettings();
          set({ appSettings: settings, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      updateUserSettings: async (settings: Partial<UserSettings>) => {
        set({ isLoading: true, error: null });
        try {
          const updatedSettings = await SettingsService.updateUserSettings(settings);
          set({ userSettings: updatedSettings, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'settings-storage',
      partialize: (state) => ({
        userSettings: state.userSettings,
        appSettings: state.appSettings,
      }),
    }
  )
);