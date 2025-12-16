export type Language = 'en' | 'ru'

export const translations = {
  en: {
    // App title
    appTitle: 'Math Grade 5',
    appDescription: 'Math workbook for 5th grade',

    // Navigation
    back: '← Back',
    next: 'Next →',
    showAnswer: 'Show Answer',
    hideAnswer: 'Hide Answer',

    // Progress
    problem: 'Problem',
    of: 'of',
    page: 'Page',
    solved: 'Solved',
    exercise: 'Exercise',

    // Keyboard hints
    keyboardNav: '← → navigation',
    keyboardAnswer: 'Enter — answer',
    keyboardNext: 'Space — next',

    // Exercise titles
    performOperations: 'Perform the operations:',
    additionSubtractionColumn: 'Perform addition and subtraction (column method):',
    multiplicationColumn: 'Perform multiplication (column method):',
    divisionColumn: 'Perform division (column method):',

    // Section complete
    sectionComplete: 'Section Complete!',
    youFinished: 'You finished',
    problemsCompleted: 'problems completed',
    practiceMore: 'Practice More (+10)',
    continueNext: 'Continue to Next Section',
    generatingProblems: 'Generating problems...',

    // Language selector
    selectLanguage: 'Select Language',
    language: 'Language',

    // Problem types
    chainCalculations: 'Chain Calculations',
    arithmetic: 'Arithmetic',
    wordProblems: 'Word Problems',

    // Theory & Puzzles
    theorySection: 'Theory',
    readAndContinue: 'Read the material above and continue to the next problem',
    puzzleProblem: 'Puzzle',
    thinkAboutIt: 'Think about it!',
    puzzleHint: 'This is a puzzle to solve on your own. Mark as done when finished!',
    markAsDone: 'Mark as Done',

    // Settings
    settings: 'Settings',
    resetProgress: 'Reset Progress',
    confirmReset: 'Are you sure? This will reset all progress.',

    // Navigation Menu
    contents: 'Contents',
    introduction: 'Introduction',
    infoPage: 'Info',
    completed: 'completed',

    // Show All in Segment
    showAll: 'All',
    showOne: 'One',
    inSegment: 'in section',
    question: 'Question',

    // Workbook Selection
    selectWorkbook: 'Select Workbook',
    workbookRussian: 'Russian Edition',
    workbookEnglish: 'English Edition',
    switchWorkbookWarning: 'Switching workbooks will reset your progress. Continue?',
  },

  ru: {
    // App title
    appTitle: 'Математика 5 класс',
    appDescription: 'Задачник по математике для пятых классов',

    // Navigation
    back: '← Назад',
    next: 'Дальше →',
    showAnswer: 'Показать ответ',
    hideAnswer: 'Скрыть ответ',

    // Progress
    problem: 'Задача',
    of: 'из',
    page: 'Страница',
    solved: 'Решено',
    exercise: 'Упражнение',

    // Keyboard hints
    keyboardNav: '← → навигация',
    keyboardAnswer: 'Enter — ответ',
    keyboardNext: 'Пробел — дальше',

    // Exercise titles
    performOperations: 'Выполните действия:',
    additionSubtractionColumn: 'Выполните сложение и вычитание в столбик:',
    multiplicationColumn: 'Выполните умножение в столбик:',
    divisionColumn: 'Выполните деление в столбик:',

    // Section complete
    sectionComplete: 'Раздел завершён!',
    youFinished: 'Вы закончили',
    problemsCompleted: 'задач выполнено',
    practiceMore: 'Ещё задачи (+10)',
    continueNext: 'Продолжить дальше',
    generatingProblems: 'Генерация задач...',

    // Language selector
    selectLanguage: 'Выберите язык',
    language: 'Язык',

    // Problem types
    chainCalculations: 'Цепочки вычислений',
    arithmetic: 'Арифметика',
    wordProblems: 'Текстовые задачи',

    // Theory & Puzzles
    theorySection: 'Теория',
    readAndContinue: 'Прочитайте материал выше и продолжайте к следующей задаче',
    puzzleProblem: 'Головоломка',
    thinkAboutIt: 'Подумайте!',
    puzzleHint: 'Это задача для самостоятельного решения. Отметьте как выполненную, когда закончите!',
    markAsDone: 'Отметить как выполненную',

    // Settings
    settings: 'Настройки',
    resetProgress: 'Сбросить прогресс',
    confirmReset: 'Вы уверены? Весь прогресс будет сброшен.',

    // Navigation Menu
    contents: 'Содержание',
    introduction: 'Введение',
    infoPage: 'Информация',
    completed: 'выполнено',

    // Show All in Segment
    showAll: 'Все',
    showOne: 'По одной',
    inSegment: 'в разделе',
    question: 'Вопрос',

    // Workbook Selection
    selectWorkbook: 'Выбор задачника',
    workbookRussian: 'Русское издание',
    workbookEnglish: 'Английское издание',
    switchWorkbookWarning: 'Смена задачника сбросит ваш прогресс. Продолжить?',
  },
} as const

export type TranslationKey = keyof typeof translations.en
