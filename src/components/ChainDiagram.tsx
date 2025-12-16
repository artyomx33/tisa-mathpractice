'use client'

import { CSSProperties } from 'react'
import { motion } from 'motion/react'
import { Box, Text } from './atoms'
import { ChainProblem } from '@/lib/data/types'

interface ChainDiagramProps {
  problem: ChainProblem
  showAnswer: boolean
}

export function ChainDiagram({ problem, showAnswer }: ChainDiagramProps) {
  const { steps, answer } = problem

  return (
    <Box
      flex
      align="center"
      gap="none"
      style={{
        overflowX: 'auto',
        padding: '16px 0',
      }}
    >
      {steps.map((step, index) => (
        <Box key={index} flex align="center" gap="none">
          {/* Operation label (above the arrow) */}
          {index > 0 && step.operation && (
            <Box
              flex
              direction="col"
              align="center"
              style={{ margin: '0 4px' }}
            >
              <Text
                variant="small"
                weight="bold"
                color="primary"
                style={{ marginBottom: '4px' }}
              >
                {step.operation}
              </Text>
              <Arrow />
            </Box>
          )}

          {/* Box with value */}
          <NumberBox
            value={step.value}
            answer={showAnswer ? answer[index] : undefined}
            isFirst={index === 0}
            isLast={index === steps.length - 1}
          />
        </Box>
      ))}
    </Box>
  )
}

function Arrow() {
  const arrowStyle: CSSProperties = {
    width: '40px',
    height: '2px',
    backgroundColor: '#9CA3AF',
    position: 'relative',
  }

  const arrowHeadStyle: CSSProperties = {
    position: 'absolute',
    right: '0',
    top: '50%',
    transform: 'translateY(-50%)',
    width: 0,
    height: 0,
    borderTop: '6px solid transparent',
    borderBottom: '6px solid transparent',
    borderLeft: '8px solid #9CA3AF',
  }

  return (
    <div style={arrowStyle}>
      <div style={arrowHeadStyle} />
    </div>
  )
}

interface NumberBoxProps {
  value: number | null
  answer?: number
  isFirst: boolean
  isLast: boolean
}

function NumberBox({ value, answer, isFirst, isLast }: NumberBoxProps) {
  const hasValue = value !== null
  const showAnswerValue = !hasValue && answer !== undefined

  const boxStyle: CSSProperties = {
    width: '64px',
    height: '64px',
    borderRadius: '12px',
    border: '3px solid',
    borderColor: isFirst ? '#7C3AED' : isLast ? '#10B981' : '#E5E7EB',
    backgroundColor: hasValue ? '#F9FAFB' : showAnswerValue ? '#F0FDF4' : '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 0 #E5E7EB',
  }

  const displayValue = hasValue ? value : showAnswerValue ? answer : '?'

  return (
    <motion.div
      style={boxStyle}
      initial={showAnswerValue ? { scale: 0.8, opacity: 0 } : undefined}
      animate={showAnswerValue ? { scale: 1, opacity: 1 } : undefined}
      transition={{ type: 'spring', bounce: 0.4 }}
    >
      <Text
        variant="h3"
        weight="bold"
        color={hasValue ? 'default' : showAnswerValue ? 'success' : 'muted'}
        style={{ fontFamily: 'monospace' }}
      >
        {displayValue}
      </Text>
    </motion.div>
  )
}
