import { ChainProblem, ArithmeticProblem, Problem } from '@/lib/data/types'

/**
 * Generate random integer between min and max (inclusive)
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Pick a random element from an array
 */
function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

/**
 * Generate a chain calculation problem similar to the reference
 */
export function generateChainProblem(reference: ChainProblem): ChainProblem {
  const numSteps = reference.steps.length
  const operations = reference.steps.slice(1).map(s => s.operation?.[0] || '+')

  // Analyze the reference to understand the difficulty level
  const startValue = reference.steps[0].value || 50
  const startRange = [
    Math.max(10, Math.floor(startValue * 0.5)),
    Math.floor(startValue * 1.5)
  ]

  // Generate a valid chain that produces whole numbers
  let attempts = 0
  const maxAttempts = 100

  while (attempts < maxAttempts) {
    attempts++
    const steps: ChainProblem['steps'] = []
    let currentValue = randomInt(startRange[0], startRange[1])

    // Make sure starting value works well with divisions
    if (operations.includes('÷')) {
      // Pick a starting value that's divisible by common numbers
      const divisors = [2, 3, 4, 5, 6, 8, 10]
      currentValue = randomPick(divisors) * randomInt(5, 20)
    }

    steps.push({ value: currentValue, operation: null })
    let valid = true

    for (let i = 0; i < operations.length; i++) {
      const op = operations[i]
      let operand: number = 10
      let newValue: number = currentValue

      switch (op) {
        case '+':
          operand = randomInt(10, 50)
          newValue = currentValue + operand
          break
        case '-':
          operand = randomInt(5, Math.min(40, currentValue - 5))
          if (operand <= 0) {
            valid = false
            continue
          }
          newValue = currentValue - operand
          break
        case '×':
          operand = randomInt(2, 9)
          newValue = currentValue * operand
          break
        case '÷': {
          // Find a valid divisor
          const possibleDivisors = [2, 3, 4, 5, 6, 8, 10].filter(d => currentValue % d === 0 && currentValue / d >= 1)
          if (possibleDivisors.length === 0) {
            valid = false
            continue
          }
          operand = randomPick(possibleDivisors)
          newValue = currentValue / operand
          break
        }
        default:
          operand = 10
          newValue = currentValue
      }

      if (!valid || newValue < 0 || newValue > 10000 || !Number.isInteger(newValue)) {
        valid = false
        break
      }

      steps.push({
        value: null,
        operation: `${op}${operand}`,
      })
      currentValue = newValue
    }

    if (valid && steps.length === numSteps) {
      // Calculate answers
      const answers = calculateChainAnswers(steps)
      return {
        type: 'chain',
        steps,
        answer: answers,
      }
    }
  }

  // Fallback: return a simple chain if generation fails
  return generateSimpleChain(numSteps)
}

/**
 * Calculate answers for a chain problem
 */
function calculateChainAnswers(steps: ChainProblem['steps']): number[] {
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
          currentValue = currentValue / operand
          break
      }
    }
    answers.push(currentValue)
  }

  return answers
}

/**
 * Generate a simple chain as fallback
 */
function generateSimpleChain(numSteps: number): ChainProblem {
  const start = randomInt(20, 50) * 2 // Even number for easy division
  const steps: ChainProblem['steps'] = [{ value: start, operation: null }]

  const simpleOps = ['+10', '-5', '×2', '÷2', '+20', '-10']
  let current = start

  for (let i = 1; i < numSteps; i++) {
    const op = randomPick(simpleOps)
    const operator = op[0]
    const operand = parseInt(op.slice(1), 10)

    // Check if operation is valid
    if (operator === '÷' && current % operand !== 0) {
      steps.push({ value: null, operation: '+10' })
      current += 10
    } else if (operator === '-' && current - operand < 0) {
      steps.push({ value: null, operation: '+10' })
      current += 10
    } else {
      steps.push({ value: null, operation: op })
      switch (operator) {
        case '+': current += operand; break
        case '-': current -= operand; break
        case '×': current *= operand; break
        case '÷': current /= operand; break
      }
    }
  }

  return {
    type: 'chain',
    steps,
    answer: calculateChainAnswers(steps),
  }
}

/**
 * Generate an arithmetic problem similar to the reference
 */
export function generateArithmeticProblem(reference: ArithmeticProblem, label: string): ArithmeticProblem {
  const expr = reference.expression
  const match = expr.match(/(\d+)\s*([+\-×÷])\s*(\d+)/)

  if (!match) {
    return {
      type: 'arithmetic',
      label,
      expression: `${randomInt(100, 999)} + ${randomInt(10, 99)}`,
      answer: 0, // Will be calculated
    }
  }

  const num1 = parseInt(match[1], 10)
  const operator = match[2]
  const num2 = parseInt(match[3], 10)

  // Determine digit ranges from reference
  const digits1 = num1.toString().length
  const digits2 = num2.toString().length

  const min1 = Math.pow(10, digits1 - 1)
  const max1 = Math.pow(10, digits1) - 1
  const min2 = Math.pow(10, digits2 - 1)
  const max2 = Math.pow(10, digits2) - 1

  let newNum1 = randomInt(min1, max1)
  let newNum2 = randomInt(min2, max2)

  // For subtraction, ensure result is positive
  if (operator === '-' && newNum1 < newNum2) {
    [newNum1, newNum2] = [newNum2, newNum1]
  }

  // For division, ensure clean division
  if (operator === '÷') {
    newNum2 = randomPick([2, 3, 4, 5, 6, 8, 9, 10])
    newNum1 = newNum2 * randomInt(min1 / newNum2, max1 / newNum2)
  }

  const expression = `${newNum1} ${operator} ${newNum2}`
  const answer = evaluateExpression(expression)

  return {
    type: 'arithmetic',
    label,
    expression,
    answer,
  }
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
      case '/': return Math.floor(a / b)
    }
  }

  return 0
}

/**
 * Generate 10 practice problems based on a reference problem
 */
export function generatePracticeProblems(reference: Problem, count: number = 10): Problem[] {
  const problems: Problem[] = []
  const labels = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З', 'И', 'К', 'Л', 'М', 'Н', 'О', 'П']

  for (let i = 0; i < count; i++) {
    if (reference.type === 'chain') {
      problems.push(generateChainProblem(reference))
    } else if (reference.type === 'arithmetic') {
      problems.push(generateArithmeticProblem(reference, labels[i] || String(i + 1)))
    }
  }

  return problems
}

/**
 * Generate practice problems based on an exercise's problems
 */
export function generatePracticeFromExercise(problems: Problem[], count: number = 10): Problem[] {
  const result: Problem[] = []
  const labels = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З', 'И', 'К']

  // Find the types of problems in the exercise
  const chainProblems = problems.filter(p => p.type === 'chain') as ChainProblem[]
  const arithmeticProblems = problems.filter(p => p.type === 'arithmetic') as ArithmeticProblem[]

  if (chainProblems.length > 0) {
    // Generate chain problems
    for (let i = 0; i < count; i++) {
      const reference = randomPick(chainProblems)
      result.push(generateChainProblem(reference))
    }
  } else if (arithmeticProblems.length > 0) {
    // Generate arithmetic problems
    for (let i = 0; i < count; i++) {
      const reference = randomPick(arithmeticProblems)
      result.push(generateArithmeticProblem(reference, labels[i]))
    }
  }

  return result
}
