'use client'

import { Box, Text, Card3D } from './atoms'
import { InfoContent } from '@/lib/data/types'

interface InfoDisplayProps {
  info: InfoContent
}

export function InfoDisplay({ info }: InfoDisplayProps) {
  // Check if this looks like a title page
  const isTitlePage = info.text.includes('ШКОЛА') || info.text.includes('Задачник') || info.text.includes('учебный год')

  // Check if this looks like table of contents
  const isTableOfContents = info.text.includes('Оглавление') || info.text.includes('Глава 1.') && info.text.includes('Глава 2.')

  return (
    <Box flex direction="col" gap="lg">
      {info.title && (
        <Text variant="h3" weight="bold" color="primary" align="center">
          {info.title}
        </Text>
      )}

      <Card3D
        padding="lg"
        style={{
          backgroundColor: isTitlePage ? '#FDF4FF' : isTableOfContents ? '#F0FDF4' : '#FAFAFA',
          borderLeft: isTitlePage ? '4px solid #A855F7' : isTableOfContents ? '4px solid #22C55E' : '4px solid #94A3B8',
        }}
      >
        <Box flex direction="col" gap="md">
          {isTitlePage && (
            <Box flex align="center" gap="sm" style={{ marginBottom: '12px' }}>
              <span style={{ fontSize: '28px' }}>📚</span>
              <Text variant="h4" weight="bold" color="primary">
                Математика 5 класс
              </Text>
            </Box>
          )}

          {isTableOfContents && (
            <Box flex align="center" gap="sm" style={{ marginBottom: '12px' }}>
              <span style={{ fontSize: '24px' }}>📋</span>
              <Text variant="h4" weight="semibold" color="success">
                Содержание
              </Text>
            </Box>
          )}

          <Text
            variant="body"
            style={{
              whiteSpace: 'pre-wrap',
              lineHeight: '1.8',
              fontFamily: isTableOfContents ? 'monospace' : 'inherit',
            }}
          >
            {info.text}
          </Text>
        </Box>
      </Card3D>
    </Box>
  )
}
