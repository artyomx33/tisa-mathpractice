// Problem types
export type ProblemType = 'chain' | 'arithmetic' | 'word' | 'theory' | 'puzzle' | 'info'

// Chain calculation: 20 → ×5 → ? → -60 → ? ...
export interface ChainStep {
  value: number | null  // null means empty box (to solve)
  operation: string | null // ×5, -60, ÷8, +25, etc. (null for first box)
}

export interface ChainProblem {
  type: 'chain'
  steps: ChainStep[]
  answer: number[] // all intermediate and final values
}

// Arithmetic: А) 397 + 71
export interface ArithmeticProblem {
  type: 'arithmetic'
  label: string // А, Б, В, etc.
  expression: string // "397 + 71"
  answer: number | string
}

// Word problem with exercise number: 1 × 21. Вычислите...
export interface WordProblem {
  type: 'word'
  id: string // "1×21", "1×22", etc.
  text: string // Main question text
  subProblems?: string[] // А) 2 ч, Б) 5 ч, etc.
}

// Theory/explanation text (no answer needed)
export interface TheoryContent {
  type: 'theory'
  title?: string // Optional title like "Определение."
  text: string // The theory/explanation text
}

// Puzzle problems (Roman numerals like VIII, IX, X)
export interface PuzzleProblem {
  type: 'puzzle'
  id: string // "VIII", "IX", etc.
  text: string // The puzzle description
}

// Info page content (title pages, table of contents, chapter headers)
export interface InfoContent {
  type: 'info'
  title?: string // Optional title
  text: string // The content text (can include table of contents, etc.)
}

export type Problem = ChainProblem | ArithmeticProblem | WordProblem | TheoryContent | PuzzleProblem | InfoContent

// Exercise = a group of problems under one heading
export interface Exercise {
  id: string // "1×1", "1×2", etc. or "theory" or "puzzle-VIII" or "info-1"
  title: string // "Выполните действия:" or empty for theory
  exerciseType: 'problems' | 'theory' | 'puzzles' | 'info'
  problems: Problem[]
}

// Page = all exercises on one page
export interface Page {
  pageNumber: number
  chapter?: string // "Глава 1. Арифметика натуральных чисел"
  exercises: Exercise[]
}

// Full workbook
export interface Workbook {
  title: string
  pages: Page[]
  totalProblems: number
}
