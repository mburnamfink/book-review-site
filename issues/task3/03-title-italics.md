# Slice 3 — Own-title italicization (italicize_titles.py)

Type: AFK
Ready for agent.

## Parent

`site/todo-task3-prd.md` — Review Text Cleanup (Task 3).

## What to build

A script `review_cli/scripts/italicize_titles.py` (dry-run by default, `--apply` to write) that
italicizes each review's **own** book title wherever it appears in that review's body. Built over
a pure `title_italicizer` core plus a `markdown_regions` helper (protected-span detection), using
the shared index from Slice 0.

Matching:
- Candidate = main title (front-matter title truncated at first colon). If the full
  title-with-subtitle appears, italicize the whole span; otherwise the main title.
- Case-sensitive, whole-word/phrase, punctuation normalized (`vs.`↔`vs`, `&`↔`and`, quotes,
  hyphens); italicize **all** occurrences.

Auto-apply when: multi-word (minus a small generic-phrase denylist) **OR** single non-dictionary
word (so *Dune*/*Nova*/*Reamde* apply, *Breath*/*Pet*/*Think* do not) **OR** appears capitalized
mid-sentence and matches a known title. Otherwise → **manual-report** tier (file:line +
surrounding sentence), not auto-changed.

Skip matches already inside emphasis (`*…*`/`_…_`/`**…**`), heading lines, link anchor text,
inline/fenced code, image alt text, and HTML comments (via `markdown_regions`); never double-wrap.

Operational note: recommended to run **after** Slice 1 so titles used as link anchor text are
settled and skipped — this is a usage-order recommendation, not a build blocker.

After `--apply`: `uv run review validate`, then `cd site/site && npm run build`.

## Acceptance criteria

- [ ] Own main title (subtitle stripped) matched case-sensitively, whole-word, punctuation-normalized, all occurrences; full title-with-subtitle span italicized when present.
- [ ] Auto-apply: multi-word (minus denylist), single non-dictionary word, or mid-sentence-capitalized common-word title.
- [ ] Manual-report tier for the residue (e.g. common-word title only at a sentence start), with file:line + context.
- [ ] Protected regions skipped; no double-wrap.
- [ ] Partial-title trap avoided (e.g. "Baa Baa Black Sheep" never matches the standalone "Black Sheep").
- [ ] Dry-run by default; `--apply` required; content dir via `Config.load()`; durable change log.
- [ ] Unit tests on `title_italicizer` + `markdown_regions`: multi-word apply, Dune applies, Breath/Pet suppressed at sentence start but applied mid-sentence, region skipping, no double-wrap, punctuation normalization.
- [ ] `uv run review validate` and `npm run build` pass after `--apply`.

## Blocked by

- Slice 0 — Shared foundation (`00-shared-foundation.md`).
