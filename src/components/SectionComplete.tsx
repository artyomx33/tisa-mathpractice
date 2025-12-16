'use client'

import { CSSProperties, useState } from 'react'
import { motion } from 'motion/react'
import { Box, Text, Button3D, Card3D } from './atoms'
import { useTranslation } from '@/lib/hooks/useTranslation'
import { Problem } from '@/lib/data/types'
import { generatePracticeFromExercise } from '@/lib/generator'

interface SectionCompleteProps {
  exerciseTitle: string
  problemCount: number
  sampleProblems: Problem[]
  onContinue: () => void
  onPracticeMore: (problems: Problem[]) => void
}

export function SectionComplete({
  exerciseTitle,
  problemCount,
  sampleProblems,
  onContinue,
  onPracticeMore,
}: SectionCompleteProps) {
  const { t } = useTranslation()
  const [isGenerating, setIsGenerating] = useState(false)

  const overlayStyle: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  }

  const handlePracticeMore = async () => {
    setIsGenerating(true)
    // Small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 300))
    const newProblems = generatePracticeFromExercise(sampleProblems, 10)
    setIsGenerating(false)
    onPracticeMore(newProblems)
  }

  return (
    <motion.div
      style={overlayStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', bounce: 0.3 }}
        style={{ maxWidth: '400px', width: '100%' }}
      >
        <Card3D padding="xl" variant="elevated">
          <Box flex direction="col" align="center" gap="lg">
            {/* Celebration emoji */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{ duration: 0.6, repeat: 2 }}
              style={{ fontSize: '64px' }}
            >
              🎉
            </motion.div>

            {/* Title */}
            <Text variant="h2" weight="bold" align="center">
              {t('sectionComplete')}
            </Text>

            {/* Exercise info */}
            <Box flex direction="col" align="center" gap="xs">
              <Text variant="body" color="muted" align="center">
                {t('youFinished')}:
              </Text>
              <Text variant="h4" weight="semibold" color="primary" align="center">
                {exerciseTitle}
              </Text>
              <Text variant="small" color="muted" align="center">
                {problemCount} {t('problemsCompleted')}
              </Text>
            </Box>

            {/* Buttons */}
            <Box flex direction="col" gap="md" style={{ width: '100%', marginTop: '8px' }}>
              <Button3D
                variant="primary"
                fullWidth
                size="lg"
                onClick={handlePracticeMore}
                disabled={isGenerating}
              >
                {isGenerating ? t('generatingProblems') : t('practiceMore')}
              </Button3D>

              <Button3D
                variant="secondary"
                fullWidth
                onClick={onContinue}
              >
                {t('continueNext')}
              </Button3D>
            </Box>
          </Box>
        </Card3D>
      </motion.div>
    </motion.div>
  )
}
