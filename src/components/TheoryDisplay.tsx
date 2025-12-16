'use client'

import { Box, Text, Card3D } from './atoms'
import { TheoryContent } from '@/lib/data/types'
import { useTranslation } from '@/lib/hooks/useTranslation'

interface TheoryDisplayProps {
  theory: TheoryContent
}

export function TheoryDisplay({ theory }: TheoryDisplayProps) {
  const { t } = useTranslation()

  return (
    <Box flex direction="col" gap="lg">
      {theory.title && (
        <Text variant="h4" weight="bold" color="primary">
          {theory.title}
        </Text>
      )}

      <Card3D
        padding="lg"
        style={{
          backgroundColor: '#F0F9FF',
          borderLeft: '4px solid #3B82F6',
        }}
      >
        <Box flex direction="col" gap="md">
          <Box flex align="center" gap="sm">
            <span style={{ fontSize: '24px' }}>📖</span>
            <Text variant="small" color="muted" weight="semibold">
              {t('theorySection') || 'Theory'}
            </Text>
          </Box>

          <Text
            variant="body"
            style={{
              whiteSpace: 'pre-wrap',
              lineHeight: '1.8',
            }}
          >
            {theory.text}
          </Text>
        </Box>
      </Card3D>

      <Text variant="small" color="muted" style={{ textAlign: 'center' }}>
        {t('readAndContinue') || 'Read the material above and continue to the next problem'}
      </Text>
    </Box>
  )
}
