import { PracticePage } from '@/components/PracticePage'
import { parseWorkbook } from '@/lib/data/parser'
import { readFileSync } from 'fs'
import { join } from 'path'

export default function Home() {
  // Read and parse both workbooks on the server
  const russianPath = join(process.cwd(), 'FIRST_RUN_TEST_5-57.md')
  const englishPath = join(process.cwd(), 'WORKBOOK_ENGLISH.md')

  const russianMarkdown = readFileSync(russianPath, 'utf-8')
  const englishMarkdown = readFileSync(englishPath, 'utf-8')

  const russianWorkbook = parseWorkbook(russianMarkdown)
  const englishWorkbook = parseWorkbook(englishMarkdown)

  return (
    <PracticePage
      workbooks={{
        russian: russianWorkbook,
        english: englishWorkbook,
      }}
    />
  )
}
