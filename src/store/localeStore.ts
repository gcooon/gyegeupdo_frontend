import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type Locale, defaultLocale, isValidLocale } from '@/i18n/config';

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: defaultLocale,
      setLocale: (locale: Locale) => {
        if (isValidLocale(locale)) {
          set({ locale });
        }
      },
    }),
    {
      name: 'locale-storage',
      // Initialize with browser language on first load
      onRehydrateStorage: () => (state) => {
        if (typeof window !== 'undefined' && state) {
          const browserLang = navigator.language.split('-')[0];
          if (isValidLocale(browserLang) && !localStorage.getItem('locale-storage')) {
            state.setLocale(browserLang as Locale);
          }
        }
      },
    }
  )
);
