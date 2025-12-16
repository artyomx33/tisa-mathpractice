'use client'

import { CSSProperties } from 'react'
import { useAppStore } from '@/lib/store'
import { Language } from '@/lib/i18n'
import { Box, Text } from './atoms'

export function LanguageSelector() {
  const { language, setLanguage } = useAppStore()

  const buttonStyle = (isActive: boolean): CSSProperties => ({
    padding: '8px 16px',
    borderRadius: '8px',
    border: isActive ? '2px solid #7C3AED' : '2px solid #E5E7EB',
    backgroundColor: isActive ? '#F3E8FF' : '#FFFFFF',
    cursor: 'pointer',
    transition: 'all 150ms ease',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  })

  const handleSelect = (lang: Language) => {
    setLanguage(lang)
  }

  return (
    <Box flex align="center" gap="sm">
      <button
        style={buttonStyle(language === 'ru')}
        onClick={() => handleSelect('ru')}
      >
        <span style={{ fontSize: '16px' }}>🇷🇺</span>
        <Text variant="small" weight={language === 'ru' ? 'semibold' : 'normal'}>
          RU
        </Text>
      </button>
      <button
        style={buttonStyle(language === 'en')}
        onClick={() => handleSelect('en')}
      >
        <span style={{ fontSize: '16px' }}>🇬🇧</span>
        <Text variant="small" weight={language === 'en' ? 'semibold' : 'normal'}>
          EN
        </Text>
      </button>
    </Box>
  )
}
