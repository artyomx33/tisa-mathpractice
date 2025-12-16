'use client'

import { Problem } from '@/lib/data/types'
import { ChainDiagram } from './ChainDiagram'
import { ArithmeticProblem } from './ArithmeticProblem'
import { WordProblem } from './WordProblem'
import { TheoryDisplay } from './TheoryDisplay'
import { PuzzleDisplay } from './PuzzleDisplay'
import { InfoDisplay } from './InfoDisplay'

interface ProblemDisplayProps {
  problem: Problem
  showAnswer: boolean
}

export function ProblemDisplay({ problem, showAnswer }: ProblemDisplayProps) {
  switch (problem.type) {
    case 'chain':
      return <ChainDiagram problem={problem} showAnswer={showAnswer} />

    case 'arithmetic':
      return <ArithmeticProblem problem={problem} showAnswer={showAnswer} />

    case 'word':
      return <WordProblem problem={problem} />

    case 'theory':
      return <TheoryDisplay theory={problem} />

    case 'puzzle':
      return <PuzzleDisplay puzzle={problem} />

    case 'info':
      return <InfoDisplay info={problem} />

    default:
      return null
  }
}
