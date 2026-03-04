import { create } from 'zustand';
import { TierLevel } from '@/lib/tier';
import { FootWidth, Pronation, UsageType } from '@/types/user';

interface FilterState {
  // Model filters
  selectedTiers: TierLevel[];
  selectedShoeType: string | null;
  selectedUsage: string | null;
  selectedWidth: string | null;
  priceMax: number | null;
  selectedBrand: string | null;

  // User profile filters (for "similar user" feature)
  userFootWidth: FootWidth | null;
  userPronation: Pronation | null;
  userUsageType: UsageType | null;

  // Actions
  setTiers: (tiers: TierLevel[]) => void;
  toggleTier: (tier: TierLevel) => void;
  setShoeType: (type: string | null) => void;
  setUsage: (usage: string | null) => void;
  setWidth: (width: string | null) => void;
  setPriceMax: (price: number | null) => void;
  setBrand: (brand: string | null) => void;
  setUserProfile: (profile: { footWidth?: FootWidth; pronation?: Pronation; usageType?: UsageType }) => void;
  resetFilters: () => void;
}

const initialState = {
  selectedTiers: [],
  selectedShoeType: null,
  selectedUsage: null,
  selectedWidth: null,
  priceMax: null,
  selectedBrand: null,
  userFootWidth: null,
  userPronation: null,
  userUsageType: null,
};

export const useFilterStore = create<FilterState>((set) => ({
  ...initialState,

  setTiers: (tiers) => set({ selectedTiers: tiers }),

  toggleTier: (tier) =>
    set((state) => ({
      selectedTiers: state.selectedTiers.includes(tier)
        ? state.selectedTiers.filter((t) => t !== tier)
        : [...state.selectedTiers, tier],
    })),

  setShoeType: (type) => set({ selectedShoeType: type }),
  setUsage: (usage) => set({ selectedUsage: usage }),
  setWidth: (width) => set({ selectedWidth: width }),
  setPriceMax: (price) => set({ priceMax: price }),
  setBrand: (brand) => set({ selectedBrand: brand }),

  setUserProfile: (profile) =>
    set({
      userFootWidth: profile.footWidth ?? null,
      userPronation: profile.pronation ?? null,
      userUsageType: profile.usageType ?? null,
    }),

  resetFilters: () => set(initialState),
}));
