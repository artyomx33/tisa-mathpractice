#!/usr/bin/env python3
"""
Translate Russian math workbook to English using Claude API.

Usage:
    export ANTHROPIC_API_KEY=your_key_here
    python scripts/translate_book.py

Features:
    - Smart translation: preserves ASCII diagrams, math, numbers
    - Progress tracking with percentage display
    - Checkpointing: can resume from where it left off
    - Rate limiting to avoid API throttling
"""

import os
import re
import sys
import time
import json
from pathlib import Path

try:
    from anthropic import Anthropic
except ImportError:
    print("Error: anthropic package not installed.")
    print("Install it with: pip install anthropic")
    sys.exit(1)

# Configuration
INPUT_FILE = "TODO/math book.md"
OUTPUT_FILE = "TODO/math book_english.md"
CHECKPOINT_FILE = "TODO/.translation_checkpoint.json"
MODEL = "claude-sonnet-4-20250514"
DELAY_BETWEEN_CALLS = 0.5  # seconds between API calls

TRANSLATION_PROMPT = """You are translating a Russian math textbook to English.

CRITICAL RULES:
1. Translate all Russian text to natural, clear English
2. PRESERVE EXACTLY (do not modify at all):
   - All ASCII art diagrams (boxes with ┌────┐, │, └────┘, arrows ──→, etc.)
   - All mathematical expressions, numbers, and formulas
   - All markdown formatting (##, ```, etc.)
   - All spacing and line breaks within code blocks
3. Convert Cyrillic letters used as problem labels to Latin equivalents:
   А→A, Б→B, В→C, Г→D, Д→E, Е→F, Ё→G, Ж→H, З→I, И→J, Й→K, К→L, Л→M, М→N, Н→O, О→P, П→Q, Р→R, С→S, Т→T, У→U, Ф→V, Х→W, Ц→X, Ч→Y, Ш→Z
4. Keep the "## Page X" headers exactly as they are

Return ONLY the translated content. Do not add any explanations or commentary."""


def load_book(path: str) -> list[str]:
    """Load and split book into pages."""
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split by page markers, keeping the marker with each page
    pages = re.split(r'(?=## Page \d+)', content)

    # Filter out empty pages
    pages = [p.strip() for p in pages if p.strip()]

    return pages


def translate_page(client: Anthropic, page: str, page_num: int, total: int) -> str:
    """Translate a single page using Claude."""

    # Skip nearly empty pages (just "## Page X" with whitespace)
    if len(page.strip()) < 20:
        return page

    try:
        response = client.messages.create(
            model=MODEL,
            max_tokens=4096,
            messages=[
                {
                    "role": "user",
                    "content": f"{TRANSLATION_PROMPT}\n\n---\n\nContent to translate:\n\n{page}"
                }
            ]
        )

        translated = response.content[0].text
        return translated

    except Exception as e:
        print(f"\nError translating page {page_num}: {e}")
        print("Returning original page content...")
        return page


def save_checkpoint(page_num: int, translated: list[str], checkpoint_path: str):
    """Save progress for resume capability."""
    checkpoint = {
        "last_completed_page": page_num,
        "translated_pages": translated
    }
    with open(checkpoint_path, 'w', encoding='utf-8') as f:
        json.dump(checkpoint, f, ensure_ascii=False, indent=2)


def load_checkpoint(checkpoint_path: str) -> tuple[int, list[str]]:
    """Load previous progress if exists."""
    if not os.path.exists(checkpoint_path):
        return -1, []

    try:
        with open(checkpoint_path, 'r', encoding='utf-8') as f:
            checkpoint = json.load(f)
        return checkpoint["last_completed_page"], checkpoint["translated_pages"]
    except (json.JSONDecodeError, KeyError):
        return -1, []


def main():
    """Main translation loop with progress tracking."""

    # Check for API key
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("Error: ANTHROPIC_API_KEY environment variable not set.")
        print("Set it with: export ANTHROPIC_API_KEY=your_key_here")
        sys.exit(1)

    # Initialize client
    client = Anthropic(api_key=api_key)

    # Resolve paths relative to script location
    script_dir = Path(__file__).parent.parent
    input_path = script_dir / INPUT_FILE
    output_path = script_dir / OUTPUT_FILE
    checkpoint_path = script_dir / CHECKPOINT_FILE

    # Load book
    print(f"Loading book from {input_path}...")
    pages = load_book(input_path)
    total_pages = len(pages)
    print(f"Found {total_pages} pages to translate.\n")

    # Check for existing checkpoint
    start_page, translated_pages = load_checkpoint(checkpoint_path)

    if start_page >= 0:
        print(f"Resuming from checkpoint: {start_page + 1}/{total_pages} pages completed")
        print(f"Continuing from page {start_page + 2}...\n")
    else:
        start_page = -1
        translated_pages = []

    # Translate each page
    start_time = time.time()

    for i, page in enumerate(pages):
        # Skip already translated pages
        if i <= start_page:
            continue

        # Progress display
        progress = (i + 1) / total_pages * 100
        elapsed = time.time() - start_time

        if i > start_page + 1:
            pages_done = i - start_page - 1
            avg_time = elapsed / pages_done
            remaining = (total_pages - i - 1) * avg_time
            eta_min = int(remaining // 60)
            eta_sec = int(remaining % 60)
            eta_str = f" | ETA: {eta_min}m {eta_sec}s"
        else:
            eta_str = ""

        print(f"\rTranslating page {i + 1}/{total_pages} ({progress:.1f}%){eta_str}    ", end="", flush=True)

        # Translate
        translated = translate_page(client, page, i + 1, total_pages)
        translated_pages.append(translated)

        # Save checkpoint every 5 pages
        if (i + 1) % 5 == 0:
            save_checkpoint(i, translated_pages, checkpoint_path)

        # Rate limiting
        time.sleep(DELAY_BETWEEN_CALLS)

    print("\n\nTranslation complete!")

    # Combine and save
    print(f"Saving to {output_path}...")
    full_content = "\n\n".join(translated_pages)

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(full_content)

    # Clean up checkpoint
    if os.path.exists(checkpoint_path):
        os.remove(checkpoint_path)
        print("Checkpoint file cleaned up.")

    # Stats
    elapsed = time.time() - start_time
    print(f"\nDone! Translated {total_pages} pages in {elapsed/60:.1f} minutes.")
    print(f"Output saved to: {output_path}")


if __name__ == "__main__":
    main()
