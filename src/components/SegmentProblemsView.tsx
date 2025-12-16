'use client'

import { useEffect, useRef, useCallback } from 'react'
import { motion } from 'motion/react'
import { Box, Card3D } from './atoms'
import { ProblemDisplay } from './ProblemDisplay'
import { Problem } from '@/lib/data/types'

interface SegmentProblemsViewProps {
  problems: Problem[]
  currentIndex: number
  showAnswer: boolean
  pageNumber: number
  exerciseId: string
}

export function SegmentProblemsView({
  problems,
  currentIndex,
  showAnswer,
  pageNumber,
  exerciseId,
}: SegmentProblemsViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  // Use a map to store refs for each problem
  const itemRefs = useRef<Map<number, HTMLDivElement>>(new Map())

  // Callback ref to store element references
  const setItemRef = useCallback((index: number, element: HTMLDivElement | null) => {
    if (element) {
      itemRefs.current.set(index, element)
    } else {
      itemRefs.current.delete(index)
    }
  }, [])

  // Auto-scroll to keep current problem ~150px from top (only after 3rd question)
  useEffect(() => {
    // Only scroll if we're on question 3 or later (index >= 2)
    if (currentIndex < 2) return

    const timer = setTimeout(() => {
      const container = containerRef.current
      const element = itemRefs.current.get(currentIndex)

      if (element && container) {
        const containerRect = container.getBoundingClientRect()
        const elementRect = element.getBoundingClientRect()
        const elementTopRelativeToContainer = elementRect.top - containerRect.top
        const scrollTarget = container.scrollTop + elementTopRelativeToContainer - 150

        // Only scroll if element is more than 10px away from desired position
        if (Math.abs(elementTopRelativeToContainer - 150) > 10) {
          container.scrollTo({
            top: Math.max(0, scrollTarget),
            behavior: 'smooth'
          })
        }
      }
    }, 150)

    return () => clearTimeout(timer)
  }, [currentIndex])

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        maxHeight: '50vh',
        overflowY: 'auto',
        marginBottom: '24px',
        padding: '4px',
        borderRadius: '12px',
        backgroundColor: '#F9FAFB',
      }}
    >
      {problems.map((problem, index) => {
        const isCurrent = index === currentIndex
        const isPast = index < currentIndex

        return (
          <motion.div
            key={`${pageNumber}-${exerciseId}-${index}`}
            ref={(el) => setItemRef(index, el)}
            initial={false}
            animate={{
              opacity: isCurrent ? 1 : 0.4,
              scale: isCurrent ? 1 : 0.98,
            }}
            transition={{ duration: 0.2 }}
          >
            <Card3D
              padding={isCurrent ? 'lg' : 'md'}
              variant={isCurrent ? 'elevated' : 'default'}
              style={{
                border: isCurrent ? '2px solid #7C3AED' : '1px solid #E5E7EB',
                backgroundColor: isCurrent ? '#FFFFFF' : isPast ? '#F9FAFB' : '#FFFFFF',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Problem number badge */}
              <Box
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  backgroundColor: isCurrent ? '#7C3AED' : '#E5E7EB',
                  color: isCurrent ? '#FFFFFF' : '#6B7280',
                  borderRadius: '12px',
                  padding: '2px 8px',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                {index + 1}
              </Box>

              <ProblemDisplay
                problem={problem}
                showAnswer={isCurrent && showAnswer}
              />
            </Card3D>
          </motion.div>
        )
      })}
    </div>
  )
}
