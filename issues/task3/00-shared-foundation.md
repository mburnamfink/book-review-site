# Slice 0 — Shared foundation: normalise, title/slug index, change log

Type: AFK
Ready for agent.

## Parent

`site/todo-task3-prd.md` — Review Text Cleanup (Task 3).

## What to build

The shared, dependency-free core that the three cleanup scripts all build on:

1. **`normalise(title)`** — promote the existing helper (currently in
   `review_cli/archive/diff_year.py`) into a real, importable shared module. Normalizes a title
   for matching: case-fold, strip punctuation/diacritics, collapse whitespace, and the
   equivalences used across the corpus (`vs.`↔`vs`, `&`↔`and`, straight/curly quotes, hyphens).
2. **Title/slug index** — walk every review under the content dir (resolved via `Config.load()`,
   currently `site/content/reviews/`) and build an index mapping both normalized title and slug →
   `(type, slug, author, title)`. This is the lookup used by the link matcher and the italicizer.
3. **`change_log`** — a durable, human-readable change-log writer shared by all three scripts.
   Each entry records: the review changed, the original text with a few surrounding sentences,
   and the change made (e.g. new target = author + title). Writes a re-readable log file, not
   just stdout.

Pure library code — no CLI of its own. The three feature slices import it.

## Acceptance criteria

- [ ] `normalise` lives in a shared importable module and is no longer only in `archive/`.
- [ ] Index builds from all review types (book/audiobook/rpg) and resolves the content dir via `Config.load()`.
- [ ] Index lookups by normalized title and by slug both return `(type, slug, author, title)`.
- [ ] `change_log` produces a durable human-readable file with review + original-text-with-context + change.
- [ ] Unit tests cover `normalise` equivalences and index lookup hits/misses (pytest, matching `review_cli/tests/` style).

## Blocked by

None - can start immediately.
