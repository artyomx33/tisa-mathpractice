'use client'

import { Box, Text, Card3D } from './atoms'
import { PuzzleProblem } from '@/lib/data/types'
import { useTranslation } from '@/lib/hooks/useTranslation'

interface PuzzleDisplayProps {
  puzzle: PuzzleProblem
}

export function PuzzleDisplay({ puzzle }: PuzzleDisplayProps) {
  const { t } = useTranslation()

  return (
    <Box flex direction="col" gap="lg">
      <Box flex align="center" gap="md">
        <Box
          flex
          align="center"
          justify="center"
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: '#FEF3C7',
            border: '2px solid #F59E0B',
          }}
        >
          <Text variant="h4" weight="bold" style={{ color: '#B45309' }}>
            {puzzle.id}
          </Text>
        </Box>
        <Text variant="h4" weight="bold" color="warning">
          {t('puzzleProblem') || 'Puzzle'}
        </Text>
      </Box>

      <Card3D
        padding="lg"
        style={{
          backgroundColor: '#FFFBEB',
          borderLeft: '4px solid #F59E0B',
        }}
      >
        <Box flex direction="col" gap="md">
          <Box flex align="center" gap="sm">
            <span style={{ fontSize: '24px' }}>🧩</span>
            <Text variant="small" color="muted" weight="semibold">
              {t('thinkAboutIt') || 'Think about it!'}
            </Text>
          </Box>

          <Text
            variant="body"
            style={{
              whiteSpace: 'pre-wrap',
              lineHeight: '1.8',
              fontSize: '18px',
            }}
          >
            {puzzle.text}
          </Text>
        </Box>
      </Card3D>

      <Text variant="small" color="muted" style={{ textAlign: 'center' }}>
        {t('puzzleHint') || 'This is a puzzle to solve on your own. Mark as done when finished!'}
      </Text>
    </Box>
  )
}
