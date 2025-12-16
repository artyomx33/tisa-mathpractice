import {
  Workbook,
  Page,
  Exercise,
  Problem,
  ChainProblem,
  ChainStep,
  ArithmeticProblem,
  WordProblem,
  TheoryContent,
  PuzzleProblem,
  InfoContent,
} from './types'

// Roman numerals for puzzle detection
const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
  'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX',
  'XXI', 'XXII', 'XXIII', 'XXIV', 'XXV', 'XXX', 'XL', 'L', 'LX', 'LXX',
  'LXXX', 'XC', 'C', 'CX', 'CXX', 'CXXX', 'CXL', 'CL']

/**
 * Parse a chain diagram from ASCII art format
 */
function parseChainDiagram(lines: string[]): ChainProblem | null {
  const middleLine = lines.find(l => l.includes('│') && l.includes('──→'))
  if (!middleLine) return null

  const topLine = lines.find(l => l.includes('┌') && (l.includes('×') || l.includes('÷') || l.includes('+') || l.includes('-')))

  const steps: ChainStep[] = []
  const sections = middleLine.split('──→')

  const operationRegex = /[×÷+\-]\s*\d+/g
  const operations: string[] = []

  if (topLine) {
    let match
    while ((match = operationRegex.exec(topLine)) !== null) {
      operations.push(match[0].replace(/\s+/g, ''))
    }
  }

  sections.forEach((section, index) => {
    const valueMatch = section.match(/│\s*(\d+)?\s*│/)
    const value = valueMatch && valueMatch[1] ? parseInt(valueMatch[1], 10) : null

    steps.push({
      value,
      operation: index > 0 && operations[index - 1] ? operations[index - 1] : null,
    })
  })

  if (steps.length < 2) return null

  const answers = calculateChainAnswers(steps)

  return {
    type: 'chain',
    steps,
    answer: answers,
  }
}

/**
 * Calculate all intermediate values for a chain problem
 */
function calculateChainAnswers(steps: ChainStep[]): number[] {
  const answers: number[] = []
  let currentValue = steps[0].value || 0
  answers.push(currentValue)

  for (let i = 1; i < steps.length; i++) {
    const op = steps[i].operation
    if (op) {
      const operator = op[0]
      const operand = parseInt(op.slice(1), 10)

      switch (operator) {
        case '+':
          currentValue = currentValue + operand
          break
        case '-':
          currentValue = currentValue - operand
          break
        case '×':
          currentValue = currentValue * operand
          break
        case '÷':
          currentValue = Math.round((currentValue / operand) * 100) / 100
          break
      }
    }
    answers.push(currentValue)
  }

  return answers
}

/**
 * Parse arithmetic problems like "А) 397 + 71"
 */
function parseArithmeticLine(line: string): ArithmeticProblem[] {
  const problems: ArithmeticProblem[] = []
  const regex = /([А-ЯЁA-Z])\)\s*(\d+\s*[+\-×÷]\s*\d+)/g
  let match

  while ((match = regex.exec(line)) !== null) {
    const label = match[1]
    const expression = match[2].trim()
    const answer = evaluateExpression(expression)

    problems.push({
      type: 'arithmetic',
      label,
      expression,
      answer,
    })
  }

  return problems
}

/**
 * Evaluate a simple math expression
 */
function evaluateExpression(expr: string): number {
  const normalized = expr
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/\s+/g, '')

  const match = normalized.match(/(\d+)([+\-*/])(\d+)/)
  if (match) {
    const a = parseInt(match[1], 10)
    const op = match[2]
    const b = parseInt(match[3], 10)

    switch (op) {
      case '+': return a + b
      case '-': return a - b
      case '*': return a * b
      case '/': return Math.round((a / b) * 100) / 100
    }
  }

  return 0
}

/**
 * Check if line starts with a Roman numeral (puzzle)
 */
function parseRomanNumeral(line: string): { numeral: string; text: string } | null {
  for (const numeral of ROMAN_NUMERALS) {
    const pattern = new RegExp(`^${numeral}\\.\\s*(.+)`)
    const match = line.match(pattern)
    if (match) {
      return { numeral, text: match[1] }
    }
  }
  return null
}

/**
 * Check if line is a word problem (1 × 21. format)
 */
function parseWordProblemLine(line: string): { id: string; text: string } | null {
  const match = line.match(/^(\d+\s*×\s*\d+)\.\s*(.+)/)
  if (match) {
    return { id: match[1].replace(/\s/g, ''), text: match[2] }
  }
  return null
}

/**
 * Check if line has sub-problems (А) ... Б) ... etc.)
 */
