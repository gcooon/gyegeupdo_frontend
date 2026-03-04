import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SidebarState {
  isOpen: boolean;
  expandedCategories: string[];

  toggle: () => void;
  open: () => void;
  close: () => void;
  toggleCategory: (categorySlug: string) => void;
  expandCategory: (categorySlug: string) => void;
  collapseCategory: (categorySlug: string) => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isOpen: true,
      expandedCategories: ['running-shoes'],

      toggle: () => set((state) => ({ isOpen: !state.isOpen })),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),

      toggleCategory: (categorySlug) =>
        set((state) => ({
          expandedCategories: state.expandedCategories.includes(categorySlug)
            ? state.expandedCategories.filter((c) => c !== categorySlug)
            : [...state.expandedCategories, categorySlug],
        })),

      expandCategory: (categorySlug) =>
        set((state) => ({
          expandedCategories: state.expandedCategories.includes(categorySlug)
            ? state.expandedCategories
            : [...state.expandedCategories, categorySlug],
        })),

      collapseCategory: (categorySlug) =>
        set((state) => ({
          expandedCategories: state.expandedCategories.filter((c) => c !== categorySlug),
        })),
    }),
    {
      name: 'sidebar-storage',
      partialize: (state) => ({
        expandedCategories: state.expandedCategories,
      }),
    }
  )
);
