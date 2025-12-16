'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Box, Text, Button3D, Card3D, ProgressBar } from './atoms'
import { ProblemDisplay } from './ProblemDisplay'
import { SegmentProblemsView } from './SegmentProblemsView'
import { NavigationMenu } from './NavigationMenu'
import { Workbook, Problem } from '@/lib/data/types'
import { useAppStore, WorkbookType } from '@/lib/store'
import { useTranslation } from '@/lib/hooks/useTranslation'

interface PracticePageProps {
  workbooks: {
    russian: Workbook
    english: Workbook
  }
}

interface FlattenedProblem {
  pageNumber: number
  exerciseId: string
  exerciseTitle: string
  problemIndex: number
  problemsInExercise: number
  exerciseProblems: Problem[]
  problem: Problem
  globalIndex: number
  isLastInExercise: boolean
}

export function PracticePage({ workbooks }: PracticePageProps) {
  const { t, tc } = useTranslation()
  const {
    language,
    setLanguage,
    selectedWorkbook,
    setSelectedWorkbook,
    currentProblem,
    showingAnswer,
    completedProblems,
    isPracticeMode,
    practiceProblems,
    practiceProblemIndex,
    showAllInSegment,
    nextProblem,
    previousProblem,
    markCompleted,
    toggleAnswer,
    toggleShowAllInSegment,
    enterPracticeMode,
    exitPracticeMode,
    nextPracticeProblem,
  } = useAppStore()

  // Select the current workbook based on store state (fallback to russian during hydration)
  const workbook = workbooks[selectedWorkbook || 'russian']

  const [showMenu, setShowMenu] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [sectionComplete, setSectionComplete] = useState(false)
  const [sectionExerciseProblems, setSectionExerciseProblems] = useState<Problem[]>([])
  const [showConfetti, setShowConfetti] = useState(false)

  // Handle hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  // Detect language on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && mounted) {
      const stored = localStorage.getItem('math-workbook-progress')
      if (!stored) {
        const browserLang = navigator.language.toLowerCase()
        if (browserLang.startsWith('ru')) {
          setLanguage('ru')
        }
      }
    }
  }, [setLanguage, mounted])

  // Flatten all problems into a single array for easy navigation
  const flatProblems = useMemo(() => {
    const problems: FlattenedProblem[] = []
    let globalIndex = 0

    workbook.pages.forEach((page) => {
      page.exercises.forEach((exercise) => {
        const exerciseProblems = exercise.problems
        exercise.problems.forEach((problem, problemIndex) => {
          problems.push({
            pageNumber: page.pageNumber,
            exerciseId: exercise.id,
            exerciseTitle: exercise.title,
            problemIndex,
            problemsInExercise: exercise.problems.length,
            exerciseProblems,
            problem,
            globalIndex,
            isLastInExercise: problemIndex === exercise.problems.length - 1,
          })
          globalIndex++
        })
      })
    })

    return problems
  }, [workbook])

  // Current problem data (either from workbook or practice mode)
  const currentProblemData = isPracticeMode
    ? null
    : flatProblems[currentProblem] || flatProblems[0]

  const currentPracticeProblem = isPracticeMode
    ? practiceProblems[practiceProblemIndex]
    : null

  const totalProblems = flatProblems.length
  const progress = totalProblems > 0 ? ((currentProblem + 1) / totalProblems) * 100 : 0
  const completedCount = completedProblems.length

  const handleNext = useCallback(() => {
    if (isPracticeMode) {
      if (practiceProblemIndex < practiceProblems.length - 1) {
        nextPracticeProblem()
      } else {
        // Finished practice, go back to main workbook
        exitPracticeMode()
        if (currentProblem < totalProblems - 1) {
          nextProblem()
        }
      }
      return
    }

    // If section complete, move to next section
    if (sectionComplete) {
      setSectionComplete(false)
      setSectionExerciseProblems([])
      if (currentProblem < totalProblems - 1) {
        nextProblem()
      }
      return
    }

    // Mark current as completed
    if (currentProblemData) {
      const problemId = `${currentProblemData.pageNumber}-${currentProblemData.exerciseId}-${currentProblemData.problemIndex}`
      markCompleted(problemId)

      // Check if this is the last problem in the exercise
      if (currentProblemData.isLastInExercise && currentProblem < totalProblems - 1) {
        setSectionExerciseProblems(currentProblemData.exerciseProblems)
        setSectionComplete(true)
        setShowConfetti(true)
        // Hide confetti after animation
        setTimeout(() => setShowConfetti(false), 3000)
        return
      }
    }

    if (currentProblem < totalProblems - 1) {
      nextProblem()
    }
  }, [isPracticeMode, practiceProblemIndex, practiceProblems.length, currentProblem, totalProblems, currentProblemData, markCompleted, nextProblem, nextPracticeProblem, exitPracticeMode, sectionComplete])

  const handlePrevious = useCallback(() => {
    if (isPracticeMode) {
      if (practiceProblemIndex > 0) {
        useAppStore.setState({ practiceProblemIndex: practiceProblemIndex - 1, showingAnswer: false })
      }
      return
    }

    if (currentProblem > 0) {
      previousProblem()
    }
  }, [isPracticeMode, practiceProblemIndex, currentProblem, previousProblem])

  const handleShowAnswer = useCallback(() => {
    toggleAnswer()
  }, [toggleAnswer])

  const handlePracticeMore = () => {
    if (sectionExerciseProblems.length > 0) {
      setSectionComplete(false)
      enterPracticeMode(sectionExerciseProblems)
    }
  }

  const handleExitPractice = () => {
    exitPracticeMode()
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        handleNext()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handlePrevious()
      } else if (e.key === 'Enter') {
        e.preventDefault()
        handleShowAnswer()
      } else if (e.key === 'Escape' && isPracticeMode) {
        e.preventDefault()
        handleExitPractice()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentProblem, showingAnswer, isPracticeMode, handleNext, handlePrevious, handleShowAnswer])

  // Show loading while hydrating
  if (!mounted) {
    return (
      <Box flex direction="col" align="center" justify="center" style={{ minHeight: '100vh' }}>
        <Text variant="h3" color="muted">Loading...</Text>
      </Box>
    )
  }

  if (!currentProblemData && !isPracticeMode) {
    return (
      <Box flex direction="col" align="center" justify="center" padding="xl">
        <Text variant="h2">No problems found</Text>
      </Box>
    )
  }

  const displayProblem = isPracticeMode ? currentPracticeProblem : currentProblemData?.problem
  const practiceProgress = isPracticeMode
    ? ((practiceProblemIndex + 1) / practiceProblems.length) * 100
    : 0

  return (
    <>
      <Box
        flex
        direction="col"
        style={{
          minHeight: '100vh',
          maxWidth: '800px',
          margin: '0 auto',
          padding: '20px',
        }}
      >
        {/* Header */}
        <Box flex justify="between" align="center" style={{ marginBottom: '20px' }}>
          <Box flex align="center" gap="md">
            <button
              onClick={() => setShowMenu(true)}
              style={{
                background: 'none',
                border: '2px solid #E5E7EB',
                borderRadius: '8px',
                padding: '8px 12px',
                cursor: 'pointer',
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title={t('contents') || 'Contents'}
            >
              ☰
            </button>
            <Text variant="h4" weight="bold">
              {t('appTitle')}
            </Text>
          </Box>
          <Text variant="small" color="muted">
            {t('solved')}: {completedCount}
          </Text>
        </Box>

        {/* Practice Mode Banner */}
        {isPracticeMode && (
          <Card3D padding="sm" style={{ marginBottom: '16px', backgroundColor: '#F0FDF4' }}>
            <Box flex justify="between" align="center">
              <Box flex align="center" gap="sm">
                <Text variant="small" weight="semibold" color="success">
                  🎯 {t('practiceMore')}
                </Text>
                <Text variant="small" color="muted">
                  {practiceProblemIndex + 1} / {practiceProblems.length}
                </Text>
              </Box>
              <Button3D variant="ghost" size="sm" onClick={handleExitPractice}>
                ✕ Exit
              </Button3D>
            </Box>
          </Card3D>
        )}

        {/* Progress bar */}
        <Box style={{ marginBottom: '24px' }}>
          <ProgressBar
            value={isPracticeMode ? practiceProgress : progress}
            showLabel
            height={10}
            color={isPracticeMode ? '#10B981' : '#7C3AED'}
          />
          <Box flex justify="between" style={{ marginTop: '8px' }}>
            <Text variant="tiny" color="muted">
              {t('problem')} {isPracticeMode ? practiceProblemIndex + 1 : currentProblem + 1} {t('of')} {isPracticeMode ? practiceProblems.length : totalProblems}
            </Text>
            {!isPracticeMode && currentProblemData && (
              <Text variant="tiny" color="muted">
                {t('page')} {currentProblemData.pageNumber}
              </Text>
            )}
          </Box>
        </Box>

        {/* Exercise info */}
        {!isPracticeMode && currentProblemData && (
          <Card3D padding="md" style={{ marginBottom: '20px' }}>
            <Box flex direction="col" gap="xs">
              <Box flex justify="between" align="center">
                <Text variant="small" color="primary" weight="semibold">
                  {t('exercise')} {currentProblemData.exerciseId}
                </Text>
                {/* Show All Toggle - only show for multi-problem exercises */}
                {currentProblemData.problemsInExercise > 1 && (
                  <button
                    onClick={toggleShowAllInSegment}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 10px',
                      borderRadius: '16px',
                      border: 'none',
                      backgroundColor: showAllInSegment ? '#7C3AED' : '#E5E7EB',
                      color: showAllInSegment ? '#FFFFFF' : '#6B7280',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {showAllInSegment ? t('showAll') : t('showOne')}
                  </button>
                )}
              </Box>
              <Text variant="body" weight="medium">
                {tc(currentProblemData.exerciseTitle)}
              </Text>
              {/* Segment progress counter */}
              {currentProblemData.problemsInExercise > 1 && (
                <Text variant="tiny" color="muted">
                  {t('question')} {currentProblemData.problemIndex + 1}/{currentProblemData.problemsInExercise} {t('inSegment')}
                </Text>
              )}
            </Box>
          </Card3D>
        )}

        {/* Problem display */}
        {!isPracticeMode && showAllInSegment && currentProblemData && currentProblemData.problemsInExercise > 1 ? (
          /* Show All Problems in Segment View */
          <SegmentProblemsView
            problems={currentProblemData.exerciseProblems}
            currentIndex={currentProblemData.problemIndex}
            showAnswer={showingAnswer}
            pageNumber={currentProblemData.pageNumber}
            exerciseId={currentProblemData.exerciseId}
          />
        ) : (
          /* Single Problem View */
          <AnimatePresence mode="wait">
            <motion.div
              key={isPracticeMode ? `practice-${practiceProblemIndex}` : currentProblem}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              style={{ flex: 1 }}
            >
              <Card3D padding="lg" variant="elevated" style={{ marginBottom: '24px' }}>
                {displayProblem && (
                  <ProblemDisplay
                    problem={displayProblem}
                    showAnswer={showingAnswer}
                  />
                )}
              </Card3D>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Controls */}
        <Box flex direction="col" gap="md">
          {/* Section Complete Banner */}
          {sectionComplete && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Box flex justify="center" style={{ marginBottom: '8px' }}>
                <Text variant="small" weight="semibold" color="success" align="center">
                  🎉 {t('sectionComplete')}
                </Text>
              </Box>
            </motion.div>
          )}

          {/* Show Answer button */}
          {!sectionComplete && (
            <Button3D
              variant={showingAnswer ? 'secondary' : 'primary'}
              fullWidth
              size="lg"
              onClick={handleShowAnswer}
            >
              {showingAnswer ? t('hideAnswer') : t('showAnswer')}
            </Button3D>
          )}

          {/* Navigation */}
          <Box flex gap="md">
            {sectionComplete ? (
              <>
                <Button3D
                  variant="secondary"
                  onClick={handlePracticeMore}
                  style={{ flex: 1 }}
                >
                  {t('practiceMore')}
                </Button3D>
                <Button3D
                  variant="success"
                  onClick={handleNext}
                  style={{ flex: 1 }}
                >
                  {t('continueNext')}
                </Button3D>
              </>
            ) : (
              <>
                <Button3D
                  variant="secondary"
                  onClick={handlePrevious}
                  disabled={isPracticeMode ? practiceProblemIndex === 0 : currentProblem === 0}
                  style={{ flex: 1 }}
                >
                  {t('back')}
                </Button3D>
                <Button3D
                  variant="success"
                  onClick={handleNext}
                  disabled={!isPracticeMode && currentProblem === totalProblems - 1}
                  style={{ flex: 1 }}
                >
                  {t('next')}
                </Button3D>
              </>
            )}
          </Box>

          {/* Keyboard hints */}
          {!sectionComplete && (
            <Box flex justify="center" gap="lg" style={{ marginTop: '8px' }}>
              <Text variant="tiny" color="muted">
                {t('keyboardNav')}
              </Text>
              <Text variant="tiny" color="muted">
                {t('keyboardAnswer')}
              </Text>
              <Text variant="tiny" color="muted">
                {t('keyboardNext')}
              </Text>
            </Box>
          )}
        </Box>
      </Box>

      {/* Confetti Animation */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              pointerEvents: 'none',
              zIndex: 1000,
              overflow: 'hidden',
            }}
          >
            {/* Generate confetti pieces */}
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: -20,
                  rotate: 0,
                  scale: Math.random() * 0.5 + 0.5,
                }}
                animate={{
                  y: window.innerHeight + 100,
                  rotate: Math.random() * 720 - 360,
                  x: Math.random() * window.innerWidth,
                }}
                transition={{
                  duration: Math.random() * 2 + 2,
                  ease: 'linear',
                  delay: Math.random() * 0.5,
                }}
                style={{
                  position: 'absolute',
                  width: '10px',
                  height: '10px',
                  backgroundColor: ['#7C3AED', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#EC4899'][i % 6],
                  borderRadius: i % 2 === 0 ? '50%' : '2px',
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Menu */}
      <NavigationMenu
        workbook={workbook}
        isOpen={showMenu}
        onClose={() => setShowMenu(false)}
        flatProblems={flatProblems.map(p => ({
          pageNumber: p.pageNumber,
          exerciseId: p.exerciseId,
          exerciseTitle: p.exerciseTitle,
          problemIndex: p.problemIndex,
          globalIndex: p.globalIndex,
        }))}
      />
    </>
  )
}
