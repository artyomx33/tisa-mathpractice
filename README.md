# Math Workbook (Задачник по математике)

An interactive web application for practicing math problems from the School 57 (Moscow) Grade 5 workbook.

## Features

- Interactive math problem solving
- Chain calculation diagrams (fill-in-the-blank arithmetic chains)
- Column arithmetic problems (addition/subtraction)
- Word problems and puzzles
- Theory sections with explanations
- Navigation through workbook pages and exercises
- Russian language support

## Tech Stack

- Next.js 16
- React
- TypeScript
- Tailwind CSS

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Make sure the workbook file exists at the project root:
```
FIRST_RUN_TEST_5-57.md
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
  app/           # Next.js app router
  components/    # React components
    atoms/       # Small reusable components
  lib/
    data/        # Workbook parser
scripts/
  translate_book.py  # Translation utility
TODO/
  Math book.md           # Original Russian workbook
  math book_english.md   # English translation
```

## Workbook Format

The workbook is parsed from a markdown file with specific formatting:
- `## Page N` - Page breaks
- `## N × M. Title` - Exercise headers
- Code blocks with box diagrams for chain problems
- Labeled arithmetic problems (А, Б, В, etc.)
