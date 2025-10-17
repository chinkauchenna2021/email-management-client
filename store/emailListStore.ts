// store/emailListStore.ts - Updated version
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { EmailListService } from '@/services/emailListService';

export interface EmailList {
  subscriberCount: number;
  id: string;
  name: string;
  description?: string;
  totalEmails: number;
  emailCount?: number;
  validEmails: number;
  invalidEmails: number;
  createdAt: string;
  updatedAt: string;
  stats?: {
    invalidEmails: number;
    validEmails: number;
    validityRate: number;
  }
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
  createEmailList: (name: string, description?: string, emails?: string[]) => Promise<EmailList>;
  updateEmailList: (listId: string, updates: Partial<EmailList>) => Promise<EmailList>;
  deleteEmailList: (listId: string) => Promise<void>;
  getEmailListWithStats: (listId: string) => Promise<EmailList>;
  getAllEmailListsWithStats: () => Promise<EmailList[]>;
  addEmailsToList: (listId: string, emails: string[]) => Promise<any>;
  getEmailsInList: (listId: string, page?: number, limit?: number) => Promise<void>;
  validateEmailBatch: (emails: string[]) => Promise<any>;
  setCurrentList: (list: EmailList | null) => void;
  clearError: () => void;
}

// Helper function to normalize email list data
const normalizeEmailList = (list: any): EmailList => {
  if (!list) {
    throw new Error('Email list data is null or undefined');
  }

  return {
    id: String(list.id || ''),
    name: String(list.name || ''),
    description: list.description ? String(list.description) : undefined,
    subscriberCount: Number(list.subscriberCount || list.emailCount || 0),
    totalEmails: Number(list.totalEmails || list.emailCount || 0),
    emailCount: Number(list.emailCount || list.totalEmails || 0),
    validEmails: Number(list.validEmails || list.stats?.validEmails || 0),
    invalidEmails: Number(list.invalidEmails || list.stats?.invalidEmails || 0),
    createdAt: String(list.createdAt || ''),
    updatedAt: String(list.updatedAt || ''),
    stats: {
      validEmails: Number(list.stats?.validEmails || list.validEmails || 0),
      invalidEmails: Number(list.stats?.invalidEmails || list.invalidEmails || 0),
      validityRate: Number(list.stats?.validityRate || 
        (list.validEmails && list.totalEmails ? (list.validEmails / list.totalEmails) * 100 : 0))
    }
  };
};

const normalizeEmailLists = (lists: any[]): EmailList[] => {
  if (!Array.isArray(lists)) {
    return [];
  }
  
  return lists.map(list => {
    try {
      return normalizeEmailList(list);
    } catch (error) {
      console.error('Error normalizing email list:', error);
      return null;
    }
  }).filter(Boolean) as EmailList[];
};

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
          const response = await EmailListService.getUserEmailLists();
          
          // Handle different response structures
          let listsArray: any[] = [];
          
          if (Array.isArray(response)) {
            listsArray = response;
          } else if (response && Array.isArray(response.emailLists)) {
            listsArray = response.emailLists;
          } else if (response && response.data && Array.isArray(response.data)) {
            listsArray = response.data;
          }
          
          const normalizedLists = normalizeEmailLists(listsArray);
          set({ emailLists: normalizedLists, isLoading: false });
        } catch (error: any) {
          console.error('Error fetching email lists:', error);
          set({ 
            error: error.message || 'Failed to fetch email lists', 
            isLoading: false, 
            emailLists: [] 
          });
        }
      },

      createEmailList: async (name: string, description?: string, emails: string[] = []) => {
        set({ isLoading: true, error: null });
        try {
          const response = await EmailListService.createEmailList(name, description, emails);
          
          // Extract email list from response
          let newListData = response;
          if (response && response.emailList) {
            newListData = response.emailList;
          } else if (response && response.data) {
            newListData = response.data;
          }
          
          const normalizedList = normalizeEmailList(newListData);
          
          // Force update the email lists array - ADD TO BEGINNING for immediate visibility
          set((state: { emailLists: any; }) => ({
            emailLists: [normalizedList, ...state.emailLists],
            isLoading: false,
          }));
          
          return normalizedList;
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      updateEmailList: async (listId: string, updates: Partial<EmailList>) => {
        set({ isLoading: true, error: null });
        try {
          const response = await EmailListService.updateEmailList(listId, updates);
          
          let updatedListData = response;
          if (response && response.emailList) {
            updatedListData = response.emailList;
          } else if (response && response.data) {
            updatedListData = response.data;
          }
          
          const normalizedList = normalizeEmailList(updatedListData);
          
          set((state: { emailLists: any[]; currentList: { id: string; }; }) => ({
            emailLists: state.emailLists.map(l => l.id === listId ? normalizedList : l),
            currentList: state.currentList?.id === listId ? normalizedList : state.currentList,
            isLoading: false,
          }));
          
          return normalizedList;
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      deleteEmailList: async (listId: string) => {
        console.log('Deleting email list:', listId);
        set({ isLoading: true, error: null });
        try {
          await EmailListService.deleteEmailList(listId);
          set((state: { emailLists: any[]; currentList: { id: string; }; }) => ({
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
          const response = await EmailListService.getEmailListWithStats(listId);
          let listData = response;
          if (response && response.emailList) {
            listData = response.emailList;
          } else if (response && response.data) {
            listData = response.data;
          }
          
          const normalizedList = normalizeEmailList(listData);
          set({ currentList: normalizedList, isLoading: false });
          return normalizedList;
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      getAllEmailListsWithStats: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await EmailListService.getAllEmailListsWithStats();
          let listsArray: any[] = [];
          
          if (Array.isArray(response)) {
            listsArray = response;
          } else if (response && Array.isArray(response.emailLists)) {
            listsArray = response.emailLists;
          } else if (response && response.data && Array.isArray(response.data)) {
            listsArray = response.data;
          }
          
          const normalizedLists = normalizeEmailLists(listsArray);
          set({ emailLists: normalizedLists, isLoading: false });
          return normalizedLists;
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      addEmailsToList: async (listId: string, emails: string[]) => {
        set({ isLoading: true, error: null });
        try {
          const result = await EmailListService.addEmailsToList(listId, emails);
          
          // Update the list stats after adding emails
          const updatedList = await get().getEmailListWithStats(listId);
          
          set((state: { emailLists: any[]; currentList: { id: string; }; }) => ({
            emailLists: state.emailLists.map(l => l.id === listId ? updatedList : l),
            currentList: state.currentList?.id === listId ? updatedList : state.currentList,
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
          set({ emails: result.emails || [], isLoading: false });
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
      merge: (persistedState: any, currentState: any) => {
        const persistedLists = Array.isArray(persistedState?.emailLists) 
          ? normalizeEmailLists(persistedState.emailLists)
          : [];
          
        const persistedCurrentList = persistedState?.currentList 
          ? normalizeEmailList(persistedState.currentList)
          : null;

        return {
          ...currentState,
          emailLists: persistedLists,
          currentList: persistedCurrentList,
        };
      },
    }
  )
);