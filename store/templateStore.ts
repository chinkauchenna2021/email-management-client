// store/templateStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TemplateService } from '@/services/templateService';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

interface TemplateState {
  templates: EmailTemplate[];
  currentTemplate: EmailTemplate | null;
  categories: string[];
  isLoading: boolean;
  error: string | null;
  
  fetchTemplates: () => Promise<void>;
  createTemplate: (template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTemplate: (templateId: string, updates: Partial<EmailTemplate>) => Promise<void>;
  deleteTemplate: (templateId: string) => Promise<void>;
  getTemplate: (templateId: string) => Promise<void>;
  getTemplateCategories: () => Promise<void>;
  useTemplate: (templateId: string) => Promise<any>;
  setCurrentTemplate: (template: EmailTemplate | null) => void;
  clearError: () => void;
}

export const useTemplateStore = create<TemplateState>()(
  persist(
    (set, get) => ({
      templates: [],
      currentTemplate: null,
      categories: [],
      isLoading: false,
      error: null,

      fetchTemplates: async () => {
        set({ isLoading: true, error: null });
        try {
          const templates = await TemplateService.getUserTemplates();
          set({ templates, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      createTemplate: async (templateData) => {
        set({ isLoading: true, error: null });
        try {
          const template = await TemplateService.createTemplate(templateData);
          set((state) => ({
            templates: [template, ...state.templates],
            isLoading: false,
          }));
          return template;
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      updateTemplate: async (templateId: string, updates) => {
        set({ isLoading: true, error: null });
        try {
          const updatedTemplate = await TemplateService.updateTemplate(templateId, updates);
          set((state) => ({
            templates: state.templates.map(t => t.id === templateId ? updatedTemplate : t),
            currentTemplate: state.currentTemplate?.id === templateId ? updatedTemplate : state.currentTemplate,
            isLoading: false,
          }));
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      deleteTemplate: async (templateId: string) => {
        set({ isLoading: true, error: null });
        try {
          await TemplateService.deleteTemplate(templateId);
          set((state) => ({
            templates: state.templates.filter(t => t.id !== templateId),
            currentTemplate: state.currentTemplate?.id === templateId ? null : state.currentTemplate,
            isLoading: false,
          }));
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      getTemplate: async (templateId: string) => {
        set({ isLoading: true, error: null });
        try {
          const template = await TemplateService.getTemplate(templateId);
          set({ currentTemplate: template, isLoading: false });
          return template;
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      getTemplateCategories: async () => {
        set({ isLoading: true, error: null });
        try {
          const categories = await TemplateService.getTemplateCategories();
          set({ categories, isLoading: false });
          return categories;
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      useTemplate: async (templateId: string) => {
        set({ isLoading: true, error: null });
        try {
          const result = await TemplateService.useTemplate(templateId);
          set({ isLoading: false });
          return result;
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      setCurrentTemplate: (template: EmailTemplate | null) => {
        set({ currentTemplate: template });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'template-storage',
      partialize: (state) => ({
        templates: state.templates,
        currentTemplate: state.currentTemplate,
        categories: state.categories,
      }),
    }
  )
);