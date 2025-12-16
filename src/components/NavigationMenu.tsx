'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Box, Text } from './atoms'
import { Workbook, Page } from '@/lib/data/types'
import { useAppStore, WorkbookType } from '@/lib/store'
import { useTranslation } from '@/lib/hooks/useTranslation'

interface NavigationMenuProps {
  workbook: Workbook
  isOpen: boolean
  onClose: () => void
  flatProblems: Array<{
    pageNumber: number
    exerciseId: string
    exerciseTitle: string
    problemIndex: number
    globalIndex: number
  }>
}

interface ChapterGroup {
  chapter: string
  pages: Page[]
  startIndex: number
  endIndex: number
}

export function NavigationMenu({ workbook, isOpen, onClose, flatProblems }: NavigationMenuProps) {
  const { t, tc } = useTranslation()
  const { currentProblem, completedProblems, jumpToProblem, selectedWorkbook, setSelectedWorkbook } = useAppStore()
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set(['intro']))

  const handleWorkbookChange = (newWorkbook: WorkbookType) => {
    if (newWorkbook !== selectedWorkbook) {
      if (completedProblems.length > 0) {
        const confirmed = window.confirm(t('switchWorkbookWarning'))
        if (!confirmed) return
      }
      setSelectedWorkbook(newWorkbook)
      onClose()
    }
  }

  // Group pages by chapter
  const chapters = useMemo(() => {
    const groups: ChapterGroup[] = []
    let currentChapter = ''
    let introPages: Page[] = []

    workbook.pages.forEach((page) => {
      if (page.chapter && page.chapter !== currentChapter) {
        // Save intro pages if any
        if (introPages.length > 0 && groups.length === 0) {
          groups.push({
            chapter: 'intro',
            pages: introPages,
            startIndex: 0,
            endIndex: 0,
          })
          introPages = []
        }

        currentChapter = page.chapter
        groups.push({
          chapter: currentChapter,
          pages: [page],
          startIndex: 0,
          endIndex: 0,
        })
      } else if (!page.chapter && groups.length === 0) {
        // Intro pages (before first chapter)
        introPages.push(page)
      } else if (groups.length > 0) {
        groups[groups.length - 1].pages.push(page)
      }
    })

    // Add intro if still pending
    if (introPages.length > 0) {
      groups.unshift({
        chapter: 'intro',
        pages: introPages,
        startIndex: 0,
        endIndex: 0,
      })
    }

    // Calculate start/end indices
    let idx = 0
    groups.forEach((group) => {
      group.startIndex = idx
      group.pages.forEach((page) => {
        page.exercises.forEach((exercise) => {
          idx += exercise.problems.length
        })
      })
      group.endIndex = idx - 1
    })

    return groups
  }, [workbook])

  // Find current chapter
  const currentChapterIdx = useMemo(() => {
    for (let i = 0; i < chapters.length; i++) {
      if (currentProblem >= chapters[i].startIndex && currentProblem <= chapters[i].endIndex) {
        return i
      }
    }
    return 0
  }, [chapters, currentProblem])

  const toggleChapter = (chapter: string) => {
    setExpandedChapters((prev) => {
      const next = new Set(prev)
      if (next.has(chapter)) {
        next.delete(chapter)
      } else {
        next.add(chapter)
      }
      return next
    })
  }

  const handleJump = (globalIndex: number) => {
    jumpToProblem(globalIndex)
    onClose()
  }

  // Get exercise items for a chapter
  const getExerciseItems = (group: ChapterGroup) => {
    const items: Array<{
      id: string
      title: string
      type: string
      globalIndex: number
      problemCount: number
      isCompleted: boolean
      isCurrent: boolean
    }> = []

    let idx = group.startIndex
    group.pages.forEach((page) => {
      page.exercises.forEach((exercise) => {
        const firstProblemIdx = idx
        const problemIds = exercise.problems.map((_, pIdx) =>
          `${page.pageNumber}-${exercise.id}-${pIdx}`
        )
        const completedCount = problemIds.filter(id => completedProblems.includes(id)).length
        const isCompleted = completedCount === exercise.problems.length && exercise.problems.length > 0
        const isCurrent = currentProblem >= firstProblemIdx && currentProblem < firstProblemIdx + exercise.problems.length

        items.push({
          id: exercise.id,
          title: exercise.title || getExerciseTypeLabel(exercise.exerciseType, exercise.id),
          type: exercise.exerciseType,
          globalIndex: firstProblemIdx,
          problemCount: exercise.problems.length,
          isCompleted,
          isCurrent,
        })

        idx += exercise.problems.length
      })
    })

    return items
  }

  const getExerciseTypeLabel = (type: string, id: string) => {
    if (id.startsWith('info-')) return t('infoPage') || 'Info'
    if (id.startsWith('theory-')) return t('theorySection') || 'Theory'
    if (id.startsWith('puzzle-')) return t('puzzleProblem') || 'Puzzle'
    return id
  }

  const getChapterLabel = (chapter: string) => {
    if (chapter === 'intro') return t('introduction') || 'Introduction'
    return tc(chapter)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 998,
            }}
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              bottom: 0,
              width: '320px',
              maxWidth: '85vw',
              backgroundColor: '#FFFFFF',
              boxShadow: '4px 0 20px rgba(0, 0, 0, 0.15)',
              zIndex: 999,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <Box
              flex
              justify="between"
              align="center"
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid #E5E7EB',
              }}
            >
              <Box flex align="center" gap="sm">
                <span style={{ fontSize: '20px' }}>📚</span>
                <Text variant="h4" weight="bold">
                  {t('contents') || 'Contents'}
                </Text>
              </Box>
              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  padding: '4px',
                  color: '#6B7280',
                }}
              >
                ✕
              </button>
            </Box>

            {/* Chapter List */}
            <Box
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '12px 0',
              }}
            >
              {chapters.map((group, groupIdx) => {
                const isExpanded = expandedChapters.has(group.chapter)
                const isCurrent = groupIdx === currentChapterIdx
                const exercises = getExerciseItems(group)

                return (
                  <Box key={group.chapter} style={{ marginBottom: '4px' }}>
                    {/* Chapter Header */}
                    <button
                      onClick={() => toggleChapter(group.chapter)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 20px',
                        background: isCurrent ? '#F3E8FF' : 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        borderLeft: isCurrent ? '4px solid #7C3AED' : '4px solid transparent',
                      }}
                    >
                      <span style={{
                        fontSize: '12px',
                        transition: 'transform 200ms',
                        transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                      }}>
                        ▶
                      </span>
                      <Text
                        variant="small"
                        weight={isCurrent ? 'bold' : 'semibold'}
                        color={isCurrent ? 'primary' : 'default'}
                        style={{ flex: 1 }}
                      >
                        {getChapterLabel(group.chapter)}
                      </Text>
                      <Text variant="tiny" color="muted">
                        {exercises.length}
                      </Text>
                    </button>

                    {/* Exercise Items */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          style={{ overflow: 'hidden' }}
                        >
                          {exercises.map((item) => (
                            <button
                              key={`${item.id}-${item.globalIndex}`}
                              onClick={() => handleJump(item.globalIndex)}
                              style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 20px 10px 44px',
                                background: item.isCurrent ? '#EDE9FE' : 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                textAlign: 'left',
                              }}
                            >
                              <span style={{ fontSize: '14px', width: '20px' }}>
                                {item.isCompleted ? '✓' : item.type === 'info' ? '📄' : item.type === 'theory' ? '📖' : item.type === 'puzzles' ? '🧩' : '📝'}
                              </span>
                              <Text
                                variant="tiny"
                                weight={item.isCurrent ? 'semibold' : 'normal'}
                                color={item.isCurrent ? 'primary' : item.isCompleted ? 'success' : 'default'}
                                style={{
                                  flex: 1,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {item.id.match(/^\d+×\d+$/) ? `${item.id}. ` : ''}{tc(item.title)}
                              </Text>
                              {item.problemCount > 1 && (
                                <Text variant="tiny" color="muted">
                                  ({item.problemCount})
                                </Text>
                              )}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Box>
                )
              })}
            </Box>

            {/* Footer */}
            <Box
              flex
              direction="col"
              gap="sm"
              style={{
                padding: '12px 20px',
                borderTop: '1px solid #E5E7EB',
                backgroundColor: '#F9FAFB',
              }}
            >
              {/* Workbook Switcher */}
              <Box flex direction="col" gap="xs">
                <Text variant="tiny" color="muted" weight="semibold">
                  {t('selectWorkbook')}
                </Text>
                <Box flex gap="xs">
                  <button
                    onClick={() => handleWorkbookChange('russian')}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: selectedWorkbook === 'russian' ? '2px solid #7C3AED' : '1px solid #E5E7EB',
                      backgroundColor: selectedWorkbook === 'russian' ? '#F3E8FF' : '#FFFFFF',
                      color: selectedWorkbook === 'russian' ? '#7C3AED' : '#6B7280',
                      fontSize: '12px',
                      fontWeight: selectedWorkbook === 'russian' ? 600 : 400,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    🇷🇺 {t('workbookRussian')}
                  </button>
                  <button
                    onClick={() => handleWorkbookChange('english')}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: selectedWorkbook === 'english' ? '2px solid #7C3AED' : '1px solid #E5E7EB',
                      backgroundColor: selectedWorkbook === 'english' ? '#F3E8FF' : '#FFFFFF',
                      color: selectedWorkbook === 'english' ? '#7C3AED' : '#6B7280',
                      fontSize: '12px',
                      fontWeight: selectedWorkbook === 'english' ? 600 : 400,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    🇬🇧 {t('workbookEnglish')}
                  </button>
                </Box>
              </Box>

              {/* Progress */}
              <Text variant="tiny" color="muted" align="center">
                {completedProblems.length} / {flatProblems.length} {t('completed') || 'completed'}
              </Text>
            </Box>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
