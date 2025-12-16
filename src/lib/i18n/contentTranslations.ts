import { Language } from './translations'

// Map of Russian content to translations
// This allows dynamic translation of content from the markdown file
const contentMap: Record<string, Record<Language, string>> = {
  // Exercise titles
  'Выполните действия:': {
    ru: 'Выполните действия:',
    en: 'Perform the operations:',
  },
  'Выполните сложение и вычитание в столбик:': {
    ru: 'Выполните сложение и вычитание в столбик:',
    en: 'Addition and subtraction (column method):',
  },
  'Выполните умножение в столбик:': {
    ru: 'Выполните умножение в столбик:',
    en: 'Multiplication (column method):',
  },
  'Выполните деление в столбик:': {
    ru: 'Выполните деление в столбик:',
    en: 'Division (column method):',
  },
  'Выполните деление:': {
    ru: 'Выполните деление:',
    en: 'Perform division:',
  },
  'Выполните умножение:': {
    ru: 'Выполните умножение:',
    en: 'Perform multiplication:',
  },
  'Вычислите:': {
    ru: 'Вычислите:',
    en: 'Calculate:',
  },
  'Решите уравнение:': {
    ru: 'Решите уравнение:',
    en: 'Solve the equation:',
  },
  'Решите уравнения:': {
    ru: 'Решите уравнения:',
    en: 'Solve the equations:',
  },
  'Найдите значение выражения:': {
    ru: 'Найдите значение выражения:',
    en: 'Find the value of the expression:',
  },
  'Упростите выражение:': {
    ru: 'Упростите выражение:',
    en: 'Simplify the expression:',
  },
  'Сравните:': {
    ru: 'Сравните:',
    en: 'Compare:',
  },
  'Найдите:': {
    ru: 'Найдите:',
    en: 'Find:',
  },
  'Запишите в виде десятичной дроби:': {
    ru: 'Запишите в виде десятичной дроби:',
    en: 'Write as a decimal:',
  },
  'Запишите в виде обыкновенной дроби:': {
    ru: 'Запишите в виде обыкновенной дроби:',
    en: 'Write as a fraction:',
  },
  'Выразите в указанных единицах:': {
    ru: 'Выразите в указанных единицах:',
    en: 'Express in the given units:',
  },
  'Выполните сложение:': {
    ru: 'Выполните сложение:',
    en: 'Perform addition:',
  },
  'Выполните вычитание:': {
    ru: 'Выполните вычитание:',
    en: 'Perform subtraction:',
  },

  // Chapter titles
  'Глава 1. Арифметика натуральных чисел': {
    ru: 'Глава 1. Арифметика натуральных чисел',
    en: 'Chapter 1. Arithmetic of Natural Numbers',
  },
  'Глава 2. Делимость натуральных чисел': {
    ru: 'Глава 2. Делимость натуральных чисел',
    en: 'Chapter 2. Divisibility of Natural Numbers',
  },
  'Глава 3. Обыкновенные дроби': {
    ru: 'Глава 3. Обыкновенные дроби',
    en: 'Chapter 3. Common Fractions',
  },
  'Глава 4. Десятичные дроби': {
    ru: 'Глава 4. Десятичные дроби',
    en: 'Chapter 4. Decimal Fractions',
  },

  // Common words in problems
  'Задачник по математике для 5 классов': {
    ru: 'Задачник по математике для 5 классов',
    en: 'Math Workbook for 5th Grade',
  },
  'Содержание': {
    ru: 'Содержание',
    en: 'Contents',
  },
  'Ответы': {
    ru: 'Ответы',
    en: 'Answers',
  },
}

// Partial matches for patterns
const partialPatterns: Array<{ pattern: RegExp; translations: Record<Language, string> }> = [
  {
    pattern: /^Глава\s*(\d+)\.\s*(.+)$/,
    translations: {
      ru: 'Глава $1. $2',
      en: 'Chapter $1. $2',
    },
  },
]

/**
 * Translate content text based on current language
 * Returns the original text if no translation is found
 */
export function translateContent(text: string, language: Language): string {
  // Check exact match first
  if (contentMap[text]) {
    return contentMap[text][language]
  }

  // Check partial patterns
  for (const { pattern, translations } of partialPatterns) {
    const match = text.match(pattern)
    if (match) {
      // For now, just use the pattern replacement for chapter detection
      if (pattern.source.includes('Глава') && language === 'en') {
        return text.replace(/^Глава/, 'Chapter')
      }
    }
  }

  // If language is Russian, return as-is (it's the source language)
  if (language === 'ru') {
    return text
  }

  // For English, try to translate common patterns
  return translateCommonPatterns(text, language)
}

/**
 * Translate common patterns that may not be in the exact map
 */
function translateCommonPatterns(text: string, language: Language): string {
  if (language !== 'en') return text

  let result = text

  // Chapter pattern
  result = result.replace(/^Глава\s*(\d+)\./, 'Chapter $1.')

  // Common verbs
  result = result.replace(/Вычислите/g, 'Calculate')
  result = result.replace(/Выполните/g, 'Perform')
  result = result.replace(/Найдите/g, 'Find')
  result = result.replace(/Решите/g, 'Solve')
  result = result.replace(/Сравните/g, 'Compare')
  result = result.replace(/Упростите/g, 'Simplify')
  result = result.replace(/Запишите/g, 'Write')

  // Common nouns
  result = result.replace(/действия/g, 'operations')
  result = result.replace(/уравнение/g, 'equation')
  result = result.replace(/уравнения/g, 'equations')
  result = result.replace(/выражение/g, 'expression')
  result = result.replace(/выражения/g, 'expressions')
  result = result.replace(/значение/g, 'value')
  result = result.replace(/сложение/g, 'addition')
  result = result.replace(/вычитание/g, 'subtraction')
  result = result.replace(/умножение/g, 'multiplication')
  result = result.replace(/деление/g, 'division')
  result = result.replace(/в столбик/g, '(column method)')
  result = result.replace(/дроби/g, 'fractions')
  result = result.replace(/дробь/g, 'fraction')
  result = result.replace(/десятичной/g, 'decimal')
  result = result.replace(/обыкновенной/g, 'common')

  return result
}
