import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Language } from '@/lib/i18n'
import { Problem } from '@/lib/data/types'

export type WorkbookType = 'russian' | 'english'

export interface WorkbookProgress {
  currentPage: number
  currentExercise: number
  currentProblem: number
  completedProblems: Set<string> // "page-exercise-problem" format
  showingAnswer: boolean
}

interface AppStore {
  // Language
  language: Language
  setLanguage: (lang: Language) => void

  // Workbook Selection
  selectedWorkbook: WorkbookType
  setSelectedWorkbook: (workbook: WorkbookType) => void

  // Progress
  currentPage: number
  currentExercise: number
  currentProblem: number
  completedProblems: string[] // stored as array for JSON serialization

  // UI State
  showingAnswer: boolean
  showAllInSegment: boolean

  // Practice Mode
  isPracticeMode: boolean
  practiceProblems: Problem[]
  practiceProblemIndex: number

  // Actions
  setCurrentPosition: (page: number, exercise: number, problem: number) => void
  nextProblem: () => void
  previousProblem: () => void
  jumpToProblem: (problemIndex: number) => void
  markCompleted: (problemId: string) => void
  toggleAnswer: () => void
  hideAnswer: () => void
  toggleShowAllInSegment: () => void
  resetProgress: () => void

  // Practice Mode Actions
  enterPracticeMode: (problems: Problem[]) => void
  exitPracticeMode: () => void
  nextPracticeProblem: () => void

  // Getters
  isCompleted: (problemId: string) => boolean
  getCompletedCount: () => number
}

// Detect browser language
function detectLanguage(): Language {
  if (typeof window === 'undefined') return 'en'
  const browserLang = navigator.language.toLowerCase()
  if (browserLang.startsWith('ru')) return 'ru'
  return 'en'
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Language - will be set on client side
      language: 'en',
      setLanguage: (lang) => set({ language: lang }),

      // Workbook Selection
      selectedWorkbook: 'russian' as WorkbookType,
      setSelectedWorkbook: (workbook) => set({
        selectedWorkbook: workbook,
        // Reset progress when switching workbooks
        currentProblem: 0,
        completedProblems: [],
        showingAnswer: false,
        isPracticeMode: false,
        practiceProblems: [],
        practiceProblemIndex: 0,
      }),

      // Initial state
      currentPage: 1,
      currentExercise: 1,
      currentProblem: 0,
      completedProblems: [],
      showingAnswer: false,
      showAllInSegment: false,

      // Practice Mode
      isPracticeMode: false,
      practiceProblems: [],
      practiceProblemIndex: 0,

      // Actions
      setCurrentPosition: (page, exercise, problem) => set({
        currentPage: page,
        currentExercise: exercise,
        currentProblem: problem,
        showingAnswer: false,
      }),

      nextProblem: () => set((state) => ({
        currentProblem: state.currentProblem + 1,
        showingAnswer: false,
      })),

      previousProblem: () => set((state) => ({
        currentProblem: Math.max(0, state.currentProblem - 1),
        showingAnswer: false,
      })),

      jumpToProblem: (problemIndex) => set({
        currentProblem: problemIndex,
        showingAnswer: false,
        isPracticeMode: false,
        practiceProblems: [],
        practiceProblemIndex: 0,
      }),

      markCompleted: (problemId) => set((state) => ({
        completedProblems: state.completedProblems.includes(problemId)
          ? state.completedProblems
          : [...state.completedProblems, problemId],
      })),

      toggleAnswer: () => set((state) => ({
        showingAnswer: !state.showingAnswer,
      })),

      hideAnswer: () => set({ showingAnswer: false }),

      toggleShowAllInSegment: () => set((state) => ({
        showAllInSegment: !state.showAllInSegment,
      })),

      resetProgress: () => set({
        currentPage: 1,
        currentExercise: 1,
        currentProblem: 0,
        completedProblems: [],
        showingAnswer: false,
        isPracticeMode: false,
        practiceProblems: [],
        practiceProblemIndex: 0,
      }),

      // Practice Mode Actions
      enterPracticeMode: (problems) => set({
        isPracticeMode: true,
        practiceProblems: problems,
        practiceProblemIndex: 0,
        showingAnswer: false,
      }),

      exitPracticeMode: () => set({
        isPracticeMode: false,
        practiceProblems: [],
        practiceProblemIndex: 0,
        showingAnswer: false,
      }),

      nextPracticeProblem: () => set((state) => ({
        practiceProblemIndex: state.practiceProblemIndex + 1,
        showingAnswer: false,
      })),

      // Getters
      isCompleted: (problemId) => get().completedProblems.includes(problemId),
      getCompletedCount: () => get().completedProblems.length,
    }),
    {
      name: 'math-workbook-progress',
      partialize: (state) => ({
        language: state.language,
        selectedWorkbook: state.selectedWorkbook,
        currentProblem: state.currentProblem,
        completedProblems: state.completedProblems,
        showAllInSegment: state.showAllInSegment,
      }),
    }
  )
)

// Hook to detect and set language on mount
export function useDetectLanguage() {
  const { language, setLanguage } = useAppStore()

  if (typeof window !== 'undefined') {
    // Only run on client, and only if language hasn't been explicitly set
    const stored = localStorage.getItem('math-workbook-progress')
    if (!stored || !JSON.parse(stored).state?.language) {
      const detected = detectLanguage()
      if (detected !== language) {
        setLanguage(detected)
      }
    }
  }
}
