'use client';

import { useCallback } from 'react';
import { useLocaleStore } from '@/store/localeStore';
import koMessages from './ko.json';
import enMessages from './en.json';
import type { Locale } from './config';

type Messages = typeof koMessages;
type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}.${NestedKeyOf<T[K]>}` | K
          : K
        : never;
    }[keyof T]
  : never;

type TranslationKey = NestedKeyOf<Messages>;

const messages: Record<Locale, Messages> = {
  ko: koMessages,
  en: enMessages,
};

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.');
  let current: unknown = obj;

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path; // Return key if not found
    }
  }

  return typeof current === 'string' ? current : path;
}

export function useTranslations(namespace?: string) {
  const { locale } = useLocaleStore();
  const currentMessages = messages[locale];

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      const fullKey = namespace ? `${namespace}.${key}` : key;
      let translation = getNestedValue(currentMessages as Record<string, unknown>, fullKey);

      // Replace parameters like {count} with actual values
      if (params) {
        Object.entries(params).forEach(([paramKey, value]) => {
          translation = translation.replace(`{${paramKey}}`, String(value));
        });
      }

      return translation;
    },
    [locale, namespace, currentMessages]
  );

  return t;
}

// Hook for getting all translations of a namespace
export function useMessages(namespace: string): Record<string, string> {
  const { locale } = useLocaleStore();
  const currentMessages = messages[locale];
  const result = getNestedValue(currentMessages as Record<string, unknown>, namespace);
  if (typeof result === 'object' && result !== null) {
    return result as unknown as Record<string, string>;
  }
  return {};
}
