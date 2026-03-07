import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface SidebarState {
  isOpen: boolean;
  expandedCategories: string[];
  _hasHydrated: boolean;

  toggle: () => void;
  open: () => void;
  close: () => void;
  toggleCategory: (categorySlug: string) => void;
  expandCategory: (categorySlug: string) => void;
  collapseCategory: (categorySlug: string) => void;
  setHasHydrated: (state: boolean) => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isOpen: true,
      expandedCategories: [],
      _hasHydrated: false,

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

      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: 'sidebar-storage',
      storage: createJSONStorage(() => {
        if (typeof window === 'undefined') {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return localStorage;
      }),
      partialize: (state) => ({
        expandedCategories: state.expandedCategories,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
