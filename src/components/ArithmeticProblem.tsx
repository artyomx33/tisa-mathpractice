'use client'

import { CSSProperties } from 'react'
import { motion } from 'motion/react'
import { Box, Text, Card3D } from './atoms'
import { ArithmeticProblem as ArithmeticProblemType } from '@/lib/data/types'

interface ArithmeticProblemProps {
  problem: ArithmeticProblemType
  showAnswer: boolean
}

export function ArithmeticProblem({ problem, showAnswer }: ArithmeticProblemProps) {
  const { label, expression, answer } = problem

  const labelStyle: CSSProperties = {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#7C3AED',
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '16px',
    flexShrink: 0,
  }

  return (
    <Card3D padding="md" variant="outlined">
      <Box flex align="center" gap="md">
        <div style={labelStyle}>{label}</div>

        <Box flex direction="col" gap="sm" style={{ flex: 1 }}>
          <Text variant="h3" weight="semibold" style={{ fontFamily: 'monospace' }}>
            {expression}
          </Text>

          {showAnswer && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Box flex align="center" gap="sm">
                <Text variant="body" color="muted">=</Text>
                <Text
                  variant="h3"
                  weight="bold"
                  color="success"
                  style={{ fontFamily: 'monospace' }}
                >
                  {answer}
                </Text>
              </Box>
            </motion.div>
          )}
        </Box>
      </Box>
    </Card3D>
  )
}
