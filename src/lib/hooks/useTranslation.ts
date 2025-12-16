'use client'

import { useAppStore } from '@/lib/store'
import { translations, TranslationKey } from '@/lib/i18n'
import { translateContent } from '@/lib/i18n/contentTranslations'

export function useTranslation() {
  const language = useAppStore((state) => state.language)

  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations.en[key] || key
  }

  // Translate dynamic content (exercise titles, chapters, etc.)
  const tc = (text: string): string => {
    return translateContent(text, language)
  }

  return { t, tc, language }
}
