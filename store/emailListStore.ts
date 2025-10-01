// store/emailListStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { EmailListService } from '@/services/emailListService';

interface EmailList {
  id: string;
  name: string;
  description?: string;
  totalEmails: number;
  validEmails: number;
  invalidEmails: number;
  createdAt: string;
  updatedAt: string;
}

interface Email {
  id: string;
  address: string;
  valid: boolean;
  listId: string;
  createdAt: string;
  updatedAt: string;
}

interface EmailListState {
  emailLists: EmailList[];
  currentList: EmailList | null;
  emails: Email[];
  isLoading: boolean;
  error: string | null;
  
  fetchEmailLists: () => Promise<void>;
  createEmailList: (name: string, description?: string, emails?: string[]) => Promise<void>;
  updateEmailList: (listId: string, updates: Partial<EmailList>) => Promise<void>;
  deleteEmailList: (listId: string) => Promise<void>;
  getEmailListWithStats: (listId: string) => Promise<void>;
  getAllEmailListsWithStats: () => Promise<void>;
  addEmailsToList: (listId: string, emails: string[]) => Promise<void>;
  getEmailsInList: (listId: string, page?: number, limit?: number) => Promise<void>;
  validateEmailBatch: (emails: string[]) => Promise<any>;
  setCurrentList: (list: EmailList | null) => void;
  clearError: () => void;
}

export const useEmailListStore = create<EmailListState>()(
  persist(
    (set, get) => ({
      emailLists: [],
      currentList: null,
      emails: [],
      isLoading: false,
      error: null,

      fetchEmailLists: async () => {
        set({ isLoading: true, error: null });
        try {
          const emailLists = await EmailListService.getUserEmailLists();
          set({ emailLists, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      createEmailList: async (name: string, description?: string, emails: string[] = []) => {
        set({ isLoading: true, error: null });
        try {
          const emailList = await EmailListService.createEmailList(name, description, emails);
          set((state) => ({
            emailLists: [emailList, ...state.emailLists],
            isLoading: false,
          }));
          return emailList;
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      updateEmailList: async (listId: string, updates: Partial<EmailList>) => {
        set({ isLoading: true, error: null });
        try {
          const updatedList = await EmailListService.updateEmailList(listId, updates);
          set((state) => ({
            emailLists: state.emailLists.map(l => l.id === listId ? updatedList : l),
            currentList: state.currentList?.id === listId ? updatedList : state.currentList,
            isLoading: false,
          }));
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      deleteEmailList: async (listId: string) => {
        set({ isLoading: true, error: null });
        try {
          await EmailListService.deleteEmailList(listId);
          set((state) => ({
            emailLists: state.emailLists.filter(l => l.id !== listId),
            currentList: state.currentList?.id === listId ? null : state.currentList,
            isLoading: false,
          }));
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      getEmailListWithStats: async (listId: string) => {
        set({ isLoading: true, error: null });
        try {
          const emailList = await EmailListService.getEmailListWithStats(listId);
          set({ currentList: emailList, isLoading: false });
          return emailList;
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      getAllEmailListsWithStats: async () => {
        set({ isLoading: true, error: null });
        try {
          const emailLists = await EmailListService.getAllEmailListsWithStats();
          set({ emailLists, isLoading: false });
          return emailLists;
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      addEmailsToList: async (listId: string, emails: string[]) => {
        set({ isLoading: true, error: null });
        try {
          const result = await EmailListService.addEmailsToList(listId, emails);
          set((state) => ({
            currentList: state.currentList?.id === listId 
              ? { ...state.currentList, totalEmails: state.currentList.totalEmails + emails.length }
              : state.currentList,
            isLoading: false,
          }));
          return result;
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      getEmailsInList: async (listId: string, page = 1, limit = 20) => {
        set({ isLoading: true, error: null });
        try {
          const result = await EmailListService.getEmailsInList(listId, page, limit);
          set({ emails: result.emails, isLoading: false });
          return result;
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      validateEmailBatch: async (emails: string[]) => {
        set({ isLoading: true, error: null });
        try {
          const result = await EmailListService.validateEmailBatch(emails);
          set({ isLoading: false });
          return result;
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      setCurrentList: (list: EmailList | null) => {
        set({ currentList: list });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'email-list-storage',
      partialize: (state) => ({
        emailLists: state.emailLists,
        currentList: state.currentList,
      }),
    }
  )
);