function parseSubProblems(line: string): string[] {
  const subProblems: string[] = []
  const regex = /([А-ЯЁA-Z])\)\s*([^А-ЯЁA-Z)]+)/g
  let match

  while ((match = regex.exec(line)) !== null) {
    subProblems.push(`${match[1]}) ${match[2].trim()}`)
  }

  return subProblems
}

/**
 * Check if line is a separator
 */
function isSeparator(line: string): boolean {
  return line.trim().match(/^-{5,}$/) !== null
}

/**
 * Check if line is likely theory text
 */
function isTheoryLine(line: string): boolean {
  // Theory lines are longer explanatory text without problem markers
  if (line.length < 20) return false
  if (line.match(/^[А-ЯЁA-Z]\)/)) return false  // Sub-problem
  if (line.match(/^\d+\s*×\s*\d+\./)) return false  // Exercise number
  if (parseRomanNumeral(line)) return false  // Puzzle
  if (line.match(/^##/)) return false  // Header
  if (line.trim() === '') return false
  if (line.trim() === '```') return false

  // Contains sentence-like structure
  return line.includes('.') || line.includes(',') || line.length > 50
}

/**
 * Parse the full markdown file into a Workbook
 */
export function parseWorkbook(markdown: string): Workbook {
  const lines = markdown.split('\n')
  const pages: Page[] = []
  let currentPage: Page | null = null
  let currentExercise: Exercise | null = null
  let codeBlockLines: string[] = []
  let inCodeBlock = false
  let totalProblems = 0
  let contentBuffer: string[] = []
  let currentChapter: string | undefined = undefined

  // Flush accumulated content as either theory (if in exercise context) or info (if standalone)
  const flushContent = (forceInfo: boolean = false) => {
    if (contentBuffer.length === 0 || !currentPage) return

    const contentText = contentBuffer.join('\n').trim()
    if (contentText.length < 5) {
      contentBuffer = []
      return
    }

    // If we're in an exercise context and it looks like theory, add as theory
    if (currentExercise && !forceInfo) {
      const theoryExercise: Exercise = {
        id: `theory-${currentPage.pageNumber}-${currentPage.exercises.length}`,
        title: '',
        exerciseType: 'theory',
        problems: [{
          type: 'theory',
          text: contentText,
        } as TheoryContent]
      }
      currentPage.exercises.push(theoryExercise)
      totalProblems++
    } else {
      // Otherwise it's info content (title pages, table of contents, etc.)
      const infoExercise: Exercise = {
        id: `info-${currentPage.pageNumber}-${currentPage.exercises.length}`,
        title: '',
        exerciseType: 'info',
        problems: [{
          type: 'info',
          text: contentText,
        } as InfoContent]
      }
      currentPage.exercises.push(infoExercise)
      totalProblems++
    }
    contentBuffer = []
  }

  const flushExercise = () => {
    if (currentExercise && currentExercise.problems.length > 0 && currentPage) {
      currentPage.exercises.push(currentExercise)
    }
    currentExercise = null
  }

  // Save page if it has content
  const savePage = () => {
    if (currentPage) {
      flushContent(true)  // Force remaining content as info
      flushExercise()
      if (currentPage.exercises.length > 0) {
        pages.push(currentPage)
      }
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmedLine = line.trim()

    // Check for page marker: "## Page X"
    if (line.startsWith('## Page ')) {
      savePage()

      const pageNum = parseInt(line.replace('## Page ', ''), 10)
      currentPage = { pageNumber: pageNum, chapter: currentChapter, exercises: [] }
      contentBuffer = []
      continue
    }

    // Skip if no current page yet
    if (!currentPage) continue

    // Handle empty lines - preserve them in content buffer
    if (trimmedLine === '') {
      if (contentBuffer.length > 0) {
        contentBuffer.push('')
      }
      continue
    }

    // Check for chapter marker (Глава X. or Chapter X.) - add to content and set chapter
    const chapterMatch = line.match(/^((?:Глава|Chapter)\s*\d+\..*)/)
    if (chapterMatch) {
      currentChapter = chapterMatch[1]
      currentPage.chapter = currentChapter
      contentBuffer.push(trimmedLine)
      continue
    }

    // Check for exercise marker: "## 1 × 1. Title"
    const exerciseMatch = line.match(/^##\s*(\d+\s*×\s*\d+)\.\s*(.*)/)
    if (exerciseMatch) {
      flushContent(currentExercise === null)  // Info if no exercise context
      flushExercise()

      currentExercise = {
        id: exerciseMatch[1].replace(/\s/g, ''),
        title: exerciseMatch[2].trim(),
        exerciseType: 'problems',
        problems: [],
      }
      continue
    }

    // Handle code blocks (chain diagrams)
    if (trimmedLine === '```') {
      if (inCodeBlock) {
        const chainProblem = parseChainDiagram(codeBlockLines)
        if (chainProblem && currentExercise) {
          currentExercise.problems.push(chainProblem)
          totalProblems++
        }
        codeBlockLines = []
      }
      inCodeBlock = !inCodeBlock
      continue
    }

    if (inCodeBlock) {
      codeBlockLines.push(line)
      continue
    }

    // Skip separators
    if (isSeparator(line)) {
      flushContent(currentExercise === null)
      continue
    }

    // Check for Roman numeral puzzles (VIII., IX., etc.)
    const puzzleMatch = parseRomanNumeral(trimmedLine)
    if (puzzleMatch) {
      flushContent(currentExercise === null)
      flushExercise()

      // Collect multi-line puzzle text
      let puzzleText = puzzleMatch.text
      let j = i + 1
      while (j < lines.length && !isSeparator(lines[j]) && !lines[j].startsWith('## ') && !parseRomanNumeral(lines[j].trim())) {
        if (lines[j].trim()) {
          puzzleText += ' ' + lines[j].trim()
        }
        j++
      }
      i = j - 1  // Adjust loop counter

      const puzzleExercise: Exercise = {
        id: `puzzle-${puzzleMatch.numeral}`,
        title: `Задача ${puzzleMatch.numeral}`,
        exerciseType: 'puzzles',
        problems: [{
          type: 'puzzle',
          id: puzzleMatch.numeral,
          text: puzzleText.trim(),
        } as PuzzleProblem]
      }

      currentPage.exercises.push(puzzleExercise)
      totalProblems++
      continue
    }

    // Parse arithmetic problems (А) 397 + 71 Б) 234 + 297)
    if (line.match(/[А-ЯЁA-Z]\)\s*\d+\s*[+\-×÷]\s*\d+/)) {
      flushContent(currentExercise === null)
      const arithmeticProblems = parseArithmeticLine(line)
      if (currentExercise && arithmeticProblems.length > 0) {
        currentExercise.problems.push(...arithmeticProblems)
        totalProblems += arithmeticProblems.length
      }
      continue
    }

    // Parse word problems (1 × 21. Вычислите...)
    const wordProblem = parseWordProblemLine(trimmedLine)
    if (wordProblem && !line.startsWith('##')) {
      flushContent(currentExercise === null)

      // Collect multi-line word problem + sub-problems
      let fullText = wordProblem.text
      const subProblems: string[] = []
      let j = i + 1

      while (j < lines.length) {
        const nextLine = lines[j].trim()
        if (!nextLine || isSeparator(lines[j]) || lines[j].startsWith('## ') || parseWordProblemLine(nextLine) || parseRomanNumeral(nextLine)) {
          break
        }

        // Check for sub-problems on this line
        const subs = parseSubProblems(nextLine)
        if (subs.length > 0) {
          subProblems.push(...subs)
        } else if (!nextLine.match(/^\d+$/)) {  // Skip lone page numbers
          fullText += ' ' + nextLine
        }
        j++
      }
      i = j - 1

      // Also check original line for sub-problems
      const originalSubs = parseSubProblems(wordProblem.text)
      if (originalSubs.length > 0) {
        subProblems.unshift(...originalSubs)
      }

      const wordProblemObj: WordProblem = {
        type: 'word',
        id: wordProblem.id,
        text: fullText.trim(),
        subProblems: subProblems.length > 0 ? subProblems : undefined,
      }

      // Create exercise for this word problem if not in one
      if (!currentExercise) {
        currentExercise = {
          id: wordProblem.id,
          title: '',
          exerciseType: 'problems',
          problems: [],
        }
      }

      currentExercise.problems.push(wordProblemObj)
      totalProblems++
      continue
    }

    // Check for sub-problem lines (А) 2 ч Б) 5 ч...)
    if (line.match(/^[А-ЯЁA-Z]\)\s*.+/) && currentExercise && currentExercise.problems.length > 0) {
      const lastProblem = currentExercise.problems[currentExercise.problems.length - 1]
      if (lastProblem.type === 'word') {
        const subs = parseSubProblems(line)
        if (subs.length > 0) {
          if (!lastProblem.subProblems) {
            lastProblem.subProblems = []
          }
          lastProblem.subProblems.push(...subs)
        }
      }
      continue
    }

    // Collect any other text content
    contentBuffer.push(trimmedLine)
  }

  // Final save
  savePage()

  return {
    title: 'Задачник по математике для 5 классов',
    pages,
    totalProblems,
  }
}
