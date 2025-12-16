'use client'

import { Box, Text, Card3D } from './atoms'
import { WordProblem as WordProblemType } from '@/lib/data/types'

interface WordProblemProps {
  problem: WordProblemType
}

export function WordProblem({ problem }: WordProblemProps) {
  return (
    <Card3D padding="lg" variant="outlined">
      <Text variant="body" style={{ lineHeight: 1.7 }}>
        {problem.text}
      </Text>

      {problem.subProblems && problem.subProblems.length > 0 && (
        <Box flex direction="col" gap="sm" style={{ marginTop: '16px' }}>
          {problem.subProblems.map((sub, index) => (
            <Text key={index} variant="body" color="muted">
              {sub}
            </Text>
          ))}
        </Box>
      )}
    </Card3D>
  )
}
