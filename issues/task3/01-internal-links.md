# Slice 1 — Internal Goodreads link rewrite (fix_internal_links.py)

Type: AFK
Ready for agent.

## Parent

`site/todo-task3-prd.md` — Review Text Cleanup (Task 3).

## What to build

A script `review_cli/scripts/fix_internal_links.py` (dry-run by default, `--apply` to write)
that rewrites links pointing at Goodreads to the corresponding local review, when a confident
match exists. Built over a pure `goodreads_link_matcher` core using the shared index from
Slice 0.

In scope: Goodreads `/review/show/{id}` and `/book/show/{id}-{slug}` URLs, plus
storygraph/pagebound patterns (none today, future-proofing).

Match strategies, in order: URL slug (for `/book/show/`), normalized anchor text → normalized
title, then fuzzy match. Each match is tagged with a confidence tier:

- **exact** (URL slug == local slug, or normalized anchor == normalized title) → auto-rewritten
  on `--apply`. Only the URL changes to `/{type}/{slug}/`; anchor text is never modified.
- **fuzzy** (similarity ≥ threshold) → logged as *proposed but NOT applied*, with score and
  target (author + title) for manual approval.
- **none** (descriptive phrases, author surnames) → logged as "no local match", left untouched.

After `--apply`: `uv run review validate`, then `cd site/site && npm run build`.

## Acceptance criteria

- [ ] Handles both `/review/show/` and `/book/show/` Goodreads URLs plus storygraph/pagebound patterns.
- [ ] Exact-tier matches auto-rewritten (URL only) to `/{type}/{slug}/` on `--apply`; anchor text untouched.
- [ ] Fuzzy candidates logged with similarity score + target, NOT applied.
- [ ] No-match links logged and left unchanged.
- [ ] Dry-run by default; `--apply` required to write; content dir via `Config.load()`.
- [ ] Durable change log records review + original link with surrounding sentences + new target.
- [ ] Unit tests on `goodreads_link_matcher`: exact slug, exact title, fuzzy-with-score, common-word anchors that must NOT match (e.g. "Distraction", "Firefly"), descriptive/author-surname → none.
- [ ] `uv run review validate` and `npm run build` pass after `--apply`.

## Blocked by

- Slice 0 — Shared foundation (`00-shared-foundation.md`).
